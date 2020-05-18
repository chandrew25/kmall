<?php
/**
 +---------------------------------------<br/>
 * 品牌商品分类关系<br/>
 +---------------------------------------
 * @category kmall
 * @package brand.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Brandptype extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $brandptype_id;
    /**
     * 品牌标识
     * @var int
     * @access public
     */
    public $brand_id;
    /**
     * 商品类型编号
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 商品分类[一级]
     * @var int
     * @access public
     */
    public $ptype1_id;
    /**
     * 商品分类[二级]
     * @var int
     * @access public
     */
    public $ptype2_id;
    /**
     * 是否显示<br/>
     * 默认显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 是否推荐<br/>
     * 热销品牌
     * @var string
     * @access public
     */
    public $isRecommend;
    static $has_many=array(
        'bproducts'=>"Bproduct"
    );

    static $belong_has_one=array(
        'brand'=>"Brand",
        'ptype'=>'Ptype'
    );
    //</editor-fold>
}
?>