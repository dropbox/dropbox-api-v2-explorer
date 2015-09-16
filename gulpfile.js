'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

var tsPath = '+(src|typings)/**/*.ts';
var staticPath = 'src/**/*.+(html|css|jpeg)';

gulp.task('build-ts', function() {
  var b = browserify({debug: true})
    .add('src/main.ts')
    .add('typings/tsd.d.ts')
    .plugin('tsify', {
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

gulp.task('default', ['build-ts', 'build-static'])

gulp.task('watch', ['build-ts', 'build-static'], function() {
  connect.server({
    root: 'build',
    port: 8042,
    livereload: true,
  });
  gulp.watch(tsPath, ['build-ts']);
  gulp.watch(staticPath, ['build-static']);
});
