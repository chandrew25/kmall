<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:企业信息<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceCompany extends ServiceBasic
{
	/**
	 * 保存数据对象:企业信息
	 * @param array|DataObject $company
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($company)
	{
		$data=parent::save($company);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :企业信息
	 * @param array|DataObject $company
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($company)
	{
		$data=parent::update($company);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:企业信息的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=parent::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:企业信息分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:企业信息分页查询列表
	 */
	public function queryPageCompany($formPacket=null)
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
		$count=parent::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =parent::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Company::propertyShow($data,array('com_kind','com_contractor','com_position'));
			}
			foreach ($data as $company) {
				$member=Member::get_by_id($company->member_id);
				$company['username']=$member->username;
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
	 * 批量上传企业信息
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."company".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."company$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Company::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $company) {
						$company=new Company($company);
						if (!EnumComKind::isEnumValue($company["com_kind"])){
							$company["com_kind"]=EnumComKind::com_kindByShow($company["com_kind"]);
						}
						if (!EnumComContractor::isEnumValue($company["com_contractor"])){
							$company["com_contractor"]=EnumComContractor::com_contractorByShow($company["com_contractor"]);
						}
						if (!EnumComPosition::isEnumValue($company["com_position"])){
							$company["com_position"]=EnumComPosition::com_positionByShow($company["com_position"]);
						}
						$company_id=$company->getId();
						if (!empty($company_id)){
							$hadCompany=Company::get_by_id($company->getId());
							if ($hadCompany!=null){
								$result=$company->update();
							}else{
								$result=$company->save();
							}
						}else{
							$result=$company->save();
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
	 * 导出企业信息
	 * @param mixed $filter
	 */
	public function exportCompany($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Company::propertyShow($data,array('com_kind','com_contractor','com_position'));
		}
		$arr_output_header= self::fieldsMean(Company::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."company".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."company$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."company/export/company$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>