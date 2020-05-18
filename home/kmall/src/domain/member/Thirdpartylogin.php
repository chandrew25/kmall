<?php
/**
 +---------------------------------------<br/>
 * 第三方登录<br/>
 +---------------------------------------
 * @category kmall
 * @package member
 * @author skygreen skygreen2001@gmail.com
 */
class Thirdpartylogin extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $thirdpartylogin_id;
    /**
     * 用户接入标识
     * @var string
     * @access public
     */
    public $openid;
    /**
     * 登录类型标识
     * @var int
     * @access public
     */
    public $logintype_id;
    /**
     * 用户标识
     * @var int
     * @access public
     */
    public $member_id;
    //</editor-fold>

}
?>