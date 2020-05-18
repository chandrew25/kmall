<?php
/**
 +---------------------------------------<br/>
 * 量词<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Quantifier extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $quantifier_id;
    /**
     * 名称<br/>
     *
     * @var string
     * @access public
     */
    public $quantifier_name;
    /**
     * 排序<br/>
     * 权重越大，越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>
}
?>