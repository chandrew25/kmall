<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:兑换券规则作用商品表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceVouchergoods extends ServiceBasic
{
    /**
     * 数据对象:兑换券规则作用商品表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:兑换券规则作用商品表分页查询列表
     */
    public function queryPageVouchergoods($formPacket=null)
    {
        $start=1;
        $limit=15;
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
        $count=Vouchergoods::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Vouchergoods::queryPage($start,$limit,$condition);
            foreach ($data as $vouchergoods) {
                $voucher = $vouchergoods->voucher;
                $goods  =  $vouchergoods->goods;
                if($voucher)$vouchergoods['voucher_name']=$voucher->voucher_name;
                if ($goods){
                    $vouchergoods['goods_name']=$goods->goods_name;
                    $vouchergoods['goods_code']=$goods->goods_code;
                    $vouchergoods['isUp']=$goods->isUp;
                }
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
     * 数据对象:优惠券关联货品分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:作用货品分页查询列表
     */
    public function queryPageSelGoods($formPacket=null){
        $start=1;
        $limit=15;
        $condition=UtilObject::object_to_array($formPacket);
        /**0:全部,1:已选择,2:未选择*/
        if (isset($condition["selectType"]))$selectType=$condition["selectType"];else $selectType=0;
        unset($condition["selectType"]);
        if (isset($condition['start']))$start=$condition['start'];
        if (isset($condition['limit']))$limit=$condition['limit']; 
        unset($condition['start'],$condition['limit']);
        if (isset($condition['selgoods']))$selgoods=$condition['selgoods'];
        if (!$selgoods){
            $selgoods = "''";
        }
        //$condition=$this->filtertoCondition($condition);
        //输入为数字是,不会做like 查询
        $goods_name = $condition["goods_name"];
        $condition  = "goods_name like '%$goods_name%'";

        switch ($selectType) {
            case 0:
                $count=Goods::count($condition);
                break;
            case 1:
                $sql_count="select count(1) from ".Goods::tablename()." where goods_id in (".$selgoods.")";
                if (!empty($condition))$sql_count.=" and ".$condition;
                $count=sqlExecute($sql_count);
                break;
            case 2:
                $sql_count="select count(1) from ".Goods::tablename()." where goods_id not in (".$selgoods.")";
                if (!empty($condition))$sql_count.=" and ".$condition;
                $count=sqlExecute($sql_count);
                break;
        }
        
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $order_by = "a.goods_id desc";
            switch ($selectType) {
                case 0:
                    //$startPoint = $start + 1;//$startPoint从1开始计数
                    //$endPoint   = $start + $limit;//$endPoint为$start+$limit
                    //$data = Goods::queryPage($startPoint,$endPoint,$condition,$order_by);
                    $sql_data="select a.*,b.name ptype_name from ".Goods::tablename()." a,".Ptype::tablename()." b where a.ptype_id=b.ptype_id";
                    if (!empty($condition))$sql_data.=" and a.".$condition;
                    $sql_data.=" order by ".$order_by;
                    $sql_data.=" limit $start,$limit";
                    $data=sqlExecute($sql_data,true);
                    break;
                case 1:
                    $sql_data="select a.*,b.name ptype_name from ".Goods::tablename()." a,".Ptype::tablename()." b where goods_id in (".$selgoods.") and a.ptype_id=b.ptype_id";
                    if (!empty($condition))$sql_data.=" and a.".$condition;
                    $sql_data.=" order by ".$order_by;
                    $sql_data.=" limit $start,$limit";
                    $data=sqlExecute($sql_data,true);
                    break;
                case 2:
                    $sql_data="select a.*,b.name ptype_name from ".Goods::tablename()." a,".Ptype::tablename()." b where goods_id not in (".$selgoods.") and a.ptype_id=b.ptype_id";
                    if (!empty($condition))$sql_data.=" and a.".$condition;
                    $sql_data.=" order by ".$order_by;
                    $sql_data.=" limit $start,$limit";
                    $data=sqlExecute($sql_data,true);
                    break;
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
     * 更新卡券关联货品
     * @param stdclass $formPacket 查询条件对象
     * @return 操作结果对象:
     */
    public function updateLinkGoods($condition){
        //$selData:选中货品 ；$oldData:已选货品,状态标识active为false,则其在此次操作被取消 ；$voucher_id:卡券ID
        if (isset($condition->selData))$selData=$condition->selData;else $selData=null;
        if (isset($condition->oldData))$oldData=$condition->oldData;else $oldData=null;
        if (isset($condition->voucher_id))$voucher_id=$condition->voucher_id;else $voucher_id=null;
        $success  = false;
        $addcount = 0;//新增计数
        $delcount = 0;//取消计数
        if($voucher_id){
            $oldRetainArr = array();//保留的已关联货品
            //处理已关联的货品 
            if($oldData){
                foreach($oldData as $okey=>$ovalue){
                    if(!$ovalue->active){
                        $filter = array(
                            'voucher_id' => $voucher_id,
                            'goods_id'   => $okey
                        );
                        Vouchergoods::deleteBy($filter);
                        $delcount++;
                    }else{
                        $oldRetainArr[] = $okey;
                    }
                }
            }
            if($selData){
                $selArr = array();//选择的货品
                //转为goods_id数组
                foreach($selData as $skey=>$svalue){
                    $selArr[] = $skey;
                }
                $insertArr = array_diff($selArr,$oldRetainArr);//需新插入的货品
                if($insertArr){
                    foreach($insertArr as $goods_id){
                        $goods = Goods::get_by_id($goods_id);
                        if($goods){
                            $vouchergoods = new Vouchergoods();
                            $vouchergoods->voucher_id = $voucher_id;
                            $vouchergoods->goods_id   = $goods_id;
                            $vouchergoods->isValid    = true;
                            $vouchergoods->save();
                            $addcount++;
                        }                     
                    }
                }
            }
            $success = true;
        }
        return array(
            'success' => $success,
            'add'     => $addcount,
            'del'     => $delcount
        );
    }
}
?>