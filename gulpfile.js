// get packages
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();


// development mode
const devBuild = (process.env.NODE_ENV !== 'production')


// set directories
const directory = {
  src: 'src/',
  dist: 'dist/'
};


// copy over html file from source to public
gulp.task('html', function() {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
});


// compile sass to minified css with sourcemaps & autoprefix
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



// browserSync static server + watch sass & html files
gulp.task('serve', ['styles', 'html'], function() {
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
