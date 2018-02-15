var gulp = require('gulp');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var autoprefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');
var babel = require('gulp-babel');

gulp.task('clean', function () {
    return gulp.src('docs', {read: false})
        .pipe(clean());
});

gulp.task('css', ['clean'], function () {
    return gulp.src('./css/*.css')
        .pipe(concat('bundle.css'))
        .pipe(autoprefix())
        .pipe(csso())
        .pipe(gulp.dest('./docs/styles'));
});

gulp.task('js', ['css'], function () {
    return gulp.src('./js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('bundle.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./docs/scripts/'))
});

gulp.task('assets', ['js'], function () {
    return gulp.src('./assets/**/*.*')
        .pipe(gulp.dest('./docs/assets/'))
});

gulp.task('html', ['assets'], function () {
    return gulp.src('./*.html')
        .pipe(htmlreplace({
            css: './styles/bundle.css',
            js: './scripts/bundle.js'
        }))
        .pipe(gulp.dest('./docs'))
});

gulp.task('default', ['clean', 'css', 'js', 'html']);