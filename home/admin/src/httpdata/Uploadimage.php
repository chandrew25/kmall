<?php 
    /**
    +---------------------------------------<br/>
    * 上传图片
    +---------------------------------------
    * @category kmall
    * @package admin.src.httpdata
    * @author fxf 924197212@qq.com
    */
    require_once ("../../../../init.php");
    //定义上传文件路径
    $dir=Gc::$upload_path.'tempimages'.DIRECTORY_SEPARATOR;
    //文件名
    $diffpart=date("YmdHis");
    $success=true;
    $data="";
    $uploadFlag='image_Upload';
    if (!empty($_FILES[$uploadFlag])&&!empty($_FILES[$uploadFlag]["name"])){
        $tmptail = end(explode('.', $_FILES[$uploadFlag]["name"]));
        $uploadPath = $dir.$diffpart.".".$tmptail;
        $msg = UtilFileSystem::uploadFile($_FILES,$uploadPath,$uploadFlag);
        if ($msg&&($msg['success']==true)){
            $data->path=$msg['file_name'];
            $data->prepath="tempimages/".$data->path;
            $data->fullpath=Gc::$upload_url.$data->prepath;
            $data->isShow=1;
            $data->sort_order=50;
        }else{
            $success=false;
        }
    }
    $result=array(
        'success' => $success,
        'data'    => $data
    );
    echo json_encode($result);
?>
