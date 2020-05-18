<?php
/**
 +---------------------------------------<br/>
 * 分类属性<br/>
 +---------------------------------------
 * @category kmall
 * @package ptype.relation
 * @author skygreen skygreen2001@gmail.com
 */
class Ptypeattr extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $ptypeattr_id;
    /**
     * 属性标识
     * @var int
     * @access public
     */
    public $attribute_id;
    /**
     * 属性分类[一级]
     * @var int
     * @access public
     */
    public $attribute1_id;
    /**
     * 分类标识
     * @var int
     * @access public
     */
    public $ptype_id;
    /**
     * 分类标识[一级]
     * @var int
     * @access public
     */
    public $ptype1_id;
    /**
     * 分类标识[二级]
     * @var int
     * @access public
     */
    public $ptype2_id;

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "attribute"=>"Attribute",
        "ptype"=>"Ptype"
    );
    
    /**
     * 计算所有的子元素数量并存储
     */
    public static function allCountChild()
    {
        $max_id=Ptype::max();
        for($i=1;$i<=$max_id;$i++){
            $countChild=Ptype::select("count(*)","parent_id=".$i);
            Ptype::updateBy("ptype_id=".$i,"countChild=".$countChild);
        }
    }

    /**
     * 最高的层次，默认为3 
     */
    public static function maxlevel()
    {
        return Ptype::select("max(level)");//return 3;
    }
}
?>