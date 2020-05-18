<?php
/**
 * 控制器:供应商管理
 *
 * @author ufs
 */
class Action_Supplier extends ActionExt
{        
	 /**
	  * 控制器:供应商
	  */
	 public function supplier()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('supplier/supplier.js');      
		 $this->load_onlineditor('memo');                 
	 }       
	 
	 /**
	  * 控制器:合同
	  */
	 public function contract()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('supplier/contract.js');                              
         $this->load_onlineditor(array('intro','goods_name','f_party','s_party','terms'));
	 }
	 
	 /**
	  * 控制器:合同文件
	  */
	 public function confiles()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('supplier/confiles.js');
		 $this->load_onlineditor('intro');
	 }
} 
?>
