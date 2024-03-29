
!function(root, name, factory) {
"use strict";
if (('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import'])) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if (('object'===typeof module)&&module.exports) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if (('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}('undefined' !== typeof self ? self : this,'Contemplate_demo__global',function() {
"use strict";
return function(Contemplate) {
/* Contemplate cached template 'demo', constructor */
function Contemplate_demo__global(id)
{
    var self = this;
    Contemplate.Template.call(self, id);
    /* tpl-defined blocks render code starts here */
    
    self._blocks = {
    
    
    /* tpl block render method for block 'Block3' */
    'Block3': function(Contemplate, data, self, __i__) {
        "use strict";
        var __p__ = '';
        
        __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' + "\n" + '' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>uuid(&quot;namespace&quot;) = ' + (Contemplate.uuid("namespace")) + '</li>' + "\n" + '    <li>cc(123,&quot;456&quot;,&quot;789&quot;) = concat(&quot;123&quot;,&quot;456&quot;,&quot;789&quot;) = ' + (String(123)+String("456")+String("789")) + ' = ' + (String("123")+String("456")+String("789")) + '</li>' + "\n" + '    <li>j(&quot;,&quot;,[1,2,3,[4,5,6,[7,8,9]]]) = join(&quot;,&quot;,[1,2,3,[4,5,6,[7,8,9]]]) = ' + (Contemplate.join(",",[1,2,3,[4,5,6,[7,8,9]]])) + ' = ' + (Contemplate.join(",",[1,2,3,[4,5,6,[7,8,9]]])) + '</li>' + "\n" + '    <li>j(&quot;,&quot;,[1,null,3,[4,5,6,[7,null,9]]], true) = join(&quot;,&quot;,[1,null,3,[4,5,6,[7,null,9]]], true) = ' + (Contemplate.join(",",[1,null,3,[4,5,6,[7,null,9]]], true)) + ' = ' + (Contemplate.join(",",[1,null,3,[4,5,6,[7,null,9]]], true)) + '</li>' + "\n" + '    <li>is_array([1,2,3]) = ' + (('[object Array]'===Object.prototype.toString.call([1,2,3])||'[object Object]'===Object.prototype.toString.call([1,2,3]))) + '</li>' + "\n" + '    <li>is_array([1,2,3],true) = ' + (((true) ? '[object Array]' === Object.prototype.toString.call([1,2,3]) : '[object Array]' === Object.prototype.toString.call([1,2,3]) || '[object Object]' === Object.prototype.toString.call([1,2,3]))) + '</li>' + "\n" + '    <li>is_array({"1":1,"2":2,"3":3}) = ' + (('[object Array]'===Object.prototype.toString.call({"1":1,"2":2,"3":3})||'[object Object]'===Object.prototype.toString.call({"1":1,"2":2,"3":3}))) + '</li>' + "\n" + '    <li>is_array({"1":1,"2":2,"3":3},true) = ' + (((true) ? '[object Array]' === Object.prototype.toString.call({"1":1,"2":2,"3":3}) : '[object Array]' === Object.prototype.toString.call({"1":1,"2":2,"3":3}) || '[object Object]' === Object.prototype.toString.call({"1":1,"2":2,"3":3}))) + '</li>' + "\n" + '    <li>in_array(2,[1,2,3]) = ' + ((-1<([1,2,3]).indexOf(2))) + '</li>' + "\n" + '    <li>in_array(4,[1,2,3]) = ' + ((-1<([1,2,3]).indexOf(4))) + '</li>' + "\n" + '    <li>keys([1,2,3]) = ' + (Contemplate.plg_("plg_print",Contemplate.keys([1,2,3]))) + '</li>' + "\n" + '    <li>keys({"1":1,"2":2,"3":3}) = ' + (Contemplate.plg_("plg_print",Contemplate.keys({"1":1,"2":2,"3":3}))) + '</li>' + "\n" + '    <li>values([1,2,3]) = ' + (Contemplate.plg_("plg_print",Contemplate.values([1,2,3]))) + '</li>' + "\n" + '    <li>values({"1":1,"2":2,"3":3}) = ' + (Contemplate.plg_("plg_print",Contemplate.values({"1":1,"2":2,"3":3}))) + '</li>' + "\n" + '    <li>json_encode({"array":[1,2,3]}) = ' + (Contemplate.plg_("plg_print",Contemplate.json_encode({"array":[1,2,3]}))) + '</li>' + "\n" + '    <li>json_decode(\'{"array":[1,2,3]}\') = ' + (Contemplate.plg_("plg_print",Contemplate.json_decode('{"array":[1,2,3]}'))) + '</li>' + "\n" + '    <li>q(123) = ' + ("'"+(123)+"'") + '</li>' + "\n" + '    <li>dq(123) = ' + ('"'+(123)+'"') + '</li>' + "\n" + '    <li>trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + (Contemplate.trim("__FOO__", "_")) + '</li>' + "\n" + '    <li>trim(&quot;  FOO  &quot;) = ' + (Contemplate.trim("  FOO  ")) + '</li>' + "\n" + '    <li>lowercase(&quot;FOO&quot;) = ' + (Contemplate.lowercase("FOO")) + '</li>' + "\n" + '    <li>lowercase(&quot;fOo&quot;) = ' + (Contemplate.lowercase("fOo")) + '</li>' + "\n" + '    <li>uppercase(&quot;foo&quot;) = ' + (Contemplate.uppercase("foo")) + '</li>' + "\n" + '    <li>uppercase(&quot;FoO&quot;) = ' + (Contemplate.uppercase("FoO")) + '</li>' + "\n" + '    <li>sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + (Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12)) + '</li>' + "\n" + '    <li>e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + (Contemplate.e("<ok k=\"v\">")) + '</li>' + "\n" + '    <li>buildquery({"foo":["bar","baz"]}) = ' + (Contemplate.buildquery({"foo":["bar","baz"]})) + '</li>' + "\n" + '    <li>parsequery("foo[0]=bar&foo[1]=baz") = ' + (Contemplate.plg_("plg_print",Contemplate.parsequery("foo[0]=bar&foo[1]=baz"))) + '</li>' + "\n" + '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key2"]) = ' + (Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",null,["key2"])) + '</li>' + "\n" + '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]}) = ' + (Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]})) + '</li>' + "\n" + '    <li>queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"]) = ' + (Contemplate.queryvar("https://example.com?key1=1&key2[]=21&key2[]=22",{"key3":3,"key4":[41,42]},["key2"])) + '</li>' + "\n" + '    <li>striptags("&lt;p&gt;text in &lt;b&gt;tags&lt;/b&gt;&lt;/p&gt;") = ' + (Contemplate.striptags("<p>text in <b>tags</b></p>")) + '</li>' + "\n" + '    </ul>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Test plugin with variable $foo</strong><br />' + "\n" + '    ' + (Contemplate.plg_("plg_test",data.foo)) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + (bracket("inlined")) + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + (Contemplate.plg_("plg_print",{ "stringVar" : "stringValue", "numericVar" : 123, "arrayVar" : [ 0, 1, "astring", 3, { "prop": 1 } ] })) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '';
        return __p__;
        
    }
    ,
    
    
    /* tpl block render method for block 'Block2' */
    'Block2': function(Contemplate, data, self, __i__) {
        "use strict";
        var __p__ = '';
        
        __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Can reference the super Block2 directly if needed in OO manner</strong>' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- call the super block here in OO manner, if any -->' + "\n" + '    ' + (self.sprblock("Block2", data)) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Constructs</strong><hr /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Break and Continue</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $value) %&gt;' + "\n" + '        &lt;% if("b" == $value ) %&gt;Break from loop&lt;% break %&gt;&lt;% fi %&gt;' + "\n" + '        &lt;% $value %&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $value) %&gt;' + "\n" + '        &lt;% if("b" == $value ) %&gt;Continue loop&lt;% continue %&gt;&lt;% fi %&gt;' + "\n" + '        &lt;% $value %&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_value;
        var _loc_9 = ["a", "b", "c"], _loc_11 = !!_loc_9.forEach,
            _loc_10 = _loc_9 ? (_loc_11 ? _loc_9 : Object.keys(_loc_9)) : null,
            _loc_12, _loc_13, _loc_14 = _loc_10 ? _loc_10.length : 0;
        if (_loc_14)
        {
            for (_loc_12=0; _loc_12<_loc_14; ++_loc_12)
            {
                _loc_13 = _loc_10[_loc_12];
                _loc_value = _loc_11 ? _loc_13 : _loc_9[_loc_13];
                
                
                __p__ += '' + "\n" + '        ';        
                if ("b" == _loc_value)
                {
                            
                    __p__ += 'Break from loop';
                    break;
                    
                    __p__ += '';        
                }
                        
                __p__ += '' + "\n" + '        ' + (_loc_value) + '' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    <br />' + "\n" + '    ';
        var _loc_22 = ["a", "b", "c"], _loc_24 = !!_loc_22.forEach,
            _loc_23 = _loc_22 ? (_loc_24 ? _loc_22 : Object.keys(_loc_22)) : null,
            _loc_25, _loc_26, _loc_27 = _loc_23 ? _loc_23.length : 0;
        if (_loc_27)
        {
            for (_loc_25=0; _loc_25<_loc_27; ++_loc_25)
            {
                _loc_26 = _loc_23[_loc_25];
                _loc_value = _loc_24 ? _loc_26 : _loc_22[_loc_26];
                
                
                __p__ += '' + "\n" + '        ';        
                if ("b" == _loc_value)
                {
                            
                    __p__ += 'Continue loop';
                    continue;
                    
                    __p__ += '';        
                }
                        
                __p__ += '' + "\n" + '        ' + (_loc_value) + '' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $index=>$value) %&gt;' + "\n" + '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_index;
        var _loc_36 = ["a", "b", "c"], _loc_37 = _loc_36 ? Object.keys(_loc_36) : null,
            _loc_38, _loc_39 = _loc_36 ? _loc_37.length : 0;
        if (_loc_39)
        {
            for (_loc_38=0; _loc_38<_loc_39; ++_loc_38)
            {
                _loc_index = _loc_37[_loc_38]; _loc_value = _loc_36[_loc_index];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index) + '] = <strong>' + (_loc_value) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for(["a", "b", "c"] as $value2) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_value2;
        var _loc_46 = ["a", "b", "c"], _loc_48 = !!_loc_46.forEach,
            _loc_47 = _loc_46 ? (_loc_48 ? _loc_46 : Object.keys(_loc_46)) : null,
            _loc_49, _loc_50, _loc_51 = _loc_47 ? _loc_47.length : 0;
        if (_loc_51)
        {
            for (_loc_49=0; _loc_49<_loc_51; ++_loc_49)
            {
                _loc_50 = _loc_47[_loc_49];
                _loc_value2 = _loc_48 ? _loc_50 : _loc_46[_loc_50];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value2) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' + "\n" + '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_index3;
        var _loc_value3;
        var _loc_61 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_62 = _loc_61 ? Object.keys(_loc_61) : null,
            _loc_63, _loc_64 = _loc_61 ? _loc_62.length : 0;
        if (_loc_64)
        {
            for (_loc_63=0; _loc_63<_loc_64; ++_loc_63)
            {
                _loc_index3 = _loc_62[_loc_63]; _loc_value3 = _loc_61[_loc_index3];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index3) + '] = <strong>' + (_loc_value3) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_value4;
        var _loc_74 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_76 = !!_loc_74.forEach,
            _loc_75 = _loc_74 ? (_loc_76 ? _loc_74 : Object.keys(_loc_74)) : null,
            _loc_77, _loc_78, _loc_79 = _loc_75 ? _loc_75.length : 0;
        if (_loc_79)
        {
            for (_loc_77=0; _loc_77<_loc_79; ++_loc_77)
            {
                _loc_78 = _loc_75[_loc_77];
                _loc_value4 = _loc_76 ? _loc_78 : _loc_74[_loc_78];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value4) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($index4,$value4 in ["a", "b", "c"]) %&gt;' + "\n" + '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_index4;
        var _loc_86 = ["a", "b", "c"], _loc_87 = _loc_86 ? Object.keys(_loc_86) : null,
            _loc_88, _loc_89 = _loc_86 ? _loc_87.length : 0;
        if (_loc_89)
        {
            for (_loc_88=0; _loc_88<_loc_89; ++_loc_88)
            {
                _loc_index4 = _loc_87[_loc_88]; _loc_value4 = _loc_86[_loc_index4];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index4) + '] = <strong>' + (_loc_value4) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($value5 in ["a", "b", "c"]) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_value5;
        var _loc_96 = ["a", "b", "c"], _loc_98 = !!_loc_96.forEach,
            _loc_97 = _loc_96 ? (_loc_98 ? _loc_96 : Object.keys(_loc_96)) : null,
            _loc_99, _loc_100, _loc_101 = _loc_97 ? _loc_97.length : 0;
        if (_loc_101)
        {
            for (_loc_99=0; _loc_99<_loc_101; ++_loc_99)
            {
                _loc_100 = _loc_97[_loc_99];
                _loc_value5 = _loc_98 ? _loc_100 : _loc_96[_loc_100];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value5) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_index6;
        var _loc_value7;
        var _loc_111 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_112 = _loc_111 ? Object.keys(_loc_111) : null,
            _loc_113, _loc_114 = _loc_111 ? _loc_112.length : 0;
        if (_loc_114)
        {
            for (_loc_113=0; _loc_113<_loc_114; ++_loc_113)
            {
                _loc_index6 = _loc_112[_loc_113]; _loc_value7 = _loc_111[_loc_index6];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index6) + '] = <strong>' + (_loc_value7) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_value8;
        var _loc_124 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_126 = !!_loc_124.forEach,
            _loc_125 = _loc_124 ? (_loc_126 ? _loc_124 : Object.keys(_loc_124)) : null,
            _loc_127, _loc_128, _loc_129 = _loc_125 ? _loc_125.length : 0;
        if (_loc_129)
        {
            for (_loc_127=0; _loc_127<_loc_129; ++_loc_127)
            {
                _loc_128 = _loc_125[_loc_127];
                _loc_value8 = _loc_126 ? _loc_128 : _loc_124[_loc_128];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value8) + '</strong><br />' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( 1+1 != 2 ) %&gt;' + "\n" + '        1+1 != 2' + "\n" + '    &lt;% elif( 1+1 == 1) %&gt;' + "\n" + '        1+1 = 1' + "\n" + '    &lt;% else %&gt;' + "\n" + '        1+1 = 2' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if (1+1 != 2)
        {
            
            __p__ += '' + "\n" + '        1+1 != 2' + "\n" + '    ';
        }
        else if (1+1 == 1)
        {
            
            __p__ += '' + "\n" + '        1+1 = 1' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        1+1 = 2' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Inline (ternary) IF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% iif( 1+1 == 2, "1+1 = 2", "1+1 = 1" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + (((1+1 == 2) ? ("1+1 = 2") : ("1+1 = 1"))) + '' + "\n" + '' + "\n" + '    <pre>' + "\n" + '    &lt;% iif( 1+1 == 1, "1+1 = 1", "1+1 = 2" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + (((1+1 == 1) ? ("1+1 = 1") : ("1+1 = 2"))) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Inline (ternary) IF (2)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% iif( !empty($undefined_variable), $undefined_variable, "test with undefined variable passed" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + (((!(("undefined" === typeof(data.undefined_variable)) || (null === data.undefined_variable) || Contemplate.empty(data.undefined_variable))) ? (data.undefined_variable) : ("test with undefined variable passed"))) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>SET a new tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% set($foo, "123") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        data.foo = ("123");
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>SET a new (local) tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% local_set($foo_loc, 456) %&gt;' + "\n" + '    &lt;% set($foo_loc, $foo_loc+1) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_foo_loc = (456);
        
        __p__ += '' + "\n" + '    ';
        _loc_foo_loc = (_loc_foo_loc+1);
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK ISSET for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( isset($foo) ) %&gt;' + "\n" + '        $foo is SET' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo is NOT SET' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if (("undefined" !== typeof(data.foo) && null !== data.foo))
        {
            
            __p__ += '' + "\n" + '        $foo = ' + (data.foo) + ', is SET' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        $foo is NOT SET' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK ISSET for a (local) tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( isset($foo_loc) ) %&gt;' + "\n" + '        $foo_loc is SET' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo_loc is NOT SET' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if (("undefined" !== typeof(_loc_foo_loc) && null !== _loc_foo_loc))
        {
            
            __p__ += '' + "\n" + '        $foo_loc = ' + (_loc_foo_loc) + ', is SET' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        $foo_loc is NOT SET' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK EMPTY for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( empty($foo) ) %&gt;' + "\n" + '        $foo is EMPTY' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo is NOT EMPTY' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if ((("undefined" === typeof(data.foo)) || (null === data.foo) || Contemplate.empty(data.foo)))
        {
            
            __p__ += '' + "\n" + '        $foo is EMPTY' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        $foo = ' + (data.foo) + ', is NOT EMPTY' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK EMPTY for a (local) tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% if( empty($foo_loc) ) %&gt;' + "\n" + '        $foo_loc is EMPTY' + "\n" + '    &lt;% else %&gt;' + "\n" + '        $foo_loc is NOT EMPTY' + "\n" + '    &lt;% fi %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if ((("undefined" === typeof(_loc_foo_loc)) || (null === _loc_foo_loc) || Contemplate.empty(_loc_foo_loc)))
        {
            
            __p__ += '' + "\n" + '        $foo_loc is EMPTY' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        $foo_loc = ' + (_loc_foo_loc) + ', is NOT EMPTY' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '    <strong>INCLUDE a (sub-)template file</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% include("date") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    <!-- print a localized date php-style -->' + "\n" + '<strong>A date, PHP-style</strong><br />' + "\n" + '' + (Contemplate.date("M, D, d")) + '' + "\n" + '';
        
        __p__ += '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CALL another (sub-)template</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% for($users as $i=>$usergroup) %&gt;' + "\n" + '        &lt;!-- call a (sub-)template --&gt;' + "\n" + '        &lt;% tpl("sub", {"i" : $i, "users" : $users}) %&gt;' + "\n" + '    &lt;% endfor %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_i;
        var _loc_usergroup;
        var _loc_156 = data.users, _loc_157 = _loc_156 ? Object.keys(_loc_156) : null,
            _loc_158, _loc_159 = _loc_156 ? _loc_157.length : 0;
        if (_loc_159)
        {
            for (_loc_158=0; _loc_158<_loc_159; ++_loc_158)
            {
                _loc_i = _loc_157[_loc_158]; _loc_usergroup = _loc_156[_loc_i];
                
                
                __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + (Contemplate.tpl("sub", {"i" : _loc_i, "users" : data.users})) + '' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '';
        return __p__;
        
    }
    ,
    
    
    /* tpl block render method for block 'Block12' */
    'Block12': function(Contemplate, data, self, __i__) {
        "use strict";
        var __p__ = '';
        
        __p__ += 'Demo template nested Block12';
        return __p__;
        
    }
    
    };
    
    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    self._extendsTpl = 'base';
    self._usesTpl = ['sub'];
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_demo__global.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_demo__global.prototype.render = function(data, __i__) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx(self._ctx)));
    /* tpl main render code starts here */
    
    __p__ = '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx(__ctx);
    return __p__;
};
// export it
return Contemplate_demo__global;
};
});
