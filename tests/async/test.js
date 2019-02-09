/**
*  Contemplate
*  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
*
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
*  Test
*
**/

//  Run as: node test.js

var echo = console.log,
    Contemplate = require(__dirname+'/../../src/js/Contemplate.js')
;

// make sure it exists
Contemplate.setCacheDir(__dirname+'/_tplcache');

// dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);

// add templates
Contemplate.add({
    'layout/base.tpl.html' : __dirname+'/_tpls/layout/base.tpl.html',
    'demo.tpl.html' : __dirname+'/_tpls/demo.tpl.html',
    'include/sub.tpl.html' : __dirname+'/_tpls/include/sub.tpl.html'
});


echo('Contemplate VERSION is: ' + Contemplate.VERSION);

// async loading, parsing and writing
/*Contemplate.tpl('demo.tpl.html', null, 'global', function(err,tpl){
    if ( err ) throw err;
    echo(tpl.render({'foo':'bar'}));
});*/

// promise-based
Contemplate.tplPromise('demo.tpl.html', null, 'global')
.then(function(tpl){
    echo(tpl.render({'foo':'bar'}));
})
.catch(function(err){
    throw err;
});

