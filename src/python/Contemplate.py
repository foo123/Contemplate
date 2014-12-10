# -*- coding: UTF-8 -*-
##
#  Contemplate
#  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
#
#  @version 0.7
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
    
    extends = None
    id = 0
    funcId = 0
    stack = None
    uuid = 0

    NEWLINE = None
    SQUOTE = None
    NL = None

    UNDERL = r'[\W]+'
    ALPHA = r'^[a-zA-Z_]'
    NUM = r'^[0-9]'
    ALPHANUM = r'^[a-zA-Z0-9_]'
    SPACE = r'^\s'
    
    regExps = {
        'specials' : None,
        'replacements' : None,
        'functions' : None,
        'controls' : None,
        'controls2' : None
    }

    controlConstructs = [
        'include', 'template', 
        'extends', 'endblock', 'block',
        'elsefor', 'endfor', 'for',
        'set', 'unset', 'isset',
        'elseif', 'else', 'endif', 'if'
    ]

    funcs = [
        'htmlselect', 'htmltable',
        '(plg_|plugin_)([a-zA-Z0-9_]+)', 'haskey',
        'lowercase', 'uppercase', 'camelcase', 'snakecase', 'pluralise',
        'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 'addslashes', 'stripslashes',
        'inline', 'tpl', 'uuid',
        'html', 'url', 'count', 
        'ldate', 'date', 'now', 'locale',
        'dq', 'q', 'l', 's', 'n', 'f', 'e' 
    ]

    plugins = {}
    


# can use inline templates for plugins etc.. to enable non-linear plugin compile-time replacement
class InlineTemplate:
 
    def multisplit( tpl, reps=dict() ): 
    
        a = [ [1, tpl] ]
        #items = reps.items() if isinstance(reps, dict) else enumerate(reps)
        for r,s in reps.items():
        
            c = [ ]
            s = [ 0, s ]
            for ai in a:
            
                if 1 == ai[0]:
                
                    b = ai[1].split( r ) 
                    bl = len(b)
                    if bl > 1:
                    
                        for j in range(bl-1):
                            c.append([1, b[j]])
                            c.append(s)
                            c.append([1, b[j+1]])
                    
                    else:
                    
                        c.append([1, b[0]])
                    
                
                else:
                
                    c.append(ai)
                
            
            a = c
        
        return a
    
    def compile( tpl ): 
        global _G
        l = len(tpl)
        out = 'return '
        for s in tpl:
        
            notIsSub = s[ 0 ] 
            s = s[ 1 ]
            if notIsSub: out += "'" + re.sub(_G.NEWLINE, "' + \"\\n\" + '", re.sub(_G.SQUOTE, "\\'", s)) + "'"
            else: out += " + str(args['" + s + "']) + "
        
        out += ''
        _G.funcId += 1
        funcName = '_contemplateInlineFn' + str(_G.funcId)
        return createFunction(funcName, 'args', '    ' + out,{})
    
    
    def __init__( self, tpl='', replacements=None, compiled=True ): 
    
        if not replacements: replacements = {}
        self.id = None
        self._renderer = None
        self.tpl = InlineTemplate.multisplit( tpl, replacements )
        if compiled is not False:
            self._renderer = InlineTemplate.compile( self.tpl )
    
    
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
        l = len(tpl)
        argslen = len(args)
        out = [ ]
        for s in tpl:
        
            notIsSub = s[ 0 ] 
            s = s[ 1 ]
            if notIsSub: out.append(str(s))
            #else: out.append( str(args[ s ] if (isinstance(s,str) or s>=0) else args[ argslen+s ]))
            else: out.append( str(args[ s ]) )
        
        return ''.join(out)
    

    
