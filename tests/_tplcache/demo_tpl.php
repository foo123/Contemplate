<?php 

/* Contemplate cached template 'demo' */
if (!class_exists('Contemplate_demo_Cached'))
{
final class Contemplate_demo_Cached extends ContemplateTemplate
{    
    /* constructor */
    public function __construct($id=null)
    {
        /* initialize internal vars */
        $this->id = null; 
        $this->d = null;
        $this->_renderer = null;
        $this->_extends = null;
        $this->_blocks = null;
        
        $this->id = $id;
        
        /* extend tpl assign code starts here */
        $this->extend('base');
        /* extend tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
    
    
    /* tpl block render method for block 'Block3' */
    private function _blockfn_Block3($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
        
        $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block3 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Functions</strong><br />' . "\n" . '    <ul>' . "\n" . '    <li>%uuid(&quot;namespace&quot;) = ' . (Contemplate::uuid("namespace")) . '</li>' . "\n" . '    <li>%echo(&quot;123&quot;) = ' . (strval("123")) . '</li>' . "\n" . '    <li>%q(123) = ' . ("'".(123)."'") . '</li>' . "\n" . '    <li>%dq(123) = ' . ('"'.(123).'"') . '</li>' . "\n" . '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' . (Contemplate::trim("__FOO__", "_")) . '</li>' . "\n" . '    <li>%trim(&quot;  FOO  &quot;) = ' . (Contemplate::trim("  FOO  ")) . '</li>' . "\n" . '    <li>%lowercase(&quot;FOO&quot;) = ' . (strtolower("FOO")) . '</li>' . "\n" . '    <li>%lowercase(&quot;fOo&quot;) = ' . (strtolower("fOo")) . '</li>' . "\n" . '    <li>%uppercase(&quot;foo&quot;) = ' . (strtoupper("foo")) . '</li>' . "\n" . '    <li>%uppercase(&quot;FoO&quot;) = ' . (strtoupper("FoO")) . '</li>' . "\n" . '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' . (Contemplate::camelcase("camel_case", "_")) . '</li>' . "\n" . '    <li>%camelcase(&quot;camelCase&quot;) = ' . (Contemplate::camelcase("camelCase")) . '</li>' . "\n" . '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' . (Contemplate::snakecase("snakeCase", "_")) . '</li>' . "\n" . '    <li>%snakecase(&quot;snake_case&quot;) = ' . (Contemplate::snakecase("snake_case")) . '</li>' . "\n" . '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' . (sprintf("%02d : %02d : %02d", 2, 0, 12)) . '</li>' . "\n" . '    <li>%addslashes(&quot;this string\'s s\\&quot;s s\\\\&quot;s s\\\\\\&quot;s&quot;) = ' . (Contemplate::addslashes("this string's s\'s s\\'s s\\\'s")) . '</li>' . "\n" . '    <li>%stripslashes(&quot;this string\'s s\\&quot;s s\\\\&quot;s s\\\\\\&quot;s&quot;) = ' . (Contemplate::stripslashes("this string's s\'s s\\'s s\\\'s")) . '</li>' . "\n" . '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' . (Contemplate::locale("locale")) . ' = ' . (Contemplate::locale("locale")) . '</li>' . "\n" . '    <li>%pluralise(&quot;item&quot;, 1) = ' . (Contemplate::pluralise("item", 1)) . '</li>' . "\n" . '    <li>%pluralise(&quot;item&quot;, 2) = ' . (Contemplate::pluralise("item", 2)) . '</li>' . "\n" . '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' . (Contemplate::e('<ok k="v">')) . '</li>' . "\n" . '    <li>%html(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' . (Contemplate::html('<ok k="v">')) . '</li>' . "\n" . '    </ul>' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    ';
        $_loc_136 = $data['users'];
        if (!empty($_loc_136))
        {
            foreach ($_loc_136 as $_loc_i=>$_loc_usergroup)
            {
                
                $__p__ .= '' . "\n" . '        <!-- call a (sub-)template -->' . "\n" . '        ' . (Contemplate::tpl("sub", array("i" => $_loc_i, "users" => $data['users']))) . '' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '' . "\n" . '';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block2' */
    private function _blockfn_Block2($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
        
        $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block2 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>A table</strong><br />' . "\n" . '    ' . (Contemplate::htmltable($data['table_data'], $data['table_options'])) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Test inlined plugin</strong><br />' . "\n" . '    ' . (bracket( "inlined" )) . '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    <strong>Test if variable is set</strong><br />' . "\n" . '    ';
        if ((isset($data['foo'])) )
        {
            
            $__p__ .= '' . "\n" . '        $foo is set' . "\n" . '    ';
        }
        else
        {
            
            $__p__ .= '' . "\n" . '        $foo is NOT set' . "\n" . '    ';
        }
        
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '' . "\n" . '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' . "\n" . '    ';
        $data['foo'] = ("123");
        
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    <strong>Test if variable is set</strong><br />' . "\n" . '    ';
        if ((isset($data['foo'])) )
        {
            
            $__p__ .= '' . "\n" . '        $foo is set' . "\n" . '    ';
        }
        else
        {
            
            $__p__ .= '' . "\n" . '        $foo is NOT set' . "\n" . '    ';
        }
        
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    ' . (Contemplate::plg_test($data['foo'])) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' . "\n" . '    <strong>use literal data with template function, in this case a print plugin</strong><br />' . "\n" . '    ' . (Contemplate::plg_print(array( "stringVar" => "stringValue", "numericVar" => 123, "arrayVar" => array( 0, 1, "astring", 3, array( "prop"=> 1 ) ) ))) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_23 = array("a", "b", "c");
        if (!empty($_loc_23))
        {
            foreach ($_loc_23 as $_loc_index=>$_loc_value)
            {
                
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index) . '] = <strong>' . ( $_loc_value) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_30 = array("a", "b", "c");
        if (!empty($_loc_30))
        {
            foreach ($_loc_30 as $_loc_value2)
            {
                
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value2) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_40 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_40))
        {
            foreach ($_loc_40 as $_loc_index3=>$_loc_value3)
            {
                
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index3) . '] = <strong>' . ( $_loc_value3) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_50 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_50))
        {
            foreach ($_loc_50 as $_loc_value4)
            {
                
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value4) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_57 = array("a", "b", "c");
        if (!empty($_loc_57))
        {
            foreach ($_loc_57 as $_loc_index4=>$_loc_value4)
            {
                
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index4) . '] = <strong>' . ( $_loc_value4) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_64 = array("a", "b", "c");
        if (!empty($_loc_64))
        {
            foreach ($_loc_64 as $_loc_value5)
            {
                
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value5) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_74 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_74))
        {
            foreach ($_loc_74 as $_loc_index6=>$_loc_value7)
            {
                
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index6) . '] = <strong>' . ( $_loc_value7) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_84 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_84))
        {
            foreach ($_loc_84 as $_loc_value8)
            {
                
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value8) . '</strong><br /> ' . "\n" . '    ';
            }
        }
        
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A select box</strong><br />' . "\n" . '    ' . (Contemplate::htmlselect($data['select_data'], $data['select_options'])) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A table with alternative format</strong><br />' . "\n" . '    ' . (Contemplate::htmltable($data['table_data'], array("header" => true, "tpl_cell"=> Contemplate::inline("<td>{{value}} (inline compiled tpl)</td>",array("{{value}}"=>"cell"), true)))) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A select box with alternative format</strong><br />' . "\n" . '    ' . (Contemplate::htmlselect($data['select_data'], array( "foo123" => ":,=>", "optgroups" => array("group1", "group2", "group3"), "selected" => 3, "multiple" => false, "style" => "width:200px;", "tpl_option"=> '<option value="$value" $selected>$option (inline tpl)</option>' ))) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    <!-- include a (sub-)template file -->' . "\n" . '     <!-- print a localized date php-style -->' . "\n" . '<strong>A (localized) date, PHP-style</strong><br />' . "\n" . '' . (Contemplate::ldate("M, d", time())) . '' . "\n" . '';
        
        $__p__ .= '' . "\n" . '' . "\n" . '';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block12' */
    private function _blockfn_Block12($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
        
        $__p__ .= 'Demo template nested Block12';
        return $__p__;
        
    }
    
    /* tpl-defined blocks render code ends here */
    
    /* tpl renderBlock method */
    public function renderBlock( $block, $__i__=null )
    {
        $__p__ = '';
        if ( !$__i__ ) $__i__ = $this;
        
        $method = '_blockfn_' . $block;
        if ( method_exists($this, $method) ) return $this->{$method}($__i__);
        elseif ( $this->_extends ) return $this->_extends->renderBlock($block, $__i__);
        return $__p__;
    }
    
    /* tpl render method */
    public function render($data, $__i__=null)
    {
        $__p__ = '';
        if ( !$__i__ ) $__i__ = $this;
        
        if ( $this->_extends )
        {
            $__p__ = $this->_extends->render($data, $__i__);
        }
        else
        {
            /* tpl main render code starts here */
            $__p__ = '';
            /* tpl main render code ends here */
        }
        $this->d = null;
        return $__p__;
    }
}
}
