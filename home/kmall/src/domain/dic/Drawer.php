<?php
/**
 +---------------------------------------<br/>
 * 开票方<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Drawer extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $drawer_id;
    /**
     * 开票方
     * @var string
     * @access public
     */
    public $drawer_name;
    /**
     * 排序
     * @var int
     * @access public
     */
    public $sort_order;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    //</editor-fold>

}
?>