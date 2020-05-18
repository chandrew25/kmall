<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:供应商<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceSupplier extends ServiceBasic
{
	/**
	 * 保存数据对象:供应商
	 * @param array|DataObject $supplier
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($supplier)
	{
		if (isset($supplier["isOk"])&&($supplier["isOk"]=='1'))$supplier["isOk"]=true; else $supplier["isOk"]=false;
		if (is_array($supplier)){
			$supplierObj=new Supplier($supplier);
		}
		if ($supplierObj instanceof Supplier){
			$data=$supplierObj->save();
			$warehouse=Warehouse::get_one("supplier_id=".$supplier["supplier_id"]);
			if (empty($warehouse)){
				$supplier=Supplier::get_by_id($supplierObj->supplier_id);
				$warehouse_name=$supplier->sp_name."的仓库";
				$warehouse_array=array(
					'supplier_id'         =>$supplierObj->supplier_id,
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
	 * 更新数据对象 :供应商
	 * @param array|DataObject $supplier
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($supplier)
	{
		if (isset($supplier["isOk"])&&($supplier["isOk"]=='1'))$supplier["isOk"]=true; else $supplier["isOk"]=false;
		if (!EnumStype::isEnumValue($supplier["stype"])){
			$supplier["stype"]=EnumStype::stypeByShow($supplier["stype"]);
		}
		if (is_array($supplier)){
			$supplierObj=new Supplier($supplier);
		}
		if ($supplierObj instanceof Supplier){
			$data=$supplierObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:供应商的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Supplier::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:供应商分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:供应商分页查询列表
	 */
	public function queryPageSupplier($formPacket=null)
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
		$count=Supplier::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Supplier::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Supplier::propertyShow($data,array('stype'));
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
	 * 批量上传供应商
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."supplier" . DS . "import" . DS . "supplier$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Supplier::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $supplier) {
						if (!EnumStype::isEnumValue($supplier["stype"])){
							$supplier["stype"]=EnumStype::stypeByShow($supplier["stype"]);
						}
						if ($supplier->isOk && $supplier->isOk =="1") $supplier->isOk=true; else $supplier->isOk=false;
						$supplier=new Supplier($supplier);
						$supplier_id=$supplier->getId();
						if (!empty($supplier_id)){
							$hadSupplier=Supplier::get_by_id($supplier->getId());
							if ($hadSupplier!=null){
								$result=$supplier->update();
							}else{
								$result=$supplier->save();
							}
						}else{
							$result=$supplier->save();
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
	 * 导出供应商
	 * @param mixed $filter
	 */
	public function exportSupplier($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Supplier::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Supplier::propertyShow($data,array('stype'));
		}
		foreach ($data as $supplier) {
			if ($supplier->stypeShow){
					$supplier['stype']=$supplier->stypeShow;
			}
			if ($supplier->isOk && $supplier->isOk=="1") $supplier["isOk"]="是"; else $supplier["isOk"]="否";
			$admin_instance=null;
			if ($supplier->admin_id){
					$admin_instance=Admin::get_by_id($supplier->admin_id);
					$supplier['admin_id']=$admin_instance->username;
			}
			$supplier->count_product = sqlExecute("select count(p.product_id) from km_supplier_supplier s,km_product p where s.supplier_id=p.supplier_id and s.supplier_id=" . $supplier->supplier_id);
		}
		$arr_output_header = self::fieldsMean(Supplier::tablename());
		$arr_output_header['count_product'] = "供应产品数量";
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path . "supplier" . DS . "export" . DS . "supplier$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."supplier/export/supplier$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
	/**
	 * 审核前台提交的供应商的信息
	 * @param mixed $sp_ids 供应商的标识们
	 */
	public function checkSupplier($sp_ids)
	{
		$data=false;
		if (isset($sp_ids)){
			$data=Supplier::updateProperties("$sp_ids",array("isOk"=>true));
		}
		return array(
				'success'=>true,
				'data'=>$data
		);
	}
}
?>
