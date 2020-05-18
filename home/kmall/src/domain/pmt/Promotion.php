<?php
/**
 +---------------------------------------<br/>
 * 促销活动表<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Promotion extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $promotion_id;
    /**
     * 促销活动名称
     * @var string
     * @access public
     */
    public $promotion_name;
    /**
     * 开始时间
     * @var int
     * @access public
     */
    public $begin_time;
    /**
     * 结束时间
     * @var int
     * @access public
     */
    public $end_time;
    /**
     * 描述
     * @var string
     * @access public
     */
    public $promdescribe;
    /**
     * 是否有效
     * @var string
     * @access public
     */
    public $isValid;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

}
?>