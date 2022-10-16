
"use strict";

module.exports = ({ strapi }) => ({
  async findOne(id) {
    return await strapi.entityService.findOne("api::cookie-popup.cookie-popup", id)
  },

  async find(query) {
    return await strapi.entityService.findMany("api::cookie-popup.cookie-popup", Object.assign(query, {
      sort: "id:asc"
    }))
  },

  async delete(id) {
    return await strapi.entityService.delete("api::cookie-popup.cookie-popup", id);
  },

  async create(data) {
    return await strapi.entityService.create("api::cookie-popup.cookie-popup", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("api::cookie-popup.cookie-popup", id, data);
  },
});
