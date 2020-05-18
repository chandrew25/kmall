<?php
/**
 * 控制器:库存管理
 *
 * @author ufs
 */
class Action_Storage extends ActionExt
{

	/**
	 * 产品入库
	 */
	public function addGoods()
	{
		$this -> init();
		$this->ExtDirectMode();
		$this->ExtUpload();
		$this -> loadExtComponent("ComboBoxTree.js");
		$this->loadExtJs('storage/addGoods.js');
		$this->load_onlineditor('intro');
	}

	/**
	 * 产品出库
	 */
	public function outGoods()
	{
		$this -> init();
		$this->ExtDirectMode();
		$this->ExtUpload();
		$this -> loadExtComponent("ComboBoxTree.js");
		$this->loadExtJs('storage/outGoods.js');
	}

	 /**
	  * 控制器:仓库
	  */
	 public function warehouse()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();

		 $this->loadExtJs('storage/warehouse.js');
	 }

	 /**
	  * 控制器:产品
	  */
	 public function warehousegoods()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('storage/warehousegoods.js');
     $this->online_editor = EnumOnlineEditorType::CKEDITOR;
		 $this->load_onlineditor('intro');
	 }

	 /**
	  * 控制器:产品图片
	  */
	 public function gseriesimg()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('storage/gseriesimg.js');
	 }
}
?>
