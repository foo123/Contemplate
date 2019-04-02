var  echo = console.log,
    Contemplate = require(__dirname+ '/../../src/js/Contemplate.js')
;

var tpl = '<% $v->prop %><% $v->func() %>';
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
    this.func = function(){ return 'func'; };
}
var arr = ['foo',{'prop':'prop'}];
echo(Contemplate.tpl('test', {'v':new test(),'a':arr}));
