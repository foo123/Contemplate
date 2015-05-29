<?php 

/* Contemplate cached template 'base' */
if (!class_exists('Contemplate_base_Cached'))
{
final class Contemplate_base_Cached extends ContemplateTemplate
{    
    /* constructor */
    public function __construct($id=null)
    {
        $self = $this;
        /* initialize internal vars */
        $self->_renderer = null;
        $self->_extends = null;
        $self->_blocks = null;
        $self->id = null;
        $self->id = $id;
        
        /* extend tpl assign code starts here */
        
        /* extend tpl assign code ends here */
    }    
    
    /* tpl-defined blocks render code starts here */
    
    
    /* tpl block render method for block 'Block3' */
    private function _blockfn_Block3(&$data, $self, $__i__) 
    { 
        
        $__p__ = '';
        
        $__p__ .= 'Base template Block3';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block2' */
    private function _blockfn_Block2(&$data, $self, $__i__) 
    { 
        
        $__p__ = '';
        
        $__p__ .= 'Base template Block2' . "\n" . '<!-- call the super block here in OO manner, if any -->' . "\n" . '' . ($self->renderSuperBlock("Block2", $data)) . '' . "\n" . '';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block12' */
    private function _blockfn_Block12(&$data, $self, $__i__) 
    { 
        
        $__p__ = '';
        
        $__p__ .= 'Base template nested Block12';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block11' */
    private function _blockfn_Block11(&$data, $self, $__i__) 
    { 
        
        $__p__ = '';
        
        $__p__ .= 'Base template nested Block11';
        return $__p__;
        
    }
    
    
    /* tpl block render method for block 'Block1' */
    private function _blockfn_Block1(&$data, $self, $__i__) 
    { 
        
        $__p__ = '';
        
        $__p__ .= '' . "\n" . 'Base template Block1' . "\n" . '<br /><br />' . "\n" . '' .  $__i__->renderBlock('Block11', $data);
        $__p__ .= '' . "\n" . '<br /><br />' . "\n" . '' .  $__i__->renderBlock('Block12', $data);
        $__p__ .= '' . "\n" . '<br /><br />' . "\n" . '';
        return $__p__;
        
    }
    
    /* tpl-defined blocks render code ends here */
    
    /* tpl renderBlock method */
    public function renderBlock($block, &$data, $__i__=null)
    {
        $self = $this;
        if ( !$__i__ ) $__i__ = $self;
        $method = '_blockfn_' . $block;
        if ( method_exists($self, $method) ) return $self->{$method}($data, $self, $__i__);
        elseif ( $self->_extends ) return $self->_extends->renderBlock($block, $data, $__i__);
        return '';
    }
    
    /* tpl render method */
    public function render(&$data, $__i__=null)
    {
        $self = $this;
        if ( !$__i__ ) $__i__ = $self;
        $__p__ = '';
        if ( $self->_extends )
        {
            $__p__ = $self->_extends->render($data, $__i__);
        }
        else
        {
            /* tpl main render code starts here */
            
            $__p__ .= '<!-- this is the base template -->' . "\n" . '' . "\n" . '<strong>This is the base template</strong>' . "\n" . '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block1</strong><br />' . "\n" . '' .  $__i__->renderBlock('Block1', $data);
            $__p__ .= '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2</strong><br />' . "\n" . '' .  $__i__->renderBlock('Block2', $data);
            $__p__ .= '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block3</strong><br />' . "\n" . '' .  $__i__->renderBlock('Block3', $data);
            $__p__ .= '' . "\n" . '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2 Again</strong><br />' . "\n" . '' .  '';
            $__p__ .= '' . "\n" . '<strong>This is Block2 using getblock</strong><br />' . "\n" . '' . ($__i__->renderBlock("Block2", $data)) . '' . "\n" . '';
            
            /* tpl main render code ends here */
        }
        return $__p__;
    }
}
}
