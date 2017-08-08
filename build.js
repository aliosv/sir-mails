var FS = require('fs'),
    PATH = require('path'),

    borschik = require('borschik'),
    vow = require('vow');

['temp', 'dist'].forEach(function(dir) {
    try {
        FS.lstatSync(dir);
    } catch(e) {
        FS.mkdirSync(dir);
    }
});

vow.all(FS.readdirSync('./mails').filter(function(file) {
    return PATH.extname(file) === '.css';
}).map(function(file) {
    return borschik.api({
        input : PATH.resolve(PATH.join('mails', file)),
        output : PATH.resolve(PATH.join('temp', file)),
        freeze : true
    });
})).then(function() {
    return vow.all(FS.readdirSync('./mails').filter(function(file) {
        return PATH.extname(file) === '.html';
    }).map(function(file) {
        var defer = vow.defer();

        var ws = FS.createWriteStream(PATH.resolve('./temp/', file));

        FS.createReadStream(PATH.resolve('./mails/', file)).pipe(ws);

        ws.on('close', function() {
            defer.resolve();
        }).on('error', function(err) {
            defer.reject(err);
        });

        return defer.promise().then(function() {
            return borschik.api({
                input : PATH.resolve(PATH.join('temp', file)),
                output : PATH.resolve(PATH.join('dist', file)),
                freeze : true
            });
        });
    }));
}).then(function() {
    console.log('Build successful');
}).fail(function(error) {
    console.error(error);
});
