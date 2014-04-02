<?php 

/* Contemplate cached template 'base' */
if (!class_exists('Contemplate_base_Cached'))
{
final class Contemplate_base_Cached extends Contemplate
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
    
    
    /* tpl block render method for block 'Block3' */
    private function _blockfn_Block3($__instance__) 
    { 
        $__p__ = '';
         
        $__p__ .= 'Base template Block3';
        return $__p__;
    }
    
    /* tpl block render method for block 'Block2' */
    private function _blockfn_Block2($__instance__) 
    { 
        $__p__ = '';
         
        $__p__ .= 'Base template Block2';
        return $__p__;
    }
    
    /* tpl block render method for block 'Block1' */
    private function _blockfn_Block1($__instance__) 
    { 
        $__p__ = '';
         
        $__p__ .= 'Base template Block1';
        return $__p__;
    }
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
    public function render($data, $__instance__=null)
    {
        $__p__ = '';
        if ( !$__instance__ ) $__instance__ = $this;
        
        if ( $this->_parent )
        {
            $__p__ = $this->_parent->render($data, $__instance__);
        }
        else
        {
            /* tpl main render code starts here */
            $__instance__->data = Contemplate::data( $data ); 
            $__p__ .= '<!-- this is the base template -->' . "\n" . "\n" . '<strong>This is the base template</strong>' . "\n" . "\n" . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block1</strong><br />' . "\n" . $__instance__->renderBlock( 'Block1' );  
            $__p__ .= '' . "\n" . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2</strong><br />' . "\n" . $__instance__->renderBlock( 'Block2' );  
            $__p__ .= '' . "\n" . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block3</strong><br />' . "\n" . $__instance__->renderBlock( 'Block3' );  
            $__p__ .= '' . "\n" . "\n" . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2 Again</strong><br />' . "\n" . $__instance__->renderBlock( 'Block2' );  
            $__p__ .= '' . "\n" . '';
            /* tpl main render code ends here */
        }
        $this->data = null;
        return $__p__;
    }
}
}