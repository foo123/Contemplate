// 1. JSON grammar for Contemplate Engine ( https://github.com/foo123/Contemplate )
// to be used with CodeMirrorGrammar add-on (https://github.com/foo123/codemirror-grammar)
var contemplate_grammar = {
        
        // prefix ID for regular expressions used in the grammar
        "RegExpID" : "RegExp::",
        
        //
        // Style model
        "Style" : {
            // lang token type  -> CodeMirror (style) tag
            "comment":      "comment",
            "atom":         "atom",
            "keyword":      "keyword",
            "function":     "builtin",
            "operator":     "operator",
            "variable":     "variable",
            "property":     "variable",
            "number":       "number",
            "string":       "string"
        },

        
        //
        // Lexical model
        "Lex" : {
            
            // template variables
            "variable" : "RegExp::/\\$[_A-Za-z][_A-Za-z0-9]*/",
            
            // template variables' properties
            "property" : "RegExp::/\\.[_A-Za-z][_A-Za-z0-9]*/",

            // numbers, in order of matching
            "number" : [
                // floats
                "RegExp::/\\d*\\.\\d+(e[\\+\\-]?\\d+)?/",
                "RegExp::/\\d+\\.\\d*/",
                "RegExp::/\\.\\d+/",
                // integers
                "RegExp::/[1-9]\\d*(e[\\+\\-]?\\d+)?/",
                // just zero
                "RegExp::/0(?![\\dx])/"
            ],

            // strings
            "string" : {
                "type" : "escaped-block",
                "escape" : "\\",
                // start, end of string (can be the matched regex group ie. 1 )
                "tokens" : [ "RegExp::/(['\"])/", 1 ]
            },
            
            // operators
            "operator" : [
                "+", "-", "*", "/", "%", "<", ">", "!", 
                "==", "!=", "<=", ">=", "<>", "=", "||", "&&", "|", "&"
            ],
            
            // atoms
            "atom" : [ "true", "false", "null" ],

            // template keywords, directives, constructs, etc..
            "keyword" : [
                "%extends", "%block", "%endblock", "%super", "%getblock", "%include",
                "%if", "%elseif", "%else", "%endif", 
                "%for", "%elsefor", "%endfor", "as", "in",
                "%set", "%unset", "%isset"
            ],
                                  
            // template functions, plugins, aliases, etc..
            "function" : "RegExp::/%[a-zA-Z_][a-zA-Z0-9_]*/"
        },
    
        // what to parse and in what order
        "Parser" : [
            "keyword",
            "function",
            "atom",
            "number",
            "string",
            "variable",
            "property",
            "operator"
        ]
};
