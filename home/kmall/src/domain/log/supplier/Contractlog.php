<?php
/**
 +---------------------------------------<br/>
 * 合同日志<br/>
 * 以下事件需要日志：新建合同·合同生效<br/>
 +---------------------------------------
 * @category yile
 * @package log.supplier
 * @author skygreen skygreen2001@gmail.com
 */
class Contractlog extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 合同日志编号
	 * @var int
	 * @access public
	 */
	public $contractlog_id;
	/**
	 * 订单编号
	 * @var int
	 * @access public
	 */
	public $contract_id;
	/**
	 * 合同金额
	 * @var float
	 * @access public
	 */
	public $money;
	/**
	 * 经办人标识
	 * @var string
	 * @access public
	 */
	public $admin_id;
	/**
	 * 经办人
	 * @var string
	 * @access public
	 */
	public $operater;
	/**
	 * 行为：<br/>
	 * 1.新建合同<br/>
	 * 2.合同生效<br/>
	 * 
	 * @var enum
	 * @access public
	 */
	public $actionType;
	/**
	 * 备注说明<br/>
	 * 1.创建合同<br/>
	 * 2.合同生效<br/>
	 * 3.合同终止
	 * @var string
	 * @access public
	 */
	public $intro;
	//</editor-fold>
	/**
	 * 规格说明
	 * 表中不存在的默认列定义:updateTime
	 * @var mixed
	 */
	public $field_spec=array(
		EnumDataSpec::REMOVE=>array(
			'updateTime'
		)
	);

	/**
	 * 从属一对一关系
	 */
	static $belong_has_one=array(
		"contract"=>"Contract"
	);

	/** 
	 * 显示行为：<br/>
	 * 1.新建合同<br/>
	 * 2.合同生效<br/>
	 * <br/>
	 */
	public function getActionTypeShow()
	{
		return self::actionTypeShow($this->actionType);
	}

	/** 
	 * 显示行为：<br/>
	 * 1.新建合同<br/>
	 * 2.合同生效<br/>
	 * <br/>
	 */
	public static function actionTypeShow($actionType)
	{
		return EnumActionType::actionTypeShow($actionType);
	}
}
?>