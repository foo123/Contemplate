<?php
define('ABSPATH', dirname(__FILE__));
function echo_($s)
{
    echo $s . PHP_EOL;
}
include dirname(dirname(ABSPATH)).'/src/php/Contemplate.php';

$obj = Contemplate::parsequery('key1=1&key2[]=21&key2[]=22');
$query = Contemplate::buildquery($obj);
$s = 'a string with spaces and / and ? and &';
$us = Contemplate::urlencode($s);
$s2 = Contemplate::urldecode($us);
print_r($obj);
echo_($query);
echo_($s);
echo_($us);
echo_($s2);
echo_(Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,array("key1")));
echo_(Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,array("key2")));
echo_(Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",array("key3"=>3,"key4"=>array(41,42))));
echo_(Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",array("key3"=>3,"key4"=>array(41,42)),array("key2")));
echo_(Contemplate::queryvar("https://example.com",array("key1"=>array("foo"=>1,"bar"=>2),"key2"=>array(21,22))));
