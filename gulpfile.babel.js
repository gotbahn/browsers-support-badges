import gulp                from 'gulp';
import del                 from 'del';
import browserSync         from 'browser-sync';
import {stream as wiredep} from 'wiredep';
import {argv as args}      from 'yargs';
import getConfig           from './gulp.config.babel.js';
import gulpLoadPlugins     from 'gulp-load-plugins';

const config = getConfig(),
      $      = gulpLoadPlugins({lazy: true});

gulp.task('lint', () => {
    log('Analyzing JS code with JSHint & JSCS');
    return gulp
        .src(config.allScripts)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs({esnext: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('clean', (done) => {
    let delConfig = [].concat(config.prod, config.temp);
    log('Cleaning ' + $.util.colors.grey(delConfig));
    del(delConfig, done);
});

gulp.task('clean:fonts', (done) => {
    clean([config.temp + 'fonts/**/*.*'], done);
});

gulp.task('clean:fonts:prod', (done) => {
    clean([config.prod + 'fonts/**/*.*'], done);
});

gulp.task('clean:images', (done) => {
    clean(config.prod + 'images/**/*.*', done);
});

gulp.task('clean:styles', (done) => {
    clean(config.temp + '**/*.css', done);
});

gulp.task('clean:scripts', (done) => {
    clean(config.temp + '**/*.js', done);
});

gulp.task('clean:code', (done) => {
    const files = [].concat(
        config.temp + '**/*.js',
        config.prod + 'fonts/**.*',
        config.prod + '**/*.html',
        config.prod + 'scripts/**/*.js'
    );
    clean(files, done);
});

gulp.task('styles', gulp.series('clean:styles', () => {
    log('Compiling Sass ' + config.sass + ' to CSS ' + config.compiledStyles);
    return gulp
        .src(config.sass)
        .pipe($.plumber())
        .pipe($.sass({
            includePaths: [config.bower.directory + '/octicons/octicons']
        }))
        .pipe($.autoprefixer({
            browsers: [
                'last 2 version',
                 '> 5%'
                 ]
        }))
        .pipe(gulp.dest(config.temp + 'styles/css/'));
}));

gulp.task('scripts', gulp.series('clean:scripts', () => {
    log('Compiling JSX ' + config.jsx + ' to JS ' + config.tempJS);
    return gulp
        .src(config.jsx)
        .pipe($.plumber())
        .pipe($.react())
        .pipe(gulp.dest(config.temp));
}));

gulp.task('fonts', gulp.series('clean:fonts', () => {
    log('Copying fonts from ' + config.fonts + ' to ' + gulp.dest(config.temp + 'fonts'));
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.temp + 'fonts/octicons'));
}));

gulp.task('fonts:prod', gulp.series('clean:fonts:prod', () => {
    log('Copying fonts from ' + config.fonts + ' to ' + gulp.dest(config.prod + 'fonts'));
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.prod + 'fonts/octicons'));
}));

gulp.task('images', gulp.series('clean:images', () => {
    log('Copying & compressing images from ' + config.images);
    return gulp
        .src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 4
        }))
        .pipe(gulp.dest(config.prod + 'images'));
}));

gulp.task('wiredep', () => {
    log('Bowering css & js into html');
    return gulp
        .src(config.index)
        .pipe(wiredep({
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        }))
        .pipe(gulp.dest(config.src));
});

gulp.task('inject', gulp.series(
    gulp.parallel('scripts', 'styles', 'fonts', 'wiredep'),
    () => {
        log('Injecting css & js into html');
        return gulp
            .src(config.index)
            .pipe($.inject(
                gulp.src([
                    config.compiledStyles,
                    config.scripts,
                    config.compiledScripts
                ]),
                {relative: true}
            ))
            .pipe(gulp.dest(config.src));
    })
);

gulp.task('optimize', gulp.series(
    gulp.parallel('inject', 'fonts:prod'),
    () => {
        let assets = $.useref.assets({
                searchPath: config.src
            }),
            jsFilter = $.filter(['**/*.js'], {restore: true}),
            cssFilter = $.filter(['**/*.css'], {restore: true});
        log('Optimizing js, css & html');
        return gulp
            .src(config.index)
            .pipe($.plumber())
            .pipe(assets)
            .pipe(cssFilter)
            .pipe($.csso())
            .pipe(cssFilter.restore)
            .pipe(jsFilter)
            .pipe($.uglify())
            .pipe(jsFilter.restore)
            .pipe($.rev())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(gulp.dest(config.prod))
            .pipe($.rev.manifest())
            .pipe(gulp.dest(config.prod));
}));

/*
 * Bump the version
 * --type=pre will bump prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --ver=1.2.3 will bump to a specific version and ignore other flags
 */

gulp.task('bump', () => {
    let msg = 'Versioning ',
        type = args.type,
        version = args.ver,
        options = {};

    if (version) {
        options.version = version;
        msg += 'to ' + version;
    } else {
        options.type = type;
        msg += 'for a ' + type;
    }
    log(msg);
    return gulp
        .src(config.packages)
        .pipe($.bump(options))
        .pipe($.print())
        .pipe(gulp.dest(config.root));
});

gulp.task('serve', gulp.series('inject', () => {
    serve();
}));

gulp.task('serve:prod', gulp.series('optimize', () => {
    serve('prod');
}));

gulp.task('build', gulp.series(
    gulp.parallel('clean', 'optimize'),
    () => {
        log('Building application...');
    }
));

gulp.task('default', gulp.series('serve'));

function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.gray(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.gray(msg));
    }
}

function clean(path, done) {
    log('Cleaning ' + $.util.colors.gray(path));
    del(path, done);
}

function changeEvent(event) {
    let srcPattern = new RegExp('/.*(?=/' + config.src + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function serve (mode) {
    let baseDir = [];

    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser sync on port ' + config.port);

    if (mode === 'prod') {
        baseDir = [config.prod];
    } else {
        baseDir = ['src'];
        gulp.watch(
                [config.sass, config.scripts, config.jsx, config.html],
                gulp.series('inject', () => {
                    browserSync.reload();
                })
            )
            .on('change', (event) => {
                changeEvent(event);
            });
    }

    browserSync({
        port: config.port,
        server: {
            baseDir: baseDir,
            routes: {
                '/.tmp': '.tmp',
                '/bower_components': 'bower_components'
            }
        },
        /* ghostMode: {
            click: true,
            location: false,
            forms: true,
            scroll: true
        }, */
        notify: false,
        reloadDelay: config.reloadDelay
    });
}
