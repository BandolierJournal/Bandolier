// All used modules.
var gulp = require('gulp');
var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');

// var babel = require('gulp-babel');
// var plumber = require('gulp-plumber');
// var concat = require('gulp-concat');
// var rename = require('gulp-rename');
// var sass = require('gulp-sass');
// var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
// var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
// var eslint = require('gulp-eslint');
// var mocha = require('gulp-mocha');
// var karma = require('karma').server;
// var istanbul = require('gulp-istanbul');
// var notify = require('gulp-notify');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./');
var destDir = projectDir.cwd('./build');
// Development tasks
// --------------------------------------------------------------

// Live reload business.
gulp.task('reload', function () {
    livereload.reload();
});

gulp.task('clean', function (callback) { 
    return destDir.dirAsync('.', { empty: true }); 
});

gulp.task('copy', ['clean'], function () { 
    return projectDir.copyAsync('app', destDir.path(), { 
        overwrite: true, matching: [ 
            './node_modules/**/*', 
            '*.html', 
            '*.css', 
            'main.js', 
            'package.json' 
       ] 
    }); 
});

 
gulp.task('build', ['copy'], function () { 
  return gulp.src('./index.html') 
    .pipe(usemin({ 
      js: [uglify()] 
    })) 
    .pipe(gulp.dest('build/')); 
    }); 


// gulp.task('lintJS', function () {

//     return gulp.src(['./browser/js/**/*.js', './server/**/*.js'])
//         .pipe(plumber({
//             errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
//         }))
//         .pipe(eslint())
//         .pipe(eslint.format())
//         .pipe(eslint.failOnError());

// });

// gulp.task('buildJS', ['lintJS'], function () {
//     return gulp.src(['./app/app.js', './app/js/**/*.js'])
//         .pipe(plumber())
//         .pipe(sourcemaps.init())
//         .pipe(concat('main.js'))
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('./public'));
// });



// Production tasks
// --------------------------------------------------------------




// Composed tasks
// --------------------------------------------------------------

gulp.task('default', function () {

    gulp.start('build');

    // Run when anything inside of browser/js changes.
    gulp.watch('browser/js/**', function () {
        runSeq('buildJS', 'reload');
    });

    // Run when anything inside of browser/scss changes.
    gulp.watch('browser/scss/**', function () {
        runSeq('buildCSS', 'reloadCSS');
    });

    gulp.watch('server/**/*.js', ['lintJS']);

    // Reload when a template (.html) file changes.
    gulp.watch(['browser/**/*.html', 'server/app/views/*.html'], ['reload']);

    // Run server tests when a server file or server test file changes.
    gulp.watch(['tests/server/**/*.js'], ['testServerJS']);

    // Run browser testing when a browser test file changes.
    gulp.watch('tests/browser/**/*', ['testBrowserJS']);

    livereload.listen();

});
