# -*- coding: UTF-8 -*-
##
#  Contemplate
#  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
#
#  @version 0.8.3
#  https://github.com/foo123/Contemplate
#
#  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
#  http://ejohn.org/blog/javascript-micro-templating/
#
##

# needed imports
import os, sys, re, time, datetime, calendar, codecs

# http://docs.python.org/2/library/collections.html#collections.OrderedDict
# http://code.activestate.com/recipes/576693/
#try:
#    import collections.OrderedDict
#    ODict = collections.OrderedDict
#except ImportError:
#    ODict = dict

ODict = dict

#try:
#    # Python 3.x
#    import html
#    __htmlent__ = html
#    __ENT_COMPAT__ = False
    
        

#except ImportError:
# Python 2.x
import cgi

# http://www.php2python.com/wiki/function.htmlentities/
def htmlentities(s, mode='ENT_COMPAT'):
    mode = True if 'ENT_COMPAT' == mode else False
    return cgi.escape(s, mode).encode('ascii', 'xmlcharrefreplace').decode('ascii')
    

try:
    # Python 3.x
    import urllib.parse
    
    # http://www.php2python.com/wiki/function.urlencode/
    def urlencode(s):
        return urllib.parse.quote_plus(s)
    
    # http://www.php2python.com/wiki/function.stripslashes/
    # http://tech.7starsea.com/post/203
    # static
    def stripslashes(s):
        return codecs.decode(s, 'unicode_escape')
        
except ImportError:
    # Python 2.x
    import urllib
    
    # http://www.php2python.com/wiki/function.urlencode/
    def urlencode(s):
        return urllib.quote_plus(s)
    
    # http://www.php2python.com/wiki/function.stripslashes/
    # static
    def stripslashes(s):
        return s.decode('string_escape')

    

# (protected) global properties
class _G:

    isInited = False
    cacheDir = './'
    cacheMode = 0
    cache = {}
    templates = {}
    partials = {}
    locale = {}
    plurals = {}

    leftTplSep = "<%"
    rightTplSep = "%>"
    preserveLinesDefault = "' + \"\\n\" + '"
    preserveLines = ''
    escape = True
    EOL = "\n"
    TEOL = os.linesep
    tplStart = ''
    tplEnd = ''
    tplPrefixCode = ''

    pad = "    "
    level = 0
    loops = 0
    ifs = 0
    loopifs = 0
    
    allblocks = None 
    allblockscnt = None  
    openblocks = None
    startblock = None 
    endblock = None 
    blockptr = -1
    locals = None 
    variables = None
    strings = None
    currentblock = None
    
    extends = None
    id = 0
    funcId = 0
    stack = None
    uuid = 0

    NEWLINE = re.compile(r'\n\r|\r\n|\n|\r')
    SQUOTE = re.compile(r"'")
    NL = re.compile(r'\n')

    UNDERL = re.compile(r'[\W]+')
    ALPHA = re.compile(r'^[a-zA-Z_]')
    NUM = re.compile(r'^[0-9]')
    ALPHANUM = re.compile(r'^[a-zA-Z0-9_]')
    SPACE = re.compile(r'^\s')
    
    date_words = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    TT_ClassCode = None

    TT_BlockCode = None 
    TT_BLOCK = None

    TT_IF = None 
    TT_ELSEIF = None 
    TT_ELSE = None 
    TT_ENDIF = None

    TT_FOR1 = None
    TT_FOR2 = None 
    TT_ELSEFOR = None
    TT_ENDFOR = None

    TT_FUNC = None
    TT_RCODE = None
    
    re_plugin = re.compile(r'^(plg_|plugin_)([a-zA-Z0-9_]+)')
    re_controls = re.compile(r'(\t|[ ]?)[ ]*%([a-zA-Z_][a-zA-Z0-9_]*)\b[ ]*(\()(.*)$')
    
    controlConstructs = [
        'set', 'unset', 'isset',
        'if', 'elseif', 'else', 'endif',
        'for', 'elsefor', 'endfor',
        'extends', 'block', 'endblock',
        'include'
    ]

    funcs = [
        's', 'n', 'f', 'q', 'dq', 
        'echo', 'time', 'count',
        'lowercase', 'uppercase', 'ucfirst', 'lcfirst', 'sprintf',
        'date', 'ldate', 'locale', 'pluralise',
        'inline', 'tpl', 'uuid', 'haskey',
        'concat', 'ltrim', 'rtrim', 'trim', 'addslashes', 'stripslashes',
        'camelcase', 'snakecase', 
        'e','html', 'url',
        'htmlselect', 'htmltable'
    ]
    func_aliases = {
        'l': 'locale',
        'now': 'time',
        'template': 'tpl'
    }

    plugins = {}
    

#
#  Auxilliary methods 
# (mostly methods to simulate php-like functionality needed by the engine)
#
# static
def include( filename, classname, doReload=False ):
    # http://www.php2python.com/wiki/function.include/
    # http://docs.python.org/dev/3.0/whatsnew/3.0.html
    # http://stackoverflow.com/questions/4821104/python-dynamic-instantiation-from-string-name-of-a-class-in-dynamically-imported
    
    #_locals_ = {'Contemplate': Contemplate}
    #_globals_ = {'Contemplate': Contemplate}
    #if 'execfile' in globals():
    #    # Python 2.x
    #    execfile(filename, _globals_, _locals_)
    #    return _locals_[classname]
    #else:
    #    # Python 3.x
    #    exec(Contemplate.read(filename), _globals_, _locals_)
    #    return _locals_[classname]
    
    # http://docs.python.org/2/library/imp.html
    # http://docs.python.org/2/library/functions.html#__import__
    # http://docs.python.org/3/library/functions.html#__import__
    # http://stackoverflow.com/questions/301134/dynamic-module-import-in-python
    # http://stackoverflow.com/questions/11108628/python-dynamic-from-import
    # also: http://code.activestate.com/recipes/473888-lazy-module-imports/
    # using import instead of execfile, usually takes advantage of Python cached compiled code
    
    global _G
    getTplClass = None
    directory = _G.cacheDir
    # add the dynamic import path to sys
    os.sys.path.append(directory)
    currentcwd = os.getcwd()
    os.chdir(directory)   # change working directory so we know import will work
    
    if os.path.exists(filename):
        
        modname = filename[:-3]  # remove .py extension
        mod = __import__(modname)
        if doReload: reload(mod) # Might be out of date
        # a trick in-order to pass the Contemplate super-class in a cross-module way
        getTplClass = getattr( mod, '__getTplClass__' )
    
    # restore current dir
    os.chdir(currentcwd)
    # remove the dynamic import path from sys
    del os.sys.path[-1]
    
    # return the tplClass if found
    if getTplClass:  return getTplClass(Contemplate)
    return None

# static
def createFunction( funcName, args, sourceCode, additional_symbols=dict() ):
    # http://code.activestate.com/recipes/550804-create-a-restricted-python-function-from-a-string/

    # The list of symbols that are included by default in the generated
    # function's environment
    SAFE_SYMBOLS = [
        "list", "dict", "enumerate", "tuple", "set", "long", "float", "object",
        "bool", "callable", "True", "False", "dir",
        "frozenset", "getattr", "hasattr", "abs", "cmp", "complex",
        "divmod", "id", "pow", "round", "slice", "vars",
        "hash", "hex", "int", "isinstance", "issubclass", "len",
        "map", "filter", "max", "min", "oct", "chr", "ord", "range",
        "reduce", "repr", "str", "type", "zip", "xrange", "None",
        "Exception", "KeyboardInterrupt"
    ]
    
    # Also add the standard exceptions
    __bi = __builtins__
    if type(__bi) is not dict:
        __bi = __bi.__dict__
    for k in __bi:
        if k.endswith("Error") or k.endswith("Warning"):
            SAFE_SYMBOLS.append(k)
    del __bi
    
    # Include the sourcecode as the code of a function funcName:
    s = "def " + funcName + "(%s):\n" % args
    s += sourceCode # this should be already properly padded

    # Byte-compilation (optional)
    byteCode = compile(s, "<string>", 'exec')  

    # Setup the local and global dictionaries of the execution
    # environment for __TheFunction__
    bis   = dict() # builtins
    globs = dict()
    locs  = dict()

    # Setup a standard-compatible python environment
    bis["locals"]  = lambda: locs
    bis["globals"] = lambda: globs
    globs["__builtins__"] = bis
    globs["__name__"] = "SUBENV"
    globs["__doc__"] = sourceCode

    # Determine how the __builtins__ dictionary should be accessed
    if type(__builtins__) is dict:
        bi_dict = __builtins__
    else:
        bi_dict = __builtins__.__dict__

    # Include the safe symbols
    for k in SAFE_SYMBOLS:
        
        # try from current locals
        try:
          locs[k] = locals()[k]
          continue
        except KeyError:
          pass
        
        # Try from globals
        try:
          globs[k] = globals()[k]
          continue
        except KeyError:
          pass
        
        # Try from builtins
        try:
          bis[k] = bi_dict[k]
        except KeyError:
          # Symbol not available anywhere: silently ignored
          pass

    # Include the symbols added by the caller, in the globals dictionary
    globs.update(additional_symbols)

    # Finally execute the Function statement:
    eval(byteCode, globs, locs)
    
    # As a result, the function is defined as the item funcName
    # in the locals dictionary
    fct = locs[funcName]
    # Attach the function to the globals so that it can be recursive
    del locs[funcName]
    globs[funcName] = fct
    
    # Attach the actual source code to the docstring
    fct.__doc__ = sourceCode
    
    # return the compiled function object
    return fct



