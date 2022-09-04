
const cookie = require("./cookie");
const cookieCategory = require("./cookie-category");

module.exports = {
	type: "content-api",
	routes: [
		...cookie,
		...cookieCategory,
	],
};
