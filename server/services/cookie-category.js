
"use strict";

module.exports = ({ strapi }) => ({
  async findOne(id) {
    return await strapi.entityService.findOne("api::cookie-category.cookie-category", id)
  },

  async find(query) {
    return await strapi.entityService.findMany("api::cookie-category.cookie-category", Object.assign(query, {
      populate: { cookies: true },
      sort: "id:asc"
    }))
  },

  async delete(id) {
    return await strapi.entityService.delete("api::cookie-category.cookie-category", id);
  },

  async create(data) {
    return await strapi.entityService.create("api::cookie-category.cookie-category", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("api::cookie-category.cookie-category", id, data);
  },
});
