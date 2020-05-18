<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:运送商品<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceDeliveryitem extends ServiceBasic
{
	/**
	 * 保存数据对象:运送商品
	 * @param array|DataObject $deliveryitem
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($deliveryitem)
	{
		if (is_array($deliveryitem)){
			$deliveryitemObj=new Deliveryitem($deliveryitem);
		}
		if ($deliveryitemObj instanceof Deliveryitem){
			$data=$deliveryitemObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :运送商品
	 * @param array|DataObject $deliveryitem
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($deliveryitem)
	{
		if (!EnumItemType::isEnumValue($deliveryitem["item_type"])){
			$deliveryitem["item_type"]=EnumItemType::item_typeByShow($deliveryitem["item_type"]);
		}
		if (is_array($deliveryitem)){
			$deliveryitemObj=new Deliveryitem($deliveryitem);
		}
		if ($deliveryitemObj instanceof Deliveryitem){
			$data=$deliveryitemObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:运送商品的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Deliveryitem::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:运送商品分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:运送商品分页查询列表
	 */
	public function queryPageDeliveryitem($formPacket=null)
	{
		$start=1;
		$limit=10;
		$condition=UtilObject::object_to_array($formPacket);
		if (isset($condition['start'])){
			$start=$condition['start']+1;
		  }
		if (isset($condition['limit'])){
			$limit=$condition['limit'];
			$limit=$start+$limit-1;
		}
		unset($condition['start'],$condition['limit']);
		$condition=$this->filtertoCondition($condition);
		$count=Deliveryitem::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Deliveryitem::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Deliveryitem::propertyShow($data,array('item_type'));
			}
			foreach ($data as $deliveryitem) {
				$delivery=Delivery::get_by_id($deliveryitem->delivery_id);
				$deliveryitem['delivery_no']=$delivery->delivery_no;
			}
			foreach ($data as $deliveryitem) {
				$product=Product::get_by_id($deliveryitem->product_id);
				$deliveryitem['product_name']=$product->product_name;
			}
			if ($data==null)$data=array();
		}else{
			$data=array();
		}
		return array(
			'success' => true,
			'totalCount'=>$count,
			'data'    => $data
		);
	}

	/**
	 * 批量上传运送商品
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."deliveryitem" . DS . "import" . DS . "deliveryitem$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Deliveryitem::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $deliveryitem) {
						$deliveryitem=new Deliveryitem($deliveryitem);
						if (!EnumItemType::isEnumValue($deliveryitem["item_type"])){
							$deliveryitem["item_type"]=EnumItemType::item_typeByShow($deliveryitem["item_type"]);
						}
						$deliveryitem_id=$deliveryitem->getId();
						if (!empty($deliveryitem_id)){
							$hadDeliveryitem=Deliveryitem::get_by_id($deliveryitem->getId());
							if ($hadDeliveryitem!=null){
								$result=$deliveryitem->update();
							}else{
								$result=$deliveryitem->save();
							}
						}else{
							$result=$deliveryitem->save();
						}
					}
				}else{
					$result=false;
				}
			}else{
				return $result;
			}
		}
		return array(
			'success' => true,
			'data'    => $result
		);
	}

	/**
	 * 导出运送商品
	 * @param mixed $filter
	 */
	public function exportDeliveryitem($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Deliveryitem::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Deliveryitem::propertyShow($data,array('item_type'));
		}
		$arr_output_header= self::fieldsMean(Deliveryitem::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."deliveryitem" . DS . "export" . DS . "deliveryitem$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."deliveryitem/export/deliveryitem$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
