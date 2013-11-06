<?php 
/* Contemplate cached template 'sub' */
if (!class_exists('Contemplate_sub_Cached'))
{
final class Contemplate_sub_Cached extends Contemplate
{    
    /* constructor */
    public function __construct($id=null, $__=null)
    {
        /* initialize internal vars */
        $this->id = null; 
        $this->data = null;
        $this->_renderFunction = null;
        $this->_parent = null;
        $this->_blocks = null;
        
        $this->id = $id;
        
        /* parent tpl assign code starts here */
        
        /* parent tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
    
    /* tpl-defined blocks render code ends here */
    
    /* render a tpl block method */
    public function renderBlock($block, $__instance__=null)
    {
        if ( !$__instance__ ) $__instance__ = $this;
        
        $method = '_blockfn_' . $block;
        
        if ( method_exists($this, $method) ) return $this->{$method}($__instance__);
        
        elseif ( $this->_parent ) return $this->_parent->renderBlock($block, $__instance__);
        
        return '';
    }
    
    /* tpl render method */
    public function render($__data__, $__instance__=null)
    {
        $__p__ = '';
        if ( !$__instance__ ) $__instance__ = $this;
        
        if ( $this->_parent )
        {
            $__p__ = $this->_parent->render($__data__, $__instance__);
        }
        else
        {
            /* tpl main render code starts here */
            $__instance__->data = Contemplate::data( $__data__ ); 
            $__p__ .= '<div>' . "\n" . '    <br />' . "\n" . '    <strong>Number of Items:' . ( Contemplate::count($__instance__->data['users'][$__instance__->data['i']]) ) . '</strong>' . "\n" . '    <br />' . "\n" . '    ';        
            if ( !empty($__instance__->data['users'][$__instance__->data['i']]) )
            {
                foreach ( $__instance__->data['users'][$__instance__->data['i']] as $j=>$user )
                {
                    $__instance__->data['j'] = $j; $__instance__->data['user'] = $user;         
                    $__p__ .= '' . "\n" . '        <div id=\'' . ( $__instance__->data['user']["id"] ) . '\' class="';        
                    if ( 0 == ($__instance__->data['j'] % 2) )
                    {
                                 
                        $__p__ .= 'even';                
                    }
                    elseif ( 1 == ($__instance__->data['j'] % 2) )
                    {
                                 
                        $__p__ .= 'odd';                
                    }
                             
                    $__p__ .= '">' . "\n" . '            <a href="/' . ( $__instance__->data['user']["name"] ) . '">' . ( $__instance__->data['user']["name"] ) . ( $__instance__->data['user']["text"] ) . ' ' . ( Contemplate::n($__instance__->data['i']) + Contemplate::n($__instance__->data['j']) ) . '</a>: <strong>' . ( $__instance__->data['user']["text"] ) . '</strong>' . "\n" . '        </div>' . "\n" . '    ';        
                }
            }
            else
            {    
                     
                $__p__ .= '' . "\n" . '        <div class="none">No Users</div>' . "\n" . '    ';        
            }
             
            $__p__ .= '' . "\n" . '</div>' . "\n" . '';
            /* tpl main render code ends here */
        }
        $this->data = null;
        return $__p__;
    }
}
}