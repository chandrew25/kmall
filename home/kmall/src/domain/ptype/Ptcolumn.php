<?php
/**
 +---------------------------------------<br/>
 * 商品分类所属栏目<br/>
 +---------------------------------------
 * @category kmall
 * @package ptype
 * @author skygreen skygreen2001@gmail.com
 */
class Ptcolumn extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $ptcolumn_id;
    /**
     * 商品分类所属栏目<br/>
     * 1:品牌特惠-brand<br/>
     * 2:特色专场-special<br/>
     * 3.销售排行-topsale
     * @var enum
     * @access public
     */
    public $column_type;
    /**
     * 商品分类标识
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 商品分类名称
     * @var string
     * @access public
     */
    public $ptype_name;
    /**
     * 排序<br/>
     * 权重越大，越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    /**
     * 显示商品分类所属栏目<br/>
     * 1:品牌特惠-brand<br/>
     * 2:特色专场-special<br/>
     * 3.销售排行-topsale<br/>
     */
    public static function column_typeShow($column_type)
    {
        return EnumColumnType::column_typeShow($column_type);
    }
}
?>