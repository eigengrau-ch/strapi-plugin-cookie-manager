
// React
import React, { useState } from "react"
import { useIntl } from "react-intl";

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

// Lodash
import { isNull, first } from "lodash"

// Utils
import { getTrad } from "../../utils";

// Validation Schema
import validationSchema from "./validation"

const PopupContentModal = ({ setShowModal, createPopup, updatePopup, popup = {}, locale = null }) => {
  console.log("Popup: ", popup)

  const { formatMessage } = useIntl();
  const isUpdate = (Object.keys(popup).length > 0)

  const [id] = useState(popup.id || null);
  const [title, setTitle] = useState(popup.title || "");
  const [description, setDescription] = useState(popup.description || "");

  const [titleValidation, setTitleValidation] = useState([]);
  const [descriptionValidation, setDescriptionValidation] = useState([]);

  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (await validateFields()) {
      const fields = {
        title: title,
        description: description,
        locale: locale
      }

      try {
        isCreating ? createPopup({ ...fields }) : updatePopup({ id: id, ...fields })
        setShowModal(false);
      } catch (e) {
        console.log("error", e);
      }
    }
  };

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
    }

    const validationSuccess = await validationSchema(formatMessage).isValid(fields).then((valid) => valid)

    if (!validationSuccess) {
      setTitleValidation(await validateField({ title: title }, "title"))
      setDescriptionValidation(await validateField({ description: description }, "description"))
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
              defaultMessage: "Update Popup Content"
            })
            : formatMessage({
              id: getTrad("modal.popup.form.header.title.create"),
              defaultMessage: "Create new Popup Content"
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