<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:商品分类所属栏目<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePtcolumn extends ServiceBasic
{
	/**
	 * 保存数据对象:商品分类所属栏目
	 * @param array|DataObject $ptcolumn
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($ptcolumn)
	{
		$data=parent::save($ptcolumn);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :商品分类所属栏目
	 * @param array|DataObject $ptcolumn
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($ptcolumn)
	{
		$data=parent::update($ptcolumn);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:商品分类所属栏目的多条数据记录
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
	 * 数据对象:商品分类所属栏目分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:商品分类所属栏目分页查询列表
	 */
	public function queryPagePtcolumn($formPacket=null)
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
				Ptcolumn::propertyShow($data,array('column_type'));
			}
			foreach ($data as $ptcolumn) {
				$ptype=Ptype::get_by_id($ptcolumn->ptype_id);
				$ptcolumn['name']=$ptype->name;
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
	 * 批量上传商品分类所属栏目
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."ptcolumn".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."ptcolumn$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Ptcolumn::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $ptcolumn) {
						$ptcolumn=new Ptcolumn($ptcolumn);
						if (!EnumColumnType::isEnumValue($ptcolumn["column_type"])){
							$ptcolumn["column_type"]=EnumColumnType::column_typeByShow($ptcolumn["column_type"]);
						}
						$ptcolumn_id=$ptcolumn->getId();
						if (!empty($ptcolumn_id)){
							$hadPtcolumn=Ptcolumn::get_by_id($ptcolumn->getId());
							if ($hadPtcolumn!=null){
								$result=$ptcolumn->update();
							}else{
								$result=$ptcolumn->save();
							}
						}else{
							$result=$ptcolumn->save();
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
	 * 导出商品分类所属栏目
	 * @param mixed $filter
	 */
	public function exportPtcolumn($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		if ((!empty($data))&&(count($data)>0))
		{
			Ptcolumn::propertyShow($data,array('column_type'));
		}
		$arr_output_header= self::fieldsMean(Ptcolumn::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."ptcolumn".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."ptcolumn$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."ptcolumn/export/ptcolumn$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>