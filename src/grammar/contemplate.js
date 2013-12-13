// 1. JSON grammar for Contemplate Engine ( https://github.com/foo123/Contemplate )
// to be used with CodeMirrorGrammar add-on (https://github.com/foo123/codemirror-grammar)
var contemplate_grammar = {
        
        // prefix ID for regular expressions used in the grammar
        "RegExpID" : "RegExp::",
        
        // lists of (simple/string) tokens to be grouped into one regular expression,
        // else matched one by one, 
        // this is usefull for speed fine-tuning the parser
        "RegExpGroups" : {
            "atom" : true,
            "keyword" : "\\b",
            "function" : "\\b",
            "operator" : "\\b",
            "delimiter" : true
        },
            
        //
        // Style model
        "Style" : {
            // lang token type  -> CodeMirror (style) tag
            "error":        "error",
            "comment":      "comment",
            "atom":         "atom",
            "keyword":      "tagContemplate",
            "function":     "tagContemplate",
            "operator":     "operator",
            "delimiter":    "bracket",
            "variable":     "variable",
            "number":       "number",
            "string":       "string"
        },

        
        //
        // Lexical model
        "Lex" : {
            
            // contemplate variables
            "variable" : {
                "type" : "simple",
                "tokens" : "RegExp::\\$[_A-Za-z][_A-Za-z0-9]*"
            },

            // numbers, in order of matching
            "number" : {
                "type" : "simple",
                "tokens" : [
                    // floats
                    "RegExp::\\d*\\.\\d+(e[\\+\\-]?\\d+)?",
                    "RegExp::\\d+\\.\\d*",
                    "RegExp::\\.\\d+",
                    // integers
                    "RegExp::[1-9]\\d*(e[\\+\\-]?\\d+)?",
                    // just zero
                    "RegExp::0(?![\\dx])"
                ]
            },

            // strings
            "string" : {
                "type" : "escaped-block",
                "escape" : "\\",
                // start, end of string (can be the matched regex group ie. 1 )
                "tokens" : [ "RegExp::(['\"])", 1 ]
            },
            
            // operators
            "operator" : {
                "type" : "simple",
                "tokens" : [
                    "+", "-", "*", "/", "%", "<", ">", "!", "=",
                    "=>", "==", "!=", "<=", ">=", "<>", "||", "&&"
                ]
            },
            
            // delimiters
            "delimiter" : {
                "type" : "simple",
                "tokens" : [ 
                    "(", ")", "[", "]"
                ]
            },
            
            // atoms
            "atom" : {
                "type" : "simple",
                "tokens" : [ "true", "false" ]
            },

            // keywords
            "keyword" : {
                "type" : "simple",
                "tokens" : [
                    "%extends", "%block", "%endblock", "%template", "%include",
                    "%if", "%elseif", "%else", "%endif", "%for", "%elsefor",
                    "%endfor", "as"
                ]
            },
                                  
            // builtin functions, constructs, etc..
            "function" : {
                "type" : "simple",
                "tokens" : [
                    "%now", "%date", "%ldate", "%count", "%sprintf",
                    "%trim", "%ltrim", "%rtrim",
                    "%htmltable", "%htmlselect", "%has_key", "%concat",
                    "%s", "%n", "%f", "%l", "%q", "%dq"
                ]
            }
        },
    
        // what to parse and in what order
        "Parser" : [
            "keyword",
            "function",
            "atom",
            "operator",
            "delimiter",
            "number",
            "string",
            "variable"
        ]
};
