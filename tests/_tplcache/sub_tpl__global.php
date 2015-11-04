<?php 

if (!class_exists('Contemplate_sub_Cached__global'))
{
/* Contemplate cached template 'sub' */
final class Contemplate_sub_Cached__global extends ContemplateTemplate
{
/* constructor */
public function __construct($id=null)
{
    $self = $this;
    parent::__construct( $id );
    
    /* extend tpl assign code starts here */
    
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */

/* tpl-defined blocks render code ends here */
/* tpl renderBlock method */
public function renderBlock($block, &$data, $__i__=null)
{
    $self = $this; $r = ''; $__ctx = false;
    if ( !$__i__ )
    {
        $__i__ = $self;
        if ( !$self->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
    }
    $method = '_blockfn_' . $block;
    if ( method_exists($self, $method) ) $r = $self->{$method}($data, $self, $__i__);
    elseif ( $self->_extends ) $r = $self->_extends->renderBlock($block, $data, $__i__);
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $r;
}
/* tpl render method */
public function render(&$data, $__i__=null)
{
    $self = $this; $__ctx = false;
    $__p__ = '';
    if ( !$__i__ )
    {
        $__i__ = $self;
        if ( !$self->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
    }
    if ( $self->_extends )
    {
        $__p__ = $self->_extends->render($data, $__i__);
    }
    else
    {
        /* tpl main render code starts here */
        
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
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $__p__;
}
}
}
