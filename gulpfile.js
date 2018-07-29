const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const babel = require("gulp-babel"); // See .babelrc for how Babel is configured
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

gulp.task('sass', function(){
    return gulp.src('src/scss/main.scss')
    .pipe(sass()) // Compiles Sass to CSS
    .pipe(cleanCSS()) // Minifies compiled CSS
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('public/css')) // Moves compiled files to final location
});

gulp.task('js', function() {
    return gulp.src('src/js/main.js')
    .pipe(rename('main.min.js'))
    .pipe(babel()) // Transpiles ES6 (ES2015) JS down to ES5 so it works in older browsers
    .pipe(uglify()) // Minifies Javascript
    .pipe(gulp.dest('public/js'))
});

gulp.task('js-dependencies', function() {
    // Move needed JS out of the node_modules folder otherwise Express won't serve it
    return gulp.src('node_modules/babel-polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('public/js/dependencies/babel-polyfill/dist'))
});

gulp.task('watch', function() {
  // If any .scss files change, automatically run the relevant compilation task
  gulp.watch(['src/scss/**/*.scss','src/scss/*.scss'], ['sass']);
  // If the main JS source file changes, re-compile
  gulp.watch(['src/js/main.js'], ['js']);
});

// This task runs when you type "gulp" into the terminal
gulp.task('default', ['sass', 'js', 'js-dependencies', 'watch']);

// This task runs when you type "gulp build" into the terminal.
gulp.task('build', ['sass', 'js', 'js-dependencies']);
