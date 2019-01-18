var path = require('path'), echo = console.log,
    Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'))
;

echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key1"]));
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key2"]));
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]}));
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"]));
