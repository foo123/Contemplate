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
        $this->extend( 'base' );
        /* extend tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
    
    
    /* tpl block render method for block 'Block3' */
    private function _blockfn_Block3($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block3 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Functions</strong><br />' . "\n" . '    <ul>' . "\n" . '    <li>%e(&lt;ok k=&quot;v&quot;&gt;) = ' . ( Contemplate::e('<ok k="v">') ) . '</li>' . "\n" . '    <li>%html(&lt;ok k=&quot;v&quot;&gt;) = ' . ( Contemplate::html('<ok k="v">') ) . '</li>' . "\n" . '    <li>trim(__FOO__, _) = ' . ( Contemplate::trim("__FOO__", "_") ) . '</li>' . "\n" . '    <li>trim(  FOO  ) = ' . ( Contemplate::trim("  FOO  ") ) . '</li>' . "\n" . '    <li>lowercase(FOO) = ' . ( Contemplate::lowercase("FOO") ) . '</li>' . "\n" . '    <li>lowercase(fOo) = ' . ( Contemplate::lowercase("fOo") ) . '</li>' . "\n" . '    <li>uppercase(foo) = ' . ( Contemplate::uppercase("foo") ) . '</li>' . "\n" . '    <li>uppercase(FoO) = ' . ( Contemplate::uppercase("FoO") ) . '</li>' . "\n" . '    <li>camelcase(camel_case, _) = ' . ( Contemplate::camelcase("camel_case", "_") ) . '</li>' . "\n" . '    <li>camelcase(camelCase) = ' . ( Contemplate::camelcase("camelCase") ) . '</li>' . "\n" . '    <li>snakecase(snakeCase, _) = ' . ( Contemplate::snakecase("snakeCase", "_") ) . '</li>' . "\n" . '    <li>snakecase(snake_case) = ' . ( Contemplate::snakecase("snake_case") ) . '</li>' . "\n" . '    <li>l(locale) = ' . ( Contemplate::l("locale") ) . '</li>' . "\n" . '    <li>locale(locale) = ' . ( Contemplate::locale("locale") ) . '</li>' . "\n" . '    <li>pluralise(item, 1) = ' . ( Contemplate::pluralise("item", 1) ) . '</li>' . "\n" . '    <li>pluralise(item, 2) = ' . ( Contemplate::pluralise("item", 2) ) . '</li>' . "\n" . '    <li>sprintf("%02d : %02d : %02d", 2, 0, 12) = ' . ( Contemplate::sprintf("%02d : %02d : %02d", 2, 0, 12) ) . '</li>' . "\n" . '    <li>addslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' . ( Contemplate::addslashes("this string's s\'s s\\'s s\\\'s") ) . '</li>' . "\n" . '    <li>stripslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' . ( Contemplate::stripslashes("this string's s\'s s\\'s s\\\'s") ) . '</li>' . "\n" . '    <li>uuid(namespace) = ' . ( Contemplate::uuid("namespace") ) . '</li>' . "\n" . '    </ul>' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    ';
        $_loc_131 = $data['users'];
        if (!empty($_loc_131))
        {
            foreach ($_loc_131 as $_loc_i=>$_loc_usergroup)
            {
                 
                $__p__ .= '' . "\n" . '        <!-- call a (sub-)template -->' . "\n" . '        ' . Contemplate::tpl( "sub",  array("i" => $_loc_i, "users" => $data['users']) ); 
                 
                $__p__ .= '' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '' . "\n" . '';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block2' */
    private function _blockfn_Block2($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block2 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>A table</strong><br />' . "\n" . '    ' . ( Contemplate::htmltable($data['table_data'], $data['table_options']) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Test inlined plugin</strong><br />' . "\n" . '    ' . ( bracket( "inlined" ) ) . '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    <strong>Test if variable is set</strong><br />' . "\n" . '    ';
        if (  (isset($data['foo']))  )
        {
             
            $__p__ .= '' . "\n" . '        $foo is set' . "\n" . '    ';
        }
        else
        {
             
            $__p__ .= '' . "\n" . '        $foo is NOT set' . "\n" . '    ';
        }
         
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '' . "\n" . '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' . "\n" . '    ';
        $data['foo'] = ( "123" );
         
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    <strong>Test if variable is set</strong><br />' . "\n" . '    ';
        if (  (isset($data['foo']))  )
        {
             
            $__p__ .= '' . "\n" . '        $foo is set' . "\n" . '    ';
        }
        else
        {
             
            $__p__ .= '' . "\n" . '        $foo is NOT set' . "\n" . '    ';
        }
         
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    ' . ( Contemplate::plg_test($data['foo']) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' . "\n" . '    <strong>use literal data with template function, in this case a print plugin</strong><br />' . "\n" . '    ' . ( Contemplate::plg_print(array(          "stringVar"     => "stringValue",          "numericVar"    => 123,          "arrayVar"      => array(             0, 1, "astring", 3,              array( "prop"=> 1 )          )      )) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_20 = array("a", "b", "c");
        if (!empty($_loc_20))
        {
            foreach ($_loc_20 as $_loc_index=>$_loc_value)
            {
                 
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index ) . '] = <strong>' . ( $_loc_value ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_27 = array("a", "b", "c");
        if (!empty($_loc_27))
        {
            foreach ($_loc_27 as $_loc_value2)
            {
                 
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value2 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_37 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_37))
        {
            foreach ($_loc_37 as $_loc_index3=>$_loc_value3)
            {
                 
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index3 ) . '] = <strong>' . ( $_loc_value3 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' . "\n" . '    ';
        $_loc_47 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_47))
        {
            foreach ($_loc_47 as $_loc_value4)
            {
                 
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value4 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_54 = array("a", "b", "c");
        if (!empty($_loc_54))
        {
            foreach ($_loc_54 as $_loc_index4=>$_loc_value4)
            {
                 
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index4 ) . '] = <strong>' . ( $_loc_value4 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_61 = array("a", "b", "c");
        if (!empty($_loc_61))
        {
            foreach ($_loc_61 as $_loc_value5)
            {
                 
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value5 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_71 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_71))
        {
            foreach ($_loc_71 as $_loc_index6=>$_loc_value7)
            {
                 
                $__p__ .= '' . "\n" . '        [' . ( $_loc_index6 ) . '] = <strong>' . ( $_loc_value7 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' . "\n" . '    ';
        $_loc_81 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_loc_81))
        {
            foreach ($_loc_81 as $_loc_value8)
            {
                 
                $__p__ .= '' . "\n" . '        <strong>' . ( $_loc_value8 ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A select box</strong><br />' . "\n" . '    ' . ( Contemplate::htmlselect($data['select_data'], $data['select_options']) ) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A table with alternative format</strong><br />' . "\n" . '    ' . ( Contemplate::htmltable($data['table_data'], array("header" => true, "tpl_cell"=> Contemplate::inline("<td>{{value}} (inline tpl)</td>",array("{{value}}"=>"cell"), false))) ) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A select box with alternative format</strong><br />' . "\n" . '    ' . ( Contemplate::htmlselect($data['select_data'], array(             "foo123" => ":,=>",             "optgroups" => array("group1", "group2", "group3"),             "selected" => 3,             "multiple" => false,             "style" => "width:200px;",             "tpl_option"=> '<option value="$value" $selected>$option (inline compiled tpl)</option>'         )) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    <!-- include a (sub-)template file -->' . "\n" . '     <!-- print a localized date php-style -->' . "\n" . '<strong>A (localized) date, PHP-style</strong><br />' . "\n" . '' . ( Contemplate::ldate("M, d", Contemplate::now()) ) . '' . "\n" . ''; 
         
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
