<?php
if ( !class_exists('ContemplateHTMLPlugin') )
{
class ContemplateHTMLPlugin
{
    //
    //  HTML elements
    //
    
    // html table
    public static function htmltable( $data, $options=array() )
    {
        $data=(array)$data;
        $options=(array)$options;
        
        $hasRowTpl = isset($options['tpl_row']);
        $hasCellTpl = isset($options['tpl_cell']);
        $rowTpl = null; $cellTpl = null;
        
        if ( $hasRowTpl )
        {
            if ( !($options['tpl_row'] instanceof ContemplateInlineTemplate) )
                $options['tpl_row'] = new ContemplateInlineTemplate($options['tpl_row'], array('$odd'=>'odd','$row'=>'row'));
            $rowTpl = $options['tpl_row'];
        }
        if ( $hasCellTpl )
        {
            if ( !($options['tpl_cell'] instanceof ContemplateInlineTemplate) )
                $options['tpl_cell'] = new ContemplateInlineTemplate($options['tpl_cell'], array('$cell'=>'cell'));
            $cellTpl = $options['tpl_cell'];
        }
            
        $o="<table";
        
        if (isset($options['id']))  $o.=" id='{$options['id']}'";
        if (isset($options['class'])) $o.=" class='{$options['class']}'";
        if (isset($options['style']))  $o.=" style='{$options['style']}'";
        if (isset($options['data']))
        {
            foreach ((array)$options['data'] as $k=>$v)
                $o.=" data-{$k}='{$v}'";
        }
        $o.=">";
            
        $tk='';
        if (
            (isset($options['header']) && $options['header']) || 
            (isset($options['footer']) && $options['footer'])
        )
            $tk="<td>".implode('</td><td>', @array_keys($data))."</td>";
            
        $header='';
        if (isset($options['header']) && $options['header'])
            $header="<thead><tr>{$tk}</tr></thead>";
            
        $footer='';
        if (isset($options['footer']) && $options['footer'])
            $footer="<tfoot><tr>{$tk}</tr></tfoot>";
        
        $o.=$header;
        
        // get data rows
        $rows=array();
        foreach (@array_values($data) as $i=>$col)
        {
            foreach (@array_values((array)$col) as $j=>$d)
            {
                if (!isset($rows[$j])) $rows[$j]=array_fill(0, count($col), '');
                $rows[$j][$i]=$d;
            }
        }
        
        if (isset($options['odd']))
            $class_odd=$options['odd'];
        else
            $class_odd='odd';
        if (isset($options['even']))
            $class_even=$options['even'];
        else
            $class_even='even';
            
        // render rows
        $odd=false;
        foreach (@$rows as $row1)
        {
            $row_class = $odd ? $class_odd : $class_even;
            
            if ( $hasCellTpl )
            {
                $row = ''; $rl = count($row1);
                for ($r=0; $r<$rl; $r++)
                    $row .= $cellTpl->render( array('cell'=> $row1[$r]) );
            }
            else
            {
                $row = "<td>".implode('</td><td>', $row1)."</td>";
            }
            if ( $hasRowTpl )
            {
                $o .= $rowTpl->render( array('odd'=> $row_class, 'row'=> $row) );
            }
            else
            {
                $o .= "<tr class='" . $row_class . "'>".$row."</tr>";
            }
            
            $odd=!$odd;
        }
        unset($rows);
        
        $o.=$footer;
        $o.="</table>";
        return $o;
    }
    
    // html select
    public static function htmlselect( $data, $options=array() )
    {
        $data=(array)$data;
        $options=(array)$options;
        
        $hasOptionTpl = isset($options['tpl_option']); 
        $optionTpl = null;
        
        if ( $hasOptionTpl )
        {
            if ( !($options['tpl_option'] instanceof ContemplateInlineTemplate) )
                $options['tpl_option'] = new ContemplateInlineTemplate($options['tpl_option'], array('$selected'=>'selected','$value'=>'value','$option'=>'option'));
            $optionTpl = $options['tpl_option'];
        }
            
        $o="<select";
        
        if (isset($options['multiple']) && $options['multiple']) $o.=" multiple";
        if (isset($options['disabled']) && $options['disabled']) $o.=" disabled='disabled'";
        if (isset($options['name'])) $o.=" name='{$options['name']}'";
        if (isset($options['id'])) $o.=" id='{$options['id']}'";
        if (isset($options['class']))  $o.=" class='{$options['class']}'";
        if (isset($options['style'])) $o.=" style='{$options['style']}'";
        if (isset($options['data']))
        {
            foreach ((array)$options['data'] as $k=>$v)
                $o.=" data-{$k}='{$v}'";
        }
        $o.=">";
        
        if (isset($options['selected']))
            $options['selected']=array_flip((array)$options['selected']);
        else
            $options['selected']=array();
            
        if (isset($options['optgroups']))
            $options['optgroups']=array_flip((array)$options['optgroups']);
    
        foreach ($data as $k=>$v)
        {
            if (isset($options['optgroups']) && isset($options['optgroups'][$k]))
            {
                $o.="<optgroup label='{$k}'>";
                foreach ((array)$v as $k2=>$v2)
                {
                    if (isset($options['use_key']))  $v2=$k2;
                    elseif (isset($options['use_value'])) $k2=$v2;
                        
                    if ( $hasOptionTpl )
                        $o .= $optionTpl->render(array(
                            'value'=> $k2,
                            'option'=> $v2,
                            'selected'=> array_key_exists($k2, $options['selected']) ? ' selected="selected"' : ''
                        ));
                    elseif (/*isset($options['selected'][$k2])*/ array_key_exists($k2, $options['selected']))
                        $o .= "<option value='{$k2}' selected='selected'>{$v2}</option>";
                    else
                        $o .= "<option value='{$k2}'>{$v2}</option>";
                }
                $o.="</optgroup>";
            }
            else
            {
                if (isset($options['use_key'])) $v=$k;
                elseif (isset($options['use_value'])) $k=$v;
                    
                if ( $hasOptionTpl )
                    $o .= $optionTpl->render(array(
                        'value'=> $k,
                        'option'=> $v,
                        'selected'=> array_key_exists($k, $options['selected']) ? ' selected="selected"' : ''
                    ));
                elseif (isset($options['selected'][$k]))
                    $o .= "<option value='{$k}' selected='selected'>{$v}</option>";
                else
                    $o .= "<option value='{$k}'>{$v}</option>";
            }
        }
        $o.="</select>";
        return $o;
    }
    
    public static function hook()
    {
        static $added_plugins = false;
        if ( false === $added_plugins )
        {
            Contemplate::addPlugin('htmltable', Contemplate::inline('ContemplateHTMLPlugin::htmltable($args)',array('$args'=>'args'),false));
            Contemplate::addPlugin('htmlselect', Contemplate::inline('ContemplateHTMLPlugin::htmlselect($args)',array('$args'=>'args'),false));
            $added_plugins = true;
        }
    }
}
}
