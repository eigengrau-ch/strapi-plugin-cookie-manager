
"use strict";

module.exports = {
  default: ({ env }) => ({ localization: true }),
  validator: (config) => {
    if (typeof config.localization !== "boolean") {
      throw new Error("localization has to be a boolean")
    }
  },
};
