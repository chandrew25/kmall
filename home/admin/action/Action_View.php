<?php
/**
 * 控制器:查看页面
 * @author ufs
 */
class Action_View extends ActionExt
{ 
	/**
	 * 控制器:系统管理人员
	 */
	 public function admin()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->loadExtJs('view/admin.js');
	 }

}
?>

