var extend = require("util")._extend;
var android51 = require("./caps/android-5.1").capabilities;
var base_config = require("./base-config").config;

require("dotenv").load();

exports.config = extend(base_config, {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    capabilities: android51
});
