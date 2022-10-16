
// React
import React from "react"
import { useIntl } from "react-intl";

// Strapi
import { Accordion, AccordionToggle, AccordionContent } from "@strapi/design-system/Accordion";
import { IconButton } from "@strapi/design-system/IconButton"
import { Stack } from "@strapi/design-system/Stack"
import Pencil from "@strapi/icons/Pencil"
import Trash from "@strapi/icons/Trash"
import Plus from "@strapi/icons/Plus"

// Lodash
import { first } from "lodash"

// Utils
import { getTrad } from "../../utils";

const CategoryAccordion = ({ cookies, category, setCategory, setCookies, expandedStates, setExpandedStates, setShowCreateCookieModal, setShowUpdateCategoryModal, setShowDeleteCategoryModal, children }) => {

  const { formatMessage } = useIntl();
  const isExpanded = first(expandedStates.filter(state => state.id === category.id)).isExpanded

  return (
    <Accordion
      expanded={isExpanded}
      onToggle={() => setExpandedStates([...expandedStates.map(state => {
        if (state.id === category.id) state.isExpanded = (!isExpanded)
        return state
      })])}
      id={`acc-${category.id}`}
    >
      <AccordionToggle
        variant="secondary"
        action={
          <Stack horizontal spacing={4}>
            <IconButton
              onClick={() => {
                setCategory(category)
                setShowCreateCookieModal(true)
              }}
              label={formatMessage({
                id: getTrad("modal.cookie.form.header.title.create"),
                defaultMessage: "Create new Cookie"
              })}
              icon={<Plus />}
            />
            <IconButton
              onClick={() => {
                setCategory(category)
                setShowUpdateCategoryModal(true)
              }}
              label={formatMessage({
                id: getTrad("modal.cookie.form.header.title.update"),
                defaultMessage: "Update Category"
              })}
              icon={<Pencil />}
            />
            <IconButton
              onClick={() => {
                setCategory(category)
                setCookies(cookies)
                setShowDeleteCategoryModal(true)
              }}
              label={formatMessage({
                id: getTrad("modal.cookie.form.header.title.delete"),
                defaultMessage: "Delete Category"
              })}
              icon={<Trash />}
            />
          </Stack>
        }
        title={category.name}
        description={category.description}
        togglePosition="left"
      />
      <AccordionContent>
        {children}
      </AccordionContent>
    </Accordion>
  )
}

export default CategoryAccordion
