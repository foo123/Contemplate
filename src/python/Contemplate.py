# -*- coding: UTF-8 -*-
##
#  Contemplate
#  Light-weight Templating Engine for PHP, Python, Node and client-side JavaScript
#
#  @version 0.4.7
#  https://github.com/foo123/Contemplate
#
#  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
#  http://ejohn.org/blog/javascript-micro-templating/
#
##

# needed imports
import os, sys, re, time, datetime, calendar

# http://docs.python.org/2/library/collections.html#collections.OrderedDict
# http://code.activestate.com/recipes/576693/
#try:
#    import collections.OrderedDict
#    ODict = collections.OrderedDict
#except ImportError:
#    ODict = dict

ODict = dict

try:
    # Python 3.x
    import html
    __htmlent__ = html
    __ENT_COMPAT__ = False
except ImportError:
    # Python 2.x
    import cgi
    __htmlent__ = cgi
    __ENT_COMPAT__ = True

try:
    # Python 3.x
    import urllib.parse
    __urlencode__ = urllib.parse
except ImportError:
    # Python 2.x
    import urllib
    __urlencode__ = urllib


#
# The Contemplate Engine Main Python Class
#
class Contemplate:
    """
    Contemplate Template Engine for Python,
    https://github.com/foo123/Contemplate
    """
    
    # constants (not real constants in Python)
    VERSION = "0.4.7"
    
    CACHE_TO_DISK_NONE = 0
    CACHE_TO_DISK_AUTOUPDATE = 2
    CACHE_TO_DISK_NOUPDATE = 4
    
    # set file encoding if needed, here (eg 'utf8')
    ENCODING = 'utf-8'
    
    # (protected) static/class properties
    __isInited = False
    __cacheDir = './'
    __cacheMode = 0
    __cache = {}
    __templates = {}
    __inlines = {}
    __partials = {}
    __locale = {}
    __plurals = {}
    
    __leftTplSep = "<%"
    __rightTplSep = "%>"
    __preserveLinesDefault = "' + \"\\n\" + '"
    __preserveLines = ''
    __EOL = "\n"
    __TEOL = os.linesep
    __tplStart = ''
    __tplEnd = ''
    
    __pad = "    "
    __level = 0
    __loops = 0
    __ifs = 0
    __loopifs = 0
    __blocks = []
    __allblocks = []
    __blockcnt = 0
    __extends = None
    __id = 0
    __funcId = 0
    __postReplace = None
    __stack = None
    
    NLRX = None
    
    __regExps = {
        'specials' : None,
        'replacements' : None,
        'vars' : None,
        'ids' : None,
        'atts' : None,
        'functions' : None,
        'controls' : None
    }
    
    __controlConstructs = [
        'htmlselect', 'htmltable',
        'include', 'template', 
        'extends', 'endblock', 'block',
        'elsefor', 'endfor', 'for',
        'elseif', 'else', 'endif', 'if'
    ]
    
    __funcs = [
        'htmlselect', 'htmltable', 'has_key',
        'lowercase', 'uppercase', 'camelcase', 'snakecase', 'pluralise',
        'concat', 'ltrim', 'rtrim', 'trim', 'sprintf', 
        'tpl',
        'html', 'url', 'count', 
        'ldate', 'date', 'now', 'locale',
        'dq', 'q', 'l', 's', 'n', 'f' 
    ]
    
    # generated tpl class code as a heredoc template
    __tplClassCode = """\
# -*- coding: UTF-8 -*-
# Contemplate cached template '__{{ID}}__'

# imports start here, if any
__{{IMPORTS}}__
# imports end here

def __getTplClass__(Contemplate):

    # extends the main Contemplate class
    class __{{CLASSNAME}}__(Contemplate):
        'Contemplate cached template __{{ID}}__'

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
__{{PARENTCODE}}__
            # parent tpl assign code ends here



        # tpl-defined blocks render code starts here
__{{BLOCKS}}__
        # tpl-defined blocks render code ends here

        # render a tpl block method
        def renderBlock(self, block, __instance__=None):
            if ( not __instance__ ): __instance__ = self

            method = '_blockfn_' + block

            if (hasattr(self, method) and callable(getattr(self, method))): 
                return getattr(self, method)(__instance__)

            elif self._parent is not None: 
                return self._parent.renderBlock(block, __instance__)

            return ''
            
        
        # tpl render method
        def render(self, data, __instance__=None):
            __p__ = '' 
            if ( not __instance__ ): __instance__ = self

            if self._parent is not None: 
                __p__ = self._parent.render(data, __instance__)

            else: 
                # tpl main render code starts here
__{{RENDERCODE}}__
                # tpl main render code ends here

            self.data = None 
            return __p__
    
    return __{{CLASSNAME}}__

# allow to 'import *'  from this file as a module
__all__ = ['__getTplClass__']        
"""
    
    # generated tpl block method code as a heredoc template
    __tplBlockCode = """
# tpl block render method for block '__{{BLOCK}}__'
def __{{BLOCKMETHOD}}__(self, __instance__):
__{{BLOCKMETHODCODE}}__
"""

    
    # generated IF code
    __IF = """
if ( __{{COND}}__ ):
"""
    
    # generated ELSEIF code
    __ELSEIF = """
elif ( __{{COND}}__ ):
"""

    # generated ELSE code
    __ELSE = """
else:
"""
    
    # generated ENDIF code
    __ENDIF = """
"""
    
    # a = [51,27,13,56]   dict(enumerate(a))
    # generated FOR code
    __FOR = """
if ( len(__{{O}}__)>0 ):
    # be able to use both key/value in loop
    __{{ASSIGN11}}__
    __{{ASSIGN12}}__
    for  __{{K}}__,__{{V}}__ in __{{LoopO}}__ :
        __{{ASSIGN21}}__
        __{{ASSIGN22}}__
"""
    
    # generated ELSEFOR code
    __ELSEFOR = """
else:
"""
    
    # generated ENDFOR code
    __ENDFOR1 = """
"""
    
    # generated ENDFOR code
    __ENDFOR2 = """
"""
    
    # generated block code snippet
    __DOBLOCK = """
__p__ = ''
__{{CODE}}__
return __p__
"""

    
    # generated dynamic render code
    __TFUNC1 = "return ''"

    # generated dynamic render code
    __TFUNC2 = """
__p__ = '' 
__{{CODE}}__
return __p__
"""

    __RCODE1 = "__p__ = ''"
    
    __RCODE2 = """
__instance__.data = Contemplate.data( data )
__{{CODE}}__
"""
    
    
    #
    #  Instance template methods (for in-memory only templates)
    #
    def __init__(self, id=None, renderFunc=None):
        self.id = None
        self.data = None
        self._renderFunction = None
        self._parent = None
        self._blocks = None
        
        if id is not None:   
            self.id = id 
            self._renderFunction = renderFunc
    
    def setId(self, id=None):
        if id is not None: self.id = id
        
        return self
    
    def setParent(self, parent): 
        if parent:
            if isinstance(parent, str):
                self._parent = Contemplate.tpl( parent )
            else:
                self._parent = parent 
        
        return self
    
    def setBlocks(self, blocks): 
        if not self._blocks: self._blocks = {} 
        self._blocks = Contemplate.merge(self._blocks, blocks)
        
        return self
    
    def setRenderFunction(self, renderFunc=None): 
        if renderFunc: self._renderFunction = renderFunc
        
        return self
    
    def renderBlock(self, block, __instance__=None):
        if ( not __instance__ ): __instance__ = self
        
        if (self._blocks is not None) and (block in self._blocks):
            blockfunc = self._blocks[block]
            return blockfunc( __instance__ )
        
        elif self._parent is not None:
            return self._parent.renderBlock(block, __instance__)
        
        return ''
        
    
    def render(self, data, __instance__=None):
        __p__ = ''
        if ( not __instance__ ): __instance__ = self
        
        if self._parent is not None:  
            __p__ = self._parent.render(data, __instance__)
        
        elif self._renderFunction is not None: 
            # dynamic function
            __instance__.data = Contemplate.data( data )
            renderFunction = self._renderFunction
            __p__ = renderFunction( __instance__ )
        
        self.data = None
        return __p__
    
    #
    #
    #
    
    # static
    def init():
        _self = Contemplate
        
        if _self.__isInited: return
        
        _self.__stack = []
        
        # pre-compute the needed regular expressions
        _self.__regExps['specials'] = re.compile(r'[\n\r\v\t]')
        
        _self.__regExps['vars'] = re.compile(r'\$[a-zA-Z_][a-zA-Z0-9_]*')
        
        _self.__regExps['ids'] = re.compile(r'\$([a-zA-Z_][a-zA-Z0-9_]*)')
        
        _self.__regExps['atts'] = re.compile(r'\.\s*([a-zA-Z_][a-zA-Z0-9_]*)')
        
        _self.__regExps['replacements'] = re.compile(r'\t[ ]*(.*?)[ ]*\v')
        
        _self.__regExps['controls'] = re.compile(r'\t[ ]*%(' + '|'.join(_self.__controlConstructs) + ')[ ]*\((.*)\)')
        
        _self.__regExps['functions'] = re.compile(r'%(' + '|'.join(_self.__funcs) + ')')
        
        _self.NLRX = re.compile(r'\n\r|\r\n|\n|\r')
        
        _self.__preserveLines = _self.__preserveLinesDefault
        
        _self.__tplStart = "' " + _self.__TEOL
        _self.__tplEnd = _self.__TEOL + "__p__ += '"
        
        _self.__isInited = True
    
    #
    # Main template static methods
    #
    
    # static
    def setLocaleStrings(l): 
        Contemplate.__locale = Contemplate.merge(Contemplate.__locale, l)
    
    # static
    def clearLocaleStrings(): 
        Contemplate.__locale = {}
    
    # static
    def setPlurals(plurals): 
        for pl in plurals:
            singular = pl[0]
            if len(pl) < 2: plural = str(singular) + 's' # auto plural
            else: plural = pl[1]
            Contemplate.__plurals[singular] = [singular, plural]
    
    # static
    def clearPlurals(): 
        Contemplate.__plurals = {}
    
    # static
    def setTemplateSeparators(seps=None):
        if seps:
            if 'left' in seps: Contemplate.__leftTplSep = str(seps['left'])
            if 'right' in seps: Contemplate.__rightTplSep = str(seps['right'])
    
    # static
    def setPreserveLines(bool=True): 
        if bool:  
            Contemplate.__preserveLines = Contemplate.__preserveLinesDefault
        else: 
            Contemplate.__preserveLines = ''
    
    # static
    def setCacheDir(dir): 
        _self = Contemplate
        _dir = _self.__cacheDir = os.path.abspath(dir)
        
        initPyFile = os.path.join(_dir, '__init__.py')
        if not os.path.exists(initPyFile):
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
    def setCacheMode(mode): 
        Contemplate.__cacheMode = mode
    
    # static
    def clearCache(all=False): 
        Contemplate.__cache = {}
        if all: Contemplate.__partials = {}
    
    # add templates manually
    # static
    def add(tpls):
        Contemplate.__templates = Contemplate.merge(Contemplate.__templates, tpls)
    
    # add inline templates manually
    # static
    def addInline(tpls):
        Contemplate.__inlines = Contemplate.merge(Contemplate.__inlines, tpls)
        
    # return the requested template (with optional data)
    # static
    def tpl(id, data=None, refresh=False):
        # Figure out if we're getting a template, or if we need to
        # load the template - and be sure to cache the result.
        if refresh or not (id in Contemplate.__cache): 
            Contemplate.__cache[id] = Contemplate.getCachedTemplate(id)
        
        tpl = Contemplate.__cache[id]
        
        # Provide some basic currying to the user
        if data is not None: return str(tpl.render( data ))
        else: return tpl
    
    #
    # Basic template functions
    #
    
    # basic html escaping
    # static
    def html(s):
        # http://www.php2python.com/wiki/function.htmlentities/
        return __htmlent__.escape(s.encode('utf8'), __ENT_COMPAT__).encode('ascii', 'xmlcharrefreplace')
    
    # basic url escaping
    # static
    def url(s):
        # http://www.php2python.com/wiki/function.urlencode/
        return __urlencode__.quote_plus(s)
    
    # count items in array/list or object/dict
    # static
    def count(a):
        # http://www.php2python.com/wiki/function.count/
        return len(a)
    
    # check if (nested) keys exist in tpl variable
    def has_key(v, *args):
        if not v or not (isinstance(v, list) or isinstance(v, dict)): return False
        argslen = len(args)
        tmp = v
        for i in range(argslen):
        
            if args[i] not in tmp: return False
            tmp = tmp[args[i]]
        
        return True
        
    # quote
    # static
    def q(e):
        return "'" + e + "'"
    
    # double quote
    # static
    def dq(e):
        return '"' + e + '"'
    
    # to String
    # static
    def s(e):
        return str(e)
    
    # to Integer
    # static
    def n(e):
        return int(e)
    
    # to Float
    # static
    def f(e):
        return float(e)
    
    # Concatenate strings/vars
    # static
    def concat(*args):
        return ''.join(args)
        
    # Trim strings in templates
    # static
    def trim(s, charlist=None):
        if charlist: return s.strip(charlist)
        else: return s.strip()
    
    # static
    def ltrim(s, charlist=None):
        if charlist: return s.lstrip(charlist)
        else: return s.lstrip()
    
    # static
    def rtrim(s, charlist=None):
        if charlist: return s.rstrip(charlist)
        else: return s.rstrip()
    
    def ucfirst(s):
        return s[0].upper() + s[1:]#.lower()
        
    def lcfirst(s):
        return s[0].lower() + s[1:]#.upper()
        
    def lowercase(s):
        return str(s).lower()
    
    def uppercase(s):
        return str(s).upper()
    
    def camelcase(s, sep="_", capitalizeFirst=False):
        _self = Contemplate
        sep = str(sep)
        if capitalizeFirst:
            return "".join( map( _self.ucfirst, str(s).split( sep ) ) )
        else:
            return _self.lcfirst( "".join( map( _self.ucfirst, str(s).split( sep ) ) ) )
    
    def snakecase(s, sep="_"):
        sep = str(sep)
        return re.sub( r'([A-Z])', lambda m: sep + m.group(1), str(s) ).lower()
    
    # Sprintf in templates
    # static
    def sprintf(*args):
        numargs = len(args)
        if numargs>1:
            format = args.pop(0)
            return format % args
        return ''
    
    #
    #  Localization functions
    #
    
    # current time in seconds
    # time, now
    # static
    def time():
        return int(time.time())
    
    # formatted date
    # static
    def date(format, time=None):
        if time is None: time = Contemplate.time() 
        return Contemplate._get_php_date(format, time)
    
    # localized formatted date
    # static
    def ldate(format, time=None): 
        if time is None: time = Contemplate.time() 
        return Contemplate._localized_date(Contemplate.__locale, format, time)
        
    # locale, l
    # static
    def locale(e): 
        if (e in Contemplate.__locale):
            return Contemplate.__locale[e]
        else:
            return e
    
    # pluralise
    def pluralise(singular, count): 
        if (singular in Contemplate.__plurals):
            if (1 != count): return Contemplate.__plurals[singular][1]
            else: return Contemplate.__plurals[singular][0]
        return singular
    
    #
    #  HTML elements
    #
    
    # html table
    # static
    def htmltable(data, options={}):
        _self = Contemplate
        # clone data to avoid mess-ups
        data = _self.merge({}, data)
        options = _self.merge({}, options)
        o='' 
        
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
        
            if odd:
                o+="<tr class='"+class_odd+"'><td>"+'</td><td>'.join(rows[i])+"</td></tr>"
                odd=False
            else:
                o+="<tr class='"+class_even+"'><td>"+'</td><td>'.join(rows[i])+"</td></tr>"
                odd=True
            
        del rows
        
        o+=footer
        o+="</table>"
        return o
    
    # html select
    # static
    def htmlselect(data, options={}):
        _self = Contemplate
        # clone data to avoid mess-ups
        data = _self.merge({}, data)
        options = _self.merge({}, options)
        o=''
        
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
                        
                    if k2 in options['selected']:
                        o+="<option value='"+str(k2)+"' selected='selected'>"+str(v2)+"</option>"
                    else:
                        o+="<option value='"+str(k2)+"'>"+str(v2)+"</option>"
                    
                
                o+="</optgroup>"
            
            else:
            
                if 'use_key' in options: v=k
                elif 'use_value' in options:  k=v
                    
                if k in options['selected']:
                    o+="<option value='"+str(k)+"' selected='selected'>"+str(v)+"</option>"
                else:
                    o+="<option value='"+str(k)+"'>"+str(v)+"</option>"
            
        
        o+="</select>"
        return o
    
    #
    # Control structures
    #
    
    # if
    # static
    def t_if(cond='False'):
        _self = Contemplate
        _self.__ifs += 1
        
        out = "' "
        # translate some logic operators to Python style
        cond = cond.replace('true', 'True').replace('false', 'False').replace(' && ', ' and ').replace(' || ', ' or ').replace(' ! ', ' not ')
        out1 =_self.__IF.replace('__{{COND}}__', cond)
        out += _self.padLines(out1)
        _self.__level += 1
        
        return out
        
    # elseif    
    # static
    def t_elseif(cond='False'):
        _self = Contemplate
        out = "' "
        # translate some logic operators to Python style
        cond = cond.replace('true', 'True').replace('false', 'False').replace(' && ', ' and ').replace(' || ', ' or ').replace(' ! ', ' not ')
        out1 = _self.__ELSEIF.replace('__{{COND}}__', cond)

        _self.__level -= 1
        out += _self.padLines(out1)
        _self.__level += 1
        
        return out
        
    # else
    # static
    def t_else(args=''):
        _self = Contemplate
        out = "' "
        out1 = _self.__ELSE
        
        _self.__level -= 1
        out += _self.padLines(out1)
        _self.__level += 1
        
        return out
    
    # endif
    # static
    def t_endif(args=''):
        _self = Contemplate
        _self.__ifs -= 1
        
        out = "' "
        out1 = _self.__ENDIF
        
        _self.__level -= 1
        out += _self.padLines(out1)
        
        return out
        
    # for, foreach
    # static
    def t_for(for_expr):
        _self = Contemplate
        _self.__loops += 1  
        _self.__loopifs += 1
        _self.__id += 1
        for_expr = for_expr.split(' as ')
        o = for_expr[0].strip()
        kv = for_expr[1].split('=>')
        k = kv[0].strip().lstrip('$')
        v = kv[1].strip().lstrip('$')
        
        o = _self.doTplVars( o )
        loopo = '_loopObj' + str(_self.__id)
        _self.__postReplace = {
            '__{{O}}__' : o,
            '__{{K}}__' : k,
            '__{{V}}__' : v,
            '__{{LoopO}}__' : loopo,
            '__{{ASSIGN11}}__' : 'if isinstance('+o+', list): '+loopo+' = enumerate('+o+')',
            '__{{ASSIGN12}}__' : 'else: '+loopo+' = '+o+'.items();',
            '__{{ASSIGN21}}__' : '__instance__.data[\''+k+'\'] = '+k+'',
            '__{{ASSIGN22}}__' : '__instance__.data[\''+v+'\'] = '+v+''
        }
        
        out = "' "
        out1 = _self.__FOR
        
        out += _self.padLines(out1)
        _self.__level += 2
        
        return out
    
    # elsefor
    # static
    def t_elsefor(args=''):
        # else attached to  for loop
        _self = Contemplate
        _self.__loopifs -= 1
        out = "' "
        out1 = _self.__ELSEFOR
        
        _self.__level += -2
        out += _self.padLines(out1)
        _self.__level += 1
        
        return out
        
    # endfor
    # static
    def t_endfor(args=''):
        _self = Contemplate
        out = "' "
        if _self.__loopifs == _self.__loops:
            _self.__loops -= 1 
            _self.__loopifs -= 1
            
            out1 = _self.__ENDFOR1
            
            _self.__level += -2
            out += _self.padLines(out1)
            
            return out
        
        _self.__loops -= 1
        out1 = _self.__ENDFOR2
        
        _self.__level += -1
        out += _self.padLines(out1)
        
        return out
    
    # include file
    # static
    def t_include(id):
        _self = Contemplate
        # cache it
        if id not in _self.__partials:
            _self.pushState()
            _self.resetState()
            _self.__partials[id] = " " + _self.parse(_self.getTemplateContents(id), False) + "' " + _self.__TEOL
            _self.popState()
        
        return _self.padLines( _self.__partials[id] )
    
    # include template
    # static
    def t_template(args):
        _self = Contemplate
        args = args.split(',')
        id = args.pop(0).strip()
        obj = ','.join(args).replace('=>', ':').replace('true', 'True').replace('false', 'False')
        return '\' + %tpl( "'+id+'", '+obj+' ) ' + _self.__TEOL
    
    # extend another template
    # static
    def t_extends(tpl):
        Contemplate.__extends = tpl
        return "' " + Contemplate.__TEOL
        
    # define (overridable) block
    # static
    def t_block(block):
        _self = Contemplate
        block = block.strip()
        if block not in _self.__allblocks:
            _self.__allblocks.append(block)
        
        _self.__blockcnt += 1
        _self.__blocks.append(block)
        return "' +  __||" + block + "||__"  
        
    # end define (overridable) block
    # static
    def t_endblock(args=''):
        _self = Contemplate
        if _self.__blockcnt>0:
            _self.__blockcnt -= 1
            return "__||/" + _self.__blocks.pop() + "||__"
        return ''
    
    # render html table
    # static
    def t_table(args):
        _self = Contemplate
        obj = args.replace('=>', ':').replace('true', 'True').replace('false', 'False')
        return '\' + %htmltable(' + obj + ') ' + _self.__TEOL
    
    # render html select
    # static
    def t_select(args):
        _self = Contemplate
        obj = args.replace('=>', ':').replace('true', 'True').replace('false', 'False')
        return '\' + %htmlselect(' + obj + ') ' + _self.__TEOL
    
    #
    # auxilliary parsing methods
    #
    
    # static
    def doControlConstructs(m):
        _self = Contemplate
        t = m.group(1) 
        a = m.group(2)
        
        if ('if'==t): return _self.t_if(a)
        
        elif ('elseif'==t): return _self.t_elseif(a)
        
        elif ('else'==t): return _self.t_else(a)
        
        elif ('endif'==t): return _self.t_endif(a)
        
        elif ('for'==t): return _self.t_for(a)
        
        elif ('elsefor'==t): return _self.t_elsefor(a)
        
        elif ('endfor'==t): return _self.t_endfor(a)
        
        elif ('template'==t): return _self.t_template(a)
        
        elif ('extends'==t): return _self.t_extends(a)
        
        elif ('block'==t): return _self.t_block(a)
        
        elif ('endblock'==t): return _self.t_endblock(a)
        
        elif ('include'==t): return _self.t_include(a)
        
        elif ('htmltable'==t): return _self.t_table(a)
        
        elif ('htmlselect'==t): return _self.t_select(a)
        
        return m.group(0)
    
    # static
    def doBlocks(s):
        _self = Contemplate
        blocks = {} 
        bl = len(_self.__allblocks)
        while bl:
            bl -= 1
            block = _self.__allblocks.pop()
            delim1 = '__||' + block + '||__' 
            delim2 = '__||/' + block + '||__'
            
            len1 = len(delim1) 
            len2 = len1+1 
            
            pos1 = s.find(delim1, 0) 
            pos2 = s.find(delim2, pos1+len1)
            
            code = s[pos1:pos2+len2]
            
            if len(code)>0:
                code = code[len1:-len2].replace("+ '' +", '+')  # remove redundant code
                
                bout = _self.__DOBLOCK.replace('__{{CODE}}__', code+"'")
                
                blocks[block] = bout
            
            replace = True
            while replace:
                # replace all occurances of the block on the current template, 
                # with the code found previously
                # in the 1st block definition
                s = s[0:pos1] + "__instance__.renderBlock( '" + block + "' ) " + s[pos2+len2:]
                
                
                pos1 = s.find(delim1, 0)
                replace = (0 <= pos1)
                if replace: pos2 = s.find(delim2, pos1+len1)
            
        return [ s.replace("+ '' +", '+'), blocks ]
    
    # static
    def doTplVars(s):
        _self = Contemplate
        
        tplvars = []
        rem = []
        
        # find tplvars
        tplvars = re.findall( _self.__regExps['ids'], s )
        
        if len(tplvars)>0:
        
            rem = re.split( _self.__regExps['vars'], s )
            remLen = len(rem)-1
            s = ''
            for i in range(remLen):
            
                s += re.sub( _self.__regExps['atts'], r"['\1']", rem[i] )  # fix dot-style attributes
                s += "__instance__.data['" + tplvars[i] + "']";  # replace tplvars with the tpldata
            
            s += re.sub( _self.__regExps['atts'], r"['\1']", rem[remLen] )  # fix dot-style attributes
        
        return s
        
    # static
    def doTags(tag):
        _self = Contemplate
        
        _self.__postReplace = None
        
        tag = re.sub(_self.__regExps['controls'], _self.doControlConstructs, tag)

        tag = _self.doTplVars( tag ) # replace tplvars with python vars accurately
        
        if _self.__postReplace:
        
            for k in _self.__postReplace:  tag = tag.replace( k, _self.__postReplace[k] )
            
        
        tag = re.sub( _self.__regExps['functions'], r'Contemplate.\1', tag )
        
        tag = re.sub( _self.__regExps['replacements'], r"' + str( \1 ) + '", tag )
        
        tag = tag.replace( "\t", _self.__tplStart ).replace( "\v", _self.padLines(_self.__tplEnd) )
        
        return tag
    
    # static
    def split(s):
        _self = Contemplate
        
        parts1 = s.split( _self.__leftTplSep )
        l = len(parts1)
        parts = []
        for i in range(l):
            tmp = parts1[i].split( _self.__rightTplSep )
            parts.append ( tmp[0] )
            if len(tmp) > 1: parts.append ( tmp[1] )
        
        return parts

    # static
    def parse(tpl, withblocks=True):
        _self = Contemplate
        parts = _self.split( tpl )
        l = len(parts)
        isTag = False
        out = ''
        for i in range(l):
            s = parts[i]
            
            if isTag:
                
                s = re.sub( _self.__regExps['specials'], " ", s ) # replace special chars
                
                s = _self.doTags( "\t" + s + "\v" ) # parse each template tag section accurately
                
                isTag = False
                
            else:
                
                s = s.replace( "'", "\\'" )  # escape single quotes accurately (used by parse function)
                
                s = s.replace( "\n", _self.__preserveLines ) # preserve lines
            
                isTag = True
            
            out += s
        
        if withblocks: return _self.doBlocks(out)
        
        return out.replace( "+ '' +", '+' ) # remove redundant code
    
    # static
    def getTemplateContents(id):
        _self = Contemplate
        if id in _self.__inlines: 
            return _self.__inlines[id]
        
        elif (id in _self.__templates) and os.path.exists(_self.__templates[id]): 
            return _self.read(_self.__templates[id])
        
        return ''
    
    # static
    def getCachedTemplateName(id):
        return id.replace('-', '_').replace(' ', '_') + '_tpl' + '.py'
    
    # static
    def getCachedTemplateClass(id):
        return 'Contemplate_' + id.replace('-', '_').replace(' ', '_') + '_Cached'
    
    # static
    def createTemplateRenderFunction(id):
        _self = Contemplate
        _self.resetState()
        
        blocks = _self.parse(_self.getTemplateContents(id))
        
        if _self.__extends:
            func = _self.__TFUNC1
        
        else:
            func = _self.__TFUNC2.replace( '__{{CODE}}__', "__p__ += '" + blocks[0] + "'")
        
        _self.__funcId += 1
        
        funcName = '_contemplateFn' + str(_self.__funcId)
        fn = _self.createFunction(funcName, '__instance__=None', _self.padLines(func, 1), {'Contemplate': Contemplate})
        
        blockfns = {}
        for b,bc in blocks[1].items():
            funcName = '_contemplateBlockFn_' + b + '_' + str(_self.__funcId)
            blockfns[b] = _self.createFunction(funcName, '__instance__=None', _self.padLines(bc, 1), {'Contemplate': Contemplate})
        
        return [ fn, blockfns]
    
    # static
    def createCachedTemplate(id, filename, classname):
        _self = Contemplate
        _self.resetState()
        
        blocks = _self.parse(_self.getTemplateContents(id))
        
        # tpl-defined blocks
        sblocks = ''
        for b,bc in blocks[1].items():
            sblocks += _self.__TEOL + _self.__tplBlockCode.replace('__{{BLOCK}}__', b).replace('__{{BLOCKMETHOD}}__', "_blockfn_"+b).replace('__{{BLOCKMETHODCODE}}__', _self.padLines(bc, 1))
        
        # tpl render code
        if _self.__extends:
            parentCode = "self.setParent( '"+_self.__extends+"' )"
            renderCode = _self.__RCODE1
        
        else:
            parentCode = ''
            renderCode = _self.__RCODE2.replace( '__{{CODE}}__', "__p__ += '" + blocks[0] + "'" )
        
        # generate tpl class
        classCode = _self.__tplClassCode.replace('__{{IMPORTS}}__', '').replace('__{{ID}}__', id).replace('__{{CLASSNAME}}__', classname).replace('__{{PARENTCODE}}__', _self.padLines(parentCode, 3)).replace('__{{BLOCKS}}__', _self.padLines(sblocks, 2)).replace('__{{RENDERCODE}}__', _self.padLines(renderCode, 4))
        
        return _self.write(filename, classCode)
    
    # static
    def getCachedTemplate(id):
        _self = Contemplate
        
        # inline templates saved only in-memory
        if id in _self.__inlines:
            # dynamic in-memory caching during page-request
            tpl = Contemplate()
            tpl.setId( id )
            fns = _self.createTemplateRenderFunction(id)
            tpl.setRenderFunction( fns[0] )
            tpl.setBlocks( fns[1] )
            if _self.__extends: tpl.setParent( _self.tpl(_self.__extends) )
            return tpl
        
        CM = _self.__cacheMode
        
        if CM == _self.CACHE_TO_DISK_NOUPDATE:
        
            cachedTplFile = _self.getCachedTemplateName(id)
            cachedTplPath = os.path.join(Contemplate.__cacheDir, cachedTplFile)
            cachedTplClass = _self.getCachedTemplateClass(id)
            if not os.path.isfile(cachedTplPath):
                # if not exist, create it
                _self.createCachedTemplate(id, cachedTplPath, cachedTplClass)
            if os.path.isfile(cachedTplPath):
                tpl = _self.include(cachedTplFile, cachedTplClass)()
                tpl.setId( id )
                return tpl
            return None

        
        elif CM == _self.CACHE_TO_DISK_AUTOUPDATE:
        
            cachedTplFile = _self.getCachedTemplateName(id)
            cachedTplPath = os.path.join(Contemplate.__cacheDir, cachedTplFile)
            cachedTplClass = _self.getCachedTemplateClass(id)
            if not os.path.isfile(cachedTplPath) or (os.path.getmtime(cachedTplPath) <= os.path.getmtime(_self.__templates[id])):
                # if tpl not exist or is out-of-sync (re-)create it
                _self.createCachedTemplate(id, cachedTplPath, cachedTplClass)
            if os.path.isfile(cachedTplPath):
                tpl = _self.include(cachedTplFile, cachedTplClass)()
                tpl.setId( id )
                return tpl
            return None
        
        else:
        
            # dynamic in-memory caching during page-request
            tpl = Contemplate()
            tpl.setId( id )
            fns = _self.createTemplateRenderFunction(id)
            tpl.setRenderFunction( fns[0] )
            tpl.setBlocks( fns[1] )
            if _self.__extends: tpl.setParent( _self.tpl(_self.__extends) )
            return tpl
        
        return None
    
    # static
    def setCachedTemplate(filename, tplContents): 
        return Contemplate.write(filename, tplContents)
    
    # static
    def _get_ordinal_suffix(n):
        # adapted from http://brandonwamboldt.ca/python-php-date-class-335/
        return {1: 'st', 2: 'nd', 3: 'rd'}.get(4 if 10 <= n % 100 < 20 else n % 10, "th")
    
    # static
    def _get_php_date(format, time):
        # http://php.net/manual/en/datetime.formats.date.php
        # http://strftime.org/
        # adapted from http://brandonwamboldt.ca/python-php-date-class-335/
        _self = Contemplate
        time  = datetime.datetime.fromtimestamp(time)
        timeStr = ''

        replacements = {}

        """ Day """
        replacements['d'] = str( time.day ).zfill(2)
        replacements['D'] = calendar.day_abbr[ time.weekday() ]
        replacements['j'] = str( time.day )
        replacements['l'] = calendar.day_name[ time.weekday() ]
        replacements['S'] = _self._get_ordinal_suffix( time.day )
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
    def _localized_date(locale, format, timestamp):
        txt_words = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        date = Contemplate._get_php_date(format, timestamp)
        
        # localize days/months
        for word in txt_words: 
            if word in locale: date = date.replace(word, locale[word])
            
        # return localized date
        return date
    
    # static
    def merge(m, *args): 
        numargs = len(args)
        if numargs < 1: return m
        
        merged = m
        
        for arg in args:
            # http://www.php2python.com/wiki/function.array-merge/
            merged = ODict(merged)
            merged.update(arg)
        
        return merged
    
    # static
    def data(data):
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
    def resetState():
        # reset state
        _self = Contemplate
        _self.__loops = 0 
        _self.__ifs = 0 
        _self.__loopifs = 0
        _self.__blockcnt = 0 
        _self.__blocks = []  
        _self.__allblocks = [] 
        _self.__extends = None
        _self.__level = 0
        _self.__id = 0
        #_self.__funcId = 0
    
    # static
    def pushState():
        # push state
        _self = Contemplate
        _self.__stack.append([_self.__loops, _self.__ifs, _self.__loopifs, _self.__level,
        _self.__blockcnt, _self.__blocks,  _self.__allblocks,  _self.__extends])
    
    # static
    def popState():
        # pop state
        _self = Contemplate
        t = _self.__stack.pop()
        _self.__loops = t[0] 
        _self.__ifs = t[1] 
        _self.__loopifs = t[2] 
        _self.__level = t[3]
        _self.__blockcnt = t[4] 
        _self.__blocks = t[5]  
        _self.__allblocks = t[6]  
        _self.__extends = t[7]
    
    # static
    def padLines(lines, level=None):
        _self = Contemplate
        
        if level is None:  level = _self.__level
        
        if level >= 0:
            pad = _self.__pad * level
            
            lines = re.split(_self.NLRX, lines)
            lenlines = len(lines)
            
            for i in range(lenlines):
                lines[i] = pad + lines[i]
            
            lines = _self.__TEOL.join(lines)
        
        return lines
    
    # static
    def open(file, op):
        #if Contemplate.ENCODING: 
        #    f = open(file, op, encoding=Contemplate.ENCODING)
        #else: 
        #    f = open(file, op)
        #return f
        return open(file, op, -1, Contemplate.ENCODING)

    # static
    def read(file):
        buffer=''
        with Contemplate.open(file, 'r') as f:
            buffer = f.read()
        return buffer

    # static
    def write(file, text):
        with Contemplate.open(file, 'w') as f:
            f.write(text)

    #
    #  Auxilliary methods 
    # (mostly methods to simulate php-like functionality needed by the engine)
    #
    
    # static
    def include(filename, classname, doReload=False):
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
        
        getTplClass = None
        directory = Contemplate.__cacheDir
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
    def createFunction(funcName, args, sourceCode, additional_symbols=dict()):
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


# aliases
Contemplate.now = Contemplate.time
Contemplate.l = Contemplate.locale

# init the engine on load
Contemplate.init()

# if used with 'import *'
__all__ = ['Contemplate']
