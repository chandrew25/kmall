<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:显示信息类型  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumViewInfoType extends Enum
{
    /**
     * 显示信息类型:购物车添加商品
     */
    const CARTADDPRODUCT=1;
    /**
     * 显示信息类型:结算中心
     */
    const CHECKOUTNOPRODUCT=2;
    /**
     * 显示信息类型:结算结束开始支付
     */
    const CHECKOUTOVER=3;
    /**
     * 显示信息类型:支付结束
     */
    const PAYOVER=4;
}
?>
