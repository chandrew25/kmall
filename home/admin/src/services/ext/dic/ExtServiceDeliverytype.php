<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:配送方式<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceDeliverytype extends ServiceBasic
{
	/**
	 * 保存数据对象:配送方式
	 * @param array|DataObject $deliverytype
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($deliverytype)
	{
		if (isset($deliverytype["insure"])&&($deliverytype["insure"]=='1'))$deliverytype["insure"]=true; else $deliverytype["insure"]=false;
		if (isset($deliverytype["supportcod"])&&($deliverytype["supportcod"]=='1'))$deliverytype["supportcod"]=true; else $deliverytype["supportcod"]=false;
		if (is_array($deliverytype)){
			$deliverytypeObj=new Deliverytype($deliverytype);
		}
		if ($deliverytypeObj instanceof Deliverytype){
			$data=$deliverytypeObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :配送方式
	 * @param array|DataObject $deliverytype
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($deliverytype)
	{
		if (isset($deliverytype["insure"])&&($deliverytype["insure"]=='1'))$deliverytype["insure"]=true; else $deliverytype["insure"]=false;
		if (isset($deliverytype["supportcod"])&&($deliverytype["supportcod"]=='1'))$deliverytype["supportcod"]=true; else $deliverytype["supportcod"]=false;
		if (is_array($deliverytype)){
			$deliverytypeObj=new Deliverytype($deliverytype);
		}
		if ($deliverytypeObj instanceof Deliverytype){
			$data=$deliverytypeObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:配送方式的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Deliverytype::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:配送方式分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:配送方式分页查询列表
	 */
	public function queryPageDeliverytype($formPacket=null)
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
		$count=Deliverytype::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Deliverytype::queryPage($start,$limit,$condition);
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
	 * 批量上传配送方式
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."deliverytype" . DS . "import" . DS . "deliverytype$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Deliverytype::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $deliverytype) {
						$deliverytype=new Deliverytype($deliverytype);
						$deliverytype_id=$deliverytype->getId();
						if (!empty($deliverytype_id)){
							$hadDeliverytype=Deliverytype::get_by_id($deliverytype->getId());
							if ($hadDeliverytype!=null){
								$result=$deliverytype->update();
							}else{
								$result=$deliverytype->save();
							}
						}else{
							$result=$deliverytype->save();
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
	 * 导出配送方式
	 * @param mixed $filter
	 */
	public function exportDeliverytype($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Deliverytype::get($filter);
		$arr_output_header= self::fieldsMean(Deliverytype::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."deliverytype\\export\\deliverytype$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."deliverytype/export/deliverytype$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
