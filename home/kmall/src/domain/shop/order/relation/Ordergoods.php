<?php
/**
 +---------------------------------------<br/>
 * 订购商品<br/>
 +---------------------------------------
 * @category kmall
 * @package shop.order.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Ordergoods extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $ordergoods_id;
    /**
     * 会员编号
     * @var string
     * @access public
     */
    public $member_id;
    /**
     * 订单编号
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 商品编号
     * @var string
     * @access public
     */
    public $goods_id;
    /**
     * 商品唯一标识
     * @var string
     * @access public
     */
    public $goods_code;
    /**
     * 商品名称
     * @var string
     * @access public
     */
    public $goods_name;
    /**
     * 订购商品的链接<br/>
     * 第三方提供或者自定义的显示页面的URL。
     * @var string
     * @access public
     */
    public $url;
    /**
     * 总价
     * @var float
     * @access public
     */
    public $amount;
    /**
     * 单价
     * @var float
     * @access public
     */
    public $price;
    /**
     * 实际购买价格
     * @var float
     * @access public
     */
    public $real_price;
    /**
     * 积分
     * @var int
     * @access public
     */
    public $jifen;
    /**
     * 数量
     * @var string
     * @access public
     */
    public $nums;
    /**
     * 是否为赠品
     * @var string
     * @access public
     */
    public $isGiveaway;
  	/**
  	 * 物流状态<br/>
  	 * 0:未发货-undispatch<br/>
  	 * 1:已发货-dispatch<br/>
  	 * 4:已退货-returned<br/>
  	 * 5:已签收-signed<br/>
  	 * 7:申请退货-apply
  	 * @var enum
  	 * @access public
  	 */
  	public $ship_status;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "app"=>"App",
        "member"=>"Member",
        "order"=>"Order",
        "goods"=>"Goods"
    );
    
    /**
     * 显示物流状态<br/>
     * 0:未发货-undispatch<br/>
     * 1:已发货-dispatch<br/>
     * 4:已退货-returned<br/>
     * 5:已签收-signed<br/>
     * 7:申请退货-apply<br/>
     */
    public function getShip_statusShow()
    {
      return self::ship_statusShow($this->ship_status);
    }

    /**
     * 显示物流状态<br/>
     * 0:未发货-undispatch<br/>
     * 1:已发货-dispatch<br/>
     * 4:已退货-returned<br/>
     * 5:已签收-signed<br/>
     * 7:申请退货-apply<br/>
     */
    public static function ship_statusShow($ship_status)
    {
      return EnumShipStatus::ship_statusShow($ship_status);
    }
}
?>
