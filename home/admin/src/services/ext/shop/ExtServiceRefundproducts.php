<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:退款商品<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceRefundproducts extends ServiceBasic
{
    /**
     * 保存数据对象:退款商品
     * @param array|DataObject $refundproducts
     * @return int 保存对象记录的ID标识号
     */
    public function save($refundproducts)
    {
        if (is_array($refundproducts)){
            $refundproductsObj=new Refundproducts($refundproducts);
            if(!empty($refundproductsObj->refundTime)){
                $refundproductsObj->refundTime = UtilDateTime::dateToTimestamp($refundproductsObj->refundTime);
            }
        }
        if ($refundproductsObj instanceof Refundproducts){
            $data=$refundproductsObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :退款商品
     * @param array|DataObject $refundproducts
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($refundproducts)
    {
        if (is_array($refundproducts)){
            $refundproductsObj=new Refundproducts($refundproducts);
            if(!empty($refundproductsObj->refundTime)){
                $refundproductsObj->refundTime = UtilDateTime::dateToTimestamp($refundproductsObj->refundTime);
            }
        }
        if ($refundproductsObj instanceof Refundproducts){
            $data=$refundproductsObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键删除数据对象:退款商品的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Refundproducts::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:退款商品分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:退款商品分页查询列表
     */
    public function queryPageRefundproducts($formPacket=null)
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
        $count=Refundproducts::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Refundproducts::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Refundproducts::propertyShow($data,array('status'));
            }
            foreach ($data as $refundproducts) {
                $member=Member::get_by_id($refundproducts->member_id);
                $refundproducts['username']=$member->username;
                $product=Product::get_by_id($refundproducts->product_id);
                $refundproducts['name']=$product->name;
                $refundproducts['refundTime']=UtilDateTime::timestampToDateTime($refundproducts['refundTime']);
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
     * 批量上传退款商品
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."refundproducts" . DS . "import" . DS . "refundproducts$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Refundproducts::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $refundproducts) {
                        $refundproducts=new Refundproducts($refundproducts);
                        if (!EnumRefundproductsStatus::isEnumValue($refundproducts["status"])){
                            $refundproducts["status"]=EnumRefundproductsStatus::statusByShow($refundproducts["status"]);
                        }
                        $refundproducts_id=$refundproducts->getId();
                        if (!empty($refundproducts_id)){
                            $hadRefundproducts=Refundproducts::get_by_id($refundproducts->getId());
                            if ($hadRefundproducts!=null){
                                $result=$refundproducts->update();
                            }else{
                                $result=$refundproducts->save();
                            }
                        }else{
                            $result=$refundproducts->save();
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
     * 导出退款商品
     * @param mixed $filter
     */
    public function exportRefundproducts($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Refundproducts::get($filter);
        foreach ($data as $refundproducts) {
            $refundproducts->refundTime=UtilDateTime::timestampToDateTime($refundproducts->refundTime);
            $product_id = $refundproducts->product_id;
            if(!empty($product_id)){
                $product = Product::get_by_id($product_id);
                if(!empty($product)){
                    $refundproducts->product_id = $product->name;
                }
            }
            $member_id = $refundproducts->member_id;
            if(!empty($member_id)){
                $member = Member::get_by_id($member_id);
                if(!empty($member)){
                    $refundproducts->member_id = $member->username;
                }
            }
        }
        if ((!empty($data))&&(count($data)>0))
        {
            Refundproducts::propertyShow($data,array('status'));
        }
        $arr_output_header= self::fieldsMean(Refundproducts::tablename());
        unset($arr_output_header['refundproducts_id']);
        unset($arr_output_header['updateTime']);
        unset($arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."refundproducts" . DS . "export" . DS . "refundproducts$diffpart.xls";
        UtilFileSystem::createDir(dirname($outputFileName));
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."refundproducts/export/refundproducts$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }
}
?>
