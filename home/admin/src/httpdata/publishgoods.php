<?php 
require_once ("../../../../init.php"); 
$pageSize=15;
$gname   = !empty($_REQUEST['query'])&&($_REQUEST['query']!="?")&&($_REQUEST['query']!="？") ? trim($_REQUEST['query']) : "";
$gname   = !empty($_REQUEST['gname'])&&($_REQUEST['gname']!="?")&&($_REQUEST['gname']!="？") ? trim($_REQUEST['gname']) : "";
$goods_no   = !empty($_REQUEST['goods_no'])&&($_REQUEST['goods_no']!="?")&&($_REQUEST['goods_no']!="？") ? trim($_REQUEST['goods_no']) : "";
$goods_id   = !empty($_REQUEST['goods_id'])&&($_REQUEST['goods_id']!="?")&&($_REQUEST['goods_id']!="？") ? trim($_REQUEST['goods_id']) : "";
$roleid   = !empty($_REQUEST['roleid'])&&($_REQUEST['roleid']!="?")&&($_REQUEST['roleid']!="？") ? trim($_REQUEST['roleid']) : "";
$roletype   = !empty($_REQUEST['roletype'])&&($_REQUEST['roletype']!="?")&&($_REQUEST['roletype']!="？") ? trim($_REQUEST['roletype']) : "";
$isPublish   = !empty($_REQUEST['isPublish'])&&($_REQUEST['isPublish']!="?")&&($_REQUEST['isPublish']!="？") ? trim($_REQUEST['isPublish']) : "";
$app_id   = !empty($_REQUEST['app_id'])&&($_REQUEST['app_id']!="?")&&($_REQUEST['app_id']!="？") ? trim($_REQUEST['app_id']) : "";
$condition=array();

//根据访问ip获取app_id
$app_id_URL =ExtServiceApp::getIp();
if($app_id_URL != "-1"){
    $condition['app_id']=$app_id_URL;    
}
if (!empty($goods_no)){
    $condition["goods_no"]=$goods_no; 
}
if (!empty($goods_id)){
    $condition["goods_id"]=$goods_id; 
}
if (!empty($app_id)){
    $condition["app_id"]=$app_id; 
}
if (!empty($isPublish)){
    if($isPublish == 1){
        $condition["isPublish"]=true;     
    }                                       
}
if (!empty($roletype)){
    if($roletype == 5){
        $condition["roleid"]=$roleid;     
    }                                 
}
$start=0;
if (isset($_REQUEST['start'])){
    $start=$_REQUEST['start']+1;
}
$limit=$pageSize;
if (isset($_REQUEST['limit'])){
    $limit=$_REQUEST['limit']; 
    $limit= $start+$limit-1;
}
$arr['totalCount']= Publishgoods::count($condition);
$arr['publishgoodss']    = Publishgoods::queryPage($start,$limit,$condition);
foreach ($arr['publishgoodss'] as $publishgoods) {
    $goods=Goods::get_by_id($publishgoods->goods_id);
    $publishgoods['gname'] = $goods->gname;    

}
echo json_encode($arr);
?>
