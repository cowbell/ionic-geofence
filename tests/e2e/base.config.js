exports.config = {
    framework: "jasmine2",
    specs: ["**/*_test.js"],

    onPrepare: function () {
        var wd = require("wd"),
            protractor = require("protractor"),
            wdBridge = require("wd-bridge")(protractor, wd);
        wdBridge.initFromProtractor(exports.config);
        require("babel-core/register");
    }
};
