
const cookie = require("./cookie");
const cookieCategory = require("./cookie-category");
const cookiePopup = require("./cookie-popup");

module.exports = {
  type: "content-api",
  routes: [
    ...cookie,
    ...cookieCategory,
    ...cookiePopup,
  ],
};
