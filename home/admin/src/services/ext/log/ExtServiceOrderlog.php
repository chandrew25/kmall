<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:订单日志<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceOrderlog extends ServiceBasic
{
	/**
	 * 保存数据对象:订单日志
	 * @param array|DataObject $orderlog
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($orderlog)
	{
		if (is_array($orderlog)){
			$orderlogObj=new Orderlog($orderlog);
		}
		if ($orderlogObj instanceof Orderlog){
			$orderlogObj->admin_id=HttpSession::get("admin_id");
			$data=$orderlogObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :订单日志
	 * @param array|DataObject $orderlog
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($orderlog)
	{
		if (!EnumOrderAction::isEnumValue($orderlog["orderAction"])){
			$orderlog["orderAction"]=EnumOrderAction::orderActionByShow($orderlog["orderAction"]);
		}
		if (!EnumResult::isEnumValue($orderlog["result"])){
			$orderlog["result"]=EnumResult::resultByShow($orderlog["result"]);
		}
		if (is_array($orderlog)){
			$orderlogObj=new Orderlog($orderlog);
		}
		if ($orderlogObj instanceof Orderlog){
			$data=$orderlogObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 根据主键删除数据对象:订单日志的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4 
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Orderlog::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 数据对象:订单日志分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:订单日志分页查询列表
	 */
	public function queryPageOrderlog($formPacket=null)
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
		$count=Orderlog::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Orderlog::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Orderlog::propertyShow($data,array('orderAction','result'));
			}
			foreach ($data as $orderlog) {      
				$order=Order::get_by_id($orderlog->order_id);
				$orderlog['order_no']=$order->order_no;
				$orderlog['commitTime']=UtilDateTime::timestampToDateTime($orderlog->commitTime); 
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
	 * 批量上传订单日志
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."orderlog\\import\\orderlog$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Orderlog::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $orderlog) {
						$orderlog=new Orderlog($orderlog);
						if (!EnumOrderAction::isEnumValue($orderlog["orderAction"])){
							$orderlog["orderAction"]=EnumOrderAction::orderActionByShow($orderlog["orderAction"]);
						}
						if (!EnumResult::isEnumValue($orderlog["result"])){
							$orderlog["result"]=EnumResult::resultByShow($orderlog["result"]);
						}
						$orderlog_id=$orderlog->getId();
						if (!empty($orderlog_id)){
							$hadOrderlog=Orderlog::get_by_id($orderlog->getId());
							if ($hadOrderlog!=null){
								$result=$orderlog->update();
							}else{
								$result=$orderlog->save();
							}
						}else{
							$result=$orderlog->save();
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
	 * 导出订单日志
	 * @param mixed $filter
	 */
	public function exportOrderlog($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Orderlog::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Orderlog::propertyShow($data,array('orderAction','result'));
		}
		$arr_output_header= self::fieldsMean(Orderlog::tablename()); 
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."orderlog\\export\\orderlog$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName)); 
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
		$downloadPath  =Gc::$attachment_url."orderlog/export/orderlog$diffpart.xls"; 
		return array(
			'success' => true,
			'data'    => $downloadPath
		); 
	}
}
?>
