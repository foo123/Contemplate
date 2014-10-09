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
            
            $__i__->d =& $data;
            $__p__ .= '<div>' . "\n" . '    <br />' . "\n" . '    <strong>Number of Items:' . ( Contemplate::count($data['users'][$data['i']]) ) . '</strong>' . "\n" . '    <br />' . "\n" . '    ';
            $_O24 = $data['users'][$data['i']];
            if (!empty($_O24))
            {
                foreach ($_O24 as $_K25=>$_V26)
                {
                    $data['j'] = $_K25; $data['user'] = $_V26;
                     
                    $__p__ .= '' . "\n" . '        <div id=\'' . ( $data['user']["id"] ) . '\' class="';        
                    if (0 == ($data['j'] % 2))
                    {
                                 
                        $__p__ .= 'even';        
                    }
                    elseif (1 == ($data['j'] % 2))
                    {
                                 
                        $__p__ .= 'odd';        
                    }
                             
                    $__p__ .= '">' . "\n" . '            <a href="/' . ( $data['user']["name"] ) . '">' . ( $data['user']['name'] ) . '' . ( $data['user']['text'] ) . ' ' . ( Contemplate::n($data['i']) + Contemplate::n($data['j']) ) . '</a>: <strong>' . ( $data['user']["text"] ) . '</strong>' . "\n" . '        </div>' . "\n" . '        ';        
                    if ( Contemplate::haskey($data['user'], "key1") )
                    {
                                 
                        $__p__ .= '' . "\n" . '            <div> User has key &quot;key1&quot; </div>' . "\n" . '        ';        
                    }
                    elseif ( Contemplate::haskey($data['user'], "key", "key1") )
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
