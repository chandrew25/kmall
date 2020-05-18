<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:收发货行为  <br/>
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum
 * @author skygreen skygreen2001@gmail.com
 */
class EnumDeliveryAction extends Enum
{
	/**
	 * 收发货行为:发货
	 */
	const SEND='1';
	/**
	 * 收发货行为:收货
	 */
	const TAKE='2';
	/**
	 * 收发货行为:退货
	 */
	const RETURNS='3';

	/**
	 * 显示收发货行为<br/>
	 * 1:发货-send<br/>
	 * 2:收货-take<br/>
	 * 3:退货-return<br/>
	 * <br/>
	 */
	public static function deliveryActionShow($deliveryAction)
	{
	   switch($deliveryAction){
			case self::SEND:
				return "发货";
			case self::TAKE:
				return "收货";
			case self::RETURNS:
				return "退货";
	   }
	   return "未知";
	}

	/**
	 * 根据收发货行为显示文字获取收发货行为<br/>
	 * @param mixed $deliveryActionShow 收发货行为显示文字
	 */
	public static function deliveryActionByShow($deliveryActionShow)
	{
	   switch($deliveryActionShow){
			case "发货":
				return self::SEND;
			case "收货":
				return self::TAKE;
			case "退货":
				return self::RETURNS;
	   }
	   return self::SEND;
	}

}
?>
