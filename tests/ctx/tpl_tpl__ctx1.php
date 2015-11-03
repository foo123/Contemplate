<?php 

if (!class_exists('Contemplate_tpl_Cached__ctx1'))
{
/* Contemplate cached template 'tpl' */
final class Contemplate_tpl_Cached__ctx1 extends ContemplateTemplate
{
/* constructor */
public function __construct($id=null)
{
    $self = $this;
    parent::__construct( $id );
    
    /* extend tpl assign code starts here */
    $self->extend('global');
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */

/* tpl-defined blocks render code ends here */
/* tpl renderBlock method */
public function renderBlock($block, &$data, $__i__=null)
{
    $self = $this; $r = ''; $__ctx = null;
    if ( !$__i__ )
    {
        $__i__ = $self;
        $__ctx = Contemplate::_set_ctx( $self->_ctx );
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
    $self = $this; $__ctx = null;
    if ( !$__i__ )
    {
        $__i__ = $self;
        $__ctx = Contemplate::_set_ctx( $self->_ctx );
    }
    $__p__ = '';
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
