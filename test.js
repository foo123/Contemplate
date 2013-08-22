/*
*  Simple light-weight templating engine
*  @author: Nikos M.  http://nikos-web-development.netai.net/
*
*  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
*  http://ejohn.org/blog/javascript-micro-templating/
*
*  Contemplate Test.js for Node.js server configuration
*/

var http=require('http'), url=require('url'), path=require('path'), fs=require('fs');
// it is globally-scoped as in browser: global.Contemplate
require(__dirname + '/src/js/Contemplate.js');


var $sepleft="<%", $sepright="%>";

// works inside Nodejs
Contemplate.isNodeJs(true, fs);
// set the template separators
Contemplate.setTemplateSeparators($sepleft, $sepright);
// make sure it exists
Contemplate.setCacheDir(__dirname + '/_tplcache');
// dynamically update the cached template if original template has changed
Contemplate.setCacheMode(Contemplate.CACHE_TO_DISK_AUTOUPDATE);
// add templates
Contemplate.add({
    'main' : __dirname + '/_tpls/main.tpl.html',
    'base' : __dirname + '/_tpls/base.tpl.html',
    'demo' : __dirname + '/_tpls/demo.tpl.html',
    'sub' : __dirname + '/_tpls/sub.tpl.html',
    'date' : __dirname + '/_tpls/date.tpl.html'
});

// the data to be used by the templates
var $data={
    'users':[
        [ 
            {'name':'u1', 'text':'text1', 'id':'id1'},
            {'name':'u2', 'text':'text2', 'id':'id2'},
            {'name':'u3', 'text':'text3', 'id':'id3'}
        ],
        [ 
            {'name':'u4', 'text':'text4', 'id':'id4'},
            {'name':'u5', 'text':'text5', 'id':'id5'},
            {'name':'u6', 'text':'text6', 'id':'id6'}
        ]
    ],
    'table_data':{
        'column1':[1,2,3],
        'column2':[4,5,6],
        'column3':[7,8,9]
    },
    'table_options':{'header':true},
    'select_data':{
        'group1':{1:'label 1',2:'label 2',3:'label 3'},
        'group2':{4:'label 4',5:'label 5',6:'label 6'},
        'group3':{7:'label 7',8:'label 8',9:'label 9'}
    },
    'select_options':{
        'optgroups':['group1', 'group2', 'group3'],
        'selected':3,
        'multiple':false,
        'style':'width:200px;'
    }
};

var $main_template_data={
    'templates':{
        'sub':Contemplate.getTemplateContents('sub'),
    },
    'sepleft':$sepleft,
    'sepright':$sepright,
    'data_client':JSON.stringify($data),
    'render_server':Contemplate.tpl('demo', $data)
};

// create a node http server to serve the rendered templates
http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

  // return the main page
  if ('/'==uri) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(Contemplate.tpl('main', $main_template_data));
    return;
  }
  
  // handle css/js/other file requests
  path.exists(filename, function(exists) {
    if(!exists) {
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write("404 Not Found\n");
          response.end();
          return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(1337);

console.log('Application Started on http://localhost:1337/');
