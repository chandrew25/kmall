<?php
/**
 * 控制器:首页
 * @author ufs
 */
class Action_Promanage extends ActionExt
{          
     /**
      * 控制器:优惠券表
      */
     public function coupon()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('promanage/coupon.js');
         $this->load_onlineditor('emailcontent');
     }
     
     /**
      * 控制器:促销活动表
      */
     public function promotion()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('promanage/promotion.js');
         $this->load_onlineditor('promdescribe');
     }
     
     /**
      * 控制器:优惠券实体表
      */
     public function couponitems()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('promanage/couponitems.js');
     }
}
?>
