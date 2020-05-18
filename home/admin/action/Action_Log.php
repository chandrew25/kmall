<?php
/**
 * 控制器:日志管理
 *
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Log extends ActionExt
{
	 /**
	  * 控制器:产品出入库日志
	  */
	 public function goodslog()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('log/goodslog.js');
	 }

	 /**
	  * 控制器:收发货记录
	  */
	 public function deliverylog()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('log/deliverylog.js');
		 $this->load_onlineditor('intro');
	 }

	 /**
	  * 控制器:订单日志
	  */
	 public function orderlog()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('log/orderlog.js');

     $this->online_editor = EnumOnlineEditorType::CKEDITOR;
		 $this->load_onlineditor('intro');
	 }

	 /**
	  * 控制器:收退款记录
	  */
	 public function paylog()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('log/paylog.js');
      $this->online_editor = EnumOnlineEditorType::CKEDITOR;
		 $this->load_onlineditor('intro');
	 }

	 /**
	  * 控制器:合同日志
	  */
	 public function contractlog()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('log/contractlog.js');
		 $this->load_onlineditor('intro');
	 }

     /**
      * 控制器:会员积分日志
      */
     public function jifenlog()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('log/jifenlog.js');
     }

     /**
      * 控制器:会员等级积分日志
      */
     public function rankjifenlog()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('log/rankjifenlog.js');
     }

}
?>
