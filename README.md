<div align="center" width="150px">
  <img style="width: 150px; height: auto;" src="public/plugin-icon.png" alt="Logo - Strapi Cookie Manager" />
</div>

<div align="center">

  # Strapi v4 - Cookie Manager

  <p>
    <a href="https://www.npmjs.org/package/strapi-plugin-cookie-manager">
      <img src="https://img.shields.io/npm/v/strapi-plugin-cookie-manager.svg?style=plastic" alt="NPM Version" />
    </a>
    <a href="https://www.npmjs.org/package/strapi-plugin-cookie-manager">
      <img src="https://img.shields.io/npm/dt/strapi-plugin-cookie-manager.svg?style=plastic" alt="Monthly download on NPM" />
    </a>
    <a href="https://github.com/prettier/prettier" target="_blank" rel="noopener noreferrer">
      <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=plastic">
    </a>
    <a href="#-contributing">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic" alt="PRs welcome!" />
    </a>
    <a href="#-license">
      <img src="https://img.shields.io/github/license/eigengrau-ch/strapi-plugin-cookie-manager?style=plastic" alt="License" />
    </a>
    <a href="https://twitter.com/intent/follow?screen_name=eigengrau_ch" target="_blank" rel="noopener noreferrer">
      <img alt="Follow eigengrau" src="https://img.shields.io/twitter/follow/eigengrau_ch?color=%231DA1F2&label=follow%20me&style=plastic">
    </a>
    <a href="#">
      <img alt="Repo stars" src="https://img.shields.io/github/stars/eigengrau-ch/strapi-plugin-cookie-manager?color=white&label=Github&style=plastic">
    </a>
  </p>

  Manage categorized cookies directly within the [Strapi CMS](https://github.com/strapi/strapi) admin panel at one place and use the predefined plugin API to provide GDPR consent cookies.

  <img src="public/plugin-usage.png" alt="Screenshot of Cookie Manager usage" />

</div>

## 🎉 Features

- **🥞 Predefined API:** Simple and ready for use API endpoint
- **📦 Cookie Categories:** Easly create categories and manage your cookies within
- **💬 Internationalization:** Possibility to localize your cookies supporting Strapi's I18n plugin
- **👥 Duplicate:** Maximize cookie creation efficiency by duplicating
- **🌓 Light & Dark:** Complete reuse of Strapi's design system components
- **📢 GDPR Consent:** Communicate transparently in the name of data privacy
- **📍 One place:** Manage everything related to cookies in one place


## ⚙️ Versions

- Strapi v4 - (current) - [v1.x](https://github.com/eigengrau-ch/strapi-plugin-cookie-manager)


## ⏳ Installation

Install the plugin with your desired package manager.

(It's recommended to use yarn to install this plugin within your Strapi project. [Install yarn with these docs](https://yarnpkg.com/lang/en/docs/install/))

```bash
yarn add strapi-plugin-cookie-manager

# or

npm install strapi-plugin-cookie-manager
```

After successful installation you need to re-build your Strapi:

```bash
yarn build && yarn develop

# or

npm run build && npm run develop
```

or just run Strapis development mode with `--watch-admin` option

```bash
yarn develop --watch-admin

#or

npm run develop --watch-admin
```

Now the Cookie Manager should appear inside the Plugins section on the left hand sidebar like so:

<img src="public/plugin-sidebar.png" alt="Screenshot of sidebar with Cookie Manager installed" />


## 🔧 Configuration

Currently there is only one option for the plugin settings.

You can change the plugin settings inside the Strapi admin panel under `Strapi Settings -> Cookie Manager -> Configuration`.

<img style="margin-bottom: 20px;" src="public/plugin-settings.png" alt="Screenshot of the Cookie Manager settings pahe" />

Or you change it manually in your `./config/plugins.js`

```bash
module.exports = ({ env }) => ({
  // ...
  'cookie-manager': {
    enabled: true,
    config: {
      localization: true
    }
  },
  // ...
});
```

### Options

| Option           | Type             | Default |
| ---------------- | ---------------- | ------- |
| localization     | Boolean          | true    |


## 👉 Good to know

Internationalization is enabled per default, even if `disabled`! Disabling it just hides the possibility to edit multiple locales.


## 🤝 Contributing

If you like to enhance, fix or just helping improving the quality or security of the code. Feel free to fork and make a pull request to bring this plugin further ahead. All inputs are welcome!


## ❤️ Support the plugin

If this plugin was helpful, dont hesitate giving this plugin a ⭐️.


## 🔗 Links
- [NPM Package](https://www.npmjs.com/package/strapi-plugin-cookie-manager)
- [Github Repository](https://github.com/eigengrau-ch/strapi-plugin-cookie-manager)


## 📝 Licence

[MIT Licence](https://github.com/eigengrau-ch/strapi-plugin-cookie-manager/blob/main/LICENSE) copyright (c) 2022 [eigengrau GmbH](https://eigengrau.ch) & [Strapi Inc](https://strapi.io/)