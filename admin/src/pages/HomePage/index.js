
// React
import React, { memo, useState, useEffect } from "react"
import { useIntl } from "react-intl"

// Strapi
import { LoadingIndicatorPage } from "@strapi/helper-plugin"
import { Layout, BaseHeaderLayout, ContentLayout } from "@strapi/design-system/Layout"
import { AccordionGroup } from "@strapi/design-system/Accordion"
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout"
import { Button } from "@strapi/design-system/Button"
import { TFooter } from "@strapi/design-system/Table"
import { Select, Option } from "@strapi/design-system/Select"
import { Stack } from "@strapi/design-system/Stack"
import Cog from "@strapi/icons/Cog"
import Plus from "@strapi/icons/Plus"

// Components
import Illo from "../../components/Illo"
import CookieTable from "../../components/CookieTable";
import { CreateCookieModal, UpdateCookieModal, DeleteCookieModal, DeleteAllCookieModal, DuplicateCookieModal } from "../../components/CookieModal"
import { CreateCategoryModal, UpdateCategoryModal, DeleteCategoryModal } from "../../components/CategoryModal"
import { PopupContentModal } from "../../components/PopupContentModal"
import CategoryAccordion from "../../components/CategoryAccordion"

// Lodash
import { first } from "lodash"

// Utils
import { getTrad } from "../../utils";

// Api
import cookieManagerRequests from "../../api/cookie-manager"

