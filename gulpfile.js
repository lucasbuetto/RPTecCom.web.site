'use strict';
var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    htmlMin = require('gulp-htmlmin'),
    jsUglify = require('gulp-uglify'),
    pump =  require ('pump'),
    cssNano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),

    //paths
    devDir = "app",
    distDir = "dist",
    sassFiles = 'app/assets/sass/**/*.sass',
    scssFiles = 'app/assets/scss/**/*.scss',
    fontFiles = 'app/assets/fonts/**/*',
    imageFiles = 'app/assets/images/**/*.+(png|jpg|jpeg|gif|svg)',
    cssFiles = 'app/assets/css/**/*',
    jsFiles = 'app/assets/js/**/*',
    jsonFiles = 'app/**/*.json',
    htmlFiles = 'app/**/*.html';

gulp.task('fonts', function () {
    return gulp.src(fontFiles)
        .pipe(gulp.dest(distDir + '/fonts'))
});

gulp.task('images', function () {
    return gulp.src(imageFiles)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(distDir + '/assets/images'))
});

gulp.task('css', function () {
    return gulp.src(cssFiles)
        .pipe(cssNano())
        .pipe(gulp.dest(distDir + '/assets/css'))
});

gulp.task('js', function () {
    return gulp.src(jsFiles)
        .pipe(jsUglify())
        .pipe(gulp.dest(distDir + '/assets/js'))
});

gulp.task('html', function () {
    return gulp.src(htmlFiles)
        .pipe(gulp.dest(distDir))
});

gulp.task('sassCompiler', function () {
    return gulp.src([scssFiles, sassFiles])
        .pipe(sass())
        .pipe(gulp.dest('app/assets/css'))
});

gulp.task('jsOptimizer', function (cb) {
    pump([
        gulp.src(htmlFiles),
        gulpIf('*.js', jsUglify()),
        gulp.dest('dist')
    ],
    cb
    )
});

gulp.task('watch', function () {
    gulp.watch([scssFiles, sassFiles],
        ['sassCompiler', browserSync.reload]
    );
    gulp.watch([jsFiles, jsonFiles, htmlFiles],
        ['projectOptimizer', browserSync.reload]
    );
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: devDir,
            routes: {
                '/bower_components': 'bower_components',
                '/www': distDir
            }
        }
    })
});

gulp.task('compiler', [
    'sassCompiler',
    'jsOptimizer',
    'fonts',
    'images',
    'css',
    'js',
    'html'
]);

gulp.task('start', [
    'compiler',
    'watch',
    'browserSync'
]);
