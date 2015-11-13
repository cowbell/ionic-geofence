"use strict";

const gulp = require("gulp");
const gutil = require("gulp-util");
const bower = require("bower");
const sh = require("shelljs");
const cp = require("child_process");
const protractor = require('gulp-protractor').protractor;
const runSequence = require('run-sequence');
const path = require("path");
let appium_process;

require("dotenv").load();

gulp.task("default", ["test:integration:local"]);

gulp.task("set-play-services-location-version", function () {
    sh.exec("sed -i 's/play-services-location:+/play-services-location:6.5.87/g' platforms/android/project.properties");
});

gulp.task("build-debug", ["set-play-services-location-version"], function (callback) {
    cp.exec("ionic build android", function (error) {
        if (error) {
            return callback(error);
        }
        callback();
    });
});

gulp.task("start-appium", function (callback) {
    appium_process = cp.spawn("appium", ["--chromedriver-executable", "/home/tomasz/.bin/chromedriver"]);

    appium_process.stdout.on("data", function (data) {
        if (data.toString().indexOf("Appium REST http interface listener started") > -1) {
            callback();
        }
    });

    appium_process.stderr.pipe(process.stderr);
});

gulp.task("protractor:local:android-4.4.2", runTestOn.bind(null, "local", "android-4.4.2"));
gulp.task("protractor:local:android-5.0.1", runTestOn.bind(null, "local", "android-5.0.1"));
gulp.task("protractor:local:android-5.1.1", runTestOn.bind(null, "local", "android-5.1.1"));
gulp.task("protractor:local:android-6.0", runTestOn.bind(null, "local", "android-6.0"));

gulp.task("test:integration:local", ["build-debug", "start-appium"], function (callback) {
    runSequence(
        "protractor:local:android-4.4.2",
        "protractor:local:android-5.0.1",
        "protractor:local:android-5.1.1",
        "protractor:local:android-6.0",
        function () {
            cleanup();
            callback();
            process.exit(0);
        }
    );
});

gulp.task("test:integration:sauce", ["upload-apk-to-sauce"], function () {
    return runTestOn("sauce", "all");
});

gulp.task("upload-apk-to-sauce", ["build-debug"], function () {
    const apk_path = path.resolve("platforms/android/build/outputs/apk/android-debug.apk");

    sh.exec(`curl -u $SAUCE_USERNAME:$SAUCE_ACCESS_KEY -X POST http://saucelabs.com/rest/v1/storage/$SAUCE_USERNAME/ionic-geofence-debug.apk?overwrite=true -H 'Content-Type: application/octet-stream' --data-binary @${apk_path}`);
});

gulp.task("watch", function () {
    gulp.watch(paths.sass, ["sass"]);
});

gulp.task("install", ["git-check"], function () {
    return bower.commands.install()
        .on("log", function (data) {
            gutil.log("bower", gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task("git-check", function (done) {
    if (!sh.which("git")) {
        console.log(
            "  " + gutil.colors.red("Git is not installed."),
            "\n  Git, the version control system, is required to download Ionic.",
            "\n  Download git here:", gutil.colors.cyan("http://git-scm.com/downloads") + ".",
            "\n  Once git is installed, run \"" + gutil.colors.cyan("gulp install") + "\" again."
        );
        process.exit(1);
    }
    done();
});

function runTestOn(server, device) {
    return gulp.src(["./tests/e2e/**/*_test.js"])
        .pipe(protractor({
            configFile: `tests/e2e/${server}.config.js`,
            args: [`--params.avd=${device}`]
        }))
        .on("error", function (e) { console.log(gutil.colors.red(e)); })
        .on("end", killEmulator);
}

function cleanup() {
    if (appium_process) {
        appium_process.kill("SIGINT");
    }
    killEmulator();
}

function killEmulator() {
    sh.exec("adb -s emulator-5554 emu kill");
}

process.once("uncaughtException", function (error) {
    cleanup();

    throw error;
});
