// All used modules.
var gulp = require('gulp');
var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');

var babel = require('gulp-babel');
var runSeq = require('run-sequence');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
// var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
// var mocha = require('gulp-mocha');
// var karma = require('karma').server;
// var istanbul = require('gulp-istanbul');
var notify = require('gulp-notify');

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

 
// gulp.task('build', ['copy'], function () { 
//   return gulp.src('./app/index.html') 
//     .pipe(usemin({ 
//       js: [uglify()] 
//     })) 
//     .pipe(gulp.dest('build/')); 
// }); 


gulp.task('lintJS', function () {

    return gulp.src(['./app/scripts/**.js', './app/**.js'])
        .pipe(plumber({
            errorHandler: notify.onError('Linting FAILED! Check your gulp process.')
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());

});

gulp.task('buildJS', ['lintJS'], function () {
    return gulp.src(['./app/app.js', './app/scripts/**/**.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/assets'));
});

gulp.task('buildCSS', function () {

    var sassCompilation = sass();
    sassCompilation.on('error', console.error.bind(console));

    return gulp.src('./app/scss/main.scss')
        .pipe(plumber({
            errorHandler: notify.onError('SASS processing failed! Check your gulp process.')
        }))
        .pipe(sourcemaps.init())
        .pipe(sassCompilation)
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./app/assets'));
});


// Production tasks
// --------------------------------------------------------------

// gulp.task('buildCSSProduction', function () {
//     return gulp.src('./app/scss/main.scss')
//         .pipe(sass())
//         .pipe(rename('style.css'))
//         .pipe(minifyCSS())
//         .pipe(gulp.dest('./assets'))
// });

// gulp.task('buildJSProduction', function () {
//     return gulp.src(['./app/**/**.js', './app/app.js'])
//         .pipe(concat('main.js'))
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(ngAnnotate())
//         .pipe(uglify())
//         .pipe(gulp.dest('./assets'));
// });


// Composed tasks
// --------------------------------------------------------------

gulp.task('build', function () {
    if (process.env.NODE_ENV === 'production') {
        runSeq(['buildJSProduction', 'buildCSSProduction']);
    } else {
        runSeq(['buildJS', 'buildCSS']);
    }
});

gulp.task('default', function () {

    gulp.start('build');

    // Run when anything inside of app/scripts changes.
    gulp.watch('app/scripts/**', function () {
        runSeq('buildJS', 'reload');
    });

    // // Run when anything inside of browser/scss changes.
    gulp.watch('app/scss/**', function () {
        runSeq('buildCSS', 'reloadCSS');
    });

    gulp.watch('app/scripts/**/*.js', ['lintJS']);

    // // Run server tests when a server file or server test file changes.
    // gulp.watch(['tests/server/**/*.js'], ['testServerJS']);

    // // Run browser testing when a browser test file changes.
    // gulp.watch('tests/browser/**/*', ['testBrowserJS']);

    livereload.listen();
});
