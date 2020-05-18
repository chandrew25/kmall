<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:优惠券实体表<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceCouponitems extends ServiceBasic
{
    /**
     * 保存数据对象:优惠券实体表
     * @param array|DataObject $couponitems
     * @return int 保存对象记录的ID标识号
     */
    public function save($couponitems)
    {
        if (isset($couponitems["isExchange"])&&($couponitems["isExchange"]=='1'))$couponitems["isExchange"]=true; else $couponitems["isExchange"]=false;
        if (is_array($couponitems)){
            $couponitemsObj=new Couponitems($couponitems);
        }
        if ($couponitemsObj instanceof Couponitems){
            $data=$couponitemsObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :优惠券实体表
     * @param array|DataObject $couponitems
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($couponitems)
    {
        if (isset($couponitems["isExchange"])&&($couponitems["isExchange"]=='1'))$couponitems["isExchange"]=true; else $couponitems["isExchange"]=false;
        if (is_array($couponitems)){
            $couponitemsObj=new Couponitems($couponitems);
        }
        if ($couponitemsObj instanceof Couponitems){
            $data=$couponitemsObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:优惠券实体表的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Couponitems::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:优惠券实体表分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:优惠券实体表分页查询列表
     */
    public function queryPageCouponitems($formPacket=null)
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
        $count=Couponitems::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Couponitems::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Couponitems::propertyShow($data,array('create_from'));
                foreach($data as $couponitems){
                    $couponitems->coupon_name=$couponitems->Coupon->coupon_name;
                    $couponlog=Couponlog::get_one("couponitems_key='$couponitems->couponitems_key'");
                    if($couponlog){
                        $order_id=$couponlog->order_id;
                        $order=Order::get_by_id($order_id);
                        $username=$order->member->username;
                        if(!$username){
                            $username="匿名";
                        }
                        $couponitems->exchange_info="用户名:".$username.",订单号:".$order->order_no.",兑换时间:".$couponlog->updateTime;
                    }else{
                        $couponitems->exchange_info="未兑换";
                    } 
                }
            }
            foreach ($data as $couponitems) {
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
     * 批量上传优惠券实体表
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."couponitems".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."couponitems$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Couponitems::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $couponitems) {
                        $couponitems=new Couponitems($couponitems);
                        if (!EnumCreateFrom::isEnumValue($couponitems->create_from)){
                            $couponitems->create_from=EnumCreateFrom::create_fromByShow($couponitems->create_from);
                        }
                        $couponitems_id=$couponitems->getId();
                        if (!empty($couponitems_id)){
                            $hadCouponitems=Couponitems::existByID($couponitems->getId());
                            if ($hadCouponitems!=null){
                                $result=$couponitems->update();
                            }else{
                                $result=$couponitems->save();
                            }
                        }else{
                            $result=$couponitems->save();
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
     * 导出优惠券实体表
     * @param mixed $filter
     */
    public function exportCouponitems($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Couponitems::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Couponitems::propertyShow($data,array('create_from'));
        }
        $arr_output_header= self::fieldsMean(Couponitems::tablename()); 
        foreach ($data as $couponitems) {
            if ($couponitems->create_fromShow){
                $couponitems['create_from']=$couponitems->create_fromShow;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."couponitems".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."couponitems$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."couponitems/export/couponitems$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>