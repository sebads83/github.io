//*********** IMPORTS *****************
var gulp 		 = require('gulp');
var gutil 		 = require('gulp-util');
var	concat 		 = require('gulp-concat');
var sass 		 = require('gulp-ruby-sass');
var sourcemaps   = require('gulp-sourcemaps');
var rename 		 = require("gulp-rename");
var uglify 		 = require("gulp-uglify");
var minifyCss    = require('gulp-minify-css');
var minifyHTML 	 = require('gulp-minify-html');
var watch        = require('gulp-watch');
var	wait 		 = require('gulp-wait');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

gulp.task('sass', function(){
  	return sass('scss/*.scss', {
	  		style: 'expanded',
	  		emitCompileError: true
	  	})
  		.on('error', sass.logError)
    	.pipe(gulp.dest('./tmp/css'));
});

gulp.task('scripts', function(){
	return gulp.src([
            'libs/jquery/jquery.js',
            'libs/tiny/tiny.js',
            'libs/chico/ui/chico.js',
            'js/*.js'
        ])
		.pipe(sourcemaps.init())
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('tmp'))
        .pipe(rename('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps', {addComment: false}))
        .pipe(gulp.dest('js/min'));
});

gulp.task('minify-css', function() {
    return gulp.src([
            'libs/chico/ui/chico.min.css',
            'tmp/css/*.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(concat('styles.css'))
        .pipe(wait(1500))
        .pipe(minifyCss())
        .on('error', function(err) {
                gutil.log(err.message);
                gutil.beep();
        })
        .pipe(sourcemaps.write('./maps', {addComment: false}))
        .pipe(gulp.dest('css'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./index_expanded.html')
    .pipe(minifyHTML(opts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
    gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('tmp/css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('index_expanded.html', ['minify-html']);
});

gulp.task('default', ['sass', 'scripts', 'minify-html', 'minify-css', 'watch']);