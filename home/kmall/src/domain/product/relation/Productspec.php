<?php
/**
 +---------------------------------------<br/>
 * 商品规格<br/>
 +---------------------------------------
 * @category kmall
 * @package product.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Productspec extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $productspec_id;
    /**
     * 商品标识
     * @var int
     * @access public
     */
    public $product_id;
    /**
     * 规格标识
     * @var int
     * @access public
     */
    public $attribute_id;
    /**
     * 规格父标识<br/>
     * 
     * @var int
     * @access public
     */
    public $attr_p_id;
    /**
     * 规格名称
     * @var string
     * @access public
     */
    public $attr_name;
    /**
     * 父规格名称
     * @var string
     * @access public
     */
    public $attr_p_name;
    /**
     * 规格图标
     * @var string
     * @access public
     */
    public $attr_ico;
    /**
     * 关联商品图片标识<br/>
     * (以逗号分隔)
     * @var string
     * @access public
     */
    public $re_pimg;
    /**
     * 关联图片路径<br/>
     * (以逗号分隔)
     * @var string
     * @access public
     */
    public $re_imgpath;
    //</editor-fold>

}
?>