class Template:
    
    def __init__( self, id=None ):
        self.id = None
        self.d = None
        self._renderer = None
        self._extends = None
        self._blocks = None
        
        if id is not None:   
            self.id = id 
    
    def dispose( self ):
        self.id = None
        self.d = None
        self._renderer = None
        self._extends = None
        self._blocks = None
        return self
    
    def setId( self, id=None ):
        if id is not None: self.id = id
        
        return self
    
    def extend( self, tpl ): 
        if tpl and isinstance(tpl, str):
            self._extends = Contemplate.tpl( tpl )
        else:
            self._extends = tpl 
        
        return self
    
    def setBlocks( self, blocks ): 
        if not self._blocks: self._blocks = {} 
        self._blocks = Contemplate.merge(self._blocks, blocks)
        
        return self
    
    def setRenderFunction( self, renderFunc=None ): 
        if renderFunc: self._renderer = renderFunc
        
        return self
    
    def renderBlock( self, block, __i__=None ):
        if ( not __i__ ): __i__ = self
        
        if (self._blocks) and (block in self._blocks):
            blockfunc = self._blocks[block]
            return blockfunc( __i__ )
        
        elif self._extends:
            return self._extends.renderBlock(block, __i__)
        
        return ''
        
    
    def render( self, data, __i__=None ):
        __p__ = ''
        if ( not __i__ ): __i__ = self
        
        if self._extends:  
            __p__ = self._extends.render(data, __i__)
        
        elif self._renderer is not None: 
            # dynamic function
            __i__.d = data
            renderer = self._renderer
            __p__ = renderer( __i__ )
        
        self.d = None
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
    #_G.funcId = 0


# static
def pushState( ):
    # push state
    global _G
    _G.stack.append([_G.loops, _G.ifs, _G.loopifs, _G.level,
    _G.allblocks, _G.allblockscnt, _G.openblocks,  _G.extends])


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


# static
def padLines( lines, level=None ):
    global _G
    if level is None:  level = _G.level
    
    if level >= 0:
        pad = _G.pad * level
        
        lines = re.split(_G.NEWLINE, lines)
        lenlines = len(lines)
        
        for i in range(lenlines):
            lines[i] = pad + lines[i]
        
        lines = _G.TEOL.join(lines)
    
    return lines


def j(*args): # joinLines
    global _G
    return str(_G.TEOL).join( args )
    
            
# generated tpl class code as a heredoc template
def TT_ClassCode( r=None, t=1 ):
    return "".join([
        j("# -*- coding: UTF-8 -*-"
        ,"# Contemplate cached template '"), r['TPLID'], j("'"
        ,""
        ,""), r['PREFIXCODE'], j(""
        ,""
        ,"# imports start here, if any"
        ,""), r['IMPORTS'], j(""
        ,"# imports end here"
        ,""
        ,"def __getTplClass__(Contemplate):"
        ,""
        ,"    # extends the main Contemplate class"
        ,"    class "), r['CLASSNAME'], j("(Contemplate.Template):"
        ,"        'Contemplate cached template "), r['TPLID'], j("'"
        ,""
        ,"        # constructor"
        ,"        def __init__(self, id=None, __=None):"
        ,"            # initialize internal vars"
        ,"            self.id = None "
        ,"            self.d = None" 
        ,"            self._renderer = None"
        ,"            self._extends = None"
        ,"            self._blocks = None"
        ,""
        ,"            self.id = id"
        ,"            "
        ,"            # extend tpl assign code starts here"
        ,""), r['EXTENDCODE'], j(""
        ,"            # extend tpl assign code ends here"
        ,""
        ,""
        ,""
        ,"        # tpl-defined blocks render code starts here"
        ,""), r['BLOCKS'], j(""
        ,"        # tpl-defined blocks render code ends here"
        ,""
        ,"        # render a tpl block method"
        ,"        def renderBlock(self, block, __i__=None):"
        ,"            if ( not __i__ ): __i__ = self"
        ,""
        ,"            method = '_blockfn_' + block"
        ,""
        ,"            if (hasattr(self, method) and callable(getattr(self, method))):"
        ,"                return getattr(self, method)(__i__)"
        ,""
        ,"            elif self._extends:"
        ,"                return self._extends.renderBlock(block, __i__)"
        ,""
        ,"            return ''"
        ,"            "
        ,"        "
        ,"        # tpl render method"
        ,"        def render(self, data, __i__=None):"
        ,"            __p__ = ''"
        ,"            if ( not __i__ ): __i__ = self"
        ,""
        ,"            if self._extends:"
        ,"                __p__ = self._extends.render(data, __i__)"
        ,""
        ,"            else:"
        ,"                # tpl main render code starts here"
        ,""), r['RENDERCODE'], j(""
        ,"                # tpl main render code ends here"
        ,""
        ,"            self.d = None"
        ,"            return __p__"
        ,"    "
        ,"    return "), r['CLASSNAME'], j(""
        ,""
        ,"# allow to 'import *'  from this file as a module"
        ,"__all__ = ['__getTplClass__']"
        ,"")
    ])
    
