'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

var tsPath = '+(src)/**/*.ts';
var staticPath = 'src/**/*.+(html|css|jpeg)';

gulp.task('build-ts', function() {
  var b = browserify({debug: true})
    .add('src/main.ts')
    .plugin('tsify', {
      typescript: require('typescript'),
        // Use our version of typescript instead of the one specified by tsify's own dependencies.
      sortOutput: true,
      noEmitOnError: true
    })
    .bundle()
  b.on('error', function (error) { console.log(error.toString()); b.emit('end') });

  return b
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('build-static', function() {
  return gulp.src(staticPath)
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
})

gulp.task('default', gulp.series('build-ts', 'build-static'))

gulp.task('watch', gulp.series('build-ts', 'build-static', function() {
  connect.server({
    root: 'build',
    port: 8042,
    livereload: true,
  });
  gulp.watch(tsPath, gulp.series('build-ts'));
  gulp.watch(staticPath, gulp.series('build-static'));
}));
