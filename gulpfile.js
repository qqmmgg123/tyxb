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
        .pipe(gulp.dest('./release/public/css'))
});

gulp.task('minify-mcss', function() {
    return gulp.src('./public/mobilecss/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./release/public/mobilecss'))
});

gulp.task("compress", function() {
    return gulp.src('./public/js/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./release/public/js'));
});

gulp.task("compress_m", function() {
    return gulp.src('./public/mobilejs/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./release/public/mobilejs'));
});

gulp.task("compress_lib", function() {
    return gulp.src('./public/lib/*.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./release/public/lib'));
});

gulp.task('minify-html', function() {
    return gulp.src('./views/**/*.html')
        .pipe(minifyejs())
        .pipe(gulp.dest('./release/views'));
});

gulp.task("compress_s", function() {
    return gulp.src('./public/js/' + file + '.js')
        .pipe(uglifyJs())
        .pipe(gulp.dest('./release/public/js'));
});

gulp.task('mh', function() {
    return gulp.src('./views/**/' + file + '.html')
        .pipe(minifyejs())
        .pipe(gulp.dest('./release/views'));
});

gulp.task('copy_models', function () {
    gulp.src('./models/**/*.js')
        .pipe(gulp.dest('./release/models'));
});

gulp.task('copy_const', function () {
    gulp.src('./const/**/*.js')
        .pipe(gulp.dest('./release/const'));
});

gulp.task('copy_routers', function () {
    gulp.src('./routers/**/*.js')
        .pipe(gulp.dest('./release/routers'));
});

gulp.task('copy_fonts', function () {
    gulp.src('./public/fonts/**/*')
        .pipe(gulp.dest('./release/public/fonts'));
});

gulp.task('copy_files', function () {
    gulp.src([
      './routes.js',
      './common.js',
      './striptags.js'
    ], {base: './'})
        .pipe(gulp.dest('./release'));
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
    'less',
    'mobileless',
    'minify-css',
    'minify-mcss',
    'minify-html',
    'compress',
    'compress_m',
    //'compress_lib',
    'copy_models',
    'copy_const',
    'copy_routers',
    'copy_fonts',
    'copy_files'
], function() {
});

