<?php
/**
 +---------------------------------------<br/>
 * 商品赠品<br/>
 +---------------------------------------
 * @category kmall
 * @package product.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Productgift extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标志
     * @var int
     * @access public
     */
    public $productgift_id;
    /**
     * 商品标志
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 赠品标志
     * @var int
     * @access public
     */
    public $gift_id;
    /**
     * 赠品数量
     * @var string
     * @access public
     */
    public $nums;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "product"=>"Product",
        "goods"=>"Goods"
    );

    //设定表与数据的关系
    public $field_spec=array(
        EnumDataSpec::FOREIGN_ID=>array(
            "Goods"=>"gift_id"
        )
    );
}
?>