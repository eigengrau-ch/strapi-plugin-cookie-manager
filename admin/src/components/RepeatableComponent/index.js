
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
import { isNull, find, first, last, isArray } from "lodash"

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

const RepeatableComponent = ({ name, entries, setEntries, schema, isValid, setIsValid, childrensValidated, setChildrensValidated, isSubmit, setIsSubmit }) => {

  const { formatMessage } = useIntl()

  const [buttonType, setButtonType] = useState([])
  const [label, setLabel] = useState([])

  // Rework
  // The validation, value and entries states need to be reworked as one object
  // Most of the logic is here and can be used for rework
  
  // Bugs
  // When drag and drop the values don't change properly
  // Potentially the above could apply to validation aswell

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
  const numberOfFields = Object.keys(fields).length
  const hasEntries = (numberOfEntries > 0)

  const handleParentSubmit = async () => { if (!isValid && isSubmit) await validateFields() }

  const handleValidation = async (key, field, setValueValidation) => {
    const fieldName = Object.keys(field)[0]
    const result = await validateField(field, fieldName)
    const isValid = isNull(result)
    const newState = isValid ? [] : result

    setChildrensValidated(state => {
      const foundKey = find(state, obj => obj.key === key)

      const newState = state.map(obj => {
        const hasFound = (obj.key === key)

        if (hasFound) obj.valid = isValid
        return obj
      })

      return foundKey ? newState : [ ...state, { key: key, valid: isValid } ]
    })

    setValueValidation(state => handleStateChange(key, state, newState))
  }

  const handleStateChange = (key, state, value) => {
    const foundKey = find(state, obj => obj.key === key)

    const newState = state.map(obj => {                          
      if (obj.key === key) obj.value = value
      return obj
    })

    return foundKey ? newState : [ ...state, { key: key, value: value } ]
  }

  const validateField = async (field, key) => {
    return await validationSchema(formatMessage)
      .validateAt(key, field)
      .then(() => null)
      .catch((err) => err.errors)
  }
  
  const validateFields = async () => {
    if (!isValid) {
      let newButtonTypeValidation = []
      let newLabelValidation = []

      for(const [entryCount, ] of entries.entries()) {
        const fieldName = Object.keys(fields)
        const buttonTypeKey = `${fieldName[0]}.${entryCount}0`
        const labelKey = `${fieldName[1]}.${entryCount}1`

        newButtonTypeValidation = handleStateChange(buttonTypeKey, newButtonTypeValidation, await validateField({ [fieldName[0]]: findValueByKey(buttonType, buttonTypeKey) || [] }, fieldName[0]))
        newLabelValidation = handleStateChange(labelKey, newLabelValidation, await validateField({ [fieldName[1]]: findValueByKey(label, labelKey) || "" }, fieldName[1]))
      }

      setButtonTypeValidation(newButtonTypeValidation)
      setLabelValidation(newLabelValidation)
    } else {
      setIsValid(true)
    }

    return isValid
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
    const newEntry = { key: key, buttonType: "", label: "Test" }

    console.log("key: ", key)
    console.log("entryCount: ", entryCount)
    console.log("newEntry: ", newEntry)

    setIsSubmit(false)
    setIsValid(false)
    setEntries([ ...entries, newEntry ])
    setCollapseToOpen(key)
    setEntryCount(entryCount + 1)
  }

  const deleteEntry = (key) => {
    const updatedEntries = entries.filter(entry => { console.log("Entry: ", entry); return entry.key !== key })
    const prevKey = last(updatedEntries)?.key

    console.log("key: ", key)
    console.log("prevKey: ", prevKey)
    console.log("entryCount: ", entryCount)
    console.log("updatedEntries: ", updatedEntries)

    setIsSubmit(false)
    setIsValid(false)
    setEntries([ ...updatedEntries ])
    setCollapseToOpen(prevKey)
  }

  const findValueByKey = (state, key) => {
    const value = find(state, obj => obj.key === key)?.value
    return isArray(value) ? first(value) : value
  }

  useEffect(() => {
    handleParentSubmit()
  }, [isSubmit])

  // useEffect(() => {
  //   setEntryCount(entryCount + 1)
  // }, [entries])

  useEffect(() => {
    const numberOfValid = childrensValidated.filter(obj => (obj.valid) ? true : false)
    setIsValid((numberOfEntries > 0 && numberOfValid.length === (numberOfEntries * numberOfFields)))
  }, [childrensValidated])
  
  console.log("collapseToOpen: ", collapseToOpen)
  console.log("ButtonType: ", buttonType)
  console.log("Label: ", label)
  console.log("Entries: ", entries)
  console.log("entryCount: ", entryCount)

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
          label={`Buttons (${numberOfEntries})`}
        >
          {entries.map((entry, entryCount) => {
            const key = entry.key
            const componentFieldName = `${name}.${entryCount}`
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
                entryKey={key}
                index={entryCount}
                isDraggingSibling={isDraggingSibling}
                isOpen={isOpen}
                key={key}
                moveEntry={moveEntry}
                deleteEntry={deleteEntry}
                onClickToggle={onClickToggle}
                setIsDraggingSibling={setIsDraggingSibling}
                toggleCollapses={toggleCollapses}
              >
                  {Object.values(fields).map((field, fieldCount) => {
                    const fieldName = Object.keys(fields)[fieldCount]
                    const key = `${fieldName}.${entryCount}${fieldCount}`
                    let renderedField = <></>

                    switch(field.type) {
                      case "enumeration":
                        renderedField = (
                          <Combobox
                            label="Button Type"
                            error={findValueByKey(buttonTypeValidation, key)}
                            onChange={(value) => {
                              setButtonType(state => handleStateChange(key, state, value))
                              handleValidation(key, { [fieldName]: value }, setButtonTypeValidation)
                            }}
                            value={findValueByKey(buttonType, key)}
                          >
                            {field.enum.map((option, index) => (
                              <ComboboxOption value={option} key={index}>{option}</ComboboxOption>
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
                            error={findValueByKey(labelValidation, key)}
                            onChange={e => {
                              setLabel(state => handleStateChange(key, state, e.target.value))
                              handleValidation(key, { [fieldName]: e.target.value }, setLabelValidation)
                            }}
                            value={findValueByKey(label, key)}
                          />
                        )
                        break
                    }

                    return (
                      <Box padding={4} key={fieldCount}>
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
              {`Buttons (${numberOfEntries})`}
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