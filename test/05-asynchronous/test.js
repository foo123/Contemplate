"use strict";
const Contemplate = require(__dirname + '/../../src/js/Contemplate.js');

// make sure it exists
Contemplate.setCacheDir(__dirname + '/_tplcache');

// dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);

// add templates
var TPLS = {
    'layout/base.tpl.html' : __dirname+'/_tpls/layout/base.tpl.html',
    'demo.tpl.html' : __dirname+'/_tpls/demo.tpl.html',
    'include/sub.tpl.html' : __dirname+'/_tpls/include/sub.tpl.html',
    'common/foo.tpl.html' : __dirname+'/_tpls/common/foo.tpl.html',
    'common/bar.tpl.html' : __dirname+'/_tpls/common/bar.tpl.html'
};
/*Contemplate.add(TPLS);*/
/*Contemplate.setTemplateFinder(function(tpl, cb) {
    // should handle both async and sync operation depending if callback cb is provided
    if (Object.prototype.hasOwnProperty.call(TPLS, tpl))
    {
        if ('function' === typeof cb) return cb(TPLS[tpl]);
        else return TPLS[tpl];
    }
    else
    {
        if ('function' === typeof cb) return cb(null);
        else return null;
    }
});*/
Contemplate.setTemplateDirs([
    __dirname + '/_tpls'
]);

// promise-based
Contemplate.tplPromise('demo.tpl.html', null, 'global')
.then(function(tpl) {
    console.log(tpl.render({'foo':'bar','bar':'foo'}));
})
.catch(function(err){
    throw err;
});