# can use inline templates for plugins etc.. to enable non-linear plugin compile-time replacement
class InlineTemplate:
 
    def multisplit( tpl, reps=dict(), as_array=False ): 
    
        #as_array = isinstance(reps, (list,tuple))
        a = [ [1, tpl] ]
        items = enumerate(reps) if as_array else reps.items()
        for r,s in items:
        
            c = [ ]
            sr = s if as_array else r
            s = [ 0, s ]
            for ai in a:
            
                if 1 == ai[0]:
                
                    b = ai[1].split( sr ) 
                    bl = len(b)
                    c.append([1, b[0]])
                    
                    if bl > 1:
                    
                        for j in range(bl-1):
                            c.append(s)
                            c.append([1, b[j+1]])
                    
                    
                
                else:
                
                    c.append(ai)
                
            
            a = c
        
        return a
    
    def multisplit_re( tpl, rex ):
        a = [ ]
        i = 0
        m = rex.search(tpl, i)
        while m:
            a.append([1, tpl[i:m.start()]])
            try:
                mg = m.group(1)
            except:
                mg = m.group(0)
            a.append([0, mg])
            i = m.end()
            m = rex.search(tpl, i)
        a.append([1, tpl[i:]])
        return a
    
    def compile( tpl ): 
        global _G
        l = len(tpl)
        out = 'return ('
        for s in tpl:
        
            notIsSub = s[ 0 ] 
            s = s[ 1 ]
            if notIsSub: out += "'" + re.sub(_G.NEWLINE, "' + \"\\n\" + '", re.sub(_G.SQUOTE, "\\'", s)) + "'"
            else: out += " + str(args['" + s + "']) + "
        
        out += ')'
        _G.funcId += 1
        funcName = '_contemplateInlineFn' + str(_G.funcId)
        return createFunction(funcName, 'args', '    ' + out,{})
    
    def __init__( self, tpl='', replacements=None, compiled=False ): 
    
        if not replacements: replacements = {}
        self.id = None
        self._renderer = None
        self.tpl = InlineTemplate.multisplit( tpl, replacements )
        if compiled is True:
            self._renderer = InlineTemplate.compile( self.tpl )
    
    def __del__( self ):
        self.dispose()

    def dispose( self ): 
    
        self.id = None
        self.tpl = None
        self._renderer = None
        return self
    
    def render( self, args=None ): 
    
        if not args: args = []
        if self._renderer is not None: 
            return self._renderer( args )
        
        tpl = self.tpl
        out = ''
        for s in tpl:
        
            notIsSub = s[ 0 ] 
            s = s[ 1 ]
            out += str(s) if notIsSub else str(args[ s ])
        
        return out
    

    
class Template:
    
    def __init__( self, id=None ):
        self._renderer = None
        self._extends = None
        self._blocks = None
        self.id = None
        if id is not None: self.id = id 
    
    def __del__( self ):
        self.dispose()

    def dispose( self ):
        self._renderer = None
        self._extends = None
        self._blocks = None
        self.id = None
        return self
    
    def setId( self, id=None ):
        if id is not None: self.id = id
        return self
    
    def extend( self, tpl ): 
        if tpl and isinstance(tpl, str):
            self._extends = Contemplate.tpl( tpl )
        elif isinstance(tpl, Template):
            self._extends = tpl
        else:
            self._extends = None
        return self
    
    def setBlocks( self, blocks ): 
        if not self._blocks: self._blocks = {} 
        self._blocks = Contemplate.merge(self._blocks, blocks)
        return self
    
    def setRenderFunction( self, renderFunc=None ): 
        if renderFunc: self._renderer = renderFunc
        else: self._renderer = None
        return self
    
    def renderBlock( self, block, data, __i__=None ):
        if not __i__: __i__ = self
        if (self._blocks) and (block in self._blocks):
            blockfunc = self._blocks[block]
            return blockfunc(data, __i__)
        elif self._extends:
            return self._extends.renderBlock(block, data, __i__)
        return ''
        
    def render( self, data, __i__=None ):
        if not __i__: __i__ = self
        __p__ = ''
        if self._extends:  
            __p__ = self._extends.render(data, __i__)
        
        elif self._renderer is not None: 
            # dynamic function
            renderer = self._renderer
            __p__ = renderer(data, __i__)
        
        return __p__
    

# static
def resetState( ):
    # reset state
    global _G
    _G.loops = 0 
    _G.ifs = 0 
    _G.loopifs = 0
    
    _G.allblocks = []
    _G.allblockscnt = {}
    _G.openblocks = [[None, -1]]
    
    _G.extends = None
    _G.level = 0
    _G.id = 0
    
    _G.locals = {} 
    _G.variables = {} 
    _G.currentblock = '_'
    if not _G.currentblock in _G.locals: _G.locals[_G.currentblock] = {}
    if not _G.currentblock in _G.variables: _G.variables[_G.currentblock] = {}
    
    #_G.funcId = 0


def clearState( ):
    # clear state
    global _G

    _G.loops = 0 
    _G.ifs = 0 
    _G.loopifs = 0
    
    _G.allblocks = []
    _G.allblockscnt = {}
    _G.openblocks = [[None, -1]]
    
    #_G.extends = None
    _G.level = 0
    
    _G.locals = None 
    _G.variables = None 
    _G.currentblock = None
    
    _G.id = 0
    _G.stack = []
    _G.strings = None
    #_G.funcId = 0


# static
def pushState( ):
    # push state
    global _G
    _G.stack.append([_G.loops, _G.ifs, _G.loopifs, _G.level,
    _G.allblocks, _G.allblockscnt, _G.openblocks,  _G.extends, _G.locals, _G.variables, _G.currentblock])


# static
def popState( ):
    # pop state
    global _G
    t = _G.stack.pop()
    _G.loops = t[0] 
    _G.ifs = t[1] 
    _G.loopifs = t[2] 
    _G.level = t[3]
    
    _G.allblocks = t[4]
    _G.allblockscnt = t[5]
    _G.openblocks = t[6]
    
    _G.extends = t[7]
    
    _G.locals = t[8] 
    _G.variables = t[9] 
    _G.currentblock = t[10]


# static
def padLines( lines, level=None ):
    global _G
    if level is None:  level = _G.level
    
    if level >= 0:
        pad = _G.pad * level
        lines = pad + ((_G.TEOL + pad).join( re.split(_G.NEWLINE, lines) ))
    
    return lines


def getSeparators( text, separators=None ):
    global _G
    if separators:
        seps = separators.strip( ).split( " " )
        _G.leftTplSep = seps[ 0 ].strip( )
        _G.rightTplSep = seps[ 1 ].strip( )
    else:
        # tpl separators are defined on 1st (non-empty) line of tpl content
        lines = text.split( "\n" )
        while  len(lines)>0 and 0 == len( lines[ 0 ].strip() ): lines.pop( 0 )
        if len(lines):
            seps = lines.pop( 0 ).strip( ).split( " " )
            _G.leftTplSep = seps[ 0 ].strip( )
            _G.rightTplSep = seps[ 1 ].strip( )
        
        text = "\n".join( lines )
    return text
    

#
# Control structures
#

# whether var is set
def t_isset( varname ):
    return '("' + varname + '__RAW__" in data)'
        
# set/create/update tpl var
def t_set( args ):
    global _G
    args = args.split(',')
    varname = args.pop(0).strip()
    expr = ','.join(args).strip()
    return "';" + _G.TEOL + padLines( varname + ' = ('+ expr +')' ) + _G.TEOL

# unset/remove/delete tpl var
def t_unset( varname=None ):
    global _G
    if varname:
        varname = str(varname).strip()
        return "';" + _G.TEOL + padLines( 'if ("'+varname+'__RAW__" in data): del ' + varname ) + _G.TEOL
    return "'; " + _G.TEOL
    
# if
# static
def t_if( cond='False' ):
    global _G
    out = "'" + padLines( _G.TT_IF({
            "EOL":  _G.TEOL,
            'IFCOND': cond
        }) )
    _G.ifs += 1
    _G.level += 1
    
    return out
    
