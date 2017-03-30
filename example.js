require('./index.js')({
    type : 'projectArchived',
    projectTitle : '123'
}, function(err, html) {
    console.log(arguments);
});
