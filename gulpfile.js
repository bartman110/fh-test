const gulp        = require('gulp');
var browserSync = require('browser-sync').create();

const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const livereload  = require('gulp-livereload');

const sass  = require('gulp-sass');


/* DEV */
// browserify, then uglify js
gulp.task('buildJs', function () {
    // app.js is your main JS file with all your module inclusions
    return browserify({entries: './src/js/main.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
});

//compile sass to css
gulp.task('buildCss', function () {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['buildCss', 'buildJs'], function() {

    browserSync.init({
        server: "./"
    });
    gulp.watch(['./src/js/**/*.js', './src/css/**/*.scss'], ['buildJs', 'buildCss']);
});

/* PROD */
gulp.task('buildJsProd', function () {
    // app.js is your main JS file with all your module inclusions
    return browserify({entries: './src/js/main.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('buildCssProd', function () {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
gulp.task('prod', ['buildJsProd','buildCssProd']);