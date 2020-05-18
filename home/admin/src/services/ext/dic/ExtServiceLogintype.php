<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:登录类型<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceLogintype extends ServiceBasic
{
    /**
     * 更新数据对象 :登录类型
     * @param array|DataObject $logintype
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($logintype)
    {
        if (!empty($_FILES)&&!empty($_FILES["icoUpload"]["name"])){
            $result=$this->uploadImg($_FILES,"icoUpload","ico");
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $logintype["ico"]= $result['file_name'];
                }
            }else{
                return $result;
            }
        }
        if (is_array($logintype)){
            $logintypeObj=new Logintype($logintype);
        }
        if ($logintypeObj instanceof Logintype){
            $data=$logintypeObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 上传登录类型图片文件
     */
    public function uploadImg($files,$uploadFlag,$upload_dir)
    {
        $diffpart=date("YmdHis");
        $result="";
        if (!empty($files[$uploadFlag])&&!empty($files[$uploadFlag]["name"])){
            $tmptail = end(explode('.', $files[$uploadFlag]["name"]));
            $uploadPath=GC::$upload_path."images".DIRECTORY_SEPARATOR."logintype".DIRECTORY_SEPARATOR.$upload_dir.DIRECTORY_SEPARATOR.$diffpart.".".$tmptail;
            $result=UtilFileSystem::uploadFile($files,$uploadPath,$uploadFlag);
            $isBuildNormal=UtilImage::thumb($uploadPath,$uploadPath,$tmptail,16,16,true,true);
            if ($result&&($result['success']==true)){
                $result['file_name']="logintype/$upload_dir/$diffpart.$tmptail";
            }else{
                return $result;
            }
        }
        return $result;
    }

    /**
     * 数据对象:登录类型分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认15个。
     * @return 数据对象:登录类型分页查询列表
     */
    public function queryPageLogintype($formPacket=null)
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
        $count=Logintype::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =Logintype::queryPage($start,$limit,$condition);
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        $xml=simplexml_load_file(Gc::$nav_root_path."open".DIRECTORY_SEPARATOR."login".DIRECTORY_SEPARATOR."logintype.xml");
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
    public function installLogintype($paymenttype_ids){
        return Logintype::updateProperties($paymenttype_ids,array("isShow"=>true));
    }

    /**
    * 卸载支付方式
    */
    public function unloadLogintype($paymenttype_ids){
        return Logintype::updateProperties($paymenttype_ids,array("isShow"=>false));
    }
}
?>
