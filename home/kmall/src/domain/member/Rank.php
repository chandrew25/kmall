<?php
/**
 +---------------------------------------<br/>
 * 会员等级表<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Rank extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $rank_id;
    /**
     * 等级名称
     * @var string
     * @access public
     */
    public $rank_name;
    /**
     * 积分下限
     * @var int
     * @access public
     */
    public $lowerlimit;
    /**
     * 积分上限
     * @var int
     * @access public
     */
    public $upperlimit;
    /**
     * 折扣率
     * @var float
     * @access public
     */
    public $discount;
    //</editor-fold>

}
?>