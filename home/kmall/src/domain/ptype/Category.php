<?php
/**
 +---------------------------------------<br/>
 * 分类显示<br/>
 * 推荐显示的二级分类<br/>
 +---------------------------------------
 * @category kmall
 * @package ptype
 * @author skygreen skygreen2001@gmail.com
 */
class Category extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 
     * @var int
     * @access public
     */
    public $category_id;
    /**
     * 分类标识
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 分类名称
     * @var string
     * @access public
     */
    public $ptype_name;
    /**
     * 一级分类展示图片
     * @var string
     * @access public
     */
    public $image;
    /**
     * 分类图标
     * @var string
     * @access public
     */
    public $ico;
    /**
     * 分类链接
     * @var string
     * @access public
     */
    public $link_url;
    /**
     * 上级分类<br/>
     * 所属父产品类型唯一标识
     * @var int
     * @access public
     */
    public $parent_id;
    /**
     * 目录层级
     * @var string
     * @access public
     */
    public $level;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 排序<br/>
     * 权重越大，越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    /**
     * 最高的层次，默认为3 
     */
    public static function maxlevel()
    {
        return Category::select("max(level)");//return 3;
    }

}
?>