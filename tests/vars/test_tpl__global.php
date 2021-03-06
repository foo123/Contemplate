<?php 

if (!class_exists('Contemplate_test__global', false))
{
/* Contemplate cached template 'test' */
final class Contemplate_test__global extends ContemplateTemplate
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
        
        $__p__ .= '' . "\n" . '' . ($data['v']->prop) . '' . "\n" . '' . "\n" . '' . ($data['v']->func(Contemplate::url($data['v']->prop))) . '' . "\n" . '' . "\n" . '' . ($data['a'][0]) . '' . "\n" . '' . "\n" . '' . ($data['a'][1]['prop']) . '' . "\n" . '' . "\n" . '' . ($data['v']->method(Contemplate::url($data['v']->prop))->func("foo")) . '' . "\n" . '' . "\n" . '' . (Contemplate::url($data['v']->method("foo")->func("bar"))) . '' . "\n" . '' . "\n" . '' . (Contemplate::url($data['v']->method("foo")->prop)) . '' . "\n" . '' . "\n" . '' . (Contemplate::url($data['v']->method("foo")->prop2->prop)) . '' . "\n" . '' . "\n" . '' . (Contemplate::get($data['a'], array(0+1, "prop"))) . '' . "\n" . '' . "\n" . '' . (Contemplate::get($data['a'], array(intval("0")+1,"prop"))) . '' . "\n" . '' . "\n" . '' . (Contemplate::get($data['v'], "propGetter")) . '' . "\n" . '';
        
        /* tpl main render code ends here */
    }
    if ( $__ctx )  Contemplate::_set_ctx( $__ctx );
    return $__p__;
}
}
}
