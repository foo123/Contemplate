"use strict";
const path = require('path'), echo = console.log;
const Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'));

echo(Contemplate.sprintf("%s is 1st argument, %s is 2nd argument, %06.2f","arg1","arg2", 3.141592653589793));
echo(Contemplate.vsprintf("%2$s is 2nd argument, %1$s is 1st argument, %3$06.2f",["arg1","arg2", 3.141592653589793]));

let obj = Contemplate.parsequery('key1=1&key2[]=21&key2[]=22');
let query = Contemplate.buildquery(obj);
let s = 'a string with spaces and / and ? and &';
let us = Contemplate.urlencode(s);
let s2 = Contemplate.urldecode(us);
echo(obj);
echo(query);
echo(s);
echo(us);
echo(s2);
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key1"]));
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key2"]));
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]}));
echo(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"]));
echo(Contemplate.queryvar("https://example.com",{"key1":{"foo":1,"bar":2},"key2":[21,22]}));
