<?php 


/* Contemplate cached template 'base' */
if (!class_exists('Contemplate_base_Cached'))
{
final class Contemplate_base_Cached extends ContemplateTemplate
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
    
    
    /* tpl block render method for block 'Block3' */
    private function _blockfn_Block3($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= 'Base template Block3';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block2' */
    private function _blockfn_Block2($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= 'Base template Block2';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block12' */
    private function _blockfn_Block12($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= 'Base template nested Block12';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block11' */
    private function _blockfn_Block11($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= 'Base template nested Block11';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block1' */
    private function _blockfn_Block1($__i__) 
    { 
        
        $__p__ = ''; $data =& $__i__->d;
         
        $__p__ .= '' . "\n" . 'Base template Block1' . "\n" . '<br /><br />' . "\n" . '' .  $__i__->renderBlock( 'Block11' ); 
        $__p__ .= '' . "\n" . '<br /><br />' . "\n" . '' .  $__i__->renderBlock( 'Block12' ); 
        $__p__ .= '' . "\n" . '<br /><br />' . "\n" . '';
        return $__p__;
        
    }
    
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
            $__p__ .= '<!-- this is the base template -->' . "\n" . '' . "\n" . '<strong>This is the base template</strong>' . "\n" . '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block1</strong><br />' . "\n" . '' .  $__i__->renderBlock( 'Block1' ); 
            $__p__ .= '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2</strong><br />' . "\n" . '' .  $__i__->renderBlock( 'Block2' ); 
            $__p__ .= '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block3</strong><br />' . "\n" . '' .  $__i__->renderBlock( 'Block3' ); 
            $__p__ .= '' . "\n" . '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2 Again</strong><br />' . "\n" . '' .  $__i__->renderBlock( 'Block2' ); 
            $__p__ .= '' . "\n" . '';
            
            /* tpl main render code ends here */
        }
        $this->d = null;
        return $__p__;
    }
}
}
