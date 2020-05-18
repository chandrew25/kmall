<?php
$ptypeshows=Ptypeshow::get(array("showtype"=>3,"isshow"=>1),"sort_order desc",'0,3');
$ub=Gc::$url_base;
 

if( HttpSession::isHave('member_id') )
{
    $is_login=1;
    
    $member_id = HttpSession::get('member_id');
    
    $history_items = Seeproduct::get( array("member_id"=>$member_id) , "updateTime desc" , "0,3" );
    
    $is_new_history = Seeproduct::get( array("member_id"=>$member_id,"product_id"=>$product_id) );
    
}
                

$str='';
foreach ( $ptypeshows as $ptypeshow) {
    $str .=
    "       <li class='hot_product'>\r\n".
    "           <div class='hot_product_pic'>\r\n".
    "               <a href='".Gc::$url_base."index.php?go=kmall.product.view&product_id=".$ptypeshow->product_id."'>\r\n".
    "                    <img height='175px' width='157px' src='".Gc::$url_base."upload/images/".$ptypeshow->ico."'>\r\n".
    "               </a>\r\n".
    "           </div>\r\n".
    "           <div class='hot_product_name'>\r\n".
    "                <a href='".Gc::$url_base."index.php?go=kmall.product.view&product_id=".$ptypeshow->product_id."' title='".$ptypeshow->name."'>".$ptypeshow->getLongNameShow()."</a>\r\n".
    "           </div>\r\n".
    "           <div class='hot_product_price'><span class='original_price'>".$ptypeshow->market_price."</span>&nbsp;".$ptypeshow->price."/盒</div>\r\n".
    "       </li>\r\n"; 
}

//$str = str_replace("\r\n","<br />",$str);

$str2='';
if($is_login == 1)
{
    $str2.=
    "    <div id='history_list' class='border_color'>\r\n".
    "       <div id='history_title' class='content_title_bkgcolor'>最近浏览过的商品</div>\r\n".
    "       <div class='side_content_bkg_bar border_color'><!--细横条背景图片--></div>\r\n".
    "       <ul id='history_wrapper'>\r\n";
    foreach($history_items as $history)
    {
        $str2.=
    "           <li class='history border_color'>\r\n".                        
    "               <div class='history_pic'>\r\n".
    "                   <a href='".Gc::$url_base."index.php?go=kmall.product.view&product_id=".$history->product_id."'><img src='".Gc::$url_base."/upload/images/".$history->product_ico."'width='60px' height='80px' alt='".$history->product_name."' /></a>\r\n".
    "               </div>\r\n".
    "               <div class='history_name'>\r\n".
    "                   <span class='history_item_name'>\r\n".
    "                       <a href='".Gc::$url_base."index.php?go=kmall.product.view&product_id=".$history->product_id."' title='".$history->product_name."'>".$history->productNameShow."</a>\r\n".
    "                   </span>\r\n".
    "                   <span class='history_price'>￥".$history->price."/".$history->unit."</span>\r\n".
    "               </div>\r\n".
    "           </li>\r\n";           
    }
    $str2 .=
    "       </ul>\r\n".
                 
    "    </div>\r\n";    
}

   
echo <<<EOT
    <div id="hot_product_list" class="border_color">
        <div id="hot_product_title" class="content_title_bkgcolor">热销产品</div>
        <ul id="hot_product_wrapper" class="content_title_border_color">
    {$str}                
        </ul>
    {$str2}
    </div>
EOT;
    
?>