# generated tpl block method code as a heredoc template
def TT_BlockCode( r=None, t=1 ):
    return "".join([
        j(""
        ,"# tpl block render method for block '"), r['BLOCKNAME'], j("'"
        ,"def "), r['BLOCKMETHODNAME'], j("(self, __i__):"
        ,""), r['BLOCKMETHODCODE'], j(""
        ,"")
    ])


    
# generated IF code
def TT_IF( r=None, t=1 ):
    return "".join([
        j(""
        ,"if ("), r['IFCOND'], j("):"
        ,"")
    ])
    
# generated ELSEIF code
def TT_ELSEIF( r=None, t=1 ):
    return "".join([
        j(""
        ,"elif ("), r['ELIFCOND'], j("):"
        ,"")
    ])

# generated ELSE code
def TT_ELSE( r=None, t=1 ):
    return j(""
        ,"else:"
        ,"")
    
# generated ENDIF code
def TT_ENDIF( r=None, t=1 ):
    return j("","")
    
# a = [51,27,13,56]   dict(enumerate(a))
# generated FOR code
def TT_FOR( r=None, t=2 ):
    if 2 == t:
        return "".join([
            j(""
            ,""), r['_O'], " = Contemplate.items(", r['O'], j(")"
            ,"if ("), r['_O'], j("):"
            ,"    for "), r['_K'], ",", r['_V'], " in ", r['_O'], j(":"
            ,"        "), r['ASSIGN1'], j(""
            ,"        "), r['ASSIGN2'], j(""
            ,"")
        ])
    else:
        return "".join([
            j(""
            ,""), r['_O'], " = Contemplate.values(", r['O'], j(")"
            ,"if ("), r['_O'], j("):"
            ,"    for "), r['_V'], " in ", r['_O'], j(":"
            ,"        "), r['ASSIGN1'], j(""
            ,"")
        ])
    
# generated ELSEFOR code
def TT_ELSEFOR( r=None, t=1 ):
    return j(""
        ,"else:"
        ,"")
    
# generated ENDFOR code
def TT_ENDFOR( r=None, t=1 ):
    if 1 == t:
        return j("","")
    else:
        return j("","")
    
# generated block code snippet
def TT_BLOCK( r=None, t=1 ):
    return "".join([
        j(""
        ,"__p__ = ''"
        ,"data = __i__.d"
        ,""), r['BLOCKCODE'], j(""
        ,"return __p__"
        ,"")
    ])

    
# generated dynamic render code
def TT_FUNC( r=None, t=1 ):
    if 1 == t:
        return "return ''"
    else:
        return "".join([
            j(""
            ,"__p__ = ''"
            ,"data = __i__.d"
            ,""), r['FCODE'], j(""
            ,"return __p__"
            ,"")
        ])


