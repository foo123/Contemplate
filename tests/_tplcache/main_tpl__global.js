
!function( root, name, factory ){
"use strict";
if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if ( ('undefined'!==typeof System)&&('function'===typeof System.register)&&('function'===typeof System['import']) ) /* ES6 module */
    System.register(name,[],function($__export){$__export(name, factory.call(root));});
else if ( ('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(this,'Contemplate_main__global',function( ){
"use strict";
return function( Contemplate ) {
/* Contemplate cached template 'main', constructor */
function Contemplate_main__global( id )
{
    var self = this;
    Contemplate.Template.call( self, id );
    /* tpl-defined blocks render code starts here */

    /* tpl-defined blocks render code ends here */
    /* extend tpl assign code starts here */

    /* extend tpl assign code ends here */
}
/* extends main Contemplate.Template class */
Contemplate_main__global.prototype = Object.create(Contemplate.Template.prototype);
/* render method */
Contemplate_main__global.prototype.render = function( data, __i__ ) {
    "use strict";
    var self = this, __p__ = '', __ctx = false;
    !__i__&&(__i__=self)&&(self._autonomus||(__ctx=Contemplate._set_ctx( self._ctx )));
    /* tpl main render code starts here */
    
    __p__ += '<!DOCTYPE html>' + "\n" + '<html>' + "\n" + '    <!-- PROOf Of CONCEPT' + "\n" + '    /*' + "\n" + '    *  Simple light-weight template engine for PHP, Python, Node, XPCOM and client-side JavaScript' + "\n" + '    *  @author: Nikos M.  http://nikos-web-development.netai.net/' + "\n" + '    *' + "\n" + '    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed' + "\n" + '    *  http://ejohn.org/blog/javascript-micro-templating/' + "\n" + '    *' + "\n" + '    */' + "\n" + '    -->' + "\n" + '    <head>' + "\n" + '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + "\n" + '        <style>#forkongithub a{background:#aa0000;color:#fff;text-decoration:none;font-family:arial, sans-serif;text-align:center;font-weight:bold;padding:5px 40px;font-size:0.9rem;line-height:1.4rem;position:relative;transition:0.5s;}#forkongithub a:hover{background:#aa0000;color:#fff;}#forkongithub a::before,#forkongithub a::after{content:"";width:100%;display:block;position:absolute;z-index:100;top:1px;left:0;height:1px;background:#fff;}#forkongithub a::after{bottom:1px;top:auto;}@media screen and (min-width:800px){#forkongithub{position:absolute;display:block;z-index:100;top:0;right:0;width:200px;overflow:hidden;height:200px;}#forkongithub a{width:200px;position:absolute;top:60px;right:-60px;transform:rotate(45deg);-webkit-transform:rotate(45deg);box-shadow:4px 4px 10px rgba(0,0,0,0.8);}}</style>' + "\n" + '        <script type="text/x-contemplate" id="base_tpl">' + (data.templates["base"]) + '</script>' + "\n" + '        <script type="text/x-contemplate" id="demo_tpl">' + (data.templates["demo"]) + '</script>' + "\n" + '        <script type="text/x-contemplate" id="date_tpl">' + (data.templates["date"]) + '</script>' + "\n" + '        <script type="text/x-contemplate" id="sub_tpl">' + (data.templates["sub"]) + '</script>' + "\n" + '        <script src="./js/Contemplate.min.js?nocache=1"></script>' + "\n" + '    </head>' + "\n" + '' + "\n" + '    <body>' + "\n" + '        ' + "\n" + '        <span id="forkongithub"><a href="https://github.com/foo123/Contemplate">Eat me on GitHub</a></span>' + "\n" + '        ' + "\n" + '        <strong>Contemplate.VERSION = ' + (data.contemplate_version) + '</strong><br /><br />' + "\n" + '        ' + "\n" + '        An inline template:' + "\n" + '        <div id="inline">' + (data.render_inline) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '                ' + "\n" + '        In the SERVER:' + "\n" + '        <div id="results_server">' + (data.render_server) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '        ' + "\n" + '        In the CLIENT:' + "\n" + '        <strong>Contemplate.VERSION (client) = <span id="version">0</span></strong><br /><br />' + "\n" + '        <div id="results_client"></div>' + "\n" + '        <script type="text/javascript">' + "\n" + '        /*Contemplate.setCompatibilityMode( true );*/' + "\n" + '        ' + "\n" + '        Contemplate.setLocales({' + "\n" + '            "locale": "γλωσσική περιοχή",' + "\n" + '            "locales": "γλωσσικές περιοχές"' + "\n" + '        });' + "\n" + '        Contemplate.setXLocales({"custom":{' + "\n" + '            "locale": "γλωσσική ζώνη",' + "\n" + '            "locales": "γλωσσικές ζώνες"' + "\n" + '        }});' + "\n" + '' + "\n" + '        /* add the templates */' + "\n" + '        Contemplate.add({' + "\n" + '         \'base\'     : "#base_tpl"' + "\n" + '        ,\'demo\'     : "#demo_tpl"' + "\n" + '        ,\'sub\'      : "#sub_tpl"' + "\n" + '        ,\'date\'     : "#date_tpl"' + "\n" + '        });' + "\n" + '        Contemplate.addPlugin(\'plg_test\', function(v){' + "\n" + '            if ( v ) return \'Plugin Test value: \' + v;' + "\n" + '            return \'Plugin Test no value given\';' + "\n" + '        });' + "\n" + '        Contemplate.addPlugin(\'plg_print\', function(v){' + "\n" + '            return \'<pre>\' + JSON.stringify(v, null, 4) + \'</pre>\';' + "\n" + '        });' + "\n" + '        window.bracket = function(v)' + "\n" + '        {' + "\n" + '            return \'[[\' + v + \']]\';' + "\n" + '        }' + "\n" + '        Contemplate.addPlugin(\'inlinedBracket\', Contemplate.inline(\'bracket($0)\',{\'$0\':0}));' + "\n" + '        document.getElementById("version").innerHTML = \'\'+Contemplate.VERSION;' + "\n" + '        document.getElementById("results_client").innerHTML = Contemplate.tpl(\'demo\', ' + (data.data_client) + ');' + "\n" + '        </script>' + "\n" + '    ' + "\n" + '    </body>' + "\n" + '' + "\n" + '</html>';
    
    /* tpl main render code ends here */
    __ctx&&Contemplate._set_ctx( __ctx );
    return __p__;
};
// export it
return Contemplate_main__global;
};
});
