const env = process.env.NODE_ENV || "production";
const conf = `./conf.${env}.js`;
module.exports = require(conf);