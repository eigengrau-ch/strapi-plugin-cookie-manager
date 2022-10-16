
// React
import React, { useState } from "react"
import { useIntl } from "react-intl";

// Strapi
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system/Dialog";
import { Accordion, AccordionToggle, AccordionContent } from "@strapi/design-system/Accordion";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";
import { Divider } from "@strapi/design-system/Divider";
import { Stack } from "@strapi/design-system/Stack"
import Trash from "@strapi/icons/Trash"
import { Flex } from "@strapi/design-system/Flex"
import ExclamationMarkCircle from "@strapi/icons/ExclamationMarkCircle";
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

// Lodash
import { isNull, first } from "lodash"

// Utils
import { getTrad } from "../../utils";

// Validation Schema
import validationSchema from "./validation"

const Modal = ({ setShowModal, crudAction, category = {}, locale = null }) => {

  const { formatMessage } = useIntl();
  const isUpdate = (Object.keys(category).length > 0)

  const [id] = useState(category.id || null);
  const [name, setName] = useState(category.name || "");
  const [description, setDescription] = useState(category.description || "");

  const [nameValidation, setNameValidation] = useState([]);
  const [descriptionValidation, setDescriptionValidation] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (await validateFields()) {
      const fields = {
        name: name,
        description: description,
        locale: locale
      }

      try {
        await crudAction((id) ? { id: id, ...fields } : { ...fields });
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
      name: name,
      description: description,
    }

    const validationSuccess = await validationSchema(formatMessage).isValid(fields).then((valid) => valid)

    if (!validationSuccess) {
      setNameValidation(await validateField({ name: name }, "name"))
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
              id: getTrad("modal.category.form.header.title.update"),
              defaultMessage: "Update Category"
            })
            : formatMessage({
              id: getTrad("modal.category.form.header.title.create"),
              defaultMessage: "Create new Category"
            })}
        </Typography>
      </ModalHeader>

      <ModalBody>
        <Box>
          <TextInput
            label={formatMessage({
              id: getTrad("modal.category.form.field.name.label"),
              defaultMessage: "Name"
            })}
            name="name"
            error={first(nameValidation)}
            onChange={e => {
              handleValidation({ name: e.target.value }, setNameValidation, nameValidation)
              setName(e.target.value)
            }}
            value={name}
          />
        </Box>
        <Box paddingTop={4}>
          <Textarea
            label={formatMessage({
              id: getTrad("modal.category.form.field.description.label"),
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
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            {formatMessage({
              id: getTrad("modal.category.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endActions={
          (isUpdate)
            ? <Button type="submit">
              {formatMessage({
                id: getTrad("modal.category.form.cta.update"),
                defaultMessage: "Update Category"
              })}
            </Button>
            : <Button type="submit">
              {formatMessage({
                id: getTrad("modal.category.form.cta.create"),
                defaultMessage: "Add new Category"
              })}
            </Button>
        }
      />
    </ModalLayout>
  )
}

const DeleteCategoryModal = ({ setShowModal, deleteCategory, deleteAllCookie, category, cookies, showModal = false }) => {
  const [toggle, setToggle] = useState(false)

  const { formatMessage } = useIntl();
  const categoryHasCookies = (cookies.length > 0)
  const cookieCount = cookies.length
  const cookieOrCookies = cookieCount > 1 ? "cookies" : "cookie"

  return (
    <Dialog
      onClose={() => setShowModal(false)}
      title={formatMessage({
        id: getTrad("modal.category.form.header.title.delete"),
        defaultMessage: "Delete Category"
      })}
      isOpen={showModal}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack spacing={2}>
          <Flex direction="column" alignItems="stretch" gap={6}>
            <Typography
              style={{ textAlign: "center" }}
              id="confirm-description"
            >
              {formatMessage(
                {
                  id: getTrad("modal.category.form.info.delete"),
                  defaultMessage: "Are you sure you want to delete { name }{ moreThanOne, select, true { and all containing cookies} other {} }?"
                },
                {
                  name: <b style={{ fontWeight: "bold" }}>{category.name}</b>,
                  moreThanOne: categoryHasCookies
                }
              )}
            </Typography>
            {categoryHasCookies &&
              <>
                <Divider style={{ width: "80%" }} />
                <Accordion style={{ textAlign: "center" }} variant="secondary" size="S" expanded={toggle} onToggle={() => setToggle(!toggle)} id="acc-4" >
                  <AccordionToggle
                    variant="secondary"
                    togglePosition="left"
                    title={formatMessage(
                      {
                        id: getTrad("modal.category.form.cta.showCookies"),
                        defaultMessage: "Show Cookies ({ count })"
                      },
                      { count: cookieCount }
                    )}
                  />
                  <AccordionContent>

                    <Table colCount={6} rowCount={10}>
                      <Thead>
                        <Tr>
                          <Th>
                            <Typography variant="sigma">
                              {formatMessage({
                                id: getTrad("modal.cookie.form.field.name.label"),
                                defaultMessage: "Name"
                              })
                              }</Typography>
                          </Th>
                          <Th>
                            <Typography variant="sigma">
                              {formatMessage({
                                id: getTrad("modal.cookie.form.field.description.label"),
                                defaultMessage: "Description"
                              })}
                            </Typography>
                          </Th>
                          <Th>
                            <Typography variant="sigma">
                              {formatMessage({
                                id: getTrad("modal.cookie.form.field.host.label"),
                                defaultMessage: "Host"
                              })}
                            </Typography>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cookies.map(cookie => (
                          <Tr key={cookie.id}>
                            <Td>
                              <Typography textColor="neutral800">{cookie.name}</Typography>
                            </Td>
                            <Td>
                              <Typography textColor="neutral800">{cookie.description}</Typography>
                            </Td>
                            <Td>
                              <Typography textColor="neutral800">{cookie.host}</Typography>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </AccordionContent>
                </Accordion>
              </>
            }
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            {formatMessage({
              id: getTrad("modal.category.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endAction={
          <Button
            onClick={() => {
              deleteCategory(category)
              if (categoryHasCookies) deleteAllCookie(cookies)
              setShowModal(false)
            }}
            variant="danger-light"
            startIcon={<Trash />}
          >
            {formatMessage(
              {
                id: getTrad("modal.category.form.cta.delete"),
                defaultMessage: "Delete{ count }"
              },
              { count: categoryHasCookies ? ` (${cookieCount})` : "" }
            )}
          </Button>
        }
      />
    </Dialog>
  )
}

const CreateCategoryModal = ({ setShowModal, createCategory, locale }) => <Modal setShowModal={setShowModal} crudAction={createCategory} locale={locale} />

const UpdateCategoryModal = ({ setShowModal, updateCategory, category }) => <Modal setShowModal={setShowModal} crudAction={updateCategory} category={category} />

export { CreateCategoryModal, UpdateCategoryModal, DeleteCategoryModal }