var extend = require("util")._extend;
var caps = require("./caps/sauce");
var baseConfig = require("./base-config").config;

require("dotenv").load();

exports.config = extend(baseConfig, {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    capabilities: caps.android_4_4
});
