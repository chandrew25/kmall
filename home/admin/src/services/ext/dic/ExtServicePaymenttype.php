<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:支付方式<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePaymenttype extends ServiceBasic
{
    /**
     * 更新数据对象 :支付方式
     * @param array|DataObject $paymenttype
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($paymenttype)
    {
        if (!empty($_FILES)&&!empty($_FILES["icoUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"icoUpload","ico");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $paymenttype["ico"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($paymenttype)){
            $paymenttypeObj=new Paymenttype($paymenttype);
        }
        if ($paymenttypeObj instanceof Paymenttype){
            $data=$paymenttypeObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }


    /**
     * 上传支付方式图片文件
     */
    public function uploadImg($files,$uploadFlag,$upload_dir)
    {
        $diffpart=date("YmdHis");
        $result="";
        if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
            $tmptail = end(explode('.', $files[$uploadFlag]["name"]));
            $uploadPath =GC::$upload_path."images".DIRECTORY_SEPARATOR."paymenttype".DIRECTORY_SEPARATOR.$upload_dir.DIRECTORY_SEPARATOR.$diffpart.".".$tmptail;
            $result=UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
            $info=UtilImage::getImageInfo($uploadPath);

            if ($result&&($result['success']==true)){
                $result['file_name']="paymenttype/$upload_dir/$diffpart.$tmptail";
            }else{
                return $result;
            }
        }
        return $result;
    }

    /**
     * 数据对象:支付方式分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:支付方式分页查询列表
     */
    public function queryPagePaymenttype($formPacket=null)
    {
        $data=Paymenttype::get();
        foreach ($data as $paymenttype) {
            if ($paymenttype->parent_id){
                $paymenttype_instance=Paymenttype::get_by_id($paymenttype->parent_id);
                $paymenttype['name_parent']=$paymenttype_instance->name;
                if ($paymenttype_instance){
                    $level=$paymenttype_instance->level;
                    $paymenttypeShowAll=$paymenttype_instance->name;
                    switch ($level) {
                       case 2:
                         $paymenttype=Paymenttype::get_by_id($paymenttype_instance->parent_id);
                         $paymenttypeShowAll=$paymenttype->name."->".$paymenttypeShowAll;
                         break;
                       case 3:
                         $paymenttype=Paymenttype::get_by_id($paymenttype_instance->parent_id);
                         $paymenttypeShowAll=$paymenttype->name."->".$paymenttypeShowAll;
                         $paymenttype=Paymenttype::get_by_id($paymenttype->parent_id);
                         $paymenttypeShowAll=$paymenttype->name."->".$paymenttypeShowAll;
                         break;
                    }
                    $paymenttype["paymenttypeShowAll"]=$paymenttypeShowAll;
                }
            }
        }
        $count=count($data);
        $xml=simplexml_load_file(Gc::$nav_root_path."module".DIRECTORY_SEPARATOR."plugins".DIRECTORY_SEPARATOR."pay".DIRECTORY_SEPARATOR."payments.xml");
        return array(
            'xml'=>$xml,
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
    * 安装支付方式
    */
    public function installPaymenttype($paymenttype_ids){
        return Paymenttype::updateProperties($paymenttype_ids,array("issetup"=>true));
    }

    /**
    * 卸载支付方式
    */
    public function unloadPaymenttype($paymenttype_ids){
        return Paymenttype::updateProperties($paymenttype_ids,array("issetup"=>false));
    }


}
?>
