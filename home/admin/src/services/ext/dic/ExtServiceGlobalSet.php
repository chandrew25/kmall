<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:全局配置<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceGlobalSet extends ServiceBasic
{

	/**
	 * 加载数据对象 :全局配置.xml
	 * @param array|DataObject $region
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function loadconfig($data=null) {
		$data=ConfigStore::init();
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :全局配置.xml
	 * @param array|DataObject $region
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function updateconfig($data) {
		$success=true;
		if (!empty($_FILES)&&!empty($_FILES["logo"]["name"])){
			$result=$this->uploadImg($_FILES,"logo","logo");
			if ($result&&($result['success']==true)){
				$data['logo']= $result['file_name'];				
			}else{
				$success=false;
			}
		}
		if(ConfigStore::update($data)===false)$success=false;
		return array(
			'success' => $success,
			'data'=>$data
		); 
	}

	/**
	 * 上传图片文件
	 */
	public function uploadImg($files,$uploadFlag,$upload_dir)
	{
		$diffpart=date("YmdHis");
		$result="";
		if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
			$tmptail = end(explode('.', $files[$uploadFlag]["name"]));
			$uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."globalset".DIRECTORY_SEPARATOR."$upload_dir".DIRECTORY_SEPARATOR."$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
			if ($result&&($result['success']==true)){
				$result['file_name']="upload/images/globalset/$upload_dir/$diffpart.$tmptail";
			}else{
				return array(
					'success' => true,
					'data'    => false
				);
			}
		}
		return $result;
	}
}
?>