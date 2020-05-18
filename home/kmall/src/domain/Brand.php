<?php
/**
 +---------------------------------------<br/>
 * 品牌<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Brand extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $brand_id;
    /**
     * 名称
     * @var string
     * @access public
     */
    public $brand_name;
    /**
     * 缩略图
     * @var string
     * @access public
     */
    public $brand_logo;
    /**
     * 品牌图片
     * @var string
     * @access public
     */
    public $images;
    /**
     * 品牌描述
     * @var string
     * @access public
     */
    public $brand_desc;
    /**
     * 品牌网站链接
     * @var string
     * @access public
     */
    public $site_url;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 排序<br/>
     * 权重越大，越靠前
     * @var string
     * @access public
     */
    public $sort_order;
    /**
     * 品牌馆排序
     * @var int
     * @access public
     */
    public $seq_no;

    /**
     * 首字母
     * @var string
     * @access public
     */
    public $initials;

    static $has_many=array(
        "bproducts"=>"Bproduct"
    );

    //</editor-fold>
}
?>
