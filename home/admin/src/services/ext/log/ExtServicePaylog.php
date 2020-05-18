<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:收退款记录<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePaylog extends ServiceBasic
{
	/**
	 * 保存数据对象:收退款记录
	 * @param array|DataObject $paylog
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($paylog)
	{
		if (is_array($paylog)){
			$paylogObj=new Paylog($paylog);
		}
		if ($paylogObj instanceof Paylog){
			$paylogObj->admin_id=HttpSession::get("admin_id");
			$data=$paylogObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :收退款记录
	 * @param array|DataObject $paylog
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($paylog)
	{
		if (!EnumPayAction::isEnumValue($paylog["payAction"])){
			$paylog["payAction"]=EnumPayAction::payActionByShow($paylog["payAction"]);
		}
		if (!EnumResult::isEnumValue($paylog["result"])){
			$paylog["result"]=EnumResult::resultByShow($paylog["result"]);
		}
		if (is_array($paylog)){
			$paylogObj=new Paylog($paylog);
		}
		if ($paylogObj instanceof Paylog){
			$data=$paylogObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 根据主键删除数据对象:收退款记录的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4 
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Paylog::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 数据对象:收退款记录分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:收退款记录分页查询列表
	 */
	public function queryPagePaylog($formPacket=null)
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
		$count=Paylog::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Paylog::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Paylog::propertyShow($data,array('payAction','result'));
			}
			foreach ($data as $paylog) {      
				$order=Order::get_by_id($paylog->order_id);
				$paylog['order_no']=$order->order_no;
				$paylog['commitTime']=UtilDateTime::timestampToDateTime($paylog->commitTime); 
				$paytype=Paymenttype::get_by_id($paylog->pay_type);
				$paylog['pay_type']=$paytype->name;
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
	 * 批量上传收退款记录
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."paylog\\import\\paylog$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Paylog::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $paylog) {
						$paylog=new Paylog($paylog);
						if (!EnumPayAction::isEnumValue($paylog["payAction"])){
							$paylog["payAction"]=EnumPayAction::payActionByShow($paylog["payAction"]);
						}
						if (!EnumResult::isEnumValue($paylog["result"])){
							$paylog["result"]=EnumResult::resultByShow($paylog["result"]);
						}
						$paylog_id=$paylog->getId();
						if (!empty($paylog_id)){
							$hadPaylog=Paylog::get_by_id($paylog->getId());
							if ($hadPaylog!=null){
								$result=$paylog->update();
							}else{
								$result=$paylog->save();
							}
						}else{
							$result=$paylog->save();
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
	 * 导出收退款记录
	 * @param mixed $filter
	 */
	public function exportPaylog($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Paylog::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Paylog::propertyShow($data,array('payAction','result'));
		}
		$arr_output_header= self::fieldsMean(Paylog::tablename()); 
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."paylog\\export\\paylog$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName)); 
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
		$downloadPath  =Gc::$attachment_url."paylog/export/paylog$diffpart.xls"; 
		return array(
			'success' => true,
			'data'    => $downloadPath
		); 
	}
}
?>