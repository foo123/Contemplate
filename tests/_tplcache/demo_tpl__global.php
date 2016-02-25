<?php 

if (!class_exists('Contemplate_demo__global'))
{
/* Contemplate cached template 'demo' */
final class Contemplate_demo__global extends ContemplateTemplate
{
/* constructor */
public function __construct($id=null)
{
    $self = $this;
    parent::__construct( $id );
    
    /* extend tpl assign code starts here */
    $self->extend('base');
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */


/* tpl block render method for block 'Block3' */
private function _blockfn_Block3(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block3 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' . "\n" . '    ' . "\n" . '    <strong>Functions</strong><br />' . "\n" . '    <ul>' . "\n" . '    <li>%uuid(&quot;namespace&quot;) = ' . (Contemplate::uuid("namespace")) . '</li>' . "\n" . '    <li>%echo(&quot;123&quot;) = ' . (strval("123")) . '</li>' . "\n" . '    <li>%concat(&quot;123&quot;,&quot;456&quot;,&quot;789&quot;) = ' . (implode('',array("123","456","789"))) . '</li>' . "\n" . '    <li>%q(123) = ' . ("'".(123)."'") . '</li>' . "\n" . '    <li>%dq(123) = ' . ('"'.(123).'"') . '</li>' . "\n" . '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' . (trim("__FOO__", "_")) . '</li>' . "\n" . '    <li>%trim(&quot;  FOO  &quot;) = ' . (trim("  FOO  ")) . '</li>' . "\n" . '    <li>%lowercase(&quot;FOO&quot;) = ' . (strtolower("FOO")) . '</li>' . "\n" . '    <li>%lowercase(&quot;fOo&quot;) = ' . (strtolower("fOo")) . '</li>' . "\n" . '    <li>%uppercase(&quot;foo&quot;) = ' . (strtoupper("foo")) . '</li>' . "\n" . '    <li>%uppercase(&quot;FoO&quot;) = ' . (strtoupper("FoO")) . '</li>' . "\n" . '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' . (Contemplate::camelcase("camel_case", "_")) . '</li>' . "\n" . '    <li>%camelcase(&quot;camelCase&quot;) = ' . (Contemplate::camelcase("camelCase")) . '</li>' . "\n" . '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' . (Contemplate::snakecase("snakeCase", "_")) . '</li>' . "\n" . '    <li>%snakecase(&quot;snake_case&quot;) = ' . (Contemplate::snakecase("snake_case")) . '</li>' . "\n" . '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' . (sprintf("%02d : %02d : %02d", 2, 0, 12)) . '</li>' . "\n" . '    <li>%addslashes(&quot;this string\'s s\\&apos;s s\\\\&apos;s s\\\\\\&apos;s&quot;) = ' . (addslashes("this string's s\'s s\\'s s\\\'s")) . '</li>' . "\n" . '    <li>%stripslashes(&quot;this string\'s s\\&apos;s s\\\\&apos;s s\\\\\\&apos;s&quot;) = ' . (stripslashes("this string's s\'s s\\'s s\\\'s")) . '</li>' . "\n" . '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' . (Contemplate::locale("locale")) . ' = ' . (Contemplate::locale("locale")) . '</li>' . "\n" . '    <li>%nl(2,&quot;locale&quot;,&quot;locales&quot;) = %nlocale(2,&quot;locale&quot;,&quot;locales&quot;) = ' . (Contemplate::nlocale(2,"locale","locales")) . ' = ' . (Contemplate::nlocale(2,"locale","locales")) . '</li>' . "\n" . '    <li>%plural(&quot;item&quot;, 1) = ' . (Contemplate::plural("item", 1)) . '</li>' . "\n" . '    <li>%plural(&quot;item&quot;, 2) = ' . (Contemplate::plural("item", 2)) . '</li>' . "\n" . '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' . (Contemplate::e("<ok k=\"v\">")) . '</li>' . "\n" . '    </ul>' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Test plugin with variable $foo</strong><br />' . "\n" . '    ' . (Contemplate::plg_("plg_test",$data['foo'])) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Test inlined plugin</strong><br />' . "\n" . '    ' . (bracket("inlined")) . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' . "\n" . '    <strong>use literal data with template function, in this case a print plugin</strong><br />' . "\n" . '    ' . (Contemplate::plg_("plg_print",array( "stringVar" => "stringValue", "numericVar" => 123, "arrayVar" => array( 0, 1, "astring", 3, array( "prop"=> 1 ) ) ))) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '';
    return $__p__;
    
}


/* tpl block render method for block 'Block2' */
private function _blockfn_Block2(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block2 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Can reference the super Block2 directly if needed in OO manner</strong>' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <!-- call the super block here in OO manner, if any -->' . "\n" . '    ' . ($self->sprblock("Block2", $data)) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>Contemplate Constructs</strong><hr /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for(["a", "b", "c"] as $index=>$value) %&gt;' . "\n" . '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_10 = array("a", "b", "c");
    if (!empty($_loc_10))
    {
        foreach ($_loc_10 as $_loc_index=>$_loc_value)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index) . '] = <strong>' . ($_loc_value) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for(["a", "b", "c"] as $value2) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_17 = array("a", "b", "c");
    if (!empty($_loc_17))
    {
        foreach ($_loc_17 as $_loc_value2)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value2) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' . "\n" . '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_27 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_27))
    {
        foreach ($_loc_27 as $_loc_index3=>$_loc_value3)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index3) . '] = <strong>' . ($_loc_value3) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_37 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_37))
    {
        foreach ($_loc_37 as $_loc_value4)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value4) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for($index4,$value4 in ["a", "b", "c"]) %&gt;' . "\n" . '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_44 = array("a", "b", "c");
    if (!empty($_loc_44))
    {
        foreach ($_loc_44 as $_loc_index4=>$_loc_value4)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index4) . '] = <strong>' . ($_loc_value4) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for($value5 in ["a", "b", "c"]) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_51 = array("a", "b", "c");
    if (!empty($_loc_51))
    {
        foreach ($_loc_51 as $_loc_value5)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value5) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' . "\n" . '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_61 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_61))
    {
        foreach ($_loc_61 as $_loc_index6=>$_loc_value7)
        {
            
            $__p__ .= '' . "\n" . '        [' . ($_loc_index6) . '] = <strong>' . ($_loc_value7) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' . "\n" . '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt; ' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_71 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
    if (!empty($_loc_71))
    {
        foreach ($_loc_71 as $_loc_value8)
        {
            
            $__p__ .= '' . "\n" . '        <strong>' . ($_loc_value8) . '</strong><br /> ' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %if( 1+1 != 2 ) %&gt;' . "\n" . '        1+1 != 2' . "\n" . '    &lt;% %elif( 1+1 == 1) %&gt;' . "\n" . '        1+1 = 1' . "\n" . '    &lt;% %else() %&gt;' . "\n" . '        1+1 = 2' . "\n" . '    &lt;% %fi() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
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
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Inline (ternary) IF</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %iif( 1+1 == 2, "1+1 = 2", "1+1 = 1" ) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ' . (((1+1 == 2)?( "1+1 = 2"):( "1+1 = 1"))) . '' . "\n" . '    ' . "\n" . '    <pre>' . "\n" . '    &lt;% %iif( 1+1 == 1, "1+1 = 1", "1+1 = 2" ) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ' . (((1+1 == 1)?( "1+1 = 1"):( "1+1 = 2"))) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Inline (ternary) IF (2)</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %iif( !%empty($undefined_variable), $undefined_variable, "test with undefined variable passed" ) %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ' . (((!empty($data['undefined_variable']))?( $data['undefined_variable']):( "test with undefined variable passed"))) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>SET a new tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %set($foo, "123") %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $data['foo'] = ("123");
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>CHECK ISSET for a tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %if( %isset($foo) ) %&gt;' . "\n" . '        $foo is SET' . "\n" . '    &lt;% %else() %&gt;' . "\n" . '        $foo is NOT SET' . "\n" . '    &lt;% %fi() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if ((isset($data['foo'])))
    {
        
        $__p__ .= '' . "\n" . '        $foo is SET' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        $foo is NOT SET' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CHECK EMPTY for a tpl variable</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %if( %empty($foo) ) %&gt;' . "\n" . '        $foo is EMPTY' . "\n" . '    &lt;% %else() %&gt;' . "\n" . '        $foo is NOT EMPTY' . "\n" . '    &lt;% %fi() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    if (empty($data['foo']))
    {
        
        $__p__ .= '' . "\n" . '        $foo is EMPTY' . "\n" . '    ';
    }
    else
    {
        
        $__p__ .= '' . "\n" . '        $foo is NOT EMPTY' . "\n" . '    ';
    }
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <!-- include a (sub-)template file -->' . "\n" . '    <strong>INCLUDE a (sub-)template file</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %include("date") %&gt;' . "\n" . '    </pre><br />' . "\n" . '     <!-- print a localized date php-style -->' . "\n" . '<strong>A (localized) date, PHP-style</strong><br />' . "\n" . '' . (Contemplate::ldate("M, D, d")) . '' . "\n" . '';
    
    $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>CALL another (sub-)template</strong><br />' . "\n" . '    <pre>' . "\n" . '    &lt;% %for($users as $i=>$usergroup) %&gt;' . "\n" . '        &lt;!-- call a (sub-)template --&gt;' . "\n" . '        &lt;% %tpl("sub", {"i" : $i, "users" : $users}) %&gt;' . "\n" . '    &lt;% %endfor() %&gt;' . "\n" . '    </pre><br />' . "\n" . '    ';
    $_loc_89 = $data['users'];
    if (!empty($_loc_89))
    {
        foreach ($_loc_89 as $_loc_i=>$_loc_usergroup)
        {
            
            $__p__ .= '' . "\n" . '        <!-- call a (sub-)template -->' . "\n" . '        ' . (Contemplate::tpl("sub", array("i" => $_loc_i, "users" => $data['users']))) . '' . "\n" . '    ';
        }
    }
    
    $__p__ .= '' . "\n" . '' . "\n" . '';
    return $__p__;
    
}


/* tpl block render method for block 'Block12' */
private function _blockfn_Block12(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= 'Demo template nested Block12';
    return $__p__;
    
}

/* tpl-defined blocks render code ends here */
/* tpl block method */
public function block($block, &$data, $__i__=null)
{
    $self = $this; $r = ''; $__ctx = false;
    if ( !$__i__ )
    {
        $__i__ = $self;
        if ( !$self->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
    }
    $method = '_blockfn_' . $block;
    if ( method_exists($self, $method) ) $r = $self->{$method}($data, $self, $__i__);
    elseif ( $self->_extends ) $r = $self->_extends->block($block, $data, $__i__);
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $r;
}
/* tpl render method */
public function render(&$data, $__i__=null)
{
    $self = $this; $__ctx = false;
    $__p__ = '';
    if ( !$__i__ )
    {
        $__i__ = $self;
        if ( !$self->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
    }
    if ( $self->_extends )
    {
        $__p__ = $self->_extends->render($data, $__i__);
    }
    else
    {
        /* tpl main render code starts here */
        
        $__p__ = '';
        
        /* tpl main render code ends here */
    }
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $__p__;
}
}
}
