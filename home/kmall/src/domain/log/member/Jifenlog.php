<?php
/**
 +---------------------------------------<br/>
 * 会员积分日志<br/>
 +---------------------------------------
 * @category kmall
 * @package log.member
 * @author skygreen skygreen2001@gmail.com
 */
class Jifenlog extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $jifenlog_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 积分原值
     * @var int
     * @access public
     */
    public $jifenoriginal;
    /**
     * 积分增加值
     * @var int
     * @access public
     */
    public $jifenraise;
    /**
     * 积分减少值
     * @var int
     * @access public
     */
    public $jifenreduce;
    /**
     * 积分变动描述
     * @var string
     * @access public
     */
    public $discribe;
    /**
     * 操作描述的枚举值
     * @var int
     * @access public
     */
    public $discribe_enum;
    //</editor-fold>

}
?>