
// React
import React, { useState, useCallback, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { useIntl } from "react-intl"

// Strapi
import { AccordionGroup } from "@strapi/design-system/Accordion"
import { Typography } from "@strapi/design-system/Typography"
import { Flex } from "@strapi/design-system/Flex"
import { TextInput } from "@strapi/design-system/TextInput"
import { TextButton } from "@strapi/design-system/TextButton"
import { SingleSelect, SingleSelectOption } from "@strapi/design-system/Select"
import { Box } from "@strapi/design-system/Box"
import Plus from "@strapi/icons/Plus"

// Components
import ComponentInitializer from "../ComponentInitializer"
import AccordionEntry from "./Entry"

// Lodash
import { isEmpty, isNull, find, first, last, isArray } from "lodash"

// Utils
import { getTrad } from "../../utils"

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

const RepeatableComponent = ({ label, entries, setEntries, schema, isValid, setIsValid, childrensValidated, setChildrensValidated, isSubmit, setIsSubmit, max, error }) => {

  const { formatMessage } = useIntl()

  const [buttonTypeValidation, setButtonTypeValidation] = useState([])
  const [labelValidation, setLabelValidation] = useState([])
  const [entryValidation, setEntryValidation] = useState([])

  const [fields] = useState(schema.attributes || {})
  const [collapseToOpen, setCollapseToOpen] = useState("")
  const [isDraggingSibling, setIsDraggingSibling] = useState(false)
  const [entryCount, setEntryCount] = useState(0)

  const numberOfEntries = entries?.length
  const hasEntries = (numberOfEntries > 0)

  const handleParentSubmit = async () => { if (!isValid && isSubmit) await validateFields() }

  const handleValidation = async (fieldKey, field, setValueValidation) => {
    const fieldName = Object.keys(field)[0]
    const result = await validateField(field, fieldName)
    const isValid = isNull(result)
    const newState = isValid ? [] : result

    setChildrensValidated(state => {
      const foundKey = find(state, obj => obj.id === fieldKey)
      const newState = state.map(obj => {
        const hasFound = (obj.id === fieldKey)

        if (hasFound) obj.valid = isValid
        return obj
      })

      return foundKey ? newState : [ ...state, { id: fieldKey, valid: isValid } ]
    })

    setValueValidation(state => handleStateChange(fieldKey, state, newState))
  }

  const handleStateChange = (key, state, value) => {
    const foundKey = find(state, obj => obj.id === key)
    const newState = state.map(obj => {                          
      if (obj.id === key) obj.value = value
      return obj
    })

    return foundKey ? newState : [ ...state, { id: key, value: value } ]
  }

  const validateField = async (field, key) => {
    return await validationSchema(formatMessage)
      .validateAt(key, field)
      .then(() => null)
      .catch((err) => err.errors)
  }
  
  const validateFields = async () => {
    if (isValid) {
      setIsValid(true)
    } else {
      let newButtonTypeValidation = []
      let newLabelValidation = []

      for(const entry of entries) {
        const fieldName = Object.keys(fields)
        const buttonTypeKey = `${entry.id}.${fieldName[0]}.0`
        const labelKey = `${entry.id}.${fieldName[1]}.1`

        newButtonTypeValidation = handleStateChange(buttonTypeKey, newButtonTypeValidation, await validateField({ [fieldName[0]]: entry.buttonType || [] }, fieldName[0]))
        newLabelValidation = handleStateChange(labelKey, newLabelValidation, await validateField({ [fieldName[1]]: entry.label || "" }, fieldName[1]))
      }

      setButtonTypeValidation(newButtonTypeValidation)
      setLabelValidation(newLabelValidation)
      setEntryValidation([...newButtonTypeValidation, ...newLabelValidation])
    }
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
  }

  const createEntry = () => {
    const highestId = !isEmpty(entries) ? entries.reduce((accumulator, current) => accumulator.id > current.id ? accumulator : current ).id : 0
    const entryKey = highestId + 1
    const fieldNames = Object.keys(fields)
    const newEntry = { id: entryKey, buttonType: "", label: "" }

    fieldNames.forEach((fieldName, i) => {
      const fieldKey = `${entryKey}.${fieldName}.${i}`
      setChildrensValidated(state => [ ...state, { id: fieldKey, valid: false } ])
    })

    setButtonTypeValidation(state => handleStateChange(`${entryKey}.${fieldNames[0]}.0`, state, []))
    setLabelValidation(state => handleStateChange(`${entryKey}.${fieldNames[1]}.1`, state, []))

    setIsSubmit(false)
    setIsValid(false)
    setEntries([ ...entries, newEntry ])
    setCollapseToOpen(entryKey)
    setEntryCount(entryCount + 1)
  }

  const deleteEntry = (key) => {
    const updatedLabelValidation = labelValidation.filter(validation => { return !validation.id.startsWith(key) })
    const updatedButtonTypeValidation = buttonTypeValidation.filter(validation => { return !validation.id.startsWith(key) })
    const updatedChildrensValidated = childrensValidated.filter(validation => { return !validation.id.startsWith(key) })

    const updatedEntries = entries.filter(entry => { return entry.id !== key })
    const prevKey = last(updatedEntries)?.id

    setIsSubmit(false)
    setIsValid(false)
    setEntries([ ...updatedEntries ])
    setLabelValidation([ ...updatedLabelValidation ])
    setButtonTypeValidation([ ...updatedButtonTypeValidation ])
    setChildrensValidated([ ...updatedChildrensValidated ])
    setCollapseToOpen(prevKey)
  }

  const findEntryError = (key) => {
    const entryErrors = entryValidation.filter(validation => { return (validation.id.startsWith(key) && !isEmpty(validation.value)) })
    return !isEmpty(entryErrors)
  }

  const findValueByKey = (state, key) => {
    const value = find(state, obj => obj.id === key)?.value
    return isArray(value) ? first(value) : value
  }

  useEffect(() => {
    handleParentSubmit()
  }, [isSubmit])

  useEffect(() => {
    const numberOfValid = childrensValidated.filter(obj => (obj.valid) ? true : false)
    setIsValid((numberOfValid.length === childrensValidated.length))
  }, [childrensValidated])

  const buttonFieldLabel = <>{label} ({numberOfEntries})<Typography variant="omega" fontWeight="bold" style={{color: "#d02b20"}}>*</Typography></>

  return (
    <DndProvider>
      {(hasEntries) ? (
        <AccordionGroup
          footer={numberOfEntries < max && (
            <Flex justifyContent="center" height="48px" background="neutral10">
              <TextButtonCustom startIcon={<Plus />} onClick={createEntry}>
                Add an entry
              </TextButtonCustom>
            </Flex>
          )}
          error={error}
          label={buttonFieldLabel}
          required
        >
          {entries.map((entry, entryCount) => {
            const entryKey = entry.id
            const isOpen = collapseToOpen === entryKey

            const onClickToggle = () => {
              if (isOpen) {
                setCollapseToOpen('')
              } else {
                setCollapseToOpen(entryKey)
              }
            }

            return (
              <AccordionEntry
                key={entryKey}
                entryKey={entryKey}
                index={entryCount}
                isDraggingSibling={isDraggingSibling}
                isOpen={isOpen}
                entry={entry}
                moveEntry={moveEntry}
                deleteEntry={deleteEntry}
                onClickToggle={onClickToggle}
                setIsDraggingSibling={setIsDraggingSibling}
                toggleCollapses={toggleCollapses}
                error={findEntryError(entryKey)}
              >
                  {Object.values(fields).map((field, fieldCount) => {
                    const fieldName = Object.keys(fields)[fieldCount]
                    const fieldKey = `${entryKey}.${fieldName}.${fieldCount}`
                    let renderedField = <></>

                    switch(field.type) {
                      case "enumeration":
                        renderedField = (
                          <SingleSelect
                            label={formatMessage({
                              id: getTrad("modal.popup.form.field.buttons.field.buttonType.label"),
                              defaultMessage: "Type"
                            })}
                            required
                            error={findValueByKey(buttonTypeValidation, fieldKey)}
                            onChange={(value) => {
                              setEntries(state => state.map(entry => {
                                if (entry.id === entryKey) entry["buttonType"] = value
                                return entry
                              }))
                              handleValidation(fieldKey, { [fieldName]: value }, setButtonTypeValidation)
                            }}
                            value={entry.buttonType}
                          >
                            {field.enum.map((option, index) => (
                              <SingleSelectOption value={option} key={index}>{option}</SingleSelectOption>
                            ))}
                          </SingleSelect>
                        )
                        break
                      case "string":
                        renderedField = (
                          <TextInput
                            label={formatMessage({
                              id: getTrad("modal.popup.form.field.buttons.field.label.label"),
                              defaultMessage: "Label"
                            })}
                            required
                            name="label"
                            error={findValueByKey(labelValidation, fieldKey)}
                            onChange={e => {
                              setEntries(state => state.map(entry => {
                                if (entry.id === entryKey) entry["label"] = e.target.value
                                return entry
                              }))
                              handleValidation(fieldKey, { [fieldName]: e.target.value }, setLabelValidation)
                            }}
                            value={entry.label}
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
              {buttonFieldLabel}
            </Typography>
          </Box>
          <ComponentInitializer onClick={createEntry} error={!hasEntries ? error : ""} />
        </>
      )}
    </DndProvider>
  )
}

export { RepeatableComponent }

export default RepeatableComponent