// 1. JSON grammar for Contemplate Engine ( https://github.com/foo123/Contemplate )
// to be used with CodeMirrorGrammar add-on (https://github.com/foo123/codemirror-grammar)
var contemplate_grammar_base = {
        
// prefix ID for regular expressions used in the grammar
"RegExpID"                      : "RE::",

// Style model
"Style"                         : {

     "comment"                  : "comment"
    ,"atom"                     : "atom"
    ,"keyword"                  : "keyword"
    ,"function"                 : "builtin"
    ,"plugin"                   : "variable-2"
    ,"variable"                 : "variable"
    ,"property"                 : "variable"
    ,"number"                   : "number"
    ,"string"                   : "string"

},


// Lexical model
"Lex"                           : {

     "variable"                 : "RE::/\\$[_A-Za-z][_A-Za-z0-9]*/"
    ,"property"                 : "RE::/(?:\\.|->)[_A-Za-z][_A-Za-z0-9]*/"
    ,"number"                   : [
                                // floats
                                "RE::/\\d*\\.\\d+(e[\\+\\-]?\\d+)?/",
                                "RE::/\\d+\\.\\d*/",
                                "RE::/\\.\\d+/",
                                // integers
                                "RE::/[1-9]\\d*(e[\\+\\-]?\\d+)?/",
                                // just zero
                                "RE::/0(?![\\dx])/"
                                ]
    ,"string:escaped-block"     : ["RE::/(['\"])/", 1]
    ,"atom"                     : {"autocomplete":true,"tokens":[
                                "true", "false", "null"
                                ]}
    ,"keyword"                  : null
    ,"function"                 : null
    ,"plugin"                   : null

},

// what to parse and in what order
"Parser"                        : [
                                "keyword",
                                "function",
                                "plugin",
                                "atom",
                                "number",
                                "string",
                                "variable",
                                "property"
                                ]

};

var contemplate_grammar = {
// Lexical model
"Lex"                           : {

     "keyword"                  : {"autocomplete":true,"tokens":[
                                "extends", "block", "endblock", "super", "getblock", "include",
                                "if", "elseif", "elif", "else", "endif", "fi", 
                                "for", "elsefor", "endfor", "as", "in",
                                "set", "unset", "isset", "empty", "iif", "continue", "break", "local_set", "get", "local"
                                ]}
    ,"function"                 : {"autocomplete":true,"tokens":[
                                's', 'n', 'f', 'q', 'qq', 'dq',
                                'cc', 'concat', 'j','join',
                                'time', 'now', 'date',
                                'keys', 'values', 'count',
                                'is_array', 'in_array', 'haskey',
                                'lowercase', 'uppercase',
                                'ltrim', 'rtrim', 'trim',
                                'sprintf', 'vsprintf',
                                'json_encode', 'json_decode',
                                'e', 'striptags',
                                'urlencode', 'urldecode',
                                'queryvar', 'buildquery', 'parsequery',
                                'uuid', 'inline', 'tpl', 'template'
                                ]}
    ,"plugin"                   : "RE::/[a-zA-Z_][a-zA-Z0-9_]*/"

}
};
