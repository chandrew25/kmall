<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:发送状态  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumDeliveryStatus extends Enum
{
	/**
	 * 发送状态:准备发送
	 */
	const READY='ready';
	/**
	 * 发送状态:发送中
	 */
	const PROGRESS='progress';
	/**
	 * 发送状态:退货
	 */
	const RETURNS='return';
	/**
	 * 发送状态:发送成功
	 */
	const SUCC='succ';
	/**
	 * 发送状态:发送失败
	 */
	const FAILED='failed';
	/**
	 * 发送状态:取消发送
	 */
	const CANCEL='cancel';
	/**
	 * 发送状态:丢失
	 */
	const LOST='lost';
	/**
	 * 发送状态:发送超时
	 */
	const TIMEOUT='timeout';

	/** 
	 * 显示发送状态<br/>
	 * ready:准备发送<br/>
	 * progress:发送中<br/>
	 * return:退货<br/>
	 * succ:发送成功<br/>
	 * failed:发送失败<br/>
	 * cancel:取消发送<br/>
	 * lost:丢失<br/>
	 * timeout:发送超时<br/>
	 */
	public static function statusShow($status)
	{
	   switch($status){ 
			case self::READY:
				return "准备发送"; 
			case self::PROGRESS:
				return "发送中"; 
			case self::RETURNS:
				return "退货"; 
			case self::SUCC:
				return "发送成功"; 
			case self::FAILED:
				return "发送失败"; 
			case self::CANCEL:
				return "取消发送"; 
			case self::LOST:
				return "丢失"; 
			case self::TIMEOUT:
				return "发送超时"; 
	   }
	   return "未知";
	}

	/** 
	 * 根据发送状态显示文字获取发送状态<br/>
	 * @param mixed $statusShow 发送状态显示文字
	 */
	public static function statusByShow($statusShow)
	{
	   switch($statusShow){ 
			case "准备发送":
				return self::READY; 
			case "发送中":
				return self::PROGRESS; 
			case "退货":
				return self::RETURNS; 
			case "发送成功":
				return self::SUCC; 
			case "发送失败":
				return self::FAILED; 
			case "取消发送":
				return self::CANCEL; 
			case "丢失":
				return self::LOST; 
			case "发送超时":
				return self::TIMEOUT; 
	   }
	   return self::READY;
	}

}
?>
