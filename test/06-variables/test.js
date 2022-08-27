"use strict";
const echo = console.log;
const Contemplate = require(__dirname+ '/../../src/js/Contemplate.js');

const tpl = '<% $v->prop %><% $v->func() %>';
Contemplate.add({
    //'inline' : [tpl],
    'test' : __dirname+'/test.tpl.html'
});
// make sure it exists
Contemplate.setCacheDir(__dirname);

// dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);

function test()
{
    this.prop = 'prop';
    this.prop2 = this;
    this.func = function() {return 'func';};
    this.getPropGetter = function() {return 'propGetter';};
    this.method = function() {return this;};
}
let arr = ['foo',{'prop':'prop'}];
echo(Contemplate.tpl('test', {'v':new test(),'a':arr}));
