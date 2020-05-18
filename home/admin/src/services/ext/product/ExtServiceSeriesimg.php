<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:商品图片<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceSeriesimg extends ServiceBasic
{
	/**
	 * 保存数据对象:商品图片
	 * @param array|DataObject $seriesimg
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($seriesimg)
	{
		if (isset($seriesimg["isShow"])&&($seriesimg["isShow"]=='1'))$seriesimg["isShow"]=true; else $seriesimg["isShow"]=false;
		if (!empty($_FILES)&&!empty($_FILES["imageLargeUpload"]["name"])){
			$result=$this->uploadImg($_FILES,"imageLargeUpload","large");
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$seriesimg["image_large"]= $result['file_name'];
				}
				$result['file_name']=str_replace("/",DIRECTORY_SEPARATOR,$result['file_name']);
				$file_name=basename($result['file_name']);
				$tmptail = end(explode('.',  $result['file_name']));
				$filename="product".DIRECTORY_SEPARATOR."m_".$file_name;
				$imagePath=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
				$isBuildNormal=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,358,358,true,true);
				if ($isBuildNormal){
					$filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
					$seriesimg["img"]= $filename;
				}

				$filename="product".DIRECTORY_SEPARATOR."thumb".DIRECTORY_SEPARATOR."s_".$file_name;
				$isBuildThumb=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,80,80,true,true);
				if ($isBuildThumb){
					$filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
					$seriesimg["ico"]= $filename;
				}
			}else{
				return $result;
			}
		}
		$data=parent::save($seriesimg);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :商品图片
	 * @param array|DataObject $seriesimg
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($seriesimg)
	{
		if (isset($seriesimg["isShow"])&&($seriesimg["isShow"]=='1'))$seriesimg["isShow"]=true; else $seriesimg["isShow"]=false;
		if (!empty($_FILES)&&!empty($_FILES["imageLargeUpload"]["name"])){
			$result=$this->uploadImg($_FILES,"imageLargeUpload","large");
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$seriesimg["image_large"]= $result['file_name'];
				}
				$result['file_name']=str_replace("/",DIRECTORY_SEPARATOR,$result['file_name']);
				$file_name=basename($result['file_name']);
				$tmptail = end(explode('.',  $result['file_name']));
				$filename="product".DIRECTORY_SEPARATOR."m_".$file_name;
				$imagePath=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
				$isBuildNormal=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,358,358,true,true);
				if ($isBuildNormal){
					$filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
					$seriesimg["img"]= $filename;
				}

				$filename="product".DIRECTORY_SEPARATOR."thumb".DIRECTORY_SEPARATOR."s_".$file_name;
				$isBuildThumb=UtilImage::thumb($imagePath.$result['file_name'],$imagePath.$filename,$tmptail,80,80,true,true);
				if ($isBuildThumb){
					$filename=str_replace(DIRECTORY_SEPARATOR,"/",$filename);
					$seriesimg["ico"]= $filename;
				}
			}else{
				return $result;
			}
		}
		$data=parent::update($seriesimg);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 上传商品图片图片文件
	 */
	public function uploadImg($files,$uploadFlag,$upload_dir)
	{
		$diffpart=date("YmdHis");
		$result="";
		if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
			$tmptail = end(explode('.', $files[$uploadFlag]["name"]));
			$uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."product".DIRECTORY_SEPARATOR."$upload_dir".DIRECTORY_SEPARATOR."$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
			if ($result&&($result['success']==true)){
				$result['file_name']="product/$upload_dir/$diffpart.$tmptail";
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
	 * 根据主键删除数据对象:商品图片的多条数据记录
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
	 * 数据对象:商品图片分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:商品图片分页查询列表
	 */
	public function queryPageSeriesimg($formPacket=null)
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
			foreach ($data as $seriesimg) {
				$product=Product::get_by_id($seriesimg->product_id);
				$seriesimg['product_name']=$product->product_name;
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
	 * 批量上传商品图片
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."seriesimg".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."seriesimg$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Seriesimg::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $seriesimg) {
						$seriesimg=new Seriesimg($seriesimg);
						$seriesimg_id=$seriesimg->getId();
						if (!empty($seriesimg_id)){
							$hadSeriesimg=Seriesimg::get_by_id($seriesimg->getId());
							if ($hadSeriesimg!=null){
								$result=$seriesimg->update();
							}else{
								$result=$seriesimg->save();
							}
						}else{
							$result=$seriesimg->save();
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
	 * 导出商品图片
	 * @param mixed $filter
	 */
	public function exportSeriesimg($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		$arr_output_header= self::fieldsMean(Seriesimg::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."seriesimg".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."seriesimg$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."seriesimg/export/seriesimg$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>