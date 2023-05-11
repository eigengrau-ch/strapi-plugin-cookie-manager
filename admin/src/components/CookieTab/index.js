
// React
import React, { useState, useEffect } from "react"
import { useIntl } from "react-intl"

// Strapi
import { LoadingIndicatorPage } from "@strapi/helper-plugin"
import { AccordionGroup } from "@strapi/design-system/Accordion"
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout"
import { Button } from "@strapi/design-system/Button"
import { TFooter } from "@strapi/design-system/Table"
import Plus from "@strapi/icons/Plus"

// Components
import Illo from "../Illo"
import CookieTable from "../CookieTable"
import { CreateCookieModal, UpdateCookieModal, DeleteCookieModal, DeleteAllCookieModal, DuplicateCookieModal } from "../CookieModal"
import { CreateCategoryModal, UpdateCategoryModal, DeleteCategoryModal } from "../CategoryModal"
import CategoryAccordion from "../CategoryAccordion"

// Utils
import { getTrad } from "../../utils"

// Api
import cookieManagerRequests from "../../api/cookie-manager"

const CookieTab = ({ locale }) => {

  const { formatMessage } = useIntl()

  const [cookieData, setCookieData] = useState([])
  const [categoryData, setCategoryData] = useState([])

  const [showCreateCookieModal, setShowCreateCookieModal] = useState(false)
  const [showUpdateCookieModal, setShowUpdateCookieModal] = useState(false)
  const [showDeleteCookieModal, setShowDeleteCookieModal] = useState(false)
  const [showDuplicateCookieModal, setShowDuplicateCookieModal] = useState(false)
  const [showDeleteAllCookieModal, setShowDeleteAllCookieModal] = useState(false)

  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false)
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false)
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)

  const [cookieIsLoading, setCookieIsLoading] = useState(true)
  const [categoryIsLoading, setCategoryIsLoading] = useState(true)

  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentCookie, setCurrentCookie] = useState(null)
  const [currentCookies, setCurrentCookies] = useState([])

  const [expandedStates, setExpandedStates] = useState([])

  const setCookies = async () => {
    setCookieIsLoading(true)
    const cookies = await cookieManagerRequests.getCookies(locale)
    setCookieData(cookies)
    setCookieIsLoading(false)
  }

  const setCategories = async () => {
    setCategoryIsLoading(true)
    const categories = await cookieManagerRequests.getCategories(locale)
    setCategoryData(categories)
    setCategoryIsLoading(false)
  }

  const createCookie = async (data) => {
    await cookieManagerRequests.createCookie(data)
    await setCookies()
  }

  const createCategory = async (data) => {
    await cookieManagerRequests.createCategory(data)
    await setCategories()
  }

  const deleteCookie = async (data) => {
    await cookieManagerRequests.deleteCookie(data.id)
    await setCookies()
  }

  const deleteAllCookie = async (data) => {
    for (const cookie of data) {
      await cookieManagerRequests.deleteCookie(cookie.id)
    }
    await setCookies()
  }

  const deleteCategory = async (data) => {
    await cookieManagerRequests.deleteCategory(data.id)
    await setCategories()
  }

  const updateCookie = async (data) => {
    await cookieManagerRequests.updateCookie(data.id, data)
    await setCookies()
  }

  const updateCategory = async (data) => {
    await cookieManagerRequests.updateCategory(data.id, data)
    await setCategories()
  }

  const createAccordionState = (id, isExpanded = false) => {
    const stateExists = (expandedStates.filter(obj => (obj.id === id)).length > 0)
    if (!stateExists) setExpandedStates([{ id: id, isExpanded: isExpanded }, ...expandedStates])
  }

  useEffect(async () => {
    await setCategories()
    await setCookies()
  }, [])

  useEffect(async () => {
    await setCategories()
    await setCookies()
  }, [locale])

  const isLoading = !(!cookieIsLoading && !categoryIsLoading)

  return (
    (!isLoading) ? (
      <>
        {(categoryData.length === 0) ? (
          <EmptyStateLayout
            icon={<Illo />}
            content={formatMessage({
              id: getTrad("empty.category"),
              defaultMessage: "You don't have any categories yet..."
            })}
            action={
              <Button
                startIcon={<Plus />}
                variant="secondary"
                onClick={() => {
                  setCurrentCategory(null)
                  setShowCreateCategoryModal(true)
                }}
              >{formatMessage({
                id: getTrad("empty.category.cta"),
                defaultMessage: "Add your first category"
              })}</Button>
            }
            shadow={"none"}
          />
        ) : (
          <AccordionGroup footer={
            <TFooter
              onClick={() => {
                setCurrentCategory(null)
                setShowCreateCategoryModal(true)
              }}
              icon={<Plus />}
            >
              {formatMessage({
                id: getTrad("modal.category.form.cta.create"),
                defaultMessage: "Create new category"
              })}
            </TFooter>
          }>
            {categoryData.map((category, index) => {
              const cookieMatches = cookieData.filter(cookie => cookie.category?.id === category.id)
              const firstIndex = (index === 0)

              firstIndex ? createAccordionState(category.id, true) : createAccordionState(category.id)

              return (
                <CategoryAccordion
                  key={index}
                  cookies={cookieMatches}
                  setCategory={setCurrentCategory}
                  setCookies={setCurrentCookies}
                  category={category}
                  expandedStates={expandedStates}
                  setExpandedStates={setExpandedStates}
                  setShowCreateCookieModal={setShowCreateCookieModal}
                  setShowUpdateCategoryModal={setShowUpdateCategoryModal}
                  setShowDeleteCategoryModal={setShowDeleteCategoryModal}
                >
                  {(cookieMatches.length > 0)
                    ? <CookieTable
                      cookies={cookieMatches}
                      setCookie={setCurrentCookie}
                      setCookies={setCurrentCookies}
                      category={category}
                      setCategory={setCurrentCategory}
                      updateCookie={updateCookie}
                      setShowCreateCookieModal={setShowCreateCookieModal}
                      setShowUpdateCookieModal={setShowUpdateCookieModal}
                      setShowDeleteCookieModel={setShowDeleteCookieModal}
                      setShowDuplicateCookieModal={setShowDuplicateCookieModal}
                      setShowDeleteAllCookieModal={setShowDeleteAllCookieModal}
                    />
                    : <EmptyStateLayout
                      icon={<Illo />}
                      content={formatMessage({
                        id: getTrad("empty.cookie"),
                        defaultMessage: "You don't have any cookies yet..."
                      })}
                      action={
                        <Button
                          startIcon={<Plus />}
                          variant="secondary"
                          onClick={() => {
                            setCurrentCategory(category)
                            setShowCreateCookieModal(true)
                          }
                        }>
                          {formatMessage({
                            id: getTrad("empty.cookie.cta"),
                            defaultMessage: "Add your first cookie"
                          })}
                        </Button>
                      }
                      shadow={"none"}
                    />
                  }
                </CategoryAccordion>
              )
            })}
          </AccordionGroup>
        )}

        {showCreateCategoryModal && <CreateCategoryModal setShowModal={setShowCreateCategoryModal} createCategory={createCategory} locale={locale} />}
        {showUpdateCategoryModal && <UpdateCategoryModal setShowModal={setShowUpdateCategoryModal} updateCategory={updateCategory} category={currentCategory} />}
        {showDeleteCategoryModal && <DeleteCategoryModal setShowModal={setShowDeleteCategoryModal} deleteCategory={deleteCategory} deleteAllCookie={deleteAllCookie} category={currentCategory} cookies={currentCookies} showModal={showDeleteCategoryModal} />}

        {showCreateCookieModal && <CreateCookieModal setShowModal={setShowCreateCookieModal} createCookie={createCookie} categories={categoryData} locale={locale} preservedCategory={currentCategory} />}
        {showUpdateCookieModal && <UpdateCookieModal setShowModal={setShowUpdateCookieModal} updateCookie={updateCookie} categories={categoryData} cookie={currentCookie} />}
        {showDeleteCookieModal && <DeleteCookieModal setShowModal={setShowDeleteCookieModal} deleteCookie={deleteCookie} cookie={currentCookie} showModal={showDeleteCookieModal} />}
        {showDuplicateCookieModal && <DuplicateCookieModal setShowModal={setShowDuplicateCookieModal} createCookie={createCookie} categories={categoryData} cookie={currentCookie} locale={locale} />}
        {showDeleteAllCookieModal && <DeleteAllCookieModal setShowModal={setShowDeleteAllCookieModal} deleteAllCookie={deleteAllCookie} cookies={currentCookies} showModal={showDeleteAllCookieModal} />}
      </>
    ) : (
      <LoadingIndicatorPage />
    )
  )
}

export default CookieTab
