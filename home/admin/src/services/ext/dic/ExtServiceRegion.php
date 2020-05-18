<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:地区<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceRegion extends ServiceBasic
{
	/**
	 * 保存数据对象:地区
	 * @param array|DataObject $region
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($region)
	{
		if (is_array($region)){
			$regionObj=new Region($region);
		}
		if ($regionObj instanceof Region){
			$data=$regionObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :地区
	 * @param array|DataObject $region
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($region)
	{
		if (!EnumRegionType::isEnumValue($region["region_type"])){
			$region["region_type"]=EnumRegionType::region_typeByShow($region["region_type"]);
		}
		if (is_array($region)){
			$regionObj=new Region($region);
		}
		if ($regionObj instanceof Region){
			$data=$regionObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:地区的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Region::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:地区分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:地区分页查询列表
	 */
	public function queryPageRegion($formPacket=null)
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
		$count=Region::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Region::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Region::propertyShow($data,array('region_type'));
			}
			foreach ($data as $region) {
				$region_parent=Region::get_by_id($region->parent_id);
				$region['region_name_parent']=$region_parent->region_name;
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
	 * 批量上传地区
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."region" . DS . "import" . DS . "region$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Region::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $region) {
						$region=new Region($region);
						if (!EnumRegionType::isEnumValue($region["region_type"])){
							$region["region_type"]=EnumRegionType::region_typeByShow($region["region_type"]);
						}
						$region_id=$region->getId();
						if (!empty($region_id)){
							$hadRegion=Region::get_by_id($region->getId());
							if ($hadRegion!=null){
								$result=$region->update();
							}else{
								$result=$region->save();
							}
						}else{
							$result=$region->save();
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
	 * 导出地区
	 * @param mixed $filter
	 */
	public function exportRegion($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Region::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Region::propertyShow($data,array('region_type'));
		}
		$arr_output_header= self::fieldsMean(Region::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."region" . DS . "export" . DS . "region$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."region/export/region$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
