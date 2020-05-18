<?php 
    require_once ("../../../../init.php");
    $diffpart=date("YmdHis");
    if (!empty($_FILES["upload_file"])){
        //文件后缀名
        $tmptail = end(explode('.', $_FILES["upload_file"]["name"]));
        //文件路径
        $uploadPath =GC::$attachment_path."phonenumber".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."number$diffpart.$tmptail";
        //上传文件至该路径
        $result     =UtilFileSystem::uploadFile($_FILES,$uploadPath);
        $data="";
        $msg="";
        //判断是否上传成功
        if ($result&&($result['success']==true)){
            if (array_key_exists('file_name',$result)){
                //将文件内容读取为数组
                $txt = file($uploadPath);
                $txtcheck = array();
                $phonenumbers="";
                $errornumbers="";
                //去除号码前后的特殊字符
                foreach($txt as $phone){
                    $phonenumber=trim($phone);
                    //判断是否是11为数字号码
                    if(strlen($phonenumber)==11&&UtilNumber::isNum($phonenumber)){
                        $txtcheck[]=$phonenumber;
                    }elseif($phonenumber){
                        $texerror[]=$phonenumber;
                    }
                }
                //将11的错误号码连接成字符串
                for($i=0;$i<count($texerror);$i++){
                    if(count($texerror)==1){
                        $errornumbers=$errornumbers.$texerror[$i];
                    }elseif($i<count($texerror)-1){
                        $errornumbers=$errornumbers.$texerror[$i].",";
                    }else{
                        $errornumbers=$errornumbers.$texerror[$i];
                    }
                }
                //筛选出唯一值
                $txtunique=array_unique($txtcheck);
                foreach($txtunique as $phone){
                    $txtcopy[]=$phone;
                }
                //将11的数字号码连接成字符串
                for($i=0;$i<count($txtcopy);$i++){
                    if(count($txtcopy)==1){
                        $phonenumbers=$phonenumbers.$txtcopy[$i];
                    }elseif($i<count($txtcopy)-1){
                        $phonenumbers=$phonenumbers.$txtcopy[$i].",";
                    }else{
                        $phonenumbers=$phonenumbers.$txtcopy[$i];
                    }
                }
                $flag=true;
                //判断是否存在11位数字号码
                if($phonenumbers){
                    //判断是否存在不正确的号码
                    if($errornumbers){
                        $msg="上传成功,其中".$errornumbers."不是有效的手机号码!";
                    }else{
                        $msg="上传成功!";
                    }
                }else{
                    $msg="请上传正确格式的手机号码!";
                }
                $data=$phonenumbers;
            }else{
                $flag=false;
            }
        }else{
            $flag=false;
        }
    }
    //返回数据
    $arr = array(
        'success' => $flag,
        'data'    => $data,
        'msg'     => $msg
    );
    echo json_encode($arr);
?>
