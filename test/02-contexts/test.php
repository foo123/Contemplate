<?php
define('ABSPATH', dirname(__FILE__));
function echo_($s)
{
    echo $s . PHP_EOL;
}
include dirname(dirname(ABSPATH)).'/src/php/Contemplate.php';

function plg1($msg)
{
    return $msg . ' ' . 'ctx1';
}
function plg2($msg)
{
    return $msg . ' ' . 'ctx2';
}
function plg3($msg)
{
    return $msg . ' ' . 'ctx3';
}

// global ctx
Contemplate::setCacheDir(ABSPATH);
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);
Contemplate::add(array('global' => ABSPATH . '/global.html'));

// ctx 1
Contemplate::createCtx("ctx1");
Contemplate::setCacheDir(ABSPATH, "ctx1");
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE, "ctx1");
Contemplate::add(array('tpl' => ABSPATH . '/tpl1.html'), "ctx1");
Contemplate::addPlugin('my_plugin', 'plg1', "ctx1");

// ctx 2
Contemplate::createCtx("ctx2");
Contemplate::setCacheDir(ABSPATH, "ctx2");
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE, "ctx2");
Contemplate::add(array('tpl' => ABSPATH . '/tpl2.html'), "ctx2");
Contemplate::addPlugin('my_plugin', 'plg2', "ctx2");

// ctx 3
Contemplate::createCtx("ctx3");
Contemplate::setCacheDir(ABSPATH, "ctx3");
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE, "ctx3");
Contemplate::add(array('tpl' => ABSPATH . '/tpl3.html'), "ctx3");
Contemplate::addPlugin('my_plugin', 'plg3', "ctx3");

echo_('--tpl1--');
echo_(Contemplate::tpl('tpl', array(), "ctx1"));

echo_('--tpl2--');
echo_(Contemplate::tpl('tpl', array(), "ctx2"));

echo_('--tpl3--');
echo_(Contemplate::tpl('tpl', array(), "ctx3"));
