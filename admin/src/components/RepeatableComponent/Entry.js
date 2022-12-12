// React
import React, { useState, useRef, useCallback } from "react"
import { useDrag, useDrop } from "react-dnd"

// Strapi
import { Accordion, AccordionContent, AccordionToggle } from "@strapi/design-system/Accordion"
import { IconButton } from "@strapi/design-system/IconButton"
import { Typography } from "@strapi/design-system/Typography"
import { Stack } from "@strapi/design-system/Stack"
import { Box } from "@strapi/design-system/Box"
import Drag from "@strapi/icons/Drag"
import Trash from "@strapi/icons/Trash"

// Components
import { EntryType } from "./EntryType"

// Misc
import styled from "styled-components"

const style = {
  backgroundColor: "cyan"
}

const IconButtonCustom = styled(IconButton)`
  background-color: transparent;

  svg {
    path {
      fill: ${({ theme, expanded }) =>
        expanded ? theme.colors.primary600 : theme.colors.neutral600};
    }
  }

  &:hover {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.primary600};
      }
    }
  }
`;

const DragButton = styled.span`
  display: flex;
  align-items: center;
  height: ${({ theme }) => theme.spaces[7]};
  padding: 0 ${({ theme }) => theme.spaces[3]};
  cursor: all-scroll;
  svg {
    width: ${12 / 16}rem;
    height: ${12 / 16}rem;
  }
`;

const Entry = ({ id, index, moveEntry, handleToggle, expandedID }) => {

  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: EntryType.BUTTON,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveEntry(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: EntryType.BUTTON,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const isExpanded = expandedID === `acc-${index}`
  const opacity = isDragging ? 0 : 1

  drag(drop(ref))

  return (
    <div ref={ref} data-handler-id={handlerId}>
      <Accordion
        key={index}
        expanded={isExpanded}
        onToggle={handleToggle(`acc-${index}`)}
        id={`acc-${index}`}
        size="S"
        style={{ style }}
      >
        <AccordionToggle
          title={`User informations ${index}`}
          togglePosition="left"
          action={
            <Stack horizontal spacing={0}>
              <IconButtonCustom expanded={isExpanded} noBorder onClick={() => console.log('delete')} label="Delete" icon={<Trash />} />
              <DragButton
                role="button"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                <Drag />
              </DragButton>
            </Stack>
          }
        />
        <AccordionContent>
          <Box padding={3}>
            <Typography>My name is John Duff</Typography>
          </Box>
        </AccordionContent>
      </Accordion>
    </div>
  )

}

export default Entry