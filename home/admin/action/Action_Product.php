<?php
/**
 * 控制器:商品管理
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Product extends ActionExt
{
	/**
      * 控制器:货品表
      */
     public function goods()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('product/goods.js');
     }
     /**
      * 控制器:已上架商品
      */
     public function product()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('product/product.js');
         $this->load_onlineditor(array('specification','intro'));
     }

     /**
      * 控制器:已下架商品
      */
     public function productydown()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('product/productydown.js');

         $this->online_editor = EnumOnlineEditorType::CKEDITOR;
         $this->load_onlineditor(array('specification','intro'));
     }

     /**
      * 控制器:未上架商品
      */
     public function productnup()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('product/productnup.js');
         $this->load_onlineditor(array('specification','intro'));
     }

     /**
      * 控制器:商品图片
      */
     public function seriesimg()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('product/seriesimg.js');
     }

     /**
      * 控制器:属性表
      */
     public function attribute()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('product/attribute.js');
     }

     /**
      * 控制器:分类属性
      */
     public function ptypeattr()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('product/ptypeattr.js');
     }

     /**
      * 控制器:分类属性
      */
     public function addproduct()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtComponentCss("RowEditor.css",true);
         $this->loadExtJs("shared/grid/roweditor.js",true);
         $this->loadExtJs("shared/DataView-more.js",true);
         $this->loadExtJs('shared/upload/swfupload.js',true);
         $this->loadExtJs('shared/upload/fileprogress.js',true);
         $this->loadExtJs('shared/upload/handlers.js',true);
         $this->loadExtJs('shared/upload/swfupload.queue.js',true);
         $this->loadExtJs('product/addproduct.js');
         $this->load_onlineditor(array('specification','intro'));
         HttpCookie::set('URLPATH',Gc::$url_base."home/admin/src/httpdata/MultiUpload.php");
     }

     /**
      * 控制器:秒杀商品
      */
     public function seckill()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('product/seckill.js');
     }
}
?>
