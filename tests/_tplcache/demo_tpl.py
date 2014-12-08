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
            self.d = None
            self._renderFunction = None
            self._extends = None
            self._blocks = None

            self.id = id
            
            # extend tpl assign code starts here
            self.extend( 'base' )
            # extend tpl assign code ends here



        # tpl-defined blocks render code starts here
        
        
        # tpl block render method for block 'Block3'
        def _blockfn_Block3(self, __i__):
            
            __p__ = ''
            data = __i__.d
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%e(&lt;ok k=&quot;v&quot;&gt;) = ' + str( Contemplate.e('<ok k="v">') ) + '</li>' + "\n" + '    <li>%html(&lt;ok k=&quot;v&quot;&gt;) = ' + str( Contemplate.html('<ok k="v">') ) + '</li>' + "\n" + '    <li>trim(__FOO__, _) = ' + str( Contemplate.trim("__FOO__", "_") ) + '</li>' + "\n" + '    <li>trim(  FOO  ) = ' + str( Contemplate.trim("  FOO  ") ) + '</li>' + "\n" + '    <li>lowercase(FOO) = ' + str( Contemplate.lowercase("FOO") ) + '</li>' + "\n" + '    <li>lowercase(fOo) = ' + str( Contemplate.lowercase("fOo") ) + '</li>' + "\n" + '    <li>uppercase(foo) = ' + str( Contemplate.uppercase("foo") ) + '</li>' + "\n" + '    <li>uppercase(FoO) = ' + str( Contemplate.uppercase("FoO") ) + '</li>' + "\n" + '    <li>camelcase(camel_case, _) = ' + str( Contemplate.camelcase("camel_case", "_") ) + '</li>' + "\n" + '    <li>camelcase(camelCase) = ' + str( Contemplate.camelcase("camelCase") ) + '</li>' + "\n" + '    <li>snakecase(snakeCase, _) = ' + str( Contemplate.snakecase("snakeCase", "_") ) + '</li>' + "\n" + '    <li>snakecase(snake_case) = ' + str( Contemplate.snakecase("snake_case") ) + '</li>' + "\n" + '    <li>l(locale) = ' + str( Contemplate.l("locale") ) + '</li>' + "\n" + '    <li>locale(locale) = ' + str( Contemplate.locale("locale") ) + '</li>' + "\n" + '    <li>pluralise(item, 1) = ' + str( Contemplate.pluralise("item", 1) ) + '</li>' + "\n" + '    <li>pluralise(item, 2) = ' + str( Contemplate.pluralise("item", 2) ) + '</li>' + "\n" + '    <li>sprintf("%02d : %02d : %02d", 2, 0, 12) = ' + str( Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12) ) + '</li>' + "\n" + '    <li>addslashes("this string\'s s\"s s\\"s s\\\"s") = ' + str( Contemplate.addslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>stripslashes("this string\'s s\"s s\\"s s\\\"s") = ' + str( Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>uuid(namespace) = ' + str( Contemplate.uuid("namespace") ) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    ' 
            _O1 = Contemplate.items(data['users'])
            if (_O1):
                for _K2,_V3 in _O1:
                    data['i'] = _K2
                    data['usergroup'] = _V3
                     
                    __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + Contemplate.tpl( "sub",  {"i" : data['i'], "users" : data['users']} ) 
                     
                    __p__ += '' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '' + "\n" + '';
            return __p__
            
        
        
        # tpl block render method for block 'Block2'
        def _blockfn_Block2(self, __i__):
            
            __p__ = ''
            data = __i__.d
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + str( Contemplate.htmltable(data['table_data'], data['table_options']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + str( Contemplate.bracket( "inlined" ) ) + '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ' 
            if (  ("foo" in data)  ):
                 
                __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ' 
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '' + "\n" + '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' + "\n" + '    ';
            data['foo'] = ("123")
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ' 
            if (  ("foo" in data)  ):
                 
                __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ' 
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    ' + str( Contemplate.plg_test(data['foo']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + str( Contemplate.plg_print({          "stringVar"     : "stringValue",          "numericVar"    : 123,          "arrayVar"      : [             0, 1, "astring", 3,              { "prop": 1 }          ]      }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (php-style)</strong><br />' + "\n" + '    ' 
            _O1 = Contemplate.items(["a", "b", "c"])
            if (_O1):
                for _K2,_V3 in _O1:
                    data['index'] = _K2
                    data['value'] = _V3
                     
                    __p__ += '' + "\n" + '        [' + str( data['index'] ) + '] = <strong>' + str( data['value'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' + "\n" + '    ' 
            _O4 = Contemplate.values(["a", "b", "c"])
            if (_O4):
                for _V5 in _O4:
                    data['value2'] = _V5
                     
                    __p__ += '' + "\n" + '        <strong>' + str( data['value2'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (php-style)</strong><br />' + "\n" + '    ' 
            _O6 = Contemplate.items({"k1":"a", "k2":"b", "k3":"c"})
            if (_O6):
                for _K7,_V8 in _O6:
                    data['index3'] = _K7
                    data['value3'] = _V8
                     
                    __p__ += '' + "\n" + '        [' + str( data['index3'] ) + '] = <strong>' + str( data['value3'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' + "\n" + '    ' 
            _O9 = Contemplate.values({"k1":"a", "k2":"b", "k3":"c"})
            if (_O9):
                for _V10 in _O9:
                    data['value4'] = _V10
                     
                    __p__ += '' + "\n" + '        <strong>' + str( data['value4'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (python-style)</strong><br />' + "\n" + '    ' 
            _O11 = Contemplate.items(["a", "b", "c"])
            if (_O11):
                for _K12,_V13 in _O11:
                    data['index4'] = _K12
                    data['value4'] = _V13
                     
                    __p__ += '' + "\n" + '        [' + str( data['index4'] ) + '] = <strong>' + str( data['value4'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' + "\n" + '    ' 
            _O14 = Contemplate.values(["a", "b", "c"])
            if (_O14):
                for _V15 in _O14:
                    data['value5'] = _V15
                     
                    __p__ += '' + "\n" + '        <strong>' + str( data['value5'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (python-style)</strong><br />' + "\n" + '    ' 
            _O16 = Contemplate.items({"k1":"a", "k2":"b", "k3":"c"})
            if (_O16):
                for _K17,_V18 in _O16:
                    data['index6'] = _K17
                    data['value7'] = _V18
                     
                    __p__ += '' + "\n" + '        [' + str( data['index6'] ) + '] = <strong>' + str( data['value7'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' + "\n" + '    ' 
            _O19 = Contemplate.values({"k1":"a", "k2":"b", "k3":"c"})
            if (_O19):
                for _V20 in _O19:
                    data['value8'] = _V20
                     
                    __p__ += '' + "\n" + '        <strong>' + str( data['value8'] ) + '</strong><br /> ' + "\n" + '    ' 
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + str( Contemplate.htmlselect(data['select_data'], data['select_options']) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + str( Contemplate.htmltable(data['table_data'], {"header" : True, "tpl_cell": Contemplate.inline("<td>{{value}} (inline tpl)</td>",{"{{value}}":"cell"})}) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + str( Contemplate.htmlselect(data['select_data'], {             "foo123" : ":,=>",             "optgroups" : ["group1", "group2", "group3"],             "selected" : 3,             "multiple" : False,             "style" : "width:200px;",             "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>'         }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + str( Contemplate.ldate("M, d", Contemplate.now()) ) + '' + "\n" + '' 
             
            __p__ += '' + "\n" + '' + "\n" + '';
            return __p__
            
        
        
        # tpl block render method for block 'Block12'
        def _blockfn_Block12(self, __i__):
            
            __p__ = ''
            data = __i__.d
             
            __p__ += 'Demo template nested Block12';
            return __p__
            
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, __i__=None):
            if ( not __i__ ): __i__ = self

            method = '_blockfn_' + block

            if (hasattr(self, method) and callable(getattr(self, method))):
                return getattr(self, method)(__i__)

            elif self._extends:
                return self._extends.renderBlock(block, __i__)

            return ''
            
        
        # tpl render method
        def render(self, data, __i__=None):
            __p__ = ''
            if ( not __i__ ): __i__ = self

            if self._extends:
                __p__ = self._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                __p__ = ''
                # tpl main render code ends here

            self.d = None
            return __p__
    
    return Contemplate_demo_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
