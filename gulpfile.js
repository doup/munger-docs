var argv = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync').create();
var del = require('del');
var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var isPublishTask = argv._[0] == 'publish';
var reloadBrowser = function reloadBrowser(done) { browserSync.reload(); done(); };

if (isPublishTask) {
    var baseUrl = 'https://doup.github.io/munger';
} else {
    var baseUrl = '';
}

gulp.task('clean', function () {
    return del(['docs']);
});

gulp.task('copy:font-awesome', function (done) {
    return gulp.src('node_modules/munger/node_modules/font-awesome/fonts/**/*')
        .pipe(gulp.dest('docs/assets/fonts'));
});

//gulp.task('copy:public', function (done) {
//    return gulp.src('src/docs/public/**/*')
//        .pipe(gulp.dest('docs'));
//});

gulp.task('pug', function () {
    return gulp.src('src/docs/**/*.pug')
        .pipe(pug({
            basedir: 'src',
            locals: {
                url: (url) => baseUrl + url,
            }
        }))
        .pipe(gulp.dest('docs'));;
});

gulp.task('serve', function (done) {
    browserSync.init({
        server: {
            baseDir: 'docs'
        }
    }, done);
});

gulp.task('scss', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            includePaths: [
                'node_modules/munger/node_modules/font-awesome/scss',
                'node_modules/munger/node_modules/foundation-sites/scss',
                'node_modules/munger/node_modules/magnific-popup/dist',
                'node_modules/munger/src/scss',
                'src/scss',
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('docs/assets'));
});

gulp.task('watch', function () {
    gulp.watch('src/**.pug', gulp.series('pug', reloadBrowser));
    gulp.watch('src/**.scss', gulp.series('scss', reloadBrowser));
});

gulp.task('copy', gulp.series('copy:font-awesome'));
gulp.task('build', gulp.series('pug', 'scss', 'copy'));
gulp.task('default', gulp.series('clean', 'build', 'serve', 'watch'));
