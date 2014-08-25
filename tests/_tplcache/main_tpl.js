
!function (root, moduleName, moduleDefinition) {

    //
    // export the module

    // node, CommonJS, etc..
    if ( 'object' === typeof(module) && module.exports ) module.exports = moduleDefinition();

    // AMD, etc..
    else if ( 'function' === typeof(define) && define.amd ) define( moduleDefinition );

    // browser, etc..
    else root[ moduleName ] = moduleDefinition();


}(this, 'Contemplate_main_Cached', function( ) {
    "use strict";
    return function( Contemplate ) {
    /* Contemplate cached template 'main' */
    /* quasi extends main Contemplate class */
    
    /* constructor */
    function Contemplate_main_Cached(id)
    {
        /* initialize internal vars */
        var _extends = null, _blocks = null;
        
        this.id = id;
        this.d = null;
        
        
        /* tpl-defined blocks render code starts here */
        
        /* tpl-defined blocks render code ends here */
        
        /* template methods */
        
        this.setId = function(id) {
            if ( id ) this.id = id;
            return this;
        };
        
        this.extend = function(tpl) {
            if ( tpl && tpl.substr )
                _extends = Contemplate.tpl( tpl );
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
                
                __i__.d = Contemplate.data( data );
                __p__ += '<!DOCTYPE html>' + "\n" + '<html>' + "\n" + '' + "\n" + '' + "\n" + '    <!-- PROOf Of CONCEPT' + "\n" + '    /*' + "\n" + '    *  Simple light-weight template engine for PHP, Python, Node and client-side JavaScript' + "\n" + '    *  @author: Nikos M.  http://nikos-web-development.netai.net/' + "\n" + '    *' + "\n" + '    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed' + "\n" + '    *  http://ejohn.org/blog/javascript-micro-templating/' + "\n" + '    *' + "\n" + '    */' + "\n" + '    -->' + "\n" + '    ' + "\n" + '    <head>' + "\n" + '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + "\n" + '        <script src="./js/Contemplate.min.js"></script>' + "\n" + '        <script type="text/html" id="sub_tpl">' + "\n" + '         ' + ( __i__.d['templates']["sub"] ) + '' + "\n" + '        </script>' + "\n" + '    </head>' + "\n" + '' + "\n" + '    <body>' + "\n" + '        ' + "\n" + '        <style>#forkongithub a{background:#aa0000;color:#fff;text-decoration:none;font-family:arial, sans-serif;text-align:center;font-weight:bold;padding:5px 40px;font-size:0.9rem;line-height:1.4rem;position:relative;transition:0.5s;}#forkongithub a:hover{background:#aa0000;color:#fff;}#forkongithub a::before,#forkongithub a::after{content:"";width:100%;display:block;position:absolute;z-index:100;top:1px;left:0;height:1px;background:#fff;}#forkongithub a::after{bottom:1px;top:auto;}@media screen and (min-width:800px){#forkongithub{position:absolute;display:block;z-index:100;top:0;right:0;width:200px;overflow:hidden;height:200px;}#forkongithub a{width:200px;position:absolute;top:60px;right:-60px;transform:rotate(45deg);-webkit-transform:rotate(45deg);box-shadow:4px 4px 10px rgba(0,0,0,0.8);}}</style><span id="forkongithub"><a href="https://github.com/foo123/Contemplate">Eat me on GitHub</a></span>' + "\n" + '        ' + "\n" + '        An inline template:' + "\n" + '        <div id="inline">' + ( __i__.d['render_inline'] ) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '                ' + "\n" + '        In the SERVER:' + "\n" + '        <div id="results_server">' + ( __i__.d['render_server'] ) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '        ' + "\n" + '        In the CLIENT:' + "\n" + '        <div id="results_client"></div>' + "\n" + '        <script>' + "\n" + '            Contemplate.setLocaleStrings({' + "\n" + '                "locale": "γλωσσική περιοχή"' + "\n" + '            });' + "\n" + '            Contemplate.setPlurals({' + "\n" + '                \'item\': null // auto plural' + "\n" + '            });' + "\n" + '' + "\n" + '            /* add the templates */' + "\n" + '            Contemplate.add({' + "\n" + '                \'base\': "./_tpls/base.tpl.html", // load the template from this url using ajax (slower)' + "\n" + '                \'demo\': "./_tpls/demo.tpl.html", // load the template from this url using ajax (slower)' + "\n" + '                "sub" : "#sub_tpl", // load the template from this DOM element' + "\n" + '                \'date\': "./_tpls/date.tpl.html" // load the template from this url using ajax (slower)' + "\n" + '            });' + "\n" + '            Contemplate.addPlugin(\'test\', function(v){' + "\n" + '                if ( v ) return \'Plugin Test value: \' + v;' + "\n" + '                return \'Plugin Test no value given\';' + "\n" + '            });' + "\n" + '            Contemplate.addPlugin(\'print\', function(v){' + "\n" + '                return \'<pre>\' + JSON.stringify(v, null, 4) + \'</pre>\';' + "\n" + '            });' + "\n" + '' + "\n" + '            document.getElementById("results_client").innerHTML = Contemplate.tpl(\'demo\', ' + ( __i__.d['data_client'] ) + ');' + "\n" + '        </script>' + "\n" + '    ' + "\n" + '    </body>' + "\n" + '' + "\n" + '</html>';
                
                /* tpl main render code ends here */
            }
            this.d = null;
            return __p__;
        };
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    };
    
    
    // export it
    return Contemplate_main_Cached;
    };
});