const HomePage = () => {

  const { formatMessage } = useIntl();

  const [cookieData, setCookieData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [configData, setConfigData] = useState([])
  const [localeData, setLocaleData] = useState([])
  const [popupData, setPopupData] = useState([])

  const [showPopupModal, setShowPopupModal] = useState(false)

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
  const [configIsLoading, setConfigIsLoading] = useState(true)
  const [localeIsLoading, setLocaleIsLoading] = useState(true)
  const [popupIsLoading, setPopupIsLoading] = useState(true)

  const [currentCategory, setCurrentCategory] = useState(null)
  const [currentCookie, setCurrentCookie] = useState(null)
  const [currentCookies, setCurrentCookies] = useState([])
  const [currentLocale, setCurrentLocale] = useState(null)

  const [expandedStates, setExpandedStates] = useState([]);

  const setCookies = async () => {
    setCookieIsLoading(true)
    const cookies = await cookieManagerRequests.getCookies(currentLocale)
    setCookieData(cookies)
    setCookieIsLoading(false)
  }

  const setCategories = async () => {
    setCategoryIsLoading(true)
    const categories = await cookieManagerRequests.getCategories(currentLocale)
    setCategoryData(categories)
    setCategoryIsLoading(false)
  }

  const setPopups = async () => {
    setPopupIsLoading(true)
    const popups = await cookieManagerRequests.getPopups(currentLocale)
    setPopupData(popups)
    setPopupIsLoading(false)
  }

  const getLocales = async () => {
    const locales = await cookieManagerRequests.getLocales()
    const defaultLocale = locales.filter(locale => locale.isDefault)[0]
    setLocaleData(locales)
    setCurrentLocale(defaultLocale.code)
    setLocaleIsLoading(false)
  }

  const getConfig = async () => {
    const config = await cookieManagerRequests.getConfig()
    setConfigData(config)
    setConfigIsLoading(false)
  }

  const createCookie = async (data) => {
    await cookieManagerRequests.createCookie(data)
    await setCookies()
  }

  const createCategory = async (data) => {
    await cookieManagerRequests.createCategory(data)
    await setCategories()
  }

  const createPopup = async (data) => {
    await cookieManagerRequests.createPopup(data)
    await setPopups()
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

  const deletePopup = async (data) => {
    await cookieManagerRequests.deletePopup(data.id)
    await setPopups()
  }

  const updateCookie = async (data) => {
    await cookieManagerRequests.updateCookie(data.id, data);
    await setCookies()
  }

  const updateCategory = async (data) => {
    await cookieManagerRequests.updateCategory(data.id, data);
    await setCategories()
  }

  const updatePopup = async (data) => {
    await cookieManagerRequests.updatePopup(data.id, data);
    await setPopups()
  }

  const createAccordionState = (id, isExpanded = false) => {
    const stateExists = (expandedStates.filter(obj => (obj.id === id)).length > 0)
    if (!stateExists) setExpandedStates([{ id: id, isExpanded: isExpanded }, ...expandedStates])
  }

  useEffect(async () => {
    await getConfig()
    await getLocales()
    await setCategories()
    await setCookies()
    await setPopups()
  }, [])

  useEffect(async () => {
    await setCategories()
    await setCookies()
    await setPopups()
  }, [currentLocale]);

  const isLoading = !(!cookieIsLoading && !categoryIsLoading && !configIsLoading && !localeIsLoading && !popupIsLoading)

  return (
    (!isLoading) ? (
      <Layout>
        <BaseHeaderLayout
          title={formatMessage({
            id: getTrad("header.title"),
            defaultMessage: "Cookie Manager"
          })}
          subtitle={formatMessage({
            id: getTrad("header.description"),
            defaultMessage: "Create and organize your cookies in one place"
          })}
          as="h2"
          primaryAction={
            <Stack horizontal spacing={4}>
              <Button
                startIcon={<Cog />}
                onClick={() => {
                  setShowPopupModal(true)
                }}
              >
                {formatMessage({
                  id: getTrad("header.cta.manage"),
                  defaultMessage: "Manage popup content"
                })}

              </Button>
              {(configData.localization) && (
                <Select
                  id="lang-select"
                  aria-label={formatMessage({
                    id: getTrad("header.cta.locale.label"),
                    defaultMessage: "Choose the language to edit"
                  })}
                  value={currentLocale}
                  defaultValue={currentLocale}
                  onChange={setCurrentLocale}
                >
                  {localeData.map((locale, index) => (
                    <Option key={index} value={locale.code}>{locale.code.toUpperCase()}</Option>
                  ))}
                </Select>
              )}
            </Stack>
          }
        />
        <ContentLayout>
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
        </ContentLayout>

        {showPopupModal && <PopupContentModal setShowModal={setShowPopupModal} createPopup={createPopup} updatePopup={updatePopup} popup={first(popupData)} locale={currentLocale} />}

        {showCreateCategoryModal && <CreateCategoryModal setShowModal={setShowCreateCategoryModal} createCategory={createCategory} locale={currentLocale} />}
        {showUpdateCategoryModal && <UpdateCategoryModal setShowModal={setShowUpdateCategoryModal} updateCategory={updateCategory} category={currentCategory} />}
        {showDeleteCategoryModal && <DeleteCategoryModal setShowModal={setShowDeleteCategoryModal} deleteCategory={deleteCategory} deleteAllCookie={deleteAllCookie} category={currentCategory} cookies={currentCookies} showModal={showDeleteCategoryModal} />}

        {showCreateCookieModal && <CreateCookieModal setShowModal={setShowCreateCookieModal} createCookie={createCookie} categories={categoryData} locale={currentLocale} preservedCategory={currentCategory} />}
        {showUpdateCookieModal && <UpdateCookieModal setShowModal={setShowUpdateCookieModal} updateCookie={updateCookie} categories={categoryData} cookie={currentCookie} />}
        {showDeleteCookieModal && <DeleteCookieModal setShowModal={setShowDeleteCookieModal} deleteCookie={deleteCookie} cookie={currentCookie} showModal={showDeleteCookieModal} />}
        {showDuplicateCookieModal && <DuplicateCookieModal setShowModal={setShowDuplicateCookieModal} createCookie={createCookie} categories={categoryData} cookie={currentCookie} locale={currentLocale} />}
        {showDeleteAllCookieModal && <DeleteAllCookieModal setShowModal={setShowDeleteAllCookieModal} deleteAllCookie={deleteAllCookie} cookies={currentCookies} showModal={showDeleteAllCookieModal} />}
      </Layout>
    ) : (
      <LoadingIndicatorPage />
    )
  );
};

export default memo(HomePage);
