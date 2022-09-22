##
#  Contemplate
#  Light-weight Object-Oriented Template Engine for PHP, Python, JavaScript
#
#  @version 1.6.0
#  https://github.com/foo123/Contemplate
#
#  @inspired by : Simple JavaScript Templating, John Resig - http://ejohn.org/ - MIT Licensed
#  http://ejohn.org/blog/javascript-micro-templating/
#
##

# needed imports
import os, sys, re, time, datetime, calendar, math, codecs, json

try:
    # Python 3.x
    import urllib.parse

    # http://www.php2python.com/wiki/function.urlencode/
    def rawurlencode(s):
        return urllib.parse.quote(s)
    def rawurldecode(s):
        return urllib.parse.unquote(s)
    def urlencode(s):
        return urllib.parse.quote_plus(s)
    def urldecode(s):
        return urllib.parse.unquote_plus(s)

except ImportError:
    # Python 2.x
    import urllib

    # http://www.php2python.com/wiki/function.urlencode/
    def rawurlencode(s):
        return urllib.quote(s)
    def rawurldecode(s):
        return urllib.unquote(s)
    def urlencode(s):
        return urllib.quote_plus(s)
    def urldecode(s):
        return urllib.unquote_plus(s)


try:
    from importlib import reload
except ImportError:
    pass

# (protected) global properties
class _G:

    isInited = False

    leftTplSep = "<%"
    rightTplSep = "%>"
    tplStart = ''
    tplEnd = ''
    preserveLinesDefault = "' + \"\\n\" + '"
    preserveLines = ''
    EOL = "\n"
    TEOL = "\n" #os.linesep
    pad = "    "
    escape = True

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
    uses = None
    id = 0
    funcId = 0
    uuid = 0

    ctx = None
    glob = None
    context = None

    NEWLINE = re.compile(r'\n\r|\r\n|\r|\n')
    SQUOTE = re.compile(r"'")
    NL = re.compile(r'\n')

    DS_RE = re.compile(r'[/\\]')
    TAG_RE = re.compile(r'</?[a-zA-Z0-9:_\-]+[^<>]*>',re.S|re.M)
    AMP_RE = re.compile(r'&+')
    UNDERL = re.compile(r'[\W]+')
    ALPHA = re.compile(r'^[a-zA-Z_]')
    NUM = re.compile(r'^[0-9]')
    ALPHANUM = re.compile(r'^[a-zA-Z0-9_]')
    SPACE = re.compile(r'^\s')
    ALL_SPACE = re.compile(r'^\s+$')

    INDENT = re.compile(r'^(postdent|predent)\((-?\d+)\):')

    T_OR = re.compile(r'(.)(\|\|)(.)')
    T_AND = re.compile(r'(.)(&&)(.)')
    T_NOT = re.compile(r'(.)(!)([^=])')

    TT_ClassCode = None

    TT_BlockCode = None
    TT_BLOCK = None

    TT_FUNC = None
    TT_RCODE = None

    re_controls = re.compile(r'(\t|\s?)\s*((#ID_(continue|endblock|elsefor|endfor|endif|break|else|fi)#(\s*\(\s*\))?)|(#ID_([^#]+)#\s*(\()))(.*)$')

    reserved_var_names = [
    'Contemplate', 'self', 'self_', 'data', '__p__', '__i__', '__ctx'
    ]
    directives = [
    'set', 'unset', 'isset',
    'if', 'elseif', 'else', 'endif',
    'for', 'elsefor', 'endfor',
    'extends', 'block', 'endblock',
    'include', 'super', 'getblock', 'iif', 'empty', 'continue', 'break', 'local_set', 'get', 'local'
    ]
    directive_aliases = {
     'elif'         : 'elseif'
    ,'fi'           : 'endif'
    }
    aliases = {
     'l'        : 'locale'
    ,'xl'       : 'xlocale'
    ,'nl'       : 'nlocale'
    ,'nxl'      : 'nxlocale'
    ,'cc'       : 'concat'
    ,'j'        : 'join'
    ,'dq'       : 'qq'
    ,'now'      : 'time'
    ,'template' : 'tpl'
    }

T_REGEXP = type(_G.NEWLINE)

#
#  Auxilliary methods
# (mostly methods to simulate php-like functionality needed by the engine)
#
def array_keys(o):
    if isinstance(o, (list,tuple)): return list(map(str, range(0, len(o))))
    if isinstance(o, dict): return list(o.keys())
    return []

def array_values(o):
    if isinstance(o, list): return o
    if isinstance(o, tuple): return list(o)
    if isinstance(o, dict):
        if is_numeric_array(o):
            # get values in list-order by ascending index
            v = []
            l = len(o)
            i = 0
            while i < l:
                v.append(o[str(i)])
                i += 1
            return v
        else:
            return list(o.values())
    return []

def is_numeric_array(o):
    if isinstance(o, (list,tuple)): return True
    if isinstance(o, dict):
        k = array_keys(o)
        i = 0
        l = len(k)
        while i < l:
            if str(i) not in k: return False
            i += 1
        return True
    return False

default_date_locale = {
 'meridian': {'am':'am', 'pm':'pm', 'AM':'AM', 'PM':'PM'}
,'ordinal': {'ord':{1:'st',2:'nd',3:'rd'}, 'nth':'th'}
,'timezone': ['UTC','EST','MDT']
,'timezone_short': ['UTC','EST','MDT']
,'day': ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
,'day_short': ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
,'month': ['January','February','March','April','May','June','July','August','September','October','November','December']
,'month_short': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
}

def wait_ms(ms):
    time.sleep(ms / 1000)

def open_file(file, op, encoding):
    return open(file, op, -1, encoding)

def read_file(file, encoding):
    buffer = ''
    f = open_file(file, 'r', encoding)
    buffer = f.read()
    f.close()
    return buffer

# https://stackoverflow.com/questions/186202/what-is-the-best-way-to-open-a-file-for-exclusive-access-in-python
# https://github.com/drandreaskrueger/lockbydir
def write_file(file, text, encoding):
    f = open_file(file, 'w', encoding)
    f.write(text)
    f.close()

def parse_str(s):
    # http://www.php2python.com/wiki/function.parse-str/
    global _G

    strArr = s.strip('&').split('&')
    array = {}
    possibleLists = []

    for tmp in strArr:
        tmp = tmp.split('=')
        key = rawurldecode(tmp[0].strip())
        if len(tmp) < 2: value = ''
        else: value = rawurldecode(tmp[1].strip())

        j = key.find('\x00')
        if j > -1: key = key[0:j]

        if key and '[' != key[0]:
            keys = []

            postLeftBracketPos = 0
            lk = len(key)
            for j in range(lk):
                if '[' == key[j] and 0 == postLeftBracketPos:
                    postLeftBracketPos = j + 1

                elif ']' == key[j]:
                    if postLeftBracketPos:
                        if 0 == len(keys):
                            keys.append(key[0:postLeftBracketPos - 1])
                        keys.append(key[postLeftBracketPos:j])
                        postLeftBracketPos = 0
                        if j < lk-1 and '[' != key[j + 1]: break

            if 0 == len(keys): keys = [key]

            for j in range(len(key[0])):
                chr = keys[0][j]
                if ' ' == chr or '.' == chr or '[' == chr:
                    keys[0] = keys[0][0:j] + '_' + keys[0][j + 1:]
                if '[' == chr: break

            obj = array
            key = None
            lastObj = obj
            lastkey = keys[len(keys)-1].strip("'\"").strip() if len(keys) else None
            for j in range(len(keys)):
                prevkey = key
                key = keys[j].strip("'\"")
                prevobj = lastObj
                lastObj = obj

                if '' != key.strip() or 0 == j:
                    if key not in obj: obj[key] = [] if (j+1 == len(keys)-1) and (''==lastkey) else {}
                    obj = obj[key]
                else:
                    # To insert new dimension
                    #ct = -1
                    #for p in obj:
                    #    if _G.digit.match(p) and int(p) > ct: ct = int(p)
                    #key = str(ct + 1)
                    key = True
            if key is True:
                lastObj.append(value)
            else:
                try:
                    ikey = int(key, 10)
                except BaseException as exc:
                    ikey = -1
                if 0 <= ikey:
                    possibleLists.append({'key':prevkey,'obj':prevobj})
                lastObj[ key ] = value
    i = len(possibleLists)-1
    while i >= 0:
        # safe to pass multiple times same obj, it is possible
        obj = possibleLists[i]['obj'][possibleLists[i]['key']] if possibleLists[i]['key'] else possibleLists[i]['obj']
        if is_numeric_array(obj):
            obj = array_values(obj)
            if possibleLists[i]['key']:
                possibleLists[i]['obj'][possibleLists[i]['key']] = obj
            else:
                array = obj
        i -= 1
    return array

def http_build_query_helper(key, val, arg_separator, PHP_QUERY_RFC3986):
    encode = rawurlencode if PHP_QUERY_RFC3986 else urlencode

    if True == val: val = "1"
    elif False == val: val = "0"

    if val is not None:

        key = str(key)

        data = None
        if isinstance(val, dict): data = val.items()
        elif isinstance(val, (list, tuple)): data = enumerate(val)

        if data:
            tmp = []
            for k,v in data:
                if v is not None:
                    tmp.append(http_build_query_helper(key + "[" + str(k) + "]", v, arg_separator, PHP_QUERY_RFC3986))
            return arg_separator.join(tmp)

        else:
            return encode(key) + "=" + encode(str(val))

    else:
        return ''

def http_build_query(data, arg_separator = '&', PHP_QUERY_RFC3986 = False):
    tmp = []
    for key,value in data.items():
        query = http_build_query_helper(key, value, arg_separator, PHP_QUERY_RFC3986)
        if '' != query: tmp.append(query)

    return arg_separator.join(tmp)

def php_time():
    return int(time.time())

