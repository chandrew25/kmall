<?php
/**
 +---------------------------------------<br/>
 * 部门<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Department extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $department_id;
    /**
     * 门部名称
     * @var string
     * @access public
     */
    public $department_name;
    /**
     * 否是显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 门部排序，权重越大越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>

}
?>