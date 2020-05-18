<?php
/**
 +---------------------------------------<br/>
 * 优惠券实体表<br/>
 +---------------------------------------
 * @category kmall
 * @package coupon
 * @author skygreen skygreen2001@gmail.com
 */
class Couponitems extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 
     * @var int
     * @access public
     */
    public $couponitems_id;
    /**
     * 会员标识
     * @var int
     * @access public
     */
    public $member_id;
    /**
     * 优惠券号码
     * @var string
     * @access public
     */
    public $couponitems_key;
    /**
     * 所属优惠券标识
     * @var int
     * @access public
     */
    public $coupon_id;
    /**
     * 优惠券价值
     * @var float
     * @access public
     */
    public $coupon_value;
    /**
     * 手机号码
     * @var string
     * @access public
     */
    public $phonenumber;
    /**
     * 是否兑换
     * @var string
     * @access public
     */
    public $isExchange;
    /**
     * 生成类型<br/>
     * 1:优惠券发布-publish<br/>
     * 2:促销活动规则-promotion<br/>
     * 3:优惠券规则-coupon
     * @var enum
     * @access public
     */
    public $create_from;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    /** 
     * 显示生成类型<br/>
     * 1:优惠券发布-publish<br/>
     * 2:促销活动规则-promotion<br/>
     * 3:优惠券规则-coupon<br/>
     */
    public function getCreate_fromShow()
    {
        return self::create_fromShow($this->create_from);
    }

    /** 
     * 显示生成类型<br/>
     * 1:优惠券发布-publish<br/>
     * 2:促销活动规则-promotion<br/>
     * 3:优惠券规则-coupon<br/>
     */
    public static function create_fromShow($create_from)
    {
        return EnumCreateFrom::create_fromShow($create_from);
    }
    
    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "coupon"=>"Coupon"
    );

}
?>