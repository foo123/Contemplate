
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
                
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%uuid(&quot;namespace&quot;) = ' + (Contemplate.uuid("namespace")) + '</li>' + "\n" + '    <li>%echo(&quot;123&quot;) = ' + (String("123")) + '</li>' + "\n" + '    <li>%q(123) = ' + ("'"+(123)+"'") + '</li>' + "\n" + '    <li>%dq(123) = ' + ('"'+(123)+'"') + '</li>' + "\n" + '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + (Contemplate.trim("__FOO__", "_")) + '</li>' + "\n" + '    <li>%trim(&quot;  FOO  &quot;) = ' + (Contemplate.trim("  FOO  ")) + '</li>' + "\n" + '    <li>%lowercase(&quot;FOO&quot;) = ' + (("FOO").toLowerCase()) + '</li>' + "\n" + '    <li>%lowercase(&quot;fOo&quot;) = ' + (("fOo").toLowerCase()) + '</li>' + "\n" + '    <li>%uppercase(&quot;foo&quot;) = ' + (("foo").toUpperCase()) + '</li>' + "\n" + '    <li>%uppercase(&quot;FoO&quot;) = ' + (("FoO").toUpperCase()) + '</li>' + "\n" + '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' + (Contemplate.camelcase("camel_case", "_")) + '</li>' + "\n" + '    <li>%camelcase(&quot;camelCase&quot;) = ' + (Contemplate.camelcase("camelCase")) + '</li>' + "\n" + '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' + (Contemplate.snakecase("snakeCase", "_")) + '</li>' + "\n" + '    <li>%snakecase(&quot;snake_case&quot;) = ' + (Contemplate.snakecase("snake_case")) + '</li>' + "\n" + '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + (Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12)) + '</li>' + "\n" + '    <li>%addslashes(&quot;this string\'s s\\&quot;s s\\\\&quot;s s\\\\\\&quot;s&quot;) = ' + (Contemplate.addslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>%stripslashes(&quot;this string\'s s\\&quot;s s\\\\&quot;s s\\\\\\&quot;s&quot;) = ' + (Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' + (Contemplate.locale("locale")) + ' = ' + (Contemplate.locale("locale")) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 1) = ' + (Contemplate.pluralise("item", 1)) + '</li>' + "\n" + '    <li>%pluralise(&quot;item&quot;, 2) = ' + (Contemplate.pluralise("item", 2)) + '</li>' + "\n" + '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + (Contemplate.e('<ok k="v">')) + '</li>' + "\n" + '    <li>%html(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + (Contemplate.html('<ok k="v">')) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    ';
                var _loc_168 = data.users, _loc_169 = _loc_168 ? Object.keys(_loc_168) : null,
                    _loc_170, _loc_i, _loc_usergroup, _loc_171 = _loc_169 ? _loc_169.length : 0;
                if (_loc_171)
                {
                    for (_loc_170=0; _loc_170<_loc_171; _loc_170++)
                    {
                        _loc_i = _loc_169[_loc_170]; _loc_usergroup = _loc_168[_loc_i];
                        
                        
                        __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + (Contemplate.tpl("sub", {"i" : _loc_i, "users" : data.users})) + '' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function( Contemplate, data, __i__ ) {
                "use strict";
                var __p__ = '';
                
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + (Contemplate.htmltable(data.table_data, data.table_options)) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + (bracket( "inlined" )) + '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ';
                if (("undefined" !== typeof(data.foo)) )
                {
                    
                    __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ';
                }
                else
                {
                    
                    __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ';
                }
                
                __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '' + "\n" + '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' + "\n" + '    ';
                data.foo = ("123");
                
                __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ';
                if (("undefined" !== typeof(data.foo)) )
                {
                    
                    __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ';
                }
                else
                {
                    
                    __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ';
                }
                
                __p__ += '' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    ' + (Contemplate.plg_test(data.foo)) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + (Contemplate.plg_print({ "stringVar" : "stringValue", "numericVar" : 123, "arrayVar" : [ 0, 1, "astring", 3, { "prop": 1 } ] })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_23 = ["a", "b", "c"], _loc_24 = _loc_23 ? Object.keys(_loc_23) : null,
                    _loc_25, _loc_index, _loc_value, _loc_26 = _loc_24 ? _loc_24.length : 0;
                if (_loc_26)
                {
                    for (_loc_25=0; _loc_25<_loc_26; _loc_25++)
                    {
                        _loc_index = _loc_24[_loc_25]; _loc_value = _loc_23[_loc_index];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index) + '] = <strong>' + ( _loc_value) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_33 = ["a", "b", "c"], _loc_35 = !!_loc_33.forEach,
                    _loc_34 = _loc_33 ? (_loc_35 ? _loc_33 : Object.keys(_loc_33)) : null,
                    _loc_36, _loc_37, _loc_value2, _loc_38 = _loc_34 ? _loc_34.length : 0;
                if (_loc_38)
                {
                    for (_loc_36=0; _loc_36<_loc_38; _loc_36++)
                    {
                        _loc_37 = _loc_34[_loc_36];
                        _loc_value2 = _loc_35 ? _loc_37 : _loc_33[_loc_37];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value2) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_48 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_49 = _loc_48 ? Object.keys(_loc_48) : null,
                    _loc_50, _loc_index3, _loc_value3, _loc_51 = _loc_49 ? _loc_49.length : 0;
                if (_loc_51)
                {
                    for (_loc_50=0; _loc_50<_loc_51; _loc_50++)
                    {
                        _loc_index3 = _loc_49[_loc_50]; _loc_value3 = _loc_48[_loc_index3];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index3) + '] = <strong>' + ( _loc_value3) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_61 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_63 = !!_loc_61.forEach,
                    _loc_62 = _loc_61 ? (_loc_63 ? _loc_61 : Object.keys(_loc_61)) : null,
                    _loc_64, _loc_65, _loc_value4, _loc_66 = _loc_62 ? _loc_62.length : 0;
                if (_loc_66)
                {
                    for (_loc_64=0; _loc_64<_loc_66; _loc_64++)
                    {
                        _loc_65 = _loc_62[_loc_64];
                        _loc_value4 = _loc_63 ? _loc_65 : _loc_61[_loc_65];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value4) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_73 = ["a", "b", "c"], _loc_74 = _loc_73 ? Object.keys(_loc_73) : null,
                    _loc_75, _loc_index4, _loc_value4, _loc_76 = _loc_74 ? _loc_74.length : 0;
                if (_loc_76)
                {
                    for (_loc_75=0; _loc_75<_loc_76; _loc_75++)
                    {
                        _loc_index4 = _loc_74[_loc_75]; _loc_value4 = _loc_73[_loc_index4];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index4) + '] = <strong>' + ( _loc_value4) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_83 = ["a", "b", "c"], _loc_85 = !!_loc_83.forEach,
                    _loc_84 = _loc_83 ? (_loc_85 ? _loc_83 : Object.keys(_loc_83)) : null,
                    _loc_86, _loc_87, _loc_value5, _loc_88 = _loc_84 ? _loc_84.length : 0;
                if (_loc_88)
                {
                    for (_loc_86=0; _loc_86<_loc_88; _loc_86++)
                    {
                        _loc_87 = _loc_84[_loc_86];
                        _loc_value5 = _loc_85 ? _loc_87 : _loc_83[_loc_87];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value5) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_98 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_99 = _loc_98 ? Object.keys(_loc_98) : null,
                    _loc_100, _loc_index6, _loc_value7, _loc_101 = _loc_99 ? _loc_99.length : 0;
                if (_loc_101)
                {
                    for (_loc_100=0; _loc_100<_loc_101; _loc_100++)
                    {
                        _loc_index6 = _loc_99[_loc_100]; _loc_value7 = _loc_98[_loc_index6];
                        
                        
                        __p__ += '' + "\n" + '        [' + ( _loc_index6) + '] = <strong>' + ( _loc_value7) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_111 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_113 = !!_loc_111.forEach,
                    _loc_112 = _loc_111 ? (_loc_113 ? _loc_111 : Object.keys(_loc_111)) : null,
                    _loc_114, _loc_115, _loc_value8, _loc_116 = _loc_112 ? _loc_112.length : 0;
                if (_loc_116)
                {
                    for (_loc_114=0; _loc_114<_loc_116; _loc_114++)
                    {
                        _loc_115 = _loc_112[_loc_114];
                        _loc_value8 = _loc_113 ? _loc_115 : _loc_111[_loc_115];
                        
                        
                        __p__ += '' + "\n" + '        <strong>' + ( _loc_value8) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + (Contemplate.htmlselect(data.select_data, data.select_options)) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + (Contemplate.htmltable(data.table_data, {"header" : true, "tpl_cell": Contemplate.inline("<td>{{value}} (inline compiled tpl)</td>",{"{{value}}":"cell"}, true)})) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + (Contemplate.htmlselect(data.select_data, { "foo123" : ":,=>", "optgroups" : ["group1", "group2", "group3"], "selected" : 3, "multiple" : false, "style" : "width:200px;", "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>' })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + (Contemplate.ldate("M, d", Contemplate.time())) + '' + "\n" + '';
                
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
