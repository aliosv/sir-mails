var ejs = require('ejs'),
    inlineCss = require('inline-css'),
    Minimize = require('minimize'),
    minimize = new Minimize();

module.exports = function(data, cb) {
    ejs.renderFile('./mails/_template.html', { data : data }, function(err, html) {
        if(err) return cb(err);

        inlineCss(
            html,
            { url : 'file://' + require('path').join(process.cwd(), 'mails', '_template.html') }
        ).then(function(styledHtml) {
                minimize.parse(styledHtml, function(error, minimizedHtml) {
                    if(error) return cb(error);

                    cb(null, minimizedHtml);
                });
            }, function(err) {
                cb(err);
            });
    });
};
