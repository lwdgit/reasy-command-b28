'use strict';

exports.name = 'webfont';
'use strict';

exports.usage = '[options]';
exports.desc = 'b28 helper';

exports.options = {
    '-k, --key <defaultLang>': 'set defaultLang ,default is `en`',
    '-s, --src <srcdir>': 'set file(support xlsx,xls,csv,xml) path',
    '-r, --root <rootdir>': 'set project root',
    '-d, --dest <destdir>': 'set output dir'
};


var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var exists = fs.existsSync;
var excel = require('./core/excel');


exports.run = function(argv, cli, env) {

    var root = env.configBase || process.cwd();

    var filepath = env.configPath || path.resolve(root, 'fis-conf.js');

    if (argv.h || argv.help) {
        return cli.help(exports.name, exports.options);
    }

    if (exists(filepath)) {
        require(filepath);
    }

    //读取配置，命令行参数优先
    var settings = fis.config.get("b28") || {};
    settings.s = argv.s || argv.src || settings.src;

    settings.root = argv.r || argv.root || fis.project.getProjectPath();

    if (fis.util.isFile(settings.s)) {
        settings.file = settings.s;
    } else {
        var files = fis.project.getSourceByPatterns(settings.s);
        if (!files) {
            fis.log.warn('can`t find any files to translate!');
            return;
        }
        for(var f in files) {
            settings.file = files[f].fullname;
            break;
        }
    }
    
    if (!settings.file) {
        fis.log.error('can`t find file: ' + settings.file);
        return;
    }

    settings.dest = argv.d || argv.dest || settings.dest;

    if (!path.isAbsolute(settings.dest)) {
        settings.dest = path.join(settings.root, settings.dest);
    }

    settings.k = argv.k || argv.key || settings.key;

    if (argv.v) {
        fis.log.info(settings);
    }
    excel.parse(settings);
};
