# -*- coding: UTF-8 -*-
# Contemplate cached template 'demo'



# imports start here, if any

# imports end here

def __getTplClass__(Contemplate):

    # extends the main Contemplate class
    class Contemplate_demo_Cached(Contemplate):
        'Contemplate cached template demo'

        # constructor
        def __init__(self, id=None, __=None):
            # initialize internal vars
            self.id = None 
            self.data = None
            self._renderFunction = None
            self._parent = None
            self._blocks = None

            self.id = id
            
            # parent tpl assign code starts here
            self.setParent( 'base' )
            # parent tpl assign code ends here



        # tpl-defined blocks render code starts here
        
        
        # tpl block render method for block 'Block3'
        def _blockfn_Block3(self, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>trim(__FOO__, _) = ' + str( Contemplate.trim("__FOO__", "_") ) + '</li>' + "\n" + '    <li>trim(  FOO  ) = ' + str( Contemplate.trim("  FOO  ") ) + '</li>' + "\n" + '    <li>lowercase(FOO) = ' + str( Contemplate.lowercase("FOO") ) + '</li>' + "\n" + '    <li>lowercase(fOo) = ' + str( Contemplate.lowercase("fOo") ) + '</li>' + "\n" + '    <li>uppercase(foo) = ' + str( Contemplate.uppercase("foo") ) + '</li>' + "\n" + '    <li>uppercase(FoO) = ' + str( Contemplate.uppercase("FoO") ) + '</li>' + "\n" + '    <li>camelcase(camel_case, _) = ' + str( Contemplate.camelcase("camel_case", "_") ) + '</li>' + "\n" + '    <li>camelcase(camelCase) = ' + str( Contemplate.camelcase("camelCase") ) + '</li>' + "\n" + '    <li>snakecase(snakeCase, _) = ' + str( Contemplate.snakecase("snakeCase", "_") ) + '</li>' + "\n" + '    <li>snakecase(snake_case) = ' + str( Contemplate.snakecase("snake_case") ) + '</li>' + "\n" + '    <li>l(locale) = ' + str( Contemplate.l("locale") ) + '</li>' + "\n" + '    <li>locale(locale) = ' + str( Contemplate.locale("locale") ) + '</li>' + "\n" + '    <li>pluralise(item, 1) = ' + str( Contemplate.pluralise("item", 1) ) + '</li>' + "\n" + '    <li>pluralise(item, 2) = ' + str( Contemplate.pluralise("item", 2) ) + '</li>' + "\n" + '    <li>sprintf("%02d : %02d : %02d", 2, 0, 12) = ' + str( Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12) ) + '</li>' + "\n" + '    <li>addslashes("this string\'s s\"s s\\"s s\\\"s") = ' + str( Contemplate.addslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>stripslashes("this string\'s s\"s s\\"s s\\\"s") = ' + str( Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>uuid(namespace) = ' + str( Contemplate.uuid("namespace") ) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    ' 
            _O1 = __i__.data['users']
            if ( len(_O1) > 0  ):
                # be able to use both key/value in loop
                if isinstance(_O1, list): _O4 = enumerate(_O1)
                else: _O4 = _O1.items()
                for _K2,_V3 in _O4 :
                    __i__.data['i'] = _K2
                    __i__.data['usergroup'] = _V3
                     
                    __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + Contemplate.tpl( "sub",  {"i" : __i__.data['i'], "users" : __i__.data['users']} ) 
                     
                    __p__ += '' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '' + "\n" + ''
            return __p__
            
        
        
        # tpl block render method for block 'Block2'
        def _blockfn_Block2(self, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + str( Contemplate.htmltable(__i__.data['table_data'], __i__.data['table_options']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ' 
            if (   ( "foo" in __i__.data )   ):
                 
                __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ' 
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '' + "\n" + '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' + "\n" + '    ';
            __i__.data['foo'] = ("123")
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ' 
            if (   ( "foo" in __i__.data )   ):
                 
                __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ' 
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    ' + str( Contemplate.plugin_test(__i__.data['foo']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + str( Contemplate.plugin_print({          "stringVar"     : "stringValue",          "numericVar"    : 123,          "arrayVar"      : [             0, 1, "astring", 3,              { "prop": 1 }          ]      }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal data in loop</strong><br />' + "\n" + '    ' 
            _O1 = ["a", "b", "c"]
            if ( len(_O1) > 0  ):
                # be able to use both key/value in loop
                if isinstance(_O1, list): _O4 = enumerate(_O1)
                else: _O4 = _O1.items()
                for _K2,_V3 in _O4 :
                    __i__.data['index'] = _K2
                    __i__.data['value'] = _V3
                     
                    __p__ += '' + "\n" + '        [' + str( __i__.data['index'] ) + '] = <strong>' + str( __i__.data['value'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + str( Contemplate.htmlselect(__i__.data['select_data'], __i__.data['select_options']) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + str( Contemplate.htmltable(__i__.data['table_data'], {"header" : True}) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + str( Contemplate.htmlselect(__i__.data['select_data'], {             "optgroups" : ["group1", "group2", "group3"],             "selected" : 3,             "multiple" : False,             "style" : "width:200px;",             "foo123" : ":,=>"         }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + str( Contemplate.ldate("M, d", Contemplate.now()) ) + '' + "\n" + '' 
             
            __p__ += '' + "\n" + '' + "\n" + ''
            return __p__
            
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, __i__=None):
            if ( not __i__ ): __i__ = self

            method = '_blockfn_' + block

            if (hasattr(self, method) and callable(getattr(self, method))):
                return getattr(self, method)(__i__)

            elif self._parent is not None:
                return self._parent.renderBlock(block, __i__)

            return ''
            
        
        # tpl render method
        def render(self, data, __i__=None):
            __p__ = ''
            if ( not __i__ ): __i__ = self

            if self._parent is not None:
                __p__ = self._parent.render(data, __i__)

            else:
                # tpl main render code starts here
                __p__ = ''
                # tpl main render code ends here

            self.data = None
            return __p__
    
    return Contemplate_demo_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
