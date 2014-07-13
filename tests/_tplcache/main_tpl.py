# -*- coding: UTF-8 -*-
# Contemplate cached template 'main'



# imports start here, if any

# imports end here

def __getTplClass__(Contemplate):

    # extends the main Contemplate class
    class Contemplate_main_Cached(Contemplate):
        'Contemplate cached template main'

        # constructor
        def __init__(self, id=None, __=None):
            # initialize internal vars
            self.id = None 
            self.data = None
            self._renderFunction = None
            self._parent = None
            self._blocks = None

            self.id = id
            
            # parent tpl assign code starts here
            
            # parent tpl assign code ends here



        # tpl-defined blocks render code starts here
        
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, __i__=None):
            if ( not __i__ ): __i__ = self

            method = '_blockfn_' + block

            if (hasattr(self, method) and callable(getattr(self, method))):
                return getattr(self, method)(__i__)

            elif self._parent is not None:
                return self._parent.renderBlock(block, __i__)

            return ''
            
        
        # tpl render method
        def render(self, data, __i__=None):
            __p__ = ''
            if ( not __i__ ): __i__ = self

            if self._parent is not None:
                __p__ = self._parent.render(data, __i__)

            else:
                # tpl main render code starts here
                
                __i__.data = Contemplate.data( data )
                __p__ += '<!DOCTYPE html>' + "\n" + '<html>' + "\n" + '' + "\n" + '' + "\n" + '    <!-- PROOf Of CONCEPT' + "\n" + '    /*' + "\n" + '    *  Simple light-weight template engine for PHP, Python, Node and client-side JavaScript' + "\n" + '    *  @author: Nikos M.  http://nikos-web-development.netai.net/' + "\n" + '    *' + "\n" + '    *  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed' + "\n" + '    *  http://ejohn.org/blog/javascript-micro-templating/' + "\n" + '    *' + "\n" + '    */' + "\n" + '    -->' + "\n" + '    ' + "\n" + '    <head>' + "\n" + '        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + "\n" + '        <script src="./js/Contemplate.min.js"></script>' + "\n" + '        <script type="text/html" id="sub_tpl">' + "\n" + '         ' + str( __i__.data['templates']["sub"] ) + '' + "\n" + '        </script>' + "\n" + '    </head>' + "\n" + '' + "\n" + '    <body>' + "\n" + '        ' + "\n" + '        <style>#forkongithub a{background:#aa0000;color:#fff;text-decoration:none;font-family:arial, sans-serif;text-align:center;font-weight:bold;padding:5px 40px;font-size:0.9rem;line-height:1.4rem;position:relative;transition:0.5s;}#forkongithub a:hover{background:#aa0000;color:#fff;}#forkongithub a::before,#forkongithub a::after{content:"";width:100%;display:block;position:absolute;z-index:100;top:1px;left:0;height:1px;background:#fff;}#forkongithub a::after{bottom:1px;top:auto;}@media screen and (min-width:800px){#forkongithub{position:absolute;display:block;z-index:100;top:0;right:0;width:200px;overflow:hidden;height:200px;}#forkongithub a{width:200px;position:absolute;top:60px;right:-60px;transform:rotate(45deg);-webkit-transform:rotate(45deg);box-shadow:4px 4px 10px rgba(0,0,0,0.8);}}</style><span id="forkongithub"><a href="https://github.com/foo123/Contemplate">Eat me on GitHub</a></span>' + "\n" + '        ' + "\n" + '        An inline template:' + "\n" + '        <div id="inline">' + str( __i__.data['render_inline'] ) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '                ' + "\n" + '        In the SERVER:' + "\n" + '        <div id="results_server">' + str( __i__.data['render_server'] ) + '</div>' + "\n" + '        ' + "\n" + '        <hr />' + "\n" + '        ' + "\n" + '        In the CLIENT:' + "\n" + '        <div id="results_client"></div>' + "\n" + '        <script>' + "\n" + '            Contemplate.setLocaleStrings({' + "\n" + '                "locale": "γλωσσική περιοχή"' + "\n" + '            });' + "\n" + '            Contemplate.setPlurals({' + "\n" + '                \'item\': null // auto plural' + "\n" + '            });' + "\n" + '' + "\n" + '            /* add the templates */' + "\n" + '            Contemplate.add({' + "\n" + '                \'base\': "./_tpls/base.tpl.html", // load the template from this url using ajax (slower)' + "\n" + '                \'demo\': "./_tpls/demo.tpl.html", // load the template from this url using ajax (slower)' + "\n" + '                "sub" : "#sub_tpl", // load the template from this DOM element' + "\n" + '                \'date\': "./_tpls/date.tpl.html" // load the template from this url using ajax (slower)' + "\n" + '            });' + "\n" + '            Contemplate.addPlugin(\'test\', function(v){' + "\n" + '                if ( v ) return \'Plugin Test value: \' + v;' + "\n" + '                return \'Plugin Test no value given\';' + "\n" + '            });' + "\n" + '            Contemplate.addPlugin(\'print\', function(v){' + "\n" + '                return \'<pre>\' + JSON.stringify(v, null, 4) + \'</pre>\';' + "\n" + '            });' + "\n" + '' + "\n" + '            document.getElementById("results_client").innerHTML = Contemplate.tpl(\'demo\', ' + str( __i__.data['data_client'] ) + ');' + "\n" + '        </script>' + "\n" + '    ' + "\n" + '    </body>' + "\n" + '' + "\n" + '</html>'
                
                # tpl main render code ends here

            self.data = None
            return __p__
    
    return Contemplate_main_Cached

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']
