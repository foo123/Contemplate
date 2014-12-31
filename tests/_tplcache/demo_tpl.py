# -*- coding: UTF-8 -*-
# Contemplate cached template 'demo'

# imports start here, if any

# imports end here
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_demo_Cached(Contemplate.Template):
        'Contemplate cached template demo'

        # constructor
        def __init__(self, id=None):
            # initialize internal vars
            self._renderer = None
            self._extends = None
            self._blocks = None
            self.id = None
            self.id = id
            
            # extend tpl assign code starts here
            self.extend('base')
            # extend tpl assign code ends here

        # tpl-defined blocks render code starts here
        
        
        # tpl block render method for block 'Block3'
        def _blockfn_Block3(self, data, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%uuid(&quot;namespace&quot;) = ' + str(Contemplate.uuid("namespace") ) + '</li>' + "\n" + '    <li>%echo(&quot;123&quot;) = ' + str(str("123") ) + '</li>' + "\n" + '    <li>%q(123) = ' + str("'"+str(123)+"'" ) + '</li>' + "\n" + '    <li>%dq(123) = ' + str('"'+str(123)+'"' ) + '</li>' + "\n" + '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + str(Contemplate.trim("__FOO__", "_") ) + '</li>' + "\n" + '    <li>%trim(&quot;  FOO  &quot;) = ' + str(Contemplate.trim("  FOO  ") ) + '</li>' + "\n" + '    <li>%lowercase(&quot;FOO&quot;) = ' + str(str("FOO").lower() ) + '</li>' + "\n" + '    <li>%lowercase(&quot;fOo&quot;) = ' + str(str("fOo").lower() ) + '</li>' + "\n" + '    <li>%uppercase(&quot;foo&quot;) = ' + str(str("foo").upper() ) + '</li>' + "\n" + '    <li>%uppercase(&quot;FoO&quot;) = ' + str(str("FoO").upper() ) + '</li>' + "\n" + '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' + str(Contemplate.camelcase("camel_case", "_") ) + '</li>' + "\n" + '    <li>%camelcase(&quot;camelCase&quot;) = ' + str(Contemplate.camelcase("camelCase") ) + '</li>' + "\n" + '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' + str(Contemplate.snakecase("snakeCase", "_") ) + '</li>' + "\n" + '    <li>%snakecase(&quot;snake_case&quot;) = ' + str(Contemplate.snakecase("snake_case") ) + '</li>' + "\n" + '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + str(Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12) ) + '</li>' + "\n" + '    <li>%addslashes(&quot;this string\'s s\&quot;s s\\&quot;s s\\\&quot;s&quot;) = ' + str(Contemplate.addslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>%stripslashes(&quot;this string\'s s\&quot;s s\\&quot;s s\\\&quot;s&quot;) = ' + str(Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' + str(Contemplate.locale("locale") ) + ' = ' + str(Contemplate.locale("locale") ) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 1) = ' + str(Contemplate.pluralise("item", 1) ) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 2) = ' + str(Contemplate.pluralise("item", 2) ) + '</li>' + "\n" + '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + str(Contemplate.e('<ok k="v">') ) + '</li>' + "\n" + '    <li>%html(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + str(Contemplate.html('<ok k="v">') ) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    '
            _loc_29 = data['users']
            _loc_30 = (enumerate(_loc_29) if isinstance(_loc_29,(list, tuple)) else _loc_29.items()) if _loc_29 else None
            if (_loc_30):
                for _loc_i,_loc_usergroup in _loc_30:
                     
                    __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + str(Contemplate.tpl("sub", {"i" : _loc_i, "users" : data['users']}) ) + '' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + ''
            return __p__
            
        
        
        # tpl block render method for block 'Block2'
        def _blockfn_Block2(self, data, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + str(Contemplate.htmltable(data['table_data'], data['table_options']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + str(Contemplate.bracket( "inlined" ) ) + '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    '
            if (("foo" in data) ):
                 
                __p__ += '' + "\n" + '        $foo is set' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    '
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '' + "\n" + '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' + "\n" + '    ';
            data['foo'] = ("123")
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    '
            if (("foo" in data) ):
                 
                __p__ += '' + "\n" + '        $foo is set' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    '
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    ' + str(Contemplate.plg_test(data['foo']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + str(Contemplate.plg_print({          "stringVar"     : "stringValue",          "numericVar"    : 123,          "arrayVar"      : [             0, 1, "astring", 3,              { "prop": 1 }          ]      }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (php-style)</strong><br />' + "\n" + '    '
            _loc_23 = ["a", "b", "c"]
            _loc_24 = (enumerate(_loc_23) if isinstance(_loc_23,(list, tuple)) else _loc_23.items()) if _loc_23 else None
            if (_loc_24):
                for _loc_index,_loc_value in _loc_24:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index ) + '] = <strong>' + str( _loc_value ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' + "\n" + '    '
            _loc_31 = ["a", "b", "c"]
            _loc_32 = (_loc_31 if isinstance(_loc_31,(list, tuple)) else _loc_31.values()) if _loc_31 else None
            if (_loc_32):
                for _loc_value2 in _loc_32:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value2 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (php-style)</strong><br />' + "\n" + '    '
            _loc_42 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_43 = (enumerate(_loc_42) if isinstance(_loc_42,(list, tuple)) else _loc_42.items()) if _loc_42 else None
            if (_loc_43):
                for _loc_index3,_loc_value3 in _loc_43:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index3 ) + '] = <strong>' + str( _loc_value3 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' + "\n" + '    '
            _loc_53 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_54 = (_loc_53 if isinstance(_loc_53,(list, tuple)) else _loc_53.values()) if _loc_53 else None
            if (_loc_54):
                for _loc_value4 in _loc_54:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value4 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (python-style)</strong><br />' + "\n" + '    '
            _loc_61 = ["a", "b", "c"]
            _loc_62 = (enumerate(_loc_61) if isinstance(_loc_61,(list, tuple)) else _loc_61.items()) if _loc_61 else None
            if (_loc_62):
                for _loc_index4,_loc_value4 in _loc_62:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index4 ) + '] = <strong>' + str( _loc_value4 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' + "\n" + '    '
            _loc_69 = ["a", "b", "c"]
            _loc_70 = (_loc_69 if isinstance(_loc_69,(list, tuple)) else _loc_69.values()) if _loc_69 else None
            if (_loc_70):
                for _loc_value5 in _loc_70:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value5 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (python-style)</strong><br />' + "\n" + '    '
            _loc_80 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_81 = (enumerate(_loc_80) if isinstance(_loc_80,(list, tuple)) else _loc_80.items()) if _loc_80 else None
            if (_loc_81):
                for _loc_index6,_loc_value7 in _loc_81:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index6 ) + '] = <strong>' + str( _loc_value7 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' + "\n" + '    '
            _loc_91 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_92 = (_loc_91 if isinstance(_loc_91,(list, tuple)) else _loc_91.values()) if _loc_91 else None
            if (_loc_92):
                for _loc_value8 in _loc_92:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value8 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + str(Contemplate.htmlselect(data['select_data'], data['select_options']) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + str(Contemplate.htmltable(data['table_data'], {"header" : True, "tpl_cell": Contemplate.inline("<td>{{value}} (inline compiled tpl)</td>",{"{{value}}":"cell"}, True)}) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + str(Contemplate.htmlselect(data['select_data'], {             "foo123" : ":,=>",             "optgroups" : ["group1", "group2", "group3"],             "selected" : 3,             "multiple" : False,             "style" : "width:200px;",             "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>'         }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + str(Contemplate.ldate("M, d", Contemplate.time()) ) + '' + "\n" + ''
             
            __p__ += '' + "\n" + '' + "\n" + ''
            return __p__
            
        
        
        # tpl block render method for block 'Block12'
        def _blockfn_Block12(self, data, __i__):
            
            __p__ = ''
             
            __p__ += 'Demo template nested Block12'
            return __p__
            
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, data, __i__=None):
            if not __i__: __i__ = self
            method = '_blockfn_' + block
            if (hasattr(self, method) and callable(getattr(self, method))):
                return getattr(self, method)(data, __i__)
            elif self._extends:
                return self._extends.renderBlock(block, data, __i__)
            return ''
            
        # tpl render method
        def render(self, data, __i__=None):
            if  not __i__: __i__ = self
            __p__ = ''
            if self._extends:
                __p__ = self._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ = ''
                
                # tpl main render code ends here

            return __p__
    
    return Contemplate_demo_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
