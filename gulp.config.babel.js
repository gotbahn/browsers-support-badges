module.exports = () => {
    const
        root = './',
        src = root + 'src/',
        temp = root + '.tmp/',
        config = {
            root: root,
            src: src,
            temp: temp,
            prod: root + 'prod/',
            allScripts: [
                root + '*.js',
                src + '**/*.js'
            ],
            index: src + 'index.html',
            compiledStyles: temp + 'styles/css/**/*.css',
            compiledScripts: temp + 'scripts/**/*.js',
            html: src + '**/*.html',
            fonts: [
                'bower_components/octicons/octicons/octicons.{svg,ttf,eot,woff}'
            ],
            images: src + 'images/**/*.*',
            scripts: src + '**/*.js',
            jsx: src + '**/*.jsx',
            sass: src + 'styles/scss/**/*.{scss, sass}',
            bower: {
                json: require('./bower.json'),
                directory: root + 'bower_components/',
                ignorePath: '../..'
            },
            packages: [
                root + 'package.json',
                root + 'bower.json'
            ],
            reloadDelay: 0,
            port: 9000
        };
    return config;
};
