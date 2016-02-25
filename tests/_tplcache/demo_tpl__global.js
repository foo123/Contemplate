
!function (root,name,factory){
'use strict';
var m;
if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */
    (root.EXPORTED_SYMBOLS = [ name ]) && (root[ name ] = factory( ));
else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */
    module.exports = factory( );
else if ( ('function'===typeof(define))&&define.amd&&('function'===typeof(require))&&('function'===typeof(require.specified))&&require.specified(name) ) /* AMD */
    define(name,['require','exports','module'],factory);
else if ( !(name in root) ) /* Browser/Worker/.. */
    (root[ name ] = (m=factory( )))&&('function'===typeof(define))&&define.amd&&define(function( ){return m;} );
}(this,'Contemplate_demo__global',function( ){
'use strict';
return function( Contemplate ) {
/* Contemplate cached template 'demo', constructor */
function Contemplate_demo__global( id )
{
    var self = this;
    Contemplate.Template.call( self, id );
    /* tpl-defined blocks render code starts here */
    
    self._blocks = {
    
    
    /* tpl block render method for block 'Block3' */
    'Block3': function( Contemplate, data, self, __i__ ) {
        "use strict";
        var __p__ = '';
        
        __p__ += '' + "\n" + '' + "\n" + '    <strong>Block3 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Contemplate Functions/Plugins</strong><hr /><br />' + "\n" + '    ' + "\n" + '    <strong>Functions</strong><br />' + "\n" + '    <ul>' + "\n" + '    <li>%uuid(&quot;namespace&quot;) = ' + (Contemplate.uuid("namespace")) + '</li>' + "\n" + '    <li>%echo(&quot;123&quot;) = ' + (String("123")) + '</li>' + "\n" + '    <li>%concat(&quot;123&quot;,&quot;456&quot;,&quot;789&quot;) = ' + (["123","456","789"].join('')) + '</li>' + "\n" + '    <li>%q(123) = ' + ("'"+(123)+"'") + '</li>' + "\n" + '    <li>%dq(123) = ' + ('"'+(123)+'"') + '</li>' + "\n" + '    <li>%trim(&quot;__FOO__&quot;, &quot;_&quot;) = ' + (Contemplate.trim("__FOO__", "_")) + '</li>' + "\n" + '    <li>%trim(&quot;  FOO  &quot;) = ' + (Contemplate.trim("  FOO  ")) + '</li>' + "\n" + '    <li>%lowercase(&quot;FOO&quot;) = ' + (("FOO").toLowerCase()) + '</li>' + "\n" + '    <li>%lowercase(&quot;fOo&quot;) = ' + (("fOo").toLowerCase()) + '</li>' + "\n" + '    <li>%uppercase(&quot;foo&quot;) = ' + (("foo").toUpperCase()) + '</li>' + "\n" + '    <li>%uppercase(&quot;FoO&quot;) = ' + (("FoO").toUpperCase()) + '</li>' + "\n" + '    <li>%camelcase(&quot;camel_case&quot;, &quot;_&quot;) = ' + (Contemplate.camelcase("camel_case", "_")) + '</li>' + "\n" + '    <li>%camelcase(&quot;camelCase&quot;) = ' + (Contemplate.camelcase("camelCase")) + '</li>' + "\n" + '    <li>%snakecase(&quot;snakeCase&quot;, &quot;_&quot;) = ' + (Contemplate.snakecase("snakeCase", "_")) + '</li>' + "\n" + '    <li>%snakecase(&quot;snake_case&quot;) = ' + (Contemplate.snakecase("snake_case")) + '</li>' + "\n" + '    <li>%sprintf(&quot;%02d : %02d : %02d&quot;, 2, 0, 12) = ' + (Contemplate.sprintf("%02d : %02d : %02d", 2, 0, 12)) + '</li>' + "\n" + '    <li>%addslashes(&quot;this string\'s s\\&apos;s s\\\\&apos;s s\\\\\\&apos;s&quot;) = ' + (Contemplate.addslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>%stripslashes(&quot;this string\'s s\\&apos;s s\\\\&apos;s s\\\\\\&apos;s&quot;) = ' + (Contemplate.stripslashes("this string's s\'s s\\'s s\\\'s")) + '</li>' + "\n" + '    <li>%l(&quot;locale&quot;) = %locale(&quot;locale&quot;) = ' + (Contemplate.locale("locale")) + ' = ' + (Contemplate.locale("locale")) + '</li>' + "\n" + '    <li>%nl(2,&quot;locale&quot;,&quot;locales&quot;) = %nlocale(2,&quot;locale&quot;,&quot;locales&quot;) = ' + (Contemplate.nlocale(2,"locale","locales")) + ' = ' + (Contemplate.nlocale(2,"locale","locales")) + '</li>' + "\n" + '    <li>%plural(&quot;item&quot;, 1) = ' + (Contemplate.plural("item", 1)) + '</li>' + "\n" + '    <li>%plural(&quot;item&quot;, 2) = ' + (Contemplate.plural("item", 2)) + '</li>' + "\n" + '    <li>%e(&#39;&lt;ok k=&quot;v&quot;&gt;&#39;) = ' + (Contemplate.e("<ok k=\"v\">")) + '</li>' + "\n" + '    </ul>' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test plugin with variable $foo</strong><br />' + "\n" + '    ' + (Contemplate.plg_("plg_test",data.foo)) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Test inlined plugin</strong><br />' + "\n" + '    ' + (bracket("inlined")) + '' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <!-- use contemplate literal data with template function, in this case a print test plugin -->' + "\n" + '    <strong>use literal data with template function, in this case a print plugin</strong><br />' + "\n" + '    ' + (Contemplate.plg_("plg_print",{ "stringVar" : "stringValue", "numericVar" : 123, "arrayVar" : [ 0, 1, "astring", 3, { "prop": 1 } ] })) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '';
        return __p__;
        
    }
    ,
    
    
    /* tpl block render method for block 'Block2' */
    'Block2': function( Contemplate, data, self, __i__ ) {
        "use strict";
        var __p__ = '';
        
        __p__ += '' + "\n" + '' + "\n" + '    <strong>Block2 is overriden by the demo template</strong>' + "\n" + '' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Can reference the super Block2 directly if needed in OO manner</strong>' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- call the super block here in OO manner, if any -->' + "\n" + '    ' + (self.sprblock("Block2", data)) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>Contemplate Constructs</strong><hr /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for(["a", "b", "c"] as $index=>$value) %&gt;' + "\n" + '        [&lt;% $index %&gt;] = &lt;strong&gt;&lt;% $value %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_10 = ["a", "b", "c"], _loc_11 = _loc_10 ? Object.keys(_loc_10) : null,
            _loc_12, _loc_index, _loc_value, _loc_13 = _loc_11 ? _loc_11.length : 0;
        if (_loc_13)
        {
            for (_loc_12=0; _loc_12<_loc_13; _loc_12++)
            {
                _loc_index = _loc_11[_loc_12]; _loc_value = _loc_10[_loc_index];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index) + '] = <strong>' + (_loc_value) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for(["a", "b", "c"] as $value2) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value2 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_20 = ["a", "b", "c"], _loc_22 = !!_loc_20.forEach,
            _loc_21 = _loc_20 ? (_loc_22 ? _loc_20 : Object.keys(_loc_20)) : null,
            _loc_23, _loc_24, _loc_value2, _loc_25 = _loc_21 ? _loc_21.length : 0;
        if (_loc_25)
        {
            for (_loc_23=0; _loc_23<_loc_25; _loc_23++)
            {
                _loc_24 = _loc_21[_loc_23];
                _loc_value2 = _loc_22 ? _loc_24 : _loc_20[_loc_24];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value2) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $index3=>$value3) %&gt;' + "\n" + '        [&lt;% $index3 %&gt;] = &lt;strong&gt;&lt;% $value3 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_35 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_36 = _loc_35 ? Object.keys(_loc_35) : null,
            _loc_37, _loc_index3, _loc_value3, _loc_38 = _loc_36 ? _loc_36.length : 0;
        if (_loc_38)
        {
            for (_loc_37=0; _loc_37<_loc_38; _loc_37++)
            {
                _loc_index3 = _loc_36[_loc_37]; _loc_value3 = _loc_35[_loc_index3];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index3) + '] = <strong>' + (_loc_value3) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (php-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for({"k1":"a", "k2":"b", "k3":"c"} as $value4) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_48 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_50 = !!_loc_48.forEach,
            _loc_49 = _loc_48 ? (_loc_50 ? _loc_48 : Object.keys(_loc_48)) : null,
            _loc_51, _loc_52, _loc_value4, _loc_53 = _loc_49 ? _loc_49.length : 0;
        if (_loc_53)
        {
            for (_loc_51=0; _loc_51<_loc_53; _loc_51++)
            {
                _loc_52 = _loc_49[_loc_51];
                _loc_value4 = _loc_50 ? _loc_52 : _loc_48[_loc_52];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value4) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($index4,$value4 in ["a", "b", "c"]) %&gt;' + "\n" + '        [&lt;% $index4 %&gt;] = &lt;strong&gt;&lt;% $value4 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_60 = ["a", "b", "c"], _loc_61 = _loc_60 ? Object.keys(_loc_60) : null,
            _loc_62, _loc_index4, _loc_value4, _loc_63 = _loc_61 ? _loc_61.length : 0;
        if (_loc_63)
        {
            for (_loc_62=0; _loc_62<_loc_63; _loc_62++)
            {
                _loc_index4 = _loc_61[_loc_62]; _loc_value4 = _loc_60[_loc_index4];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index4) + '] = <strong>' + (_loc_value4) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal array data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($value5 in ["a", "b", "c"]) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value5 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_70 = ["a", "b", "c"], _loc_72 = !!_loc_70.forEach,
            _loc_71 = _loc_70 ? (_loc_72 ? _loc_70 : Object.keys(_loc_70)) : null,
            _loc_73, _loc_74, _loc_value5, _loc_75 = _loc_71 ? _loc_71.length : 0;
        if (_loc_75)
        {
            for (_loc_73=0; _loc_73<_loc_75; _loc_73++)
            {
                _loc_74 = _loc_71[_loc_73];
                _loc_value5 = _loc_72 ? _loc_74 : _loc_70[_loc_74];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value5) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($index6,$value7 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        [&lt;% $index6 %&gt;] = &lt;strong&gt;&lt;% $value7 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_85 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_86 = _loc_85 ? Object.keys(_loc_85) : null,
            _loc_87, _loc_index6, _loc_value7, _loc_88 = _loc_86 ? _loc_86.length : 0;
        if (_loc_88)
        {
            for (_loc_87=0; _loc_87<_loc_88; _loc_87++)
            {
                _loc_index6 = _loc_86[_loc_87]; _loc_value7 = _loc_85[_loc_index6];
                
                
                __p__ += '' + "\n" + '        [' + (_loc_index6) + '] = <strong>' + (_loc_value7) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>FOR Loop Non-Associative (python-style, literal object data)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($value8 in {"k1":"a", "k2":"b", "k3":"c"}) %&gt;' + "\n" + '        &lt;strong&gt;&lt;% $value8 %&gt;&lt;/strong&gt;&lt;br /&gt; ' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_98 = {"k1":"a", "k2":"b", "k3":"c"}, _loc_100 = !!_loc_98.forEach,
            _loc_99 = _loc_98 ? (_loc_100 ? _loc_98 : Object.keys(_loc_98)) : null,
            _loc_101, _loc_102, _loc_value8, _loc_103 = _loc_99 ? _loc_99.length : 0;
        if (_loc_103)
        {
            for (_loc_101=0; _loc_101<_loc_103; _loc_101++)
            {
                _loc_102 = _loc_99[_loc_101];
                _loc_value8 = _loc_100 ? _loc_102 : _loc_98[_loc_102];
                
                
                __p__ += '' + "\n" + '        <strong>' + (_loc_value8) + '</strong><br /> ' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>IF - ELSEIF - ELSE - ENDIF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( 1+1 != 2 ) %&gt;' + "\n" + '        1+1 != 2' + "\n" + '    &lt;% %elif( 1+1 == 1) %&gt;' + "\n" + '        1+1 = 1' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        1+1 = 2' + "\n" + '    &lt;% %fi() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
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
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Inline (ternary) IF</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %iif( 1+1 == 2, "1+1 = 2", "1+1 = 1" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + (((1+1 == 2)?( "1+1 = 2"):( "1+1 = 1"))) + '' + "\n" + '    ' + "\n" + '    <pre>' + "\n" + '    &lt;% %iif( 1+1 == 1, "1+1 = 1", "1+1 = 2" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + (((1+1 == 1)?( "1+1 = 1"):( "1+1 = 2"))) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>Inline (ternary) IF (2)</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %iif( !%empty($undefined_variable), $undefined_variable, "test with undefined variable passed" ) %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ' + (((!(("undefined" === typeof(data.undefined_variable)) || (null === data.undefined_variable) || Contemplate.empty(data.undefined_variable)))?( data.undefined_variable):( "test with undefined variable passed"))) + '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>SET a new tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %set($foo, "123") %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        data.foo = ("123");
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '    ' + "\n" + '    <strong>CHECK ISSET for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( %isset($foo) ) %&gt;' + "\n" + '        $foo is SET' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        $foo is NOT SET' + "\n" + '    &lt;% %fi() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if (("undefined" !== typeof(data.foo) && null !== data.foo))
        {
            
            __p__ += '' + "\n" + '        $foo is SET' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        $foo is NOT SET' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CHECK EMPTY for a tpl variable</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %if( %empty($foo) ) %&gt;' + "\n" + '        $foo is EMPTY' + "\n" + '    &lt;% %else() %&gt;' + "\n" + '        $foo is NOT EMPTY' + "\n" + '    &lt;% %fi() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        if ((("undefined" === typeof(data.foo)) || (null === data.foo) || Contemplate.empty(data.foo)))
        {
            
            __p__ += '' + "\n" + '        $foo is EMPTY' + "\n" + '    ';
        }
        else
        {
            
            __p__ += '' + "\n" + '        $foo is NOT EMPTY' + "\n" + '    ';
        }
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <!-- include a (sub-)template file -->' + "\n" + '    <strong>INCLUDE a (sub-)template file</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %include("date") %&gt;' + "\n" + '    </pre><br />' + "\n" + '     <!-- print a localized date php-style -->' + "\n" + '<strong>A (localized) date, PHP-style</strong><br />' + "\n" + '' + (Contemplate.ldate("M, D, d")) + '' + "\n" + '';
        
        __p__ += '' + "\n" + '    ' + "\n" + '    <br /><br />' + "\n" + '' + "\n" + '    <strong>CALL another (sub-)template</strong><br />' + "\n" + '    <pre>' + "\n" + '    &lt;% %for($users as $i=>$usergroup) %&gt;' + "\n" + '        &lt;!-- call a (sub-)template --&gt;' + "\n" + '        &lt;% %tpl("sub", {"i" : $i, "users" : $users}) %&gt;' + "\n" + '    &lt;% %endfor() %&gt;' + "\n" + '    </pre><br />' + "\n" + '    ';
        var _loc_121 = data.users, _loc_122 = _loc_121 ? Object.keys(_loc_121) : null,
            _loc_123, _loc_i, _loc_usergroup, _loc_124 = _loc_122 ? _loc_122.length : 0;
        if (_loc_124)
        {
            for (_loc_123=0; _loc_123<_loc_124; _loc_123++)
            {
                _loc_i = _loc_122[_loc_123]; _loc_usergroup = _loc_121[_loc_i];
                
                
                __p__ += '' + "\n" + '        <!-- call a (sub-)template -->' + "\n" + '        ' + (Contemplate.tpl("sub", {"i" : _loc_i, "users" : data.users})) + '' + "\n" + '    ';
            }
        }
        
        __p__ += '' + "\n" + '' + "\n" + '';
        return __p__;
        
    }
    ,
    
    
    /* tpl block render method for block 'Block12' */
    'Block12': function( Contemplate, data, self, __i__ ) {
        "use strict";
        var __p__ = '';
        
        __p__ += 'Demo template nested Block12';
        return __p__;
        
    }
    
    };
    
    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */
    self.extend('base');
    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_demo__global.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_demo__global.prototype.render = function( data, __i__ ) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));
    /* tpl main render code starts here */
    
    __p__ = '';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx( __ctx );
    return __p__;
};
// export it
return Contemplate_demo__global;
};
});
