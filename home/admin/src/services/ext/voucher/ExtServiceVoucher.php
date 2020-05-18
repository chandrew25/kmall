<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:兑换券<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceVoucher extends ServiceBasic
{
    /**
     * 保存数据对象:兑换券
     * @param array|DataObject $voucher
     * @return int 保存对象记录的ID标识号
     */
    public function save($voucher)
    {
        if (isset($voucher["isValid"])&&($voucher["isValid"]=='1'))$voucher["isValid"]=true; else $voucher["isValid"]=false;
        if (isset($voucher["begin_time"]))$voucher["begin_time"]=UtilDateTime::dateToTimestamp($voucher["begin_time"]);
        if (isset($voucher["end_time"]))$voucher["end_time"]=UtilDateTime::dateToTimestamp($voucher["end_time"]);
        if (is_array($voucher)){
            $voucherObj=new Voucher($voucher);
            $voucherObj->voucher_num = 0;
        }
        if ($voucherObj instanceof Voucher){
            $data=$voucherObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :兑换券
     * @param array|DataObject $voucher
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($voucher)
    {
        if (isset($voucher["isValid"])&&($voucher["isValid"]=='1'))$voucher["isValid"]=true; else $voucher["isValid"]=false;
        if (isset($voucher["begin_time"]))$voucher["begin_time"]=UtilDateTime::dateToTimestamp($voucher["begin_time"]);
        if (isset($voucher["end_time"]))$voucher["end_time"]=UtilDateTime::dateToTimestamp($voucher["end_time"]);
        if (is_array($voucher)){
            $voucherObj=new Voucher($voucher);
        }
        if ($voucherObj instanceof Voucher){
            $data=$voucherObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:兑换券的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {      
        $idArr = explode(",",$ids);
        if($idArr){
            //没有关联删除日志表,暂时考虑如果该卡券类型已被正式使用过,不允许删除
            foreach($idArr as $voucher_id){
                $fliter = "voucher_id=".$voucher_id;
                Voucheritems::deleteBy($fliter);
                Vouchergoods::deleteBy($fliter);   
            }
        }
        $data  = Voucher::deleteByIds($ids);
        $linkdata = Voucheritems::deleteBy();
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:兑换券分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:兑换券分页查询列表
     */
    public function queryPageVoucher($formPacket=null)
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
        $count=Voucher::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Voucher::queryPage($start,$limit,$condition);
            if ($data==null){
                $data=array();
            }else{
                foreach($data as $voucher){
                    $voucher->begin_time=UtilDateTime::timestampToDateTime($voucher->begin_time);
                    $voucher->end_time=UtilDateTime::timestampToDateTime($voucher->end_time);
                    $goodsarr=Vouchergoods::select("goods_id","voucher_id='".$voucher->voucher_id."'");
                    $voucher->goodstr = implode(",",$goodsarr);
                }
            }
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
     * 导出兑换券
     * @param mixed $filter
     */
    public function exportVoucher($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Voucher::get($filter);
        $arr_output_header= self::fieldsMean(Voucher::tablename()); 
        foreach ($data as $voucher) {
            if ($voucher->begin_time)$voucher["begin_time"]=UtilDateTime::timestampToDateTime($voucher->begin_time);
            if ($voucher->end_time)$voucher["end_time"]=UtilDateTime::timestampToDateTime($voucher->end_time);
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."voucher".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."voucher$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."voucher/export/voucher$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>
