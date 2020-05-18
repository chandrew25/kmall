<?php
/**
 +---------------------------------------<br/>
 * 密码重置<br/>
 +---------------------------------------
 * @category bonli
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Pwdreset extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $pwdreset_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 用户名
     * @var string
     * @access public
     */
    public $username;
    /**
     * 密文
     * @var string
     * @access public
     */
    public $code;
    /**
     * 是否使用过
     * @var string
     * @access public
     */
    public $isUsed;
    /**
     * 是否进入页面
     * @var string
     * @access public
     */
    public $isIn;
    /**
     * 提交时间
     * @var int
     * @access public
     */
    public $sendTime;
    //</editor-fold>

}
?>