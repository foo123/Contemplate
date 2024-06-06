/**
*  Contemplate
*  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
*
*  https://github.com/foo123/Contemplate
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
*  Test
*
* IMPORTANT: Only for local testing purposes. This file should not be publicly accessible as it can enable outsiders to access local files.
* See https://github.com/foo123/Contemplate/issues/7
**/

//  run as: node test.js

var http = require('http'), httpPort = 8002,
    url = require('url'),
    path = require('path'), fs = require('fs'),
    Exists = fs.exists, //path.exists,
    Read = fs.readFile,
    echo = console.log,
    Contemplate = require(path.join(__dirname, '../../src/js/Contemplate.js'))
;

Contemplate.addPlugin('plg_test', function(v) {
    if (v) return 'Plugin Test value: ' + v;
    return 'Plugin Test no value given';
});
Contemplate.addPlugin('plg_print', function(v) {
    return '<pre>' + JSON.stringify(v, null, 4) + '</pre>';
});
global.bracket = function(v)
{
    return '[[' + v + ']]';
}
Contemplate.addPlugin('inlinedBracket', Contemplate.inline('bracket($0)',{'$0':0},false));

// make sure it exists
Contemplate.setCacheDir(path.join(__dirname, '/_tplcache'));

// dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);

// add templates
var TPLS = {
    'main' : path.join(__dirname, '/_tpls/main.tpl.html'),
    'base' : path.join(__dirname, '/_tpls/base.tpl.html'),
    'demo' : path.join(__dirname, '/_tpls/demo.tpl.html'),
    'sub' : path.join(__dirname, '/_tpls/sub.tpl.html'),
    'date' : path.join(__dirname, '/_tpls/date.tpl.html'),
    // add an inline template
    'inlinetpl' : ['<% super("block") %><% for($list as $l=>$item) %> <% $l %> <% $item %><br /><% endfor %>']
};
/*Contemplate.add(TPLS);*/
Contemplate.setTemplateFinder(function(tpl, cb) {
    // can be sync or async operation depending if callback cb is provided
    // handle accordingly
    if (Object.prototype.hasOwnProperty.call(TPLS, tpl))
    {
        if ('function' === typeof cb) return cb(TPLS[tpl]);
        else return TPLS[tpl];
    }
    else
    {
        if ('function' === typeof cb) return cb(null);
        else return null;
    }
});

/*console.log(Contemplate.parseTpl( '<% %for($list as $l=>$item) %> <% $l %> <% $item %><br /><% %endfor() %>' ));*/

// the data to be used by the templates
var
    $listdata = { 'list' : ['item1', 'item2', 'item3'] },

    $data = {
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
        'table_data' : {
            'column1' : [1,2,3],
            'column2' : [4,5,6],
            'column3' : [7,8,9]
        },
        'table_options' : {'header':true},
        'select_data' : {
            'group1' : {1:'label 1',2:'label 2',3:'label 3'},
            'group2' : {4:'label 4',5:'label 5',6:'label 6'},
            'group3' : {7:'label 7',8:'label 8',9:'label 9'}
        },
        'select_options' : {
            'optgroups' : ['group1', 'group2', 'group3'],
            'selected' : 3,
            'multiple' : false,
            'style' : 'width:200px;'
        }
    },

    $main_template_data={
        'templates' : {
            'base' : Contemplate.getTemplateContents('base'),
            'demo' : Contemplate.getTemplateContents('demo'),
            'sub' : Contemplate.getTemplateContents('sub'),
            'date' : Contemplate.getTemplateContents('date')
        },
        'contemplate_version': Contemplate.VERSION,
        //'sepleft' : $sepleft,
        //'sepright' : $sepright,
        'data_client' : JSON.stringify($data),
        'render_server' : Contemplate.tpl('demo', $data),
        'render_inline' : Contemplate.tpl('inlinetpl', $listdata, {separators:'<% %>'})
    }
;

// create a node http server to serve the rendered templates
http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname, filename = '';

    // return the main page
    if ('/'==uri || ''==uri) {
        // async operation promise-based
        Contemplate.tplPromise('main', $main_template_data).then(function(content) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(content);
        }).catch(function(err){
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end(err.toString());
        });
        return;
    }

    // handle css/js/other file requests
    filename = path.join(process.cwd(), uri);
    fs.stat(filename, function(err, stat) {
        if(err || !stat) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (stat.isDirectory()) filename += '/index.html';

        Read(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err.toString() + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(httpPort);

echo('Application Started on http://localhost:' + httpPort + '/');
echo('Contemplate VERSION is: ' + Contemplate.VERSION);
