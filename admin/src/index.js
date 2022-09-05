
// Strapi
import { prefixPluginTranslations } from "@strapi/helper-plugin";

// Components
import { PluginIcon, Initializer } from "./components";

// Utils
import { pluginId, pluginName } from "./utils";
import { getTrad } from "./utils";

export default {
  register(app) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: { id: getTrad("plugin.name"), defaultMessage: `${pluginName} Plugin` },
      },
      [
        {
          intlLabel: {
            id: getTrad("settings.tab.name"),
            defaultMessage: "Configuration",
          },
          id: getTrad("plugin.name"),
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
							/* webpackChunkName: "cookie-manager-settings" */ "./pages/SettingsPage"
            );

            return component;
          },
          permissions: []
        }
      ]
    );
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: getTrad("plugin.name"),
        defaultMessage: pluginName,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ "./pages/App");

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: "", // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      id: pluginId,
      name: pluginName,
      initializer: Initializer,
      isReady: false,
    });
  },

  bootstrap(app) { },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
