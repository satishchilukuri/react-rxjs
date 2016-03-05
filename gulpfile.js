var gulp = require('gulp');
var babelify = require("babelify");
var browserify = require('browserify');
var buffer = require('vinyl-buffer')
var debug = require('gulp-debug');
var del = require('del');
var es = require('event-stream');
var glob = require('glob');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var libs = [
    'react',
    'react-dom',
    'rx-lite'
];

var props = {
    jsxFiles: 'src/*.jsx',
    buildDir: 'build/',
};

gulp.task('clean', function(cb) {
    del(['build/*.js'], cb);
});

gulp.task('vendor', function() {
    var b = browserify(null, {debug: false});
    libs.forEach(function(lib) {
        b.require(lib);
    });
    return b.bundle()
        .pipe(source('noop.js')) // dummy file
        .pipe(rename('vendor.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(props.buildDir));
});

gulp.task('jsx', function(done) {
    glob(props.jsxFiles, function(err, files) {
        if(err) {
            done(err);
        }
        var tasks = files.map(function(entry) {
            var b = browserify({entries: [entry]}, {debug: true});
            libs.forEach(function(lib) {
                b.external(lib);
            });
            b.transform(babelify);
            return b.bundle()
                .pipe(source(entry))
                .pipe(rename(function(path){
                    path.dirname = ""; // blank out dirname so that we are left only with filename
                    path.extname = ".js"; // Re-name extension from jsx to js
                }))
                .pipe(buffer())
                .pipe(gulp.dest(props.buildDir));
        });
        es.merge(tasks).on('end', done);
    });
});

gulp.task('default', ['vendor','jsx'], function() {
});