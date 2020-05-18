<?php
require_once ("../../init.php");


$member_id = $_GET["id"];
$page      = $_GET["page"];
$size      = $_GET["size"];
$count     = 0;
$jifens    = array();

if ( !empty($member_id) ) {
    // $count  = Jifenlog::count("member_id = " . $member_id);
    $jifens_db = Jifenlog::queryPageByPageNo($page, "member_id = " . $member_id, $size);
    $count = $jifens_db["count"];
    $jifens_db = $jifens_db["data"];
    // LogMe::log($jifens_db);
    foreach ($jifens_db as $jifen_db) {
        $jifen = array();
        $jifen["id"] = $jifen_db->jifenlog_id;
        if ( !empty($jifen_db->jifenraise) ) {
            $jifen["jifen"] = $jifen_db->jifenraise;
            $jifen["action"] = 1;
        }
        if ( !empty($jifen_db->jifenreduce) ) {
            $jifen["jifen"] = $jifen_db->jifenreduce;
            $jifen["action"] = -1;
        }
        $jifen["intro"] = $jifen_db->discribe;
        $jifen["createTime"] = $jifen_db->updateTime;
        $jifens[] = $jifen;
    }
    // LogMe::log($jifens_db);
}


$result = array(
    "code" => 200,
    "errorMsg" => "",
    "result" => array(
        "counts" => $count,
        "jifens" => $jifens
    ),
);


echo json_encode($result);
