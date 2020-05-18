<?php
/**
 +---------------------------------------<br/>
 * 会员收藏商品<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Collect extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $collect_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 商品名称
     * @var string
     * @access public
     */
    public $product_name;
    /**
     * 价格
     * @var float
     * @access public
     */
    public $price;
    /**
     * 积分
     * @var float
     * @access public
     */
    public $jifen;
    /**
     * 量词
     * @var string
     * @access public
     */
    public $unit;
    /**
     * 关注
     * @var string
     * @access public
     */
    public $isAttent;
    //</editor-fold>
}
?>