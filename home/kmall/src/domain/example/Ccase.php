<?php
/**
 +---------------------------------------<br/>
 * 设计样例<br/>
 +---------------------------------------
 * @category kmall
 * @package example
 * @author skygreen skygreen2001@gmail.com
 */
class Ccase extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $ccase_id;
    /**
     * 公司名称
     * @var string
     * @access public
     */
    public $company_name;
    /**
     * 样例名称
     * @var string
     * @access public
     */
    public $ccase_name;
    /**
     * 描述
     * @var string
     * @access public
     */
    public $descr;
    /**
     * 风格标识
     * @var int
     * @access public
     */
    public $style_id;
    /**
     * 封面图
     * @var string
     * @access public
     */
    public $cover_img;
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
     * 规格说明
     * 表中不存在的默认列定义:commitTime,updateTime
     * @var mixed
     */
    public $field_spec=array(
        EnumDataSpec::REMOVE=>array(
            'commitTime',
            'updateTime'
        )
    );

    /**
     * 一对多关系
     */
    static $has_many=array(
        "caseimgs"=>"Caseimgs"
    );

}
?>