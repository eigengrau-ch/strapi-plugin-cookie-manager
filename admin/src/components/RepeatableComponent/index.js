
// React
import React, { useState, useCallback } from "react"
import { DndProvider, useDrop } from "react-dnd"

// Strapi
import { AccordionGroup, Accordion, AccordionContent, AccordionToggle } from "@strapi/design-system/Accordion"
import { Typography } from "@strapi/design-system/Typography"
import { Flex } from "@strapi/design-system/Flex"
import { TextInput } from "@strapi/design-system/TextInput"
import { TextButton } from "@strapi/design-system/TextButton"
import { Stack } from "@strapi/design-system/Stack"
import { Tooltip } from "@strapi/design-system/Tooltip"
import { IconButton } from "@strapi/design-system/IconButton"
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

// Misc
import styled from "styled-components"
import update from "immutability-helper"


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

const RepeatableComponent = ({ name, entries, setEntries }) => {
  console.log("Entries: ", entries)
  const [collapseToOpen, setCollapseToOpen] = useState("")
  const [isDraggingSibling, setIsDraggingSibling] = useState(false)
  const [entryCount, setEntryCount] = useState(0)

  const numberOfEntries = entries?.length
  const hasEntries = (numberOfEntries > 0)

  const moveEntry = useCallback((dragIndex, hoverIndex) => {
    setEntries((prevEntries) => {
      console.log("prevEntries: ", prevEntries)
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

    setEntries([ ...entries, { key: key, name: `test ${entryCount}` } ])
    setCollapseToOpen(key)

    setEntryCount(entryCount + 1)
  }

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
              />
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