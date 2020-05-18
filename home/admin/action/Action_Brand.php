<?php
/**
 * 控制器:品牌管理     
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Brand extends ActionExt
{        
     /**
      * 控制器:品牌
      */
     public function brand()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('brand/brand.js');
         $this->view->editorHtml=UtilCKEeditor::loadReplace("brand_desc");
     }
     
     /**
      * 控制器:品牌推荐商品
      */
     public function bproduct()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('brand/bproduct.js');
     }        
      
     /**
      * 控制器:品牌商品分类关系
      */
     public function brandptype()
     {
        $this->init();
        $this->ExtDirectMode();
        $this->ExtUpload();
        $this->loadExtJs('brand/brandptype.js');
     }           
    
} 
?>
