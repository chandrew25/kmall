<?php
/**
 +---------------------------------------<br/>
 * 优惠规则表<br/>
 +---------------------------------------
 * @category kmall
 * @package 
 * @author skygreen skygreen2001@gmail.com
 */
class Preferentialrule extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $preferentialrule_id;
    /**
     * 规则分类<br/>
     * 1:优惠券-coupon<br/>
     * 2:促销活动-promotion
     * @var enum
     * @access public
     */
    public $classify_type;
    /**
     * 分类标识
     * @var int
     * @access public
     */
    public $classify_id;
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
     * 优惠金额下限
     * @var float
     * @access public
     */
    public $money_lower;
    /**
     * 优惠金额上限
     * @var float
     * @access public
     */
    public $money_upper;
    /**
     * 优惠类型<br/>
     * 1:商品直接打折-pdiscount<br/>
     * 2:满金额送优惠券-ocoupons<br/>
     * 3:满金额打折-odiscount<br/>
     * 4:满金额立减-oreduce
     * @var enum
     * @access public
     */
    public $preferential_type;
    /**
     * 立减价格
     * @var float
     * @access public
     */
    public $limit_reduce;
    /**
     * 折扣率
     * @var float
     * @access public
     */
    public $discount;
    /**
     * 描述
     * @var string
     * @access public
     */
    public $prefdescribe;
    /**
     * 是否可以使用优惠券
     * @var string
     * @access public
     */
    public $ifCoupon;
    /**
     * 是否作用在全部商品
     * @var string
     * @access public
     */
    public $ifEffectall;
    /**
     * 排序
     * @var string
     * @access public
     */
    public $sort_order;
    //</editor-fold>

    /** 
     * 显示规则分类<br/>
     * 1:优惠券-coupon<br/>
     * 2:促销活动-promotion<br/>
     */
    public function getClassify_typeShow()
    {
        return self::classify_typeShow($this->classify_type);
    }

    /** 
     * 显示优惠类型<br/>
     * 1:商品直接打折-pdiscount<br/>
     * 2:满金额送优惠券-ocoupons<br/>
     * 3:满金额打折-odiscount<br/>
     * 4:满金额立减-oreduce<br/>
     * 5:现金抵扣-deduction<br/>
     */
    public function getPreferential_typeShow()
    {
        return self::preferential_typeShow($this->preferential_type);
    }

    /** 
     * 显示规则分类<br/>
     * 1:优惠券-coupon<br/>
     * 2:促销活动-promotion<br/>
     */
    public static function classify_typeShow($classify_type)
    {
        return EnumClassifyType::classify_typeShow($classify_type);
    }

    /** 
     * 显示优惠类型<br/>
     * 1:商品直接打折-pdiscount<br/>
     * 2:满金额送优惠券-ocoupons<br/>
     * 3:满金额打折-odiscount<br/>
     * 4:满金额立减-oreduce<br/>
     * 5:现金抵扣-deduction<br/>
     */
    public static function preferential_typeShow($preferential_type)
    {
        return EnumPreferentialType::preferential_typeShow($preferential_type);
    }

}
?>