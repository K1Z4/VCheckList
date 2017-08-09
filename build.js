"use strict";
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const cleanCSS = require('gulp-clean-css');

const onError = function(err) { 
    gutil.log(gutil.colors.red('[Error]'), err.toString());
}

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true, 
            minifyCSS: true,
            removeComments: true
        }))
        .on('error', onError)
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
    return gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', onError)
        .pipe(uglify())
        .on('error', onError)
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src('src/*.css')
        .pipe(cleanCSS())
        .on('error', onError)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ["html", "css", "js"]);

gulp.start('default');

console.log("Build Successful")