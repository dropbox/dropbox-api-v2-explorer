const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');

const tsPath = '+(src)/**/*.ts';
const staticPath = 'src/**/*.+(html|css|jpeg)';

gulp.task('build-ts', () => {
  const b = browserify({ debug: true })
    .add('src/main.ts')
    .plugin('tsify', {
      typescript: require('typescript'),
      // Use our version of typescript instead of the one specified by tsify's own dependencies.
      sortOutput: true,
      noEmitOnError: true,
    })
    .bundle();
  b.on('error', (error) => { console.log(error.toString()); b.emit('end'); });

  return b
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('build-static', () => gulp.src(staticPath)
  .pipe(gulp.dest('build'))
  .pipe(connect.reload()));

gulp.task('default', gulp.series('build-ts', 'build-static'));

gulp.task('watch', gulp.series('build-ts', 'build-static', () => {
  connect.server({
    root: 'build',
    port: 8042,
    livereload: true,
  });
  gulp.watch(tsPath, gulp.series('build-ts'));
  gulp.watch(staticPath, gulp.series('build-static'));
}));
