var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var sh = require("shelljs");
var execSync = require("child_process").execSync;

var paths = {
    sass: ["./scss/**/*.scss"]
};

gulp.task("default", ["sass"]);

gulp.task("integration", function () {
    execSync("ionic build android");
    execSync("protractor tests/protractor-config.js");
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