def php_date(format, timestamp = None):
    global default_date_locale
    locale = default_date_locale
    # http://php.net/manual/en/datetime.formats.date.php
    # http://strftime.org/
    # https://docs.python.org/2/library/time.html
    # adapted from http://brandonwamboldt.ca/python-php-date-class-335/
    if timestamp is None: timestamp = php_time()
    utime = timestamp
    dtime  = datetime.datetime.fromtimestamp(timestamp)

    D = {}
    w = dtime.weekday()
    W = dtime.isocalendar()[1]
    d = dtime.day
    dmod10 = d % 10
    n = dtime.month
    Y = dtime.year
    g = int(dtime.strftime("%I"))
    G = int(dtime.strftime("%H"))
    meridian = dtime.strftime("%p")
    tzo = int(time.timezone / 60)
    atzo = abs(tzo)

    # Calculate and return Swatch Internet Time
    # http://code.activestate.com/recipes/578473-calculating-swatch-internet-time-or-beats/
    lh, lm, ls = time.localtime()[3:6]
    beats = ((lh * 3600) + (lm * 60) + ls + time.timezone) / 86.4
    if beats > 1000: beats -= 1000
    elif beats < 0: beats += 1000

    # Day --
    D['d'] = str(d).zfill(2)
    D['D'] = locale['day_short'][0 if 6 == w else w+1]
    D['j'] = str(d)
    D['l'] = locale['day'][0 if 6 == w else w+1]
    D['N'] = str(w+1 if 6 > w else 7)
    D['S'] = locale['ordinal']['ord'][d] if d in locale['ordinal']['ord'] else (locale['ordinal']['ord'][dmod10] if dmod10 in locale['ordinal']['ord'] else locale['ordinal']['nth'])
    D['w'] = str(1 if 6 == w else w+2)
    D['z'] = str(dtime.timetuple().tm_yday)

    # Week --
    D['W'] = str(W)

    # Month --
    D['F'] = locale['month'][n-1]
    D['m'] = str(n).zfill(2)
    D['M'] = locale['month_short'][n-1]
    D['n'] = str(n)
    D['t'] = str(calendar.monthrange(Y, n)[1])

    # Year --
    D['L'] = str(int(calendar.isleap(Y)))
    D['o'] = str(Y + (1 if n == 12 and W < 9 else (-1 if n == 1 and W > 9 else 0)))
    D['Y'] = str(Y)
    D['y'] = str(Y)[2:]

    # Time --
    D['a'] = locale['meridian'][meridian.lower()] if meridian.lower() in locale['meridian'] else meridian.lower()
    D['A'] = locale['meridian'][meridian] if meridian in locale['meridian'] else meridian
    D['B'] = str(int(beats)).zfill(3)
    D['g'] = str(g)
    D['G'] = str(G)
    D['h'] = str(g).zfill(2)
    D['H'] = str(G).zfill(2)
    D['i'] = str(dtime.minute).zfill(2)
    D['s'] = str(dtime.second).zfill(2)
    D['u'] = str(dtime.microsecond).zfill(6)

    # Timezone --
    D['e'] = '' # TODO, missing
    D['I'] = str(dtime.dst())
    D['O'] = ('-' if tzo > 0 else '+')+str(int(atzo / 60) * 100 + atzo % 60).zfill(4)
    D['P'] = D['O'][:3]+':'+D['O'][3:]
    D['T'] = 'UTC'
    D['Z'] = str(-tzo*60)

    # Full Date/Time --
    D['c'] = D['Y']+'-'+D['m']+'-'+D['d']+'\\'+D['T']+D['H']+':'+D['i']+':'+D['s']+D['P']
    D['r'] = D['D']+', '+D['d']+' '+D['M']+' '+D['Y']+' '+D['H']+':'+D['i']+':'+D['s']+' '+D['O']
    D['U'] = str(utime)

    formatted_datetime = ''
    for f in format: formatted_datetime += D[f] if f in D else f
    return formatted_datetime


sprintf_format_re = re.compile(r'%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])', re.S)
def sprintf_(fmt, args):
    global sprintf_format_re

    class nonlocal_:
        index = 0

    def do_format(m):
        match = m.group(0)
        if '%%' == match: return match

        valueIndex = m.group(1)
        flags = m.group(2)
        minWidth = m.group(3)
        precision = m.group(4)
        #precision = m.group(5)
        type = m.group(6)

        if valueIndex:
            repl = '%(arg_'+str(int(valueIndex[0:-1])-1)+')'
        else:
            repl = '%(arg_'+str(nonlocal_.index)+')'
            nonlocal_.index += 1

        if flags:
            repl += flags
        if minWidth:
            repl += minWidth
        if precision:
            repl += precision
        if type:
            repl += type
        return repl

    fmt = re.sub(sprintf_format_re, do_format, fmt)

    arguments = {}
    index = 0
    for arg in args:
        arguments['arg_'+str(index)] = arg
        index += 1

    return fmt % arguments

def sprintf(format, *args):
    #if len(args) and isinstance(args[0],(list,tuple)): args = args[0]
    #return format % tuple(args)
    return sprintf_(format, args)

def vsprintf(format, args):
    #return format % tuple(args)
    return sprintf_(format, args)

# static
def import_tpl(filename, classname, cacheDir, doReload = False):
    # http://www.php2python.com/wiki/function.import_tpl/
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
    #    exec(read_file(filename), _globals_, _locals_)
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
    # add the dynamic import path to sys
    basename = os.path.basename(filename)
    directory = os.path.dirname(filename)
    os.sys.path.append(cacheDir)
    os.sys.path.append(directory)
    #currentcwd = os.getcwd()
    #os.chdir(directory)   # change working directory so we know import will work

    if os.path.exists(filename):

        modname = basename[:-3]  # remove .py extension
        max_tries = 3
        tries = 0
        found = False
        # try to recover from module not found if created just before importing
        # retry a specified amount of times untill succeeded
        # TO FIND and FIX: still fails sometimes even with delay added and multiple retries
        while tries < max_tries and not found:
            tries += 1
            try:
                mod = __import__(modname)
                found = True
            except ModuleNotFoundError:
                found = False

            if not found: wait_ms(100) # delay 100 ms

    if found:
        if doReload: reload(mod) # Might be out of date
        # a trick in-order to pass the Contemplate super-class in a cross-module way
        getTplClass = getattr(mod, '__getTplClass__')

    # restore current dir
    #os.chdir(currentcwd)
    # remove the dynamic import path from sys
    del os.sys.path[-1]
    del os.sys.path[-1]

    # return the tplClass if found
    return getTplClass(Contemplate) if getTplClass else None

# static
def create_function(funcName, args, sourceCode, additional_symbols = dict()):
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

def reset_state():
    global _G
    _G.loops = 0
    _G.ifs = 0
    _G.loopifs = 0

    _G.allblocks = []
    _G.allblockscnt = {}
    _G.openblocks = [[None, -1]]

    _G.extends = None
    _G.uses = []
    _G.level = 0
    _G.id = 0

    _G.locals = {}
    _G.variables = {}
    _G.currentblock = '_'
    if _G.currentblock not in _G.locals: _G.locals[_G.currentblock] = {}
    if _G.currentblock not in _G.variables: _G.variables[_G.currentblock] = {}
    #_G.funcId = 0


def clear_state():
    global _G
    _G.loops = 0
    _G.ifs = 0
    _G.loopifs = 0

    _G.allblocks = []
    _G.allblockscnt = {}
    _G.openblocks = [[None, -1]]

    #_G.extends = None
    #_G.uses = []
    _G.level = 0

    _G.locals = None
    _G.variables = None
    _G.currentblock = None

    _G.id = 0
    _G.strings = None
    #_G.funcId = 0


def push_state():
    global _G
    return [_G.loops, _G.ifs, _G.loopifs, _G.level,
    _G.allblocks, _G.allblockscnt, _G.openblocks,  _G.extends, _G.locals, _G.variables, _G.currentblock, _G.uses]

def pop_state(state):
    global _G
    _G.loops = state[0]
    _G.ifs = state[1]
    _G.loopifs = state[2]
    _G.level = state[3]

    _G.allblocks = state[4]
    _G.allblockscnt = state[5]
    _G.openblocks = state[6]

    _G.extends = state[7]

    _G.locals = state[8]
    _G.variables = state[9]
    _G.currentblock = state[10]

    _G.uses = state[11]

def remove_initial_space(s):
    l = len(s)
    if l:
        initial_space = ''
        for c in s:
            if ' ' == c or "\t" == c: initial_space += c
            else: break

        sl = len(initial_space)
        if sl:
            s = s[sl:]
            pos = s.find("\n", 0);
            while -1 < pos:
                if initial_space == s[pos+1:pos+1+sl]:
                    s = s[0:pos+1] + s[pos+1+sl:]
                pos = s.find("\n", pos + 1)
    return s

def remove_blank_lines(s):
    global _G
    lines = s.split("\n")
    n = len(lines)
    start = 0
    end = n-1
    for i in range(n):
        l = lines[i]
        if len(l) and not _G.ALL_SPACE.match(l):
            start = i
            break

    for i in range(n-1, start-1, -1):
        l = lines[i]
        if len(l) and not _G.ALL_SPACE.match(l):
            end = i
            break

    return "\n".join(lines[start:end+1])

def align(s, level = None):
    global _G
    if level is None: level = _G.level
    s = remove_initial_space(s)
    l = len(s)
    if l and (0 < level):
        alignment = _G.pad * level
        aligned = alignment
        is_line_start = True
        for c in s:
            if "\n" == c:
                aligned += "\n" + alignment
                is_line_start = True
            elif is_line_start:
                # consistently replace tabs with our tabbed spaces
                if _G.SPACE.match(c):
                    aligned += _G.pad if "\t" == c else c
                else:
                    aligned += c
                    is_line_start = False
            else:
                aligned += c
    else:
        aligned = s
    return aligned


def get_separators(text, separators = None):
    global _G
    if separators:
        seps = separators.strip().split(" ")
        _G.leftTplSep = seps[0].strip()
        _G.rightTplSep = seps[1].strip()
    else:
        # tpl separators are defined on 1st (non-empty) line of tpl content
        l = len(text)
        i = 0
        pos = 0
        line = ""
        while i < l and -1 < pos and not len(line):
            pos = text.find("\n", i)
            line = text[i:pos+1].strip() if -1 < pos else ""
            i = pos+1
        if len(line):
            seps = line.split(" ")
            _G.leftTplSep = seps[0].strip()
            _G.rightTplSep = seps[1].strip()
            text = text[pos+1:]
    return text


