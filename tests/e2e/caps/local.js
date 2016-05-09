var path = require("path");

var base = {
    platformName: "android",
    deviceName: "Android Emulator",
    browserName: "",
    autoWebview: true,
    fullReset: true,
    // deviceReadyTimeout: 10,
    app: path.resolve("platforms/android/build/outputs/apk/android-debug.apk")
};

module.exports = {
    device: Object.assign({}, base, {
        platformVersion: "5.1.1",
        deviceName: "TA8830RX4X"
    }),
    "android-6.0": Object.assign({}, base, {
        platformVersion: "6.0",
        avd: "android-6"
    }),
    "android-5.1.1": Object.assign({}, base, {
        platformName: "android",
        avd: "android-5.1.1"
    }),
    "android-5.0.1": Object.assign({}, base, {
        platformName: "android",
        avd: "android-5.0.1"
    }),
    "android-4.4.2": Object.assign({}, base, {
        platformName: "android",
        avd: "android-4.4.2"
    })
};
