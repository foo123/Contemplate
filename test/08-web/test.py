#!/usr/bin/env python
# -*- coding: UTF-8 -*-
##
#  Contemplate
#  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
#
#  https://github.com/foo123/Contemplate
#
#  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
#  http://ejohn.org/blog/javascript-micro-templating/
#
#  Test
#
##

##  run as: python test.py


# Python 3+, a very basic http server that serves files from current dir
# http://docs.python.org/3/library/http.server.html
import os, sys, http.server, socketserver
import pprint

def import_module(name, path):
    import imp
    try:
        mod_fp, mod_path, mod_desc  = imp.find_module(name, [path])
        mod = getattr( imp.load_module(name, mod_fp, mod_path, mod_desc), name )
    except ImportError as exc:
        mod = None
        sys.stderr.write("Error: failed to import module ({})".format(exc))
    finally:
        if mod_fp: mod_fp.close()
    return mod


# import the Contemplate.py engine (as a) module, probably you will want to place this in another dir/package
Contemplate = import_module('Contemplate', os.path.join(os.path.dirname(__file__), '../../src/python/'))
if not Contemplate:
    print ('Could not load the Contemplate Engine Module')
    sys.exit(1)
else:
    print ('Contemplate Engine Module loaded succesfully')

# the test application server url
HOST = "localhost"
PORT = 8003


# do some tests
import json


def test_plugin(v = None):
    if v: return 'Plugin Test value: ' + str(v)
    return 'Plugin Test no value given'

def print_plugin(v = None):
    return '<pre>' + pprint.pformat(v, 4) + '</pre>'

def definition():
    global Contemplate
    def bracketFunc(v):
        return '[[' + str(v) + ']]'
    Contemplate.bracket = bracketFunc
definition()

Contemplate.addPlugin('plg_test', test_plugin)
Contemplate.addPlugin('plg_print', print_plugin)
Contemplate.addPlugin('inlinedBracket', Contemplate.inline('Contemplate.bracket($0)',{'$0':0},False))

# set the cache directory (make sure to exist)
Contemplate.setCacheDir('./_tplcache')

# dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE)

TPLS = {
    'main' : './_tpls/main.tpl.html',
    'base' : './_tpls/base.tpl.html',
    'demo' : './_tpls/demo.tpl.html',
    'sub' : './_tpls/sub.tpl.html',
    'date' : './_tpls/date.tpl.html',
    # add an inline template
    'inlinetpl' : ['<% super("block") %><% for($list as $l=>$item) %> <% $l %> <% $item %><br /><% endfor %>']
}
# add the templates paths
#Contemplate.add(TPLS)
def tplfinder(tpl):
    global TPLS
    return TPLS[tpl] if tpl in TPLS else None
Contemplate.setTemplateFinder(tplfinder)

#print (pprint.pformat(Contemplate.parseTpl( '<% %for($list as $l=>$item) %> <% $l %> <% $item %><br /><% %endfor() %>' ), 4))


# the data to be used by the templates
listdata = {'list' : ['item1', 'item2', 'item3'] }

data = {
    'users' : [
        [
            {'name':'u1', 'text':'text1', 'id':'id1'},
            {'name':'u2', 'text':'text2', 'id':'id2', 'key1':'key1'},
            {'name':'u3', 'text':'text3', 'id':'id3'}
        ],
        [
            {'name':'u4', 'text':'text4', 'id':'id4'},
            {'name':'u5', 'text':'text5', 'id':'id5'},
            {'name':'u6', 'text':'text6', 'id':'id6', 'key':{'key1':'key1'}}
        ]
    ],
    'table_data':{
        'column1' : [1,2,3],
        'column2' : [4,5,6],
        'column3' : [7,8,9]
    },
    'table_options' : {'header':True},
    'select_data' : {
        'group1' : {1:'label 1',2:'label 2',3:'label 3'},
        'group2' : {4:'label 4',5:'label 5',6:'label 6'},
        'group3' : {7:'label 7',8:'label 8',9:'label 9'}
    },
    'select_options' : {
        'optgroups' : ['group1', 'group2', 'group3'],
        'selected' : 3,
        'multiple' : False,
        'style' : 'width:200px;'
    }
}

main_template_data={
    'templates' : {
        'base' : Contemplate.getTemplateContents('base'),
        'demo' : Contemplate.getTemplateContents('demo'),
        'sub' : Contemplate.getTemplateContents('sub'),
        'date' : Contemplate.getTemplateContents('date')
    },
    'contemplate_version': Contemplate.VERSION,
    #'sepleft' : sepleft,
    #'sepright' : sepright,
    'data_client' : json.dumps(data),
    'render_server' : Contemplate.tpl('demo', data),
    'render_inline' : Contemplate.tpl('inlinetpl', listdata, {'separators':'<% %>'})
}

# a simple custom http server
class TestHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        # if the main path is requested
        # load the template and output it
        if  self.path == "/" or self.path == "":
            out = Contemplate.tpl('main', main_template_data)
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.send_header("Content-Length", str(len(out)))
            self.end_headers()
            self.wfile.write(bytes(out, 'UTF-8'))
            return

        filename = os.path.join(os.path.dirname(__file__), self.path[1:] if '/' == self.path[0] else self.path)
        if os.path.exists(filename):
            buffer = ''
            with open(filename, 'rb') as f:
                buffer = f.read()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(buffer)
            return

        # else do the default behavior for other requests
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


# start the server
httpd = socketserver.TCPServer((HOST, PORT), TestHandler)
print("Application Started on http://%s:%d" % (HOST, PORT))
print("Contemplate VERSION is ", Contemplate.VERSION)
httpd.serve_forever()