def split_arguments(args, delim = ','):
    args = args.strip()
    l = len(args)
    if not l: return ['']
    i = 0
    a = []
    paren = []
    s = ''
    while i < l:
        c = args[i]
        i += 1
        if delim == c and not len(paren):
            a.append(s.strip())
            s = ''
            continue

        s += c
        if '(' == c:
            paren.insert(0, ')')
        elif '{' == c:
            paren.insert(0, '}')
        elif '[' == c:
            paren.insert(0, ']')
        elif ')' == c or '}' == c or ']' == c:
            if (not len(paren)) or (paren[0] != c): break
            paren.pop(0)

    if len(s): a.append(s.strip())
    if i < l: a.append(args[i:].strip())
    return a

def local_variable(variable = None, block = None, literal = False):
    global _G
    if variable is None:
        _G.id += 1
        return '_loc_' + str(_G.id)
    else:
        if block is None: block = _G.currentblock
        if not (_G.variables[block][variable] in _G.locals[block]):
            _G.locals[block][_G.variables[block][variable]] = 2 if literal else 1
        return variable


def is_local_variable(variable, block = None):
    if block is None: block = _G.currentblock
    #if variable.startswith('_loc_'): return 1
    return _G.locals[block][_G.variables[block][variable]] if _G.variables[block][variable] in _G.locals[block] else 0

#
# Control structures
#

def t_include(id):
    global _G
    contx = _G.context
    id = id.strip()
    if _G.strings and (id in _G.strings): id = _G.strings[id]
    ch = id[0]
    if ('"' == ch or "'" == ch) and (ch == id[-1]): id = id[1:-1] # quoted id

    # cache it
    if id not in contx.partials: #and (id not in _G.glob.partials):
        tpl = get_template_contents(id, contx)
        tpl = get_separators(tpl)
        state = push_state()
        reset_state()
        contx.partials[id] = ["" + parse(tpl, _G.leftTplSep, _G.rightTplSep, False) + "'" + _G.TEOL, _G.uses[:] if _G.uses else []]
        pop_state(state)
    # add usedTpls used inside include tpl to current usedTpls
    for usedTpl in contx.partials[id][1]:
        if usedTpl not in _G.uses:
            _G.uses.append(usedTpl)
    return align(contx.partials[id][0]) # if id in contx.partials else _G.glob.partials[id][0]

def t_block(block):
    global _G
    block = block.split(',')
    echoed = not(("False"==block[1].strip()) if len(block)>1 else False)
    block = block[0].strip()
    if _G.strings and (block in _G.strings): block = _G.strings[block]
    ch = block[0]
    if ('"' == ch or "'" == ch) and (ch == block[-1]): block = block[1:-1] # quoted block

    _G.allblocks.append([block, -1, -1, 0, _G.openblocks[0][1], echoed])
    if block in _G.allblockscnt: _G.allblockscnt[block] += 1
    else: _G.allblockscnt[block] = 1
    _G.blockptr = len(_G.allblocks)
    _G.openblocks[:0] = [[block, _G.blockptr-1]]
    _G.startblock = block
    _G.endblock = None
    return "' +  #BLOCK_" + block + "#"

def t_endblock(args = ''):
    global _G
    if  1 < len(_G.openblocks):
        block = _G.openblocks.pop(0)
        _G.endblock = block[0]
        _G.blockptr = block[1]+1
        _G.startblock = None
        return "#/BLOCK_" + block[0] + "#"
    return ''


#
# auxilliary parsing methods
#

def merge(m, *args):
    numargs = len(args)
    if numargs < 1: return m

    merged = m
    for arg in args:
        # http://www.php2python.com/wiki/function.array-merge/
        merged = dict(merged)
        merged.update(arg)
    return merged

def parse_constructs(match):
    global _G
    re_controls = _G.re_controls

    prefix = match.group(1) if match.group(1) else ''
    ctrl = match.group(4) if match.group(4) else (match.group(7) if match.group(7) else '')
    rest = match.group(9) if match.group(9) else ''
    startParen = match.group(8) if match.group(8) else False
    args = ''
    out = ''

    # parse parentheses and arguments, accurately
    if startParen and len(startParen):
        paren = 1
        l = len(rest)
        i = 0
        while i < l and paren > 0:

            ch = rest[i]
            i += 1
            if '(' == ch: paren += 1
            elif ')' == ch: paren -= 1
            if paren > 0: args += ch
        rest = rest[len(args)+1:]

    args = args.strip()

    if ctrl in _G.directive_aliases: ctrl = _G.directive_aliases[ctrl]
    try:
        m = _G.directives.index(ctrl)
    except:
        m = -1
    if m > -1:
        if 22==m: # local
            varname = args.strip()
            tplvarname = _G.variables[_G.currentblock][varname]
            if tplvarname in _G.reserved_var_names:
                # should be different from 'self', 'data', .. as these are used internally
                raise Contemplate.Exception('Contemplate Parse: Use of reserved name as local variable name "'+tplvarname+'"')
            local_variable(varname, None, True) # make it a literal local variable variable
            out = "'" + _G.TEOL
        elif 0==m or 20==m: # set, local_set
            args = re.sub(re_controls, parse_constructs, args)
            args = split_arguments(args, ',')
            varname = args.pop(0).strip()
            expr = ','.join(args).strip()
            if 20 == m and not is_local_variable(varname): local_variable(varname) # make it a local variable
            out = "'" + _G.TEOL + align(varname + ' = ('+ expr +')') + _G.TEOL
        elif 21==m: # get
            args = re.sub(re_controls, parse_constructs, args)
            out = prefix + 'Contemplate.get(' + args + ')'
        elif 1==m: # unset
            args = re.sub(re_controls, parse_constructs, args)
            varname = args
            if varname:
                varname = str(varname).strip()
                out = "'" + _G.TEOL + align('if ("'+varname+'__RAW__" in data): del ' + varname) + _G.TEOL
            else:
                out = "'" + _G.TEOL
        elif 2==m: # isset
            args = re.sub(re_controls, parse_constructs, args)
            varname = args
            is_local_var = is_local_variable(varname)
            out = '(("'+('' if 2 == is_local_var else '_loc_') + varname + '__RAW__" in locals()) and (' + varname + ' is not None))' if is_local_var else '(("' + varname + '__RAW__" in data) and (' + varname + ' is not None))'
        elif 3==m: # if
            args = re.sub(re_controls, parse_constructs, args)
            out = "'" + align(_G.TEOL.join([
                            ""
                            ,"if ("+args+"):"
                            ,""
                        ]))
            _G.ifs += 1
            _G.level += 1
        elif 4==m: # elseif
            args = re.sub(re_controls, parse_constructs, args)
            _G.level -= 1
            out = "'" + align(_G.TEOL.join([
                            ""
                            ,"elif ("+args+"):"
                            ,""
                        ]))
            _G.level += 1
        elif 5==m: # else
            _G.level -= 1
            out = "'" + align(_G.TEOL.join([
                            ""
                            ,"else:"
                            ,""
                        ]))
            _G.level += 1
        elif 6==m: # endif
            _G.ifs -= 1
            _G.level -= 1
            out = "'" + align(_G.TEOL.join([
                            "",""
                        ]))
        elif 7==m: # for
            args = re.sub(re_controls, parse_constructs, args)
            for_expr = args
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

            _o = local_variable()
            isAssoc = (len(kv) >= 2)

            if isAssoc:
                k = kv[0].strip()
                v = kv[1].strip()
                _oI = local_variable()
                if not is_local_variable(k):
                    local_variable(k)
                if not is_local_variable(v):
                    local_variable(v)

                # a = [51,27,13,56]   dict(enumerate(a))
                out = "'" + align(_G.TEOL.join([
                                ""
                                ,""+_o+" = "+o+""
                                ,""+_oI+" = (enumerate("+_o+") if isinstance("+_o+",(list,tuple)) else "+_o+".items()) if "+_o+" else None"
                                ,"if ("+_oI+"):"
                                ,"    for "+k+","+v+" in "+_oI+":"
                                ,""
                            ]))
                _G.level += 2

            else:
                v = kv[0].strip()
                _oV = local_variable()
                if not is_local_variable(v):
                    local_variable(v)

                out = "'" + align(_G.TEOL.join([
                                ""
                                ,""+_o+" = "+o+""
                                ,""+_oV+" = ("+_o+" if isinstance("+_o+",(list,tuple)) else "+_o+".values()) if "+_o+" else None"
                                ,"if ("+_oV+"):"
                                ,"    for "+v+" in "+_oV+":"
                                ,""
                            ]))
                _G.level += 2

            _G.loops += 1
            _G.loopifs += 1
        elif 8==m: # elsefor
            _G.loopifs -= 1
            _G.level += -2
            out = "'" + align(_G.TEOL.join([
                                ""
                                ,"else:"
                                ,""
                            ]))
            _G.level += 1
        elif 9==m: # endfor
            if _G.loopifs == _G.loops:
                _G.loops -= 1
                _G.loopifs -= 1
                _G.level += -2
                out = "'" + align(_G.TEOL.join([
                                "",""
                            ]))
            else:
                _G.loops -= 1
                _G.level += -1
                out = "'" + align(_G.TEOL.join([
                                "",""
                            ]))
        elif 10==m: # extends
            id = args.strip()
            if _G.strings and (id in _G.strings): id = _G.strings[id]
            ch = id[0]
            if ('"' == ch or "'" == ch) and (ch == id[-1]): id = id[1:-1] # quoted id
            _G.extends = id
            out = "'" + _G.TEOL
        elif 11==m: # block
            out = t_block(args)
        elif 12==m: # endblock
            out = t_endblock()
        elif 13==m: # import_tpl
            out = t_include(args)
        elif 14==m: # super
            args = re.sub(re_controls, parse_constructs, args)
            out = prefix + 'self_.sprblock(' + args + ', data)'
        elif 15==m: # getblock
            args = re.sub(re_controls, parse_constructs, args)
            out = prefix + '__i__.block(' + args + ', data)'
        elif 16==m: # iif
            args = split_arguments(re.sub(re_controls, parse_constructs, args),',')
            out = prefix + "(("+args[1]+") if ("+args[0]+") else ("+args[2]+"))"
        elif 17==m: #empty
            args = re.sub(re_controls, parse_constructs, args)
            varname = args
            is_local_var = is_local_variable(varname)
            out = prefix + ('(("' + ('' if 2 == is_local_var else '_loc_') + varname + '__RAW__" not in locals()) or ('+varname+' is None) or Contemplate.empty('+varname+'))' if is_local_var else '(("' + varname + '__RAW__" not in data) or ('+varname+' is None) or Contemplate.empty('+varname+'))')
        elif 18==m or 19==m: #'continue','break'
            out = "'" + _G.TEOL + align('continue' if 18==m else 'break') + _G.TEOL

        return out + re.sub(re_controls, parse_constructs, rest)

    if (ctrl in _G.context.plugins) or (ctrl in _G.glob.plugins):
        pl = _G.context.plugins[ctrl] if ctrl in _G.context.plugins else _G.glob.plugins[ctrl]
        args = re.sub(re_controls, parse_constructs, args)
        out = pl.render([args]+split_arguments(args,',')) if isinstance(pl,Contemplate.InlineTemplate) else 'Contemplate.plg_("' + ctrl + '"' + ('' if not len(args) else ','+args) + ')'
        return prefix + out + re.sub(re_controls, parse_constructs, rest)

    if ctrl in _G.aliases: ctrl = _G.aliases[ctrl]
    args = re.sub(re_controls, parse_constructs, args)
    # aliases and builtin functions
    if 's'==ctrl:
        out = 'str(' + args + ')'
    elif 'n'==ctrl:
        out = 'int(' + args + ')'
    elif 'f'==ctrl:
        out = 'float(' + args + ')'
    elif 'q'==ctrl:
        out = '"\'"+str(' + args + ')+"\'"'
    elif 'qq'==ctrl:
        out = '\'"\'+str(' + args + ')+\'"\''
    elif 'concat'==ctrl:
        out = 'str('+')+str('.join(split_arguments(args, ','))+')'
    elif 'is_array'==ctrl:
        args = split_arguments(args, ',')
        if len(args) > 1:
            out = "(isinstance("+args[0]+",list) if ("+args[1]+") else isinstance("+args[0]+",(list,tuple,dict)))"
        else:
            out = "isinstance("+args[0]+",(list,tuple,dict))"
    elif 'in_array'==ctrl:
        args = split_arguments(args, ',')
        out = "(("+args[0]+") in ("+args[1]+"))"
    else:
        if 'tpl'==ctrl:
            args2 = split_arguments(args, ',')
            usedTpl = args2[0]
            if usedTpl.startswith('#STR_') and usedTpl in _G.strings:
                # only literal string support here
                usedTpl = _G.strings[usedTpl][1:-1] # without quotes
                if usedTpl not in _G.uses:
                    _G.uses.append(usedTpl)
        if hasattr(Contemplate, ctrl) and callable(getattr(Contemplate, ctrl)):
            out = 'Contemplate.' + ctrl + '(' + args + ')'
        else:
            out = ctrl + ('('+args+')' if startParen else '')

    return prefix + out + re.sub(re_controls, parse_constructs, rest)


