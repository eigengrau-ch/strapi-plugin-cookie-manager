
"use strict";

module.exports = ({ strapi }) => ({

  async findOne(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("cookie")
        .findOne(ctx.params.id)
    } catch (err) {
      ctx.throw(500, err)
    }
  },

  async find(ctx) {
    try {
      return await strapi
        .plugin("cookie-manager")
        .service("cookie")
        .find(ctx.query)
    } catch (err) {
      ctx.throw(500, err)
    }
  },

  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin("cookie-manager")
        .service("cookie")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    try {
      ctx.body = await strapi
        .plugin("cookie-manager")
        .service("cookie")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async delete(ctx) {
    try {
      ctx.body = await strapi
        .plugin("cookie-manager")
        .service("cookie")
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
