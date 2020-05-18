<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:品牌推荐商品<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceBproduct extends ServiceBasic
{
	/**
	 * 保存数据对象:品牌推荐商品
	 * @param array|DataObject $bproduct
	 * @return int 保存对象记录的ID标识号
	 */
	public function save($bproduct)
	{
		//查询出product_id 得到 brand_id 以及brandptype表 中的 brandptype_id
		$product_id = $bproduct['product_id'];
		$ptype_id = $bproduct['ptype_id'];

		$ptype = Ptype::get_by_id($ptype_id);
		$product=Product::get_by_id($product_id);
		$brand_id = $product->brand_id;

		$brandptype = Brandptype::get_one(array('ptype_id'=>$ptype_id,'brand_id'=>$brand_id));

		if(empty($brandptype)){

			$brandptype = new Brandptype();

			$brandptype->isShow = true;
			$brandptype->brand_id= $brand_id;
			$level = $ptype->level;
			switch ($level) {
			case 1:
				$brandptype->ptype_id = $ptype_id;
				$brandptype->ptype1_id= $ptype_id;
				$brandptype->ptype2_id= $ptype_id;
				break;
			case 2:
				$brandptype->ptype1_id= $ptype_id;
				$brandptype->ptype2_id= $ptype_id;

				$ptype_parent=Ptype::get_by_id($ptype->parent_id);
				$brandptype->ptype_id= $ptype_parent->ptype_id;
				break;
			case 3:
				$brandptype->ptype2_id= $ptype_id;
				$ptype_parent=Ptype::get_by_id($ptype->parent_id);
				$brandptype->ptype1_id= $ptype_parent->ptype_id;
				$ptype_parent_parent = Ptype::get_by_id($ptype_parent->parent_id);
				$brandptype->ptype_id= $ptype_parent_parent->ptype_id;
				break;
			}

			$brandptype->save();
		}

		$brandptype_id = $brandptype->brandptype_id;

		//保存
		$bp=new Bproduct();
		$bp->brandptype_id=$brandptype_id;
		$bp->product_id=$product_id;
		$bp->product_name=$product->name;
		$bp->product_price=$product->price;
		$bp->ico=$product->image;

		$data=$bp->save();
		return array(
			'success' => true,
			'data'    => $data
		);

	}

	/**
	 * 更新数据对象 :品牌推荐商品
	 * @param array|DataObject $bproduct
	 * @return boolen 是否更新成功；true为操作正常
	 */
	public function update($bproduct)
	{
		//查询出product_id 得到 brand_id 以及brandptype表 中的 brandptype_id        \
		$product_id = $bproduct['product_id'];
		$ptype_id = $bproduct['ptype_id'];
		$bproduct_id = $bproduct['bproduct_id'];

		$ptype = Ptype::get_by_id($ptype_id);
		$product=Product::get_by_id($product_id);
		$brand_id = $product->brand_id;

		$brandptype = Brandptype::get_one(array('ptype_id'=>$ptype_id,'brand_id'=>$brand_id));
		//if(!empty($brandptype))echo "hasit!!!!!!";
		if(empty($brandptype)){

			$brandptype = new Brandptype();

			$brandptype->isShow = true;
			$brandptype->brand_id= $brand_id;
			$level = $ptype->level;
			switch ($level) {
			case 1:
				$brandptype->ptype_id = $ptype_id;
				$brandptype->ptype1_id= $ptype_id;
				$brandptype->ptype2_id= $ptype_id;
				break;
			case 2:
				$brandptype->ptype1_id= $ptype_id;
				$brandptype->ptype2_id= $ptype_id;

				$ptype_parent=Ptype::get_by_id($ptype->parent_id);
				$brandptype->ptype_id= $ptype_parent->ptype_id;
				break;
			case 3:
				$brandptype->ptype2_id= $ptype_id;
				$ptype_parent=Ptype::get_by_id($ptype->parent_id);
				$brandptype->ptype1_id= $ptype_parent->ptype_id;
				$ptype_parent_parent = Ptype::get_by_id($ptype_parent->parent_id);
				$brandptype->ptype_id= $ptype_parent_parent->ptype_id;
				break;
			}

			$brandptype->save();
		}

		$brandptype_id = $brandptype->brandptype_id;
		//更新
		$bproduct = Bproduct::get_by_id($bproduct_id);
		$bp=new Bproduct($bproduct);
		$bp->bproduct_id=$bproduct_id;
		$bp->brandptype_id=$brandptype_id;
		$bp->product_id=$product_id;
		$bp->product_name=$product->name;
		$bp->product_price=$product->price;
		$bp->ico=$product->image;

		$data=$bp->update();
		$data = '1000';
		return array(
			'success' => true,
			'data'    => $data
		);
	}


	/**
	 * 上传品牌推荐商品图片文件
	 */
	public function uploadImg($files)
	{
		$diffpart=date("YmdHis");
		$result="";
		if (!empty($files["icoUpload"])&&!empty($files["icoUpload"]["name"])){
			$tmptail = end(explode('.', $files["icoUpload"]["name"]));
			$uploadPath =GC::$upload_path . "images" . DS . "bproduct" . DS . "$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath,"icoUpload");
			if ($result&&($result['success']==true)){
				$result['file_name']="bproduct/$diffpart.$tmptail";
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
	 * 根据主键删除数据对象:品牌推荐商品的多条数据记录
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
	 * 数据对象:品牌推荐商品分页查询
	 * @param stdclass $formPacket  查询条件对象
	 * 必须传递分页参数：start:分页开始数，默认从0开始
	 *                   limit:分页查询数，默认10个。
	 * @return 数据对象:品牌推荐商品分页查询列表
	 */
	public function queryPageBproduct($formPacket=null)
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
			foreach ($data as $bproduct) {
				$brandptype=Brandptype::get_by_id($bproduct->brandptype_id);
				$bproduct['brand_name']=$brandptype->brand->brand_name;
				$ptype = Ptype::get_by_id($brandptype->ptype2_id);
				$bproduct['ptype_name']= $ptype->name;
				$bproduct['ptype_id']=$brandptype->ptype2_id;
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
	 * 批量上传品牌推荐商品
	 * @param mixed $upload_file <input name="upload_file" type="file">
	 */
	public function import($files)
	{
		$diffpart=date("YmdHis");
		if (!empty($files["upload_file"])){
			$tmptail = end(explode('.', $files["upload_file"]["name"]));
			$uploadPath =GC::$attachment_path."bproduct".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."bproduct$diffpart.$tmptail";
			$result     =UtilFileSystem::uploadFile($files,$uploadPath);
			if ($result&&($result['success']==true)){
				if (array_key_exists('file_name',$result)){
					$arr_import_header = self::fieldsMean(Bproduct::tablename());
					$data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
					$result=false;
					foreach ($data as $bproduct) {
						$bproduct=new Bproduct($bproduct);
						$bproduct_id=$bproduct->getId();
						if (!empty($bproduct_id)){
							$hadBproduct=Bproduct::get_by_id($bproduct->getId());
							if ($hadBproduct!=null){
								$result=$bproduct->update();
							}else{
								$result=$bproduct->save();
							}
						}else{
							$result=$bproduct->save();
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
	 * 导出品牌推荐商品
	 * @param mixed $filter
	 */
	public function exportBproduct($filter=null)
	{
        if ($filter)$filter=$this->filtertoCondition($filter);
		$data=parent::get($filter);
		$arr_output_header= self::fieldsMean(Bproduct::tablename());
		unset($arr_output_header['updateTime']);
		unset($arr_output_header['commitTime']);
		$diffpart=date("YmdHis");
		$outputFileName=Gc::$attachment_path."bproduct".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."bproduct$diffpart.xls";
		UtilFileSystem::createDir(dirname($outputFileName));
		UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
		$downloadPath  =Gc::$attachment_url."bproduct/export/bproduct$diffpart.xls";
		return array(
			'success' => true,
			'data'    => $downloadPath
		);
	}
}
?>
