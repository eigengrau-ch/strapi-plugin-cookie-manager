
// React
import React, { useState } from "react"
import { useIntl } from "react-intl"

// Strapi
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout"
import Plus from "@strapi/icons/Plus"
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
import Illo from "../../components/Illo"
import RepeatableComponent from "../RepeatableComponent"

// Lodash
import { omit, isNull, first } from "lodash"

// Utils
import { getTrad } from "../../utils"

// Schema
import validationSchema from "./validation"
import componentSchema from "../../../../server/components/cookie-button.json"

const PopupContentModal = ({ setShowModal, createPopup, updatePopup, popup = {}, locale = null }) => {

  const { formatMessage } = useIntl()

  const isUpdate = (Object.keys(popup).length > 0)

  const [id] = useState(popup.id || null)
  const [title, setTitle] = useState(popup.title || "")
  const [description, setDescription] = useState(popup.description || "")
  const [buttons, setButtons] = useState(popup.buttons || [])

  const [titleValidation, setTitleValidation] = useState([])
  const [descriptionValidation, setDescriptionValidation] = useState([])
  const [buttonsValidation, setButtonsValidation] = useState([])

  const [childrensValidated, setChildrensValidated] = useState([])
  const [childrenIsValid, setChildrenIsValid] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsSubmit(true)

    if (await validateFields() && childrenIsValid) {
      const fields = {
        title: title,
        description: description,
        buttons: buttons.map(obj => {
          if (!popup.buttons.some(o => (o.id === obj.id))) return omit(obj, "id")
          return obj
        }),
        locale: locale
      }

      try {
        console.log("Success!")
        console.log("New Fields: ", fields)
        isCreating ? createPopup({ ...fields }) : updatePopup({ id: id, ...fields })
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
    return await validationSchema(formatMessage)
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

    const validationSuccess = await validationSchema(formatMessage).isValid(fields).then((valid) => valid)

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
          {(isUpdate)
            ? formatMessage({
              id: getTrad("modal.popup.form.header.title.update"),
              defaultMessage: "Update Popup"
            })
            : formatMessage({
              id: getTrad("modal.popup.form.header.title.create"),
              defaultMessage: "Create new Popup"
            })}
        </Typography>
      </ModalHeader>

      <ModalBody>
        { (isUpdate || isCreating)
        ? <>
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
                style={{ minHeight: "200px", height: "auto" }}
              />
            </Box>
            <Box paddingTop={4}>
              <RepeatableComponent
                name="buttons"
                entries={buttons}
                setEntries={setButtons}
                schema={componentSchema}
                isValid={childrenIsValid}
                setIsValid={setChildrenIsValid}
                childrensValidated={childrensValidated}
                setChildrensValidated={setChildrensValidated}
                isSubmit={isSubmit}
                setIsSubmit={setIsSubmit}
                error={first(buttonsValidation)}
              />
            </Box>
          </>
        : <EmptyStateLayout
            icon={<Illo />}
            content={formatMessage({
              id: getTrad("empty.popup"),
              defaultMessage: "You don't have any popup content yet..."
            })}
            action={
              <Button
                startIcon={<Plus />}
                variant="secondary"
                onClick={() => setIsCreating(true)
              }>
                {formatMessage({
                  id: getTrad("empty.popup.cta"),
                  defaultMessage: "Add your first popup content"
                })}
              </Button>
            }
            shadow={"none"}
          />
        }
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
          (isUpdate)
            ? <Button type="submit">
              {formatMessage({
                id: getTrad("modal.popup.form.cta.update"),
                defaultMessage: "Update Popup Content"
              })}
            </Button>
            : <Button type="submit">
              {formatMessage({
                id: getTrad("modal.popup.form.cta.create"),
                defaultMessage: "Add Popup Content"
              })}
            </Button>
        }
      />
    </ModalLayout>
  )
}

export { PopupContentModal }