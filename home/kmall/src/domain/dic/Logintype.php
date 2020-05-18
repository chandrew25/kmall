<?php
/**
 +---------------------------------------<br/>
 * 登录类型<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Logintype extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $logintype_id;
    /**
     * 登录代号
     * @var string
     * @access public
     */
    public $logintype_code;
    /**
     * 应用名称
     * @var string
     * @access public
     */
    public $app_name;
    /**
     * 应用标识
     * @var string
     * @access public
     */
    public $app_id;
    /**
     * client_id
     * @var string
     * @access public
     */
    public $app_key;
    /**
     * 秘钥
     * @var string
     * @access public
     */
    public $app_secret;
    /**
     * 应用调用地址
     * @var string
     * @access public
     */
    public $app_url;
    /**
     * 登录图标
     * @var string
     * @access public
     */
    public $ico;
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

}
?>