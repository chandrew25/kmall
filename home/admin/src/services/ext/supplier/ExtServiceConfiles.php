<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:合同文件<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceConfiles extends ServiceBasic
{
	/**
	 * 保存数据对象:合同文件
	 * @param array|DataObject $confiles
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($confiles)
	{
		if (is_array($confiles)){
			$confilesObj=new Confiles($confiles);
		}
		if ($confilesObj instanceof Confiles){
			$data=$confilesObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 更新数据对象 :合同文件
	 * @param array|DataObject $confiles
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($confiles)
	{
		if (is_array($confiles)){
			$confilesObj=new Confiles($confiles);
		}
		if ($confilesObj instanceof Confiles){
			$data=$confilesObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 根据主键删除数据对象:合同文件的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4 
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Confiles::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		); 
	}

	/**
	 * 数据对象:合同文件分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:合同文件分页查询列表
	 */
	public function queryPageConfiles($formPacket=null)
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
		$count=Confiles::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Confiles::queryPage($start,$limit,$condition);
			foreach ($data as $confiles) {
				$contract=Contract::get_by_id($confiles->contract_id);
				$confiles['contract_name']=$contract->contract_name;
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
	 * 批量上传合同文件
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."confiles\\import\\confiles$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Confiles::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $confiles) {
						$confiles=new Confiles($confiles);
						$confiles_id=$confiles->getId();
						if (!empty($confiles_id)){
							$hadConfiles=Confiles::get_by_id($confiles->getId());
							if ($hadConfiles!=null){
								$result=$confiles->update();
							}else{
								$result=$confiles->save();
							}
						}else{
							$result=$confiles->save();
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
	 * 导出合同文件
	 * @param mixed $filter
	 */
	public function exportConfiles($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Confiles::get($filter);
		$arr_output_header= self::fieldsMean(Confiles::tablename()); 
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."confiles\\export\\confiles$diffpart.xls"; 
		UtilFileSystem::createDir(dirname($outputFileName)); 
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
		$downloadPath  =Gc::$attachment_url."confiles/export/confiles$diffpart.xls"; 
		return array(
			'success' => true,
			'data'    => $downloadPath
		); 
	}
	
	/**  
	 * 根据合同编号获取合同订单
	 * @param mixed $contract_id 合同编号
	 */  
	public function queryConfiles($contract_id)
	{         
	   $data=Confiles::get("contract_id=$contract_id"); 
	   if ($data){
			foreach ($data as $confile) {
				$contract=Contract::get_by_id($confile->contract_id);
				$confile["contract_name"]=$contract->contract_name;  
			}
	   }else{
		   $data=array();
	   }                      
	   return array(
			'success' => true,    
			'data'    => $data
	   );  
	}
			
	/**
	 *  保存合同附件
	 * @param mixed $contract_id 对应的合同id
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function uploadContract($contract_id,$files)
	{     
		$data=false;                             
		if (!empty($files["upload_Contractfile"])){  
			$diffpart=date("YmdHis");
			$tmptail = end(explode('.', $files["upload_Contractfile"]["name"]));
			$uploadPath =GC::$upload_path."contract\\files\\contract$diffpart.$tmptail";
			$result=UtilFileSystem::uploadFile($files,$uploadPath,"upload_Contractfile");   
			if ($result['success']){                          
				$file_size=filesize($uploadPath);			
				$confile_array=array(
					"contract_id"=>$contract_id,
					"file_name"  =>$result["file_showname"],
					"file_path"  => $result["file_name"],
					"origin_name"=> $files["upload_Contractfile"]["name"],
					"file_size"  =>$file_size,
					"file_type"  =>$tmptail
				);
				$confile = new Confiles($confile_array);
				$confile->save();
				$data=true;
			}else{
				return $result;   
			}
		}
		return array(
			'success' => true,    
			'data'    => $data
		);    
	}   
}
?>