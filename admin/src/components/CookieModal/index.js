
// React
import React, { useState } from "react"
import { useIntl } from "react-intl";

// Strapi
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system/Dialog";
import { Combobox, ComboboxOption } from "@strapi/design-system/Combobox"
import { NumberInput } from "@strapi/design-system/NumberInput"
import { Stack } from "@strapi/design-system/Stack"
import { Switch } from "@strapi/design-system/Switch"
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
import { isNull, omit, first } from "lodash"

// Utils
import { getTrad } from "../../utils";

// Validation Schema
import validationSchema from "./validation"

const Modal = ({ setShowModal, crudAction, categories, locale = null, preservedCategory = null, cookie = {} }) => {

  const { formatMessage } = useIntl();
  const hasPreservedCategory = (preservedCategory !== null)
  const isUpdate = (cookie["id"] !== undefined)
  const isDuplicate = ((cookie["id"] === undefined) && (Object.keys(cookie).length > 0))

  const [id] = useState(cookie.id || null);
  const [name, setName] = useState(cookie.name || "");
  const [description, setDescription] = useState(cookie.description || "");
  const [host, setHost] = useState(cookie.host || "");
  const [party, setParty] = useState(cookie.party || "");
  const [category, setCategory] = useState(cookie.category || (hasPreservedCategory ? preservedCategory : {}));
  const [duration, setDuration] = useState(cookie.duration || { days: 0, hours: 0, minutes: 0 });

  const [nameValidation, setNameValidation] = useState([]);
  const [descriptionValidation, setDescriptionValidation] = useState([]);
  const [hostValidation, setHostValidation] = useState([]);
  const [partyValidation, setPartyValidation] = useState([]);
  const [categoryValidation, setCategoryValidation] = useState([]);
  const [isVisible, setIsVisible] = useState(cookie.isVisible || true);
  const [durationDaysValidation, setDurationDaysValidation] = useState(false);
  const [durationHoursValidation, setDurationHoursValidation] = useState(false);
  const [durationMinutesValidation, setDurationMinutesValidation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (await validateFields()) {
      const fields = {
        name: name,
        description: description,
        host: host,
        category: category,
        party: party,
        isVisible: isVisible,
        duration: duration,
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
    const isValid = isNull(result) ? [""] : result

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
      host: host,
      category: category.name,
      party: party,
      isVisible: isVisible,
      durationDays: duration.days,
      durationHours: duration.hours,
      durationMinutes: duration.minutes,
    }

    const validationSuccess = await validationSchema(formatMessage).isValid(fields).then((valid) => valid)

    if (!validationSuccess) {
      setNameValidation(await validateField({ name: fields.name }, "name"))
      setDescriptionValidation(await validateField({ description: fields.description }, "description"))
      setHostValidation(await validateField({ host: fields.host }, "host"))
      setCategoryValidation(await validateField({ category: fields.category }, "category"))
      setPartyValidation(await validateField({ party: fields.party }, "party"))
      setDurationDaysValidation(await validateField({ durationDays: fields.durationDays }, "durationDays"))
      setDurationHoursValidation(await validateField({ durationHours: fields.durationHours }, "durationHours"))
      setDurationMinutesValidation(await validateField({ durationMinutes: fields.durationMinutes }, "durationMinutes"))
    }

    return validationSuccess
  }

  const handleCategoryChange = (val) => {
    let category = { name: "" }

    if (!isNull(val)) {
      const newCategory = categories.filter(category => category.name === val)
      if (newCategory.length > 0) category = newCategory[0]
    }
    setCategory(category)
  }

  const handlePartyChange = (val) => {
    setParty(isNull(val) ? "" : val)
  }

  const handleDurationChange = (value, timeType) => {
    if (value === undefined) value = null
    switch (timeType) {
      case "d": setDuration({ ...duration, days: value }); break
      case "h": setDuration({ ...duration, hours: value }); break
      case "m": setDuration({ ...duration, minutes: value }); break
      default: break
    }
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
              id: getTrad("modal.cookie.form.header.title.duplicate"),
              defaultMessage: "Duplicate Cookie"
            })
          ) : (
            (isUpdate)
              ? formatMessage({
                id: getTrad("modal.cookie.form.header.title.update"),
                defaultMessage: "Update Cookie"
              })
              : formatMessage({
                id: getTrad("modal.cookie.form.header.title.create"),
                defaultMessage: "Create new Cookie"
              })
          )}
        </Typography>
      </ModalHeader>

      <ModalBody>
        <Box>
          <TextInput
            label={formatMessage({
              id: getTrad("modal.cookie.form.field.name.label"),
              defaultMessage: "Name"
            })}
            name="name"
            error={first(nameValidation)}
            onChange={e => {
              handleValidation({ name: e.target.value }, setNameValidation)
              setName(e.target.value)
            }}
            value={name}
          />
        </Box>
        <Box paddingTop={4}>
          <Textarea
            label={formatMessage({
              id: getTrad("modal.cookie.form.field.description.label"),
              defaultMessage: "Description"
            })}
            name="description"
            error={first(descriptionValidation)}
            onChange={e => {
              handleValidation({ description: e.target.value }, setDescriptionValidation)
              setDescription(e.target.value)
            }}
            value={description}
          />
        </Box>
        <Box paddingTop={4}>
          <TextInput
            label={formatMessage({
              id: getTrad("modal.cookie.form.field.host.label"),
              defaultMessage: "Host"
            })}
            name="host"
            hint={formatMessage({
              id: getTrad("modal.cookie.form.field.host.hint"),
              defaultMessage: "e.G domain.com"
            })}
            error={first(hostValidation)}
            onChange={e => {
              handleValidation({ host: e.target.value }, setHostValidation)
              setHost(e.target.value)
            }}
            value={host}
          />
        </Box>
        <Box paddingTop={4}>
          <Combobox
            label={formatMessage({
              id: getTrad("modal.cookie.form.field.category.label"),
              defaultMessage: "Category"
            })}
            name="category"
            error={first(categoryValidation)}
            onChange={(value) => {
              handleValidation({ category: value }, setCategoryValidation)
              handleCategoryChange(value)
            }}
            placeholder={formatMessage({
              id: getTrad("modal.cookie.form.field.category.placeholder"),
              defaultMessage: "Select or enter a value"
            })}
            value={category.name}
          >
            {categories.map((category, index) => {
              return <ComboboxOption key={index} value={category.name}>{category.name}</ComboboxOption>
            })}
          </Combobox>
        </Box>
        <Box paddingTop={4}>
          <Combobox
            label={formatMessage({
              id: getTrad("modal.cookie.form.field.party.label"),
              defaultMessage: "Party"
            })}
            name="party"
            error={first(partyValidation)}
            onChange={value => {
              handleValidation({ party: value }, setPartyValidation)
              handlePartyChange(value)
            }}
            placeholder={formatMessage({
              id: getTrad("modal.cookie.form.field.party.placeholder"),
              defaultMessage: "Select or enter a value"
            })}
            value={party}
          >
            <ComboboxOption value="First-party">1st-party</ComboboxOption>
            <ComboboxOption value="Second-party">2nd-party</ComboboxOption>
            <ComboboxOption value="Third-party">3rd-party</ComboboxOption>
          </Combobox>
        </Box>
        <Box paddingTop={4}>
          <Flex direction="column" alignItems="flex-start">
            <Typography variant="pi" fontWeight="bold">
              {formatMessage({
                id: getTrad("modal.cookie.form.field.isVisible.label"),
                defaultMessage: "Is Visible"
              })}
            </Typography>
            <Box paddingTop={1}>
              <Switch
                label={formatMessage({
                  id: getTrad("modal.cookie.form.field.isVisible.label"),
                  defaultMessage: "Is Visible"
                })}
                name="is-visible"
                selected={isVisible}
                onChange={() => setIsVisible(s => !s)}
              />
            </Box>
          </Flex>
        </Box>
        <Box paddingTop={4}>
          <Typography variant="pi" fontWeight="bold">
            {formatMessage({
              id: getTrad("modal.cookie.form.field.duration.label"),
              defaultMessage: "Duration"
            })}
          </Typography>
          <Box paddingTop={1}>
            <Flex gap={4}>
              <NumberInput
                aria-label={formatMessage({
                  id: getTrad("modal.cookie.form.field.duration.days.placeholder"),
                  defaultMessage: "Days"
                })}
                hint={formatMessage({
                  id: getTrad("modal.cookie.form.field.duration.days.placeholder"),
                  defaultMessage: "Days"
                })}
                name="days"
                error={first(durationDaysValidation)}
                onValueChange={value => {
                  handleValidation({ durationDays: value }, setDurationDaysValidation)
                  handleDurationChange(value, "d")
                }}
                value={duration.days}
              />
              <NumberInput
                aria-label={formatMessage({
                  id: getTrad("modal.cookie.form.field.duration.hours.placeholder"),
                  defaultMessage: "Hours"
                })}
                hint={formatMessage({
                  id: getTrad("modal.cookie.form.field.duration.hours.placeholder"),
                  defaultMessage: "Hours"
                })}
                name="hours"
                error={first(durationHoursValidation)}
                onValueChange={value => {
                  handleValidation({ durationHours: value }, setDurationHoursValidation)
                  handleDurationChange(value, "h")
                }}
                value={duration.hours}
              />
              <NumberInput
                aria-label={formatMessage({
                  id: getTrad("modal.cookie.form.field.duration.minutes.placeholder"),
                  defaultMessage: "Minutes"
                })}
                hint={formatMessage({
                  id: getTrad("modal.cookie.form.field.duration.minutes.placeholder"),
                  defaultMessage: "Minutes"
                })}
                name="minutes"
                error={first(durationMinutesValidation)}
                onValueChange={value => {
                  handleValidation({ durationMinutes: value }, setDurationMinutesValidation)
                  handleDurationChange(value, "m")
                }}
                value={duration.minutes}
              />
            </Flex>
          </Box>
        </Box>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          (isDuplicate) ? (
            <Button type="submit">
              {formatMessage({
                id: getTrad("modal.cookie.form.cta.duplicate"),
                defaultMessage: "Duplicate Cookie"
              })}
            </Button>
          ) : (
            (isUpdate)
              ? <Button type="submit">
                {formatMessage({
                  id: getTrad("modal.cookie.form.cta.update"),
                  defaultMessage: "Update Cookie"
                })}
              </Button>
              : <Button type="submit">
                {formatMessage({
                  id: getTrad("modal.cookie.form.cta.create"),
                  defaultMessage: "Add new Cookie"
                })}
              </Button>
          )
        }
      />
    </ModalLayout>
  )
}

