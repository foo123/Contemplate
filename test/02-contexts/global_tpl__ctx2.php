<?php 

if (!class_exists('Contemplate_global__ctx2', false))
{
/* Contemplate cached template 'global' */
final class Contemplate_global__ctx2 extends ContemplateTemplate
{
/* constructor */
public function __construct($id = null)
{
    $self = $this;
    parent::__construct($id);
    
    /* extend tpl assign code starts here */
    
    $self->_usesTpl = array();
    /* extend tpl assign code ends here */
}    
/* tpl-defined blocks render code starts here */

/* tpl-defined blocks render code ends here */
/* tpl block method */
public function block($block, &$data, $__i__ = null)
{
    $self = $this; $r = ''; $__ctx = false;
    if (!$__i__)
    {
        $__i__ = $self;
        if (!$self->_autonomus) $__ctx = Contemplate::_set_ctx($self->_ctx);
    }
    $method = '_blockfn_' . $block;
    if (method_exists($self, $method)) $r = $self->{$method}($data, $self, $__i__);
    elseif ($self->_extends) $r = $self->_extends->block($block, $data, $__i__);
    if ($__ctx)  Contemplate::_set_ctx($__ctx);
    return $r;
}
/* tpl render method */
public function render(&$data, $__i__ = null)
{
    $self = $this; $__ctx = false;
    $__p__ = '';
    if (!$__i__)
    {
        $__i__ = $self;
        if (!$self->_autonomus) $__ctx = Contemplate::_set_ctx($self->_ctx);
    }
    if ($self->_extends)
    {
        $__p__ = $self->_extends->render($data, $__i__);
    }
    else
    {
        /* tpl main render code starts here */
        
        $__p__ .= '' . "\n" . '' . (Contemplate::plg_("my_plugin","ctx")) . '' . "\n" . '';
        
        /* tpl main render code ends here */
    }
    if ($__ctx)  Contemplate::_set_ctx($__ctx);
    return $__p__;
}
}
}
