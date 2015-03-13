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
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%uuid(&quot;namespace&quot;) = ' + str(Contemplate.uuid("namespace") ) + '</li>' + "\n" + '    <li>%echo(&quot;123&quot;) = ' + str(str("123") ) + '</li>' + "\n" + '    <li>%q(123) = ' + str("'"+str(123)+"'" ) + '</li>' + "\n" + '    <li>%dq(123) = ' + str('"'+str(123)+'"' ) + '</li>' + "\n" + '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + str(Contemplate.trim("__FOO__", "_") ) + '</li>' + "\n" + '    <li>%trim(&quot;  FOO  &quot;) = ' + str(Contemplate.trim("  FOO  ") ) + '</li>' + "\n" + '    <li>%lowercase(&quot;FOO&quot;) = ' + str(str("FOO").lower() ) + '</li>' + "\n" + '    <li>%lowercase(&quot;fOo&quot;) = ' + str(str("fOo").lower() ) + '</li>' + "\n" + '    <li>%uppercase(&quot;foo&quot;) = ' + str(str("foo").upper() ) + '</li>' + "\n" + '    <li>%uppercase(&quot;FoO&quot;) = ' + str(str("FoO").upper() ) + '</li>' + "\n" + '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' + str(Contemplate.camelcase("camel_case", "_") ) + '</li>' + "\n" + '    <li>%camelcase(&quot;camelCase&quot;) = ' + str(Contemplate.camelcase("camelCase") ) + '</li>' + "\n" + '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' + str(Contemplate.snakecase("snakeCase", "_") ) + '</li>' + "\n" + '    <li>%snakecase(&quot;snake_case&quot;) = ' + str(Contemplate.snakecase("snake_case") ) + '</li>' + "\n" + '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + str(Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12) ) + '</li>' + "\n" + '    <li>%addslashes(&quot;this string\'s s\&quot;s s\\&quot;s s\\\&quot;s&quot;) = ' + str(Contemplate.addslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>%stripslashes(&quot;this string\'s s\&quot;s s\\&quot;s s\\\&quot;s&quot;) = ' + str(Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' + str(Contemplate.locale("locale") ) + ' = ' + str(Contemplate.locale("locale") ) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 1) = ' + str(Contemplate.pluralise("item", 1) ) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 2) = ' + str(Contemplate.pluralise("item", 2) ) + '</li>' + "\n" + '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + str(Contemplate.e("<ok k=\"v\">") ) + '</li>' + "\n" + '    <li>%html(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + str(Contemplate.html("<ok k=\"v\">") ) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + str(Contemplate.htmltable(data['table_data'], data['table_options']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + str(Contemplate.htmlselect(data['select_data'], data['select_options']) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + str(Contemplate.htmltable(data['table_data'], {"header" : True, "tpl_cell": Contemplate.inline("<td>{{value}} (inline compiled tpl)</td>",{"{{value}}":"cell"}, True)}) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + str(Contemplate.htmlselect(data['select_data'], {             "foo123" : ":,=>",             "optgroups" : ["group1", "group2", "group3"],             "selected" : 3,             "multiple" : False,             "style" : "width:200px;",             "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>'         }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test plugin with variable $foo</strong><br />' + "\n" + '    ' + str(Contemplate.plg_test(data['foo']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + str(Contemplate.bracket( "inlined" ) ) + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + str(Contemplate.plg_print({          "stringVar"     : "stringValue",          "numericVar"    : 123,          "arrayVar"      : [             0, 1, "astring", 3,              { "prop": 1 }          ]      }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + ''
            return __p__
            
        
        
        # tpl block render method for block 'Block2'
        def _blockfn_Block2(self, data, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Constructs</strong><hr /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for(["a", "b", "c"] as $index=>$value) %&gt;' + "\n" + '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_9 = ["a", "b", "c"]
            _loc_10 = (enumerate(_loc_9) if isinstance(_loc_9,(list, tuple)) else _loc_9.items()) if _loc_9 else None
            if (_loc_10):
                for _loc_index,_loc_value in _loc_10:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index ) + '] = <strong>' + str( _loc_value ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for(["a", "b", "c"] as $value2) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_17 = ["a", "b", "c"]
            _loc_18 = (_loc_17 if isinstance(_loc_17,(list, tuple)) else _loc_17.values()) if _loc_17 else None
            if (_loc_18):
                for _loc_value2 in _loc_18:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value2 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' + "\n" + '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_28 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_29 = (enumerate(_loc_28) if isinstance(_loc_28,(list, tuple)) else _loc_28.items()) if _loc_28 else None
            if (_loc_29):
                for _loc_index3,_loc_value3 in _loc_29:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index3 ) + '] = <strong>' + str( _loc_value3 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_39 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_40 = (_loc_39 if isinstance(_loc_39,(list, tuple)) else _loc_39.values()) if _loc_39 else None
            if (_loc_40):
                for _loc_value4 in _loc_40:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value4 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($index4,$value4 in ["a", "b", "c"]) %&gt;' + "\n" + '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_47 = ["a", "b", "c"]
            _loc_48 = (enumerate(_loc_47) if isinstance(_loc_47,(list, tuple)) else _loc_47.items()) if _loc_47 else None
            if (_loc_48):
                for _loc_index4,_loc_value4 in _loc_48:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index4 ) + '] = <strong>' + str( _loc_value4 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($value5 in ["a", "b", "c"]) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_55 = ["a", "b", "c"]
            _loc_56 = (_loc_55 if isinstance(_loc_55,(list, tuple)) else _loc_55.values()) if _loc_55 else None
            if (_loc_56):
                for _loc_value5 in _loc_56:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value5 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_66 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_67 = (enumerate(_loc_66) if isinstance(_loc_66,(list, tuple)) else _loc_66.items()) if _loc_66 else None
            if (_loc_67):
                for _loc_index6,_loc_value7 in _loc_67:
                     
                    __p__ += '' + "\n" + '        [' + str( _loc_index6 ) + '] = <strong>' + str( _loc_value7 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_77 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_78 = (_loc_77 if isinstance(_loc_77,(list, tuple)) else _loc_77.values()) if _loc_77 else None
            if (_loc_78):
                for _loc_value8 in _loc_78:
                     
                    __p__ += '' + "\n" + '        <strong>' + str( _loc_value8 ) + '</strong><br /> ' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( 1+1 == 2 ) %&gt;' + "\n" + '        1+1 = 2' + "\n" + '    &lt;% %elseif( 1+1 == 1) %&gt;' + "\n" + '        1+1 = 1' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        unkonown result' + "\n" + '    &lt;% %endif() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if ( 1+1 == 2 ):
                 
                __p__ += '' + "\n" + '        1+1 = 2' + "\n" + '    '
            elif ( 1+1 == 1):
                 
                __p__ += '' + "\n" + '        1+1 = 1' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        unkonown result' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>SET a new tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %set($foo, "123") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
            data['foo'] = ("123")
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>CHECK ISSET for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( %isset($foo) ) %&gt;' + "\n" + '        $foo is SET' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        $foo is NOT SET' + "\n" + '    &lt;% %endif() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if (("foo" in data) ):
                 
                __p__ += '' + "\n" + '        $foo is SET' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT SET' + "\n" + '    '
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '    <strong>INCLUDE a (sub-)template file</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %include("date") %&gt;' + "\n" + '    </pre><br />' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + str(Contemplate.ldate("M, d", Contemplate.time()) ) + '' + "\n" + ''
             
            __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CALL another (sub-)template</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($users as $i=>$usergroup) %&gt;' + "\n" + '        &lt;!-- call a (sub-)template --&gt;' + "\n" + '        &lt;% %tpl("sub", {"i" : $i, "users" : $users}) %&gt;' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_5 = data['users']
            _loc_6 = (enumerate(_loc_5) if isinstance(_loc_5,(list, tuple)) else _loc_5.items()) if _loc_5 else None
            if (_loc_6):
                for _loc_i,_loc_usergroup in _loc_6:
                     
                    __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + str(Contemplate.tpl("sub", {"i" : _loc_i, "users" : data['users']}) ) + '' + "\n" + '    '
             
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
