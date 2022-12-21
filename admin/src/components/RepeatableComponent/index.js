
// React
import React, { useState, useCallback, useEffect } from "react"
import { DndProvider, useDrop } from "react-dnd"
import { useIntl } from "react-intl"

// Strapi
import { AccordionGroup, Accordion, AccordionContent, AccordionToggle } from "@strapi/design-system/Accordion"
import { Typography } from "@strapi/design-system/Typography"
import { Flex } from "@strapi/design-system/Flex"
import { TextInput } from "@strapi/design-system/TextInput"
import { TextButton } from "@strapi/design-system/TextButton"
import { Stack } from "@strapi/design-system/Stack"
import { Tooltip } from "@strapi/design-system/Tooltip"
import { Combobox, ComboboxOption } from "@strapi/design-system/Combobox"
import { Button } from "@strapi/design-system/Button"
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout"
import { Box } from "@strapi/design-system/Box"
import Pencil from "@strapi/icons/Pencil"
import Plus from "@strapi/icons/Plus"
import Drag from "@strapi/icons/Drag"
import Trash from "@strapi/icons/Trash"
import Information from "@strapi/icons/Information"
import { pxToRem } from "@strapi/helper-plugin"

// Components
import ComponentInitializer from "../../components/ComponentInitializer"
import AccordionEntry from "./Entry"

// Lodash
import { isNull, first } from "lodash"

// Misc
import styled from "styled-components"
import update from "immutability-helper"

// Schema
import validationSchema from "./validation"


const TextButtonCustom = styled(TextButton)`
  height: 100%;
  width: 100%;
  border-radius: 0 0 4px 4px;
  display: flex;
  justify-content: center;
  span {
    font-weight: 600;
    font-size: 14px;
  }
`;

const RepeatableComponent = ({ name, entries, setEntries, schema, isValidated, setIsValidated, isSubmit }) => {

  const { formatMessage } = useIntl()

  const [buttonType, setButtonType] = useState("")
  const [label, setLabel] = useState("")

  // Required to some day make validation dynamic for fields and not hard coded
  // const validationKeys = Object.keys(schema.attributes).reduce((prev, current) => (prev[current] = [], prev), {})
  // const [fieldValidation, setfieldValidation] = useState(validationKeys || {})

  const [buttonTypeValidation, setButtonTypeValidation] = useState([])
  const [labelValidation, setLabelValidation] = useState([])

  const [fields] = useState(schema.attributes || {})
  const [collapseToOpen, setCollapseToOpen] = useState("")
  const [isDraggingSibling, setIsDraggingSibling] = useState(false)
  const [entryCount, setEntryCount] = useState(0)

  const numberOfEntries = entries?.length
  const hasEntries = (numberOfEntries > 0)

  const handleParentSubmit = async () => { if (!isValidated && isSubmit) if (await validateFields()) setIsValidated(true) }

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
      buttonType: buttonType,
      label: label,
    }

    const validationSuccess = await validationSchema(formatMessage).isValid(fields).then((valid) => valid)

    if (!validationSuccess) {
      setButtonTypeValidation(await validateField({ buttonType: buttonType }, "buttonType"))
      setLabelValidation(await validateField({ label: label }, "label"))
    }

    return validationSuccess
  }

  const moveEntry = useCallback((dragIndex, hoverIndex) => {
    setEntries((prevEntries) => {
      return update(prevEntries, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevEntries[dragIndex]],
        ],
      })},
    )
  }, [])

  const toggleCollapses = () => {
    setCollapseToOpen("")
  };

  const createEntry = () => {
    const key = `${name}.${entryCount}`

    setEntries([ ...entries, { key: key, buttonType: "", label: `test ${entryCount}` } ])
    setCollapseToOpen(key)
    setEntryCount(entryCount + 1)
  }

  useEffect(async () => {
    handleParentSubmit()
  }, [isSubmit])

  return (
    <DndProvider>
      {(hasEntries) ? (
        <AccordionGroup
          footer={
            <Flex justifyContent="center" height="48px" background="neutral10">
              <TextButtonCustom startIcon={<Plus />} onClick={createEntry}>
                Add an entry
              </TextButtonCustom>
            </Flex>
          }
          label="Label"
          labelAction={
            <Tooltip description="Content of the tooltip">
              <button aria-label="Information about the email" style={{
                border: "none",
                padding: 0,
                background: "transparent"
              }}>
                <Information aria-hidden />
              </button>
            </Tooltip>
          }
        >
          {entries.map((entry, index) => {
            const key = entry.key
            const componentFieldName = `${name}.${index}`
            const isOpen = collapseToOpen === key

            const onClickToggle = () => {
              if (isOpen) {
                setCollapseToOpen('')
              } else {
                setCollapseToOpen(key)
              }
            }

            return (
              <AccordionEntry
                componentFieldName={componentFieldName}
                entry={entry}
                index={index}
                isDraggingSibling={isDraggingSibling}
                isOpen={isOpen}
                key={key}
                moveEntry={moveEntry}
                onClickToggle={onClickToggle}
                setIsDraggingSibling={setIsDraggingSibling}
                toggleCollapses={toggleCollapses}
              >
                  {Object.values(fields).map((field, index) => {
                    const fieldName = Object.keys(fields)[index]
                    console.log("Field: ", field)
                    let renderedField = <></>

                    switch(field.type) {
                      case "enumeration":
                        renderedField = (
                          <Combobox
                            label="Button Type"
                            error={first(buttonTypeValidation)}
                            onChange={(value) => {
                              handleValidation({ [fieldName]: value }, setButtonTypeValidation, buttonTypeValidation)
                              setButtonType(value)
                            }}
                            value={buttonType}
                          >
                            {field.enum.map(option => (
                              <ComboboxOption value={option}>{option}</ComboboxOption>
                            ))}
                          </Combobox>
                        )
                        break
                      case "string":
                        renderedField = (
                          <TextInput
                            // label={formatMessage({
                            //   id: getTrad("modal.popup.form.field.title.label"),
                            //   defaultMessage: "Title"
                            // })}
                            label="Label"
                            name="label"
                            error={first(labelValidation)}
                            onChange={e => {
                              handleValidation({ [fieldName]: e.target.value }, setLabelValidation, labelValidation)
                              setLabel(e.target.value)
                            }}
                            value={label}
                          />
                        )
                        break
                    }

                    return (
                      <Box padding={4}>
                        { renderedField }
                      </Box>
                    )
                  })}
              </AccordionEntry>
            )
          })}
        </AccordionGroup>
      ) : (
        <>
          <Box paddingBottom={1}>
            <Typography
              textColor="neutral800"
              variant="pi"
              fontWeight="bold"
              as="label"
            >
              {"Label"}&nbsp;({numberOfEntries})
              {/* {required && <Typography textColor="danger600">*</Typography>} */}
            </Typography>
          </Box>
          <ComponentInitializer onClick={createEntry} />
        </>
      )}
    </DndProvider>
  )
}

export { RepeatableComponent }

export default RepeatableComponent