
const plugin = require('./plugin');
const cookie = require('./cookie');
const cookieCategory = require('./cookie-category');

module.exports = {
	type: 'admin',
	routes: [
		...plugin,
		...cookie,
		...cookieCategory,
	],
};
