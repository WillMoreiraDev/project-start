const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const htmlLint = require('gulp-htmlhint');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


function compilaSass() {
    return gulp.src(['./lib/swiper/swiper-bundle.min.css', './scss/**/*.scss'])
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        cascade: false
    }))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

function gulpJS() {
    return gulp
    .src([
        'lib/swiper/swiper-bundle.min.js',
        'js/scripts/main.js',
    ])
    .pipe(concat('all.min.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}


function browser() {
    browserSync.init({
        server:  {
            baseDir: "./"
        }
    })
}

function validationHTML() {
    return gulp.src('*.html')
        .pipe(htmlLint('htmlhintrc.json'))
        .pipe(htmlLint.reporter('htmlhint-stylish'))
        .pipe(htmlLint.failOnError({suppress : true}));
}

function watch() {
    gulp.watch('./scss/*.scss', compilaSass);
    gulp.watch('js/scripts/*.js' , gulpJS);
    gulp.watch(['*.html']).on('change', browserSync.reload);
    gulp.watch(['*.html']).on('change', validationHTML);
}

gulp.task('sass', compilaSass);
gulp.task('mainjs', gulpJS);
gulp.task('browser-sync', browser);
gulp.task('watch', watch);
gulp.task('htmlLint', validationHTML);

gulp.task('default', gulp.parallel('watch', 'htmlLint', 'browser-sync', 'sass', 'mainjs'));

