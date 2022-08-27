<?php 

if (!class_exists('Contemplate_test__global', false))
{
/* Contemplate cached template 'test' */
final class Contemplate_test__global extends ContemplateTemplate
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
        
        $__p__ .= '' . "\n" . '';
        $_loc_3 = $data['list'];
        if (!empty($_loc_3))
        {
            foreach ($_loc_3 as $_loc_v)
            {
                
                $__p__ .= '' . "\n" . '';        
                /* php code start */
                $foo = "php";
                $bar = "code";        
                /* php code end */
                $__p__ .= '' . "\n" . '' . ($_loc_v) . '' . "\n" . '';        
                /* php code start */        
                $__p__ .= (string)("php");        
                /* php code end */
                $__p__ .= '' . "\n" . '';
            }
        }
        
        $__p__ .= '' . "\n" . '' . "\n" . '';
        /* php code start */
        foreach ($data['list'] as $v)
        {    
            /* php code end */
            $__p__ .= '';    
            /* php code start */    
            $__p__ .= (string)($v);    
            /* php code end */
            $__p__ .= '' . "\n" . '';
        /* php code start */
        }
        /* php code end */
        $__p__ .= '' . "\n" . '' . "\n" . '';
        
        /* tpl main render code ends here */
    }
    if ($__ctx)  Contemplate::_set_ctx($__ctx);
    return $__p__;
}
}
}