# elseif    
# static
def t_elseif( cond='False' ):
    global _G
    _G.level -= 1
    out = "'" + padLines( _G.TT_ELSEIF({
            "EOL":  _G.TEOL,
            'ELIFCOND': cond
        }) )
    _G.level += 1
    
    return out
    
# else
# static
def t_else( args='' ):
    global _G
    _G.level -= 1
    out = "'" + padLines( _G.TT_ELSE({ 
        "EOL":  _G.TEOL
    }) )
    _G.level += 1
    
    return out

# endif
# static
def t_endif( args='' ):
    global _G
    _G.ifs -= 1
    _G.level -= 1
    out = "'" + padLines( _G.TT_ENDIF({ 
        "EOL":  _G.TEOL
    }) )
    
    return out
    
# for, foreach
# static
def t_for( for_expr ):
    global _G
    
    is_php_style = for_expr.find(' as ')
    is_python_style = for_expr.find(' in ')
    
    if -1 < is_python_style:
        for_expr = [for_expr[0:is_python_style], for_expr[is_python_style+4:]]
        o = for_expr[1].strip()
        kv = for_expr[0].split(',')
    else: #if -1 < is_php_style
        for_expr = [for_expr[0:is_php_style], for_expr[is_php_style+4:]]
        o = for_expr[0].strip()
        kv = for_expr[1].split('=>')
    
    _G.id += 1
    _o = '_loc_' + str(_G.id)
    isAssoc = (len(kv) >= 2)
    
    if isAssoc:
        k = kv[0].strip()
        v = kv[1].strip()
        _G.id += 1
        _oI = '_loc_' + str(_G.id)
        
        _G.locals[_G.currentblock][_G.variables[_G.currentblock][k]] = 1
        _G.locals[_G.currentblock][_G.variables[_G.currentblock][v]] = 1
        out = "'" + padLines( _G.TT_FOR2({
            "EOL":  _G.TEOL,
            'O': o, '_O': _o, '_OI': _oI, 
            'K': k, 'V': v
            #,'ASSIGN1': '',
            #'ASSIGN2': ''
        }) )
        _G.level += 2
    
    else:
        v = kv[0].strip()
        _G.id += 1
        _oV = '_loc_' + str(_G.id)
        
        _G.locals[_G.currentblock][_G.variables[_G.currentblock][v]] = 1
        out = "'" + padLines( _G.TT_FOR1({
            "EOL":  _G.TEOL,
            'O': o, '_O': _o, '_OV': _oV, 
            'V': v
            #,'ASSIGN1': ''
        }) )
        _G.level += 2
    
    _G.loops += 1  
    _G.loopifs += 1
    
    return out

# elsefor
# static
def t_elsefor( args='' ):
    # else attached to  for loop
    global _G
    _G.loopifs -= 1
    _G.level += -2
    out = "'" + padLines( _G.TT_ELSEFOR({ 
        "EOL":  _G.TEOL
    }) )
    _G.level += 1
    
    return out
    
# endfor
# static
def t_endfor( args='' ):
    global _G
    if _G.loopifs == _G.loops:
        _G.loops -= 1 
        _G.loopifs -= 1
        _G.level += -2
        out = "'" + padLines( _G.TT_ENDFOR({ 
            "EOL":  _G.TEOL
        }) )
    else:
        _G.loops -= 1
        _G.level += -1
        out = "'" + padLines( _G.TT_ENDFOR({ 
            "EOL":  _G.TEOL
        }) )
    
    return out

# include file
# static
def t_include( id ):
    global _G
    id = id.strip()
    if _G.strings and (id in _G.strings): id = _G.strings[id]
    ch = id[0]
    if '"' == ch or "'" == ch: id = id[1:-1] # quoted id
    
    # cache it
    if id not in _G.partials:
        pushState()
        resetState()
        _G.partials[id] = " " + parse(getSeparators( Contemplate.getTemplateContents(id) ), False) + "'" + _G.TEOL
        popState()
    
    return padLines( _G.partials[id] )

# extend another template
# static
def t_extends( id ):
    global _G
    id = id.strip()
    if _G.strings and (id in _G.strings): id = _G.strings[id]
    ch = id[0]
    if '"' == ch or "'" == ch: id = id[1:-1] # quoted id
    
    _G.extends = id
    return "'" + _G.TEOL
    
# define (overridable) block
# static
def t_block( block ):
    global _G
    block = block.strip()
    if _G.strings and (block in _G.strings): block = _G.strings[block]
    ch = block[0]
    if '"' == ch or "'" == ch: block = block[1:-1] # quoted block
    
    _G.allblocks.append( [block, -1, -1, 0, _G.openblocks[ 0 ][ 1 ]] )
    if block in _G.allblockscnt: _G.allblockscnt[ block ] += 1
    else: _G.allblockscnt[ block ] = 1
    _G.blockptr = len( _G.allblocks )
    _G.openblocks[:0] = [[block, _G.blockptr-1]]
    _G.startblock = block
    _G.endblock = None
    return "' +  #|" + block + "|#"
    
# end define (overridable) block
# static
def t_endblock( args='' ):
    global _G
    if  1 < len(_G.openblocks):
        block = _G.openblocks.pop( 0 )
        _G.endblock = block[ 0 ]
        _G.blockptr = block[ 1 ]+1
        _G.startblock = None
        return "#|/" + block[0] + "|#"
    return ''


#
# auxilliary parsing methods
#

# static
def merge( m, *args ): 
    numargs = len(args)
    if numargs < 1: return m
    
    merged = m
    
    for arg in args:
        # http://www.php2python.com/wiki/function.array-merge/
        merged = ODict(merged)
        merged.update(arg)
    
    return merged

# static
def split( s, leftTplSep, rightTplSep ):
    global _G
    parts1 = s.split( leftTplSep )
    l = len(parts1)
    parts = []
    for i in range(l):
        tmp = parts1[i].split( rightTplSep )
        parts.append ( tmp[0] )
        if len(tmp) > 1: parts.append ( tmp[1] )
    
    return parts


