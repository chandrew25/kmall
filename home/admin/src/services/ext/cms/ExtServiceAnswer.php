<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:客户商务定制<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceAnswer extends ServiceBasic
{
	/**
	 * 保存数据对象:客户商务定制
	 * @param array|DataObject $answer
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($answer)
	{
		if (isset($answer["isReview"])&&($answer["isReview"]=='1'))$answer["isReview"]=true; else $answer["isReview"]=false;
		if (is_array($answer)){
			$answerObj=new Answer($answer);
		}
		if ($answerObj instanceof Answer){
			$data=$answerObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :客户商务定制
	 * @param array|DataObject $answer
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($answer)
	{
		if (isset($answer["isReview"])&&($answer["isReview"]=='1'))$answer["isReview"]=true; else $answer["isReview"]=false;
		if (is_array($answer)){
			$answerObj=new Answer($answer);
		}
		if ($answerObj instanceof Answer){
			$data=$answerObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:客户商务定制的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Answer::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:客户商务定制分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:客户商务定制分页查询列表
	 */
	public function queryPageAnswer($formPacket=null)
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
		$count=Answer::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Answer::queryPage($start,$limit,$condition);
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
	 * 批量上传客户商务定制
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."answer".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."answer$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Answer::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $answer) {
						$answer=new Answer($answer);
						$answer_id=$answer->getId();
						if (!empty($answer_id)){
							$hadAnswer=Answer::get_by_id($answer->getId());
							if ($hadAnswer!=null){
								$result=$answer->update();
							}else{
								$result=$answer->save();
							}
						}else{
							$result=$answer->save();
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
	 * 导出客户商务定制
	 * @param mixed $filter
	 */
	public function exportAnswer($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Answer::get($filter);
		$arr_output_header= self::fieldsMean(Answer::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."answer".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."answer$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."answer/export/answer$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>