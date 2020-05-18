<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:合同订单<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceContractorder extends ServiceBasic
{
	/**
	 * 保存数据对象:合同订单
	 * @param array|DataObject $contractorder
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($contractorder)
	{
		if (is_array($contractorder)){
			$contractorderObj=new Contractorder($contractorder);
		}
		if ($contractorderObj instanceof Contractorder){
			$data=$contractorderObj->save();
			$warehouse=Warehouse::get_one("sp_id=".$contractorder["supplier_id"]);
			if (empty($warehouse)){
				$supplier=Supplier::get_by_id($contractorderObj->supplier_id);
				$warehouse_name=$supplier->sp_name."的仓库";
				$warehouse_array=array(
					'supplier_id'         =>$contractorderObj->supplier_id,
					'isDefault'     =>true,
					'warehouse_name'=>$warehouse_name
				);
				$warehouse=new Warehouse($warehouse_array);
				$warehouse->save();
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
	 * 更新数据对象 :合同订单
	 * @param array|DataObject $contractorder
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($contractorder)
	{
		if (is_array($contractorder)){
			$contractorderObj=new Contractorder($contractorder);
		}
		if ($contractorderObj instanceof Contractorder){
			$data=$contractorderObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:合同订单的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Contractorder::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:合同订单分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:合同订单分页查询列表
	 */
	public function queryPageContractorder($formPacket=null)
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
		$count=Contractorder::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Contractorder::queryPage($start,$limit,$condition);
			foreach ($data as $contractorder) {
				$contract=Contract::get_by_id($contractorder->contract_id);
				$contractorder["contract_name"]=$contract->contract_name;
				$supplier=Supplier::get_by_id($contractorder->supplier_id);
				$contractorder["supplier_name"]=$supplier->sp_name;
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
	 * 根据合同编号获取合同订单
	 * @param mixed $contract_id 合同编号
	 */
	public function queryByContractID($contract_id)
	{
	   $data=Contractorder::get("contract_id=$contract_id");
	   if ($data){
			foreach ($data as $contractorder) {
				$contract=Contract::get_by_id($contractorder->contract_id);
				$contractorder["contract_name"]=$contract->contract_name;
				$supplier=Supplier::get_by_id($contractorder->supplier_id);
				$contractorder["supplier_name"]=$supplier->sp_name;
			}
	   }else{
		   $data=array();
	   }
	   return array(
			'success' => true,
			'data'    => $data
	   );
	}

	/**
	 * 批量上传合同订单
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."contractorder" . DS . "import" . DS . "contractorder$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Contractorder::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $contractorder) {
						$contractorder=new Contractorder($contractorder);
						$contractorder_id=$contractorder->getId();
						if (!empty($contractorder_id)){
							$hadContractorder=Contractorder::get_by_id($contractorder->getId());
							if ($hadContractorder!=null){
								$result=$contractorder->update();
							}else{
								$result=$contractorder->save();
							}
						}else{
							$result=$contractorder->save();
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
	 * 导出合同订单
	 * @param mixed $filter
	 */
	public function exportContractorder($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Contractorder::get($filter);
		$arr_output_header= self::fieldsMean(Contractorder::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."contractorder" . DS . "export" . DS . "contractorder$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."contractorder/export/contractorder$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