# static
def parseConstructs( match ):
    global _G
    re_controls = _G.re_controls
    prefix = match.group(1)
    ctrl = match.group(2) 
    startParen = match.group(3)
    rest = match.group(4)
    out = ''
    args = ''
    paren = 1 
    l = len(rest)
    i = 0
    
    # parse parentheses and arguments, accurately
    while i < l and paren > 0:
    
        ch = rest[i]
        i += 1
        if '(' == ch: paren += 1
        elif ')' == ch: paren -= 1
        if paren > 0: args += ch
    
    rest = rest[len(args)+1:]
    
    try:
        m = _G.controlConstructs.index( ctrl )
    except:
        m = -1
    if m > -1:
        if 0==m: # set
            args = re.sub(re_controls, parseConstructs, args)
            out = t_set(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 1==m: # unset
            args = re.sub(re_controls, parseConstructs, args)
            out = t_unset(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 2==m: # isset
            args = re.sub(re_controls, parseConstructs, args)
            out = t_isset(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 3==m: # if
            args = re.sub(re_controls, parseConstructs, args)
            out = t_if(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 4==m: # elseif
            args = re.sub(re_controls, parseConstructs, args)
            out = t_elseif(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 5==m: # else
            out = t_else(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 6==m: # endif
            out = t_endif(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 7==m: # for
            args = re.sub(re_controls, parseConstructs, args)
            out = t_for(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 8==m: # elsefor
            out = t_elsefor(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 9==m: # endfor
            out = t_endfor(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 10==m: # extends
            out = t_extends(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 11==m: # block
            out = t_block(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 12==m: # endblock
            out = t_endblock(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
        
        elif 13==m: # include
            out = t_include(args)
            rest = re.sub(re_controls, parseConstructs, rest)
            return out + rest
    
    if ctrl in _G.func_aliases:
        ctrl = _G.func_aliases[ctrl]
    try:
        m = _G.funcs.index( ctrl )
    except:
        m = -1
    if m > -1:
        args = re.sub(re_controls, parseConstructs, args)
        # aliases and builtin functions
        if 0 ==m or 5 == m:
            out = 'str(' + args + ')'
        elif 1==m:
            out = 'int(' + args + ')'
        elif 2==m:
            out = 'float(' + args + ')'
        elif 3==m:
            out = '"\'"+str(' + args + ')+"\'"'
        elif 4==m:
            out = '\'"\'+str(' + args + ')+\'"\''
        elif 6==m:
            out = 'Contemplate.time()'
        elif 7==m:
            out = 'Contemplate.count(' + args + ')'
        elif 8==m:
            out = 'str(' + args + ').lower()'
        elif 9==m:
            out = 'str(' + args + ').upper()'
        elif 10==m:
            out = 'Contemplate.ucfirst(' + args + ')'
        elif 11==m:
            out = 'Contemplate.lcfirst(' + args + ')'
        elif 12==m:
            out = 'Contemplate.sprintf(' + args + ')'
        else:
            out = 'Contemplate.' + ctrl + '(' + args + ')'
        rest = re.sub(re_controls, parseConstructs, rest)
        return prefix + out + rest
    
    m = _G.re_plugin.match( ctrl )
    if m:
        plugin = m.group(2) 
        if plugin and plugin in _G.plugins:
            pl = _G.plugins[plugin]
            args = re.sub(re_controls, parseConstructs, args)
            if isinstance(pl,Contemplate.InlineTemplate):
                out = pl.render() + '(' + args + ')'
            else: 
                out = pl + '(' + args + ')'
            rest = re.sub(re_controls, parseConstructs, rest)
            return prefix + out + rest
    
    return match.group(0)


# static
def parseBlocks( s ):
    global _G
    blocks = [] 
    bl = len(_G.allblocks)
    
    while bl:
        bl -= 1
        delims = _G.allblocks[ bl ]
        
        block = delims[ 0 ]
        pos1 = delims[ 1 ]
        pos2 = delims[ 2 ]
        off = delims[ 3 ]
        containerblock = delims[ 4 ]
        tag = "#|" + block + "|#"
        rep = "__i__.renderBlock('" + block + "', data) "
        tl = len(tag) 
        rl = len(rep)
        
        if -1 < containerblock:
            # adjust the ending position of the container block (if nested)
            # to compensate for the replacements in this (nested) block
            _G.allblocks[ containerblock ][ 3 ] += rl - (pos2-pos1+1)
        
        # adjust the ending position of this block (if nested)
        # to compensate for the replacements of any (nested) block(s)
        pos2 += off
        
        if 1 == _G.allblockscnt[ block ]:
        
            # 1st occurance, block definition
            blocks.append([ block, _G.TT_BLOCK({
                    "EOL":  _G.TEOL,
                    'BLOCKCODE': s[pos1+tl:pos2-tl-1] + "'"
                })])
        
        s = s[0:pos1] + rep + s[pos2+1:]
        if 1 <= _G.allblockscnt[ block ]: _G.allblockscnt[ block ] -= 1
    
    #_G.allblocks = None 
    #_G.allblockscnt = None 
    #_G.openblocks = None
    
    return [ s, blocks ]


def parseVariable( s, i, l ):
    global _G
    
    if ( _G.ALPHA.match(s[i]) ):
    
        strings = {}
        variables = []
        space = 0
        hasStrings = False
        
        # main variable
        variable = s[i]
        i += 1
        while ( i < l and _G.ALPHANUM.match(s[i]) ):
        
            variable += s[i]
            i += 1
        
        
        variable_raw = variable
        # transform into tpl variable
        variable_main = "data['" + variable_raw + "']"
        variable_rest = ""
        _G.id += 1
        id = "#VAR"+str(_G.id)+"#"
        _len = len(variable_raw)
        
        # extra space
        space = 0
        while ( i < l and _G.SPACE.match(s[i]) ):
        
            space += 1
            i += 1
        
        
        bracketcnt = 0
        
        # optional properties
        while ( i < l and ('.' == s[i] or '[' == s[i]) ):
        
            delim = s[i]
            i += 1
            
            # extra space
            while ( i < l and _G.SPACE.match(s[i]) ):
            
                space += 1
                i += 1
            
        
            # alpha-numeric dot property
            if ( '.' == delim ):
            
                # property
                property = ''
                while ( i < l and _G.ALPHANUM.match(s[i]) ):
                
                    property += s[i]
                    i += 1
                
                lp = len(property)
                if ( lp ):
                
                    # transform into tpl variable bracketed property
                    variable_rest += "['" + property + "']"
                    _len += space + 1 + lp
                    space = 0
                
                else:
                
                    break
                
            
            
            # bracketed property
            elif ( '[' == delim ):
            
                bracketcnt += 1
                
                ch = s[i]
                
                # literal string property
                if ( '"' == ch or "'" == ch ):
                
                    #property = parseString( s, ch, i+1, l )
                    q = ch
                    str_ = q
                    escaped = False
                    si = i+1
                    while si < l:
                        ch = s[si]
                        si += 1
                        str_ += ch
                        if ( q == ch and not escaped ):  break
                        escaped = (not escaped and '\\' == ch)
                    property = str_
                    _G.id += 1
                    strid = "#STR"+str(_G.id)+"#"
                    strings[strid] = property
                    variable_rest += delim + strid
                    lp = len(property)
                    i += lp
                    _len += space + 1 + lp
                    space = 0
                    hasStrings = True
                
                
                # numeric array property
                elif ( _G.NUM.match(ch) ):
                
                    property = s[i]
                    i += 1
                    while ( i < l and _G.NUM.match(s[i]) ):
                    
                        property += s[i]
                        i += 1
                    
                    variable_rest += delim + property
                    lp = len(property)
                    _len += space + 1 + lp
                    space = 0
                
                
                # sub-variable property
                elif ( '$' == ch ):
                
                    sub = s[i+1:]
                    subvariables = parseVariable(sub, 0, len(sub));
                    if ( subvariables ):
                    
                        # transform into tpl variable property
                        property = subvariables[-1]
                        variable_rest += delim + property[0]
                        lp = property[4]
                        i += lp + 1
                        _len += space + 2 + lp
                        space = 0
                        variables = variables + subvariables
                        hasStrings = hasStrings or property[5]
                    
                
                
                # close bracket
                elif ( ']' == ch ):
                
                    if ( bracketcnt > 0 ):
                    
                        bracketcnt -= 1
                        variable_rest += delim + s[i]
                        i += 1
                        _len += space + 2
                        space = 0
                    
                    else:
                    
                        break
                    
                
                
                else:
                
                    break
                
                
                
                # extra space
                while ( i < l and _G.SPACE.match(s[i]) ):
                
                    space += 1
                    i += 1
                
        
                # close bracket
                if ( ']' == s[i] ):
                
                    if ( bracketcnt > 0 ):
                    
                        bracketcnt -= 1
                        variable_rest += s[i]
                        i += 1
                        _len += space + 1
                        space = 0
                    
                    else:
                    
                        break
                    
                
            
            
            # extra space
            while ( i < l and _G.SPACE.match(s[i]) ):
            
                space += 1
                i += 1
            
        
        
        variables.append( [id, variable_raw, variable_main, variable_rest, _len, hasStrings, strings] )
        return variables
    
    return None

str_re = re.compile(r'#STR\d+#', re.M|re.S)

# static
def parse( tpl, withblocks=True ):
    global _G
    global str_re
    
    parts = split( tpl, _G.leftTplSep, _G.rightTplSep )
    re_controls = _G.re_controls
    l = len(parts)
    isTag = False
    parsed = ''
    
    for i in range(l):
        s = parts[i]
        
        if isTag:
            
            # parse each template tag section accurately
            # refined parsing
            count = len( s )
            index = 0
            ch = ''
            out = ''
            variables = []
            strings = {}
            hasVariables = False
            hasStrings = False
            hasBlock = False
            space = 0
            
            while ( index < count ):
            
                ch = s[index]
                index  += 1
                
                # parse mainly literal strings and variables
                
                # literal string
                if ( '"' == ch or "'" == ch ):
                
                    if space > 0:
                        out += " "
                        space = 0
                    #tok = parseString(s, ch, index, count)
                    q = ch
                    str_ = q
                    escaped = False
                    si = index
                    while si < count:
                        ch = s[si]
                        si += 1
                        str_ += ch
                        if ( q == ch and not escaped ):  break
                        escaped = (not escaped and '\\' == ch)
                    tok = str_
                    _G.id += 1
                    id = "#STR"+str(_G.id)+"#"
                    strings[id] = tok
                    out += id
                    index += len(tok)-1
                    hasStrings = True
                
                # variable
                elif ( '$' == ch ):
                
                    if space > 0:
                        out += " "
                        space = 0
                    tok = parseVariable(s, index, count)
                    if tok:
                    
                        for tokv in tok:
                            id = tokv[ 0 ]
                            _G.variables[_G.currentblock][ id ] = tokv[ 1 ]
                            if tokv[ 6 ]: strings.update(tokv[ 6 ])
                        out += id
                        index += tokv[ 4 ]
                        variables = variables + tok
                        hasVariables = True
                        hasStrings = hasStrings or tokv[ 6 ]
                    
                    else:
                    
                        out += '$'
                    
                
                # special chars
                elif ( "\n" == ch or "\r" == ch or "\t" == ch or "\v" == ch ):
                
                    space += 1
                
                
                # rest, bypass
                else:
                
                    if space > 0:
                        out += " "
                        space = 0
                    out += ch
                
            
            # fix literal data notation python-style
            out = out.replace('true', 'True').replace('false', 'False').replace('null', 'None').replace('&&', ' and ').replace(' || ', ' or ').replace('!', ' not ')
            
            tag = "\t" + out + "\v"
                
            _G.startblock = None  
            _G.endblock = None 
            _G.blockptr = -1
            _G.strings = strings
            
            # replace constructs, functions, etc..
            tag = re.sub(re_controls, parseConstructs, tag)
            
            # check for blocks
            if _G.startblock:
                _G.startblock = "#|"+_G.startblock+"|#"
                hasBlock = True
            elif _G.endblock:
                _G.endblock = "#|/"+_G.endblock+"|#"
                hasBlock = True
            notFoundBlock = hasBlock
            
            # replacements
            if "\t" == tag[0] and "\v" == tag[-1]: 
                tag = "' + str("+tag[1:-1]+") + '"
            
            if hasVariables:
                # replace variables
                for v in reversed(variables):
                    id = v[0]
                    varname = v[1]
                    tag = tag.replace( id+'__RAW__', varname )
                    if varname in _G.locals[_G.currentblock]: # local (loop) variable
                        tag = tag.replace( id, '_loc_'+varname+v[3] )
                    else: # default (data) variable
                        tag = tag.replace( id, v[2]+v[3] )
            
            
            if hasStrings:
                # replace strings (accurately)
                tagTpl = Contemplate.InlineTemplate.multisplit_re(tag, str_re)
                tag = ''
                for v in tagTpl:
                    if v[0]:
                        # and replace blocks (accurately)
                        if notFoundBlock:
                            if _G.startblock:
                                blockTag = v[1].find( _G.startblock )
                                if -1 != blockTag:
                                    _G.allblocks[ _G.blockptr-1 ][ 1 ] = blockTag + len(parsed) + len(tag)
                                    notFoundBlock = False
                            else: #if _G.endblock:
                                blockTag = v[1].find( _G.endblock )
                                if -1 != blockTag:
                                    _G.allblocks[ _G.blockptr-1 ][ 2 ] = blockTag + len(parsed) + len(tag) + len(_G.endblock)
                                    notFoundBlock = False
                        tag += v[1]
                    else:
                        tag += strings[ v[1] ]
            elif hasBlock:
                # replace blocks (accurately)
                if _G.startblock:
                    _G.allblocks[ _G.blockptr-1 ][ 1 ] = len(parsed) + tag.find( _G.startblock )
                else: #if _G.endblock:
                    _G.allblocks[ _G.blockptr-1 ][ 2 ] = len(parsed) + tag.find( _G.endblock ) + len(_G.endblock)
            
            
            # replace tpl separators
            if "\v" == tag[-1]: 
                tag = tag[0:-1] + padLines(_G.tplEnd)
            if "\t" == tag[0]: 
                tag = _G.tplStart + tag[1:]
                if hasBlock:
                    # update blocks (accurately)
                    blockTag = len(_G.tplStart)-1
                    if _G.startblock:
                        _G.allblocks[ _G.blockptr-1 ][ 1 ] += blockTag
                    else: #if _G.endblock:
                        _G.allblocks[ _G.blockptr-1 ][ 2 ] += blockTag
                    
            
            s = tag
            
            isTag = False
            
        else:
            
            if _G.escape:
                s = s.replace( "\\", "\\\\" )  # escape escapes
                
            s = s.replace( "'", "\\'" )  # escape single quotes accurately (used by parse function)
            
            s = s.replace( "\n", _G.preserveLines ) # preserve lines
            #s = re.sub(_G.NL, _G.preserveLines, s) # preserve lines
            
            isTag = True
        
        parsed += s
    
    if False != withblocks: 
        return parseBlocks(parsed) if len(_G.allblocks)>0 else [parsed, []]
    
    return parsed

# static
def getCachedTemplateName( id ):
    global _G
    return re.sub(_G.UNDERL, '_', id) + '_tpl' + '.py'

# static
def getCachedTemplateClass( id ):
    global _G
    return 'Contemplate_' + re.sub(_G.UNDERL, '_', id) + '_Cached'

# static
def createTemplateRenderFunction( id, seps=None ):
    global _G
    resetState()
    
    blocks = parse(getSeparators( Contemplate.getTemplateContents(id), seps ))
    
    clearState()
    
    renderf = blocks[0]
    blocks = blocks[1]
    
    if _G.extends:
        func = _G.TT_FUNC({
            "EOL":  _G.TEOL,
            'FCODE': ""
        })
    
    else:
        func = _G.TT_FUNC({
                "EOL":  _G.TEOL,
                'FCODE': "__p__ += '" + renderf + "'"
            })
    
    _G.funcId += 1
    
    funcName = '_contemplateFn' + str(_G.funcId)
    fn = createFunction(funcName, 'data,__i__', padLines(func, 1), {'Contemplate': Contemplate})
    
    blockfns = {}
    for b in blocks:
        funcName = '_contemplateBlockFn_' + b[0] + '_' + str(_G.funcId)
        blockfns[b] = createFunction(funcName, 'data,__i__', padLines(b[1], 1), {'Contemplate': Contemplate})
    
    return [ fn, blockfns]

# static
def createCachedTemplate( id, filename, classname, seps=None ):
    global _G
    resetState()
    
    blocks = parse(getSeparators( Contemplate.getTemplateContents(id), seps ))
    
    clearState()
    
    renderf = blocks[0]
    blocks = blocks[1]
    
    # tpl-defined blocks
    sblocks = ''
    for b in blocks:
        sblocks += _G.TEOL + _G.TT_BlockCode({
                    "EOL":  _G.TEOL,
                    'BLOCKNAME': b[0],
                    'BLOCKMETHODNAME': "_blockfn_"+b[0],
                    'BLOCKMETHODCODE': padLines(b[1], 1)
                })
    
    # tpl render code
    if _G.extends:
        extendCode = "self.extend('"+_G.extends+"')"
        renderCode = _G.TT_RCODE({
            "EOL":  _G.TEOL,
            'RCODE': "__p__ = ''" 
        })
    
    else:
        extendCode = ''
        renderCode = _G.TT_RCODE({
                    "EOL":  _G.TEOL,
                    'RCODE': "__p__ += '" + renderf + "'" 
                })
    
    if _G.tplPrefixCode: prefixCode = _G.tplPrefixCode
    else: prefixCode = ''
        
    # generate tpl class
    classCode = _G.TT_ClassCode({
                "EOL":  _G.TEOL,
                'PREFIXCODE': prefixCode,
                'IMPORTS': '',
                'TPLID': id,
                'CLASSNAME': classname,
                'EXTENDCODE': padLines(extendCode, 3),
                'BLOCKS': padLines(sblocks, 2),
                'RENDERCODE': padLines(renderCode, 4)
            })
    
    return Contemplate.write(filename, classCode)

# static
def getCachedTemplate( id, options=dict() ):
    global _G
    # inline templates saved only in-memory
    if id in _G.templates:
        template = _G.templates[id]
        # inline templates saved only in-memory
        if template[1]:
            # dynamic in-memory caching during page-request
            tpl = Contemplate.Template()
            tpl.setId( id )
            
            if 'parsed' in options:
                _G.funcId += 1
                tpl.setRenderFunction( createFunction('_contemplateFn' + str(_G.funcId), 'data,__i__', padLines(options['parsed'], 1), {'Contemplate': Contemplate}) )
            else:
                fns = createTemplateRenderFunction(id, options['separators'])
                tpl.setRenderFunction( fns[0] )
                tpl.setBlocks( fns[1] )
            
            if _G.extends: tpl.extend( Contemplate.tpl(_G.extends) )
            return tpl
        
        CM = _G.cacheMode
        
        if True != options['autoUpdate'] and CM == Contemplate.CACHE_TO_DISK_NOUPDATE:
        
            cachedTplFile = getCachedTemplateName(id)
            cachedTplPath = os.path.join(_G.cacheDir, cachedTplFile)
            cachedTplClass = getCachedTemplateClass(id)
            if not os.path.isfile(cachedTplPath):
                # if not exist, create it
                createCachedTemplate(id, cachedTplPath, cachedTplClass, options['separators'])
            if os.path.isfile(cachedTplPath):
                tpl = include(cachedTplFile, cachedTplClass)()
                tpl.setId( id )
                return tpl
            return None

        
        elif True == options['autoUpdate'] or CM == Contemplate.CACHE_TO_DISK_AUTOUPDATE:
        
            cachedTplFile = getCachedTemplateName(id)
            cachedTplPath = os.path.join(_G.cacheDir, cachedTplFile)
            cachedTplClass = getCachedTemplateClass(id)
            if not os.path.isfile(cachedTplPath) or (os.path.getmtime(cachedTplPath) <= os.path.getmtime(template[0])):
                # if tpl not exist or is out-of-sync (re-)create it
                createCachedTemplate(id, cachedTplPath, cachedTplClass, options['separators'])
            if os.path.isfile(cachedTplPath):
                tpl = include(cachedTplFile, cachedTplClass)()
                tpl.setId( id )
                return tpl
            return None
        
        else:
        
            # dynamic in-memory caching during page-request
            tpl = Contemplate.Template()
            tpl.setId( id )
            fns = createTemplateRenderFunction(id, options['separators'])
            tpl.setRenderFunction( fns[0] )
            tpl.setBlocks( fns[1] )
            if _G.extends: tpl.extend( Contemplate.tpl(_G.extends) )
            return tpl
        
    return None

# static
def setCachedTemplate( filename, tplContents ): 
    return Contemplate.write(filename, tplContents)

# static
def _get_ordinal_suffix( n ):
    # adapted from http://brandonwamboldt.ca/python-php-date-class-335/
    return {1: 'st', 2: 'nd', 3: 'rd'}.get(4 if 10 <= n % 100 < 20 else n % 10, "th")

# static
def _get_php_date( format, time ):
    # http://php.net/manual/en/datetime.formats.date.php
    # http://strftime.org/
    # adapted from http://brandonwamboldt.ca/python-php-date-class-335/
    time  = datetime.datetime.fromtimestamp(time)
    timeStr = ''

    replacements = {}

    """ Day """
    replacements['d'] = str( time.day ).zfill(2)
    replacements['D'] = calendar.day_abbr[ time.weekday() ]
    replacements['j'] = str( time.day )
    replacements['l'] = calendar.day_name[ time.weekday() ]
    replacements['S'] = _get_ordinal_suffix( time.day )
    replacements['w'] = str( time.weekday() )
    replacements['z'] = str( time.timetuple().tm_yday )
    
    """ Week """
    replacements['W'] = str( time.isocalendar()[1] )
    
    """ Month """
    replacements['F'] = calendar.month_name[ time.month ]
    replacements['m'] = str( time.month ).zfill(2)
    replacements['M'] = calendar.month_abbr[ time.month ]
    replacements['n'] = str( time.month )
    replacements['t'] = str( calendar.monthrange(time.year, time.month)[1] )
    
    """ Year """
    replacements['L'] = str(int( calendar.isleap(time.year) ))
    replacements['Y'] = str( time.year )
    replacements['y'] = str( time.year )[2:]
    
    """ Time """
    replacements['a'] = time.strftime("%p").lower()
    replacements['A'] = time.strftime("%p")
    replacements['g'] = str( int(time.strftime("%I")) )
    replacements['G'] = str( int(time.strftime("%H")) )
    replacements['h'] = time.strftime("%I")
    replacements['H'] = time.strftime("%H")
    replacements['i'] = str( time.minute ).zfill(2)
    replacements['s'] = str( time.second ).zfill(2)
    replacements['u'] = str( time.microsecond )
    
    """ Timezone """
    replacements['e'] = "" #_self.get_timezone()
    replacements['I'] = str( time.dst() )
    
    #for regex, replace in replacements.items():
    #    format = format.replace(regex, replace)
    newformat = ''
    for c in format:
        if c in replacements:
            newformat += replacements[c]
        else:
            newformat += c

    return newformat
    
# static
def _localized_date( locale, format, timestamp ):
    global _G
    date = _get_php_date(format, timestamp)
    date_words = _G.date_words
    
    # localize days/months
    for word in date_words: 
        if word in locale: date = date.replace(word, locale[word])
        
    # return localized date
    return date


#
# The Contemplate Engine Main Python Class
#
class Contemplate:
    """
    Contemplate Template Engine for Python,
    https://github.com/foo123/Contemplate
    """
    
    # constants (not real constants in Python)
    VERSION = "0.8.3"
    
    CACHE_TO_DISK_NONE = 0
    CACHE_TO_DISK_AUTOUPDATE = 2
    CACHE_TO_DISK_NOUPDATE = 4
    
    # set file encoding if needed, here (eg 'utf8')
    ENCODING = 'utf-8'
    
    InlineTemplate = InlineTemplate
    Template = Template
    
    #
    #
    #
    
    # static
    def init( ):
        
        global _G
        
        if _G.isInited: return
            
        # pre-compute the needed regular expressions
        _G.preserveLines = _G.preserveLinesDefault
        
        _G.tplStart = "' " + _G.TEOL
        _G.tplEnd = _G.TEOL + "__p__ += '"
        
        # make compilation templates
        _G.TT_ClassCode = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            "# -*- coding: UTF-8 -*-"
            ,"# Contemplate cached template '#TPLID#'"
            ,"#PREFIXCODE#"
            ,"# imports start here, if any"
            ,"#IMPORTS#"
            ,"# imports end here"
            ,"def __getTplClass__(Contemplate):"
            ,"    # extends the main Contemplate.Template class"
            ,"    class #CLASSNAME#(Contemplate.Template):"
            ,"        'Contemplate cached template #TPLID#'"
            ,""
            ,"        # constructor"
            ,"        def __init__(self, id=None):"
            ,"            # initialize internal vars"
            ,"            self._renderer = None"
            ,"            self._extends = None"
            ,"            self._blocks = None"
            ,"            self.id = None"
            ,"            self.id = id"
            ,"            "
            ,"            # extend tpl assign code starts here"
            ,"#EXTENDCODE#"
            ,"            # extend tpl assign code ends here"
            ,""
            ,"        # tpl-defined blocks render code starts here"
            ,"#BLOCKS#"
            ,"        # tpl-defined blocks render code ends here"
            ,""
            ,"        # render a tpl block method"
            ,"        def renderBlock(self, block, data, __i__=None):"
            ,"            if not __i__: __i__ = self"
            ,"            method = '_blockfn_' + block"
            ,"            if (hasattr(self, method) and callable(getattr(self, method))):"
            ,"                return getattr(self, method)(data, __i__)"
            ,"            elif self._extends:"
            ,"                return self._extends.renderBlock(block, data, __i__)"
            ,"            return ''"
            ,"            "
            ,"        # tpl render method"
            ,"        def render(self, data, __i__=None):"
            ,"            if  not __i__: __i__ = self"
            ,"            __p__ = ''"
            ,"            if self._extends:"
            ,"                __p__ = self._extends.render(data, __i__)"
            ,""
            ,"            else:"
            ,"                # tpl main render code starts here"
            ,"#RENDERCODE#"
            ,"                # tpl main render code ends here"
            ,""
            ,"            return __p__"
            ,"    "
            ,"    return #CLASSNAME#"
            ,""
            ,"# allow to 'import *'  from this file as a module"
            ,"__all__ = ['__getTplClass__']"
            ,""
        ]), {
             "#EOL#":           "EOL"
            ,"#PREFIXCODE#":    "PREFIXCODE"
            ,"#IMPORTS#":       "IMPORTS"
            ,"#CLASSNAME#":     "CLASSNAME"
            ,"#TPLID#":         "TPLID"
            ,"#BLOCKS#":        "BLOCKS"
            ,"#EXTENDCODE#":    "EXTENDCODE"
            ,"#RENDERCODE#":    "RENDERCODE"
        }))
        
        _G.TT_BlockCode = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"# tpl block render method for block '#BLOCKNAME#'"
            ,"def #BLOCKMETHODNAME#(self, data, __i__):"
            ,"#BLOCKMETHODCODE#"
            ,""
        ]), {
             "#EOL#":               "EOL"
            ,"#BLOCKNAME#":         "BLOCKNAME"
            ,"#BLOCKMETHODNAME#":   "BLOCKMETHODNAME"
            ,"#BLOCKMETHODCODE#":   "BLOCKMETHODCODE"
        }))

        _G.TT_BLOCK = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"__p__ = ''"
            ,"#BLOCKCODE#"
            ,"return __p__"
            ,""
        ]), {
             "#EOL#":       "EOL"
            ,"#BLOCKCODE#": "BLOCKCODE"
        }))

            
        _G.TT_IF = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"if (#IFCOND#):"
            ,""
        ]), {
             "#EOL#":       "EOL"
            ,"#IFCOND#":    "IFCOND"
        }))
            
        _G.TT_ELSEIF = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"elif (#ELIFCOND#):"
            ,""
        ]), {
             "#EOL#":       "EOL"
            ,"#ELIFCOND#":  "ELIFCOND"
        }))

        _G.TT_ELSE = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"else:"
            ,""
        ]), {
            "#EOL#":               "EOL"
        }))
            
        _G.TT_ENDIF = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            "",""
        ]), {
            "#EOL#":               "EOL"
        }))
            
        # a = [51,27,13,56]   dict(enumerate(a))
        _G.TT_FOR2 = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"#_O# = #O#"
            ,"#_OI# = (enumerate(#_O#) if isinstance(#_O#,(list, tuple)) else #_O#.items()) if #_O# else None"
            ,"if (#_OI#):"
            ,"    for #K#,#V# in #_OI#:"
            ,""
        ]), {
             "#EOL#":   "EOL"
            ,"#O#":     "O"
            ,"#_O#":    "_O"
            ,"#_OI#":    "_OI"
            ,"#K#":     "K"
            ,"#V#":     "V"
        }))
        _G.TT_FOR1 = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"#_O# = #O#"
            ,"#_OV# = (#_O# if isinstance(#_O#,(list, tuple)) else #_O#.values()) if #_O# else None"
            ,"if (#_OV#):"
            ,"    for #V# in #_OV#:"
            ,""
        ]), {
             "#EOL#":   "EOL"
            ,"#O#":     "O"
            ,"#_O#":    "_O"
            ,"#_OV#":    "_OV"
            ,"#V#":     "V"
        }))
            
        _G.TT_ELSEFOR = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"else:"
            ,""
        ]), {
             "#EOL#":               "EOL"
        }))
            
        _G.TT_ENDFOR = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            "",""
        ]), {
             "#EOL#":               "EOL"
        }))
            
        _G.TT_FUNC = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"__p__ = ''"
            ,"#FCODE#"
            ,"return __p__"
            ,""
        ]), {
             "#EOL#":    "EOL"
            ,"#FCODE#":  "FCODE"
        }))

        _G.TT_RCODE = InlineTemplate.compile(InlineTemplate.multisplit('#EOL#'.join([
            ""
            ,"#RCODE#"
            ,""
        ]), {
             "#EOL#":    "EOL"
            ,"#RCODE#":  "RCODE"
        }))
        
        clearState()
        
        _G.isInited = True
    
    #
    # Main template static methods
    #
    
    # add custom plugins as template functions
    def addPlugin( name, pluginCode ):
        global _G
        name = str(name)
        if isinstance(pluginCode, Contemplate.InlineTemplate):
            _G.plugins[ name ] = pluginCode
        else:
            _G.plugins[ name ] = 'Contemplate.plg_' + name
            setattr(Contemplate, 'plg_' + name, pluginCode)
    
    # static
    def setPrefixCode( preCode=None ):
        global _G
        if preCode:
            _G.tplPrefixCode = str(preCode)
    
    # static
    def setLocaleStrings( l ): 
        global _G
        _G.locale = Contemplate.merge(_G.locale, l)
    
    # static
    def clearLocaleStrings( ): 
        global _G
        _G.locale = {}
    
    # static
    def setPlurals( plurals ): 
        global _G
        for singular in plurals:
            if plurals[ singular ] is None: 
                # auto plural
                plurals[ singular ] = str(singular) + 's'
        _G.plurals = Contemplate.merge(_G.plurals, plurals)
    
    # static
    def clearPlurals( ): 
        global _G
        _G.plurals = {}
    
    # static
    def setTemplateSeparators( seps=None ):
        global _G
        if seps:
            if 'left' in seps: _G.leftTplSep = str(seps['left'])
            if 'right' in seps: _G.rightTplSep = str(seps['right'])
    
    # static
    def setPreserveLines( enable=True ): 
        global _G
        if enable:  
            _G.preserveLines = _G.preserveLinesDefault
        else: 
            _G.preserveLines = ''
    
    # static
    def setCacheDir( dir ): 
        global _G
        _self = Contemplate
        _dir = _G.cacheDir = os.path.abspath(dir)
        
        initPyFile = os.path.join(_dir, '__init__.py')
        if not os.path.exists( initPyFile ):
            _initPy_ = """\
# added by Contemplate.py Engine
# dummy Python __init__.py file
# used with Contemplate 'import'
# to include cached templates as modules, for optimization
"""
            _self.write(initPyFile, _initPy_)
            
        #if _dir not in os.sys.path:
        #    # allow to use 'import' in order to include cached templates
        #    os.sys.path.append(_dir)

    
    # static
    def setCacheMode( mode ): 
        global _G
        _G.cacheMode = mode
    
    # static
    def clearCache( all=False ): 
        global _G
        _G.cache = {}
        if all: _G.partials = {}
    
    # add templates manually
    # static
    def add( tpls, tplStr=None ):
        global _G
        if isinstance(tpls, dict):
            for tplID in tpls:
                if isinstance(tpls[ tplID ], (list, tuple)):
                    # unified way to add tpls both as reference and inline
                    # inline tpl, passed as array
                    if len( tpls[ tplID ][ 0 ] ):
                        _G.templates[ tplID ] = [tpls[ tplID ][ 0 ], True]
                else:
                    _G.templates[ tplID ] = [tpls[ tplID ], False]
                    
        elif tpls and tplStr:
            if isinstance(tplStr, (list, tuple)):
                # unified way to add tpls both as reference and inline
                # inline tpl, passed as array
                if len( tplStr[ 0 ] ):
                    _G.templates[ tpls ] = [tplStr[ 0 ], True]
            else:
                _G.templates[tpls] = [tplStr, False]
    
    def parseTpl( tpl, options=dict() ):
        global _G
        
        separators = options['separators'] if options and ('separators' in options) else None
        
        if separators:
            tmp = [_G.leftTplSep, _G.rightTplSep]
            _G.leftTplSep = separators[ 0 ]  
            _G.rightTplSep = separators[ 1 ]
        
        resetState()
        parsed = parse( tpl )
        clearState()
        
        if separators:
            _G.leftTplSep = tmp[ 0 ]
            _G.rightTplSep = tmp[ 1 ]
        
        return parsed
        
    #
    # Basic template functions
    #
    
    # return the requested template (with optional data)
    # static
    def tpl( tpl, data=None, options=None ):
        global _G
        
        if isinstance(tpl, Contemplate.Template):
            # Provide some basic currying to the user
            if isinstance(data, dict): return str(tpl.render( data ))
            else: return tpl
        
        if not options: options = {}
        options = merge({
            'autoUpdate': False, 
            'refresh': False, 
            'escape': False,
            'separators': None
        }, options)
        
        if False == options['escape']: _G.escape = False
        else: _G.escape = True
        
        # Figure out if we're getting a template, or if we need to
        # load the template - and be sure to cache the result.
        if options['refresh'] or not (tpl in _G.cache): 
            
            _G.cache[ tpl ] = getCachedTemplate( tpl, options )
        
        tmpl = _G.cache[ tpl ]
        
        # Provide some basic currying to the user
        if isinstance(data, dict): return str(tmpl.render( data ))
        else: return tmpl
    
    # inline tpls, both inside Contemplate templates (i.e as parameters) and in code
    def inline( tpl, reps=None, compiled=False ):
        if isinstance(tpl, Contemplate.InlineTemplate): return str(tpl.render( reps ))
        return Contemplate.InlineTemplate( tpl, reps, compiled )
    
        
    # check if (nested) keys exist in tpl variable
    def haskey( v, *args ):
        if not v or not (isinstance(v, list) or isinstance(v, dict)): return False
        argslen = len(args)
        tmp = v
        for i in range(argslen):
        
            if args[i] not in tmp: return False
            tmp = tmp[args[i]]
        
        return True
        
    # basic custom faster html escaping
    # static
    def e( s ):
        return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace('\'', '&#39;')
    
    # basic html escaping
    # static
    def html( s, mode='ENT_COMPAT' ):
        return htmlentities(s, mode)
    
    # basic url escaping
    # static
    def url( s ):
        return urlencode(s)
    
    # count items in array/list or object/dict
    # static
    def count( a ):
        # http://www.php2python.com/wiki/function.count/
        return len(a)
    
    # http://www.php2python.com/wiki/function.addslashes/
    # static
    def addslashes( s ):
        l = ["\\", '"', "'", "\0", ]
        s = str(s)
        for i in l:
            if i in s:  s = s.replace(i, '\\'+i)
        return s

    # http://www.php2python.com/wiki/function.stripslashes/
    # static
    def stripslashes( s ):
        return stripslashes(s) 
    
    # Concatenate strings/vars
    # static
    def concat( *args ):
        return ''.join(args)
        
    # Trim strings in templates
    # static
    def trim( s, charlist=None ):
        return s.strip(charlist) if charlist else s.strip()
    
    # static
    def ltrim( s, charlist=None ):
        return s.lstrip(charlist) if charlist else s.lstrip()
    
    # static
    def rtrim( s, charlist=None ):
        return s.rstrip(charlist) if charlist else s.rstrip()
    
    def ucfirst( s ):
        return s[0].upper() + s[1:]#.lower()
        
    def lcfirst( s ):
        return s[0].lower() + s[1:]#.upper()
        
    def camelcase( s, sep="_", capitalizeFirst=False ):
        _self = Contemplate
        sep = str(sep)
        if capitalizeFirst:
            return "".join( map( _self.ucfirst, str(s).split( sep ) ) )
        else:
            return _self.lcfirst( "".join( map( _self.ucfirst, str(s).split( sep ) ) ) )
    
    def snakecase( s, sep="_" ):
        sep = str(sep)
        return re.sub( r'([A-Z])', lambda m: sep + m.group(1), str(s) ).lower()
    
    # Sprintf in templates
    # static
    def sprintf( format, *args ):
        numargs = len(args)
        if numargs>0:
            #format = args.pop(0)
            return format % args
        return ''
    
    #
    #  Localization functions
    #
    
    # current time in seconds
    # time, now
    # static
    def time( ):
        return int(time.time())
    
    # formatted date
    # static
    def date( format, time=None ):
        if time is None: time = Contemplate.time() 
        return _get_php_date(format, time)
    
    # localized formatted date
    # static
    def ldate( format, time=None ): 
        global _G
        if time is None: time = Contemplate.time() 
        return _localized_date(_G.locale, format, time)
        
    # locale, l
    # static
    def locale( e ): 
        global _G
        if (e in _G.locale):
            return _G.locale[e]
        else:
            return e
    
    # pluralise
    def pluralise( singular, count ): 
        global _G
        if (singular in _G.plurals):
            if (1 != count): return _G.plurals[singular]
            else: return singular
        return singular
    
    # generate a uuid
    def uuid( namespace='UUID' ):
        global _G
        _G.uuid += 1
        return '_'.join( [ str(namespace), str(_G.uuid), str(int(time.time())) ] )
    
    #
    #  HTML elements
    #
    
    # html table
    # static
    def htmltable( data, options={} ):
        _self = Contemplate
        # clone data to avoid mess-ups
        data = _self.merge({}, data)
        options = _self.merge({}, options)
        
        hasRowTpl = 'tpl_row' in options
        hasCellTpl = 'tpl_cell' in options
        rowTpl = None 
        cellTpl = None
        
        if hasRowTpl:
        
            if not isinstance(options['tpl_row'], Contemplate.InlineTemplate):
                options['tpl_row'] = Contemplate.InlineTemplate(str(options['tpl_row']), {'$row_class':'row_class','$row':'row'})
            rowTpl = options['tpl_row']
        
        if hasCellTpl:
        
            if not isinstance(options['tpl_cell'], Contemplate.InlineTemplate):
                options['tpl_cell'] = Contemplate.InlineTemplate(str(options['tpl_cell']), {'$cell':'cell'})
            cellTpl = options['tpl_cell']
        
            
        o="<table"
        
        if 'id' in options:
            o+=" id='"+str(options['id'])+"'"
        if 'class' in options:
            o+=" class='"+str(options['class'])+"'"
        if 'style' in options:
            o+=" style='"+str(options['style'])+"'"
        if 'data' in options:
            for k,v in options['data'].items():
                o+=" data-"+str(k)+"='"+str(v)+"'"
            
        o+=">"
            
        tk=''
        if ('header' in options) or ('footer' in options):
            tk="<td>"+'</td><td>'.join(data.keys())+"</td>"
            
        header=''
        if ('header' in options) and options['header']:
            header="<thead><tr>"+tk+"</tr></thead>"
            
        footer='';
        if ('footer' in options) and options['footer']:
            footer="<tfoot><tr>"+tk+"</tr></tfoot>"
        
        o+=header
        
        # get data rows
        vals=data.values()
        
        maxCol=0
        for i,col in  enumerate(vals):
            
            if not isinstance(col, list):  l=1
            else: l=len(col)
            
            if l>maxCol: maxCol=l
            
            
            
        rows={}
        for i,col in enumerate(vals):
        
            if not isinstance(col, list): colvals=[col]
            else: colvals=col[:]
            l=len(colvals)
            
            for j in range(l):
            
                if j not in rows: rows[j]=[''] * maxCol
                
                rows[j][i]=str(colvals[j])
        
        
        if 'odd' in options:
            class_odd=str(options['odd'])
        else:
            class_odd='odd'
        if 'even' in options:
            class_even=str(options['even'])
        else:
            class_even='even'
            
        # render rows
        
        odd=False
        l=len(rows)
        for i in range(l):
        
            row_class = class_odd if odd else class_even
            
            if hasCellTpl:
            
                row = ''
                for cell in rows[i]:
                    row += cellTpl.render( {'cell': cell} )
            
            else:
            
                row = "<td>"+("</td><td>".join(rows[i]))+"</td>"
            
            if hasRowTpl:
            
                o += rowTpl.render( {'row_class': row_class, 'row': row} )
            
            else:
            
                o += "<tr class='"+row_class+"'>"+row+"</tr>"
            
            odd = False if odd else True
            
        del rows
        
        o+=footer
        o+="</table>"
        return o
    
    # html select
    # static
    def htmlselect( data, options={} ):
        _self = Contemplate
        # clone data to avoid mess-ups
        data = _self.merge({}, data)
        options = _self.merge({}, options)
        hasOptionTpl = 'tpl_option' in options
        optionTpl = None
            
        if hasOptionTpl:
        
            if not isinstance(options['tpl_option'], Contemplate.InlineTemplate):
                options['tpl_option'] = Contemplate.InlineTemplate(str(options['tpl_option']), {'$selected':'selected','$value':'value','$option':'option'})
            optionTpl = options['tpl_option']
        
            
        o="<select"
        
        if ('multiple' in options) and options['multiple']:
            o+=" multiple"
        if ('disabled' in options) and options['disabled']:
            o+=" disabled='disabled'"
        if 'name' in options:
            o+=" name='"+str(options['name'])+"'"
        if 'id' in options:
            o+=" id='"+str(options['id'])+"'"
        if 'class' in options:
            o+=" class='"+str(options['class'])+"'"
        if 'style' in options:
            o+=" style='"+str(options['style'])+"'"
        if 'data' in options:
            for k,v in options['data'].items():
                o+=" data-"+str(k)+"='"+str(v)+"'"
            
        
        o+=">"
        
        if 'selected' in options:
            if not isinstance(options['selected'], list): options['selected']=[options['selected']]
        else:
            options['selected']=[]
            
        if 'optgroups' in options:
            if not isinstance(options['optgroups'], list): options['optgroups']=[options['optgroups']]
        
    
        for k,v in data.items():
        
            if ('optgroups' in options) and (k in  options['optgroups']):
            
                o+="<optgroup label='"+str(k)+"'>"
                
                v1 = v
                if isinstance(v, str) or isinstance(v, int) or not hasattr(v, '__iter__'):  v1 = [v]
                
                for k2,v2 in ODict(v1).items():
                
                    if 'use_key' in options:  v2=k2
                    elif 'use_value' in options:   k2=v2
                        
                    if hasOptionTpl:
                        o += optionTpl.render({'value': k2,'option': v2,'selected': ' selected="selected"' if k2 in options['selected'] else ''})
                    elif k2 in options['selected']:
                        o += "<option value='"+str(k2)+"' selected='selected'>"+str(v2)+"</option>"
                    else:
                        o += "<option value='"+str(k2)+"'>"+str(v2)+"</option>"
                    
                
                o+="</optgroup>"
            
            else:
            
                if 'use_key' in options: v=k
                elif 'use_value' in options:  k=v
                    
                if hasOptionTpl:
                    o += optionTpl.render({'value': k,'option': v,'selected': ' selected="selected"' if k in options['selected'] else ''})
                elif k in options['selected']:
                    o += "<option value='"+str(k)+"' selected='selected'>"+str(v)+"</option>"
                else:
                    o += "<option value='"+str(k)+"'>"+str(v)+"</option>"
            
        
        o+="</select>"
        return o
    
   # static
    def getTemplateContents( id ):
        global _G
        if id in _G.templates: 
            template = _G.templates[id]
            if template[1]: return template[0] # inline tpl
            elif os.path.exists(template[0]): return Contemplate.read(template[0])
        return ''
    
    def keys( o ):
        if o:
            return range(len(o)) if isinstance(o,(list, tuple)) else o.keys()
        return None
    
    def values( o ):
        if o:
            return o if isinstance(o,(list, tuple)) else o.values()
        return None
        
    def items( o ):
        if o:
            return enumerate(o) if isinstance(o,(list, tuple)) else o.items()
        return None
        
    # static
    def merge( m, *args ): 
        numargs = len(args)
        if numargs < 1: return m
        
        merged = m
        
        for arg in args:
            # http://www.php2python.com/wiki/function.array-merge/
            merged = ODict(merged)
            merged.update(arg)
        
        return merged
    
    # static
    def data( data ):
        if isinstance(data, list):
            # clone the data
            return data[:]
        else:
            # clone the dict
            cdata = ODict()
            
            for key in data.keys():
                newkey = key
                cdata[newkey] = data[key]
            
            return cdata
        
    # static
    def open( file, op ):
        #if Contemplate.ENCODING: 
        #    f = open(file, op, encoding=Contemplate.ENCODING)
        #else: 
        #    f = open(file, op)
        #return f
        return open(file, op, -1, Contemplate.ENCODING)

    # static
    def read( file ):
        buffer=''
        with Contemplate.open(file, 'r') as f:
            buffer = f.read()
        return buffer

    # static
    def write( file, text ):
        with Contemplate.open(file, 'w') as f:
            f.write(text)


# init the engine on load
Contemplate.init()

# if used with 'import *'
__all__ = ['Contemplate']
