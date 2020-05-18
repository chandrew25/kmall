<?php
    require_once ("../../../../init.php");
    header('Content-type: text/html; charset='.Gc::$encoding);
    $request=$_POST;
    if($_FILES){
        $upload_file=$_FILES["image"]["name"];
        $path = Gc::$upload_path."images".DIRECTORY_SEPARATOR."pageindex".DIRECTORY_SEPARATOR;
        $tmptail = end(explode('.', $_FILES["image"]["name"])); 
        $temp_name =date("YmdHis").".".$tmptail;
        $check = move_uploaded_file($_FILES["image"]["tmp_name"],$path.$temp_name);
        if($check){
            $url = Gc::$upload_url."images/pageindex/".$temp_name;
            Indexpage::updateProperties($request["indexpage_id"],"image='$url'");
        }
    }
    $indexpage = new Indexpage($request);
    $indexpage->update();
    $image = Indexpage::get_by_id($request["indexpage_id"]);
    echo json_encode($image); 
?>