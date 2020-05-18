<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:快递类型  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumDeliveryType extends Enum
{
	/**
	 * 快递类型:返送
	 */
	const RETURNS='return';
	/**
	 * 快递类型:发送
	 */
	const DELIVERY='delivery';

	/** 
	 * 显示快递类型<br/>
	 * return:返送<br/>
	 * delivery:发送<br/>
	 */
	public static function typeShow($type)
	{
	   switch($type){ 
			case self::RETURNS:
				return "返送"; 
			case self::DELIVERY:
				return "发送"; 
	   }
	   return "未知";
	}

	/** 
	 * 根据快递类型显示文字获取快递类型<br/>
	 * @param mixed $typeShow 快递类型显示文字
	 */
	public static function typeByShow($typeShow)
	{
	   switch($typeShow){ 
			case "返送":
				return self::RETURNS; 
			case "发送":
				return self::DELIVERY; 
	   }
	   return self::RETURNS;
	}

}
?>
