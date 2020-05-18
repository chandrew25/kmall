<?php 
require_once ("../../../../init.php");
$where_clause = " from ".Goods::tablename()." a,".Warehousegoods::tablename()." b where b.num<=b.low_alarm and a.goods_id=b.goods_id";
$count = sqlExecute("select count(distinct a.goods_id)".$where_clause);
$package = sqlExecute("select distinct a.goods_id".$where_clause);
$package = "<font color=green>库存警报:</font> <font color=red>".$count."</font>";
$arr['totalcount'] = $count;
$arr['infos']      = $package;
echo json_encode($arr);
?>