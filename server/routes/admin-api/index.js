
const plugin = require('./plugin');
const cookie = require('./cookie');
const cookieCategory = require('./cookie-category');
const cookiePopup = require('./cookie-popup');

module.exports = {
  type: 'admin',
  routes: [
    ...plugin,
    ...cookie,
    ...cookieCategory,
    ...cookiePopup,
  ],
};
