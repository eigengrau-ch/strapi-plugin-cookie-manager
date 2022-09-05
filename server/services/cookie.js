
"use strict";

module.exports = ({ strapi }) => ({
  async findOne(id) {
    return await strapi.entityService.findOne("api::cookie.cookie", id)
  },

  async find(query) {
    return await strapi.entityService.findMany("api::cookie.cookie", Object.assign(query, {
      populate: { category: true },
      sort: "id:desc"
    }))
  },

  async delete(id) {
    return await strapi.entityService.delete("api::cookie.cookie", id);
  },

  async create(data) {
    return await strapi.entityService.create("api::cookie.cookie", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("api::cookie.cookie", id, data);
  },
});
