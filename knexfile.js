require("ts-node/register");
const config = require("./src/database/knexfile").default;

module.exports = config;
