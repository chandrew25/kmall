<?php
 require_once ("../../init.php"); 
 $level1s=Ptype::select(array("ptype_id",'name','ico','show_in_nav'),"level=1",'sort_order desc'); 
 //print_r($level1s);
 $result="<ul id=\"menu\" class=\"theme_border_color_medium\">\r\n";
 for($i=0;$i<count($level1s);$i++){
    $level1=$level1s[$i];
    if ($i==(count($level1s)-1)){
        $result.="            <li class=\"menu_item last_menu_item theme_border_color_medium\">\r\n";  
    }else{
        $result.="            <li class=\"menu_item theme_border_color_medium\">\r\n"; 
    }                                    
    $result.="                <div class=\"menu_icon\"><img src=\"{\$url_base}/upload/images/{$level1->ico}\" alt=\"health_food\" /></div>\r\n";
    $result.="                <div class=\"menu_title\"><a href=\"index.php?go=ele.ptype.lists&ptype_id={$level1->ptype_id}\">{$level1->name}</a></div>\r\n"; 
//    $result.="                <div class=\"menu_title\">{$level1->name}</div>\r\n";       
    $result.="                <div class=\"menu_arrow\"><!--小箭头图片--></div>\r\n";
    //此处计算子菜单的高度，写入内联高度样式（共三处，此为第一处）
    $result.="                <div style=\"height:317px;\" class=\"submenu_content theme_border_color_medium";     	 
    if ($i<=5){
    	$result.="                 submenu_show_down ";
    }else{
    	$result.="                 submenu_show_up ";
    }          
    $result.="                \">\r\n";    	 
    if ($i<=5){
    	$result.="                    <div class=\"erase_conj_border\"><!--清除连接处的border--></div>\r\n"; 
    }else{
    	$result.="                    <div class=\"erase_conj_border erase_show_up\"><!--清除连接处的border--></div>\r\n"; 
    }
    //此处计算子菜单的高度，写入内联高度样式（共三处，此为第二处）
    $result.="                    <div style=\"height:315px;\" class=\"submenu_cat_wrapper theme_border_color_light\">\r\n";
    $result.="                        <div class=\"choose_cate\">请选择分类：</div>\r\n";      
    $level2s=Ptype::select(array("ptype_id",'name','ico','show_in_nav'),array("level"=>2,"parent_id"=>$level1->ptype_id),'sort_order desc');
    for($j=0;$j<count($level2s);$j++){             
        $result.="                        <ul class=\"submenu_cate_wrapper\">\r\n";
        $level2=$level2s[$j];
        $result.="                            <li class=\"submenu_cate_title\"><a href=\"index.php?go=ele.ptype.lists&ptype_id={$level2->ptype_id}\">{$level2->name}</a></li>\r\n";   
//        $result.="                            <li class=\"submenu_cate_title\">{$level2->name}</li>\r\n";   
        $level3s=Ptype::select(array("ptype_id",'name','ico','show_in_nav'),array("level"=>3,"parent_id"=>$level2->ptype_id),'sort_order desc');
        for($k=0;$k<count($level3s);$k++){  
            $level3=$level3s[$k];
            if ($k==0){
                $result.="                            <li class=\"submenu_cate\">";
            }else if ($k==(count($level3s)-1)){
                $result.="                            <li class=\"submenu_cate last_submenu_cate\">";    
            }else{
                $result.="                            <li class=\"submenu_cate\">";    
            }
            $result.="  <a href=\"index.php?go=ele.ptype.lists&ptype_id={$level3->ptype_id}\">{$level3->name}</a></li>\r\n";
        }
        $result.="                        </ul>\r\n";
    }
    $result.="                    </div>\r\n";  
             
    //此处计算子菜单的高度，写入内联高度样式（共三处，此为第三处）     
    $result.="                    <div style=\"height:315px;\" class=\"hot_brand_wrapper theme_border_color_light\">\r\n";          
    $result.="                        <div class=\"hot_brand\">热门品牌：</div>\r\n"; 
    $result.="                        <ul>\r\n";       
    
    $brandptypes=Brandptype::get("ptype1_id= '".$level1->ptype_id."' and isRecommend =true group by brand_id","","0,10");
    foreach ($brandptypes as $brandptype) {
      $brand=$brandptype->brand();
      $result.="                            <li><a href=\"{\$url_base}index.php?go=ele.brand.lists&brand_id={$brand->brand_id}\"><img src=\"{\$url_base}/upload/images/{$brand->brand_logo}\" width=\"90px\" height=\"44px\" alt=\"{$brand->brand_name}\"></a></li>\r\n";
    }                                  
    $result.="                        </ul>\r\n";          
    $result.="                    </div> \r\n";               
    $result.="                </div>\r\n";        
    $result.="            </li>\r\n";    
 }
$result.="       </ul>\r\n";
UtilFileSystem::createDir(Gc::$attachment_path);                                 
UtilFileSystem::save_file_content(Gc::$attachment_path.DIRECTORY_SEPARATOR."menu.tpl",$result);              

$result=str_replace(" ","&nbsp;",$result);                     
$result=str_replace("\r\n","<br />",$result); 
echo $result;
?>
