ODict = dict

class ContemplateHTMLPlugin:
    """
    Contemplate HTML Plugin for htmltable, htmlselect,
    https://github.com/foo123/Contemplate
    """
    
    added_plugins = False
    
    def hook(Contemplate):
        _self = Contemplate
        if ContemplateHTMLPlugin.added_plugins is False:
            #
            #  HTML elements
            #
            
            # html table
            # static
            def htmltable( data, options={} ):
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
            
            Contemplate.addPlugin('htmltable', htmltable)
            Contemplate.addPlugin('htmlselect', htmlselect)
            ContemplateHTMLPlugin.added_plugins = True
    

# if used with 'import *'
__all__ = ['ContemplateHTMLPlugin']
