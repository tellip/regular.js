let gulp = require('gulp'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean');

exports.clean = () => gulp.src('dist', {read: false, allowEmpty: true})
    .pipe(clean());

exports.js = () => gulp.src('src/**/*.js')
    .pipe(babel({
        plugins: ['@babel/plugin-proposal-do-expressions']
    }))
    .pipe(gulp.dest('dist'));

exports.default = gulp.series(
    exports.clean,
    exports.js,
    () => gulp.watch('src/**/*.js', exports.js)
);
