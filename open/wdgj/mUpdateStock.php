<?php
//测试地址:http://localhost/kmall/open/wdgj/index.php?uCode=123456&mType=mUpdateStock&GoodsNO=iLE5501-CW01-UF&BarCode=iLE5501-CW01-UF&Stock=100
/**
 * 接口名称:库存同步
 */
$admin_wdgj=Admin::wdgj();//网店管家的管理员标识

$GoodsNO=$data["GoodsNO"];//货品编号
$BarCode=$data["BarCode"];//货品条码(条码)
$Stock=$data["Stock"];//库存量

LogMe::log("********************库存同步开始*****************");
LogMe::log("********************库存同步参数为［GoodsNO:$GoodsNO,BarCode:$BarCode,Stock:$Stock］*****************");

$result= '<?xml version="1.0" encoding="gb2312"?>'."\r\n";
$result.= "<rsp>\r\n";
if ($GoodsNO&&$BarCode&&$Stock) {
	//$product=Product::get_one("product_code='".$GoodsNO."'");
    $goods=Goods::get_one("goods_code='$GoodsNO'");
	if ($goods) {
		//将已上架的商品数量和库存数量进行同步
		$goods->stock=$Stock;
		$goods->update();
        //货品所属商品
        $product=$goods->product;
        //仓库
		$warehouse=$product->defaultWarehouse();
		$warehouse_id=$warehouse->warehouse_id;
		$warehousegoods=Warehousegoods::get_one("goods_code='".$GoodsNO."' and warehouse_id='".$warehouse_id."'");

		if ($warehousegoods) {
			if (!$warehousegoods->num)$warehousegoods->num=0;
			$current_stock=$warehousegoods->num;
			if (!$warehousegoods->warehouse_id)$warehousegoods->warehouse_id=$warehouse->warehouse_id;
			$warehousegoods->num=$Stock;
			$warehousegoods->goods_id=$goods->goods_id;
			$warehousegoods->supplier_id=$product->supplier_id;
			if ($warehouse)$warehousegoods->warehouse_id=$warehouse->warehouse_id;
			$warehousegoods->update();
		} else {
			$warehousegoods=new Warehousegoods();
			$warehousegoods->goods_id=$goods->goods_id;
			$warehousegoods->goods_code=$GoodsNO;
			$warehousegoods->supplier_id=$product->supplier_id;
			if ($warehouse)$warehousegoods->warehouse_id=$warehouse->warehouse_id;
			$warehousegoods->num=$Stock;
			$warehousegoods->save();
		}
		//商品出入库日志
		$goodslog=new Goodslog();
		$goodslog->admin_id=$admin_wdgj->admin_id;
		$goodslog->goods_id=$goods->goods_id;
		$goodslog->operator=$admin_wdgj->realname;
		$goodslog->fsp_id=$product->supplier_id;
		$goodslog->fsp_warehouse=$warehouse->warehouse_id;
		$goodslog->price=$product->cost;
		$goodslog->num=$Stock;
		$goodslog->goodsActionType=EnumGoodsActionType::WDGJ_PD;

		$supplier_id=Supplier::channel_id();
		$warehouse=Warehouse::get_one(array("supplier_id"=>$supplier_id,"isDefault"=>"1"));
		$goodslog->tsp_id=$supplier_id;
		$goodslog->tsp_warehouse=$warehouse->warehouse_id;
		$goodslog->save();
		$result.="<result>1</result>";
	}else{
		$result.="<result>0</result><cause>该商品不存在</cause>";
	}
} else {
	$result.="<result>0</result><cause>缺少参数:GoodsNO:$GoodsNO,BarCode:$BarCode,Stock:$Stock</cause>";
}
LogMe::log("********************库存同步结束*****************");
$result.="</rsp>\r\n";
$result=str_replace("\r\n","",$result);
echo $result;
?>