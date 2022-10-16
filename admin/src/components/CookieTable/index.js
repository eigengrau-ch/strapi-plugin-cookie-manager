
// React
import React, { useState } from "react"
import { useIntl } from "react-intl";

// Strapi
import { Box } from "@strapi/design-system/Box"
import { Flex } from "@strapi/design-system/Flex";
import { Typography } from "@strapi/design-system/Typography";
import { Button } from "@strapi/design-system/Button";
import { IconButton } from "@strapi/design-system/IconButton";
import { BaseCheckbox } from "@strapi/design-system/BaseCheckbox";
import { Table, Thead, Tbody, TFooter, Tr, Td, Th } from "@strapi/design-system/Table";
import { VisuallyHidden } from "@strapi/design-system/VisuallyHidden";
import { Switch } from "@strapi/design-system/Switch";
import Plus from "@strapi/icons/Plus";
import Pencil from "@strapi/icons/Pencil";
import Trash from "@strapi/icons/Trash";
import Duplicate from "@strapi/icons/Duplicate";

// Utils
import { getTrad } from "../../utils";

const CookieTable = ({
  cookies,
  setCookie,
  setCookies,
  category,
  setCategory,
  updateCookie,
  setShowCreateCookieModal,
  setShowUpdateCookieModal,
  setShowDeleteCookieModel,
  setShowDuplicateCookieModal,
  setShowDeleteAllCookieModal
}) => {

  const { formatMessage } = useIntl();

  const [checkedRowSwitch, setCheckedRowSwitch] = useState([])
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

    setCookies([...newSelectedRowCheckboxes.filter(obj => { if (obj.isSelected) return obj.cookie })])
    setSelectedRowCheckboxes(newSelectedRowCheckboxes)
    setHeadCheckboxBoolean(isAllSelected() ? true : false)
  }

  const handleRowSwitchToggle = async (cookie) => {
    const fields = {
      id: cookie.id,
      name: cookie.name,
      description: cookie.description,
      host: cookie.host,
      category: cookie.category,
      party: cookie.party,
      isVisible: !cookie.isVisible,
      duration: cookie.duration
    }

    setCheckedRowSwitch([...checkedRowSwitch.filter(obj => {
      if (obj.id === cookie.id) obj.isChecked = !cookie.isVisible
      return obj
    })])

    try {
      await updateCookie(fields);
    } catch (e) {
      console.log("error", e);
    }
  }

  const getCurrentCheckboxValue = (id) => {
    const currentCheckbox = selectedRowCheckboxes.filter(currentCheckbox => (currentCheckbox.id === id))[0]
    return (currentCheckbox) ? currentCheckbox.isSelected : false
  }

  const getCurrentSwitchValue = (id) => {
    const currentSwitch = checkedRowSwitch.filter(currentSwitch => (currentSwitch.id === id))[0]
    return (currentSwitch) ? currentSwitch.isChecked : false
  }

  const updateRowState = (rowStates, setRowStates) => {
    const validStates = rowStates.filter(obj => (cookies.filter(cookie => cookie.id === obj.cookie.id).length === 1))
    const needUpdate = (validStates.length !== rowStates.length)
    if (needUpdate) setRowStates([...validStates])
  }

  const createRowCheckboxState = (cookie) => {
    const stateExists = (selectedRowCheckboxes.filter(obj => (obj.id === cookie.id)).length > 0)
    if (!stateExists) {
      setSelectedRowCheckboxes([{ id: cookie.id, isSelected: false, cookie: cookie }, ...selectedRowCheckboxes])
    } else {
      updateRowState(selectedRowCheckboxes, setSelectedRowCheckboxes)
    }
  }

  const createRowSwitchState = (cookie) => {
    const stateExists = (checkedRowSwitch.filter(obj => (obj.id === cookie.id)).length > 0)
    if (!stateExists) {
      setCheckedRowSwitch([{ id: cookie.id, isChecked: cookie.isVisible, cookie: cookie }, ...checkedRowSwitch])
    } else {
      updateRowState(checkedRowSwitch, setCheckedRowSwitch)
    }
  }

  let cookieTable = {
    columns: <>
      <Th>
        <BaseCheckbox
          onValueChange={isSelected => handleHeadCheckboxToggle(isSelected)}
          value={headCheckboxBoolean}
          indeterminate={isIndeterminated}
          aria-label={formatMessage({
            id: getTrad("table.actions.select.all"),
            defaultMessage: "Select all entries"
          })}
        />
      </Th>
      <Th>
        <Typography variant="sigma">
          {formatMessage({
            id: getTrad("modal.cookie.form.field.name.label"),
            defaultMessage: "Name"
          })}
        </Typography>
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
      <Th>
        <Typography variant="sigma">
          {formatMessage({
            id: getTrad("modal.cookie.form.field.isVisible.label"),
            defaultMessage: "Is Visible"
          })}
        </Typography>
      </Th>
      <Th>
        <VisuallyHidden>{formatMessage({
          id: getTrad("table.actions"),
          defaultMessage: "Actions"
        })}
        </VisuallyHidden>
      </Th>
    </>,
    rows: cookies.map((cookie) => {
      createRowCheckboxState(cookie)
      createRowSwitchState(cookie)

      return (
        <Tr key={cookie.id}>
          <Td>
            <BaseCheckbox
              onValueChange={isSelected => handleRowCheckboxesToggle(cookie.id, isSelected)}
              aria-label={formatMessage(
                {
                  id: getTrad("table.actions.select.cookie"),
                  defaultMessage: "Select { name }"
                },
                { name: cookie.name }
              )}
              value={getCurrentCheckboxValue(cookie.id)}
            />
          </Td>
          <Td>
            <Typography textColor="neutral800">{cookie.name}</Typography>
          </Td>
          <Td>
            <Typography textColor="neutral800">{cookie.description}</Typography>
          </Td>
          <Td>
            <Typography textColor="neutral800">{cookie.host}</Typography>
          </Td>
          <Td style={{ justifyContent: "end" }}>
            <Switch
              label={formatMessage({
                id: getTrad("modal.cookie.form.field.isVisible.hint"),
                defaultMessage: "Manage visibility"
              })}
              selected={getCurrentSwitchValue(cookie.id)}
              onChange={() => {
                setCookie(cookie)
                handleRowSwitchToggle(cookie)
              }
              }
            />
          </Td>
          <Td>
            <Flex gap={4} style={{ justifyContent: "end" }}>
              <IconButton
                onClick={() => {
                  setCookie(cookie)
                  setShowUpdateCookieModal(true)
                }}
                label={formatMessage({
                  id: getTrad("table.actions.update"),
                  defaultMessage: "Update Cookie"
                })}
                icon={<Pencil />}
              />
              <IconButton
                onClick={() => {
                  setCookie(cookie)
                  setShowDuplicateCookieModal(true)
                }}
                label={formatMessage({
                  id: getTrad("table.actions.duplicate"),
                  defaultMessage: "Duplicate Cookie"
                })}
                icon={<Duplicate />}
              />
              <IconButton
                onClick={() => {
                  setCookie(cookie)
                  setShowDeleteCookieModel(true)
                }}
                label={formatMessage({
                  id: getTrad("table.actions.delete"),
                  defaultMessage: "Delete Cookie"
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
                    id: getTrad("table.title"),
                    defaultMessage: "Cookies"
                  })}
                </Typography>
                <Typography variant="omega" textColor="neutral600">
                  {formatMessage(
                    {
                      id: getTrad("table.entries"),
                      defaultMessage: "{ count }{ moreThanOne, select, true { entries } other { entry } found"
                    },
                    {
                      count: cookies.length,
                      moreThanOne: (cookies.length > 1)
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
                      setShowDeleteAllCookieModal(true)
                    }}
                  >
                    {formatMessage({
                      id: getTrad("table.actions.seleted.delete"),
                      defaultMessage: "Delete"
                    })}
                  </Button>
                  <Typography variant="epsilon" textColor="neutral600">
                    {formatMessage(
                      {
                        id: getTrad("table.actions.seleted.label"),
                        defaultMessage: "{ count } selected { moreThanOne, select, true { entries } other { entry }"
                      },
                      {
                        count: countSelected(),
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
            setCategory(category)
            setShowCreateCookieModal(true)
          }}
            icon={<Plus />}>
            {formatMessage({
              id: getTrad("table.actions.create"),
              defaultMessage: "Create new Cookie"
            })}
          </TFooter>}
        >
          <Thead>
            <Tr>
              {cookieTable.columns}
            </Tr>
          </Thead>
          <Tbody>
            {cookieTable.rows}
          </Tbody>
        </Table>
      </Box>
    </>
  )
}

export default CookieTable
