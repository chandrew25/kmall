<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:品牌<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceBrand extends ServiceBasic
{
	/**
	 * 保存数据对象:品牌
	 * @param array|DataObject $brand
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($brand)
	{
		if (isset($brand["isShow"])&&($brand["isShow"]=='1'))$brand["isShow"]=true; else $brand["isShow"]=false;
		if (!empty($_FILES)&&!empty($_FILES["brand_logoUpload"]["name"])){
			$result=$this->uploadImg($_FILES,"brand_logoUpload","brand_logo");
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$brand["brand_logo"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		if (!empty($_FILES)&&!empty($_FILES["imagesUpload"]["name"])){
			$result=$this->uploadImg($_FILES,"imagesUpload","images");
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$brand["images"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		if (is_array($brand)){
			$brandObj=new Brand($brand);
		}
		if (empty($brandObj->initials)) {
			if (!empty($brandObj->brand_name)){
				$brand_name = trim($brandObj->brand_name);
				$brand_name = UtilPinyin::translate($brand_name);
				$brand_name = ucfirst($brand_name);
				$brandObj->initials = $brand_name[0];
			}
		}
		if ($brandObj instanceof Brand){
			$data=$brandObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :品牌
	 * @param array|DataObject $brand
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($brand)
	{
		if (isset($brand["isShow"])&&($brand["isShow"]=='1'))$brand["isShow"]=true; else $brand["isShow"]=false;
		if (!empty($_FILES)&&!empty($_FILES["brand_logoUpload"]["name"])){
			$result=$this->uploadImg($_FILES,"brand_logoUpload","brand_logo");
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$brand["brand_logo"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
			$result=$this->uploadImg($_FILES,"imageUpload","images");
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$brand["images"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		if (is_array($brand)){
			$brandObj=new Brand($brand);
		}
		if (empty($brandObj->initials)) {
			if (!empty($brandObj->brand_name)){
				$brand_name = trim($brandObj->brand_name);
				$brand_name = UtilPinyin::translate($brand_name);
				$brand_name = ucfirst($brand_name);
				$brandObj->initials = $brand_name[0];
			}
		}
		if ($brandObj instanceof Brand){
			$data=$brandObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}


	/**
	 * 上传品牌图片文件
	 */
	public function uploadImg($files,$uploadFlag,$upload_dir)
	{
		$diffpart=date("YmdHis");
		$result="";
		if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
			$tmptail = end(explode('.', $files[$uploadFlag]["name"]));
			$uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."brand".DIRECTORY_SEPARATOR."$upload_dir".DIRECTORY_SEPARATOR."$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
			if ($result&&($result['success']==true)){
				$result['file_name']="brand/$upload_dir/$diffpart.$tmptail";
			}else{
				return array(
					'success' => true,
					'data'    => false
				);
			}
		}
		return $result;
	}

	/**
	 * 根据主键删除数据对象:品牌的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Brand::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:品牌分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:品牌分页查询列表
	 */
	public function queryPageBrand($formPacket=null)
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
		$count=Brand::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Brand::queryPage($start,$limit,$condition);
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
	 * 批量上传品牌
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."brand".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."brand$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Brand::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $brand) {
						$brand=new Brand($brand);
						$brand_name=$brand->getBrand_name();
						if (!empty($brand_name)){
							$hadBrand=Brand::get_one(array('brand_name'=>$brand_name));
							if ($hadBrand!=null){
								$result=$brand->update();
							}else{
								$result=$brand->save();
							}
						}else{
							$result=$brand->save();
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
	 * 导出品牌
	 * @param mixed $filter
	 */
	public function exportBrand($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Brand::get($filter);
		$arr_output_header= self::fieldsMean(Brand::tablename());
		unset($arr_output_header['brand_id']);
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."brand".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."brand$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."brand/export/brand$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
