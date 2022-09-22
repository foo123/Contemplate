"use strict";

const Contemplate = require(__dirname+'/../../src/js/Contemplate.js');

// global ctx
Contemplate.setCacheDir(__dirname);
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
Contemplate.add({'reserved' : __dirname+'/reserved.html'});

Contemplate.tplPromise('reserved', {}).then(content => console.log(content)).catch(err => {setTimeout(() => {throw err;}, 0);});
//console.log(Contemplate.tpl('reserved', {}));
