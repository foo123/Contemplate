<?php 

if (!class_exists('Contemplate_demo__global', false))
{
/* Contemplate cached template 'demo' */
final class Contemplate_demo__global extends ContemplateTemplate
{
/* constructor */
public function __construct($id = null)
{
    $self = $this;
    parent::__construct($id);
    
    /* extend tpl assign code starts here */
    $self->extend('base');
    $self->_usesTpl = array('sub');
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */


/* tpl block render method for block 'Block3' */
protected function _blockfn_Block3(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block3 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' . "\n" . '' . "\n" . '    <strong>Functions</strong><br />' . "\n" . '    <ul>' . "\n" . '    <li>uuid(&quot;namespace&quot;) = ' . (Contemplate::uuid("namespace")) . '</li>' . "\n" . '    <li>cc(123,&quot;456&quot;,&quot;789&quot;) = concat(&quot;123&quot;,&quot;456&quot;,&quot;789&quot;) = ' . ((string)(123).(string)("456").(string)("789")) . ' = ' . ((string)("123").(string)("456").(string)("789")) . '</li>' . "\n" . '    <li>j(&quot;,&quot;,[1,2,3,[4,5,6,[7,8,9]]]) = join(&quot;,&quot;,[1,2,3,[4,5,6,[7,8,9]]]) = ' . (Contemplate::join(",",array(1,2,3,array(4,5,6,array(7,8,9))))) . ' = ' . (Contemplate::join(",",array(1,2,3,array(4,5,6,array(7,8,9))))) . '</li>' . "\n" . '    <li>j(&quot;,&quot;,[1,null,3,[4,5,6,[7,null,9]]], true) = join(&quot;,&quot;,[1,null,3,[4,5,6,[7,null,9]]], true) = ' . (Contemplate::join(",",array(1,null,3,array(4,5,6,array(7,null,9))), true)) . ' = ' . (Contemplate::join(",",array(1,null,3,array(4,5,6,array(7,null,9))), true)) . '</li>' . "\n" . '    <li>is_array([1,2,3]) = ' . (is_array(array(1,2,3))) . '</li>' . "\n" . '    <li>is_array([1,2,3],true) = ' . (((true) ? is_array(array(1,2,3)) && (array(1,2,3)) === array_values(array(1,2,3)) : is_array(array(1,2,3)))) . '</li>' . "\n" . '    <li>is_array({"1":1,"2":2,"3":3}) = ' . (is_array(array("1"=>1,"2"=>2,"3"=>3))) . '</li>' . "\n" . '    <li>is_array({"1":1,"2":2,"3":3},true) = ' . (((true) ? is_array(array("1"=>1,"2"=>2,"3"=>3)) && (array("1"=>1,"2"=>2,"3"=>3)) === array_values(array("1"=>1,"2"=>2,"3"=>3)) : is_array(array("1"=>1,"2"=>2,"3"=>3)))) . '</li>' . "\n" . '    <li>in_array(2,[1,2,3]) = ' . (in_array(2, array(1,2,3))) . '</li>' . "\n" . '    <li>in_array(4,[1,2,3]) = ' . (in_array(4, array(1,2,3))) . '</li>' . "\n" . '    <li>keys([1,2,3]) = ' . (Contemplate::plg_("plg_print",Contemplate::keys(array(1,2,3)))) . '</li>' . "\n" . '    <li>keys({"1":1,"2":2,"3":3}) = ' . (Contemplate::plg_("plg_print",Contemplate::keys(array("1"=>1,"2"=>2,"3"=>3)))) . '</li>' . "\n" . '    <li>values([1,2,3]) = ' . (Contemplate::plg_("plg_print",Contemplate::values(array(1,2,3)))) . '</li>' . "\n" . '    <li>values({"1":1,"2":2,"3":3}) = ' . (Contemplate::plg_("plg_print",Contemplate::values(array("1"=>1,"2"=>2,"3"=>3)))) . '</li>' . "\n" . '    <li>json_encode({"array":[1,2,3]}) = ' . (Contemplate::plg_("plg_print",Contemplate::json_encode(array("array"=>array(1,2,3))))) . '</li>' . "\n" . '    <li>json_decode(\'{"array":[1,2,3]}\') = ' . (Contemplate::plg_("plg_print",Contemplate::json_decode('{"array":[1,2,3]}'))) . '</li>' . "\n" . '    <li>q(123) = ' . ("'".(123)."'") . '</li>' . "\n" . '    <li>dq(123) = ' . ('"'.(123).'"') . '</li>' . "\n" . '    <li>trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' . (trim("__FOO__", "_")) . '</li>' . "\n" . '    <li>trim(&quot;  FOO  &quot;) = ' . (trim("  FOO  ")) . '</li>' . "\n" . '    <li>lowercase(&quot;FOO&quot;) = ' . (Contemplate::lowercase("FOO")) . '</li>' . "\n" . '    <li>lowercase(&quot;fOo&quot;) = ' . (Contemplate::lowercase("fOo")) . '</li>' . "\n" . '    <li>uppercase(&quot;foo&quot;) = ' . (Contemplate::uppercase("foo")) . '</li>' . "\n" . '    <li>uppercase(&quot;FoO&quot;) = ' . (Contemplate::uppercase("FoO")) . '</li>' . "\n" . '    <li>sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' . (sprintf("%02d : %02d : %02d", 2, 0, 12)) . '</li>' . "\n" . '    <li>e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' . (Contemplate::e("<ok k=\"v\">")) . '</li>' . "\n" . '    <li>buildquery({"foo":["bar","baz"]}) = ' . (Contemplate::buildquery(array("foo"=>array("bar","baz")))) . '</li>' . "\n" . '    <li>parsequery("foo[0]=bar&foo[1]=baz") = ' . (Contemplate::plg_("plg_print",Contemplate::parsequery("foo[0]=bar&foo[1]=baz"))) . '</li>' . "\n" . '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key2"]) = ' . (Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,array("key2"))) . '</li>' . "\n" . '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]}) = ' . (Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",array("key3"=>3,"key4"=>array(41,42)))) . '</li>' . "\n" . '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"]) = ' . (Contemplate::queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",array("key3"=>3,"key4"=>array(41,42)),array("key2"))) . '</li>' . "\n" . '    <li>striptags("&lt;p&gt;text in &lt;b&gt;tags&lt;/b&gt;&lt;/p&gt;") = ' . (Contemplate::striptags("<p>text in <b>tags</b></p>")) . '</li>' . "\n" . '    </ul>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Test plugin with variable $foo</strong><br />' . "\n" . '    ' . (Contemplate::plg_("plg_test",$data['foo'])) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Test inlined plugin</strong><br />' . "\n" . '    ' . (bracket("inlined")) . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' . "\n" . '    <strong>use literal data with template function, in this case a print plugin</strong><br />' . "\n" . '    ' . (Contemplate::plg_("plg_print",array( "stringVar" => "stringValue", "numericVar" => 123, "arrayVar" => array( 0, 1, "astring", 3, array( "prop"=> 1 ) ) ))) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '';
    return $__p__;
    
}


/* tpl block render method for block 'Block2' */
protected function _blockfn_Block2(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block2 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Can reference the super Block2 directly if needed in OO manner</strong>' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <!-- call the super block here in OO manner, if any -->' . "\n" . '    ' . ($self->sprblock("Block2", $data)) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Contemplate Constructs</strong><hr /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Break and Continue</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for(["a", "b", "c"] as $value) %&gt;' . "\n" . '        &lt;% if("b" == $value ) %&gt;Break from loop&lt;% break %&gt;&lt;% fi %&gt;' . "\n" . '        &lt;% $value %&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for(["a", "b", "c"] as $value) %&gt;' . "\n" . '        &lt;% if("b" == $value ) %&gt;Continue loop&lt;% continue %&gt;&lt;% fi %&gt;' . "\n" . '        &lt;% $value %&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_9 = array("a", "b", "c");
    if (!empty($_loc_9))
    {
        foreach ($_loc_9 as $_loc_value)
        {
            
            $__p__ .= '' . "\n" . '        ';        
            if ("b" == $_loc_value)
            {
                        
                $__p__ .= 'Break from loop';
                break;
                
                $__p__ .= '';        
            }
                    
            $__p__ .= '' . "\n" . '        ' . ($_loc_value) . '' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    <br />' . "\n" . '    ';
    $_loc_17 = array("a", "b", "c");
    if (!empty($_loc_17))
    {
        foreach ($_loc_17 as $_loc_value)
        {
            
            $__p__ .= '' . "\n" . '        ';        
            if ("b" == $_loc_value)
            {
                        
                $__p__ .= 'Continue loop';
                continue;
                
                $__p__ .= '';        
            }
                    
            $__p__ .= '' . "\n" . '        ' . ($_loc_value) . '' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for(["a", "b", "c"] as $index=>$value) %&gt;' . "\n" . '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_26 = array("a", "b", "c");
    if (!empty($_loc_26))
    {
        foreach ($_loc_26 as $_loc_index => $_loc_value)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index) . '] = <strong>' . ($_loc_value) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for(["a", "b", "c"] as $value2) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_33 = array("a", "b", "c");
    if (!empty($_loc_33))
    {
        foreach ($_loc_33 as $_loc_value2)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value2) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' . "\n" . '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_43 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_43))
    {
        foreach ($_loc_43 as $_loc_index3 => $_loc_value3)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index3) . '] = <strong>' . ($_loc_value3) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_53 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_53))
    {
        foreach ($_loc_53 as $_loc_value4)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value4) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for($index4,$value4 in ["a", "b", "c"]) %&gt;' . "\n" . '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_60 = array("a", "b", "c");
    if (!empty($_loc_60))
    {
        foreach ($_loc_60 as $_loc_index4 => $_loc_value4)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index4) . '] = <strong>' . ($_loc_value4) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for($value5 in ["a", "b", "c"]) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_67 = array("a", "b", "c");
    if (!empty($_loc_67))
    {
        foreach ($_loc_67 as $_loc_value5)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value5) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' . "\n" . '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_77 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_77))
    {
        foreach ($_loc_77 as $_loc_index6 => $_loc_value7)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index6) . '] = <strong>' . ($_loc_value7) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_87 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_87))
    {
        foreach ($_loc_87 as $_loc_value8)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value8) . '</strong><br />' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% if( 1+1 != 2 ) %&gt;' . "\n" . '        1+1 != 2' . "\n" . '    &lt;% elif( 1+1 == 1) %&gt;' . "\n" . '        1+1 = 1' . "\n" . '    &lt;% else %&gt;' . "\n" . '        1+1 = 2' . "\n" . '    &lt;% fi %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if (1+1 != 2)
    {
        
        $__p__ .= '' . "\n" . '        1+1 != 2' . "\n" . '    ';
    }
    elseif (1+1 == 1)
    {
        
        $__p__ .= '' . "\n" . '        1+1 = 1' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        1+1 = 2' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Inline (ternary) IF</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% iif( 1+1 == 2, "1+1 = 2", "1+1 = 1" ) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ' . (((1+1 == 2) ? ("1+1 = 2") : ("1+1 = 1"))) . '' . "\n" . '' . "\n" . '    <pre>' . "\n" . '    &lt;% iif( 1+1 == 1, "1+1 = 1", "1+1 = 2" ) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ' . (((1+1 == 1) ? ("1+1 = 1") : ("1+1 = 2"))) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Inline (ternary) IF (2)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% iif( !empty($undefined_variable), $undefined_variable, "test with undefined variable passed" ) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ' . (((!empty($data['undefined_variable'])) ? ($data['undefined_variable']) : ("test with undefined variable passed"))) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>SET a new tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% set($foo, "123") %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $data['foo'] = ("123");
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>SET a new (local) tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% local_set($foo_loc, 456) %&gt;' . "\n" . '    &lt;% set($foo_loc, $foo_loc+1) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_foo_loc = (456);
    
    $__p__ .= '' . "\n" . '    ';
    $_loc_foo_loc = ($_loc_foo_loc+1);
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CHECK ISSET for a tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% if( isset($foo) ) %&gt;' . "\n" . '        $foo is SET' . "\n" . '    &lt;% else %&gt;' . "\n" . '        $foo is NOT SET' . "\n" . '    &lt;% fi %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if ((isset($data['foo'])))
    {
        
        $__p__ .= '' . "\n" . '        $foo = ' . ($data['foo']) . ', is SET' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        $foo is NOT SET' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CHECK ISSET for a (local) tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% if( isset($foo_loc) ) %&gt;' . "\n" . '        $foo_loc is SET' . "\n" . '    &lt;% else %&gt;' . "\n" . '        $foo_loc is NOT SET' . "\n" . '    &lt;% fi %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if ((isset($_loc_foo_loc)))
    {
        
        $__p__ .= '' . "\n" . '        $foo_loc = ' . ($_loc_foo_loc) . ', is SET' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        $foo_loc is NOT SET' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CHECK EMPTY for a tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% if( empty($foo) ) %&gt;' . "\n" . '        $foo is EMPTY' . "\n" . '    &lt;% else %&gt;' . "\n" . '        $foo is NOT EMPTY' . "\n" . '    &lt;% fi %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if (empty($data['foo']))
    {
        
        $__p__ .= '' . "\n" . '        $foo is EMPTY' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        $foo = ' . ($data['foo']) . ', is NOT EMPTY' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CHECK EMPTY for a (local) tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% if( empty($foo_loc) ) %&gt;' . "\n" . '        $foo_loc is EMPTY' . "\n" . '    &lt;% else %&gt;' . "\n" . '        $foo_loc is NOT EMPTY' . "\n" . '    &lt;% fi %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if (empty($_loc_foo_loc))
    {
        
        $__p__ .= '' . "\n" . '        $foo_loc is EMPTY' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        $foo_loc = ' . ($_loc_foo_loc) . ', is NOT EMPTY' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <!-- include a (sub-)template file -->' . "\n" . '    <strong>INCLUDE a (sub-)template file</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% include("date") %&gt;' . "\n" . '    </pre><br />' . "\n" . '    <!-- print a localized date php-style -->' . "\n" . '<strong>A date, PHP-style</strong><br />' . "\n" . '' . (Contemplate::date("M, D, d")) . '' . "\n" . '';
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CALL another (sub-)template</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% for($users as $i=>$usergroup) %&gt;' . "\n" . '        &lt;!-- call a (sub-)template --&gt;' . "\n" . '        &lt;% tpl("sub", {"i" : $i, "users" : $users}) %&gt;' . "\n" . '    &lt;% endfor %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_114 = $data['users'];
    if (!empty($_loc_114))
    {
        foreach ($_loc_114 as $_loc_i => $_loc_usergroup)
        {
            
            $__p__ .= '' . "\n" . '        <!-- call a (sub-)template -->' . "\n" . '        ' . (Contemplate::tpl("sub", array("i" => $_loc_i, "users" => $data['users']))) . '' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '';
    return $__p__;
    
}


/* tpl block render method for block 'Block12' */
protected function _blockfn_Block12(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= 'Demo template nested Block12';
    return $__p__;
    
}

/* tpl-defined blocks render code ends here */
/* tpl block method */
public function block($block, &$data, $__i__ = null)
{
    $self = $this; $r = ''; $__ctx = false;
    if (!$__i__)
    {
        $__i__ = $self;
        if (!$self->_autonomus) $__ctx = Contemplate::_set_ctx($self->_ctx);
    }
    $method = '_blockfn_' . $block;
    if (method_exists($self, $method)) $r = $self->{$method}($data, $self, $__i__);
    elseif ($self->_extends) $r = $self->_extends->block($block, $data, $__i__);
    if ($__ctx)  Contemplate::_set_ctx($__ctx);
    return $r;
}
/* tpl render method */
public function render(&$data, $__i__ = null)
{
    $self = $this; $__ctx = false;
    $__p__ = '';
    if (!$__i__)
    {
        $__i__ = $self;
        if (!$self->_autonomus) $__ctx = Contemplate::_set_ctx($self->_ctx);
    }
    if ($self->_extends)
    {
        $__p__ = $self->_extends->render($data, $__i__);
    }
    else
    {
        /* tpl main render code starts here */
        
        $__p__ = '';
        
        /* tpl main render code ends here */
    }
    if ($__ctx)  Contemplate::_set_ctx($__ctx);
    return $__p__;
}
}
}
