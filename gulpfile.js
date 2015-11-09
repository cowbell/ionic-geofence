var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var sh = require("shelljs");
var cp = require("child_process");
var protractor = require('gulp-protractor').protractor;
var runSequence = require('run-sequence');
var appium_process;

var paths = {
    sass: ["./scss/**/*.scss"]
};

gulp.task("default", ["sass"]);

gulp.task("build-debug", function (callback) {
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

gulp.task("protractor:local:android_5.0.1", function () {
    return gulp.src(["./tests/e2e/**/*_test.js"])
        .pipe(protractor({
            configFile: "tests/e2e/local-config.js",
            args: ["--params.avd=android_5_0_1"]
        }))
        .on('error', function(e) { throw e });
});

gulp.task("protractor:local:android_5.1.1", function () {
    return gulp.src(["./tests/e2e/**/*_test.js"])
        .pipe(protractor({
            configFile: "tests/e2e/local-config.js",
            args: ["--params.avd=android_5_1_1"]
        }))
        .on('error', function(e) { throw e });
});

gulp.task("protractor:local:android_6.0", function () {
    return gulp.src(["./tests/e2e/**/*_test.js"])
        .pipe(protractor({
            configFile: "tests/e2e/local-config.js",
            args: ["--params.avd=android_6_0"]
        }))
        .on('error', function(e) { throw e });
});

gulp.task("test:integration:local", ["build-debug", "start-appium"], function (callback) {
    runSequence(
        "protractor:local:android_5.0.1",
        "protractor:local:android_5.1.1",
        "protractor:local:android_6.0",
        callback
    );
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

process.once("uncaughtException", function (error) {
    if (appium_process) {
        appium_process.kill("SIGTERM");
    }

    throw error;
});
