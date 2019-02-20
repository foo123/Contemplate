<?php 

if (!class_exists('Contemplate_base__global', false))
{
/* Contemplate cached template 'base' */
final class Contemplate_base__global extends ContemplateTemplate
{
/* constructor */
public function __construct($id=null)
{
    $self = $this;
    parent::__construct( $id );
    
    /* extend tpl assign code starts here */
    
    $self->_usesTpl = array();
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */


/* tpl block render method for block 'Block3' */
protected function _blockfn_Block3(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= 'Base template Block3';
    return $__p__;
    
}


/* tpl block render method for block 'Block2' */
protected function _blockfn_Block2(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= 'Base template Block2' . "\n" . '<!-- call the super block here in OO manner, if any -->' . "\n" . '' . ($self->sprblock("Block2", $data)) . '' . "\n" . '';
    return $__p__;
    
}


/* tpl block render method for block 'Block12' */
protected function _blockfn_Block12(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= 'Base template nested Block12';
    return $__p__;
    
}


/* tpl block render method for block 'Block11' */
protected function _blockfn_Block11(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= 'Base template nested Block11';
    return $__p__;
    
}


/* tpl block render method for block 'Block1' */
protected function _blockfn_Block1(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '' . "\n" . 'Base template Block1' . "\n" . '<br /><br />' . "\n" . '' .  $__i__->block('Block11', $data);$__p__ .= '' . "\n" . '<br /><br />' . "\n" . '' .  $__i__->block('Block12', $data);$__p__ .= '' . "\n" . '<br /><br />' . "\n" . '';
    return $__p__;
    
}

/* tpl-defined blocks render code ends here */
/* tpl block method */
public function block($block, &$data, $__i__=null)
{
    $self = $this; $r = ''; $__ctx = false;
    if ( !$__i__ )
    {
        $__i__ = $self;
        if ( !$self->_autonomus ) $__ctx = Contemplate::_set_ctx( $self->_ctx );
    }
    $method = '_blockfn_' . $block;
    if ( method_exists($self, $method) ) $r = $self->{$method}($data, $self, $__i__);
    elseif ( $self->_extends ) $r = $self->_extends->block($block, $data, $__i__);
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
        
        $__p__ .= '<!-- this is the base template -->' . "\n" . '' . "\n" . '<strong>This is the base template</strong>' . "\n" . '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block1</strong><br />' . "\n" . '' .  $__i__->block('Block1', $data);$__p__ .= '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2</strong><br />' . "\n" . '' .  $__i__->block('Block2', $data);$__p__ .= '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block3</strong><br />' . "\n" . '' .  $__i__->block('Block3', $data);$__p__ .= '' . "\n" . '' . "\n" . '' . "\n" . '<br /><br /><br /><br />' . "\n" . '<strong>This is Block2 Again</strong><br />' . "\n" . '' .  '';$__p__ .= '' . "\n" . '<strong>This is Block2 using getblock</strong><br />' . "\n" . '' . ($__i__->block("Block2", $data)) . '' . "\n" . '';
        
        /* tpl main render code ends here */
    }
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $__p__;
}
}
}
