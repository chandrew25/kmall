<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:分类树<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author fxf 924197212@qq.com
 */
class ExtServiceDemo extends ServiceBasic
{
	/**
	 * 保存数据对象:分类
	 * @param array|DataObject $obj
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($obj)
	{
		if (isset($obj["isShow"])&&($obj["isShow"]=='1'))$obj["isShow"]=1; else $obj["isShow"]=0;
		if (!empty($_FILES)&&!empty($_FILES["ptype_imageUpload"]["name"])){
			$result=$this->uploadImg($_FILES);
			LogMe::log($result);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$obj["ico"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		if($obj["parent_id"]){
			Demo::increment("demo_id=".$obj["parent_id"],"countChild",1);
		}
		$obj["demo_id"]=null;
		$obj["updateTime"]=null;
		$data=parent::save($obj);
		return array(
			'success' => true,
			'data'    => $data,
			'ico'     => $obj["ico"],
			'icoShow' => Gc::$upload_url."images/".$obj["ico"]
		);
	}

	/**
	 * 更新数据对象 :分类
	 * @param array|DataObject $obj
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($obj)
	{
		if (isset($obj["isShow"])&&($obj["isShow"]=='1'))$obj["isShow"]=1; else $obj["isShow"]=0;
		if (!empty($_FILES)&&!empty($_FILES["ptype_imageUpload"]["name"])){
			$result=$this->uploadImg($_FILES);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$obj["ico"]= $result['file_name'];
				}
			}else{
				return $result;
			}
		}
		$obj["commitTime"]=null;
		$succ=parent::update($obj);
		return array(
			'success' => $succ,
			'ico'    => $obj["ico"],
			'icoShow' => Gc::$upload_url."images/".$obj["ico"]
		);
	}


	/**
	 * 上传分类图片文件
	 */
	public function uploadImg($files)
	{
		$diffpart=date("YmdHis");
		$result="";
		if (!empty($files["ptype_imageUpload"])&&!empty($files["ptype_imageUpload"]["name"])){
			$tmptail = end(explode('.', $files["ptype_imageUpload"]["name"]));
			$uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."demo".DIRECTORY_SEPARATOR."$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath,"ptype_imageUpload");
			if ($result&&($result['success']==true)){
				$result['file_name']="demo/$diffpart.$tmptail";
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
	 * 根据主键删除数据对象:分类的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$demo=Demo::get_by_id($ids);
		$demo->delete();
		if($demo->parent_id){
			LogMe::log("pid".$demo->parent_id);
			Demo::decrement("demo_id=$demo->parent_id","countChild",1);	
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:分类分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:分类分页查询列表
	 */
	public function queryPageNews($formPacket=null)
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
				News::propertyShow($data,array('news_type'));
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
	 * 批量上传分类
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."news".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."news$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(News::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $news) {
						$news=new News($news);
						if (!EnumNewsType::isEnumValue($news["news_type"])){
							$news["news_type"]=EnumNewsType::news_typeByShow($news["news_type"]);
						}
						$news_id=$news->getId();
						if (!empty($news_id)){
							$hadNews=News::get_by_id($news->getId());
							if ($hadNews!=null){
								$result=$news->update();
							}else{
								$result=$news->save();
							}
						}else{
							$result=$news->save();
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
	 * 导出分类
	 * @param mixed $filter
	 */
	public function exportNews($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			News::propertyShow($data,array('news_type'));
		}
		$arr_output_header= self::fieldsMean(News::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."news".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."news$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."news/export/news$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>