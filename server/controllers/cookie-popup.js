
"use strict";

module.exports = ({ strapi }) => ({

  async findOne(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("cookie-popup")
        .findOne(ctx.params.id)
    } catch (err) {
      ctx.throw(500, err)
    }
  },

  async find(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("cookie-popup")
        .find(ctx.query)
    } catch (err) {
      ctx.throw(500, err)
    }
  },

  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin("cookie-manager")
        .service("cookie-popup")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    try {
      ctx.body = await strapi
        .plugin("cookie-manager")
        .service("cookie-popup")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async delete(ctx) {
    try {
      ctx.body = await strapi
        .plugin("cookie-manager")
        .service("cookie-popup")
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
