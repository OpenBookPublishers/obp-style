const gulp = require('gulp');
const gulpsass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const mustache = require('gulp-mustache');
const config = require('./config');

const paths = {
  source: './src/sass/*.scss',
  icomoon: './node_modules/icomoon/fonts/*',
  academicons: './node_modules/academicons/fonts/*',
  templates: './src/templates/*.mustache',
  destination: './dist',
  css: './dist/css',
  fonts: './dist/fonts'
};

function watch() {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
};

function icomoon() {
  return gulp.src(paths.icomoon)
    .pipe(gulp.dest(paths.fonts));
}

function academicons() {
  return gulp.src(paths.academicons)
    .pipe(gulp.dest(paths.fonts));
}

function sass() {
  return gulp.src(paths.source)
    .pipe(sourcemaps.init())
    .pipe(gulpsass({outputStyle: 'compact', precision: 10})
      .on('error', gulpsass.logError)
    )
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest(paths.css))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.css));
};

function metadata() {
  return gulp.src(paths.templates)
    .pipe(mustache(config))
    .pipe(rename({
          extname: ""  // removes the .mustache extension from template files
    }))
    .pipe(gulp.dest(paths.destination));
};

exports.default = gulp.series(sass, icomoon, academicons, metadata);
exports.sass = sass;
exports.fonts = gulp.series(icomoon, academicons);
exports.watch = watch;
exports.metadata = metadata;
