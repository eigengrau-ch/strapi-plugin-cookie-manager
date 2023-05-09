
// React
import React, { memo, useState, useEffect } from "react"
import { useIntl } from "react-intl"

// Strapi
import { LoadingIndicatorPage } from "@strapi/helper-plugin"
import { Layout, BaseHeaderLayout, ContentLayout } from "@strapi/design-system/Layout"
import { Box } from "@strapi/design-system/Box"
import { Select, Option } from "@strapi/design-system/Select"
import { Stack } from "@strapi/design-system/Stack"
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from "@strapi/design-system/Tabs"

// Components
import CookieTab from "../../components/CookieTab"
import PopupTab from "../../components/PopupTab"

// Utils
import { getTrad } from "../../utils";

// Api
import cookieManagerRequests from "../../api/cookie-manager"

const HomePage = () => {

  const { formatMessage } = useIntl();

  const [configData, setConfigData] = useState([])
  const [localeData, setLocaleData] = useState([])

  const [configIsLoading, setConfigIsLoading] = useState(true)
  const [localeIsLoading, setLocaleIsLoading] = useState(true)

  const [currentLocale, setCurrentLocale] = useState(null)

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

  useEffect(async () => {
    await getConfig()
    await getLocales()
  }, [])

  const isLoading = !(!configIsLoading && !localeIsLoading)

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
          <TabGroup id="tabs">
            <Tabs>
              <Tab>
                {formatMessage({
                  id: getTrad("tab.cookie"),
                  defaultMessage: "Cookies"
                })}
              </Tab>
              <Tab>
                {formatMessage({
                  id: getTrad("tab.popup"),
                  defaultMessage: "Popups"
                })}
              </Tab>
            </Tabs>
            <TabPanels>
              <TabPanel>
                <Box color="neutral800" padding={6} background="neutral0">
                  <CookieTab currentLocale={currentLocale} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box color="neutral800" padding={6} background="neutral0">
                  <PopupTab currentLocale={currentLocale} />
                </Box>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </ContentLayout>
      </Layout>
    ) : (
      <LoadingIndicatorPage />
    )
  )
}

export default memo(HomePage)
