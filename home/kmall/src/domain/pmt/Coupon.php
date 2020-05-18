<?php
/**
 +---------------------------------------<br/>
 * 优惠券表<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Coupon extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $coupon_id;
    /**
     * 优惠券名称
     * @var string
     * @access public
     */
    public $coupon_name;
    /**
     * 优惠券号码
     * @var string
     * @access public
     */
    public $coupon_key;
    /**
     * 优惠券类型<br/>
     * 0:多张使用一次-once<br/>
     * 1:一张无限使用-infinite
     * @var enum
     * @access public
     */
    public $coupon_type;
    /**
     * 优惠券数量
     * @var string
     * @access public
     */
    public $coupon_num;
    /**
     * 开始时间
     * @var int
     * @access public
     */
    public $begin_time;
    /**
     * 结束时间
     * @var int
     * @access public
     */
    public $end_time;
    /**
     * 是否有效
     * @var string
     * @access public
     */
    public $isValid;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    /** 
     * 显示优惠券类型<br/>
     * 0:多张使用一次-once<br/>
     * 1:一张无限使用-infinite<br/>
     */
    public function getCoupon_typeShow()
    {
        return self::coupon_typeShow($this->coupon_type);
    }

    /** 
     * 显示优惠券类型<br/>
     * 0:多张使用一次-once<br/>
     * 1:一张无限使用-infinite<br/>
     */
    public static function coupon_typeShow($coupon_type)
    {
        return EnumCouponType::coupon_typeShow($coupon_type);
    }

}
?>