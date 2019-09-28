var gulp = require('gulp');
var less = require("gulp-less")
var cleanCSS = require("gulp-clean-css");
var imagemin= require("gulp-imagemin");
var livereload = require("gulp-livereload");
var plumber = require("gulp-plumber");
var rename =require("gulp-rename");
var sourcemaps =require( "gulp-sourcemaps");
let uglify = require('gulp-uglify-es').default;
var pump = require("pump");

gulp.task('default', ['watch']);

gulp.task('compileLess', function () {
  return gulp.src('src/less/style.less')
  	.pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix:'.min'}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'))
    .pipe(livereload());
});

gulp.task('build-js', function(cb) {
  pump([gulp.src('src/js/*.js'),
    gulp.dest('dist/js/'),
    uglify(),
    rename({suffix:'.min'}),
    gulp.dest('dist/js/'),
    livereload()
    ], 
    cb
  );
});
gulp.task('buildIndex', function(){
	return gulp.src('src/**/*.html')
	.pipe(gulp.dest('dist/'))
	.pipe(livereload());
});
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch('src/js/*.js', ['build-js']);
	gulp.watch('src/less/*',['compileLess']);
	gulp.watch('src/**/*.html', ['buildIndex']);
})