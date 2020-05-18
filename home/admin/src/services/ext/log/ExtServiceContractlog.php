<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:合同日志<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceContractlog extends ServiceBasic
{
	/**
	 * 保存数据对象:合同日志
	 * @param array|DataObject $contractlog
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($contractlog)
	{
		if (is_array($contractlog)){
			$contractlogObj=new Contractlog($contractlog);
		}
		if ($contractlogObj instanceof Contractlog){
			$contractlogObj->admin_id=HttpSession::get("admin_id");
			$data=$contractlogObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :合同日志
	 * @param array|DataObject $contractlog
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($contractlog)
	{
		if (!EnumActionType::isEnumValue($contractlog["actionType"])){
			$contractlog["actionType"]=EnumActionType::actionTypeByShow($contractlog["actionType"]);
		}
		if (is_array($contractlog)){
			$contractlogObj=new Contractlog($contractlog);
		}
		if ($contractlogObj instanceof Contractlog){
			$data=$contractlogObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 根据主键删除数据对象:合同日志的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4 
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Contractlog::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 数据对象:合同日志分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:合同日志分页查询列表
	 */
	public function queryPageContractlog($formPacket=null)
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
		$count=Contractlog::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Contractlog::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Contractlog::propertyShow($data,array('actionType'));
			}
			foreach ($data as $contractlog) {
				$contract=Contract::get_by_id($contractlog->contract_id);
				$contractlog['contract_name']=$contract->contract_name;
                if ($contractlog->commitTime)$contractlog["commitTimeShow"]=UtilDateTime::timestampToDateTime($contractlog->commitTime);
                
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
	 * 批量上传合同日志
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."contractlog\\import\\contractlog$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Contractlog::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $contractlog) {
						$contractlog=new Contractlog($contractlog);
						if (!EnumActionType::isEnumValue($contractlog["actionType"])){
							$contractlog["actionType"]=EnumActionType::actionTypeByShow($contractlog["actionType"]);
						}
						$contractlog_id=$contractlog->getId();
						if (!empty($contractlog_id)){
							$hadContractlog=Contractlog::get_by_id($contractlog->getId());
							if ($hadContractlog!=null){
								$result=$contractlog->update();
							}else{
								$result=$contractlog->save();
							}
						}else{
							$result=$contractlog->save();
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
	 * 导出合同日志
	 * @param mixed $filter
	 */
	public function exportContractlog($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Contractlog::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Contractlog::propertyShow($data,array('actionType'));
		}
		$arr_output_header= self::fieldsMean(Contractlog::tablename()); 
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."contractlog\\export\\contractlog$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName)); 
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
		$downloadPath  =Gc::$attachment_url."contractlog/export/contractlog$diffpart.xls"; 
		return array(
			'success' => true,
			'data'    => $downloadPath
		); 
	}
}
?>