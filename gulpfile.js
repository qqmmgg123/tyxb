var gulp = require('gulp');
var gutil = require('gulp-util');
var sftp = require('gulp-sftp');
var less = require('gulp-less');
var uglifyJs = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyejs = require('gulp-minify-ejs');
var path = require('path');
var argv = require('yargs').argv;

var file = argv.file;

gulp.task('less', function () {
  return gulp.src('./public/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('mobileless', function () {
  return gulp.src('./public/mobileless/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'mobileless', 'includes') ]
    }))
    .pipe(gulp.dest('./public/mobilecss'));
});

gulp.task('minify-css', function() {
    return gulp.src('./public/css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./mini/css'))
});

gulp.task('minify-mcss', function() {
    return gulp.src('./public/mobilecss/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./mini/mobilecss'))
});

gulp.task("compress", function() {
    return gulp.src('./public/js/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./mini/js'));
});

gulp.task("compress_m", function() {
    return gulp.src('./public/mobilejs/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./mini/mobilejs'));
});

gulp.task('minify-html', function() {
    return gulp.src('./views/**/*.html')
        .pipe(minifyejs())
        .pipe(gulp.dest('./mini/html'));
});

gulp.task("compress_s", function() {
    return gulp.src('./public/js/' + file + '.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./mini/js'));
});

gulp.task('mh', function() {
    return gulp.src('./views/**/' + file + '.html')
        .pipe(minifyejs())
        .pipe(gulp.dest('./mini/html'));
});

// sftp
gulp.task('sftp', function () {
    return gulp.src('mini/**')
        .pipe(sftp({
            host: '139.224.40.203',
            user: 'root',
            pass: 'Qnmdwbd0000',
            remotePath: '/home/test'
        }))
});

// css任务
gulp.task('default', function() {
    gulp.run(file || 'less');

    gulp.watch([
        './public/' + (file || 'less') + '/*.less',
    ], function(event) {
        gulp.run(file || 'less');
    });
});

// 打包任务
gulp.task('build', [
    'minify-css',
    'minify-mcss',
    'minify-html',
    'compress',
    'compress_m'
], function() {
});

