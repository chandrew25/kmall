<?php
/**
 +---------------------------------------<br/>
 * 购物车
 +---------------------------------------
 * @category kmall
 * @package shop
 * @author skygreen skygreen2001@gmail.com
 */
class Cart extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $cart_id;
    /**
     * 会员编号
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * session标识
     * @var string
     * @access public
     */
    public $session_id;
    /**
     * 商品编号
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 商品代码
     * @var string
     * @access public
     */
    public $product_code;
    /**
     * 商品名称
     * @var string
     * @access public
     */
    public $product_name;
    /**
     * 商品图片
     * @var string
     * @access public
     */
    public $product_ico;
    /**
     * 货品id
     * @var string
     * @access public
     */
    public $goods_id;
    /**
     * 市场价
     * @var float
     * @access public
     */
    public $market_price;
    /**
     * 销售价
     * @var float
     * @access public
     */
    public $price;
    /**
     * 积分
     * @var int
     * @access public
     */
    public $jifen;
    /**
     * 商品数
     * @var string
     * @access public
     */
    public $num;
    //</editor-fold>

    /**
     *获取购物车总额
     */
    public static function getCartPrice(){
        $member_id = HttpSession::get("member_id");
        $goods = Cart::get("member_id=".$member_id);
        $price = 0;
        if (!empty($goods)) {
            foreach ($goods as $key => $value) {
                $price += $value->price * $value->num;
            }
        }
        return sprintf("%.2f",$price);
    }
}
?>