const CreateCookieModal = ({ setShowModal, createCookie, categories, locale, preservedCategory }) => <Modal setShowModal={setShowModal} crudAction={createCookie} categories={categories} locale={locale} preservedCategory={preservedCategory} />

const UpdateCookieModal = ({ setShowModal, updateCookie, cookie, categories }) => <Modal setShowModal={setShowModal} crudAction={updateCookie} categories={categories} cookie={cookie} />

const DuplicateCookieModal = ({ setShowModal, createCookie, cookie, categories, locale }) => <Modal setShowModal={setShowModal} crudAction={createCookie} categories={categories} cookie={omit(cookie, "id")} locale={locale} />

const DeleteCookieModal = ({ setShowModal, deleteCookie, cookie, showModal = false }) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      onClose={() => setShowModal(false)}
      title={formatMessage({
        id: getTrad("modal.cookie.form.header.title.delete"),
        defaultMessage: "Delete Cookie"
      })}
      isOpen={showModal}
    >
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack spacing={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              {formatMessage({
                id: getTrad("modal.cookie.form.info.delete"),
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
              id: getTrad("modal.cookie.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endAction={
          <Button
            onClick={() => {
              deleteCookie(cookie)
              setShowModal(false)
            }}
            variant="danger-light"
            startIcon={<Trash />}
          >
            {formatMessage({
              id: getTrad("modal.cookie.form.cta.delete"),
              defaultMessage: "Delete Cookie"
            })}
          </Button>
        }
      />
    </Dialog>
  )
}

const DeleteAllCookieModal = ({ setShowModal, deleteAllCookie, cookies, showModal = false }) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog onClose={() => setShowModal(false)} title="Confirmation" isOpen={showModal}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack spacing={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              {formatMessage({
                id: getTrad("modal.cookie.form.info.delete"),
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
              id: getTrad("modal.cookie.form.cta.cancel"),
              defaultMessage: "Cancel"
            })}
          </Button>
        }
        endAction={
          <Button
            onClick={() => {
              deleteAllCookie(cookies)
              setShowModal(false)
            }}
            variant="danger-light"
            startIcon={<Trash />}
          >
            {formatMessage({
              id: getTrad("modal.cookie.form.cta.deleteAll"),
              defaultMessage: "Delete Cookie"
            })}
          </Button>
        }
      />
    </Dialog>
  )
}

export { CreateCookieModal, UpdateCookieModal, DeleteCookieModal, DeleteAllCookieModal, DuplicateCookieModal }
