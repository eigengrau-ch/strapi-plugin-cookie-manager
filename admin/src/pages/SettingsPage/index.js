
// React
import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";

// Formik
import { Formik } from "formik";

// Strapi
import { HeaderLayout, ContentLayout } from "@strapi/design-system/Layout"
import { Main } from "@strapi/design-system/Main";
import { Form, useNotification, useOverlayBlocker } from "@strapi/helper-plugin"
import { Stack } from "@strapi/design-system/Stack";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { Box } from "@strapi/design-system/Box"
import { Typography } from "@strapi/design-system/Typography";
import { LoadingIndicatorPage } from "@strapi/helper-plugin"
import Check from "@strapi/icons/Check";
import { Button } from "@strapi/design-system/Button"

// Utils
import { getTrad, pluginName } from "../../utils";

// Api
import cookieManagerRequests from "../../api/cookie-manager"

// Validation Schema
import schema from "./form-validation";

const SettingsPage = () => {
  const [config, setConfig] = useState({})
  const [configIsLoading, setConfigIsLoading] = useState(true)

  const { formatMessage } = useIntl();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const toggleNotification = useNotification();

  const getConfigData = async () => {
    const config = await cookieManagerRequests.getConfig()

    setConfig(config)
    setConfigIsLoading(false)
  }

  const updateConfig = async (data) => {
    await cookieManagerRequests.updateConfig(data);
  }

  const handleSubmit = (body, form) => {
    try {
      lockApp()
      updateConfig(body)
    } catch {
      toggleNotification({
        type: "warning",
        message: { id: "Error on save", defaultMessage: "An error occured" },
      });
      unlockApp()
      form.setSubmitting(false)
    } finally {
      toggleNotification({
        type: "success",
        message: { id: "Successfully saved configuration", defaultMessage: "Saved" },
      });
      unlockApp()
      form.setSubmitting(false)
    }
  }

  useEffect(async () => {
    await getConfigData()
  }, [])

  return (
    <Main>
      <Formik
        onSubmit={handleSubmit}
        initialValues={config}
        validateOnChange={false}
        validation={schema}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          isSubmitting
        }) => (
          <Form>
            <HeaderLayout
              title={formatMessage({
                id: getTrad("settings.header.title"),
                defaultMessage: pluginName
              })}
              subtitle={formatMessage({
                id: getTrad("settings.header.description"),
                defaultMessage: "Configure the settings for the Cookie Manager plugin"
              })}
              as="h2"
              primaryAction={
                <Button
                  loading={isSubmitting}
                  type="submit"
                  startIcon={<Check />}
                  size="L"
                >
                  {formatMessage({ id: "global.save", defaultMessage: "Save" })}
                </Button>
              }
            />
            <ContentLayout>
              <Box background="neutral0" hasRadius shadow="filterShadow" padding={6}>
                {
                  (configIsLoading)
                    ? <LoadingIndicatorPage />
                    : <Stack spacing={6} alignItems="flex-start">
                      <Typography variant="beta" as="h2">
                        {formatMessage({
                          id: getTrad("settings.form.title"),
                          defaultMessage: "Settings"
                        })}
                      </Typography>
                      <ToggleInput
                        hint={formatMessage({
                          id: getTrad("settings.form.field.localization.hint"),
                          defaultMessage: "Enable localization for this plugin"
                        })}
                        label={formatMessage({
                          id: getTrad("settings.form.field.localization.label"),
                          defaultMessage: "Internationalization"
                        })}
                        name="localization"
                        onLabel={formatMessage({
                          id: getTrad("settings.form.field.localization.option.a"),
                          defaultMessage: "True"
                        })}
                        offLabel={formatMessage({
                          id: getTrad("settings.form.field.localization.option.b"),
                          defaultMessage: "False"
                        })}
                        checked={values.localization}
                        onChange={handleChange}
                      />
                    </Stack>
                }
              </Box>
            </ContentLayout>
          </Form>
        )}
      </Formik>
    </Main>
  );
};

export default SettingsPage;
