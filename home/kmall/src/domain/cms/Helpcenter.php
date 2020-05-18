<?php
/**
 +---------------------------------------<br/>
 * 帮助中心<br/>
 +---------------------------------------
 * @category kmall
 * @package cms
 * @author skygreen skygreen2001@gmail.com
 */
class Helpcenter extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $helpcenter_id;
    /**
     * 标题
     * @var string
     * @access public
     */
    public $help_title;
    /**
     * 内容
     * @var string
     * @access public
     */
    public $help_content;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 排序顺序<br/>
     *
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>
}
?>