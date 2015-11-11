var caps = require("./caps/local");
var baseConfig = require("./base.config").config;
var avd = caps["android-6.0"];

process.argv.forEach(function (val) {
    if (val.indexOf("--params.avd") > -1) {
        var avdName = val.replace("--params.avd=", "");

        avd = caps[avdName];
    }
});

exports.config = Object.assign(baseConfig, {
    seleniumAddress: "http://localhost:4723/wd/hub",

    capabilities: avd
});