def TT_RCODE( r=None, t=1 ):
    if 1 == t:
        return "__p__ = ''"
    else:
        return "".join([
            j(""
            ,"__i__.d = data"
            ,""), r['RCODE'], j(""
            ,"")
        ])

    
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
    return ' ("' + varname + '__RAW__" in data) '
        
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
    out = "' " + padLines( TT_IF({
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
    out = "' " + padLines( TT_ELSEIF({
            'ELIFCOND': cond
        }) )
    _G.level += 1
    
    return out
    
# else
# static
def t_else( args='' ):
    global _G
    _G.level -= 1
    out = "' " + padLines( TT_ELSE( ) )
    _G.level += 1
    
    return out

# endif
# static
def t_endif( args='' ):
    global _G
    _G.ifs -= 1
    _G.level -= 1
    out = "' " + padLines( TT_ENDIF( ) )
    
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
        _G.id += 1
        _o = '_O' + str(_G.id)
        kv = for_expr[0].split(',')
    else: #if -1 < is_php_style
        for_expr = [for_expr[0:is_php_style], for_expr[is_php_style+4:]]
        o = for_expr[0].strip()
        _G.id += 1
        _o = '_O' + str(_G.id)
        kv = for_expr[1].split('=>')
    isAssoc = (len(kv) >= 2)
    
    if isAssoc:
        k = kv[0].strip() + '__RAW__'
        v = kv[1].strip() + '__RAW__'
        
        _G.id += 1
        _k = '_K' + str(_G.id)
        _G.id += 1
        _v = '_V' + str(_G.id)
        
        out = "' " + padLines( TT_FOR({
            'O': o, '_O': _o, 
            'K': k, '_K': _k,
            'V': v, '_V': _v,
            'ASSIGN1': 'data[\''+k+'\'] = '+_k+'',
            'ASSIGN2': 'data[\''+v+'\'] = '+_v+''
        }, 2) )
        _G.level += 2
    
    else:
        v = kv[0].strip() + '__RAW__'
        
        _G.id += 1
        _v = '_V' + str(_G.id)
        
        out = "' " + padLines( TT_FOR({
            'O': o, '_O': _o, 
            'V': v, '_V': _v,
            'ASSIGN1': 'data[\''+v+'\'] = '+_v+''
        }, 1) )
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
    out = "' " + padLines( TT_ELSEFOR( ) )
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
        out = "' " + padLines( TT_ENDFOR( None, 1 ) )
    else:
        _G.loops -= 1
        _G.level += -1
        out = "' " + padLines( TT_ENDFOR( None, 2 ) )
    
    return out

# include file
# static
def t_include( id ):
    global _G
    # cache it
    if id not in _G.partials:
        pushState()
        resetState()
        _G.partials[id] = " " + parse(getSeparators( Contemplate.getTemplateContents(id) ), False) + "' " + _G.TEOL
        popState()
    
    return padLines( _G.partials[id] )

# include template
# static
def t_template( args ):
    global _G
    args = args.split(',')
    id = args.pop(0).strip()
    obj = ','.join(args)
    return '\' + %tpl( "'+id+'", '+obj+' ) ' + _G.TEOL

# extend another template
# static
def t_extends( tpl ):
    global _G
    _G.extends = tpl.strip( )
    return "' " + _G.TEOL
    
# define (overridable) block
# static
def t_block( block ):
    global _G
    block = block.strip( )
    _G.allblocks.append( [block, -1, -1, 0, _G.openblocks[ 0 ][ 1 ]] )
    if block in _G.allblockscnt: _G.allblockscnt[ block ] += 1
    else: _G.allblockscnt[ block ] = 1
    _G.blockptr = len( _G.allblocks )
    _G.openblocks[:0] = [[block, _G.blockptr-1]]
    _G.startblock = block
    _G.endblock = None
    return "' +  __||" + block + "||__"
    
# end define (overridable) block
# static
def t_endblock( args='' ):
    global _G
    if  1 < len(_G.openblocks):
        block = _G.openblocks.pop( 0 )
        _G.endblock = block[ 0 ]
        _G.blockptr = block[ 1 ]+1
        _G.startblock = None
        return "__||/" + block[0] + "||__"
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
def parseControlConstructs( m ):
    global _G
    ctrl = m.group(1) 
    args = m.group(2)
    
    if ('isset'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_isset(args)
    
    elif ('set'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_set(args)
    
    elif ('unset'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_unset(args)
    
    elif ('if'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_if(args)
    
    elif ('elseif'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_elseif(args)
    
    elif ('else'==ctrl): 
        return t_else(args)
    
    elif ('endif'==ctrl): 
        return t_endif(args)
    
    elif ('for'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_for(args)
    
    elif ('elsefor'==ctrl): 
        return t_elsefor(args)
    
    elif ('endfor'==ctrl): 
        return t_endfor(args)
    
    elif ('template'==ctrl): 
        # constructs in args, eg. isset
        args = re.sub(_G.regExps['controls2'], parseControlConstructs, args)
        return t_template(args)
    
    elif ('extends'==ctrl): 
        return t_extends(args)
    
    elif ('block'==ctrl): 
        return t_block(args)
    
    elif ('endblock'==ctrl): 
        return t_endblock(args)
    
    elif ('include'==ctrl): 
        return t_include(args)
    
    return m.group(0)


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
        tag = "__||" + block + "||__"
        rep = "__i__.renderBlock( '" + block + "' ) "
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
            blocks.append([ block, TT_BLOCK({
                    'BLOCKCODE': s[pos1+tl:pos2-tl-1] + "';"
                })])
        
        s = s[0:pos1] + rep + s[pos2+1:]
        if 1 <= _G.allblockscnt[ block ]: _G.allblockscnt[ block ] -= 1
    
    _G.allblocks = None 
    _G.allblockscnt = None 
    _G.openblocks = None
    
    return [ s, blocks ]

def parseString( s, q, i, l ):
    string = q
    escaped = False
    ch = ''
    while ( i < l ):
        ch = s[i]
        i += 1
        string += ch
        if ( q == ch and not escaped ):  break
        escaped = (not escaped and '\\' == ch)
    return string


def parseVariable( s, i, l, pre='VARSTR' ):
    global _G
    
    if ( _G.ALPHA.match(s[i]) ):
    
        cnt = 0
        strings = {}
        variables = []
        space = 0
        
        
        # main variable
        variable = s[i]
        i += 1
        while ( i < l and _G.ALPHANUM.match(s[i]) ):
        
            variable += s[i]
            i += 1
        
        
        variable_raw = variable
        # transform into tpl variable
        variable = "data['" + variable + "']"
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
                    variable += "['" + property + "']"
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
                
                    property = parseString( s, ch, i+1, l )
                    cnt += 1
                    strid = "__##"+pre+str(cnt)+"##__"
                    strings[ strid ] = property
                    variable += delim + strid
                    lp = len(property)
                    i += lp
                    _len += space + 1 + lp
                    space = 0
                
                
                # numeric array property
                elif ( _G.NUM.match(ch) ):
                
                    property = s[i]
                    i += 1
                    while ( i < l and _G.NUM.match(s[i]) ):
                    
                        property += s[i]
                        i += 1
                    
                    variable += delim + property
                    lp = len(property)
                    _len += space + 1 + lp
                    space = 0
                
                
                # sub-variable property
                elif ( '$' == ch ):
                
                    sub = s[i+1:]
                    subvariables = parseVariable(sub, 0, len(sub), pre + '_' + str(cnt) + '_');
                    if ( subvariables ):
                    
                        # transform into tpl variable property
                        property = subvariables[-1]
                        variable += delim + property[0][0]
                        lp = property[1]
                        i += lp + 1
                        _len += space + 2 + lp
                        space = 0
                        variables = variables + subvariables
                    
                
                
                # close bracket
                elif ( ']' == ch ):
                
                    if ( bracketcnt > 0 ):
                    
                        bracketcnt -= 1
                        variable += delim + s[i]
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
                        variable += s[i]
                        i += 1
                        _len += space + 1
                        space = 0
                    
                    else:
                    
                        break
                    
                
            
            
            # extra space
            while ( i < l and _G.SPACE.match(s[i]) ):
            
                space += 1
                i += 1
            
        
        
        variables.append( [[variable, variable_raw], _len, strings] )
        return variables
    
    return None

def funcReplace( m ):
    global _G
    plugin = m.group(3) 
    if plugin and plugin in _G.plugins:
        pl = _G.plugins[plugin]
        return pl.render() if isinstance(pl,Contemplate.InlineTemplate) else pl
    
    return 'Contemplate.' + m.group(1) 

# static
def parse( tpl, withblocks=True ):
    global _G
    
    parts = split( tpl, _G.leftTplSep, _G.rightTplSep )
    l = len(parts)
    isTag = False
    parsed = ''
    
    for i in range(l):
        s = parts[i]
        
        if isTag:
            
            tag = "\t" + re.sub( _G.regExps['specials'], " ", s ) + "\v" # replace special chars
            
            # parse each template tag section accurately
            # refined parsing
            count = len( tag )
            index = 0
            ch = ''
            out = ''
            cnt = 0
            variables = {}
            strings = {}
            while ( index < count ):
            
                ch = tag[index]
                index  += 1
                
                # parse mainly literal strings and variables
                
                # literal string
                if ( '"' == ch or "'" == ch ):
                
                    tok = parseString( tag, ch, index, count )
                    cnt += 1
                    id = "__##STR" + str(cnt) + "##__"
                    strings[ id ] = tok
                    out += id
                    index += len(tok)-1
                
                # variable
                elif ( '$' == ch ):
                
                    tok = parseVariable(tag, index, count)
                    if ( tok ):
                    
                        for tokv in tok:
                            cnt += 1
                            id = "__##VAR" + str(cnt) + "##__"
                            variables[ id ] = tokv[ 0 ]
                            strings.update( tokv[ 2 ] )
                        out += id
                        index += tokv[ 1 ]
                    
                    else:
                    
                        out += '$'
                    
                
                # rest, bypass
                else:
                
                    out += ch
                
            
            tag = out
                
            # fix literal data notation python-style
            tag = tag.replace('true', 'True').replace('false', 'False').replace('null', 'None').replace(' && ', ' and ').replace(' || ', ' or ').replace(' ! ', ' not ')
            
            _G.startblock = None  
            _G.endblock = None 
            _G.blockptr = -1
            tag = re.sub(_G.regExps['controls'], parseControlConstructs, tag)

            tag = re.sub( _G.regExps['functions'], funcReplace, tag )
            
            tag = re.sub( _G.regExps['replacements'], r"' + str( \1 ) + '", tag )
            
            for (id,variable) in variables.items():  
                tag = tag.replace( id+'__RAW__', variable[1] )
                tag = tag.replace( id, variable[0] )
            
            for (id,string) in strings.items():  
                tag = tag.replace( id, string )
            
            tag = tag.replace( "\t", _G.tplStart ).replace( "\v", padLines(_G.tplEnd) )
            
            s = tag
            
            if _G.startblock:
                _G.startblock = "__||"+_G.startblock+"||__"
                _G.allblocks[ _G.blockptr-1 ][ 1 ] = len(parsed) + tag.find( _G.startblock )
            elif _G.endblock:
                _G.endblock = "__||/"+_G.endblock+"||__"
                _G.allblocks[ _G.blockptr-1 ][ 2 ] = len(parsed) + tag.find( _G.endblock ) + len(_G.endblock)
                    
            isTag = False
            
        else:
            
            if _G.escape:
                s = s.replace( "\\", "\\\\" )  # escape escapes
                
            s = s.replace( "'", "\\'" )  # escape single quotes accurately (used by parse function)
            
            s = s.replace( "\n", _G.preserveLines ) # preserve lines
            #s = re.sub(_G.NL, _G.preserveLines, s) # preserve lines
            
            isTag = True
        
        parsed += s
    
    if False != withblocks: return parseBlocks(parsed)
    
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
    
    renderf = blocks[0]
    blocks = blocks[1]
    
    if _G.extends:
        func = TT_FUNC( None, 1 )
    
    else:
        func = TT_FUNC({
                'FCODE': "__p__ += '" + renderf + "'"
            }, 2)
    
    _G.funcId += 1
    
    funcName = '_contemplateFn' + str(_G.funcId)
    fn = createFunction(funcName, '__i__=None', padLines(func, 1), {'Contemplate': Contemplate})
    
    blockfns = {}
    for b in blocks:
        funcName = '_contemplateBlockFn_' + b[0] + '_' + str(_G.funcId)
        blockfns[b] = createFunction(funcName, '__i__=None', padLines(b[1], 1), {'Contemplate': Contemplate})
    
    return [ fn, blockfns]

# static
def createCachedTemplate( id, filename, classname, seps=None ):
    global _G
    resetState()
    
    blocks = parse(getSeparators( Contemplate.getTemplateContents(id), seps ))
    
    renderf = blocks[0]
    blocks = blocks[1]
    
    # tpl-defined blocks
    sblocks = ''
    for b in blocks:
        sblocks += _G.TEOL + TT_BlockCode({
                    'BLOCKNAME': b[0],
                    'BLOCKMETHODNAME': "_blockfn_"+b[0],
                    'BLOCKMETHODCODE': padLines(b[1], 1)
                })
    
    # tpl render code
    if _G.extends:
        extendCode = "self.extend( '"+_G.extends+"' )"
        renderCode = TT_RCODE( None, 1 )
    
    else:
        extendCode = ''
        renderCode = TT_RCODE({
                    'RCODE': "__p__ += '" + renderf + "'" 
                }, 2)
    
    if _G.tplPrefixCode: prefixCode = _G.tplPrefixCode
    else: prefixCode = ''
        
    # generate tpl class
    classCode = TT_ClassCode({
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
                tpl.setRenderFunction( createFunction('_contemplateFn' + str(_G.funcId), '__i__=None', padLines(options['parsed'], 1), {'Contemplate': Contemplate}) )
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
    txt_words = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    date = _get_php_date(format, timestamp)
    
    # localize days/months
    for word in txt_words: 
        if word in locale: date = date.replace(word, locale[word])
        
    # return localized date
    return date

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


#
# The Contemplate Engine Main Python Class
#
class Contemplate:
    """
    Contemplate Template Engine for Python,
    https://github.com/foo123/Contemplate
    """
    
    # constants (not real constants in Python)
    VERSION = "0.7"
    
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
            
        _G.stack = []
        
        # pre-compute the needed regular expressions
        _G.regExps['specials'] = re.compile(r'[\n\r\v\t]')
        
        _G.regExps['replacements'] = re.compile(r'\t[ ]*(.*?)[ ]*\v')
        
        _G.regExps['controls'] = re.compile(r'\t[ ]*%(' + '|'.join(_G.controlConstructs) + ')[ ]*\((.*)\)')
        _G.regExps['controls2'] = re.compile(r'%(' + '|'.join(_G.controlConstructs) + ')[ ]*\((.*)\)')
        
        _G.regExps['functions'] = re.compile(r'%(' + '|'.join(_G.funcs) + ')')
            
        _G.NEWLINE = re.compile(r'\n\r|\r\n|\n|\r')
        _G.SQUOTE = re.compile(r"'")
        _G.NL = re.compile(r'\n')
        
        _G.UNDERL = re.compile( _G.UNDERL )
        _G.ALPHA = re.compile( _G.ALPHA )
        _G.NUM = re.compile( _G.NUM )
        _G.ALPHANUM = re.compile( _G.ALPHANUM )
        _G.SPACE = re.compile( _G.SPACE )
        
        _G.preserveLines = _G.preserveLinesDefault
        
        _G.tplStart = "' " + _G.TEOL
        _G.tplEnd = _G.TEOL + "__p__ += '"
        
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
        
        resetState( )
        parsed = parse( tpl )
        
        if separators:
            _G.leftTplSep = tmp[ 0 ]
            _G.rightTplSep = tmp[ 1 ]
        
        return parsed
        
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
    
    #
    # Basic template functions
    #
    
    # inline tpls, both inside Contemplate templates (i.e as parameters) and in code
    def inline( tpl, reps=None, compiled=True ):
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
        
    # quote
    # static
    def q( e ):
        return "'" + e + "'"
    
    # double quote
    # static
    def dq( e ):
        return '"' + e + '"'
    
    # to String
    # static
    def s( e ):
        return str(e)
    
    # to Integer
    # static
    def n( e ):
        return int(e)
    
    # to Float
    # static
    def f( e ):
        return float(e)
    
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
        if charlist: return s.strip(charlist)
        else: return s.strip()
    
    # static
    def ltrim( s, charlist=None ):
        if charlist: return s.lstrip(charlist)
        else: return s.lstrip()
    
    # static
    def rtrim( s, charlist=None ):
        if charlist: return s.rstrip(charlist)
        else: return s.rstrip()
    
    def ucfirst( s ):
        return s[0].upper() + s[1:]#.lower()
        
    def lcfirst( s ):
        return s[0].lower() + s[1:]#.upper()
        
    def lowercase( s ):
        return str(s).lower()
    
    def uppercase( s ):
        return str(s).upper()
    
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



# aliases
Contemplate.now = Contemplate.time
Contemplate.l = Contemplate.locale

# init the engine on load
Contemplate.init()

# if used with 'import *'
__all__ = ['Contemplate']
