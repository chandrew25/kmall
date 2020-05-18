<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:会员收货人地址信息<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceAddress extends ServiceBasic
{
	/**
	 * 保存数据对象:会员收货人地址信息
	 * @param array|DataObject $address
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($address)
	{
		/*
		$region_id=$address["region_id"];
		$address['district']=$region_id;
		$region=Region::get_by_id($region_id);
		$address['city']=$region->parent_id;
		$region=Region::get_by_id($region->parent_id);
		$address['province']=$region->parent_id;
		$address['country']="1";
		*/
		$data=parent::save($address);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :会员收货人地址信息
	 * @param array|DataObject $address
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($address)
	{
		/*
		$region_id=$address["region_id"];
		$address['district']=$region_id;
		$region=Region::get_by_id($region_id);
		$address['city']=$region->parent_id;
		$region=Region::get_by_id($region->parent_id);
		$address['province']=$region->parent_id;
		$address['country']="1";
		*/
		$data=parent::update($address);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:会员收货人地址信息的多条数据记录
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
	 * 数据对象:会员收货人地址信息分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:会员收货人地址信息分页查询列表
	 */
	public function queryPageAddress($formPacket=null)
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
			foreach ($data as $address) {
				$member=Member::get_by_id($address->member_id);
                $address['email']=$member->email;
				$address['username']=$member->username;
				$address['country_name']="中国";
				$region=Region::get_by_id($address->province);
				$address['province_name']=$region->region_name;
				$region=Region::get_by_id($address->city);
				$address['city_name']=$region->region_name;
				$region=Region::get_by_id($address->district);
				$address['district_name']=$region->region_name;
				$address["area"]=$address["country_name"]."-".$address["province_name"]."-".$address["city_name"]."-".$address["district_name"];
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
	 * 批量上传会员收货人地址信息
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."address".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."address$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Address::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $address) {
						$address=new Address($address);
						$address_id=$address->getId();
						if (!empty($address_id)){
							$hadAddress=Address::get_by_id($address->getId());
							if ($hadAddress!=null){
								$result=$address->update();
							}else{
								$result=$address->save();
							}
						}else{
							$result=$address->save();
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
	 * 导出会员收货人地址信息
	 * @param mixed $filter
	 */
	public function exportAddress($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		$arr_output_header= self::fieldsMean(Address::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."address".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."address$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."address/export/address$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>