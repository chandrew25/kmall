<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:量词<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceQuantifier extends ServiceBasic
{
	/**
	 * 保存数据对象:量词
	 * @param array|DataObject $quantifier
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($quantifier)
	{
		if (is_array($quantifier)){
			$quantifierObj=new Quantifier($quantifier);
		}
		if ($quantifierObj instanceof Quantifier){
			$data=$quantifierObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :量词
	 * @param array|DataObject $quantifier
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($quantifier)
	{
		if (is_array($quantifier)){
			$quantifierObj=new Quantifier($quantifier);
		}
		if ($quantifierObj instanceof Quantifier){
			$data=$quantifierObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:量词的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Quantifier::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:量词分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:量词分页查询列表
	 */
	public function queryPageQuantifier($formPacket=null)
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
		$count=Quantifier::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Quantifier::queryPage($start,$limit,$condition);
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
	 * 批量上传量词
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."quantifier" . DS . "import" . DS . "quantifier$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Quantifier::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $quantifier) {
						$quantifier=new Quantifier($quantifier);
						$quantifier_id=$quantifier->getId();
						if (!empty($quantifier_id)){
							$hadQuantifier=Quantifier::get_by_id($quantifier->getId());
							if ($hadQuantifier!=null){
								$result=$quantifier->update();
							}else{
								$result=$quantifier->save();
							}
						}else{
							$result=$quantifier->save();
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
	 * 导出量词
	 * @param mixed $filter
	 */
	public function exportQuantifier($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Quantifier::get($filter);
		$arr_output_header= self::fieldsMean(Quantifier::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."quantifier" . DS . "export" . DS . "quantifier$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."quantifier/export/quantifier$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
