<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:收退款行为  <br/>
 *---------------------------------------<br/>
 * @category kmall
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumPayAction extends Enum
{
	/**
	 * 收退款行为:未收款
	 */
	const UNPAY='0';
	/**
	 * 收退款行为:已收款
	 */
	const PAID='1';
	/**
	 * 收退款行为:已退款
	 */
	const RETURNS='2';

	/**
	 * 显示收退款行为<br/>
	 * 0:未收款-unpay<br/>
	 * 1:已收款-paid<br/>
	 * 2:已退款-return<br/>
	 * <br/>
	 */
	public static function payActionShow($payAction)
	{
	   switch($payAction){
			case self::UNPAY:
				return "未收款";
			case self::PAID:
				return "已收款";
			case self::RETURNS:
				return "已退款";
	   }
	   return "未知";
	}

	/**
	 * 根据收退款行为显示文字获取收退款行为<br/>
	 * @param mixed $payActionShow 收退款行为显示文字
	 */
	public static function payActionByShow($payActionShow)
	{
	   switch($payActionShow){
			case "未收款":
				return self::UNPAY;
			case "已收款":
				return self::PAID;
			case "已退款":
				return self::RETURNS;
	   }
	   return self::UNPAY;
	}

}
?>
