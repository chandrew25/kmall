<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:订单发票<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceInvoice extends ServiceBasic
{
    /**
     * 保存数据对象:订单发票
     * @param array|DataObject $invoice
     * @return int 保存对象记录的ID标识号
     */
    public function save($invoice)
    {
        if (is_array($invoice)){
            $invoiceObj=new Invoice($invoice);
        }
        if ($invoiceObj instanceof Invoice){
            $invoiceObj->type=EnumInvoiceType::COMINVOICE;
            $invoiceObj->type1_header=EnumType1Header::OWNERS;
            $invoiceObj->type1_name= $invoice["header"];
            $data=$invoiceObj->save();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 更新数据对象 :订单发票
     * @param array|DataObject $invoice
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($invoice)
    {
        if (is_array($invoice)){
            $invoiceObj=new Invoice($invoice);
        }
        if ($invoiceObj instanceof Invoice){
            $invoiceObj->type=EnumInvoiceType::COMINVOICE;
            $invoiceObj->type1_header=EnumType1Header::OWNERS;
            $invoiceObj->type1_name= $invoice["header"];
            $data=$invoiceObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 根据主键删除数据对象:订单发票的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4 
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=Invoice::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        ); 
    }

    /**
     * 数据对象:订单发票分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:订单发票分页查询列表
     */
    public function queryPageInvoice($formPacket=null)
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
        $count=Invoice::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Invoice::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Invoice::propertyShow($data,array('invoice_state','type','type1_header'));
            }
            foreach ($data as $invoice) {
                if ($invoice->order_id){
                    $order_instance=Order::get_by_id($invoice->order_id);
                    $member_instance=Member::get_by_id($invoice->member_id);
                    $invoice['order_no']=$order_instance->order_no;
                    $invoice['ship_name']=$order_instance->ship_name;
                    $invoice['username']=$member_instance->username;
                    $invoice["header"]=  $invoice->type1_name;
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
     * 批量上传订单发票
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."invoice".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."invoice$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Invoice::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $invoice) {
                        if (!is_numeric($invoice["order_id"])){
                            $order=Order::get_one("ship_name='".$invoice["order_id"]."'");
                            if ($order) $invoice["order_id"]=$order->order_id;
                        }
                        $invoice=new Invoice($invoice);
                        if (!EnumInvoiceState::isEnumValue($invoice->invoice_state)){
                            $invoice->invoice_state=EnumInvoiceState::invoice_stateByShow($invoice->invoice_state);
                        }
                        if (!EnumInvoiceType::isEnumValue($invoice->type)){
                            $invoice->type=EnumInvoiceType::typeByShow($invoice->type);
                        }
                        if (!EnumType1Header::isEnumValue($invoice->type1_header)){
                            $invoice->type1_header=EnumType1Header::type1_headerByShow($invoice->type1_header);
                        }
                        $invoice_id=$invoice->getId();
                        if (!empty($invoice_id)){
                            $hadInvoice=Invoice::existByID($invoice->getId());
                            if ($hadInvoice!=null){
                                $result=$invoice->update();
                            }else{
                                $result=$invoice->save();
                            }
                        }else{
                            $result=$invoice->save();
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
     * 导出订单发票
     * @param mixed $filter
     */
    public function exportInvoice($filter=null)
    {
        if ($filter)$filter=$this->filtertoCondition($filter);
        $data=Invoice::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Invoice::propertyShow($data,array('invoice_state','type','type1_header'));
        }
        $arr_output_header= self::fieldsMean(Invoice::tablename()); 
        foreach ($data as $invoice) {
            if ($invoice->invoice_stateShow){
                $invoice['invoice_state']=$invoice->invoice_stateShow;
            }
            if ($invoice->typeShow){
                $invoice['type']=$invoice->typeShow;
            }
            if ($invoice->type1_headerShow){
                $invoice['type1_header']=$invoice->type1_headerShow;
            }
            if ($invoice->order_id){
                $order_instance=Order::get_by_id($invoice->order_id);
                $invoice['order_id']=$order_instance->ship_name;
            }
        }
        unset($arr_output_header['updateTime'],$arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."invoice".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."invoice$diffpart.xls"; 
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false); 
        $downloadPath  =Gc::$attachment_url."invoice/export/invoice$diffpart.xls"; 
        return array(
            'success' => true,
            'data'    => $downloadPath
        ); 
    }
}
?>