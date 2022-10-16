
"use strict";

const cookie = require("./content-types/cookie.json");
const cookieCategory = require("./content-types/cookie-category.json");
const cookiePopup= require("./content-types/cookie-popup.json");

module.exports = ({ strapi }) => {
  const contentTypeSchemas = [cookie, cookieCategory, cookiePopup]
  const contentTypeService = strapi.plugin("content-type-builder").service("content-types");

  let isLastIndex = false

  const getContentType = async (name) => {
    return await strapi.contentType(`api::${name}.${name}`)
  }

  const contentTypeExists = async (contentType) => {
    try {
      const result = await getContentType(contentType.singularName)
      return (result !== undefined)
    } catch (e) {
      console.log("error", e);
      return null;
    }
  }

  const contentTypeHasAttributes = async (name) => {
    const newContentType = await getContentType(name)
    return (Object.keys(newContentType.__schema__.attributes).length > 0)
  }

  const createContentType = async (contentType) => {
    try {
      strapi.reload.isWatching = false

      await contentTypeService.createContentType({ contentType: { ...contentType } })
      if (isLastIndex) setImmediate(() => strapi.reload())
    } catch (e) {
      console.log("error", e)
    }
  }

  const updateContentType = async (uid, contentType) => {
    try {
      strapi.reload.isWatching = false

      await contentTypeService.editContentType(uid, { contentType: { ...contentType } })
      if (isLastIndex) setImmediate(() => strapi.reload())
    } catch (e) {
      console.log("error", e)
    }
  }

  const setupContentTypes = async (contentTypes) => {
    for (const [index, contentType] of contentTypes.entries()) {

      const isExistent = await contentTypeExists(contentType)
      const name = contentType.singularName
      const uid = `api::${name}.${name}`
      const withEmptyAttributes = { ...contentType, ...{ "attributes": {} } }

      isLastIndex = ((contentTypes.length - 1) === index)

      if (!isExistent) {
        await createContentType(withEmptyAttributes)
      } else {
        if (!await contentTypeHasAttributes(name)) {
          await updateContentType(uid, contentType)
        }
      }
    }
  }

  setupContentTypes(contentTypeSchemas)
};
