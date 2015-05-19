/**
*  Contemplate HTML Plugin
*
*  https://github.com/foo123/Contemplate
*
*
**/
!function( root, name, factory ) {
"use strict";

// export the module, umd-style (no other dependencies)
var isCommonJS = ("object" === typeof(module)) && module.exports, 
    isAMD = ("function" === typeof(define)) && define.amd, m;

// CommonJS, node, etc..
if ( isCommonJS ) 
    module.exports = (module.$deps = module.$deps || {})[ name ] = module.$deps[ name ] || (factory.call( root, {NODE:module} ) || 1);

// AMD, requireJS, etc..
else if ( isAMD && ("function" === typeof(require)) && ("function" === typeof(require.specified)) && require.specified(name) ) 
    define( name, ['require', 'exports', 'module'], function( require, exports, module ){ return factory.call( root, {AMD:module} ); } );

// browser, web worker, etc.. + AMD, other loaders
else if ( !(name in root) ) 
    (root[ name ] = (m=factory.call( root, {} ) || 1)) && isAMD && define( name, [], function( ){ return m; } );

}(  /* current root */          this, 
    /* module name */           "ContemplateHTMLPlugin",
    /* module factory */        function( exports, undef ) {
"use strict";

var added_plugins = false, Keys = Object.keys, toString = Object.prototype.toString;
function is_array( o ) 
{ 
    return o && ((o.constructor === Array)/*(o instanceof Array)*/ || ('[object Array]' === toString.call(o))); 
}
function array_flip( trans ) 
{
    var cis = {}, k, key, keys = Keys(trans), kl = keys.length;
    for (k=0; k<kl; k++) { key = keys[ k ];  cis[ trans[ key ] ] = key; }
    return cis;
}

function addPlugins(Contemplate)
{
    // html table
    var htmltable = function( data, options ) {
        var HAS = 'hasOwnProperty', merge = Contemplate.merge;
        // clone data to avoid mess-ups
        data = merge({}, data);
        options = merge({}, options || {});
        var o='', tk='', header='', footer='', 
            k, rows=[], row, rl, r, i, j, l, vals, col, colvals, 
            class_odd, class_even, row_class, odd=false,
            hasRowTpl = options[HAS]('tpl_row'), 
            hasCellTpl = options[HAS]('tpl_cell'), 
            rowTpl = null, cellTpl = null
        ;
        
        if ( hasRowTpl )
        {
            if ( !(options['tpl_row'] instanceof Contemplate.InlineTemplate) )
                options['tpl_row'] = Contemplate.InlineTemplate(options['tpl_row'], {'$row_class':'row_class','$row':'row'});
            rowTpl = options['tpl_row'];
        }
        if ( hasCellTpl )
        {
            if ( !(options['tpl_cell'] instanceof Contemplate.InlineTemplate) )
                options['tpl_cell'] = Contemplate.InlineTemplate(options['tpl_cell'], {'$cell':'cell'});
            cellTpl = options['tpl_cell'];
        }
        
        o="<table";
        
        if (options['id']) o+=" id='"+options['id']+"'";
        if (options['class']) o+=" class='"+options['class']+"'";
        if (options['style']) o+=" style='"+options['style']+"'";
        if (options['data'])
        {
            for (k in options['data'])
            {
                if (options['data'][HAS](k))
                    o+=" data-"+k+"='"+options['data'][k]+"'";
            }
        }
        o+=">";
            
        tk='';
        if ( options['header'] || options['footer'] )
            tk="<td>"+(Contemplate.keys(data)||[]).join('</td><td>')+"</td>";
            
        header = options['header'] ? "<thead><tr>"+tk+"</tr></thead>" : '';
        footer = options['footer'] ? "<tfoot><tr>"+tk+"</tr></tfoot>" : '';
        
        o+=header;
        
        // get data rows
        rows=[];
        vals=Contemplate.values(data) || [];
        for (i in vals)
        {
            if (vals[HAS](i))
            {
                col=vals[i];
                if (!is_array(col))  col=[col];
                colvals=Contemplate.values(col) || [];
                for (j=0, l=colvals.length; j<l; j++)
                {
                    if (!rows[j]) rows[j]=new Array(l);
                    rows[j][i]=colvals[j];
                }
            }
        }
        
        class_odd = options['odd'] ? options['odd'] : 'odd';
        class_even = options['even'] ? options['even'] : 'even';
            
        // render rows
        odd=false;
        for (i=0, l=rows.length; i<l; i++)
        {
            row_class = odd ? class_odd : class_even;
            
            if ( hasCellTpl )
            {
                row = '';
                for (r=0,rl=rows[i].length; r<rl; r++)
                    row += cellTpl.render( {cell: rows[i][r]} );
            }
            else
            {
                row = "<td>"+rows[i].join('</td><td>')+"</td>";
            }
            if ( hasRowTpl )
            {
                o += rowTpl.render( {row_class: row_class, row: row} );
            }
            else
            {
                o += "<tr class='"+row_class+"'>"+row+"</tr>";
            }
            
            odd=!odd;
        }
        rows=null;
        // strict mode error, top level indentifier
        //delete $rows;
        
        o+=footer;
        o+="</table>";
        return o;
    };

    // html select
    var htmlselect = function( data, options ) {
        var HAS = 'hasOwnProperty', merge = Contemplate.merge;
        // clone data to avoid mess-ups
        data = merge({}, data);
        options = merge({}, options || {});
        var o='', k, k2, v, v2,
            hasOptionTpl = options[HAS]('tpl_option'), 
            optionTpl = null
        ;
        
        if ( hasOptionTpl )
        {
            if ( !(options['tpl_option'] instanceof Contemplate.InlineTemplate) )
                options['tpl_option'] = new Contemplate.InlineTemplate(options['tpl_option'], {'$selected':'selected','$value':'value','$option':'option'});
            optionTpl = options['tpl_option'];
        }
        
        o="<select";
        
        if (options['multiple']) o+=" multiple";
        if (options['disabled']) o+=" disabled='disabled'";
        if (options['name']) o+=" name='"+options['name']+"'";
        if (options['id']) o+=" id='"+options['id']+"'";
        if (options['class']) o+=" class='"+options['class']+"'";
        if (options['style']) o+=" style='"+options['style']+"'";
        if (options['data'])
        {
            for (k in options['data'])
            {
                if (options['data'][HAS](k))
                    o+=" data-"+k+"='"+options['data'][k]+"'";
            }
        }
        o+=">";
        
        if (options['selected'])
        {
            if (!is_array(options['selected'])) options['selected']=[options['selected']];
            options['selected']=array_flip(options['selected']);
        }
        else
            options['selected']={};
            
        if (options['optgroups'])
        {
            if (!is_array(options['optgroups'])) options['optgroups']=[options['optgroups']];
            options['optgroups']=array_flip(options['optgroups']);
        }

        for (k in data)
        {
            if (data[HAS](k))
            {
                v=data[k];
                if (options['optgroups'] && options['optgroups'][HAS](k))
                {
                    o+="<optgroup label='"+k+"'>";
                    for  (k2 in v)
                    {
                        if (v[HAS](k2))
                        {
                            v2=v[k2];
                            if (options['use_key'])  v2=k2;
                            else if (options['use_value']) k2=v2;
                                
                            if ( hasOptionTpl )
                                o += optionTpl.render({
                                    value: k2,
                                    option: v2,
                                    selected: options['selected'][HAS](k2)?' selected="selected"' : ''
                                });
                            else if (/*$options['selected'][$k2]*/ options['selected'][HAS](k2))
                                o += "<option value='"+k2+"' selected='selected'>"+v2+"</option>";
                            else
                                o += "<option value='"+k2+"'>"+v2+"</option>";
                        }
                    }
                    o+="</optgroup>";
                }
                else
                {
                    if (options['use_key']) v=k;
                    else if (options['use_value']) k=v;
                        
                    if ( hasOptionTpl )
                        o += optionTpl.render({
                            value: k,
                            option: v,
                            selected: options['selected'][HAS](k)?' selected="selected"' : ''
                        });
                    else if (options['selected'][HAS](k))
                        o += "<option value='"+k+"' selected='selected'>"+v+"</option>";
                    else
                        o += "<option value='"+k+"'>"+v+"</option>";
                }
            }
        }
        o+="</select>";
        return o;
    };
    
    Contemplate.addPlugin('htmltable', htmltable);
    Contemplate.addPlugin('htmlselect', htmlselect);
}

var ContemplateHTMLPlugin = {
    hook: function(Contemplate) {
        if (false === added_plugins)
        {
            addPlugins(Contemplate);
            added_plugins = true;
        }
    }
};


// export it
return ContemplateHTMLPlugin;
});