/* eslint-disable global-require */

exports.config = {
    framework: "jasmine2",
    specs: ["**/*_test.js"],

    onPrepare() {
        const wd = require("wd");
        const protractor = require("protractor");
        const wdBridge = require("wd-bridge")(protractor, wd);

        wdBridge.initFromProtractor(exports.config);
        require("babel-core/register");
    },
};
