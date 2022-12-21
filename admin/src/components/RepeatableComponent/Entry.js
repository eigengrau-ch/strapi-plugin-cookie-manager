// React
import React, { useState, useRef, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"

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
import { DraggingSibling } from "./DraggingSibling"
import { DropPreview } from "./DropPreview"

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

const Entry = ({ index, componentFieldName, moveEntry, onClickToggle, entry, isDraggingSibling, setIsDraggingSibling, toggleCollapses, isOpen, children }) => {

  const dragRef = useRef(null)
  const dropRef = useRef(null)
  const previewRef = useRef(null)
  const entryRef = useRef(null)

  const [, forceRerenderAfterDnd] = useState(false)

  const [, drop] = useDrop({
    accept: EntryType.COMPONENT,
    canDrop() {
      return false
    },
    hover(item, monitor) {
      if (!dropRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current?.getBoundingClientRect()
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

  const [{ isDragging }, drag, preview] = useDrag({
    type: EntryType.COMPONENT,
    item: () => {
      toggleCollapses();

      return { index }
    },
    end() {
      // Update the errors
      // triggerFormValidation();
      setIsDraggingSibling(false)
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false });
  }, [preview])

  useEffect(() => {
    if (isDragging) {
      setIsDraggingSibling(true)
    }
  }, [isDragging, setIsDraggingSibling])

  useEffect(() => {
    if (!isDraggingSibling) {
      forceRerenderAfterDnd((prev) => !prev)
    }
  }, [isDraggingSibling])

  const displayedValue = entry.name
  const opacity = isDragging ? 0 : 1

  drag(dragRef)
  drop(dropRef)
  // preview(entryRef)

  return (
    <Box ref={dropRef}>
      { isDragging && <DropPreview /> }

      {!isDragging && isDraggingSibling && (
        <DraggingSibling displayedValue={displayedValue} />
      )}

      { !isDragging && !isDraggingSibling && (
        <Accordion
          expanded={isOpen}
          onToggle={onClickToggle}
          id={componentFieldName}
          size="S"
          style={{ style }}
        >
          <AccordionToggle
            title={displayedValue}
            togglePosition="left"
            action={
              <Stack horizontal spacing={0}>
                <IconButtonCustom expanded={isOpen} noBorder onClick={() => console.log('delete')} label="Delete" icon={<Trash />} />
                <DragButton
                  ref={dragRef}
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
              {children}
            </Box>
          </AccordionContent>
        </Accordion>
      )}
    </Box>
  )

}

export default Entry