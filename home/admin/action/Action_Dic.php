<?php
/**
 * 控制器:首页
 * @author ufs
 */
class Action_Dic extends ActionExt
{

  /**
   * 控制器:国家
   */
  public function country()
  {
      $this->init();
      $this->ExtDirectMode();
      $this->ExtUpload();
      $this->loadExtJs('dic/country.js');
      $this->load_onlineditor(array('specification','intro','introduction'));
  }
	 /**
	  * 控制器:量词
	  */
	 public function quantifier()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('dic/quantifier.js');
	 }

	 /**
	  * 控制器:配送方式
	  */
	 public function deliverytype()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('dic/deliverytype.js');
	 }

	 /**
	  * 控制器:支付方式
	  */
	 public function paymenttype()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('dic/paymenttype.js');
     $this->online_editor = EnumOnlineEditorType::CKEDITOR;
		 $this->load_onlineditor('description');
     // $this->view->editorHtml=UtilCKEeditor::loadReplace("description");
	 }

	 /**
	  * 控制器:商品类型
	  */
	 public function ptype()
	 {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('dic/ptype.js');
	 }

	 /**
	  * 控制器:地区
	  */
	 public function region()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('dic/region.js');
	 }

	 /**
      * 控制器:部门
      */
     public function department()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('dic/department.js');
     }

     /**
      * 控制器:开票方
      */
     public function drawer()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('dic/drawer.js');
     }

     /**
      * 控制器:登录类型
      */
     public function logintype()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('dic/logintype.js');
     }

     /**
      * 控制器:全局配置
      */
     public function globalset()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('dic/globalset.js');
     }

}
?>
