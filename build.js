var FS = require('fs'),
    PATH = require('path'),

    borschik = require('borschik'),
    inlineCss = require('inline-css'),
    Minimize = require('minimize'),
    minimize = new Minimize(),

    files;

try {
    FS.lstatSync('dist');
} catch(e) {
    FS.mkdirSync('dist');
}

files = FS.readdirSync('./mails').filter(function(file) {
    return PATH.extname(file) === '.html';
});

files.forEach(function(file) {
    borschik.api({
        input : PATH.join('mails', file),
        output : PATH.join('dist', file),
        freeze : true
    }).then(function() {
        return inlineCss(
            FS.readFileSync(PATH.join('dist', file)).toString(),
            { url : 'file://' + PATH.join(process.cwd(), 'mails', file) }
        );
    }).then(function(html) {
        minimize.parse(html, function(error, data) {
            if(error) {
                console.error(error);
                return;
            }

            FS.writeFileSync(PATH.join('dist', file), data);
        });
    }, function(error) {
        console.error(error);
    });
});