def parse_blocks(s):
    global _G
    blocks = []
    bl = len(_G.allblocks)
    EOL = _G.TEOL
    while bl:
        bl -= 1
        delims = _G.allblocks[bl]

        block = delims[0]
        pos1 = delims[1]
        pos2 = delims[2]
        off = delims[3]
        containerblock = delims[4]
        echoed = delims[5]
        tag = "#BLOCK_" + block + "#"
        rep = "__i__.block('" + block + "', data)" if echoed else "''"
        tl = len(tag)
        rl = len(rep)

        if -1 < containerblock:
            # adjust the ending position of the container block (if nested)
            # to compensate for the replacements in this (nested) block
            _G.allblocks[containerblock][3] += rl - (pos2-pos1+1)

        # adjust the ending position of this block (if nested)
        # to compensate for the replacements of any (nested) block(s)
        pos2 += off

        if 1 == _G.allblockscnt[block]:

            # 1st occurance, block definition
            blocks.append([block, _G.TT_BLOCK.render({
             'BLOCKCODE'     : s[pos1+tl:pos2-tl-1] + "'"
            })])

        s = s[0:pos1] + rep + s[pos2+1:]
        if 1 <= _G.allblockscnt[block]: _G.allblockscnt[block] -= 1

    #_G.allblocks = None
    #_G.allblockscnt = None
    #_G.openblocks = None
    return [s, blocks]


def parse_variable(s, i, l):
    global _G
    if _G.ALPHA.match(s[i]):
        strings = {}
        variables = []
        space = 0
        hasStrings = False

        # main variable
        variable = s[i]
        i += 1
        while i < l and _G.ALPHANUM.match(s[i]):
            variable += s[i]
            i += 1

        variable_raw = variable
        # transform into tpl variable
        variable_main = "data['" + variable_raw + "']"
        variable_rest = ""
        _G.id += 1
        id = "#VAR_"+str(_G.id)+"#"
        _len = len(variable_raw)
        _G.variables[_G.currentblock][id] = variable_raw

        # extra space
        space = 0
        while i < l and _G.SPACE.match(s[i]):
            space += 1
            i += 1

        # optional properties
        while i < l and ('.' == s[i] or '[' == s[i] or '->' == s[i:i+2]):
            delim = s[i]
            i += 1
            # -> (php) object notation property
            if '-' == delim:
                delim += s[i]
                i += 1

            # extra space
            while i < l and _G.SPACE.match(s[i]):
                space += 1
                i += 1

            # alpha-numeric dot property
            if '.' == delim:
                # property
                property = ''
                while i < l and _G.ALPHANUM.match(s[i]):
                    property += s[i]
                    i += 1

                lp = len(property)
                if lp:
                    # transform into tpl variable bracketed property
                    variable_rest += "['" + property + "']"
                    _len += space + 1 + lp
                    space = 0
                else:
                    break

            # alpha-numeric (php) object notation property
            elif '->' == delim:
                # property
                property = ''
                while i < l and _G.ALPHANUM.match(s[i]):
                    property += s[i]
                    i += 1

                lp = len(property)
                if lp:
                    # transform into tpl variable object property
                    variable_rest += "." + property + ""
                    _len += space + 2 + lp
                    space = 0
                else:
                    break

            # bracketed property
            elif '[' == delim:
                bracket = ''
                while i < l:
                    ch = s[i]

                    # spaces
                    if _G.SPACE.match(ch):
                        space += 1
                        i += 1

                    # literal string property
                    elif '"' == ch or "'" == ch:
                        #property = parse_string( s, ch, i+1, l )
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
                        strid = "#STR_"+str(_G.id)+"#"
                        strings[strid] = property
                        lp = len(property)
                        i += lp
                        _len += space + lp
                        space = 0
                        hasStrings = True
                        bracket += strid

                    # numeric array property
                    elif _G.NUM.match(ch):
                        property = s[i]
                        i += 1
                        while i < l and _G.NUM.match(s[i]):
                            property += s[i]
                            i += 1

                        lp = len(property)
                        _len += space + lp
                        space = 0
                        bracket += property

                    # sub-variable as property
                    elif '$' == ch:
                        sub = s[i+1:]
                        subvariables = parse_variable(sub, 0, len(sub))
                        if subvariables:
                            # transform into tpl variable property
                            property = subvariables[-1]
                            lp = property[4]
                            i += lp + 1
                            _len += space + 1 + lp
                            space = 0
                            variables = variables + subvariables
                            hasStrings = hasStrings or property[5]
                            bracket += property[0]
                        else:
                            bracket += ch
                            _len += 1
                            i += 1

                    # identifiers
                    elif _G.ALPHA.match(ch):
                        _len += space + 1
                        i += 1
                        if space > 0:
                            bracket += " "
                            space = 0
                        is_prop_access = (2<i and '-'==s[i-3] and '>'==s[i-2])
                        tok = ch
                        while i < l:
                            ch = s[i]
                            if _G.ALPHANUM.match(ch):
                                i += 1
                                _len += 1
                                tok += ch
                            else: break
                        if 'null' == tok: tok = 'None'
                        elif 'false' == tok: tok = 'False'
                        elif 'true' == tok: tok = 'True'
                        elif 'as' != tok and 'in' != tok and not is_prop_access: tok = '#ID_'+tok+'#'
                        bracket += tok

                    # close bracket
                    elif ']' == ch:
                        variable_rest += delim + re.sub(_G.re_controls, parse_constructs, bracket) + ch
                        _len += space + 2
                        space = 0
                        i += 1
                        break

                    # rest
                    else:
                        bracket += ch
                        _len += 1
                        i += 1


            # extra space
            while i < l and _G.SPACE.match(s[i]):
                space += 1
                i += 1

        variables.append([id, variable_raw, variable_main, variable_rest, _len, hasStrings, strings])
        return variables
    return None

