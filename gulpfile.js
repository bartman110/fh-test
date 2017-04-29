var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');

//
// var javascriptPath = [ 'bower_components/foundation-sites/' ];
//
// var sassPaths = [
//   'bower_components/foundation-sites/scss',
//   'bower_components/motion-ui/src'
// ];
//
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "artiglow.dev"
//     });
// });
//
//
// gulp.task('sass', function() {
//   return gulp.src('scss/styleguide.scss')
//     .pipe(sourcemaps.init())
//       .pipe($.sass({
//             includePaths: sassPaths,
//             outputStyle: 'compressed'
//     })
//       .on('error', $.sass.logError))
//     .pipe($.autoprefixer({
//       browsers: ['last 2 versions', 'ie >= 9']
//     }))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('css'))
//     .pipe(rename('app.css'))
//     .pipe(gulp.dest('../css'))
//     .pipe(browserSync.stream());
// });
//
//
// gulp.task('default', ['sass'], function() {
//
//     browserSync.init({
//         server: "./"
//     });
//
//     gulp.watch(['scss/**/*.scss'], ['sass']);
//     gulp.watch(['bower_components/**/*.scss'], ['sass']);
//     gulp.watch(".html").on('change', browserSync.reload);
//
// });