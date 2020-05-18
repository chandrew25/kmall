<?php
/**
 +---------------------------------<br/>
 * 控制器:网站后台管理<br/>
 +---------------------------------
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen
 */
class Action_Kmall extends ActionExt
{
  /**
   * 控制器:货品表
   */
  public function goods()
  {
       $this->init();
       $this->ExtDirectMode();
       $this->ExtUpload();
       $this->loadExtJs('goods/goods.js');
   }

   /**
    * 控制器:广告
    */
   public function ads()
   {
   $this->init();
   $this->ExtDirectMode();
   $this->ExtUpload();
   $this->loadExtJs('core/ads.js');
   }

   /**
    * 控制器:商品显示
    */
   public function ptypeshow()
   {
   $this->init();
   $this->ExtDirectMode();
   $this->ExtUpload();
   $this->loadExtJs('core/ptypeshow.js');
   }

   /**
    * 控制器:商品分类所属栏目
    */
   public function ptcolumn()
   {
       $this->init();
       $this->ExtDirectMode();
       $this->ExtUpload();
       $this->loadExtJs('core/ptcolumn.js');
   }

     /**
      * 控制器:应用下载
      */
     public function appdown()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('core/appdown.js');
         $this->load_onlineditor(array('introduction','introduce','suitabletype'));
     }

     /**
      * 控制器:大宗采购
      */
     public function bulkpurchase()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('core/bulkpurchase.js');
         $this->load_onlineditor(array('requirement','suggestion'));
     }

     /**
      * 控制器:广告栏目
      */
     public function banner()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('core/banner.js');
     }


}
?>
