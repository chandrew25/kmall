<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:合同<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceContract extends ServiceBasic
{
	/**
	 * 保存数据对象:合同
	 * @param array|DataObject $contract
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($contract)
	{
		HttpSession::init();
		$admin_id = HttpSession::get("admin_id");

		$contract["contract_status"]=EnumContractStatus::UNCONFIRM;
		if (is_array($contract)){
			$contractObj=new Contract($contract);
		}
		if ($contractObj instanceof Contract){
			$data=$contractObj->save();
			if($data){
				$contractlog = new Contractlog();
				$contractlog->contract_id=$data;
				$contractlog->money=$contractObj->amount;
				$contractlog->admin_id=$admin_id;
				$contractlog->operater=$contractObj->operator;
				$contractlog->actionType=1;
				$contractlog->intro="1";

				$contractlog->save();
			}
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :合同
	 * @param array|DataObject $contract
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($contract)
	{
		if (is_array($contract)){
			$contractObj=new Contract($contract);
		}
		if ($contractObj instanceof Contract){
			$data=$contractObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:合同的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Contract::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:合同分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:合同分页查询列表
	 */
	public function queryPageContract($formPacket=null)
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
		$count=Contract::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Contract::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Contract::propertyShow($data,array('contract_status'));
			}
			foreach ($data as $contract) {
				$supplier=Supplier::get_by_id($contract->supplier_id);
				$contract['sp_name']=$supplier->sp_name;
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
	 * 批量上传合同
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."contract\\import\\contract$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Contract::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $contract) {
						$contract=new Contract($contract);
						if (!EnumContractStatus::isEnumValue($contract["contract_status"])){
							$contract["contract_status"]=EnumContractStatus::contract_statusByShow($contract["contract_status"]);
						}
						$contract_id=$contract->getId();
						if (!empty($contract_id)){
							$hadContract=Contract::get_by_id($contract->getId());
							if ($hadContract!=null){
								$result=$contract->update();
							}else{
								$result=$contract->save();
							}
						}else{
							$result=$contract->save();
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
	 * 导出合同
	 * @param mixed $filter
	 */
	public function exportContract($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Contract::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Contract::propertyShow($data,array('contract_status'));
		}
		$arr_output_header= self::fieldsMean(Contract::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."contract" . DS . "export" . DS . "contract$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."contract/export/contract$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}

	/**
	 * 修改合同状态
	 * @param mixed $status 修改后的状态
	 */
	public function updateContractStatus($contract_id,$status)
	{
		HttpSession::init();
		$admin_id = HttpSession::get("admin_id");

		$data=false;
		if (isset($contract_id)) {
			$data = Contract::updateProperties("contract_id=$contract_id", "contract_status='$status'");
//			if($data && $status==1){
				$contract = Contract::get_by_id($contract_id);
				$contractlog = new Contractlog();
				$contractlog->contract_id=$contract_id;
				$contractlog->money=$contract->amount;
				$contractlog->admin_id=$admin_id;
				$contractlog->operater=$contract->operator;
				$contractlog->actionType=$status;
				$contractlog->intro=EnumActionType::actionTypeShow($status);
				$contractlog->save();
//			}
		}
		return array('success' => true, 'data' => $data);
	}
}
?>
