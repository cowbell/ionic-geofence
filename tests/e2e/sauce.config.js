var caps = require("./caps/sauce");
var baseConfig = require("./base.config").config;

require("dotenv").load();

exports.config = Object.assign(baseConfig, {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    multiCapabilities: Object.keys(caps).map((key) => caps[key])
});
