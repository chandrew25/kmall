<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:顾客留言<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceConsult extends ServiceBasic
{
	/**
	 * 保存数据对象:顾客留言
	 * @param array|DataObject $consult
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($consult)
	{
		if (is_array($consult)){
			$consultObj=new Consult($consult);
		}
		if ($consultObj instanceof Consult){
			$data=$consultObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :顾客留言
	 * @param array|DataObject $consult
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($consult)
	{
		if (is_array($consult)){
			$consultObj=new Consult($consult);
		}
		if ($consultObj instanceof Consult){
			$data=$consultObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:顾客留言的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Consult::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:顾客留言分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:顾客留言分页查询列表
	 */
	public function queryPageConsult($formPacket=null)
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
		$count=Consult::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Consult::queryPage($start,$limit,$condition);
			foreach ($data as $consult) {
				if ($consult->order_id){
					$order_instance=Order::get_by_id($consult->order_id);
					$consult['order_no']=$order_instance->order_no;
				}
				if ($consult->member_id){
					$member_instance=Member::get_by_id($consult->member_id);
					$consult['username']=$member_instance->username;
				}
				$consult['commitTime']=UtilDateTime::timestampToDateTime($consult->commitTime);
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
	 * 批量上传顾客留言
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."consult" . DS . "import" . DS . "consult$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Consult::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $consult) {
						$consult=new Consult($consult);
						$consult_id=$consult->getId();
						if (!empty($consult_id)){
							$hadConsult=Consult::get_by_id($consult->getId());
							if ($hadConsult!=null){
								$result=$consult->update();
							}else{
								$result=$consult->save();
							}
						}else{
							$result=$consult->save();
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
	 * 导出顾客留言
	 * @param mixed $filter
	 */
	public function exportConsult($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Consult::get($filter);
		$arr_output_header= self::fieldsMean(Consult::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."consult" . DS . "export" . DS . "consult$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."consult/export/consult$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
