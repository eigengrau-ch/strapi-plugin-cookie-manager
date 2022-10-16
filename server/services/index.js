
"use strict";

const plugin = require("./plugin");
const cookie = require("./cookie");
const cookieCategory = require("./cookie-category");
const cookiePopup = require("./cookie-popup");

module.exports = {
  "plugin": plugin,
  "cookie": cookie,
  "cookie-category": cookieCategory,
  "cookie-popup": cookiePopup,
};
