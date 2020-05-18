<?php
    require_once ("../../../../init.php");
    $diffpart=date("YmdHis");
    if (!empty($_FILES["upload_file"])){
        //文件后缀名
        $tmptail = end(explode('.', $_FILES["upload_file"]["name"]));
        //文件路径
        $uploadPath =GC::$attachment_path."emailnumber".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."number$diffpart.$tmptail";
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
                $emailnumbers="";
                $errornumbers="";
                //去除号码前后的特殊字符
                foreach($txt as $email){
                    $emailnumber=trim($email);
                    //判断是否是11为数字号码
                    $ifemail = ereg("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+",$emailnumber);
                    if($ifemail){
                        $txtcheck[]=$emailnumber;
                    }elseif($emailnumber){
                        $texerror[]=$emailnumber;
                    }
                }

                //将不合法的邮箱号码连接成字符串
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
                foreach($txtunique as $email){
                    $txtcopy[]=$email;
                }
                //将正确的邮箱号码连接成字符串
                for($i=0;$i<count($txtcopy);$i++){
                    if(count($txtcopy)==1){
                        $emailnumbers=$emailnumbers.$txtcopy[$i];
                    }elseif($i<count($txtcopy)-1){
                        $emailnumbers=$emailnumbers.$txtcopy[$i].",";
                    }else{
                        $emailnumbers=$emailnumbers.$txtcopy[$i];
                    }
                }
                $flag=true;
                //判断是否存在正确的邮箱号码
                if($emailnumbers){
                    //判断是否存在不正确的号码
                    if($errornumbers){
                        $msg="上传成功,其中".$errornumbers."不是有效的邮箱号码!";
                    }else{
                        $msg="上传成功!";
                    }
                }else{
                    $msg="请上传正确格式的邮箱号码!";
                }
                $data=$emailnumbers;
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
