<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:产品出入库日志<br/>
 +---------------------------------------
 * @category yile
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceProductlog extends ServiceBasic
{
	/**
	 * 保存数据对象:产品出入库日志
	 * @param array|DataObject $goodslog
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($goodslog)
	{
		if (is_array($goodslog)){
			$goodslogObj=new Productlog($goodslog);
		}
		if ($goodslogObj instanceof Productlog){
			$goodslogObj->admin_id=HttpSession::get("admin_id");
			$data=$goodslogObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :产品出入库日志
	 * @param array|DataObject $goodslog
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($goodslog)
	{
		if (!EnumGoodsActionType::isEnumValue($goodslog["goodsActionType"])){
			$goodslog["goodsActionType"]=EnumGoodsActionType::goodsActionTypeByShow($goodslog["goodsActionType"]);
		}
		if (is_array($goodslog)){
			$goodslogObj=new Productlog($goodslog);
		}
		if ($goodslogObj instanceof Productlog){
			$data=$goodslogObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:产品出入库日志的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Productlog::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:产品出入库日志分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:产品出入库日志分页查询列表
	 */
	public function queryPageProductlog($formPacket=null)
	{
		$start=1;
		$limit=10;
		$filter_gat = "";
		$condition=UtilObject::object_to_array($formPacket);
		//根据条件判断该产品是入库还是出库
		if(isset($condition['goodsActionType'])){
			if($condition['goodsActionType']=="in"){
				$filter_gat = " and (goodsActionType = '0' or goodsActionType = '1') ";
				unset($condition['goodsActionType']);
			}else if($condition['goodsActionType']=="out"){
				$filter_gat = " and goodsActionType = '2' ";
				unset($condition['goodsActionType']);
			}
		}
		if (isset($condition['start'])){
			$start=$condition['start']+1;
		  }
		if (isset($condition['limit'])){
			$limit=$condition['limit'];
			$limit=$start+$limit-1;
		}
		unset($condition['start'],$condition['limit']);

		if (!empty($condition)&&(count($condition)>0)){
			$conditionArr=array();
			foreach ($condition as $key=>$value) {
				if (!UtilString::is_utf8($value)){
					$value=UtilString::gbk2utf8($value);
				}
				if (is_numeric($value)){
					$conditionArr[]=$key."='".$value."'";
				}else{
					$conditionArr[]=$key." like '%".$value."%'";
				}
			}
			$condition=implode(" and ",$conditionArr);
			$condition = $condition.$filter_gat;
		}
		HttpSession::init();
		$admin=HttpSession::get("admin");
		if ($admin&&($admin->roletype==EnumRoletype::SUPPLIER)&&$admin->seescope==EnumSeescope::SELF)
		{
			if (empty($condition)){
				$condition="fsp_id=".$admin->roleid." or tsp_id=".$admin->roleid;
			}else{
				$condition="(".$condition.") and (fsp_id=".$admin->roleid." or tsp_id=".$admin->roleid.")";
			}
		}
		$count=Productlog::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Productlog::queryPage($start,$limit,$condition);
			if ((!empty($data))&&(count($data)>0))
			{
				Productlog::propertyShow($data,array('goodsActionType'));
			}
			foreach ($data as $goodslog) {
				if ($goodslog->fsp_id){
					$supplier_instance=Supplier::get_by_id($goodslog->fsp_id);
					$goodslog['sp_name_fsp']=$supplier_instance->sp_name;
				}else{
					$supplier_instance=Supplier::get_by_id($goodslog->tsp_id);
					$goodslog['sp_name_fsp']=$supplier_instance->sp_name;
				}
				if ($goodslog->tsp_id){
					$supplier_instance=Supplier::get_by_id($goodslog->tsp_id);
					$goodslog['sp_name_tsp']=$supplier_instance->sp_name;
				}else{
					$goodslog['sp_name_tsp']="订单客户";
				}
				if ($goodslog->product_id){
					$goods_instance=Product::get_by_id($goodslog->product_id);
					$goodslog['product_name']=$goods_instance->product_name;
				}
				$goodslog['cmTime']=UtilDateTime::timestampToDateTime($goodslog->commitTime);
				unset($goodslog->real_fieldspec);
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
	 * 批量上传产品出入库日志
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."goodslog\\import\\goodslog$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Productlog::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $goodslog) {
						$goodslog=new Productlog($goodslog);
						if (!EnumGoodsActionType::isEnumValue($goodslog["goodsActionType"])){
							$goodslog["goodsActionType"]=EnumGoodsActionType::goodsActionTypeByShow($goodslog["goodsActionType"]);
						}
						$goodslog_id=$goodslog->getId();
						if (!empty($goodslog_id)){
							$hadProductlog=Productlog::get_by_id($goodslog->getId());
							if ($hadProductlog!=null){
								$result=$goodslog->update();
							}else{
								$result=$goodslog->save();
							}
						}else{
							$result=$goodslog->save();
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
	 * 导出产品出入库日志
	 * @param mixed $filter
	 */
	public function exportProductlog($filter=null)
	{
		if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Productlog::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Productlog::propertyShow($data,array('goodsActionType'));
		}
		$arr_output_header= self::fieldsMean(Productlog::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."goodslog\\export\\goodslog$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."goodslog/export/goodslog$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
