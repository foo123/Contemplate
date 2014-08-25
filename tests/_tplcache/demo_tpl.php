<?php 

/* Contemplate cached template 'demo' */
if (!class_exists('Contemplate_demo_Cached'))
{
final class Contemplate_demo_Cached extends Contemplate
{    
    /* constructor */
    public function __construct($id=null, $__=null)
    {
        /* initialize internal vars */
        $this->id = null; 
        $this->d = null;
        $this->_renderFunction = null;
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
        
        $__p__ = '';
         
        $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block3 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Functions</strong><br />' . "\n" . '    <ul>' . "\n" . '    <li>trim(__FOO__, _) = ' . ( Contemplate::trim("__FOO__", "_") ) . '</li>' . "\n" . '    <li>trim(  FOO  ) = ' . ( Contemplate::trim("  FOO  ") ) . '</li>' . "\n" . '    <li>lowercase(FOO) = ' . ( Contemplate::lowercase("FOO") ) . '</li>' . "\n" . '    <li>lowercase(fOo) = ' . ( Contemplate::lowercase("fOo") ) . '</li>' . "\n" . '    <li>uppercase(foo) = ' . ( Contemplate::uppercase("foo") ) . '</li>' . "\n" . '    <li>uppercase(FoO) = ' . ( Contemplate::uppercase("FoO") ) . '</li>' . "\n" . '    <li>camelcase(camel_case, _) = ' . ( Contemplate::camelcase("camel_case", "_") ) . '</li>' . "\n" . '    <li>camelcase(camelCase) = ' . ( Contemplate::camelcase("camelCase") ) . '</li>' . "\n" . '    <li>snakecase(snakeCase, _) = ' . ( Contemplate::snakecase("snakeCase", "_") ) . '</li>' . "\n" . '    <li>snakecase(snake_case) = ' . ( Contemplate::snakecase("snake_case") ) . '</li>' . "\n" . '    <li>l(locale) = ' . ( Contemplate::l("locale") ) . '</li>' . "\n" . '    <li>locale(locale) = ' . ( Contemplate::locale("locale") ) . '</li>' . "\n" . '    <li>pluralise(item, 1) = ' . ( Contemplate::pluralise("item", 1) ) . '</li>' . "\n" . '    <li>pluralise(item, 2) = ' . ( Contemplate::pluralise("item", 2) ) . '</li>' . "\n" . '    <li>sprintf("%02d : %02d : %02d", 2, 0, 12) = ' . ( Contemplate::sprintf("%02d : %02d : %02d", 2, 0, 12) ) . '</li>' . "\n" . '    <li>addslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' . ( Contemplate::addslashes("this string's s\'s s\\'s s\\\'s") ) . '</li>' . "\n" . '    <li>stripslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' . ( Contemplate::stripslashes("this string's s\'s s\\'s s\\\'s") ) . '</li>' . "\n" . '    <li>uuid(namespace) = ' . ( Contemplate::uuid("namespace") ) . '</li>' . "\n" . '    </ul>' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    ';
        $_O11 = $__i__->d['users'];
        if (!empty($_O11))
        {
            foreach ($_O11 as $_K12=>$_V13)
            {
                $__i__->d['i'] = $_K12; $__i__->d['usergroup'] = $_V13;
                 
                $__p__ .= '' . "\n" . '        <!-- call a (sub-)template -->' . "\n" . '        ' . Contemplate::tpl( "sub",  array("i" => $__i__->d['i'], "users" => $__i__->d['users']) ); 
                 
                $__p__ .= '' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '' . "\n" . '';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block2' */
    private function _blockfn_Block2($__i__) 
    { 
        
        $__p__ = '';
         
        $__p__ .= '' . "\n" . '' . "\n" . '    <strong>Block2 is overriden by the demo template</strong>' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '' . "\n" . '    <strong>A table</strong><br />' . "\n" . '    ' . ( Contemplate::htmltable($__i__->d['table_data'], $__i__->d['table_options']) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>Test if variable is set</strong><br />' . "\n" . '    ';
        if (   (isset($__i__->d['foo']))   )
        {
             
            $__p__ .= '' . "\n" . '        $foo is set' . "\n" . '    ';
        }
        else
        {
             
            $__p__ .= '' . "\n" . '        $foo is NOT set' . "\n" . '    ';
        }
         
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '' . "\n" . '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' . "\n" . '    ';
        $__i__->d['foo'] = ( "123" );
         
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    <strong>Test if variable is set</strong><br />' . "\n" . '    ';
        if (   (isset($__i__->d['foo']))   )
        {
             
            $__p__ .= '' . "\n" . '        $foo is set' . "\n" . '    ';
        }
        else
        {
             
            $__p__ .= '' . "\n" . '        $foo is NOT set' . "\n" . '    ';
        }
         
        $__p__ .= '' . "\n" . '    <br />' . "\n" . '    ' . "\n" . '    ' . ( Contemplate::plugin_test($__i__->d['foo']) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' . "\n" . '    <strong>use literal data with template function, in this case a print plugin</strong><br />' . "\n" . '    ' . ( Contemplate::plugin_print(array(          "stringVar"     => "stringValue",          "numericVar"    => 123,          "arrayVar"      => array(             0, 1, "astring", 3,              array( "prop"=> 1 )          )      )) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in associative loop</strong><br />' . "\n" . '    ';
        $_O1 = array("a", "b", "c");
        if (!empty($_O1))
        {
            foreach ($_O1 as $_K2=>$_V3)
            {
                $__i__->d['index'] = $_K2; $__i__->d['value'] = $_V3;
                 
                $__p__ .= '' . "\n" . '        [' . ( $__i__->d['index'] ) . '] = <strong>' . ( $__i__->d['value'] ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal array data in non-associative loop</strong><br />' . "\n" . '    ';
        $_O4 = array("a", "b", "c");
        if (!empty($_O4))
        {
            foreach ($_O4 as $_V5)
            {
                $__i__->d['value2'] = $_V5;
                 
                $__p__ .= '' . "\n" . '        <strong>' . ( $__i__->d['value2'] ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in associative loop</strong><br />' . "\n" . '    ';
        $_O6 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_O6))
        {
            foreach ($_O6 as $_K7=>$_V8)
            {
                $__i__->d['index3'] = $_K7; $__i__->d['value3'] = $_V8;
                 
                $__p__ .= '' . "\n" . '        [' . ( $__i__->d['index3'] ) . '] = <strong>' . ( $__i__->d['value3'] ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>use literal object data in non-associative loop</strong><br />' . "\n" . '    ';
        $_O9 = array("k1"=>"a", "k2"=>"b", "k3"=>"c");
        if (!empty($_O9))
        {
            foreach ($_O9 as $_V10)
            {
                $__i__->d['value4'] = $_V10;
                 
                $__p__ .= '' . "\n" . '        <strong>' . ( $__i__->d['value4'] ) . '</strong><br /> ' . "\n" . '    ';
            }
        }
         
        $__p__ .= '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A select box</strong><br />' . "\n" . '    ' . ( Contemplate::htmlselect($__i__->d['select_data'], $__i__->d['select_options']) ) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A table with alternative format</strong><br />' . "\n" . '    ' . ( Contemplate::htmltable($__i__->d['table_data'], array("header" => true)) ) . '' . "\n" . '' . "\n" . '    <br /><br />' . "\n" . '    ' . "\n" . '    <strong>A select box with alternative format</strong><br />' . "\n" . '    ' . ( Contemplate::htmlselect($__i__->d['select_data'], array(             "optgroups" => array("group1", "group2", "group3"),             "selected" => 3,             "multiple" => false,             "style" => "width:200px;",             "foo123" => ":,=>"         )) ) . '' . "\n" . '    ' . "\n" . '    <br /><br />' . "\n" . '    <!-- include a (sub-)template file -->' . "\n" . '     <!-- print a localized date php-style -->' . "\n" . '<strong>A (localized) date, PHP-style</strong><br />' . "\n" . '' . ( Contemplate::ldate("M, d", Contemplate::now()) ) . '' . "\n" . ''; 
         
        $__p__ .= '' . "\n" . '' . "\n" . '';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block12' */
    private function _blockfn_Block12($__i__) 
    { 
        
        $__p__ = '';
         
        $__p__ .= 'Demo template nested Block12';
        return $__p__;
        
    }
    
    /* tpl-defined blocks render code ends here */
    
    /* render a tpl block method */
    public function renderBlock($block, $__i__=null)
    {
        if ( !$__i__ ) $__i__ = $this;
        
        $method = '_blockfn_' . $block;
        
        if ( method_exists($this, $method) ) return $this->{$method}($__i__);
        
        elseif ( $this->_extends ) return $this->_extends->renderBlock($block, $__i__);
        
        return '';
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
