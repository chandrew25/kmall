<?php
/**
 +---------------------------------------<br/>
 * 样例系列图<br/>
 +---------------------------------------
 * @category kmall
 * @package example
 * @author skygreen skygreen2001@gmail.com
 */
class Caseimgs extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $caseimgs_id;
    /**
     * 样例标识
     * @var int
     * @access public
     */
    public $ccase_id;
    /**
     * 样例图片
     * @var string
     * @access public
     */
    public $case_img;
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
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "ccase"=>"Ccase"
    );

}
?>