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
        $this->d = null;
        $this->_renderFunction = null;
        $this->_extends = null;
        $this->_blocks = null;
        
        $this->id = $id;
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
    
    /* tpl-defined blocks render code ends here */
    
    /* render a tpl block method */
    public function renderBlock($block, $__i__=null)
    {
        if ( !$__i__ ) $__i__ = $this;
        
        $method = '_blockfn_' . $block;
        
        if ( method_exists($this, $method) ) return $this->{$method}($__i__);
        
        elseif ( $this->_extends ) return $this->_extends->renderBlock($block, $__i__);
        
        return '';
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
            
            $__i__->d = Contemplate::data( $data );
            $__p__ .= '<div>' . "\n" . '    <br />' . "\n" . '    <strong>Number of Items:' . ( Contemplate::count($__i__->d['users'][$__i__->d['i']]) ) . '</strong>' . "\n" . '    <br />' . "\n" . '    ';
            $_O14 = $__i__->d['users'][$__i__->d['i']];
            if (!empty($_O14))
            {
                foreach ($_O14 as $_K15=>$_V16)
                {
                    $__i__->d['j'] = $_K15; $__i__->d['user'] = $_V16;
                     
                    $__p__ .= '' . "\n" . '        <div id=\'' . ( $__i__->d['user']["id"] ) . '\' class="';        
                    if ( 0 == ($__i__->d['j'] % 2) )
                    {
                                 
                        $__p__ .= 'even';        
                    }
                    elseif ( 1 == ($__i__->d['j'] % 2) )
                    {
                                 
                        $__p__ .= 'odd';        
                    }
                             
                    $__p__ .= '">' . "\n" . '            <a href="/' . ( $__i__->d['user']["name"] ) . '">' . ( $__i__->d['user']['name'] ) . '' . ( $__i__->d['user']['text'] ) . ' ' . ( Contemplate::n($__i__->d['i']) + Contemplate::n($__i__->d['j']) ) . '</a>: <strong>' . ( $__i__->d['user']["text"] ) . '</strong>' . "\n" . '        </div>' . "\n" . '        ';        
                    if (  Contemplate::haskey($__i__->d['user'], "key1")  )
                    {
                                 
                        $__p__ .= '' . "\n" . '            <div> User has key &quot;key1&quot; </div>' . "\n" . '        ';        
                    }
                    elseif (  Contemplate::haskey($__i__->d['user'], "key", "key1")  )
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
        $this->d = null;
        return $__p__;
    }
}
}