str_re = re.compile(r'#STR_\d+#', re.M|re.S)
def parse(tpl, leftTplSep, rightTplSep, withblocks = True):
    global _G
    global str_re

    re_controls = _G.re_controls
    ALPHA = _G.ALPHA
    ALPHANUM = _G.ALPHANUM
    compatibility_mode = False
    non_compatibility_mode = True

    t1 = leftTplSep
    l1 = len(t1)
    t2 = rightTplSep
    l2 = len(t2)
    parsed = ''
    while tpl and len(tpl):
        p1 = tpl.find(t1)
        if -1 == p1:
            s = tpl
            if _G.escape: s = s.replace("\\", "\\\\")  # escape escapes
            s = s.replace("'", "\\'")  # escape single quotes accurately (used by parse function)
            s = s.replace("\n", _G.preserveLines) # preserve lines
            #s = re.sub(_G.NL, _G.preserveLines, s) # preserve lines
            parsed += s
            break

        p2 = tpl.find(t2, p1+l1)
        if -1 == p2: p2 = len(tpl)

        if p1 > 0:
            s = tpl[0:p1]
            if _G.escape: s = s.replace("\\", "\\\\")  # escape escapes
            s = s.replace("'", "\\'")  # escape single quotes accurately (used by parse function)
            s = s.replace("\n", _G.preserveLines) # preserve lines
            #s = re.sub(_G.NL, _G.preserveLines, s) # preserve lines
            parsed += s

        # php literal code block
        isphp = 'php:' == tpl[p1+l1:p1+l1+4]
        # js literal code block
        isjs = 'js:' == tpl[p1+l1:p1+l1+3]
        # py literal code block
        ispy = 'py:' == tpl[p1+l1:p1+l1+3]
        if isphp or isjs or ispy:
            # include if in same language else ignore
            if ispy:
                if '=' == tpl[p1+l1+3:p1+l1+4]:
                    parsed += "'" + align("\n# py code start") + align("\n__p__ += str(" + tpl[p1+l1+4:p2].strip() + ")") + align("\n# py code end\n__p__ += '")
                else:
                    indent = 0
                    l3 = 0
                    indenttype = 'none'
                    m = _G.INDENT.match(tpl[p1+l1+3:])
                    if m:
                        indenttype = m.group(1)
                        indent = int(m.group(2))
                        l3 = len(m.group(0))
                    code = remove_blank_lines(tpl[p1+l1+3+l3:p2])
                    if 'predent' == indenttype:
                        _G.level = max(0, _G.level + indent)
                    parsed += "' " + align("\n# py code start")
                    if len(code.strip()):
                        parsed += "\n" + align(code)
                    if 'postdent' == indenttype:
                        _G.level = max(0, _G.level + indent)
                    parsed += align("\n# py code end\n__p__ += '")


            tpl = tpl[p2+l2:]
            continue

        # template TAG
        s = tpl[p1+l1:p2]
        tpl = tpl[p2+l2:]

        # parse each template tag section accurately
        # refined parsing
        count = len(s)
        index = 0
        ch = ''
        out = ''
        variables = []
        strings = {}
        hasVariables = False
        hasStrings = False
        hasBlock = False
        space = 0
        while index < count:
            ch = s[index]
            index  += 1

            # variable
            if '$' == ch:
                if space > 0:
                    out += " "
                    space = 0
                tok = parse_variable(s, index, count)
                if tok:
                    for tokv in tok:
                        id = tokv[0]
                        #_G.variables[_G.currentblock][id] = tokv[1]
                        if tokv[6]: strings.update(tokv[6])
                    out += id
                    index += tokv[4]
                    variables = variables + tok
                    hasVariables = True
                    hasStrings = hasStrings or tokv[6]
                else:
                    out += '$'

            # literal string
            elif '"' == ch or "'" == ch:
                if space > 0:
                    out += " "
                    space = 0
                #tok = parse_string(s, ch, index, count)
                q = ch
                str_ = q
                escaped = False
                si = index
                while si < count:
                    ch = s[si]
                    si += 1
                    str_ += ch
                    if q == ch and not escaped:  break
                    escaped = (not escaped and '\\' == ch)
                tok = str_
                _G.id += 1
                id = "#STR_"+str(_G.id)+"#"
                strings[id] = tok
                out += id
                index += len(tok)-1
                hasStrings = True

            # spaces
            elif "\n" == ch or "\r" == ch or "\t" == ch or "\v" == ch or "\0" == ch:
                space += 1

            # directive or identifier or atom in compatibility mode
            elif '%' == ch:
                if space > 0:
                    out += " "
                    space = 0

                q = ch
                if non_compatibility_mode or index >= count:
                    out += q
                    continue

                ch = s[index]
                if ALPHA.match(ch):
                    index += 1
                    tok = ch
                    while index < count:
                        ch = s[index]
                        if ALPHANUM.match(ch):
                            index += 1
                            tok += ch
                        else: break
                    tok = '#ID_'+tok+'#'
                    out += tok
                else:
                    out += q

            # directive or identifier or atom
            elif non_compatibility_mode and ALPHA.match(ch):
                if space > 0:
                    out += " "
                    space = 0
                is_prop_access = (2<index and '-'==s[index-3] and '>'==s[index-2])
                tok = ch
                while index < count:
                    ch = s[index]
                    if ALPHANUM.match(ch):
                        index += 1
                        tok += ch
                    else: break
                if 'null' == tok: tok = 'None'
                elif 'false' == tok: tok = 'False'
                elif 'true' == tok: tok = 'True'
                elif 'as' != tok and 'in' != tok and not is_prop_access: tok = '#ID_'+tok+'#'
                out += tok

            # rest, bypass
            else:
                if space > 0:
                    out += " "
                    space = 0
                out += ch

        # fix literal data notation python-style
        if compatibility_mode: out = out.replace('true', 'True').replace('false', 'False').replace('null', 'None')
        # fix literal data notation, not needed here
        #out = str_replace(array('{', '}', '[', ']', ':'), array('array(', ')','array(', ')', '=>'), out);
        # fix pending "->" arrow notation for variable object
        out = out.replace('->', '.')
        out = re.sub(_G.T_NOT, r'\1 not \3', re.sub(_G.T_OR, r'\1 or \3', re.sub(_G.T_AND, r'\1 and \3', out)))

        tag = "\t" + out + "\v"

        _G.startblock = None
        _G.endblock = None
        _G.blockptr = -1
        _G.strings = strings

        # replace constructs, functions, etc..
        tag = re.sub(re_controls, parse_constructs, tag)

        # check for blocks
        if _G.startblock:
            _G.startblock = "#BLOCK_"+_G.startblock+"#"
            hasBlock = True
        elif _G.endblock:
            _G.endblock = "#/BLOCK_"+_G.endblock+"#"
            hasBlock = True
        notFoundBlock = hasBlock

        # replacements
        if "\t" == tag[0] and "\v" == tag[-1]:
            tag = "' + str("+tag[1:-1].strip()+") + '"

        if hasVariables:
            # replace variables
            for v in reversed(variables):
                id = v[0]
                varname = v[1]
                tag = tag.replace(id+'__RAW__', varname)
                if varname in _G.locals[_G.currentblock]: # local (loop) variable
                    tag = tag.replace(id, ('' if 2 == _G.locals[_G.currentblock][varname] else '_loc_')+varname+v[3])
                else: # default (data) variable
                    tag = tag.replace(id, v[2]+v[3])

        if hasStrings:
            # replace strings (accurately)
            tagTpl = InlineTemplate.multisplit_re(tag, str_re)
            tag = ''
            for v in tagTpl:
                if v[0]:
                    # and replace blocks (accurately)
                    if notFoundBlock:
                        if _G.startblock:
                            blockTag = v[1].find(_G.startblock)
                            if -1 != blockTag:
                                _G.allblocks[_G.blockptr-1][1] = blockTag + len(parsed) + len(tag)
                                notFoundBlock = False
                        else: #if _G.endblock:
                            blockTag = v[1].find(_G.endblock)
                            if -1 != blockTag:
                                _G.allblocks[_G.blockptr-1][2] = blockTag + len(parsed) + len(tag) + len(_G.endblock)
                                notFoundBlock = False
                    tag += v[1]
                else:
                    tag += strings[v[1]]
        elif hasBlock:
            # replace blocks (accurately)
            if _G.startblock:
                _G.allblocks[_G.blockptr-1][1] = len(parsed) + tag.find(_G.startblock)
            else: #if _G.endblock:
                _G.allblocks[_G.blockptr-1][2] = len(parsed) + tag.find(_G.endblock) + len(_G.endblock)


        # replace tpl separators
        if "\v" == tag[-1]:
            tag = tag[0:-1] + align(_G.tplEnd)
        if "\t" == tag[0]:
            tag = _G.tplStart + tag[1:]
            if hasBlock:
                # update blocks (accurately)
                blockTag = len(_G.tplStart)-1
                if _G.startblock:
                    _G.allblocks[_G.blockptr-1][1] += blockTag
                else: #if _G.endblock:
                    _G.allblocks[_G.blockptr-1][2] += blockTag

        parsed += tag

    return (parse_blocks(parsed) if len(_G.allblocks)>0 else [parsed, []]) if False != withblocks else parsed

def get_cached_template_name(id, ctx, cacheDir):
    global _G
    if -1 != id.find('/') or -1 != id.find('\\'):
        filename = os.path.basename(id)
        path = os.path.dirname(id.rstrip(os.pathsep).rstrip('/\\')).strip('/\\')
        if len(path): path += '/'
    else:
        filename = id
        path = ''
    return os.path.join(cacheDir, path + re.sub(_G.UNDERL, '_', filename) + '_tpl__' + re.sub(_G.UNDERL, '_', ctx) + '.py')

def get_cached_template_class(id, ctx):
    global _G
    if -1 != id.find('/') or -1 != id.find('\\'):
        filename = os.path.basename(id)
    else:
        filename = id
    return 'Contemplate_' + re.sub(_G.UNDERL, '_', filename) + '__' + re.sub(_G.UNDERL, '_', ctx)

def get_template_contents(id, contx):
    global _G

    if not Contemplate.hasTpl(id, contx.id):
        found = Contemplate.findTpl(id, contx.id)
        if not found: return ''
        tpldef = {}
        tpldef[id] = found
        Contemplate.add(tpldef, contx.id)

    if id in contx.templates: template = contx.templates[id]
    elif id in _G.glob.templates: template = _G.glob.templates[id]
    else: return ''

    if template[1]: return template[0] # inline tpl
    elif os.path.exists(template[0]): return read_file(template[0], contx.encoding)
    return ''

def create_template_render_function(id, contx, seps = None):
    global _G

    tpl = get_template_contents(id, contx)
    tpl = get_separators(tpl, seps)
    reset_state()
    blocks = parse(tpl, _G.leftTplSep, _G.rightTplSep)
    clear_state()

    renderf = blocks[0]
    blocks = blocks[1]

    EOL = _G.TEOL

    func = _G.TT_FUNC.render({
     'FCODE'        : "" if _G.extends else "__p__ += '" + renderf + "'"
    })

    _G.funcId += 1

    funcName = '_contemplateFn' + str(_G.funcId)
    fn = create_function(funcName, 'data,self_,__i__', align(func, 1), {'Contemplate': Contemplate})

    blockfns = {}
    for b in blocks:
        funcName = '_contemplateBlockFn_' + b[0] + '_' + str(_G.funcId)
        blockfns[b] = create_function(funcName, 'data,self_,__i__', align(b[1], 1), {'Contemplate': Contemplate})

    return [fn, blockfns]

