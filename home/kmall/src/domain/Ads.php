<?php
/**
 +---------------------------------------<br/>
 * 广告<br/>
 +---------------------------------------
 * @category kmall
 * @package
 * @author skygreen skygreen2001@gmail.com
 */
class Ads extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $ads_id;
    /**
     * 广告名
     * @var string
     * @access public
     */
    public $name;
    /**
     * 广告类型<br/>
     * 1:首页中央-IndexMid<br/>
     * 2:首页右侧-IndexRig<br/>
     * 3:首页右下-IndexRnD<br/>
     * 4:首页下方-IndexDow<br/>
     * 5:首页中上-IndexMnT
     * @var enum
     * @access public
     */
    public $adstype;
    /**
     * 广告链接
     * @var string
     * @access public
     */
    public $link;
    /**
     * 图片地址<br/>
     * 或图片网址
     * @var string
     * @access public
     */
    public $image;
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
     * 联系人
     * @var string
     * @access public
     */
    public $link_man;
    /**
     * 联系邮件
     * @var string
     * @access public
     */
    public $link_email;
    /**
     * 联系电话
     * @var string
     * @access public
     */
    public $link_phone;
    /**
     * 点击次数
     * @var string
     * @access public
     */
    public $click_count;
    /**
     * 显示宽度
     * @var string
     * @access public
     */
    public $width;
    /**
     * 显示高度
     * @var string
     * @access public
     */
    public $height;
    //</editor-fold>

    /**
     * 显示广告类型<br/>
     * 1:首页中央-IndexMid<br/>
     * 2:首页右侧-IndexRig<br/>
     * 3:首页右下-IndexRnD<br/>
     * 4:首页下方-IndexDow<br/>
     */
    public static function adstypeShow($adstype)
    {
        return EnumAdstype::adstypeShow($adstype);
    }
}
?>