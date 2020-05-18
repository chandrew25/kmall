<?php
//处理操作权限
require_once ("../../../../init.php");
$namespace=$_REQUEST['namespace'];
$admin=HttpSession::get("admin");
$arr=array();
$operationarr=array();
$operationxml=OperationGroup::allforjson();
if($admin->roletype!=0){
    $roleoperation=explode("-",$admin->operation);
    //相应命名空间的所有操作
    foreach($operationxml as $operation){
        if($operation->id==$namespace){
            foreach($operation->operations as $operate){
                $operationarr[$operate->gridname][]=$operate->id;
            }
        }
    }    
    foreach($operationarr as $key=>$value){
        foreach($value as $inkey=>$invalue){
            if(in_array($key."_".$invalue,$roleoperation)){
                unset($operationarr[$key][$inkey]);
            }
        }
    }
    foreach($operationarr as $key=>$value){
        foreach($value as $inkey=>$invalue){
            $final[$key][]=$invalue;
        }
    }
    $arr["operation"]=$final;
    $arr["limit"]=false;
}else{
    $arr["limit"]=false;
}
echo json_encode($arr);
?>
