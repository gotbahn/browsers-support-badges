import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import {stream as wiredep} from 'wiredep';
import {argv as args} from 'yargs';
import getConfig from './gulp.config.babel.js';
import gulpLoadPlugins from 'gulp-load-plugins';
import fs from 'fs';
import semver from 'semver';

const config = getConfig();
const $ = gulpLoadPlugins({lazy: true});
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

gulp.task('lint', () => gulp
	.src(config.allScripts)
	.pipe($.if(args.verbose, $.print()))
	.pipe($.eslint())
	.pipe($.eslint.format())
	.pipe($.eslint.failAfterError())
);

gulp.task('clean', function(done) {
	let delConfig = [].concat(config.prod, config.temp);
	log('Cleaning ' + $.util.colors.grey(delConfig));
	del(delConfig);
	done();
});

gulp.task('clean:fonts', function(done) {
	clean([config.temp + 'fonts/**/*.*']);
	done();
});

gulp.task('clean:fonts:prod', function(done) {
	clean([config.prod + 'fonts/**/*.*']);
	done();
});

gulp.task('clean:images', function(done) {
	clean(config.prod + 'images/**/*.*');
	done();
});

gulp.task('clean:styles', function(done) {
	clean(config.temp + '**/*.css');
	done();
});

gulp.task('clean:scripts', function(done) {
	clean(config.temp + '**/*.js');
	done();
});

gulp.task('clean:swf', function(done) {
	clean(config.prod + '**/*.swf');
	done();
});

gulp.task('clean:code', function(done) {
	const files = [].concat(
		config.temp + '**/*.js',
		config.prod + 'scripts/**.swf',
		config.prod + 'fonts/**.*',
		config.prod + '**/*.html',
		config.prod + 'scripts/**/*.js'
	);
	clean(files);
	done();
});

gulp.task('styles', gulp.series('clean:styles', function(done) {
	log('Compiling Sass ' + config.sass + ' to CSS ' + config.compiledStyles);
	gulp
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
	done();
}));

gulp.task('scripts', gulp.series('clean:scripts', function(done) {
	log('Compiling JSX ' + config.jsx + ' to JS ' + config.tempJS);
	gulp
		.src(config.jsx)
		.pipe($.plumber())
		.pipe($.react())
		.pipe(gulp.dest(config.temp));
	done();
}));

gulp.task('swf', gulp.series('clean:swf', function(done) {
	gulp
		.src(config.swf)
		.pipe($.plumber())
		.pipe(gulp.dest(config.prod + 'scripts/'));
	done();
}));

gulp.task('fonts', gulp.series('clean:fonts', function(done) {
	log('Copying fonts from ' + config.fonts + ' to ' + gulp.dest(config.temp + 'fonts'));
	gulp
		.src(config.fonts)
		.pipe(gulp.dest(config.temp + 'fonts/octicons'));
	done();
}));

gulp.task('fonts:prod', gulp.series('clean:fonts:prod', function(done) {
	log('Copying fonts from ' + config.fonts + ' to ' + gulp.dest(config.prod + 'fonts'));
	gulp.src(config.fonts)
		.pipe(gulp.dest(config.prod + 'fonts/octicons'));
	done();
}));

gulp.task('images', gulp.series('clean:images', function(done) {
	log('Copying & compressing images from ' + config.images);
	gulp
		.src(config.images)
		.pipe($.imagemin({
			optimizationLevel: 4
		}))
		.pipe(gulp.dest(config.prod + 'images'));
	done();
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
	gulp.parallel('scripts', 'swf', 'styles', 'fonts', 'wiredep'),
	function(done) {
		log('Injecting css & js into html');
		gulp
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
		done();
	})
);

gulp.task('optimize', gulp.series(
	gulp.parallel('inject'),
	function(done) {
		let	jsFilter = $.filter(['**/*.js'], {restore: true});
		let	cssFilter = $.filter(['**/*.css'], {restore: true});
		log('Optimizing js, css & html');
		gulp
			.src(config.index)
			.pipe($.plumber())
			.pipe($.useref())
			.pipe(cssFilter)
			.pipe($.csso())
			.pipe(cssFilter.restore)
			.pipe(jsFilter)
			.pipe($.uglify())
			.pipe(jsFilter.restore)
			.pipe($.rev())
			.pipe($.useref())
			.pipe($.revReplace())
			.pipe(gulp.dest(config.prod))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(config.prod));
		done();
	}));

gulp.task('build', gulp.series('clean', 'optimize', 'fonts:prod', 'images', function(done) {
	done();
}));

gulp.task('serve', gulp.series('inject', function(done) {
	serve();
	done();
}));

gulp.task('serve:prod', gulp.series(
	gulp.parallel('optimize', 'fonts:prod', 'images'),
	function(done) {
		serve('prod');
		done();
	}));

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

function serve(mode) {
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
		notify: false,
		reloadDelay: config.reloadDelay
	});
}

/**
 * Bumping version number and tagging the repository with it.
 *
 * --type=pre will bump prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump minor version *.x.*
 * --type=major will bump the major version x.*.*
 */
const bumpFiles = ['./package.json'];
const newVer = semver.inc(pkg.version, args.type);

gulp.task('bump', () => {
	log(`Versioning to v${newVer}`);

	return gulp
		.src(bumpFiles)
		.pipe($.bump({version: newVer}))
		.pipe($.print())
		.pipe(gulp.dest('./'));
});

gulp.task('git-add-bump', () => {
	log(`adding ${bumpFiles.join(', ')} to commit`);
	return gulp.src(bumpFiles).pipe($.git.add());
});

gulp.task('git-commit-bump', () => {
	return gulp.src('.').pipe($.git.commit(`publish: v${newVer}`));
});

gulp.task('git-tag-bump', done => {
	$.git.tag(`v${newVer}`, '', err => {
		if (err) throw err;
	});
	done();
});

gulp.task('git-push-bump', done => {
	$.git.push('origin', '', {args: ' --tags'}, err => {
		if (err) throw err;
	});
	done();
});

gulp.task('pimp', gulp.series(
	'bump',
	'git-add-bump',
	'git-commit-bump',
	'git-tag-bump',
	'git-push-bump'
), done => {
	done();
});
