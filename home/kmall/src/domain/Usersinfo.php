<?php
/**
 +---------------------------------------<br/>
 * 微信用户<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Usersinfo extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $usersinfo_id;
    /**
     * 姓名
     * @var string
     * @access public
     */
    public $name;
    /**
     * 生日
     * @var string
     * @access public
     */
    public $birthday;
    /**
     * 性别
     * @var string
     * @access public
     */
    public $gender;
    /**
     * 手机
     * @var string
     * @access public
     */
    public $mobile;
    /**
     * openid
     * @var string
     * @access public
     */
    public $openid;
    
}
?>
