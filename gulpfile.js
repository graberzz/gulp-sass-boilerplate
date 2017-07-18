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
	svgSprite = require('gulp-svgstore');

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
	return gulp.src('style/**/*.scss')
	.pipe(plumber())
	.pipe(sass())
	.pipe(concat('style.css'))
	.pipe(postcss([
		autoprefixer(),
		mqPacker(),
		]))
	.pipe(csso())
	.pipe(gulp.dest('src/css/'));
});

gulp.task('svg', function() {
	return gulp.src('img/icons/*.svg')
	.pipe(plumber())
	.pipe(svgMin())
	.pipe(svgSprite())
	.pipe(gulp.dest('src/img/'));
});

gulp.task('img', function() {
	return gulp.src('img/**/*.+(png|jpg|jpeg|gif)')
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
	gulp.watch('js/**/*.js', [bs.reload]);
	gulp.watch('img/**/*.+(png|jpg|jpeg|gif)', ['img', bs.reload]);
	gulp.watch('img/icons/*.svg', ['svg', bs.reload]);
});

gulp.task('default', function(f) {
	runSeq(
		'html',
		'fonts',
		'style',
		'svg',
		'img',
		'serve',
		'watch',
		f
		);
});