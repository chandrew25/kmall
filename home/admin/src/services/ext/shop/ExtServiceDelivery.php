<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:易乐物流<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceDelivery extends ServiceBasic
{
	/**
	 * 保存数据对象:易乐物流
	 * @param array|DataObject $delivery
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($delivery)
	{
		if (is_array($delivery)){
			$deliveryObj=new Delivery($delivery);
		}
		if ($deliveryObj instanceof Delivery){
			$data=$deliveryObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :易乐物流
	 * @param array|DataObject $delivery
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($delivery)
	{
		if (!$delivery["delivery_id"]){
			return $this->save($delivery);
		}
		if (!EnumDeliveryStatus::isEnumValue($delivery["status"])){
			$delivery["status"]=EnumDeliveryStatus::statusByShow($delivery["status"]);
		}
		if (!EnumDeliveryType::isEnumValue($delivery["type"])){
			$delivery["type"]=EnumDeliveryType::typeByShow($delivery["type"]);
		}

		if (is_array($delivery)){
			$deliveryObj=new Delivery($delivery);
		}
		if ($deliveryObj instanceof Delivery){
			$data=$deliveryObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:易乐物流的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Delivery::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 获取快递信息
	 */
	public function getDelivery($order_id)
	{
		$delivery=Delivery::get_one("order_id=".$order_id);
		return array(
			'success' => true,
			'data'    => $delivery
		);
	}

	/**
	 * 数据对象:易乐物流分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:易乐物流分页查询列表
	 */
	public function queryPageDelivery($formPacket=null)
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
		$count=Delivery::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Delivery::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Delivery::propertyShow($data,array('status','type'));
			}
			foreach ($data as $delivery) {
				$order=Order::get_by_id($delivery->order_id);
				$delivery['order_no']=$order->order_no;
				$member=Member::get_by_id($delivery->member_id);
				$delivery['username']=$member->username;
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
	 * 批量上传易乐物流
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."delivery" . DS . "import" . DS . "delivery$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Delivery::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $delivery) {
						$delivery=new Delivery($delivery);
						if (!EnumDeliveryStatus::isEnumValue($delivery["status"])){
							$delivery["status"]=EnumDeliveryStatus::statusByShow($delivery["status"]);
						}
						if (!EnumDeliveryType::isEnumValue($delivery["type"])){
							$delivery["type"]=EnumDeliveryType::typeByShow($delivery["type"]);
						}
						$delivery_id=$delivery->getId();
						if (!empty($delivery_id)){
							$hadDelivery=Delivery::get_by_id($delivery->getId());
							if ($hadDelivery!=null){
								$result=$delivery->update();
							}else{
								$result=$delivery->save();
							}
						}else{
							$result=$delivery->save();
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
	 * 导出易乐物流
	 * @param mixed $filter
	 */
	public function exportDelivery($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Delivery::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Delivery::propertyShow($data,array('status','type'));
		}
		$arr_output_header= self::fieldsMean(Delivery::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."delivery" . DS . "export" . DS . "delivery$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."delivery/export/delivery$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
