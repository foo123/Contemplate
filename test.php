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
include ABSPATH.'/src/php/Contemplate.php';

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
    'base'=>ABSPATH.'/_tpls/base.tpl.html',
    'demo'=>ABSPATH.'/_tpls/demo.tpl.html',
    'sub'=>ABSPATH.'/_tpls/sub.tpl.html',
    'date'=>ABSPATH.'/_tpls/date.tpl.html',
));
// add an inline template
Contemplate::addInline(array(
    'inlinetpl'=>'<% %for($list as $l=>$item) %> <% $l %> <% $item %><br /><% %endfor() %>'
));
/* localize some strings */
/* make sure this file is encoded in UTF-8 */
Contemplate::setLocaleStrings(array(
    "Jul" => "Ιουλ",
    "Sep" => "Σεπτ"
));

$listdata=array('list'=>array('item1', 'item2', 'item3'));

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
        )
    ),
    'table_data'=>array(
        'column1'=>array(1,2,3),
        'column2'=>array(4,5,6),
        'column3'=>array(7,8,9),
    ),
    'table_options'=>array('header'=>true),
    'select_data'=>array(
        'group1'=>array(1=>'label 1',2=>'label 2',3=>'label 3'),
        'group2'=>array(4=>'label 4',5=>'label 5',6=>'label 6'),
        'group3'=>array(7=>'label 7',8=>'label 8',9=>'label 9'),
    ),
    'select_options'=>array(
        'optgroups'=>array('group1', 'group2', 'group3'),
        'selected'=>3,
        'multiple'=>false,
        'style'=>'width:200px;'
    )
);

$main_template_data=array(
    'templates'=>array(
        'sub'=>Contemplate::getTemplateContents('sub'),
    ),
    'sepleft'=>$sepleft,
    'sepright'=>$sepright,
    'data_client'=>json_encode($data),
    'render_server'=>Contemplate::tpl('demo', $data),
    'render_inline'=>Contemplate::tpl('inlinetpl', $listdata)
);

echo Contemplate::tpl('main', $main_template_data);

exit;
