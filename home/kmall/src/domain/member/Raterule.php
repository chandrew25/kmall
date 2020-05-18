<?php
/**
 +---------------------------------------<br/>
 * 用户角色和折扣<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Raterule extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $raterule_id;
    /**
     * 角色名
     * @var string
     * @access public
     */
    public $raterule_name;
    /**
     * 折扣率
     * @var float
     * @access public
     */
    public $rate;
    //</editor-fold>

    static $has_one=array(
        'member'=>'Member'
        );

}
?>