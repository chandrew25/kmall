<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:品牌商品分类关系<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceBrandptype extends ServiceBasic
{
	/**
	 * 保存数据对象:品牌商品分类关系
	 * @param array|DataObject $brandptype
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($brandptype)
	{
		if (isset($brandptype["isShow"])&&($brandptype["isShow"]=='1'))$brandptype["isShow"]=true; else $brandptype["isShow"]=false;
		if (isset($brandptype["isRecommend"])&&($brandptype["isRecommend"]=='1'))$brandptype["isRecommend"]=true; else $brandptype["isRecommend"]=false;
		$level=Ptype::select_one('level',array("ptype_id"=>$brandptype['ptype_id']));
		switch ($level) {
		   case 1:
			 $brandptype["ptype1_id"]=$brandptype["ptype_id"];
			 $brandptype["ptype2_id"]=0;
			 break;
		   case 2:
			 $brandptype["ptype2_id"]=$brandptype["ptype_id"];
			 $ptype2=Ptype::get_by_id($brandptype["ptype_id"]);
			 if ($ptype1)$brandptype["ptype1_id"]=$ptype2->parent_id;
			 break;
		   case 3:
			 $ptype3=Ptype::get_by_id($brandptype["ptype_id"]);
			 if ($ptype3)$brandptype["ptype2_id"]=$ptype3->parent_id;
			 $ptype2=Ptype::get_by_id($brandptype["ptype2_id"]);
			 if ($ptype2)$brandptype["ptype1_id"]=$ptype2->parent_id;
			 break;
		}
		if (is_array($brandptype)){
			$brandptypeObj=new Brandptype($brandptype);
		}
		if ($brandptypeObj instanceof Brandptype){
			$data=$brandptypeObj->save();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 更新数据对象 :品牌商品分类关系
	 * @param array|DataObject $brandptype
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($brandptype)
	{
		if (isset($brandptype["isShow"])&&($brandptype["isShow"]=='1'))$brandptype["isShow"]=true; else $brandptype["isShow"]=false;
		if (isset($brandptype["isRecommend"])&&($brandptype["isRecommend"]=='1'))$brandptype["isRecommend"]=true; else $brandptype["isRecommend"]=false;
		$level=Ptype::select_one('level',array("ptype_id"=>$brandptype['ptype_id']));
		switch ($level) {
		   case 1:
			 $brandptype["ptype1_id"]=$brandptype["ptype_id"];
			 $brandptype["ptype2_id"]=0;
			 break;
		   case 2:
			 $brandptype["ptype2_id"]=$brandptype["ptype_id"];
			 $ptype2=Ptype::get_by_id($brandptype["ptype_id"]);
			 if ($ptype1)$brandptype["ptype1_id"]=$ptype2->parent_id;
			 break;
		   case 3:
			 $ptype3=Ptype::get_by_id($brandptype["ptype_id"]);
			 if ($ptype3)$brandptype["ptype2_id"]=$ptype3->parent_id;
			 $ptype2=Ptype::get_by_id($brandptype["ptype2_id"]);
			 if ($ptype2)$brandptype["ptype1_id"]=$ptype2->parent_id;
			 break;
		}
		if (is_array($brandptype)){
			$brandptypeObj=new Brandptype($brandptype);
		}
		if ($brandptypeObj instanceof Brandptype){
			$data=$brandptypeObj->update();
		}else{
			$data=false;
		}
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 根据主键删除数据对象:品牌商品分类关系的多条数据记录
	 * @param array|string $ids 数据对象编号
	 * 形式如下:
	 * 1.array:array(1,2,3,4,5)
	 * 2.字符串:1,2,3,4
	 * @return boolen 是否删除成功；true为操作正常
	 */
	public function deleteByIds($ids)
	{
		$data=Brandptype::deleteByIds($ids);
		return array(
			'success' => true,
			'data'    => $data
		);
	}

	/**
	 * 数据对象:品牌商品分类关系分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:品牌商品分类关系分页查询列表
	 */
	public function queryPageBrandptype($formPacket=null)
	{
		$start=1;
		$limit=10;
		$condition=UtilObject::object_to_array($formPacket);
		if(!empty($condition)){
			$brand_name=$condition['brand_id'];
			$brand=Brand::get_one(array("brand_name"=>$brand_name));
			$condition['brand_id']=$brand->brand_id;
		}
		if (isset($condition['start'])){
			$start=$condition['start']+1;
		  }
		if (isset($condition['limit'])){
			$limit=$condition['limit'];
			$limit=$start+$limit-1;
		}
		unset($condition['start'],$condition['limit']);
		$condition=$this->filtertoCondition($condition);
		$count=Brandptype::count($condition);
		if ($count>0){
			if ($limit>$count)$limit=$count;
			$data =Brandptype::queryPage($start,$limit,$condition);
			foreach ($data as $brandptype) {
				$brand=Brand::get_by_id($brandptype->brand_id);
				$brandptype['brand_name']=$brand->brand_name;
			}
			foreach ($data as $brandptype) {
				$ptype=Ptype::get_by_id($brandptype->ptype_id);
				$brandptype['name']=$ptype->name;
				$ptype=Ptype::get_by_id($brandptype->ptype1_id);
				$brandptype['ptype1_name']=$ptype->name;
				$ptype=Ptype::get_by_id($brandptype->ptype2_id);
				$brandptype['ptype2_name']=$ptype->name;
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
	 * 批量上传品牌商品分类关系
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."brandptype".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."brandptype$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Brandptype::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $brandptype) {
						$brandptype=new Brandptype($brandptype);
						$brandptype_id=$brandptype->getId();
						if (!empty($brandptype_id)){
							$hadBrandptype=Brandptype::get_by_id($brandptype->getId());
							if ($hadBrandptype!=null){
								$result=$brandptype->update();
							}else{
								$result=$brandptype->save();
							}
						}else{
							$result=$brandptype->save();
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
	 * 导出品牌商品分类关系
	 * @param mixed $filter
	 */
	public function exportBrandptype($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=Brandptype::get($filter);
		$arr_output_header= self::fieldsMean(Brandptype::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."brandptype".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."brandptype$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."brandptype/export/brandptype$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}

	/**
	* 根据product一键生成brandptype表
	*/
	public function saveToBrandptype()
	{
		$success=true;
		//选出所有的品牌
		$products_brand=Product::select("brand_id","1=1  group by brand_id","brand_id asc");
		foreach ($products_brand as $product_brand) {
			//选出所有的三级分类
			$products_ptype = Product::get("brand_id=".$product_brand->brand_id." group by ptype_id" );
			foreach($products_ptype as $product_ptype){
				//根据所有条件 查询是否存在
				$brandptype = Brandptype::get_one(array("brand_id"=>$product_ptype->brand_id,"ptype_id"=>$product_ptype->ptype_id,
					"ptype1_id"=>$product_ptype->ptype1_id,"ptype2_id"=>$product_ptype->ptype2_id));
				if(empty($brandptype)){
					$bp=new Brandptype();
					$bp->brand_id=$product_ptype->brand_id;
					$bp->ptype_id=$product_ptype->ptype_id;
					$bp->ptype1_id=$product_ptype->ptype1_id;
					$bp->ptype2_id=$product_ptype->ptype2_id;
					$flag=$bp->save();
					if($flag>0){
						$success=true;
					}else{
						$success=false;
						return array(
							'success' => $success,
							'msg'    => "品牌为'".$bp->brand_id."'的数据有误"
						);
					}
				}
			}
		}
		return array(
			'success' => $success,
			'msg'    => "成功"
		);
	}
}
?>
