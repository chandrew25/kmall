<?php
/**
 * 控制器:首页
 * @author ufs
 */
class Action_Voucher extends ActionExt
{          
     /**
      * 控制器:兑换券
      */
     public function voucher()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('voucher/voucher.js');
     }

     /**
      * 控制器:兑换券规则作用商品表
      */
     public function vouchergoods()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('vouchergoods/vouchergoods.js');
     }

     /**
      * 控制器:兑换券实体表
      */
     public function voucheritemslog()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('voucher/voucheritemslog.js');
     }
}
?>
