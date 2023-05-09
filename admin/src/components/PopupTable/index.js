
// React
import React, { useState } from "react"
import { useIntl } from "react-intl"

// Strapi
import { Box } from "@strapi/design-system/Box"
import { Flex } from "@strapi/design-system/Flex"
import { Typography } from "@strapi/design-system/Typography"
import { Button } from "@strapi/design-system/Button"
import { IconButton } from "@strapi/design-system/IconButton"
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox"
import { Table, Thead, Tbody, TFooter, Tr, Td, Th } from "@strapi/design-system/Table"
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden"
import Plus from "@strapi/icons/Plus"
import Pencil from "@strapi/icons/Pencil"
import Trash from "@strapi/icons/Trash"
import Duplicate from "@strapi/icons/Duplicate"

// Utils
import { getTrad } from "../../utils"

const PopupTable = ({
  popups,
  setPopup,
  setPopups,
  setShowCreatePopupModal,
  setShowUpdatePopupModal,
  setShowDeletePopupModel,
  setShowDuplicatePopupModal,
  setShowDeleteAllPopupModal
}) => {

  const { formatMessage } = useIntl()

  const [selectedRowCheckboxes, setSelectedRowCheckboxes] = useState([])
  const [headCheckboxBoolean, setHeadCheckboxBoolean] = useState(false)

  const isAllSelected = () => (selectedRowCheckboxes.filter(obj => obj.isSelected !== true).length === 0)
  const isNoneSelected = () => (selectedRowCheckboxes.filter(obj => obj.isSelected !== false).length === 0)
  const countSelected = () => selectedRowCheckboxes.filter(obj => obj.isSelected === true).length
  const isIndeterminated = (!isNoneSelected() && !isAllSelected())

  const handleHeadCheckboxToggle = (isSelected) => {
    setHeadCheckboxBoolean((isSelected) ? true : false)
    setSelectedRowCheckboxes([...selectedRowCheckboxes.filter(obj => {
      obj.isSelected = isSelected
      return obj
    })])
  }

  const handleRowCheckboxesToggle = (id, isSelected) => {
    const newSelectedRowCheckboxes = [...selectedRowCheckboxes.filter(obj => {
      if (obj.id === id) obj.isSelected = isSelected
      return obj
    })]

    setPopups([...newSelectedRowCheckboxes.filter(obj => { if (obj.isSelected) return obj.popup })])
    setSelectedRowCheckboxes(newSelectedRowCheckboxes)
    setHeadCheckboxBoolean(isAllSelected() ? true : false)
  }

  const getCurrentCheckboxValue = (id) => {
    const currentCheckbox = selectedRowCheckboxes.filter(currentCheckbox => (currentCheckbox.id === id))[0]
    return (currentCheckbox) ? currentCheckbox.isSelected : false
  }

  const updateRowState = (rowStates, setRowStates) => {
    const validStates = rowStates.filter(obj => (popups.filter(popup => popup.id === obj.popup.id).length === 1))
    const needUpdate = (validStates.length !== rowStates.length)
    if (needUpdate) setRowStates([...validStates])
  }

  const createRowCheckboxState = (popup) => {
    const stateExists = (selectedRowCheckboxes.filter(obj => (obj.id === popup.id)).length > 0)
    if (!stateExists) {
      setSelectedRowCheckboxes([{ id: popup.id, isSelected: false, popup: popup }, ...selectedRowCheckboxes])
    } else {
      updateRowState(selectedRowCheckboxes, setSelectedRowCheckboxes)
    }
  }

  let popupTable = {
    columns: <>
      <Th>
        <BaseCheckbox
          onValueChange={isSelected => handleHeadCheckboxToggle(isSelected)}
          value={headCheckboxBoolean}
          indeterminate={isIndeterminated}
          aria-label={formatMessage({
            id: getTrad("table.popup.actions.select.all"),
            defaultMessage: "Select all entries"
          })}
        />
      </Th>
      <Th>
        <Typography variant="sigma">
          {formatMessage({
            id: getTrad("modal.popup.form.field.name.label"),
            defaultMessage: "Title"
          })}
        </Typography>
      </Th>
      <Th>
        <Typography variant="sigma">
          {formatMessage({
            id: getTrad("modal.popup.form.field.description.label"),
            defaultMessage: "Description"
          })}
        </Typography>
      </Th>
      <Th>
        <VisuallyHidden>{formatMessage({
          id: getTrad("table.popup.actions"),
          defaultMessage: "Actions"
        })}
        </VisuallyHidden>
      </Th>
    </>,
    rows: popups.map((popup) => {
      createRowCheckboxState(popup)

      return (
        <Tr key={popup.id}>
          <Td>
            <BaseCheckbox
              onValueChange={isSelected => handleRowCheckboxesToggle(popup.id, isSelected)}
              aria-label={formatMessage(
                {
                  id: getTrad("table.popup.actions.select.popup"),
                  defaultMessage: "Select { title }"
                },
                { title: popup.title }
              )}
              value={getCurrentCheckboxValue(popup.id)}
            />
          </Td>
          <Td>
            <Typography textColor="neutral800">{popup.title}</Typography>
          </Td>
          <Td>
            <Typography textColor="neutral800">{popup.description}</Typography>
          </Td>
          <Td>
            <Flex gap={4} style={{ justifyContent: "end" }}>
              <IconButton
                onClick={() => {
                  setPopup(popup)
                  setShowUpdatePopupModal(true)
                }}
                label={formatMessage({
                  id: getTrad("table.popup.actions.update"),
                  defaultMessage: "Update Popup"
                })}
                icon={<Pencil />}
              />
              <IconButton
                onClick={() => {
                  setPopup(popup)
                  setShowDuplicatePopupModal(true)
                }}
                label={formatMessage({
                  id: getTrad("table.popup.actions.duplicate"),
                  defaultMessage: "Duplicate Popup"
                })}
                icon={<Duplicate />}
              />
              <IconButton
                onClick={() => {
                  setPopup(popup)
                  setShowDeletePopupModel(true)
                }}
                label={formatMessage({
                  id: getTrad("table.popup.actions.delete"),
                  defaultMessage: "Delete Popup"
                })}
                icon={<Trash />}
              />
            </Flex>
          </Td>
        </Tr>
      )
    })
  }

  return (
    <>
      <Box paddingLeft={7} paddingRight={7} paddingTop={7} paddingBottom={7}>
        <Box paddingBottom={4}>
          <Flex justifyContent="space-between" alignItems="flex-end">
            <Box paddingLeft={2} paddingRight={2}>
              <Flex direction="column" gap={1} alignItems="flex-start">
                <Typography variant="beta" textColor="neutral700">
                  {formatMessage({
                    id: getTrad("table.popup.title"),
                    defaultMessage: "Popups"
                  })}
                </Typography>
                <Typography variant="omega" textColor="neutral600">
                  {formatMessage(
                    {
                      id: getTrad("table.popup.entries"),
                      defaultMessage: "{ amount }{ moreThanOne, select, true { entries } other { entry } found"
                    },
                    {
                      amount: popups.length,
                      moreThanOne: (popups.length > 1)
                    }
                  )}
                </Typography>
              </Flex>
            </Box>
            {!isNoneSelected() &&
              <Box paddingLeft={4} paddingRight={4}>
                <Flex gap={2} justifyContent="flex-end">
                  <Button
                    variant="danger-light"
                    size="L"
                    startIcon={<Trash />}
                    onClick={() => {
                      setShowDeleteAllPopupModal(true)
                    }}
                  >
                    {formatMessage({
                      id: getTrad("table.popup.actions.seleted.delete"),
                      defaultMessage: "Delete"
                    })}
                  </Button>
                  <Typography variant="epsilon" textColor="neutral600">
                    {formatMessage(
                      {
                        id: getTrad("table.popup.actions.seleted.label"),
                        defaultMessage: "{ amount } selected { moreThanOne, select, true { entries } other { entry }"
                      },
                      {
                        amount: countSelected(),
                        moreThanOne: (countSelected() > 1)
                      }
                    )}
                  </Typography>
                </Flex>
              </Box>
            }
          </Flex>
        </Box>
        <Table
          colCount={6}
          rowCount={10}
          footer={<TFooter onClick={() => {
            setShowCreatePopupModal(true)
          }}
            icon={<Plus />}>
            {formatMessage({
              id: getTrad("table.popup.actions.create"),
              defaultMessage: "Create new Popup"
            })}
          </TFooter>}
        >
          <Thead>
            <Tr>
              {popupTable.columns}
            </Tr>
          </Thead>
          <Tbody>
            {popupTable.rows}
          </Tbody>
        </Table>
      </Box>
    </>
  )
}

export default PopupTable
