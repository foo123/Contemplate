

!function (root, moduleName, moduleDefinition) {
    // export the module
    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();
    // AMD, etc..
    else if ( 'function' === typeof(define) && define.amd ) define( moduleDefinition );
    // browser, etc..
    else root[ moduleName ] = moduleDefinition();

}(this, 'Contemplate_demo_Cached', function( ){
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'demo' */
    
    /* constructor */
    function Contemplate_demo_Cached(id)
    {
        /* initialize internal vars */
        
        this._renderer = id;
        this._blocks = null;
        this._extends = null;
        this.d = null;
        this.id = id;
        
        /* tpl-defined blocks render code starts here */
        
        this._blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%e(&lt;ok k=&quot;v&quot;&gt;) = ' + (Contemplate.e('<ok k="v">')) + '</li>' + "\n" + '    <li>%html(&lt;ok k=&quot;v&quot;&gt;) = ' + (Contemplate.html('<ok k="v">')) + '</li>' + "\n" + '    <li>trim(__FOO__, _) = ' + (Contemplate.trim("__FOO__", "_")) + '</li>' + "\n" + '    <li>trim(  FOO  ) = ' + (Contemplate.trim("  FOO  ")) + '</li>' + "\n" + '    <li>lowercase(FOO) = ' + (Contemplate.lowercase("FOO")) + '</li>' + "\n" + '    <li>lowercase(fOo) = ' + (Contemplate.lowercase("fOo")) + '</li>' + "\n" + '    <li>uppercase(foo) = ' + (Contemplate.uppercase("foo")) + '</li>' + "\n" + '    <li>uppercase(FoO) = ' + (Contemplate.uppercase("FoO")) + '</li>' + "\n" + '    <li>camelcase(camel_case, _) = ' + (Contemplate.camelcase("camel_case", "_")) + '</li>' + "\n" + '    <li>camelcase(camelCase) = ' + (Contemplate.camelcase("camelCase")) + '</li>' + "\n" + '    <li>snakecase(snakeCase, _) = ' + (Contemplate.snakecase("snakeCase", "_")) + '</li>' + "\n" + '    <li>snakecase(snake_case) = ' + (Contemplate.snakecase("snake_case")) + '</li>' + "\n" + '    <li>l(locale) = ' + (Contemplate.l("locale")) + '</li>' + "\n" + '    <li>locale(locale) = ' + (Contemplate.locale("locale")) + '</li>' + "\n" + '    <li>pluralise(item, 1) = ' + (Contemplate.pluralise("item", 1)) + '</li>' + "\n" + '    <li>pluralise(item, 2) = ' + (Contemplate.pluralise("item", 2)) + '</li>' + "\n" + '    <li>sprintf("%02d : %02d : %02d", 2, 0, 12) = ' + (Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12)) + '</li>' + "\n" + '    <li>addslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' + (Contemplate.addslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>stripslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' + (Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>uuid(namespace) = ' + (Contemplate.uuid("namespace")) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    ';
                var _loc_151 = data['users'], _loc_152 = Contemplate.keys(_loc_151),
                    _loc_153, _loc_i, _loc_usergroup, _loc_154 = _loc_152 ? _loc_152.length : 0;
                if (_loc_154)
                {
                    for (_loc_153=0; _loc_153<_loc_154; _loc_153++)
                    {
                        _loc_i = _loc_152[_loc_153]; _loc_usergroup = _loc_151[_loc_i];
                        
                         
                        __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + Contemplate.tpl( "sub",  {"i" : _loc_i, "users" : data['users']} ); 
                         
                        __p__ += '' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + (Contemplate.htmltable(data['table_data'], data['table_options'])) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + (bracket( "inlined" )) + '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ';
                if (  ("undefined" !== typeof(data['foo']))  )
                {
                     
                    __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ';
                }
                else
                {
                     
                    __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ';
                }
                 
                __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '' + "\n" + '    <strong>Set a new tpl variable and use it in a custom test plugin</strong><br />' + "\n" + '    ';
                data['foo'] = ("123");
                 
                __p__ += '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ';
                if (  ("undefined" !== typeof(data['foo']))  )
                {
                     
                    __p__ += '' + "\n" + '        $foo is set' + "\n" + '    ';
                }
                else
                {
                     
                    __p__ += '' + "\n" + '        $foo is NOT set' + "\n" + '    ';
                }
                 
                __p__ += '' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    ' + (Contemplate.plg_test(data['foo'])) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + (Contemplate.plg_print({          "stringVar"     : "stringValue",          "numericVar"    : 123,          "arrayVar"      : [             0, 1, "astring", 3,              { "prop": 1 }          ]      })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_20 = ["a", "b", "c"], _loc_21 = Contemplate.keys(_loc_20),
                    _loc_22, _loc_index, _loc_value, _loc_23 = _loc_21 ? _loc_21.length : 0;
                if (_loc_23)
                {
                    for (_loc_22=0; _loc_22<_loc_23; _loc_22++)
                    {
                        _loc_index = _loc_21[_loc_22]; _loc_value = _loc_20[_loc_index];
                        
                         
                        __p__ += '' + "\n" + '        [' + (_loc_index) + '] = <strong>' + (_loc_value) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_30 = Contemplate.values(["a", "b", "c"]),
                    _loc_31, _loc_value2, _loc_32 = _loc_30 ? _loc_30.length : 0;
                if (_loc_32)
                {
                    for (_loc_31=0; _loc_31<_loc_32; _loc_31++)
                    {
                        _loc_value2 = _loc_30[_loc_31];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + (_loc_value2) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_42 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_43 = Contemplate.keys(_loc_42),
                    _loc_44, _loc_index3, _loc_value3, _loc_45 = _loc_43 ? _loc_43.length : 0;
                if (_loc_45)
                {
                    for (_loc_44=0; _loc_44<_loc_45; _loc_44++)
                    {
                        _loc_index3 = _loc_43[_loc_44]; _loc_value3 = _loc_42[_loc_index3];
                        
                         
                        __p__ += '' + "\n" + '        [' + (_loc_index3) + '] = <strong>' + (_loc_value3) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _loc_55 = Contemplate.values({"k1":"a", "k2":"b", "k3":"c"}),
                    _loc_56, _loc_value4, _loc_57 = _loc_55 ? _loc_55.length : 0;
                if (_loc_57)
                {
                    for (_loc_56=0; _loc_56<_loc_57; _loc_56++)
                    {
                        _loc_value4 = _loc_55[_loc_56];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + (_loc_value4) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_64 = ["a", "b", "c"], _loc_65 = Contemplate.keys(_loc_64),
                    _loc_66, _loc_index4, _loc_value4, _loc_67 = _loc_65 ? _loc_65.length : 0;
                if (_loc_67)
                {
                    for (_loc_66=0; _loc_66<_loc_67; _loc_66++)
                    {
                        _loc_index4 = _loc_65[_loc_66]; _loc_value4 = _loc_64[_loc_index4];
                        
                         
                        __p__ += '' + "\n" + '        [' + (_loc_index4) + '] = <strong>' + (_loc_value4) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_74 = Contemplate.values(["a", "b", "c"]),
                    _loc_75, _loc_value5, _loc_76 = _loc_74 ? _loc_74.length : 0;
                if (_loc_76)
                {
                    for (_loc_75=0; _loc_75<_loc_76; _loc_75++)
                    {
                        _loc_value5 = _loc_74[_loc_75];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + (_loc_value5) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_86 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_87 = Contemplate.keys(_loc_86),
                    _loc_88, _loc_index6, _loc_value7, _loc_89 = _loc_87 ? _loc_87.length : 0;
                if (_loc_89)
                {
                    for (_loc_88=0; _loc_88<_loc_89; _loc_88++)
                    {
                        _loc_index6 = _loc_87[_loc_88]; _loc_value7 = _loc_86[_loc_index6];
                        
                         
                        __p__ += '' + "\n" + '        [' + (_loc_index6) + '] = <strong>' + (_loc_value7) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _loc_99 = Contemplate.values({"k1":"a", "k2":"b", "k3":"c"}),
                    _loc_100, _loc_value8, _loc_101 = _loc_99 ? _loc_99.length : 0;
                if (_loc_101)
                {
                    for (_loc_100=0; _loc_100<_loc_101; _loc_100++)
                    {
                        _loc_value8 = _loc_99[_loc_100];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + (_loc_value8) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + (Contemplate.htmlselect(data['select_data'], data['select_options'])) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + (Contemplate.htmltable(data['table_data'], {"header" : true, "tpl_cell": Contemplate.inline("<td>{{value}} (inline compiled tpl)</td>",{"{{value}}":"cell"}, true)})) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + (Contemplate.htmlselect(data['select_data'], {             "foo123" : ":,=>",             "optgroups" : ["group1", "group2", "group3"],             "selected" : 3,             "multiple" : false,             "style" : "width:200px;",             "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>'         })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + (Contemplate.ldate("M, d", Contemplate.now())) + '' + "\n" + ''; 
                 
                __p__ += '' + "\n" + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block12' */
            'Block12': function(Contemplate,__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += 'Demo template nested Block12';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        /* extend tpl assign code starts here */
        this.extend( 'base' );
        /* extend tpl assign code ends here */
    };
    
    /* extends main Contemplate.Template class */
    Contemplate_demo_Cached.prototype = Object.create(Contemplate.Template.prototype);
    /* tpl render method */
    Contemplate_demo_Cached.prototype.render = function( data, __i__ ) {
        if ( !__i__ ) __i__ = this;
        var __p__ = '';
        if ( this._extends )
        {
            __p__ = this._extends.render(data, __i__);
        }
        else
        {
            /* tpl main render code starts here */
            __p__ = '';
            /* tpl main render code ends here */
        }
        this.d = null;
        return __p__;
    };
    
    // export it
    return Contemplate_demo_Cached;
    };
});