def create_cached_template(id, contx, filename, classname, seps = None):
    global _G

    tpl = get_template_contents(id, contx)
    tpl = get_separators(tpl, seps)
    reset_state()
    blocks = parse(tpl, _G.leftTplSep, _G.rightTplSep)
    clear_state()

    renderf = blocks[0]
    blocks = blocks[1]

    EOL = _G.TEOL

    # tpl-defined blocks
    sblocks = ''
    for b in blocks:
        sblocks += EOL + _G.TT_BlockCode.render({
         'BLOCKNAME'            : b[0]
        ,'BLOCKMETHODNAME'      : "_blockfn_"+b[0]
        ,'BLOCKMETHODCODE'      : align(b[1], 1)
        })

    renderCode = _G.TT_RCODE.render({
     'RCODE'                : "__p__ = ''" if _G.extends else "__p__ += '" + renderf + "'"
    })
    extendCode = "self_.extend('"+_G.extends+"')" if _G.extends else ''
    extendCode += EOL + "self_._usesTpl = ["+("'"+"','".join(_G.uses)+"'" if len(_G.uses) else '')+"]"
    prefixCode = contx.prefix if contx.prefix else ''

    # generate tpl class
    classCode = _G.TT_ClassCode.render({
     'PREFIXCODE'           : prefixCode
    ,'TPLID'                : id
    ,'CLASSNAME'            : classname
    ,'EXTENDCODE'           : align(extendCode, 3)
    ,'BLOCKS'               : align(sblocks, 2)
    ,'RENDERCODE'           : align(renderCode, 4)
    })
    return write_file(filename, classCode, contx.encoding)

def get_cached_template(id, contx, options = dict()):
    global _G
    # inline templates saved only in-memory
    if id in contx.templates: template = contx.templates[id]
    elif id in _G.glob.templates: template = _G.glob.templates[id]
    else: template = None

    if not options: options = {'context':contx.id,'autoUpdate':False}
    parsed = options['parsed'] if 'parsed' in options else None
    if 'parsed' in options: del options['parsed']

    if template:
        # inline templates saved only in-memory
        if template[1]:
            # dynamic in-memory caching during page-request
            tpl = Contemplate.Template()
            tpl.setId(id).ctx(contx)
            if parsed:
                _G.funcId += 1
                tpl.setRenderFunction(create_function('_contemplateFn' + str(_G.funcId), 'data,self_,__i__', align(parsed, 1), {'Contemplate': Contemplate}))
            else:
                fns = create_template_render_function(id, contx, options['separators'])
                tpl.setRenderFunction(fns[0]).setBlocks(fns[1]).usesTpl(_G.uses)
            sprTpl = _G.extends
            if sprTpl: tpl.extend(Contemplate.tpl(sprTpl, None, options))
            return tpl

        CM = contx.cacheMode

        if True != options['autoUpdate'] and CM == Contemplate.CACHE_TO_DISK_NOUPDATE:

            cachedTplFile = get_cached_template_name(id, contx.id, contx.cacheDir)
            cachedTplClass = get_cached_template_class(id, contx.id)
            exists = os.path.isfile(cachedTplFile)
            if not exists:
                # if not exist, create it
                if -1 != id.find('/') or -1 != id.find('\\'):
                    fname = os.path.basename(id)
                    fpath = os.path.dirname(id.rstrip(os.pathsep).rstrip('/\\')).strip('/\\')
                else:
                    fname = id
                    fpath = ''
                if len(fpath): create_path(fpath, contx.cacheDir)
                create_cached_template(id, contx, cachedTplFile, cachedTplClass, options['separators'])
            if os.path.isfile(cachedTplFile):
                tpl = import_tpl(cachedTplFile, cachedTplClass, contx.cacheDir)()
                tpl.setId(id).ctx(contx)
                return tpl
            return None


        elif True == options['autoUpdate'] or CM == Contemplate.CACHE_TO_DISK_AUTOUPDATE:

            cachedTplFile = get_cached_template_name(id, contx.id, contx.cacheDir)
            cachedTplClass = get_cached_template_class(id, contx.id)
            exists = os.path.isfile(cachedTplFile)
            if not exists or (os.path.getmtime( cachedTplFile ) <= os.path.getmtime(template[0])):
                # if tpl not exist or is out-of-sync (re-)create it
                if not exists:
                    if -1 != id.find('/') or -1 != id.find('\\'):
                        fname = os.path.basename(id)
                        fpath = os.path.dirname(id.rstrip(os.pathsep).rstrip('/\\')).strip('/\\')
                    else:
                        fname = id
                        fpath = ''
                    if len(fpath): create_path(fpath, contx.cacheDir)
                create_cached_template(id, contx, cachedTplFile, cachedTplClass, options['separators'])
            if os.path.isfile(cachedTplFile):
                tpl = import_tpl(cachedTplFile, cachedTplClass, contx.cacheDir)()
                tpl.setId(id).ctx(contx)
                return tpl
            return None

        else:

            # dynamic in-memory caching during page-request
            fns = create_template_render_function(id, contx, options['separators'])
            tpl = Contemplate.Template(id)
            tpl.ctx(contx).setRenderFunction(fns[0]).setBlocks(fns[1]).usesTpl(_G.uses)
            sprTpl = _G.extends
            if sprTpl: tpl.extend(Contemplate.tpl(sprTpl, None, options))
            return tpl

    return None


def split_and_filter(r, s, regex = True):
    return list(filter(lambda x: 0<len(x), map(lambda x: x.strip(), re.split(r, s) if regex else s.split(r))))


def create_path(path, root = '', mode = 0o755):
    global _G
    path = path.strip()
    if not len(path): return
    parts = split_and_filter(_G.DS_RE, path)
    current = root.rstrip('/\\')
    for part in parts:
        current += '/' + part
        if not os.path.exists(current):
            os.mkdir(current, mode)

class ContemplateException(Exception):
    pass

class InlineTemplate:

    def multisplit(tpl, reps = dict(), as_array = False):
        #as_array = isinstance(reps, (list,tuple))
        a = [[1, tpl]]
        items = enumerate(reps) if as_array else reps.items()
        for r,s in items:
            c = []
            sr = s if as_array else r
            s = [0, s]
            for ai in a:
                if 1 == ai[0]:
                    b = ai[1].split(sr)
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

    def multisplit_re(tpl, rex):
        a = [ ]
        i = 0
        m = rex.search(tpl, i)
        while m:
            a.append([1, tpl[i:m.start()]])
            try:
                mg = m.group(1)
            except:
                mg = m.group(0)

            is_numeric = False
            try:
                mn = int(mg,10)
                is_numeric = False if math.isnan(mn) else True
            except ValueError:
                is_numeric = False
            a.append([0, mn if is_numeric else mg])
            i = m.end()
            m = rex.search(tpl, i)
        a.append([1, tpl[i:]])
        return a

    def compile(tpl):
        global _G
        l = len(tpl)
        out = 'return ('
        for s in tpl:

            notIsSub = s[0]
            s = s[ 1 ]
            if notIsSub: out += "'" + re.sub(_G.NEWLINE, "' + \"\\\\n\" + '", re.sub(_G.SQUOTE, "\\'", s)) + "'"
            else: out += " + str(args['" + s + "']) + "

        out += ')'
        _G.funcId += 1
        funcName = '_contemplateInlineFn' + str(_G.funcId)
        return create_function(funcName, 'args', '    ' + out, {})

    def __init__(self, tpl = '', replacements = None, compiled = False):
        if not replacements: replacements = {}
        self.id = None
        self._renderer = None
        self._parsed = False # lazy init, only if needed, as and when needed
        self._args = [tpl, replacements, compiled]
        self.tpl = None

    def __del__(self):
        self.dispose()

    def dispose(self):
        self.id = None
        self.tpl = None
        self._renderer = None
        self._parsed = None
        self._args = None
        return self

    def render(self, args = None):
        if not args: args = []

        if not self._parsed: # lazy init, only if needed, as and when needed
            tpl = self._args[0]
            replacements = self._args[1]
            compiled = self._args[2]
            self.tpl = InlineTemplate.multisplit_re(tpl, replacements) if isinstance(replacements, T_REGEXP) else InlineTemplate.multisplit(tpl, replacements)
            if compiled is True: self._renderer = InlineTemplate.compile(self.tpl)
            self._args = None
            self._parsed = True

        if callable(self._renderer): return self._renderer(args)

        tpl = self.tpl
        out = ''
        for s in tpl:

            notIsSub = s[0]
            s = s[1]
            out += str(s) if notIsSub else str(args[s])

        return out



class Template:

    def __init__(self, id = None):
        self._renderer = None
        self._blocks = None
        self._extends = None
        self._usesTpl = None
        self._ctx = None
        self._autonomus = False
        self.id = None
        if id is not None: self.id = id

    def __del__(self):
        self.dispose()

    def dispose(self):
        self._renderer = None
        self._blocks = None
        self._extends = None
        self._usesTpl = None
        self._ctx = None
        self._autonomus = None
        self.id = None
        return self

    def setId(self, id = None):
        if id is not None: self.id = id
        return self

    def ctx(self, ctx):
        self._ctx = ctx
        return self

    def autonomus(self, enable = True):
        self._autonomus = bool(enable)
        return self

    def extend(self, tpl):
        self._extends = Contemplate.tpl(tpl) if tpl and isinstance(tpl, str) else (tpl if isinstance(tpl, Template) else None)
        return self

    def usesTpl(self, usesTpls):
        self._usesTpl = [usesTpls] if isinstance(usesTpls,str) else usesTpls
        return self

    def setBlocks(self, blocks):
        if not self._blocks: self._blocks = {}
        self._blocks = Contemplate.merge(self._blocks, blocks)
        return self

    def setRenderFunction(self, renderFunc = None):
        self._renderer = renderFunc if callable(renderFunc) else None
        return self

    def sprblock(self, block, data):
        #if not __i__: __i__ = self
        if self._extends:
            return self._extends.block(block, data, self._extends)
        return ''

    def block(self, block, data, __i__ = None):
        __ctx = False
        r = ''
        if not __i__:
            __i__ = self
            if not self._autonomus: __ctx = Contemplate._set_ctx(self._ctx)

        if (self._blocks) and (block in self._blocks) and callable(self._blocks[block]):
            blockfunc = self._blocks[block]
            r = blockfunc(data, self, __i__)
        elif self._extends:
            r = self._extends.block(block, data, __i__)

        if __ctx: Contemplate._set_ctx(__ctx)
        return r

    def render(self, data, __i__ = None):
        __ctx = False
        __p__ = ''
        if not __i__:
            __i__ = self
            if not self._autonomus: __ctx = Contemplate._set_ctx(self._ctx)

        if self._extends:
            __p__ = self._extends.render(data, __i__)
        elif callable(self._renderer):
            # dynamic function
            __p__ = self._renderer(data, self, __i__)

        if __ctx: Contemplate._set_ctx(__ctx)
        return __p__

    # aliases
    def renderBlock(self, block, data, __i__ = None):
        return self.block(self, block, data, __i__)

    def renderSuperBlock(self, block, data):
        return self.sprblock(self, block, data)

