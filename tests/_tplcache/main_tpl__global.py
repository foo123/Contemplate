# -*- coding: UTF-8 -*-

# Contemplate cached template 'main'
def __getTplClass__(Contemplate):
    # extends the main Contemplate.Template class
    class Contemplate_main__global(Contemplate.Template):
        'Contemplate cached template main'
        # constructor
        def __init__(self, id=None):
            self_ = self
            super(Contemplate_main__global, self_).__init__( id )
            # extend tpl assign code starts here
            
            # extend tpl assign code ends here
        # tpl-defined blocks render code starts here
        
        # tpl-defined blocks render code ends here
        # render a tpl block method
        def block(self, block, data, __i__=None):
            self_ = self
            __ctx = False
            r = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx( self._ctx )
            method = '_blockfn_' + block
            if (hasattr(self_, method) and callable(getattr(self_, method))):
                r = getattr(self_, method)(data, self_, __i__)
            elif self_._extends:
                r = self_._extends.block(block, data, __i__)
            if __ctx:  Contemplate._set_ctx( __ctx )
            return r
        # render method
        def render(self, data, __i__=None):
            self_ = self
            __ctx = False
            __p__ = ''
            if not __i__:
                __i__ = self_
                if not self._autonomus: __ctx = Contemplate._set_ctx( self._ctx )
            if self_._extends:
                __p__ = self_._extends.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __p__ += '<!DOCTYPE html>' + "\n" + '<html>' + "\n" + '    <!-- PROOf Of CONCEPT' + "\n" + '    /*' + "\n" + '    *  Simple light-weight template engine for PHP, Python, Node and client-side JavaScript' + "\n" + '    *  @author: Nikos M.  http://nikos-web-development.netai.net/' + "\n" + '    *' + "\n" + '    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed' + "\n" + '    *  http://ejohn.org/blog/javascript-micro-templating/' + "\n" + '    *' + "\n" + '    */' + "\n" + '    -->' + "\n" + '    <head>' + "\n" + '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + "\n" + '        <style>#forkongithub a{background:#aa0000;color:#fff;text-decoration:none;font-family:arial, sans-serif;text-align:center;font-weight:bold;padding:5px 40px;font-size:0.9rem;line-height:1.4rem;position:relative;transition:0.5s;}#forkongithub a:hover{background:#aa0000;color:#fff;}#forkongithub a::before,#forkongithub a::after{content:"";width:100%;display:block;position:absolute;z-index:100;top:1px;left:0;height:1px;background:#fff;}#forkongithub a::after{bottom:1px;top:auto;}@media screen and (min-width:800px){#forkongithub{position:absolute;display:block;z-index:100;top:0;right:0;width:200px;overflow:hidden;height:200px;}#forkongithub a{width:200px;position:absolute;top:60px;right:-60px;transform:rotate(45deg);-webkit-transform:rotate(45deg);box-shadow:4px 4px 10px rgba(0,0,0,0.8);}}</style>' + "\n" + '        <script type="text/x-contemplate" id="base_tpl">' + str(data['templates']["base"]) + '</script>' + "\n" + '        <script type="text/x-contemplate" id="demo_tpl">' + str(data['templates']["demo"]) + '</script>' + "\n" + '        <script type="text/x-contemplate" id="date_tpl">' + str(data['templates']["date"]) + '</script>' + "\n" + '        <script type="text/x-contemplate" id="sub_tpl">' + str(data['templates']["sub"]) + '</script>' + "\n" + '        <script src="./js/Contemplate.min.js?nocache=1"></script>' + "\n" + '    </head>' + "\n" + '' + "\n" + '    <body>' + "\n" + '        ' + "\n" + '        <span id="forkongithub"><a href="https://github.com/foo123/Contemplate">Eat me on GitHub</a></span>' + "\n" + '        ' + "\n" + '        <strong>Contemplate.VERSION = ' + str(data['contemplate_version']) + '</strong><br /><br />' + "\n" + '        ' + "\n" + '        An inline template:' + "\n" + '        <div id="inline">' + str(data['render_inline']) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '                ' + "\n" + '        In the SERVER:' + "\n" + '        <div id="results_server">' + str(data['render_server']) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '        ' + "\n" + '        In the CLIENT:' + "\n" + '        <strong>Contemplate.VERSION (client) = <span id="version">0</span></strong><br /><br />' + "\n" + '        <div id="results_client"></div>' + "\n" + '        <script type="text/javascript">' + "\n" + '        Contemplate.setCompatibilityMode( true );' + "\n" + '        ' + "\n" + '        Contemplate.setLocales({' + "\n" + '            "locale": "γλωσσική περιοχή",' + "\n" + '            "locales": "γλωσσικές περιοχές"' + "\n" + '        });' + "\n" + '        Contemplate.setPlurals({' + "\n" + '            \'item\': null // auto plural' + "\n" + '        });' + "\n" + '' + "\n" + '        /* add the templates */' + "\n" + '        Contemplate.add({' + "\n" + '         \'base\'     : "#base_tpl"' + "\n" + '        ,\'demo\'     : "#demo_tpl"' + "\n" + '        ,\'sub\'      : "#sub_tpl"' + "\n" + '        ,\'date\'     : "#date_tpl"' + "\n" + '        });' + "\n" + '        Contemplate.addPlugin(\'plg_test\', function(v){' + "\n" + '            if ( v ) return \'Plugin Test value: \' + v;' + "\n" + '            return \'Plugin Test no value given\';' + "\n" + '        });' + "\n" + '        Contemplate.addPlugin(\'plg_print\', function(v){' + "\n" + '            return \'<pre>\' + JSON.stringify(v, null, 4) + \'</pre>\';' + "\n" + '        });' + "\n" + '        window.bracket = function(v)' + "\n" + '        {' + "\n" + '            return \'[[\' + v + \']]\';' + "\n" + '        }' + "\n" + '        Contemplate.addPlugin(\'inlinedBracket\', Contemplate.inline(\'bracket($0)\',{\'$0\':0}));' + "\n" + '        document.getElementById("version").innerHTML = \'\'+Contemplate.VERSION;' + "\n" + '        document.getElementById("results_client").innerHTML = Contemplate.tpl(\'demo\', ' + str(data['data_client']) + ');' + "\n" + '        </script>' + "\n" + '    ' + "\n" + '    </body>' + "\n" + '' + "\n" + '</html>'
                
                # tpl main render code ends here

            if __ctx:  Contemplate._set_ctx( __ctx )
            return __p__
    return Contemplate_main__global
# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
