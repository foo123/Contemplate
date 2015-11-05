<?php 

if (!class_exists('Contemplate_tpl3__global'))
{
/* Contemplate cached template 'tpl3' */
final class Contemplate_tpl3__global extends ContemplateTemplate
{
/* constructor */
public function __construct($id=null)
{
    $self = $this;
    parent::__construct( $id );
    
    /* extend tpl assign code starts here */
    $self->extend('tpl2');
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */


/* tpl block render method for block '3' */
private function _blockfn_3(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '(3 3)' . "\n" . '        ' . ($self->sprblock("3", $data)) . '' . "\n" . '        ';
    return $__p__;
    
}


/* tpl block render method for block '2' */
private function _blockfn_2(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '(3 2)' . "\n" . '        ' .  $__i__->block('3', $data);
    $__p__ .= '' . "\n" . '    ' . ($self->sprblock("2", $data)) . '' . "\n" . '    ';
    return $__p__;
    
}


/* tpl block render method for block '1' */
private function _blockfn_1(&$data, $self, $__i__) 
{ 
    
    $__p__ = '';
    
    $__p__ .= '(3 1)' . "\n" . '    ' .  $__i__->block('2', $data);
    $__p__ .= '' . "\n" . '' . ($self->sprblock("1", $data)) . '' . "\n" . '';
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
        
        $__p__ = '';
        
        /* tpl main render code ends here */
    }
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $__p__;
}
}
}
