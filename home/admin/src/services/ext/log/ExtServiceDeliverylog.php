<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:收发货记录<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceDeliverylog extends ServiceBasic
{
	/**
	 * 保存数据对象:收发货记录
	 * @param array|DataObject $deliverylog
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($deliverylog)
	{
		if (is_array($deliverylog)){
			$deliverylogObj=new Deliverylog($deliverylog);
		}
		if ($deliverylogObj instanceof Deliverylog){
			$deliverylogObj->admin_id=HttpSession::get("admin_id");
			$data=$deliverylogObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :收发货记录
	 * @param array|DataObject $deliverylog
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($deliverylog)
	{
		if (!EnumDeliveryAction::isEnumValue($deliverylog["deliveryAction"])){
			$deliverylog["deliveryAction"]=EnumDeliveryAction::deliveryActionByShow($deliverylog["deliveryAction"]);
		}
		if (!EnumResult::isEnumValue($deliverylog["result"])){
			$deliverylog["result"]=EnumResult::resultByShow($deliverylog["result"]);
		}
		if (is_array($deliverylog)){
			$deliverylogObj=new Deliverylog($deliverylog);
		}
		if ($deliverylogObj instanceof Deliverylog){
			$data=$deliverylogObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 根据主键删除数据对象:收发货记录的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4 
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Deliverylog::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 数据对象:收发货记录分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:收发货记录分页查询列表
	 */
	public function queryPageDeliverylog($formPacket=null)
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
		$count=Deliverylog::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Deliverylog::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Deliverylog::propertyShow($data,array('deliveryAction','result'));
			}
			foreach ($data as $deliverylog) {   
				$order=Order::get_by_id($deliverylog->order_id);
				$deliverylog['order_no']=$order->order_no;
				$deliverylog['realname']=$order->ship_name;
				$deliverylog['commitTime']=UtilDateTime::timestampToDateTime($deliverylog->commitTime); 
                $deliverylog['result']=$deliverylog->getResultShow();
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
	 * 批量上传收发货记录
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."deliverylog\\import\\deliverylog$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Deliverylog::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $deliverylog) {
						$deliverylog=new Deliverylog($deliverylog);
						if (!EnumDeliveryAction::isEnumValue($deliverylog["deliveryAction"])){
							$deliverylog["deliveryAction"]=EnumDeliveryAction::deliveryActionByShow($deliverylog["deliveryAction"]);
						}
						if (!EnumResult::isEnumValue($deliverylog["result"])){
							$deliverylog["result"]=EnumResult::resultByShow($deliverylog["result"]);
						}
						$deliverylog_id=$deliverylog->getId();
						if (!empty($deliverylog_id)){
							$hadDeliverylog=Deliverylog::get_by_id($deliverylog->getId());
							if ($hadDeliverylog!=null){
								$result=$deliverylog->update();
							}else{
								$result=$deliverylog->save();
							}
						}else{
							$result=$deliverylog->save();
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
	 * 导出收发货记录
	 * @param mixed $filter
	 */
	public function exportDeliverylog($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Deliverylog::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Deliverylog::propertyShow($data,array('deliveryAction','result'));
		}
		$arr_output_header= self::fieldsMean(Deliverylog::tablename()); 
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."deliverylog\\export\\deliverylog$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName)); 
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
		$downloadPath  =Gc::$attachment_url."deliverylog/export/deliverylog$diffpart.xls"; 
		return array(
			'success' => true,
			'data'    => $downloadPath
		); 
	}
}
?>