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
    public function renderBlock($block, $__i__=null)
    {
        if ( !$__i__ ) $__i__ = $this;
        
        $method = '_blockfn_' . $block;
        
        if ( method_exists($this, $method) ) return $this->{$method}($__i__);
        
        elseif ( $this->_parent ) return $this->_parent->renderBlock($block, $__i__);
        
        return '';
    }
    
    /* tpl render method */
    public function render($data, $__i__=null)
    {
        $__p__ = '';
        if ( !$__i__ ) $__i__ = $this;
        
        if ( $this->_parent )
        {
            $__p__ = $this->_parent->render($data, $__i__);
        }
        else
        {
            /* tpl main render code starts here */
            
            $__i__->data = Contemplate::data( $data );
            $__p__ .= '<div>' . "\n" . '    <br />' . "\n" . '    <strong>Number of Items:' . ( Contemplate::count($__i__->data['users'][$__i__->data['i']]) ) . '</strong>' . "\n" . '    <br />' . "\n" . '    ';
            $_O7 = $__i__->data['users'][$__i__->data['i']];
            if ( !empty($_O7) )
            {
                foreach ( $_O7 as $_K8=>$_V9 )
                {
                    $__i__->data['j'] = $_K8;
                    $__i__->data['user'] = $_V9;
                     
                    $__p__ .= '' . "\n" . '        <div id=\'' . ( $__i__->data['user']["id"] ) . '\' class="';        
                    if ( 0 == ($__i__->data['j'] % 2) )
                    {
                                 
                        $__p__ .= 'even';        
                    }
                    elseif ( 1 == ($__i__->data['j'] % 2) )
                    {
                                 
                        $__p__ .= 'odd';                
                    }
                             
                    $__p__ .= '">' . "\n" . '            <a href="/' . ( $__i__->data['user']["name"] ) . '">' . ( $__i__->data['user']['name'] ) . '' . ( $__i__->data['user']['text'] ) . ' ' . ( Contemplate::n($__i__->data['i']) + Contemplate::n($__i__->data['j']) ) . '</a>: <strong>' . ( $__i__->data['user']["text"] ) . '</strong>' . "\n" . '        </div>' . "\n" . '        ';        
                    if (  Contemplate::haskey($__i__->data['user'], "key1")  )
                    {
                                 
                        $__p__ .= '' . "\n" . '            <div> User has key &quot;key1&quot; </div>' . "\n" . '        ';        
                    }
                    elseif (  Contemplate::haskey($__i__->data['user'], "key", "key1")  )
                    {
                                 
                        $__p__ .= '' . "\n" . '            <div> User has key [&quot;key&quot;][&quot;key1&quot;] </div>' . "\n" . '        ';                
                    }
                             
                    $__p__ .= '' . "\n" . '    ';        
                }
            }
            else
            {    
                     
                $__p__ .= '' . "\n" . '        <div class="none">' . ( Contemplate::l("No Users") ) . '</div>' . "\n" . '    ';        
            }
             
            $__p__ .= '' . "\n" . '</div>' . "\n" . '';
            
            /* tpl main render code ends here */
        }
        $this->data = null;
        return $__p__;
    }
}
}
