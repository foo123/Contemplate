<?php

/*
*  Simple light-weight templating engine
*  @author: Nikos M.  http://nikos-web-development.netai.net/
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
*/

define('ABSPATH', dirname(__FILE__));

// include the Contemplate Class
include ABSPATH.'/src/Contemplate.php';

$sepleft="<%";
$sepright="%>";
// set the template separators
Contemplate::setTemplateSeparators($sepleft, $sepright);
// set the cache directory (make sure to exist)
Contemplate::setCacheDir(ABSPATH.'/_tplcache');
// dynamically update the cached template if original template has changed
Contemplate::setCacheMode(Contemplate::CACHE_TO_DISK_AUTOUPDATE);
// add the templates paths
Contemplate::add(array(
    'main'=>ABSPATH.'/_tpls/main.tpl.html',
    'demo'=>ABSPATH.'/_tpls/demo.tpl.html',
    'sub'=>ABSPATH.'/_tpls/sub.tpl.html',
));

// the data to be used by the templates
$data=array(
    'users'=>array(
        array( 
            array('name'=>'u1', 'text'=>'text1', 'id'=>'id1'),
            array('name'=>'u2', 'text'=>'text2', 'id'=>'id2'),
            array('name'=>'u3', 'text'=>'text3', 'id'=>'id3'),
        ),
        array( 
            array('name'=>'u4', 'text'=>'text4', 'id'=>'id4'),
            array('name'=>'u5', 'text'=>'text5', 'id'=>'id5'),
            array('name'=>'u6', 'text'=>'text6', 'id'=>'id6'),
        ),
        array( 
            array('name'=>'u7', 'text'=>'text7', 'id'=>'id7'),
            array('name'=>'u8', 'text'=>'text8', 'id'=>'id8'),
            array('name'=>'u9', 'text'=>'text9', 'id'=>'id9'),
        ),
    )
);

$main_template_data=array(
    'templates'=>array(
        'demo'=>Contemplate::getTemplateContents('demo'),
        'sub'=>Contemplate::getTemplateContents('sub'),
    ),
    'sepleft'=>$sepleft,
    'sepright'=>$sepright,
    'data_js'=>json_encode($data),
    'render_php'=>Contemplate::tpl('demo', $data)
);

echo Contemplate::tpl('main', $main_template_data);

exit;
