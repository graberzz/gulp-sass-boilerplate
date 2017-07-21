var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	bs = require('browser-sync'),
	plumber = require('gulp-plumber'),
	runSeq = require('run-sequence'),
	htmlMin = require('gulp-htmlmin'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	mqPacker = require('css-mqpacker'),
	csso = require('gulp-csso'),
	autoprefixer = require('autoprefixer'),
	svgMin = require('gulp-svgmin'),
	imgMin = require('gulp-imagemin'),
	svgSprite = require('gulp-svgstore'),
	rename = require('gulp-rename'),
	jsMin = require('gulp-uglify');

gulp.task('html', function() {
	return gulp.src('*.html')
	.pipe(htmlMin({
		collapseWhitespace: true,
	}))
	.pipe(gulp.dest('src/'));
})

gulp.task('fonts', function() {
	return gulp.src('fonts/**/*')
	.pipe(gulp.dest('src/fonts/'));
})

gulp.task('style', function() {
	return gulp.src('style/main.scss')
	.pipe(plumber())
	.pipe(sass())
	.pipe(postcss([
		autoprefixer(),
		mqPacker(),
		]))
	.pipe(csso())
	.pipe(rename('style.css'))
	.pipe(gulp.dest('src/css/'));
});

gulp.task('js', function() {
	return gulp.src('js/*.js')
	.pipe(jsMin())
	.pipe(gulp.dest('src/js/'));
});

gulp.task('svg', function() {
	return gulp.src('img/icons/*.svg')
	.pipe(plumber())
	.pipe(svgMin())
	.pipe(svgSprite())
	.pipe(gulp.dest('src/img/'));
});

gulp.task('img', function() {
	return gulp.src('img/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(plumber())
	.pipe(imgMin({
		progressive: true,
    	optimizationLevel: 3,
		}))
	.pipe(gulp.dest('src/img/'));
});

gulp.task('serve', function() {
	bs({
        server: {
            baseDir: "src"
        },
        notify: false,
    });
});

gulp.task('watch', function() {
	gulp.watch('style/**/*.scss', ['style', bs.reload]);
	gulp.watch('fonts/**/*', ['fonts', bs.reload]);
	gulp.watch('*.html', ['html', bs.reload]);
	gulp.watch('js/**/*.js', ['js', bs.reload]);
	gulp.watch('img/**/*.+(png|jpg|jpeg|gif)', ['img', bs.reload]);
	gulp.watch('img/icons/*.svg', ['svg', bs.reload]);
});

gulp.task('default', function(f) {
	runSeq(
		'html',
		'fonts',
		'style',
		'js',
		'svg',
		'img',
		'serve',
		'watch',
		f
		);
});