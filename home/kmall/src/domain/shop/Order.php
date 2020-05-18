<?php
/**
 +---------------------------------------<br/>
 * 订单<br/>
 * 菲彼生活用户的订单<br/>
 +---------------------------------------
 * @category kmall
 * @package shop
 * @author skygreen skygreen2001@gmail.com
 */
class Order extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $order_id;
    /**
     * 订单号<br/>
     *
     * @var string
     * @access public
     */
    public $order_no;
    /**
     * 发票标识
     * @var int
     * @access public
     */
    public $invoice_id;
    /**
     * 会员标识
     * @var string
     * @access public
     */
    public $member_id;
    /**
     * 会员号
     * @var string
     * @access public
     */
    public $member_no;
    /**
     * 订单类型<br/>
     * 0:电话订单-phone<br/>
     * 1:网上订单-web
     * @var enum
     * @access public
     */
    public $order_type;
    /**
     * 订单状态<br/>
     * audit:待审核<br/>
     * active:有效<br/>
     * confirm:待确认<br/>
     * finish:完成<br/>
     * dead:无效
     * @var enum
     * @access public
     */
    public $status;
    /**
     * 支付状态<br/>
     * 0:准备支付-ready<br/>
     * 1:支付成功-succ<br/>
     * 2:支付中-progress<br/>
     * 3:支付失败-failed<br/>
     * 4:取消支付-cancel<br/>
     * 5:退款-returneds<br/>
     * 6:支付错误-error<br/>
     * 7:非法支付-invalid<br/>
     * 8:支付超时-timeout<br/>
     * 9:部分退款-returnedpart
     * @var enum
     * @access public
     */
    public $pay_status;
    /**
     * 物流状态<br/>
     * 0:未发货-undispatch<br/>
     * 1:已发货-dispatch<br/>
     * 2:部分发货-dispatchpart<br/>
     * 3:部分退货-returnedpart<br/>
     * 4:已退货-returned<br/>
     * 5:已签收-signed<br/>
  	 * 6:商品出库-outbound<br/>
  	 * 7:申请退货-apply
     * @var enum
     * @access public
     */
    public $ship_status;
    /**
     * 订单总额
     * @var float
     * @access public
     */
    public $total_amount;
    /**
     * 成交总价格
     * @var float
     * @access public
     */
    public $final_amount;
    /**
     * 商品总价格
     * @var float
     * @access public
     */
    public $cost_item;
    /**
     * 其他费用.<br/>
     * 如货运费，税费，保价等。
     * @var float
     * @access public
     */
    public $cost_other;
    /**
     * 积分
     */
    public $jifen;
    /**
     * 促销优惠总金额
     * @var float
     * @access public
     */
    public $pmt_amount;
    /**
     * 支付方式标识
     * @var string
     * @access public
     */
    public $pay_type;
    /**
     * 国家<br/>
     * 参考region表的region_id字段
     * @var int
     * @access public
     */
    public $country;
    /**
     * 省<br/>
     * 参考region表的region_id字段
     * @var int
     * @access public
     */
    public $province;
    /**
     * 市<br/>
     * 参考region表的region_id字段
     * @var int
     * @access public
     */
    public $city;
    /**
     * 区<br/>
     * 参考region表的region_id字段
     * @var int
     * @access public
     */
    public $district;
    /**
     * 收货地址
     * @var string
     * @access public
     */
    public $ship_addr;
    /**
     * 收货人
     * @var string
     * @access public
     */
    public $ship_name;
    /**
     * 收货电话
     * @var string
     * @access public
     */
    public $ship_tel;
    /**
     * 收货手机
     * @var string
     * @access public
     */
    public $ship_mobile;
    /**
     * 送货时间<br/>
     * 如:<br/>
     *      任何日期任何时间段<br/>
     *      仅工作日上午<br/>
     *      仅工作日下午<br/>
     *      仅休息日下午<br/>
     *      2011-05-01 下午
     * @var string
     * @access public
     */
    public $ship_time;
    /**
     * 配送方式标识<br/>
     *
     * @var string
     * @access public
     */
    public $ship_type;
    /**
     * 标志建筑
     * @var string
     * @access public
     */
    public $ship_sign_building;
    /**
     * 最佳路径
     * @var string
     * @access public
     */
    public $best_path;
    /**
     * 邮编
     * @var string
     * @access public
     */
    public $ship_zipcode;
    /**
     * 订单附言
     * @var string
     * @access public
     */
    public $intro;
    /**
     * 客户备注
     * @var string
     * @access public
     */
    public $remark;
    /**
     * 订购时间
     * @var int
     * @access public
     */
    public $ordertime;
    //</editor-fold>
    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "member"=>"Member",
        "paymenttype"=>"Paymenttype",
        "deliverytype"=>"Deliverytype",
    );

    //设定表与数据的关系
    public $field_spec=array(
        EnumDataSpec::FOREIGN_ID=>array(
            "Paymenttype"=>"pay_type",
            "Deliverytype"=>"ship_type",
        ),
        EnumDataSpec::MANY_MANY_TABLE=>array(
            "Goods"=>"ji_shop_order_re_ordergoods"
        )
    );

    /**
     * 一对一关系
     */
    static $has_one=array(
        "delivery"=>"Delivery",
        "invoice"=>"Invoice"
    );

    /**
     * 一对多关系
     */
    static $has_many=array(
        "deliverylog"=>"Deliverylog",
        "orderlog"=>"Orderlog",
        "paylog"=>"Paylog",
        "coupon"=>"Coupon",
        "consult"=>"Consult",
        "ordergoods"=>"Ordergoods",
        "workfloworder"=>"Workfloworder",
        "payments"=>"Payments"
    );

    /**
     * 显示订单类型<br/>
     * 0:电话订单-phone<br/>
     * 1:网上订单-web<br/>
     */
    public function getOrder_typeShow()
    {
        return self::order_typeShow($this->order_type);
    }

    /**
     * 显示订单状态<br/>
     * autid:待审核<br/>
     * active:有效<br/>
     * confirm:待确认<br/>
     * finish:完成<br/>
     * dead:无效<br/>
     */
    public function getStatusShow()
    {
        return self::statusShow($this->status);
    }

    /**
     * 显示支付状态<br/>
     * 0:准备支付-ready<br/>
     * 1:支付成功-succ<br/>
     * 2:支付中-progress<br/>
     * 3:支付失败-failed<br/>
     * 4:取消支付-cancel<br/>
     * 5:退款-returneds<br/>
     * 6:支付错误-error<br/>
     * 7:非法支付-invalid<br/>
     * 8:支付超时-timeout<br/>
     * 9:部分退款-returnedpart<br/>
     */
    public function getPay_statusShow()
    {
        return self::pay_statusShow($this->pay_status);
    }

    /**
     * 显示物流状态<br/>
     * 0:未发货-undispatch<br/>
     * 1:已发货-dispatch<br/>
     * 2:部分发货-dispatchpart<br/>
     * 3:部分退货-returnedpart<br/>
     * 4:已退货-returned<br/>
     * 5:已签收-signed<br/>
     */
    public function getShip_statusShow()
    {
        return self::ship_statusShow($this->ship_status);
    }

    /**
     * 显示订单类型<br/>
     * 0:电话订单-phone<br/>
     * 1:网上订单-web<br/>
     */
    public static function order_typeShow($order_type)
    {
        return EnumOrderType::order_typeShow($order_type);
    }

    /**
     * 显示订单状态<br/>
     * audit:待审核<br/>
     * active:有效<br/>
     * confirm:待确认<br/>
     * finish:完成<br/>
     * dead:无效<br/>
     */
    public static function statusShow($status)
    {
        return EnumOrderStatus::statusShow($status);
    }

    /**
     * 显示支付状态<br/>
     * 0:准备支付-ready<br/>
     * 1:支付成功-succ<br/>
     * 2:支付中-progress<br/>
     * 3:支付失败-failed<br/>
     * 4:取消支付-cancel<br/>
     * 5:退款-returneds<br/>
     * 6:支付错误-error<br/>
     * 7:非法支付-invalid<br/>
     * 8:支付超时-timeout<br/>
     * 9:部分退款-returnedpart<br/>
     */
    public static function pay_statusShow($pay_status)
    {
        return EnumPayStatus::pay_statusShow($pay_status);
    }

    /**
     * 显示物流状态<br/>
     * 0:未发货-undispatch<br/>
     * 1:已发货-dispatch<br/>
     * 2:部分发货-dispatchpart<br/>
     * 3:部分退货-returnedpart<br/>
     * 4:已退货-returned<br/>
     * 5:已签收-signed<br/>
  	 * 6:商品出库-outbound<br/>
  	 * 7:申请退货-apply
     */
    public static function ship_statusShow($ship_status)
    {
        return EnumShipStatus::ship_statusShow($ship_status);
    }

    public function getOrderGoods(){
        $result = array();
        if ($this->order_id) {
            $result = Ordergoods::get("order_id=".$this->order_id);
        }
        return $result;
    }

    public function getPayQrcode(){
        $result = array();
        if ($this->order_id) {
            $result = Orderqrcode::get_one("order_id=".$this->order_id);
        }
        return $result;
    }
}
?>
