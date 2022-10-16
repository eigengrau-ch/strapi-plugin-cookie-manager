<div align="center" width="150px">
  <img style="width: 150px; height: auto;" src="https://github.com/eigengrau-ch/strapi-plugin-cookie-manager/blob/main/public/plugin-icon-150.png" alt="Cookie Manager Icon" />
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

  <img src="https://github.com/eigengrau-ch/strapi-plugin-cookie-manager/blob/main/public/plugin-usage.jpg" alt="Screenshot of Cookie Manager usage" />

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

<img src="https://github.com/eigengrau-ch/strapi-plugin-cookie-manager/blob/main/public/plugin-sidebar.jpg" alt="Screenshot of sidebar with Cookie Manager installed" />

You will notice that the plugin generated new content types named `cookie`, `cookie-category` and `cookie-popup`. Initially the relation fields are not populated! That means they won't show in your API.

In order to get them populated, just edit the following files like below:

`./src/api/cookie/services/cookie.js`
```javascript
module.exports = createCoreService('api::cookie.cookie', ({ strapi }) => ({
  async find(params) {
    const { pagination } = await super.find(params);
    const results = await strapi.entityService.findMany("api::cookie.cookie", Object.assign(params, {
      populate: { category: true }
    }))

    return { results, pagination };
  },
}));
```

`./src/api/cookie-category/services/cookie-category.js`
```javascript
module.exports = createCoreService('api::cookie-category.cookie-category', ({ strapi }) => ({
  async find(params) {
    const { pagination } = await super.find(params);
    const results = await strapi.entityService.findMany("api::cookie-category.cookie-category", Object.assign(params, {
      populate: { cookies: true }
    }))

    return { results, pagination }
  },
}));
```

This step is not required for the content type `cookie-popup`.

You might wanna check out [API Fields](https://www.npmjs.com/package/strapi-plugin-cookie-manager#-api-fields) to see the JSON response.


## 🔧 Configuration

Currently there is only one option for the plugin settings. You can change the plugin settings inside the Strapi admin panel under:

`Strapi Settings -> Cookie Manager -> Configuration`

<img style="margin-bottom: 20px;" src="https://github.com/eigengrau-ch/strapi-plugin-cookie-manager/blob/main/public/plugin-settings.jpg" alt="Screenshot of the Cookie Manager settings pahe" />

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

## 🔌 API Fields

**Category**
```json
{
  "name": "Necessary Cookies",
  "description": "These cookies are required to enable the basic features of this site, such as adjusting your consent preferences. These cookies do not share any personally identifiable data.",
  "cookies": {
    "data": [
      {
        "attributes": {
          "name": "Cookies Necessary",
          "description": "We set this cookie to remember the consent of users for the use of cookies in the \"Necessary\" category.",
          "host": "mydomain.com",
          "party": "First-party",
          "isVisible": true,
          "duration": {
            "days": 365,
            "hours": 0,
            "minutes": 0
          },
          "locale": "en"
        }
      }
    ]
  },
  "locale": "en"
}
```
**Cookie**
```json
{
  "name": "Cookies Necessary",
  "description": "We set this cookie to remember the consent of users for the use of cookies in the \"Necessary\" category.",
  "host": "mydomain.com",
  "party": "First-party",
  "isVisible": true,
  "duration": {
    "days": 365,
    "hours": 0,
    "minutes": 0
  },
  "category": {
    "data": {
      "attributes": {
        "name": "Necessary Cookies",
        "description": "These cookies are required to enable the basic features of this site, such as adjusting your consent preferences. These cookies do not share any personally identifiable data.",
        "locale": "en"
      }
    }
  },
  "locale": "en"
}
```
**Popup**
```json
{
  "title": "We value your privacy",
  "description": "We use cookies to help you navigate efficiently. You will find detailed information about all cookies under each category below. The cookies that are categorized as \"Necessary\" are stored on your browser as they are essential for enabling the basic functionalities of the site. We also use third-party cookies that help analyze how you use our website in order to provide the content and advertisements that are relevant to you. These cookies will only be stored in your browser with your prior consent. You can choose to enable or disable some or all of these cookies but disabling some of them may affect your browsing experience.",
  "locale": "en"
}
```

## 👉 Good to know

Internationalization is enabled per default, even if `disabled`! Disabling it just hides the possibility to edit multiple locales.

This plugin generates content types `cookies` and `cookie-categories` in your content manager (not plugin content type). Those will be hidden the content manager per default.


## 🤝 Contributing

If you like to enhance, fix or just helping improving the quality or security of the code. Feel free to fork and make a pull request to bring this plugin further ahead. All inputs are welcome!


## ❤️ Support the plugin

If this plugin was helpful, dont hesitate giving a ⭐️.

## ✨ Special Thanks

@Daedalus, @Eventyret

## 🔗 Links
- [NPM Package](https://www.npmjs.com/package/strapi-plugin-cookie-manager)
- [Github Repository](https://github.com/eigengrau-ch/strapi-plugin-cookie-manager)


## 📝 Licence

[MIT Licence](https://github.com/eigengrau-ch/strapi-plugin-cookie-manager/blob/main/LICENSE) copyright (c) 2022 [eigengrau GmbH](https://eigengrau.ch) & [Strapi Solutions](https://strapi.io/)