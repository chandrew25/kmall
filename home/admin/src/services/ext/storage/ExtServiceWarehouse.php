<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:仓库<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceWarehouse extends ServiceBasic
{
	/**
	 * 保存数据对象:仓库
	 * @param array|DataObject $warehouse
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($warehouse)
	{
		if (isset($warehouse["isDefault"])&&($warehouse["isDefault"]=='1'))$warehouse["isDefault"]=true; else $warehouse["isDefault"]=false;
		if (is_array($warehouse)){
			$warehouseObj=new Warehouse($warehouse);
		}
		if ($warehouseObj instanceof Warehouse){
			$data=$warehouseObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :仓库
	 * @param array|DataObject $warehouse
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($warehouse)
	{
		if (isset($warehouse["isDefault"])&&($warehouse["isDefault"]=='1'))$warehouse["isDefault"]=true; else $warehouse["isDefault"]=false;
		if (is_array($warehouse)){
			$warehouseObj=new Warehouse($warehouse);
		}
		if ($warehouseObj instanceof Warehouse){
			$data=$warehouseObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:仓库的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Warehouse::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:仓库分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:仓库分页查询列表
	 */
	public function queryPageWarehouse($formPacket=null)
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
		HttpSession::init();
		$admin=HttpSession::get("admin");
		if ($admin&&($admin->roletype==EnumRoletype::SUPPLIER)&&$admin->seescope==EnumSeescope::SELF)
		{
			$condition['supplier_id']= $admin->roleid;
		}
		unset($condition['start'],$condition['limit']);
		$condition=$this->filtertoCondition($condition);
		$count=Warehouse::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Warehouse::queryPage($start,$limit,$condition);
			foreach ($data as $warehouse) {
				$supplier=Supplier::get_by_id($warehouse->supplier_id);
				$warehouse['sp_name']=$supplier->sp_name;
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
	 * 批量上传仓库
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."warehouse" . DS . "import" . DS . "warehouse$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Warehouse::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $warehouse) {
						$warehouse=new Warehouse($warehouse);
						$warehouse_id=$warehouse->getId();
						if (!empty($warehouse_id)){
							$hadWarehouse=Warehouse::get_by_id($warehouse->getId());
							if ($hadWarehouse!=null){
								$result=$warehouse->update();
							}else{
								$result=$warehouse->save();
							}
						}else{
							$result=$warehouse->save();
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
	 * 导出仓库
	 * @param mixed $filter
	 */
	public function exportWarehouse($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Warehouse::get($filter);
		$arr_output_header= self::fieldsMean(Warehouse::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."warehouse" . DS . "export" . DS . "warehouse$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."warehouse/export/warehouse$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
