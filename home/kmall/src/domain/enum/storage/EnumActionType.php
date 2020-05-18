<?php
/**
 *---------------------------------------<br/>
 * 枚举类型:行为：  <br/> 
 *---------------------------------------<br/>
 * @category yile
 * @package domain
 * @subpackage enum 
 * @author skygreen skygreen2001@gmail.com
 */
class EnumActionType extends Enum
{
	/**
	 * 行为：:新建合同
	 */
	const CREATE='0';
	/**
	 * 行为：:合同生效
	 */
	const EFFECT='1';
    /**
     * 行为：:合同终止
     */
    const END='2';

	/** 
	 * 显示行为：<br/>
	 * 1:新建合同-new<br/>
	 * 2:合同生效-effect<br/>
	 * <br/>
	 */
	public static function actionTypeShow($actionType)
	{
	   switch($actionType){ 
			case self::CREATE:
				return "新建合同"; 
			case self::EFFECT:
				return "合同生效"; 
            case self::END:
                return "合同终止"; 
	   }
	   return "未知";
	}

	/** 
	 * 根据行为：显示文字获取行为：<br/>
	 * @param mixed $actionTypeShow 行为：显示文字
	 */
	public static function actionTypeByShow($actionTypeShow)
	{
	   switch($actionTypeShow){ 
			case "新建合同":
				return self::CREATE; 
			case "合同生效":
				return self::EFFECT; 
            case "合同终止":
                return self::END; 
	   }
	   return self::CREATE;
	}

}
?>
