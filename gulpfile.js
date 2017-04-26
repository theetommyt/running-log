// get packages //
const gulp = require('gulp');

const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');

const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create();


// development mode //
const devBuild = (process.env.NODE_ENV !== 'production')


// set directories //
const directory = {
  src: 'src/',
  dist: 'dist/'
};


// HTML processing //
gulp.task('html', ['images'], function() {
  const out = directory.dist
  const page = gulp.src(directory.src + '*.html')
    .pipe(newer(out));

    // minify production html
    if (!devBuild) {
      page = page.pipe(htmlclean())
    }

    return page.pipe(gulp.dest(out));
});


// compile sass to minified css with sourcemaps & autoprefix //
gulp.task('styles', function() {
  gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/css/'))
  .pipe(browserSync.stream());
});


// image processing //
gulp.task('images', function() {
  const out = directory.dist + 'img/';
  return gulp.src(directory.src + 'img/**/*')
    .pipe(newer(out))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(out));
});

// JavaScript Tasks //

// eslint //
gulp.task('lint', function() {
  return gulp.src(directory.src + '/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// JS concat, minify after lint task
gulp.task('scripts', ['lint'], function(){
  return gulp.src(directory.src + '/scripts/**/*.js')
    .pipe(concat('js_bundle.js'))
    .pipe(gulp.dest(directory.dist + '/scripts'));
});



// browserSync static server + watch sass & html files //
gulp.task('serve', ['styles', 'html', 'scripts'], function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });

  gulp.watch('./src/scss/**/*.scss', ['styles']);
  gulp.watch('./src/*.html').on('change', browserSync.reload);
});



// default task
gulp.task('default', ['serve'], function() {
  console.log('Have a Coke and a smile!');
});
