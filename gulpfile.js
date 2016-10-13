var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');
 
gulp.task('js', function () {
    gulp.src('./js/*.js')
        .pipe(concat('angular-weui.js')) 
        .pipe(gulp.dest('./dist/'))
        .pipe(rename({ suffix: '.min' }))
    	.pipe(uglify())
    	.pipe(gulp.dest('./dist/'))
});
 
gulp.task('default',['js']); 