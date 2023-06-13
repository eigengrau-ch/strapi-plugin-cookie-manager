
// React
import React, { useState } from "react"
import { useIntl } from "react-intl"

// Strapi
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system/Dialog"
import { Stack } from "@strapi/design-system/Stack"
import { Switch } from "@strapi/design-system/Switch"
import Trash from "@strapi/icons/Trash"
import { Flex } from "@strapi/design-system/Flex"
import ExclamationMarkCircle from "@strapi/icons/ExclamationMarkCircle"
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  Textarea,
  Box
} from "@strapi/design-system"

// Components
import RepeatableComponent from "../RepeatableComponent"

// Lodash
import { isEmpty, isNull, omit, first } from "lodash"

// Utils
import { getTrad } from "../../utils"

// Validation Schema
import validationSchema from "./validation"
import componentSchema from "../../../../server/components/cookie-button.json"

const Modal = ({ setShowModal, crudAction, locale = null, popup = {} }) => {

  const { formatMessage } = useIntl()
  const isUpdate = (popup["id"] !== undefined)
  const isDuplicate = ((popup["id"] === undefined) && (Object.keys(popup).length > 0))
  const buttonMin = 1
  const buttonMax = 3

  const [id] = useState(popup.id || null)
  const [title, setTitle] = useState(popup.title || "")
  const [description, setDescription] = useState(popup.description || "")
  const [buttons, setButtons] = useState(popup.buttons || [])

  const [titleValidation, setTitleValidation] = useState([])
  const [descriptionValidation, setDescriptionValidation] = useState([])
  const [buttonsValidation, setButtonsValidation] = useState([])
  const [hasCustomizability, setHasCustomizability] = useState(popup.hasCustomizability || false)

  const [childrensValidated, setChildrensValidated] = useState([])
  const [childrenIsValid, setChildrenIsValid] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsSubmit(true)

    if (await validateFields() && childrenIsValid) {
      const initialButtons = !isEmpty(popup.buttons) ? popup.buttons : []

      const fields = {
        title: title,
        description: description,
        buttons: buttons.map(obj => {
          if (!initialButtons.some(o => (o.id === obj.id))) return omit(obj, "id")
          return obj
        }),
        hasCustomizability: hasCustomizability,
        locale: locale
      }

      try {
        await crudAction((id) ? { id: id, ...fields } : { ...fields })
        setShowModal(false)
      } catch (e) {
        console.log("error", e)
      }
    } else { setIsSubmit(false) }
  }

  const handleValidation = async (field, setValueValidation) => {
    const key = Object.keys(field)[0]
    const result = await validateField(field, key)
    const isValid = isNull(result) ? [] : result

    setValueValidation(isValid)
  }

  const validateField = async (field, key) => {
    return await validationSchema(formatMessage, buttonMin, buttonMax, (buttons.length > 0))
      .validateAt(key, field)
      .then(() => null)
      .catch((err) => err.errors)
  }

  const validateFields = async () => {
    const fields = {
      title: title,
      description: description,
      buttons: buttons,
    }

    const validationSuccess = await validationSchema(formatMessage, buttonMin, buttonMax, (buttons.length > 0)).isValid(fields).then((valid) => valid)

    if (!validationSuccess) {
      setTitleValidation(await validateField({ title: title }, "title"))
      setDescriptionValidation(await validateField({ description: description }, "description"))
      setButtonsValidation(await validateField({ buttons: buttons }, "buttons"))
    }

    return validationSuccess
  }

  return (
    <ModalLayout
      onClose={() => setShowModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {(isDuplicate) ? (
            formatMessage({
              id: getTrad("modal.popup.form.header.title.duplicate"),
              defaultMessage: "Duplicate Popup"
            })
          ) : (
            (isUpdate)
              ? formatMessage({
                id: getTrad("modal.popup.form.header.title.update"),
                defaultMessage: "Update Popup"
              })
              : formatMessage({
                id: getTrad("modal.popup.form.header.title.create"),
                defaultMessage: "Create new Popup"
              })
          )}
        </Typography>
      </ModalHeader>

      <ModalBody>
        <Box>
          <TextInput
            label={formatMessage({
              id: getTrad("modal.popup.form.field.title.label"),
              defaultMessage: "Title"
            })}
            required
            name="title"
            error={first(titleValidation)}
            onChange={e => {
              handleValidation({ title: e.target.value }, setTitleValidation, titleValidation)
              setTitle(e.target.value)
            }}
            value={title}
          />
        </Box>
        <Box paddingTop={4}>
          <Textarea
            label={formatMessage({
              id: getTrad("modal.popup.form.field.description.label"),
              defaultMessage: "Description"
            })}
            name="description"
            error={first(descriptionValidation)}
            onChange={e => {
              handleValidation({ description: e.target.value }, setDescriptionValidation, descriptionValidation)
              setDescription(e.target.value)
            }}
            value={description}
          />
        </Box>
        <Box paddingTop={4}>
          <RepeatableComponent
            label={formatMessage({
              id: getTrad("modal.popup.form.field.buttons.label"),
              defaultMessage: "Buttons"
            })}
            entries={buttons}
            setEntries={setButtons}
            schema={componentSchema}
            isValid={childrenIsValid}
            setIsValid={setChildrenIsValid}
            childrensValidated={childrensValidated}
            setChildrensValidated={setChildrensValidated}
            isSubmit={isSubmit}
            setIsSubmit={setIsSubmit}
            max={buttonMax}
            error={first(buttonsValidation)}
          />
        </Box>
        <Box paddingTop={4}>
          <Flex direction="column" alignItems="flex-start">
            <Typography variant="pi" fontWeight="bold">
              {formatMessage({
                id: getTrad("modal.popup.form.field.hasCustomizability.label"),
                defaultMessage: "Has Customizability"
              })}
            </Typography>
            <Box paddingTop={1}>
              <Typography variant="pi" style={{ color: "#666687" }}>
                {formatMessage({
                  id: getTrad("modal.popup.form.field.hasCustomizability.hint"),
                  defaultMessage: "Activate when this popup contains the customizable cookies"
                })}
              </Typography>
            </Box>
            <Box paddingTop={1}>
              <Switch
                label={formatMessage({
                  id: getTrad("modal.popup.form.field.hasCustomizability.label"),
                  defaultMessage: "Has Customizability"
                })}
                name="has-customizability"
                selected={hasCustomizability}
                onChange={() => setHasCustomizability(s => !s)}
              />
            </Box>
          </Flex>
        </Box>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            {formatMessage({
              id: getTrad("modal.popup.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endActions={
          (isDuplicate) ? (
            <Button type="submit">
              {formatMessage({
                id: getTrad("modal.popup.form.cta.duplicate"),
                defaultMessage: "Duplicate Popup"
              })}
            </Button>
          ) : (
            (isUpdate)
              ? <Button type="submit">
                {formatMessage({
                  id: getTrad("modal.popup.form.cta.update"),
                  defaultMessage: "Update Popup"
                })}
              </Button>
              : <Button type="submit">
                {formatMessage({
                  id: getTrad("modal.popup.form.cta.create"),
                  defaultMessage: "Create new Popup"
                })}
              </Button>
          )
        }
      />
    </ModalLayout>
  )
}

const CreatePopupModal = ({ setShowModal, createPopup, locale }) => <Modal setShowModal={setShowModal} crudAction={createPopup} locale={locale} />

const UpdatePopupModal = ({ setShowModal, updatePopup, popup }) => <Modal setShowModal={setShowModal} crudAction={updatePopup} popup={popup} />

const DuplicatePopupModal = ({ setShowModal, createPopup, popup, locale }) => <Modal setShowModal={setShowModal} crudAction={createPopup} popup={omit(popup, "id")} locale={locale} />

const DeletePopupModal = ({ setShowModal, deletePopup, popup, showModal = false }) => {
  const { formatMessage } = useIntl()

  return (
    <Dialog
      onClose={() => setShowModal(false)}
      title={formatMessage({
        id: getTrad("modal.popup.form.header.title.delete"),
        defaultMessage: "Delete Popup"
      })}
      isOpen={showModal}
    >
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack spacing={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              {formatMessage({
                id: getTrad("modal.popup.form.info.delete"),
                defaultMessage: "Are you sure you want to delete this?"
              })}
            </Typography>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            {formatMessage({
              id: getTrad("modal.popup.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endAction={
          <Button
            onClick={() => {
              deletePopup(popup)
              setShowModal(false)
            }}
            variant="danger-light"
            startIcon={<Trash />}
          >
            {formatMessage({
              id: getTrad("modal.popup.form.cta.delete"),
              defaultMessage: "Delete Popup"
            })}
          </Button>
        }
      />
    </Dialog>
  )
}

const DeleteAllPopupModal = ({ setShowModal, deleteAllPopup, popups, showModal = false }) => {
  const { formatMessage } = useIntl()

  return (
    <Dialog onClose={() => setShowModal(false)} title="Confirmation" isOpen={showModal}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack spacing={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              {formatMessage({
                id: getTrad("modal.popup.form.info.delete"),
                defaultMessage: "Are you sure you want to delete this?"
              })}
            </Typography>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            {formatMessage({
              id: getTrad("modal.popup.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endAction={
          <Button
            onClick={() => {
              deleteAllPopup(popups)
              setShowModal(false)
            }}
            variant="danger-light"
            startIcon={<Trash />}
          >
            {formatMessage({
              id: getTrad("modal.popup.form.cta.deleteAll"),
              defaultMessage: "Delete Popups"
            })}
          </Button>
        }
      />
    </Dialog>
  )
}

export { CreatePopupModal, UpdatePopupModal, DeletePopupModal, DeleteAllPopupModal, DuplicatePopupModal }
