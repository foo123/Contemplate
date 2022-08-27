"use strict";

const Contemplate = require(__dirname+'/../../src/js/Contemplate.js');

// global ctx
Contemplate.setCacheDir(__dirname);
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
Contemplate.add({'test' : __dirname+'/test.html'});

Contemplate.tplPromise('test', {'list':[1,2,3]}).then(content => console.log(content));
//console.log(Contemplate.tpl('test', {'list':[1,2,3]}));
