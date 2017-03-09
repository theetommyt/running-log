const gulp = require('gulp');


gulp.task('html', function() {
  gulp.src('source/*.html')
    .pipe(gulp.dest('public'));
)};
