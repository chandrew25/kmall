<?php
/**
 +---------------------------------------<br/>
 * 运送商品<br/>
 * 物流单所需发送的商品。<br/>
 +---------------------------------------
 * @category yile
 * @package shop.delivery
 * @author skygreen skygreen2001@gmail.com
 */
class Deliveryitem extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 快递物品唯一标识
     * @var int
     * @access public
     */
    public $deliveryitem_id;  
    /**
     * 快递单号
     * @var int
     * @access public
     */
    public $delivery_id;
    /**
     * 商品编号
     * @var string
     * @access public
     */
    public $product_id;
    /**
     * 商品类型<br/>
     * 1:产品-goods<br/>
     * 2:礼物-gift<br/>
     * 3:包裹-pkg
     * @var enum
     * @access public
     */
    public $item_type;
    /**
     * 商品名称
     * @var string
     * @access public
     */
    public $product_name;
    /**
     * 商品价格
     * @var float
     * @access public
     */
    public $price;
    /**
     * 数量
     * @var int
     * @access public
     */
    public $number;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "app"=>"App",
        "product"=>"Product",
        "delivery"=>"Delivery"
    );

    /** 
     * 显示商品类型<br/>
     * 1:产品-goods<br/>
     * 2:礼物-gift<br/>
     * 3:包裹-pkg<br/>
     */
    public function getItem_typeShow()
    {
        return self::item_typeShow($this->item_type);
    }

    /** 
     * 显示商品类型<br/>
     * 1:产品-goods<br/>
     * 2:礼物-gift<br/>
     * 3:包裹-pkg<br/>
     */
    public static function item_typeShow($item_type)
    {
        return EnumItemType::item_typeShow($item_type);
    }
}
?>