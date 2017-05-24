var FS = require('fs'),
    PATH = require('path'),

    borschik = require('borschik');

try {
    FS.lstatSync('dist');
} catch(e) {
    FS.mkdirSync('dist');
}

FS.readdirSync('./mails').filter(function(file) {
    return PATH.extname(file) === '.html';
}).forEach(function(file) {
    borschik.api({
        input : PATH.join('mails', file),
        output : PATH.join('dist', file),
        freeze : true
    }).fail(function(error) {
        console.error(error);
    });
});
