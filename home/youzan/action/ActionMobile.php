<?php
/**
 +----------------------------------------------<br/>
 * 所有采用BootStrap框架的控制器的父类<br/>
 +----------------------------------------------
 * @category kmall
 * @package core.model
 * @author FXF
 */
class ActionMobile extends ActionBasic
{
	/**
	 * 在Action所有的方法执行之前可以执行的方法
	 */
	public function beforeAction()
	{
		parent::beforeAction();
	}

	/**
	 * 在Action所有的方法执行之后可以执行的方法
	 */
	public function afterAction()
	{
		parent::afterAction();
	}
}
?>