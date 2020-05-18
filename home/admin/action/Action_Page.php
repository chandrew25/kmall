<?php
/**
 * 控制器:页面设置
 * @author ufs
 */
class Action_Page extends ActionExt
{
	 /**
	  * 首页设置
	  */
	 public function indexpage()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('page/indexpage.js');
	 }
}
?>