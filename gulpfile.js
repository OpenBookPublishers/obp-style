const gulp = require('gulp');
const gulpsass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const favicons = require('gulp-favicons');
const mustache = require('gulp-mustache');
const config = require('./config');
const del = require('del');

const paths = {
  source: {
    sass: './src/sass/*.scss',
    icomoon: './node_modules/icomoon/fonts/*',
    academicons: './node_modules/academicons/fonts/*',
    favicon: './favicon.png',
    templates: './src/templates/*.mustache'
  },
  output: {
    root: './dist',
    css: './dist/css',
    icons: './dist/icons',
    meta: './dist/icons/{*.xml,*.json,*.html,*.webapp}',
    fonts: './dist/fonts'
  }
};

function clean() {
  return del(paths.output.root, { force: true });
};

function watch() {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
};

function icomoon() {
  return gulp.src(paths.source.icomoon)
    .pipe(gulp.dest(paths.output.fonts));
}

function academicons() {
  return gulp.src(paths.source.academicons)
    .pipe(gulp.dest(paths.output.fonts));
}

function sass() {
  return gulp.src(paths.source.sass)
    .pipe(sourcemaps.init())
    .pipe(gulpsass({outputStyle: 'compact', precision: 10})
      .on('error', gulpsass.logError)
    )
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest(paths.output.css))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.output.css));
};

function icons() {
  return gulp.src(paths.source.favicon)
    .pipe(
      favicons({
        appName: config.APP_NAME,
        appShortName: config.APP_SHORTNAME,
        appDescription: config.APP_DESCRIPTION,
        background: config.APP_BACKGROUNDCOLOR,
        theme_color: config.APP_THEMECOLOR,
        developerName: config.APP_DEVELOPERNAME,
        developerURL: config.APP_DEVELOPERURL,
        lang: config.APP_LANGUAGE,
        path: config.APP_ICONSPATH,
        url: config.APP_URL,
        display: config.APP_DISPLAY,
        orientation: config.APP_ORIENTATION,
        scope: '/',
        start_url: config.APP_STARTURL,
        version: 1.0,
        logging: false,
        html: 'webapp.html',
        pipeHTML: true,
        replace: true,
      })
    )
    .pipe(gulp.dest(paths.output.icons))
    // favicons output both icons and metadata files to the same directory
    // now we move the metdata files to the root to keep them separate
    .on('end', function() {
        gulp.src(paths.output.meta)
          .pipe(gulp.dest(paths.output.root))
          .on('end', function() {
              del(paths.output.meta, { force: true });
          });
      });
}

function metadata() {
  return gulp.src(paths.source.templates)
    .pipe(mustache(config))
    .pipe(rename({
          extname: ""  // removes the .mustache extension from template files
    }))
    .pipe(gulp.dest(paths.output.root));
};

exports.default = gulp.series(sass, icomoon, academicons, icons, metadata);
exports.all = exports.default;
exports.clean = clean;
exports.sass = sass;
exports.icons = icons;
exports.fonts = gulp.series(icomoon, academicons);
exports.watch = watch;
exports.metadata = metadata;
