<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:商务定制套餐<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceCustomize extends ServiceBasic
{
	/**
	 * 保存数据对象:商务定制套餐
	 * @param array|DataObject $customize
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($customize)
	{
		if (isset($customize["isShow"])&&($customize["isShow"]=='1'))$customize["isShow"]=true; else $customize["isShow"]=false;
		if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
			$result=$this->uploadImg($_FILES);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$customize["image"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		$data=parent::save($customize);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :商务定制套餐
	 * @param array|DataObject $customize
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($customize)
	{
		if (isset($customize["isShow"])&&($customize["isShow"]=='1'))$customize["isShow"]=true; else $customize["isShow"]=false;
		if (!empty($_FILES)&&!empty($_FILES["imageUpload"]["name"])){
			$result=$this->uploadImg($_FILES);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$customize["image"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		$data=parent::update($customize);
		return array(
			'success' => true,
			'data'    => $data
		);
	}


	/**
	 * 上传商务定制套餐图片文件
	 */
	public function uploadImg($files)
	{
		$diffpart=date("YmdHis");
		$result="";
		if (!empty($files["imageUpload"])&&!empty($files["imageUpload"]["name"])){
			$tmptail = end(explode('.', $files["imageUpload"]["name"]));
			$uploadPath =GC::$upload_path."images" . DS . "customize" . DS . "$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath,"imageUpload");
			if ($result&&($result['success']==true)){
				$result['file_name']="customize/$diffpart.$tmptail";
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
	 * 根据主键删除数据对象:商务定制套餐的多条数据记录
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
	 * 数据对象:商务定制套餐分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:商务定制套餐分页查询列表
	 */
	public function queryPageCustomize($formPacket=null)
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
	 * 批量上传商务定制套餐
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."customize".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."customize$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Customize::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $customize) {
						$customize=new Customize($customize);
						$customize_id=$customize->getId();
						if (!empty($customize_id)){
							$hadCustomize=Customize::get_by_id($customize->getId());
							if ($hadCustomize!=null){
								$result=$customize->update();
							}else{
								$result=$customize->save();
							}
						}else{
							$result=$customize->save();
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
	 * 导出商务定制套餐
	 * @param mixed $filter
	 */
	public function exportCustomize($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		$arr_output_header= self::fieldsMean(Customize::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."customize".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."customize$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."customize/export/customize$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
