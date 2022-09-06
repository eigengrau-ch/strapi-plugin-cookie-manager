
"use strict";

module.exports = {
  async config(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("plugin")
        .getConfig()
    } catch (err) {
      ctx.throw(500, err)
    }
  },
  async updateConfig(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("plugin")
        .updateConfig(ctx.request.body)
    } catch (err) {
      ctx.throw(500, err)
    }
  },
  async locales(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("plugin")
        .getLocales()
    } catch (err) {
      ctx.throw(500, err)
    }
  },
};
