var gulp      = require('gulp'),
sass          = require('gulp-sass'),
plumber       = require('gulp-plumber'),
autoprefixer  = require('gulp-autoprefixer'),
browserSync   = require('browser-sync'),
imagemin      = require('gulp-imagemin'),
pngquant      = require('imagemin-pngquant'),
notify        = require("gulp-notify"),
coffee        = require('gulp-coffee'),
browserify    = require('browserify'),
uglify        = require('gulp-uglify'),
source        = require('vinyl-source-stream'),
buffer        = require('vinyl-buffer');
sourcemaps    = require('gulp-sourcemaps');

var babelify = require('babelify');
var babel = require("gulp-babel");
var imagePath = './src/assets/img/',
publicImgDir  = './dist/',
// Sassファイルのディレクトリ
sassDir       = './src/assets/scss/',
// cssファイルのディレクトリ
cssDir        = './src/assets/css/',
// Jsファイルのディレクトリ
jsDir         = './src/assets/js/';


gulp.task('sass', function () {
  return gulp.src(sassDir + '*.scss')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/assets/'))
    .pipe(browserSync.stream())
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    reloadDelay: 500
  });
});

gulp.task('js-minify', function(){
  browserify({
    entries: ['src/assets/js/script.js']
  })
    .bundle()
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(source('mirumaker.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/'));
});

// デフォルト
gulp.task('default', ['browser-sync'], function() {
  gulp.watch(sassDir + '*.scss', ['sass']);
  gulp.watch(['src/**/*.html','src/*.html'], ['bs-reload']);
  gulp.watch(['src/assets/js/**/*.js'], ['js-minify']);
  gulp.watch(['dist/assets/js/**/*.js'], ['bs-reload']);
});
