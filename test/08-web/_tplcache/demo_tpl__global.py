# -*- coding: UTF-8 -*-

# Contemplate cached template 'demo'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_demo__global(Contemplate.Template):
        'Contemplate cached template demo'
        # constructor
        def __init__(self, id=None):
            self_ = self
            super(Contemplate_demo__global, self).__init__(id)
            # extend tpl assign code starts here
            self_.extend('base')
            self_._usesTpl = ['sub']
            # extend tpl assign code ends here
        # tpl-defined blocks render code starts here
        
        
        # tpl block render method for block 'Block3'
        def _blockfn_Block3(self, data, self_, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' + "\n" + '' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>uuid(&quot;namespace&quot;) = ' + str(Contemplate.uuid("namespace")) + '</li>' + "\n" + '    <li>cc(123,&quot;456&quot;,&quot;789&quot;) = concat(&quot;123&quot;,&quot;456&quot;,&quot;789&quot;) = ' + str(str(123)+str("456")+str("789")) + ' = ' + str(str("123")+str("456")+str("789")) + '</li>' + "\n" + '    <li>j(&quot;,&quot;,[1,2,3,[4,5,6,[7,8,9]]]) = join(&quot;,&quot;,[1,2,3,[4,5,6,[7,8,9]]]) = ' + str(Contemplate.join(",",[1,2,3,[4,5,6,[7,8,9]]])) + ' = ' + str(Contemplate.join(",",[1,2,3,[4,5,6,[7,8,9]]])) + '</li>' + "\n" + '    <li>j(&quot;,&quot;,[1,null,3,[4,5,6,[7,null,9]]], true) = join(&quot;,&quot;,[1,null,3,[4,5,6,[7,null,9]]], true) = ' + str(Contemplate.join(",",[1,None,3,[4,5,6,[7,None,9]]], True)) + ' = ' + str(Contemplate.join(",",[1,None,3,[4,5,6,[7,None,9]]], True)) + '</li>' + "\n" + '    <li>is_array([1,2,3]) = ' + str(isinstance([1,2,3],(list,tuple,dict))) + '</li>' + "\n" + '    <li>is_array([1,2,3],true) = ' + str((isinstance([1,2,3],list) if (True) else isinstance([1,2,3],(list,tuple,dict)))) + '</li>' + "\n" + '    <li>is_array({"1":1,"2":2,"3":3}) = ' + str(isinstance({"1":1,"2":2,"3":3},(list,tuple,dict))) + '</li>' + "\n" + '    <li>is_array({"1":1,"2":2,"3":3},true) = ' + str((isinstance({"1":1,"2":2,"3":3},list) if (True) else isinstance({"1":1,"2":2,"3":3},(list,tuple,dict)))) + '</li>' + "\n" + '    <li>in_array(2,[1,2,3]) = ' + str(((2) in ([1,2,3]))) + '</li>' + "\n" + '    <li>in_array(4,[1,2,3]) = ' + str(((4) in ([1,2,3]))) + '</li>' + "\n" + '    <li>keys([1,2,3]) = ' + str(Contemplate.plg_("plg_print",Contemplate.keys([1,2,3]))) + '</li>' + "\n" + '    <li>keys({"1":1,"2":2,"3":3}) = ' + str(Contemplate.plg_("plg_print",Contemplate.keys({"1":1,"2":2,"3":3}))) + '</li>' + "\n" + '    <li>values([1,2,3]) = ' + str(Contemplate.plg_("plg_print",Contemplate.values([1,2,3]))) + '</li>' + "\n" + '    <li>values({"1":1,"2":2,"3":3}) = ' + str(Contemplate.plg_("plg_print",Contemplate.values({"1":1,"2":2,"3":3}))) + '</li>' + "\n" + '    <li>json_encode({"array":[1,2,3]}) = ' + str(Contemplate.plg_("plg_print",Contemplate.json_encode({"array":[1,2,3]}))) + '</li>' + "\n" + '    <li>json_decode(\'{"array":[1,2,3]}\') = ' + str(Contemplate.plg_("plg_print",Contemplate.json_decode('{"array":[1,2,3]}'))) + '</li>' + "\n" + '    <li>q(123) = ' + str("'"+str(123)+"'") + '</li>' + "\n" + '    <li>dq(123) = ' + str('"'+str(123)+'"') + '</li>' + "\n" + '    <li>trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + str(Contemplate.trim("__FOO__", "_")) + '</li>' + "\n" + '    <li>trim(&quot;  FOO  &quot;) = ' + str(Contemplate.trim("  FOO  ")) + '</li>' + "\n" + '    <li>lowercase(&quot;FOO&quot;) = ' + str(Contemplate.lowercase("FOO")) + '</li>' + "\n" + '    <li>lowercase(&quot;fOo&quot;) = ' + str(Contemplate.lowercase("fOo")) + '</li>' + "\n" + '    <li>uppercase(&quot;foo&quot;) = ' + str(Contemplate.uppercase("foo")) + '</li>' + "\n" + '    <li>uppercase(&quot;FoO&quot;) = ' + str(Contemplate.uppercase("FoO")) + '</li>' + "\n" + '    <li>sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + str(Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12)) + '</li>' + "\n" + '    <li>e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + str(Contemplate.e("<ok k=\"v\">")) + '</li>' + "\n" + '    <li>buildquery({"foo":["bar","baz"]}) = ' + str(Contemplate.buildquery({"foo":["bar","baz"]})) + '</li>' + "\n" + '    <li>parsequery("foo[0]=bar&foo[1]=baz") = ' + str(Contemplate.plg_("plg_print",Contemplate.parsequery("foo[0]=bar&foo[1]=baz"))) + '</li>' + "\n" + '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key2"]) = ' + str(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",None,["key2"])) + '</li>' + "\n" + '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]}) = ' + str(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]})) + '</li>' + "\n" + '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"]) = ' + str(Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"])) + '</li>' + "\n" + '    <li>striptags("&lt;p&gt;text in &lt;b&gt;tags&lt;/b&gt;&lt;/p&gt;") = ' + str(Contemplate.striptags("<p>text in <b>tags</b></p>")) + '</li>' + "\n" + '    </ul>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Test plugin with variable $foo</strong><br />' + "\n" + '    ' + str(Contemplate.plg_("plg_test",data['foo'])) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + str(Contemplate.bracket("inlined")) + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + str(Contemplate.plg_("plg_print",{         "stringVar"     : "stringValue",         "numericVar"    : 123,         "arrayVar"      : [             0, 1, "astring", 3,             { "prop": 1 }         ]     })) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + ''
            return __p__
            
        
        
        # tpl block render method for block 'Block2'
        def _blockfn_Block2(self, data, self_, __i__):
            
            __p__ = ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Can reference the super Block2 directly if needed in OO manner</strong>' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- call the super block here in OO manner, if any -->' + "\n" + '    ' + str(self_.sprblock("Block2", data)) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Constructs</strong><hr /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Break and Continue</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $value) %&gt;' + "\n" + '        &lt;% if("b" == $value ) %&gt;Break from loop&lt;% break %&gt;&lt;% fi %&gt;' + "\n" + '        &lt;% $value %&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $value) %&gt;' + "\n" + '        &lt;% if("b" == $value ) %&gt;Continue loop&lt;% continue %&gt;&lt;% fi %&gt;' + "\n" + '        &lt;% $value %&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_9 = ["a", "b", "c"]
            _loc_10 = (_loc_9 if isinstance(_loc_9,(list,tuple)) else _loc_9.values()) if _loc_9 else None
            if (_loc_10):
                for _loc_value in _loc_10:
                     
                    __p__ += '' + "\n" + '        '        
                    if ("b" == _loc_value):
                                 
                        __p__ += 'Break from loop'
                        break
                         
                        __p__ += ''        
                             
                    __p__ += '' + "\n" + '        ' + str(_loc_value) + '' + "\n" + '    '
             
            __p__ += '' + "\n" + '    <br />' + "\n" + '    '
            _loc_18 = ["a", "b", "c"]
            _loc_19 = (_loc_18 if isinstance(_loc_18,(list,tuple)) else _loc_18.values()) if _loc_18 else None
            if (_loc_19):
                for _loc_value in _loc_19:
                     
                    __p__ += '' + "\n" + '        '        
                    if ("b" == _loc_value):
                                 
                        __p__ += 'Continue loop'
                        continue
                         
                        __p__ += ''        
                             
                    __p__ += '' + "\n" + '        ' + str(_loc_value) + '' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $index=>$value) %&gt;' + "\n" + '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_28 = ["a", "b", "c"]
            _loc_29 = (enumerate(_loc_28) if isinstance(_loc_28,(list,tuple)) else _loc_28.items()) if _loc_28 else None
            if (_loc_29):
                for _loc_index,_loc_value in _loc_29:
                     
                    __p__ += '' + "\n" + '        [' + str(_loc_index) + '] = <strong>' + str(_loc_value) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $value2) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_36 = ["a", "b", "c"]
            _loc_37 = (_loc_36 if isinstance(_loc_36,(list,tuple)) else _loc_36.values()) if _loc_36 else None
            if (_loc_37):
                for _loc_value2 in _loc_37:
                     
                    __p__ += '' + "\n" + '        <strong>' + str(_loc_value2) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' + "\n" + '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_47 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_48 = (enumerate(_loc_47) if isinstance(_loc_47,(list,tuple)) else _loc_47.items()) if _loc_47 else None
            if (_loc_48):
                for _loc_index3,_loc_value3 in _loc_48:
                     
                    __p__ += '' + "\n" + '        [' + str(_loc_index3) + '] = <strong>' + str(_loc_value3) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_58 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_59 = (_loc_58 if isinstance(_loc_58,(list,tuple)) else _loc_58.values()) if _loc_58 else None
            if (_loc_59):
                for _loc_value4 in _loc_59:
                     
                    __p__ += '' + "\n" + '        <strong>' + str(_loc_value4) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($index4,$value4 in ["a", "b", "c"]) %&gt;' + "\n" + '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_66 = ["a", "b", "c"]
            _loc_67 = (enumerate(_loc_66) if isinstance(_loc_66,(list,tuple)) else _loc_66.items()) if _loc_66 else None
            if (_loc_67):
                for _loc_index4,_loc_value4 in _loc_67:
                     
                    __p__ += '' + "\n" + '        [' + str(_loc_index4) + '] = <strong>' + str(_loc_value4) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($value5 in ["a", "b", "c"]) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_74 = ["a", "b", "c"]
            _loc_75 = (_loc_74 if isinstance(_loc_74,(list,tuple)) else _loc_74.values()) if _loc_74 else None
            if (_loc_75):
                for _loc_value5 in _loc_75:
                     
                    __p__ += '' + "\n" + '        <strong>' + str(_loc_value5) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_85 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_86 = (enumerate(_loc_85) if isinstance(_loc_85,(list,tuple)) else _loc_85.items()) if _loc_85 else None
            if (_loc_86):
                for _loc_index6,_loc_value7 in _loc_86:
                     
                    __p__ += '' + "\n" + '        [' + str(_loc_index6) + '] = <strong>' + str(_loc_value7) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_96 = {"k1":"a", "k2":"b", "k3":"c"}
            _loc_97 = (_loc_96 if isinstance(_loc_96,(list,tuple)) else _loc_96.values()) if _loc_96 else None
            if (_loc_97):
                for _loc_value8 in _loc_97:
                     
                    __p__ += '' + "\n" + '        <strong>' + str(_loc_value8) + '</strong><br />' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( 1+1 != 2 ) %&gt;' + "\n" + '        1+1 != 2' + "\n" + '    &lt;% elif( 1+1 == 1) %&gt;' + "\n" + '        1+1 = 1' + "\n" + '    &lt;% else %&gt;' + "\n" + '        1+1 = 2' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if (1+1 != 2):
                 
                __p__ += '' + "\n" + '        1+1 != 2' + "\n" + '    '
            elif (1+1 == 1):
                 
                __p__ += '' + "\n" + '        1+1 = 1' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        1+1 = 2' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Inline (ternary) IF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% iif( 1+1 == 2, "1+1 = 2", "1+1 = 1" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + str((("1+1 = 2") if (1+1 == 2) else ("1+1 = 1"))) + '' + "\n" + '' + "\n" + '    <pre>' + "\n" + '    &lt;% iif( 1+1 == 1, "1+1 = 1", "1+1 = 2" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + str((("1+1 = 1") if (1+1 == 1) else ("1+1 = 2"))) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Inline (ternary) IF (2)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% iif( !empty($undefined_variable), $undefined_variable, "test with undefined variable passed" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + str(((data['undefined_variable']) if (not (("undefined_variable" not in data) or (data['undefined_variable'] is None) or Contemplate.empty(data['undefined_variable']))) else ("test with undefined variable passed"))) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>SET a new tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% set($foo, "123") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            data['foo'] = ("123")
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>SET a new (local) tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% local_set($foo_loc, 456) %&gt;' + "\n" + '    &lt;% set($foo_loc, $foo_loc+1) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_foo_loc = (456)
             
            __p__ += '' + "\n" + '    '
            _loc_foo_loc = (_loc_foo_loc+1)
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK ISSET for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( isset($foo) ) %&gt;' + "\n" + '        $foo is SET' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo is NOT SET' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if ((("foo" in data) and (data['foo'] is not None))):
                 
                __p__ += '' + "\n" + '        $foo = ' + str(data['foo']) + ', is SET' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo is NOT SET' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK ISSET for a (local) tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( isset($foo_loc) ) %&gt;' + "\n" + '        $foo_loc is SET' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo_loc is NOT SET' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if ((("_loc_foo_loc" in locals()) and (_loc_foo_loc is not None))):
                 
                __p__ += '' + "\n" + '        $foo_loc = ' + str(_loc_foo_loc) + ', is SET' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo_loc is NOT SET' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK EMPTY for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( empty($foo) ) %&gt;' + "\n" + '        $foo is EMPTY' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo is NOT EMPTY' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if ((("foo" not in data) or (data['foo'] is None) or Contemplate.empty(data['foo']))):
                 
                __p__ += '' + "\n" + '        $foo is EMPTY' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo = ' + str(data['foo']) + ', is NOT EMPTY' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK EMPTY for a (local) tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( empty($foo_loc) ) %&gt;' + "\n" + '        $foo_loc is EMPTY' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo_loc is NOT EMPTY' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            if ((("_loc_foo_loc" not in locals()) or (_loc_foo_loc is None) or Contemplate.empty(_loc_foo_loc))):
                 
                __p__ += '' + "\n" + '        $foo_loc is EMPTY' + "\n" + '    '
            else:
                 
                __p__ += '' + "\n" + '        $foo_loc = ' + str(_loc_foo_loc) + ', is NOT EMPTY' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '    <strong>INCLUDE a (sub-)template file</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% include("date") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    <!-- print a localized date php-style -->' + "\n" + '<strong>A date, PHP-style</strong><br />' + "\n" + '' + str(Contemplate.date("M, D, d")) + '' + "\n" + ''
             
            __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CALL another (sub-)template</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($users as $i=>$usergroup) %&gt;' + "\n" + '        &lt;!-- call a (sub-)template --&gt;' + "\n" + '        &lt;% tpl("sub", {"i" : $i, "users" : $users}) %&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    '
            _loc_5 = data['users']
            _loc_6 = (enumerate(_loc_5) if isinstance(_loc_5,(list,tuple)) else _loc_5.items()) if _loc_5 else None
            if (_loc_6):
                for _loc_i,_loc_usergroup in _loc_6:
                     
                    __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + str(Contemplate.tpl("sub", {"i" : _loc_i, "users" : data['users']})) + '' + "\n" + '    '
             
            __p__ += '' + "\n" + '' + "\n" + ''
            return __p__
            
        
        
        # tpl block render method for block 'Block12'
        def _blockfn_Block12(self, data, self_, __i__):
            
            __p__ = ''
             
            __p__ += 'Demo template nested Block12'
            return __p__
            
        
        # tpl-defined blocks render code ends here
        # render a tpl block method
        def block(self, block, data, __i__=None):
            self_ = self
            __ctx = False
            r = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx(self._ctx)
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                r = getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                r = self_._extends.block(block, data, __i__)
            if __ctx:  Contemplate._set_ctx(__ctx)
            return r
        # render method
        def render(self, data, __i__=None):
            self_ = self
            __ctx = False
            __p__ = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx(self._ctx)
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ = ''
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx(__ctx)
            return __p__
    return Contemplate_demo__global
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
