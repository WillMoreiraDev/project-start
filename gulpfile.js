const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


function compilaSass() {
    return gulp.src('./scss/**/*.scss')
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 3 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

gulp.task('sass', compilaSass);

function gulpJS() {
    return gulp
    .src(['./js/scripts/main.js'])
    .pipe(concat('all.min.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

gulp.task('mainjs', gulpJS);

function pluginJS() {
    return gulp
    .src([
        'lib/jquery/jquery.min.js',
        'lib/modernizr/modernizr-2.8.3.min.js',
        'lib/swiper/swiper.min.js',
        'lib/aos/aos.js'
    ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

function pluginCSS() {
    return gulp
    .src([
        'lib/fontawesome/font-awesome.min.css',
        'lib/swiper/swiper.min.css',
        'lib/aos/aos.css'
    ])
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

gulp.task('pluginjs', pluginJS);

gulp.task('plugincss', pluginCSS);

function browser() {
    browserSync.init({
        server:  {
            baseDir: "./"
        }
    })
}

gulp.task('browser-sync', browser);

function watch() {
    gulp.watch('./scss/*.scss', compilaSass);
    gulp.watch('js/scripts/*.js' , gulpJS);
    gulp.watch('lib/**/*.js' , pluginJS);
    gulp.watch('lib/**/*.css' , pluginCSS);
    gulp.watch(['*.html']).on('change', browserSync.reload);
}

gulp.task('watch', watch);

gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'mainjs', 'pluginjs', 'plugincss'));

