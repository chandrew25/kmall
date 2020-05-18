<?php
/**
 +---------------------------------------<br/>
 * 属性表<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Attribute extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $attribute_id;
    /**
     * 属性名
     * @var string
     * @access public
     */
    public $attribute_name;
    /**
     * 属性层级
     * @var string
     * @access public
     */
    public $level;
    /**
     * 上级分类<br/>
     * 所属父产品类型唯一标识
     * @var int
     * @access public
     */
    public $parent_id;
    /**
     * 分组
     * @var int
     * @access public
     */
    public $grouping;
    /**
     * 是否显示
     * @var string
     * @access public
     */
    public $isShow;
    /**
     * 排序
     * @var int
     * @access public
     */
    public $sort_order;
    /**
     * 属性类型<br/>
     * 1:文字-letter<br/>
     * 2:图片-picture
     * @var enum
     * @access public
     */
    public $attr_type;
    /**
     * 属性图标
     * @var string
     * @access public
     */
    public $attr_ico;
    /**
     * 属性备注
     * @var string
     * @access public
     */
    public $attr_remarks;
    //</editor-fold>

    /**
     * 一对多关系
     */
    static $has_many=array(
        "ptypeattr"=>"Ptypeattr"
    );

    /** 
     * 显示属性类型<br/>
     * 1:文字-letter<br/>
     * 2:图片-picture<br/>
     */
    public function getAttr_typeShow()
    {
        return self::attr_typeShow($this->attr_type);
    }

    /** 
     * 显示属性类型<br/>
     * 1:文字-letter<br/>
     * 2:图片-picture<br/>
     */
    public static function attr_typeShow($attr_type)
    {
        return EnumAttrType::attr_typeShow($attr_type);
    }

    /**
     * 最高的层次，默认为3 
     */
    public static function maxlevel()
    {
        return Attribute::select("max(level)");//return 3;
    }

}
?>