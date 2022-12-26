
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
import { isNull, find, first, isArray } from "lodash"

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
    // setValueValidation(isValid ? [] : result)
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
    console.log("Validate: ", key)
    console.log("field: ", field)
    return await validationSchema(formatMessage)
      .validateAt(key, field)
      .then(() => null)
      .catch((err) => err.errors)
  }
  
  const validateFields = async () => {

    // Build Object with key from fieldname and value of the field state
    // Need to only loop trough entries
    // const fields = {
    //   buttonType: buttonType,
    //   label: label,
    // }
    // const validationSuccess = await validationSchema(formatMessage).isValid(fields).then((valid) => valid)

    console.log("isValid: ", isValid)
    if (!isValid) {

      let newButtonTypeValidation = []
      let newLabelValidation = []

      for(const [entryCount, entry] of entries.entries()) {
        // for(const [fieldCount, field] of Object.values(fields).entries()) {
        //   const fieldName = Object.keys(fields)[fieldCount]
        //   const key = `${fieldName}.${entryCount}${fieldCount}`
        //   newButtonTypeValidation = handleStateChange(key, newButtonTypeValidation, await validateField({ [fieldName]: findValueByKey(buttonType, key) || [] }, fieldName))
        //   newLabelValidation = handleStateChange(key, newLabelValidation, await validateField({ [fieldName]: findValueByKey(buttonType, key) || "" }, fieldName))
        // }

        const fieldName = Object.keys(fields)
        const buttonTypeKey = `${fieldName[0]}.${entryCount}0`
        const labelKey = `${fieldName[1]}.${entryCount}1`

        newButtonTypeValidation = handleStateChange(buttonTypeKey, newButtonTypeValidation, await validateField({ [fieldName[0]]: findValueByKey(buttonType, buttonTypeKey) || [] }, fieldName[0]))
        newLabelValidation = handleStateChange(labelKey, newLabelValidation, await validateField({ [fieldName[1]]: findValueByKey(label, labelKey) || "" }, fieldName[1]))
      }

      console.log("newButtonTypeValidation: ", newButtonTypeValidation)
      console.log("newLabelValidation: ", newLabelValidation)

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
    const newEntry = { key: key, buttonType: "", label: `test ${entryCount}` }

    setIsSubmit(false)
    setIsValid(false)
    setEntries([ ...entries, newEntry ])
    setCollapseToOpen(key)
    setEntryCount(entryCount + 1)
  }

  const findValueByKey = (state, key) => {
    const value = find(state, obj => obj.key === key)?.value
    return isArray(value) ? first(value) : value
  }

  useEffect(() => {
    handleParentSubmit()
  }, [isSubmit])

  useEffect(() => {
    // Rename to setIsAllValidated
    const numberOfValid = childrensValidated.filter(obj => (obj.valid) ? true : false)
  
    console.log("numberOfFields: ", numberOfFields)
    console.log("numberOfEntries: ", numberOfEntries)
    console.log("number of valid: ", (numberOfEntries * numberOfFields))
    setIsValid((numberOfEntries > 0 && numberOfValid.length === (numberOfEntries * numberOfFields)))

    // console.log("buttonTypeValidation2 :", buttonTypeValidation)
    // console.log("labelValidation2 :", labelValidation)
    // setIsValid((buttonTypeValidation.length === 0 && labelValidation.length === 0))
    // Is always true initialy since there are no errors, yet..
  }, [childrensValidated])

  console.log("childrensValidated: ", childrensValidated)

  // console.log("buttonTypeValidation :", buttonTypeValidation)
  console.log("buttonTypeValidation :", buttonTypeValidation)
  console.log("labelValidation :", labelValidation)
  console.log("Label: ", label)
  console.log("buttonType: ", buttonType)

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
                index={entryCount}
                isDraggingSibling={isDraggingSibling}
                isOpen={isOpen}
                key={key}
                moveEntry={moveEntry}
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