
!function (root, moduleName, moduleDefinition) {
    // export the module
    var m;
    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
    // browser and AMD, etc..
    else (root[ moduleName ] = m = moduleDefinition()) && ('function' === typeof(define) && define.amd && define(moduleName,[],function(){return m;}));
}(this, 'Contemplate_demo_Cached', function( ){
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'demo' */
    
    /* constructor */
    function Contemplate_demo_Cached(id)
    {
        /* initialize internal vars */
        
        this._renderer = null;
        this._blocks = null;
        this._extends = null;
        this.id = id || null;
        
        /* tpl-defined blocks render code starts here */
        
        this._blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function( Contemplate, data, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%uuid(&quot;namespace&quot;) = ' + (Contemplate.uuid("namespace")) + '</li>' + "\n" + '    <li>%echo(&quot;123&quot;) = ' + (String("123")) + '</li>' + "\n" + '    <li>%q(123) = ' + ("'"+(123)+"'") + '</li>' + "\n" + '    <li>%dq(123) = ' + ('"'+(123)+'"') + '</li>' + "\n" + '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + (Contemplate.trim("__FOO__", "_")) + '</li>' + "\n" + '    <li>%trim(&quot;  FOO  &quot;) = ' + (Contemplate.trim("  FOO  ")) + '</li>' + "\n" + '    <li>%lowercase(&quot;FOO&quot;) = ' + (("FOO").toLowerCase()) + '</li>' + "\n" + '    <li>%lowercase(&quot;fOo&quot;) = ' + (("fOo").toLowerCase()) + '</li>' + "\n" + '    <li>%uppercase(&quot;foo&quot;) = ' + (("foo").toUpperCase()) + '</li>' + "\n" + '    <li>%uppercase(&quot;FoO&quot;) = ' + (("FoO").toUpperCase()) + '</li>' + "\n" + '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' + (Contemplate.camelcase("camel_case", "_")) + '</li>' + "\n" + '    <li>%camelcase(&quot;camelCase&quot;) = ' + (Contemplate.camelcase("camelCase")) + '</li>' + "\n" + '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' + (Contemplate.snakecase("snakeCase", "_")) + '</li>' + "\n" + '    <li>%snakecase(&quot;snake_case&quot;) = ' + (Contemplate.snakecase("snake_case")) + '</li>' + "\n" + '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + (Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12)) + '</li>' + "\n" + '    <li>%addslashes(&quot;this string\'s s\\&quot;s s\\\\&quot;s s\\\\\\&quot;s&quot;) = ' + (Contemplate.addslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>%stripslashes(&quot;this string\'s s\\&quot;s s\\\\&quot;s s\\\\\\&quot;s&quot;) = ' + (Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' + (Contemplate.locale("locale")) + ' = ' + (Contemplate.locale("locale")) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 1) = ' + (Contemplate.pluralise("item", 1)) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 2) = ' + (Contemplate.pluralise("item", 2)) + '</li>' + "\n" + '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + (Contemplate.e("<ok k=\"v\">")) + '</li>' + "\n" + '    <li>%html(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + (Contemplate.html("<ok k=\"v\">")) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + (Contemplate.htmltable(data.table_data, data.table_options)) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + (Contemplate.htmlselect(data.select_data, data.select_options)) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + (Contemplate.htmltable(data.table_data, {"header" : true, "tpl_cell": Contemplate.inline("<td>{{value}} (inline compiled tpl)</td>",{"{{value}}":"cell"}, true)})) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + (Contemplate.htmlselect(data.select_data, { "foo123" : ":,=>", "optgroups" : ["group1", "group2", "group3"], "selected" : 3, "multiple" : false, "style" : "width:200px;", "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>' })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test plugin with variable $foo</strong><br />' + "\n" + '    ' + (Contemplate.plg_test(data.foo)) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + (bracket( "inlined" )) + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + (Contemplate.plg_print({ "stringVar" : "stringValue", "numericVar" : 123, "arrayVar" : [ 0, 1, "astring", 3, { "prop": 1 } ] })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function( Contemplate, data, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Constructs</strong><hr /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for(["a", "b", "c"] as $index=>$value) %&gt;' + "\n" + '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_9 = ["a", "b", "c"], _loc_10 = _loc_9 ? Object.keys(_loc_9) : null,
                    _loc_11, _loc_index, _loc_value, _loc_12 = _loc_10 ? _loc_10.length : 0;
                if (_loc_12)
                {
                    for (_loc_11=0; _loc_11<_loc_12; _loc_11++)
                    {
                        _loc_index = _loc_10[_loc_11]; _loc_value = _loc_9[_loc_index];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index) + '] = <strong>' + ( _loc_value) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for(["a", "b", "c"] as $value2) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_19 = ["a", "b", "c"], _loc_21 = !!_loc_19.forEach,
                    _loc_20 = _loc_19 ? (_loc_21 ? _loc_19 : Object.keys(_loc_19)) : null,
                    _loc_22, _loc_23, _loc_value2, _loc_24 = _loc_20 ? _loc_20.length : 0;
                if (_loc_24)
                {
                    for (_loc_22=0; _loc_22<_loc_24; _loc_22++)
                    {
                        _loc_23 = _loc_20[_loc_22];
                        _loc_value2 = _loc_21 ? _loc_23 : _loc_19[_loc_23];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value2) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' + "\n" + '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_34 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_35 = _loc_34 ? Object.keys(_loc_34) : null,
                    _loc_36, _loc_index3, _loc_value3, _loc_37 = _loc_35 ? _loc_35.length : 0;
                if (_loc_37)
                {
                    for (_loc_36=0; _loc_36<_loc_37; _loc_36++)
                    {
                        _loc_index3 = _loc_35[_loc_36]; _loc_value3 = _loc_34[_loc_index3];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index3) + '] = <strong>' + ( _loc_value3) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_47 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_49 = !!_loc_47.forEach,
                    _loc_48 = _loc_47 ? (_loc_49 ? _loc_47 : Object.keys(_loc_47)) : null,
                    _loc_50, _loc_51, _loc_value4, _loc_52 = _loc_48 ? _loc_48.length : 0;
                if (_loc_52)
                {
                    for (_loc_50=0; _loc_50<_loc_52; _loc_50++)
                    {
                        _loc_51 = _loc_48[_loc_50];
                        _loc_value4 = _loc_49 ? _loc_51 : _loc_47[_loc_51];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value4) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($index4,$value4 in ["a", "b", "c"]) %&gt;' + "\n" + '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_59 = ["a", "b", "c"], _loc_60 = _loc_59 ? Object.keys(_loc_59) : null,
                    _loc_61, _loc_index4, _loc_value4, _loc_62 = _loc_60 ? _loc_60.length : 0;
                if (_loc_62)
                {
                    for (_loc_61=0; _loc_61<_loc_62; _loc_61++)
                    {
                        _loc_index4 = _loc_60[_loc_61]; _loc_value4 = _loc_59[_loc_index4];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index4) + '] = <strong>' + ( _loc_value4) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($value5 in ["a", "b", "c"]) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_69 = ["a", "b", "c"], _loc_71 = !!_loc_69.forEach,
                    _loc_70 = _loc_69 ? (_loc_71 ? _loc_69 : Object.keys(_loc_69)) : null,
                    _loc_72, _loc_73, _loc_value5, _loc_74 = _loc_70 ? _loc_70.length : 0;
                if (_loc_74)
                {
                    for (_loc_72=0; _loc_72<_loc_74; _loc_72++)
                    {
                        _loc_73 = _loc_70[_loc_72];
                        _loc_value5 = _loc_71 ? _loc_73 : _loc_69[_loc_73];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value5) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_84 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_85 = _loc_84 ? Object.keys(_loc_84) : null,
                    _loc_86, _loc_index6, _loc_value7, _loc_87 = _loc_85 ? _loc_85.length : 0;
                if (_loc_87)
                {
                    for (_loc_86=0; _loc_86<_loc_87; _loc_86++)
                    {
                        _loc_index6 = _loc_85[_loc_86]; _loc_value7 = _loc_84[_loc_index6];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index6) + '] = <strong>' + ( _loc_value7) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_97 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_99 = !!_loc_97.forEach,
                    _loc_98 = _loc_97 ? (_loc_99 ? _loc_97 : Object.keys(_loc_97)) : null,
                    _loc_100, _loc_101, _loc_value8, _loc_102 = _loc_98 ? _loc_98.length : 0;
                if (_loc_102)
                {
                    for (_loc_100=0; _loc_100<_loc_102; _loc_100++)
                    {
                        _loc_101 = _loc_98[_loc_100];
                        _loc_value8 = _loc_99 ? _loc_101 : _loc_97[_loc_101];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value8) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( 1+1 == 2 ) %&gt;' + "\n" + '        1+1 = 2' + "\n" + '    &lt;% %elseif( 1+1 == 1) %&gt;' + "\n" + '        1+1 = 1' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        unkonown result' + "\n" + '    &lt;% %endif() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                if ( 1+1 == 2 )
                {
                    
                    __p__ += '' + "\n" + '        1+1 = 2' + "\n" + '    ';
                }
                else if ( 1+1 == 1)
                {
                    
                    __p__ += '' + "\n" + '        1+1 = 1' + "\n" + '    ';
                }
                else
                {
                    
                    __p__ += '' + "\n" + '        unkonown result' + "\n" + '    ';
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>SET a new tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %set($foo, "123") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                data.foo = ("123");
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>CHECK ISSET for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( %isset($foo) ) %&gt;' + "\n" + '        $foo is SET' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        $foo is NOT SET' + "\n" + '    &lt;% %endif() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                if (("undefined" !== typeof(data.foo)) )
                {
                    
                    __p__ += '' + "\n" + '        $foo is SET' + "\n" + '    ';
                }
                else
                {
                    
                    __p__ += '' + "\n" + '        $foo is NOT SET' + "\n" + '    ';
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '    <strong>INCLUDE a (sub-)template file</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %include("date") %&gt;' + "\n" + '    </pre><br />' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + (Contemplate.ldate("M, d", Contemplate.time())) + '' + "\n" + '';
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CALL another (sub-)template</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($users as $i=>$usergroup) %&gt;' + "\n" + '        &lt;!-- call a (sub-)template --&gt;' + "\n" + '        &lt;% %tpl("sub", {"i" : $i, "users" : $users}) %&gt;' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
                var _loc_112 = data.users, _loc_113 = _loc_112 ? Object.keys(_loc_112) : null,
                    _loc_114, _loc_i, _loc_usergroup, _loc_115 = _loc_113 ? _loc_113.length : 0;
                if (_loc_115)
                {
                    for (_loc_114=0; _loc_114<_loc_115; _loc_114++)
                    {
                        _loc_i = _loc_113[_loc_114]; _loc_usergroup = _loc_112[_loc_i];
                        
                        
                        __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + (Contemplate.tpl("sub", {"i" : _loc_i, "users" : data.users})) + '' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block12' */
            'Block12': function( Contemplate, data, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += 'Demo template nested Block12';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        /* extend tpl assign code starts here */
        this.extend('base');
        /* extend tpl assign code ends here */
    };
    
    /* extends main Contemplate.Template class */
    Contemplate_demo_Cached.prototype = Object.create(Contemplate.Template.prototype);
    /* tpl render method */
    Contemplate_demo_Cached.prototype.render = function( data, __i__ ) {
        "use strict";
        var __p__ = '';
        __i__ = __i__ || this;
        /* tpl main render code starts here */
        
        __p__ = '';
        
        /* tpl main render code ends here */
        return __p__;
    };
    
    // export it
    return Contemplate_demo_Cached;
    };
});