class Ctx:

    def __init__(self, id):
        self.id               = id
        self.cacheDir         = './'
        self.cacheMode        = 0
        self.cache            = {}
        self.templateDirs     = []
        self.templateFinder   = None
        self.templates        = {}
        self.partials         = {}
        self.plugins          = {}
        self.prefix           = ''
        self.encoding         = 'utf-8'

    def __del__(self):
        self.dispose()

    def dispose(self):
        self.id = None
        self.cacheDir = None
        self.cacheMode = None
        self.templateDirs = None
        self.templateFinder = None
        self.templates = None
        self.partials = None
        self.plugins = None
        self.prefix = None
        self.encoding = None
        if self.cache:
            for tpl in self.cache: self.cache[tpl].dispose()
        self.cache = None

#
# The Contemplate Engine Main Python Class
#
class Contemplate:
    """
    Contemplate Template Engine for Python,
    https://github.com/foo123/Contemplate
    """

    # constants (not real constants in Python)
    VERSION = "1.6.0"

    CACHE_TO_DISK_NONE = 0
    CACHE_TO_DISK_AUTOUPDATE = 2
    CACHE_TO_DISK_NOUPDATE = 4

    Exception = ContemplateException
    InlineTemplate = InlineTemplate
    Template = Template
    Ctx = Ctx

    #
    #

    def init():
        global _G

        if _G.isInited: return

        # a default global context
        _G.glob = Ctx('global')
        _G.ctx = {
        'global'  : _G.glob
        }
        _G.context = _G.glob

        # pre-compute the needed regular expressions
        _G.preserveLines = _G.preserveLinesDefault
        _G.tplStart = "'" + _G.TEOL
        _G.tplEnd = _G.TEOL + "__p__ += '"

        # make compilation templates
        _G.TT_ClassCode = InlineTemplate(_G.TEOL.join([
            "# -*- coding: UTF-8 -*-"
            ,"#PREFIXCODE#"
            ,"# Contemplate cached template '#TPLID#'"
            ,"def __getTplClass__(Contemplate):"
            ,"    # extends the main Contemplate.Template class"
            ,"    class #CLASSNAME#(Contemplate.Template):"
            ,"        'Contemplate cached template #TPLID#'"
            ,"        # constructor"
            ,"        def __init__(self, id = None):"
            ,"            self_ = self"
            ,"            super(#CLASSNAME#, self).__init__(id)"
            ,"            # extend tpl assign code starts here"
            ,"#EXTENDCODE#"
            ,"            # extend tpl assign code ends here"
            ,"        # tpl-defined blocks render code starts here"
            ,"#BLOCKS#"
            ,"        # tpl-defined blocks render code ends here"
            ,"        # render a tpl block method"
            ,"        def block(self, block, data, __i__ = None):"
            ,"            self_ = self"
            ,"            __ctx = False"
            ,"            r = ''"
            ,"            if not __i__:"
            ,"                __i__ = self_"
            ,"                if not self_._autonomus: __ctx = Contemplate._set_ctx(self_._ctx)"
            ,"            method = '_blockfn_' + block"
            ,"            if (hasattr(self_, method) and callable(getattr(self_, method))):"
            ,"                r = getattr(self_, method)(data, self_, __i__)"
            ,"            elif self_._extends:"
            ,"                r = self_._extends.block(block, data, __i__)"
            ,"            if __ctx:  Contemplate._set_ctx(__ctx)"
            ,"            return r"
            ,"        # render method"
            ,"        def render(self, data, __i__ = None):"
            ,"            self_ = self"
            ,"            __ctx = False"
            ,"            __p__ = ''"
            ,"            if not __i__:"
            ,"                __i__ = self_"
            ,"                if not self._autonomus: __ctx = Contemplate._set_ctx(self_._ctx)"
            ,"            if self_._extends:"
            ,"                __p__ = self_._extends.render(data, __i__)"
            ,""
            ,"            else:"
            ,"                # tpl main render code starts here"
            ,"#RENDERCODE#"
            ,"                # tpl main render code ends here"
            ,""
            ,"            if __ctx:  Contemplate._set_ctx(__ctx)"
            ,"            return __p__"
            ,"    return #CLASSNAME#"
            ,"# allow to 'import *'  from this file as a module"
            ,"__all__ = ['__getTplClass__']"
            ,""
        ]), {
             "#PREFIXCODE#"         : "PREFIXCODE"
            ,"#CLASSNAME#"          : "CLASSNAME"
            ,"#TPLID#"              : "TPLID"
            ,"#BLOCKS#"             : "BLOCKS"
            ,"#EXTENDCODE#"         : "EXTENDCODE"
            ,"#RENDERCODE#"         : "RENDERCODE"
        }, False)

        _G.TT_BlockCode = InlineTemplate(_G.TEOL.join([
            ""
            ,"# tpl block render method for block '#BLOCKNAME#'"
            ,"def #BLOCKMETHODNAME#(self, data, self_, __i__):"
            ,"#BLOCKMETHODCODE#"
            ,""
        ]), {
             "#BLOCKNAME#"          : "BLOCKNAME"
            ,"#BLOCKMETHODNAME#"    : "BLOCKMETHODNAME"
            ,"#BLOCKMETHODCODE#"    : "BLOCKMETHODCODE"
        }, False)

        _G.TT_BLOCK = InlineTemplate(_G.TEOL.join([
            ""
            ,"__p__ = ''"
            ,"#BLOCKCODE#"
            ,"return __p__"
            ,""
        ]), {
             "#BLOCKCODE#"          : "BLOCKCODE"
        }, False)

        _G.TT_FUNC = InlineTemplate(_G.TEOL.join([
            ""
            ,"__p__ = ''"
            ,"#FCODE#"
            ,"return __p__"
            ,""
        ]), {
             "#FCODE#"              : "FCODE"
        }, False)

        _G.TT_RCODE = InlineTemplate(_G.TEOL.join([
            ""
            ,"#RCODE#"
            ,""
        ]), {
             "#RCODE#"              : "RCODE"
        }, False)

        clear_state()
        _G.isInited = True


    def _set_ctx(ctx):
        global _G
        contx = _G.context
        #if isinstance(ctx, Ctx): _G.context = ctx
        #elif ctx and (ctx in _G.ctx): _G.context = _G.ctx[ctx]
        #else: _G.context = _G.glob
        _G.context = ctx if ctx else _G.glob
        return contx

    #
    # Main API methods
    #

    def createCtx(ctx):
        global _G
        if ctx and ('global' != ctx) and (ctx not in _G.ctx): _G.ctx[ctx] = Ctx(ctx)

    def disposeCtx(ctx):
        global _G
        if ctx and ('global' != ctx) and (ctx in _G.ctx):
            _G.ctx[ctx].dispose()
            del _G.ctx[ctx]

    def setTemplateSeparators(seps = None):
        global _G
        if seps:
            if 'left' in seps: _G.leftTplSep = str(seps['left'])
            if 'right' in seps: _G.rightTplSep = str(seps['right'])

    def setPreserveLines(enable = True):
        global _G
        _G.preserveLines = _G.preserveLinesDefault if enable else ''

    def hasPlugin(name, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        return name and ((name in contx.plugins) or (name in _G.glob.plugins))

    def addPlugin(name, pluginCode, ctx = 'global'):
        global _G
        if name and pluginCode:
            contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
            contx.plugins[str(name)] = pluginCode

    def plg_(plg, *args):
        global _G
        if plg in _G.context.plugins and callable(_G.context.plugins[plg]):
            return _G.context.plugins[plg](*args)
        elif plg in _G.glob.plugins and callable(_G.glob.plugins[plg]):
            return _G.glob.plugins[plg](*args)
        return ''

    def setPrefixCode(preCode = None, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        if preCode: contx.prefix = str(preCode)

    def setEncoding(encoding, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        contx.encoding = encoding

    def setCacheDir(dir, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        _self = Contemplate
        _dir = contx.cacheDir = os.path.abspath(dir)

        initPyFile = os.path.join(_dir, '__init__.py')
        if not os.path.exists(initPyFile):
            _initPy_ = """\
# added by Contemplate.py Engine
# dummy Python __init__.py file
# used with Contemplate 'import'
# to import_tpl cached templates as modules, for optimization
"""
            write_file(initPyFile, _initPy_, contx.encoding)

        #if _dir not in os.sys.path:
        #    # allow to use 'import' in order to import_tpl cached templates
        #    os.sys.path.append(_dir)


    def setCacheMode(mode, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        contx.cacheMode = mode

    def setTemplateDirs(dirs, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        contx.templateDirs = [dirs] if isinstance(dirs,str) else dirs

    def getTemplateDirs(ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        return contx.templateDirs

    def setTemplateFinder(finder, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        contx.templateFinder = finder if callable(finder) else None

    def clearCache(all = False, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        contx.cache = {}
        if all: contx.partials = {}

    def hasTpl(tpl, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        return tpl and ((tpl in contx.templates) or (tpl in _G.glob.templates))

    def add(tpls, ctx = 'global'):
        global _G
        if tpls and isinstance(tpls, dict):
            contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
            for tplID in tpls:
                if isinstance(tpls[tplID], (list, tuple)):
                    # unified way to add tpls both as reference and inline
                    # inline tpl, passed as array
                    if len(tpls[tplID][0]):
                        contx.templates[tplID] = [tpls[tplID][0], True]
                else:
                    contx.templates[tplID] = [tpls[tplID], False]


    def getTemplateContents(id, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context
        return get_template_contents(id, contx)


    def findTpl(tpl, ctx = 'global'):
        global _G
        contx = _G.ctx[ctx] if ctx and (ctx in _G.ctx) else _G.context

        if callable(contx.templateFinder):
            return contx.templateFinder(tpl)

        if len(contx.templateDirs):
            filename = tpl.lstrip('/\\')
            for dir in contx.templateDirs:
                path = dir.rstrip('/\\') + '/' + filename
                if os.path.exists(path): return path
            return None

        if contx != _G.glob:
            contx = _G.glob
            if callable(contx.templateFinder):
                return contx.templateFinder(tpl)

            if len(contx.templateDirs):
                filename = tpl.lstrip('/\\')
                for dir in contx.templateDirs:
                    path = dir.rstrip('/\\') + '/' + filename
                    if os.path.exists(path): return path
                return None
        return None

    def parseTpl(tpl, options = dict()):
        global _G
        # see what context this template may use
        contx = None
        if isinstance(options, str):
            if options in _G.ctx:
                contx = _G.ctx[options] # preset context
            else:
                contx = _G.glob # global context
            options = {}

        options = merge({
            'separators': None
        }, {} if not options else options)

        if 'context' in options:
            if options['context'] in _G.ctx:
                contx = _G.ctx[options['context']] # preset context
            elif not contx:
                contx = _G.glob # global context
            del options['context']

        if not contx: contx = _G.glob # global context

        leftSep = _G.leftTplSep
        rightSep = _G.rightTplSep

        separators = options['separators'] if options and ('separators' in options) else None
        if separators:
            leftSep = separators[0]
            rightSep = separators[1]

        _ctx = _G.context
        _G.context = contx
        reset_state()
        parsed = parse(tpl, leftSep, rightSep)
        clear_state()
        _G.context = _ctx

        return parsed

    #
    # Main Template functions
    #

    def tpl(tpl, data = None, options = None):
        global _G
        if isinstance(tpl, Contemplate.Template):
            tmpl = tpl
        else:
            if options is None: options = {}
            # see what context this template may use
            contx = None
            if isinstance(options, str):
                if options in _G.ctx:
                    contx = _G.ctx[options] # preset context
                else:
                    contx = _G.context # current context
                options = {}

            options = merge({
                 'separators': None
                ,'autoUpdate': False
                ,'refresh': False
                ,'escape': False
                ,'standalone': False
            }, {} if not options else options)

            if 'context' in options:
                if options['context'] in _G.ctx:
                    contx = _G.ctx[options['context']] # preset context
                elif not contx:
                    contx = _G.context # current context
                del options['context']

            if not contx: contx = _G.context # current context

            _G.escape = False if False == options['escape'] else True

            if 'parsed' not in options and not Contemplate.hasTpl(tpl, contx.id):
                path = Contemplate.findTpl(tpl, contx.id)
                if not path: return '' if isinstance(data, dict) else None
                tpldef = {}
                tpldef[tpl] = path
                Contemplate.add(tpldef, contx.id)

            # Figure out if we're getting a template, or if we need to
            # load the template - and be sure to cache the result.
            if options['refresh'] or ((tpl not in contx.cache) and (tpl not in _G.glob.cache)):

                _ctx = _G.context
                _G.context = contx
                contx.cache[tpl] = get_cached_template(tpl, contx, options)
                _G.context = _ctx

            tmpl = contx.cache[tpl] if tpl in contx.cache else _G.glob.cache[tpl]
            tmpl.autonomus(options['standalone'])

        # Provide some basic currying to the user
        return str(tmpl.render(data)) if isinstance(data, dict) else tmpl

    def inline(tpl, reps = None, compiled = False):
        if isinstance(tpl, Contemplate.InlineTemplate): return str(tpl.render(reps))
        return Contemplate.InlineTemplate(tpl, reps, compiled)

    def concat(*args):
        return ''.join(map(str, args))

    def join(sep, args, skip_empty = False):
        if args is None: return ''
        skip_empty = skip_empty is True
        if not isinstance(args, (list,tuple)): return '' if skip_empty and not len(str(args)) else str(args)
        if sep is None: sep = ''
        if not isinstance(sep, str): sep = str(sep)
        l = len(args)
        out = (Contemplate.join(sep, args[0], skip_empty) if isinstance(args[0], (list,tuple)) else ('' if skip_empty and (args[0] is None or not len(str(args[0]))) else str(args[0]))) if l > 0 else ''
        for i in range(1, l):
            s = Contemplate.join(sep, args[i], skip_empty) if isinstance(args[i], (list,tuple)) else ('' if skip_empty and (args[i] is None or not len(str(args[i]))) else str(args[i]))
            if (not skip_empty) or len(s) > 0: out += sep + s
        return out

    def keys(o):
        return array_keys(o) if isinstance(o, (list,tuple,dict)) else []

    def values(o):
        return array_values(o) if isinstance(o, (list,tuple,dict)) else []

    def items(o):
        return enumerate(o) if isinstance(o, (list,tuple)) else (o.items() if isinstance(o, dict) else [])

    def count(a):
        # http://www.php2python.com/wiki/function.count/
        return 0 if a is None else len(a)

    def is_array(v, strict = False):
        return isinstance(v, list) if strict else isinstance(v, (tuple,list,dict))

    def in_array(v, a):
        return (v in a)

    def is_list(v):
        return isinstance(v, list)

    def haskey(v, *args):
        if not v or not isinstance(v, (list,tuple,dict)): return False
        tmp = v
        for i in range(len(args)):
            if isinstance(tmp, (list,tuple)):
                k = int(args[i])
                if k < 0 or k >= len(tmp): return False
                tmp = tmp[k]
            elif isinstance(tmp, dict):
                k = str(args[i])
                if k not in tmp: return False
                tmp = tmp[k]
            else:
                return False
        return True

    def time():
        return php_time()

    def date(format, timestamp = None):
        if timestamp is None: timestamp = php_time()
        return php_date(format, timestamp)

    def lowercase(s):
        return str(s).lower()

    def uppercase(s):
        return str(s).upper()

    def striptags(s):
        global _G
        return re.sub(_G.TAG_RE, '', s)

    def e(s, entities = True):
        f = ''
        if entities:
            for c in s:
                if '&' == c:    f += '&amp;'
                elif '<' == c:  f += '&lt;'
                elif '>' == c:  f += '&gt;'
                elif '"' == c:  f += '&quot;'
                elif '\'' == c: f += '&apos;'
                else:           f += c
        else:
            for c in s:
                if '&' == c:    f += '&#38;'
                elif '<' == c:  f += '&#60;'
                elif '>' == c:  f += '&#62;'
                elif '"' == c:  f += '&#34;'
                elif '\'' == c: f += '&#39;'
                else:           f += c
        return f

    def json_encode(v):
        return json.dumps(v)

    def json_decode(v):
        return json.loads(v)

    def urlencode(s):
        return urlencode(s)

    def urldecode(s):
        return urldecode(s)

    def buildquery(data):
        return http_build_query(data, '&')

    def parsequery(s):
        return parse_str(s)

    def queryvar(url, add_keys, remove_keys = None):
        global _G

        if remove_keys is not None and not isinstance(remove_keys, list):
            remove_keys = [remove_keys]

        if remove_keys and len(remove_keys):
            # https://davidwalsh.name/php-remove-variable
            keys = remove_keys
            for key in keys:
                url = re.sub(r'(\?|&)' + re.escape(urlencode(str(key))) + r'(\[[^\[\]]*\])*(=[^&]+)?', '\\1', url)

            url = re.sub(_G.AMP_RE, '&', url).replace('?&', '?')
            last = url[-1]
            if '?' == last or '&' == last:
                url = url[0:-1]

        if add_keys and len(add_keys):
            keys = add_keys
            q = '?' if -1 == url.find('?') else '&'
            for key in keys:
                value = keys[key]
                key = urlencode(str(key))
                if isinstance(value, (list,tuple,dict)):
                    if isinstance(value, (list,tuple)):
                        for v in value:
                            url += q + key + '[]=' + urlencode(str(v))
                            q = '&'
                    else:
                        for k in value:
                            url += q + key + '[' + urlencode(k) + ']=' + urlencode(str(value[k]))
                            q = '&'
                else:
                    url += q + key + '=' + urlencode(str(value))
                q = '&'

        return url

    def get(v, keys, default_value = None):
        if not Contemplate.is_array(keys, True): keys = [keys]
        o = v
        found = 1
        for key in keys:
            if isinstance(o, (list,tuple)):
                key = int(key)
                if 0 <= key and key < len(o):
                    o = o[key]
                else:
                    found = 0
                    break
            elif isinstance(o, dict):
                key = str(key)
                if key in o:
                    o = o[key]
                else:
                    found = 0
                    break
            else:
                key = str(key)
                if hasattr(o, key):
                    o = getattr(o, key)
                else:
                    keyGetter = 'get' + key[0].upper() + key[1:]
                    if hasattr(o, keyGetter) and callable(getattr(o, keyGetter)):
                        o = getattr(o, keyGetter)()
                    else:
                        found = 0
                        break

        return o if found else default_value

    def uuid(namespace = 'UUID'):
        global _G
        _G.uuid += 1
        return '_'.join([str(namespace), str(_G.uuid), str(php_time())])

    def merge(m, *args):
        numargs = len(args)
        if numargs < 1: return m

        merged = m
        for arg in args:
            # http://www.php2python.com/wiki/function.array-merge/
            merged = dict(merged)
            merged.update(arg)
        return merged

    #local_variable = local_variable
    #is_local_variable = is_local_variable

    # extra for py version
    def empty(v):
        # exactly like php's function
        return (isinstance(v, str) and "0" == v) or not bool(v)
    def trim(s, charlist = None):
        return s.strip(charlist) if charlist else s.strip()
    def ltrim(s, charlist = None):
        return s.lstrip(charlist) if charlist else s.lstrip()
    def rtrim(s, charlist = None):
        return s.rstrip(charlist) if charlist else s.rstrip()
    sprintf = sprintf
    vsprintf = vsprintf

# init the engine on load
Contemplate.init()

# if used with 'import *'
__all__ = ['Contemplate']
