<?php
/**
*  Contemplate
*  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
*
*  @version 0.6.9
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
*  Test
*
**/

/**
** !! Needs to be run through a web server, eg Apache, XAMPP etc.. !!
**      start your web server, 
**      make sure this file's path is accessible to the server
**      point the browser to this file and view the output
**/

define('ABSPATH', dirname(__FILE__));
// include the Contemplate Class
include dirname(ABSPATH).'/src/php/Contemplate.php';

Contemplate::setLocaleStrings(array(
    "locale"=> "γλωσσική περιοχή"
));
Contemplate::setPlurals(array(
    'item'=> null // auto plural
));
function test_plugin($v=null)
{
    if ( $v ) return 'Plugin Test value: ' . $v;
    return 'Plugin Test no value given';
}
function print_plugin($v=null)
{
    return '<pre>' . print_r($v, true) . '</pre>';
}
Contemplate::addPlugin('test', 'test_plugin');
Contemplate::addPlugin('print', 'print_plugin');

// set the cache directory (make sure to exist)
Contemplate::setCacheDir(ABSPATH.'/_tplcache');

// dynamically update the cached template if original template has changed
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);

// add the templates paths
Contemplate::add(array(
    'main' => ABSPATH.'/_tpls/main.tpl.html',
    'base' => ABSPATH.'/_tpls/base.tpl.html',
    'demo' => ABSPATH.'/_tpls/demo.tpl.html',
    'sub' => ABSPATH.'/_tpls/sub.tpl.html',
    'date' => ABSPATH.'/_tpls/date.tpl.html',
    // add an inline template
    'inlinetpl' => array('<% %for($list as $l=>$item) %> <% $l %> <% $item %><br /><% %endfor() %>')
));

/*print_r(Contemplate::parseTpl( '<% %for($list as $l=>$item) %> <% $l %> <% $item %><br /><% %endfor() %>' ));*/

/*
// add an inline template
Contemplate::addInline(array(
    'inlinetpl' => '<% %for($list as $l=>$item) %> <% $l %> <% $item %><br /><% %endfor() %>'
));
*/

/* localize some strings */
/* make sure this file is encoded in UTF-8 */
/*Contemplate::setLocaleStrings(array(
    "Jul" => "Ιουλ",
    "Sep" => "Σεπτ"
));*/


// the data to be used by the templates
$listdata=array('list'=>array('item1', 'item2', 'item3'));

$data=array(
    'users' => array(
        array( 
            array('name'=>'u1', 'text'=>'text1', 'id'=>'id1'),
            array('name'=>'u2', 'text'=>'text2', 'id'=>'id2', 'key1'=>'key1'),
            array('name'=>'u3', 'text'=>'text3', 'id'=>'id3'),
        ),
        array( 
            array('name'=>'u4', 'text'=>'text4', 'id'=>'id4'),
            array('name'=>'u5', 'text'=>'text5', 'id'=>'id5'),
            array('name'=>'u6', 'text'=>'text6', 'id'=>'id6', 'key'=>array('key1'=>'key1')),
        )
    ),
    'table_data' => array(
        'column1' => array(1,2,3),
        'column2' => array(4,5,6),
        'column3' => array(7,8,9),
    ),
    'table_options' => array('header'=>true),
    'select_data' => array(
        'group1' => array(1=>'label 1',2=>'label 2',3=>'label 3'),
        'group2' => array(4=>'label 4',5=>'label 5',6=>'label 6'),
        'group3' => array(7=>'label 7',8=>'label 8',9=>'label 9'),
    ),
    'select_options' => array(
        'optgroups' => array('group1', 'group2', 'group3'),
        'selected' => 3,
        'multiple' => false,
        'style' => 'width:200px;'
    )
);

$main_template_data=array(
    'templates' => array(
        'sub' => Contemplate::getTemplateContents('sub'),
    ),
    'contemplate_version' => Contemplate::VERSION,
    //'sepleft' => $sepleft,
    //'sepright' => $sepright,
    'data_client' => json_encode($data),
    'render_server' => Contemplate::tpl('demo', $data),
    'render_inline' => Contemplate::tpl('inlinetpl', $listdata, array('separators' => '<% %>'))
);

echo Contemplate::tpl('main', $main_template_data);
exit(0);