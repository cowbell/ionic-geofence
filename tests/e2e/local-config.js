var extend = require("util")._extend;
var capabilities = require("./caps/android").capabilities;
var base_config = require("./base-config").config;

exports.config = extend(base_config, {
    seleniumAddress: "http://localhost:4723/wd/hub",

    capabilities: {
        // automationName: "selendroid",
        platformName: "android",
        platformVersion: "6.0",
        deviceName: "Android Emulator",
        avd: "Nexus_5_API_23_x86",
        browserName: "",
        autoWebview: true,
        fullReset: true,
        // deviceReadyTimeout: 10,
        //CHANGE THIS TO YOUR ABSOLUTE PATH
        app: "/home/tomasz/dev/js/ionic-geofence/platforms/android/build/outputs/apk/android-debug.apk"
    },
    // capabilities: {
    //     "browserName": "chrome",
    //     "chromeOptions":{
    //         prefs: {
    //             "profile.managed_default_content_settings.geolocation": 1
    //         }
    //     }
    // },
    // baseUrl: "http://localhost:8100",
    // baseUrl: "http://10.0.2.2:8000",
});
