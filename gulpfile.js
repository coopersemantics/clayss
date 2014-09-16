"use strict";

/*jshint -W079 */

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var mocha = require("gulp-mocha");
var browserify = require("gulp-browserify");
var stylish = require("jshint-stylish");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

var PATHS = {
    SCRIPTS: ["./*.js", "./lib/*.js", "./test/*.js"],
    TESTS: "./test/*.js",
    LINT: ".jshintrc",
    MAIN: "./lib/clayss.js",
    DIST: "./dist",
    MIN: "clayss.min.js"
};

var test = function test() {
    return gulp.src([PATHS.TESTS], { read: false })
        .pipe(mocha({ reporter: "nyan" }));
};

var lint = function lint(pathOrPaths) {
    return gulp.src(pathOrPaths)
        .pipe(jshint(PATHS.LINT))
        .pipe(jshint.reporter(stylish));
};

gulp.task("dist", function () {
    gulp.src([PATHS.MAIN])
        .pipe(browserify({
            standalone: "clayss",
            insertGlobals: true,
            debug: true
        }))
        .pipe(rename(PATHS.MIN))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS.DIST));
});

gulp.task("test", function () {
    return test();
});

gulp.task("lint", function () {
    return lint(PATHS.SCRIPTS);
});

gulp.task("watch", function () {
    gulp.watch(PATHS.SCRIPTS, function (event) {
        if (event.type !== "deleted") {
            lint([event.path]);
        }
    });

    gulp.watch([PATHS.SCRIPTS], ["lint", "test"]);
});

gulp.task("build", ["lint", "test", "dist"]);

gulp.task("default", ["watch"]);