
!function (root, moduleName, moduleDefinition) {

    //
    // export the module

    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();

    // AMD, etc..
    else if ( 'function' === typeof(define) && define.amd ) define( moduleDefinition );

    // browser, etc..
    else root[ moduleName ] = moduleDefinition();


}(this, 'Contemplate_demo_Cached', function( ) {
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'demo' */
    /* quasi extends main Contemplate class */
    
    var Contemplate_tpl = Contemplate.tpl;
    
    /* constructor */
    function Contemplate_demo_Cached(id)
    {
        /* initialize internal vars */
        var _extends = null, _blocks = null;
        
        this.id = id;
        this.d = null;
        
        
        /* tpl-defined blocks render code starts here */
        
        _blocks = { 
            
            
            /* tpl block render method for block 'Block3' */
            'Block3': function(__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%e(&lt;ok k=&quot;v&quot;&gt;) = ' + ( Contemplate.e('<ok k="v">') ) + '</li>' + "\n" + '    <li>%html(&lt;ok k=&quot;v&quot;&gt;) = ' + ( Contemplate.html('<ok k="v">') ) + '</li>' + "\n" + '    <li>trim(__FOO__, _) = ' + ( Contemplate.trim("__FOO__", "_") ) + '</li>' + "\n" + '    <li>trim(  FOO  ) = ' + ( Contemplate.trim("  FOO  ") ) + '</li>' + "\n" + '    <li>lowercase(FOO) = ' + ( Contemplate.lowercase("FOO") ) + '</li>' + "\n" + '    <li>lowercase(fOo) = ' + ( Contemplate.lowercase("fOo") ) + '</li>' + "\n" + '    <li>uppercase(foo) = ' + ( Contemplate.uppercase("foo") ) + '</li>' + "\n" + '    <li>uppercase(FoO) = ' + ( Contemplate.uppercase("FoO") ) + '</li>' + "\n" + '    <li>camelcase(camel_case, _) = ' + ( Contemplate.camelcase("camel_case", "_") ) + '</li>' + "\n" + '    <li>camelcase(camelCase) = ' + ( Contemplate.camelcase("camelCase") ) + '</li>' + "\n" + '    <li>snakecase(snakeCase, _) = ' + ( Contemplate.snakecase("snakeCase", "_") ) + '</li>' + "\n" + '    <li>snakecase(snake_case) = ' + ( Contemplate.snakecase("snake_case") ) + '</li>' + "\n" + '    <li>l(locale) = ' + ( Contemplate.l("locale") ) + '</li>' + "\n" + '    <li>locale(locale) = ' + ( Contemplate.locale("locale") ) + '</li>' + "\n" + '    <li>pluralise(item, 1) = ' + ( Contemplate.pluralise("item", 1) ) + '</li>' + "\n" + '    <li>pluralise(item, 2) = ' + ( Contemplate.pluralise("item", 2) ) + '</li>' + "\n" + '    <li>sprintf("%02d : %02d : %02d", 2, 0, 12) = ' + ( Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12) ) + '</li>' + "\n" + '    <li>addslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' + ( Contemplate.addslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>stripslashes("this string\'s s\\"s s\\\\"s s\\\\\\"s") = ' + ( Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s") ) + '</li>' + "\n" + '    <li>uuid(namespace) = ' + ( Contemplate.uuid("namespace") ) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    ';
                var _O37 = data['users'], _OK38 = Contemplate.keys(_O37);
                if (_OK38 && _OK38.length)
                {
                    var _K39, _V41, _L40 = _OK38.length;
                    for (_K39=0; _K39<_L40; _K39++)
                    {
                        data['i'] = _OK38[_K39]; data['usergroup'] = _V41 = _O37[_OK38[_K39]];
                        
                         
                        __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + Contemplate.tpl( "sub",  {"i" : data['i'], "users" : data['users']} ); 
                         
                        __p__ += '' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block2' */
            'Block2': function(__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>A table</strong><br />' + "\n" + '    ' + ( Contemplate.htmltable(data['table_data'], data['table_options']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + ( bracket( "inlined" ) ) + '' + "\n" + '    <br />' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    <strong>Test if variable is set</strong><br />' + "\n" + '    ';
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
                 
                __p__ += '' + "\n" + '    <br />' + "\n" + '    ' + "\n" + '    ' + ( Contemplate.plg_test(data['foo']) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + ( Contemplate.plg_print({          "stringVar"     : "stringValue",          "numericVar"    : 123,          "arrayVar"      : [             0, 1, "astring", 3,              { "prop": 1 }          ]      }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _O1 = ["a", "b", "c"], _OK2 = Contemplate.keys(_O1);
                if (_OK2 && _OK2.length)
                {
                    var _K3, _V5, _L4 = _OK2.length;
                    for (_K3=0; _K3<_L4; _K3++)
                    {
                        data['index'] = _OK2[_K3]; data['value'] = _V5 = _O1[_OK2[_K3]];
                        
                         
                        __p__ += '' + "\n" + '        [' + ( data['index'] ) + '] = <strong>' + ( data['value'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _O6 = Contemplate.values(["a", "b", "c"]);
                if (_O6 && _O6.length)
                {
                    var _K7, _V9, _L8 = _O6.length;
                    for (_K7=0; _K7<_L8; _K7++)
                    {
                        data['value2'] = _V9 = _O6[_K7];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + ( data['value2'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _O10 = {"k1":"a", "k2":"b", "k3":"c"}, _OK11 = Contemplate.keys(_O10);
                if (_OK11 && _OK11.length)
                {
                    var _K12, _V14, _L13 = _OK11.length;
                    for (_K12=0; _K12<_L13; _K12++)
                    {
                        data['index3'] = _OK11[_K12]; data['value3'] = _V14 = _O10[_OK11[_K12]];
                        
                         
                        __p__ += '' + "\n" + '        [' + ( data['index3'] ) + '] = <strong>' + ( data['value3'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (php-style)</strong><br />' + "\n" + '    ';
                var _O15 = Contemplate.values({"k1":"a", "k2":"b", "k3":"c"});
                if (_O15 && _O15.length)
                {
                    var _K16, _V18, _L17 = _O15.length;
                    for (_K16=0; _K16<_L17; _K16++)
                    {
                        data['value4'] = _V18 = _O15[_K16];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + ( data['value4'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _O19 = ["a", "b", "c"], _OK20 = Contemplate.keys(_O19);
                if (_OK20 && _OK20.length)
                {
                    var _K21, _V23, _L22 = _OK20.length;
                    for (_K21=0; _K21<_L22; _K21++)
                    {
                        data['index4'] = _OK20[_K21]; data['value4'] = _V23 = _O19[_OK20[_K21]];
                        
                         
                        __p__ += '' + "\n" + '        [' + ( data['index4'] ) + '] = <strong>' + ( data['value4'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal array data in non-associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _O24 = Contemplate.values(["a", "b", "c"]);
                if (_O24 && _O24.length)
                {
                    var _K25, _V27, _L26 = _O24.length;
                    for (_K25=0; _K25<_L26; _K25++)
                    {
                        data['value5'] = _V27 = _O24[_K25];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + ( data['value5'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _O28 = {"k1":"a", "k2":"b", "k3":"c"}, _OK29 = Contemplate.keys(_O28);
                if (_OK29 && _OK29.length)
                {
                    var _K30, _V32, _L31 = _OK29.length;
                    for (_K30=0; _K30<_L31; _K30++)
                    {
                        data['index6'] = _OK29[_K30]; data['value7'] = _V32 = _O28[_OK29[_K30]];
                        
                         
                        __p__ += '' + "\n" + '        [' + ( data['index6'] ) + '] = <strong>' + ( data['value7'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>use literal object data in non-associative loop (python-style)</strong><br />' + "\n" + '    ';
                var _O33 = Contemplate.values({"k1":"a", "k2":"b", "k3":"c"});
                if (_O33 && _O33.length)
                {
                    var _K34, _V36, _L35 = _O33.length;
                    for (_K34=0; _K34<_L35; _K34++)
                    {
                        data['value8'] = _V36 = _O33[_K34];
                        
                         
                        __p__ += '' + "\n" + '        <strong>' + ( data['value8'] ) + '</strong><br /> ' + "\n" + '    ';
                    }
                }
                 
                __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box</strong><br />' + "\n" + '    ' + ( Contemplate.htmlselect(data['select_data'], data['select_options']) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A table with alternative format</strong><br />' + "\n" + '    ' + ( Contemplate.htmltable(data['table_data'], {"header" : true, "tpl_cell": Contemplate.inline("<td>{{value}} (inline tpl)</td>",{"{{value}}":"cell"})}) ) + '' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>A select box with alternative format</strong><br />' + "\n" + '    ' + ( Contemplate.htmlselect(data['select_data'], {             "foo123" : ":,=>",             "optgroups" : ["group1", "group2", "group3"],             "selected" : 3,             "multiple" : false,             "style" : "width:200px;",             "tpl_option": '<option value="$value" $selected>$option (inline tpl)</option>'         }) ) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + ( Contemplate.ldate("M, d", Contemplate.now()) ) + '' + "\n" + ''; 
                 
                __p__ += '' + "\n" + '' + "\n" + '';
                return __p__;
                
            }
            ,
            
            
            /* tpl block render method for block 'Block12' */
            'Block12': function(__i__) {
                
                var __p__ = '', data = __i__.d;
                 
                __p__ += 'Demo template nested Block12';
                return __p__;
                
            }
            
        };
        
        /* tpl-defined blocks render code ends here */
        
        /* template methods */
        
        this.setId = function(id) {
            if ( id ) this.id = id;
            return this;
        };
        
        this.extend = function(tpl) {
            if ( tpl && tpl.substr )
                _extends = Contemplate_tpl( tpl );
            else
                _extends = tpl;
            return this;
        };
        
        /* render a tpl block method */
        this.renderBlock = function(block, __i__) {
            if ( !__i__ ) __i__ = this;
            if ( _blocks && _blocks[block] ) return _blocks[block](__i__);
            else if ( _extends ) return _extends.renderBlock(block, __i__);
            return '';
        };
        
        /* tpl render method */
        this.render = function(data, __i__) {
            if ( !__i__ ) __i__ = this;
            var __p__ = '';
            if ( _extends )
            {
                __p__ = _extends.render(data, __i__);
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
        
        /* extend tpl assign code starts here */
        this.extend( 'base' );
        /* extend tpl assign code ends here */
    };
    
    
    // export it
    return Contemplate_demo_Cached;
    };
});
