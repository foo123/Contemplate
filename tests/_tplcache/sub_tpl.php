<?php 

/* Contemplate cached template 'sub' */
if (!class_exists('Contemplate_sub_Cached'))
{
final class Contemplate_sub_Cached extends ContemplateTemplate
{    
    /* constructor */
    public function __construct($id=null)
    {
        /* initialize internal vars */
        $this->id = null; 
        $this->d = null;
        $this->_renderer = null;
        $this->_extends = null;
        $this->_blocks = null;
        
        $this->id = $id;
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
    
    /* tpl-defined blocks render code ends here */
    
    /* tpl renderBlock method */
    public function renderBlock( $block, $__i__=null )
    {
        $__p__ = '';
        if ( !$__i__ ) $__i__ = $this;
        
        $method = '_blockfn_' . $block;
        if ( method_exists($this, $method) ) return $this->{$method}($__i__);
        elseif ( $this->_extends ) return $this->_extends->renderBlock($block, $__i__);
        return $__p__;
    }
    
    /* tpl render method */
    public function render($data, $__i__=null)
    {
        $__p__ = '';
        if ( !$__i__ ) $__i__ = $this;
        
        if ( $this->_extends )
        {
            $__p__ = $this->_extends->render($data, $__i__);
        }
        else
        {
            /* tpl main render code starts here */
            
            $__i__->d =& $data;
            $__p__ .= '<div>' . "\n" . '    <br />' . "\n" . '    <strong>Number of Items:' . (count($data['users'][$data['i']])) . '</strong>' . "\n" . '    <br />' . "\n" . '    ';
            $_loc_7 = $data['users'][$data['i']];
            if (!empty($_loc_7))
            {
                foreach ($_loc_7 as $_loc_j=>$_loc_user)
                {
                    
                    $__p__ .= '' . "\n" . '        <div id=\'' . ( $_loc_user["id"]) . '\' class="';        
                    if (0 == ($_loc_j % 2))
                    {
                                
                        $__p__ .= 'even';        
                    }
                    elseif (1 == ($_loc_j % 2))
                    {
                                
                        $__p__ .= 'odd';        
                    }
                            
                    $__p__ .= '">' . "\n" . '            <a href="/' . ( $_loc_user["name"]) . '">' . ( $_loc_user['name']) . '' . ( $_loc_user['text']) . ' ' . (intval($data['i']) + intval($_loc_j)) . '</a>: <strong>' . ( $_loc_user["text"]) . '</strong>' . "\n" . '        </div>' . "\n" . '        ';        
                    if ( Contemplate::haskey($_loc_user, "key1") )
                    {
                                
                        $__p__ .= '' . "\n" . '            <div> User has key &quot;key1&quot; </div>' . "\n" . '        ';        
                    }
                    elseif ( Contemplate::haskey($_loc_user, "key", "key1") )
                    {
                                
                        $__p__ .= '' . "\n" . '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' . "\n" . '        ';        
                    }
                            
                    $__p__ .= '' . "\n" . '    ';
                }
            }
            else
            {
                
                $__p__ .= '' . "\n" . '        <div class="none">' . (Contemplate::locale("No Users")) . '</div>' . "\n" . '    ';
            }
            
            $__p__ .= '' . "\n" . '</div>' . "\n" . '';
            
            /* tpl main render code ends here */
        }
        $this->d = null;
        return $__p__;
    }
}
}
