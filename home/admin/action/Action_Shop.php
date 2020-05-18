<?php
/**
 * 控制器:购物管理
 *
 * @author ufs
 */
class Action_Shop extends ActionExt
{
	/**
	  * 控制器:淘宝订单
	  */
	 public function taobaoorder()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/taobaoorder.js');
	 }
	 /**
	  * 控制器:易迅订单
	  */
	 public function yixunorder()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/yixunorder.js');
	 }
	 /**
	  * 控制器:京东订单
	  */
	 public function jingdongorder()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/jingdongorder.js');
	 }

	 /**
	  * 控制器:添加订单
	  */
	 public function addorder()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->loadExtJs("shared/grid/roweditor.js",true);
         $this->loadExtComponentCss("RowEditor.css",true);
		 $this->loadExtJs('shop/addorder.js');
	 }

	 /**
	  * 控制器:退换货
	  */
	 public function returnd()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/returnd.js');
		 $this->load_onlineditor(array('intro','introWindow','memo','comments','reply'));
	 }

	 /**
	  * 控制器:订单
	  */
	 public function order()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/order.js');
		 $this->load_onlineditor(array('intro','introWindow','memo','comments','reply'));
	 }

	 /**
	  * 控制器:易乐物流
	  */
	 public function delivery()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/delivery.js');
	 }

	 /**
	  * 控制器:运送商品
	  */
	 public function deliveryitem()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/deliveryitem.js');
	 }

	 /**
	  * 控制器:订购商品
	  */
	 public function orderproducts()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/orderproducts.js');
		 $this->load_onlineditor('url');
	 }

	 /**
	  * 控制器:支付
	  */
	 public function payments()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/payments.js');
		 $this->load_onlineditor('intro');
	 }

	 /**
	  * 控制器:订单发票
	  */
	 public function invoice()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/invoice.js');
     $this->online_editor = EnumOnlineEditorType::CKEDITOR;
		 $this->load_onlineditor(array('content','memo'));
	 }

	 /**
	  * 控制器:退款评论
	  */
	 public function refundcomment()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/refundcomment.js');
	 }

	 /**
	  * 控制器:退款商品
	  */
	 public function refundproducts()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('shop/refundproducts.js');
	 }
}
?>
