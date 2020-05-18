<?php
    /**
    +---------------------------------------<br/>
    * 获取临时上传文件/商品图片
    +---------------------------------------
    * @category kmall
    * @package admin.src.httpdata
    * @author fxf 924197212@qq.com
    */
    require_once ("../../../../init.php");
    //上传图片路径
    $dir=Gc::$upload_path.'tempimages'.DIRECTORY_SEPARATOR;
    $product_id = !empty($_REQUEST['product_id'])&&($_REQUEST['product_id']!="?")&&($_REQUEST['product_id']!="？") ? trim($_REQUEST['product_id']) : "";
    $images=array();
    $count=0;
    if($product_id){
        //处理该商品的图片信息
        $main_img=Product::select_one('image',"product_id=".$product_id);
        $oimages=Seriesimg::get("product_id=".$product_id,"sort_order desc");
        $count=count($oimages);
        $images=array();
        foreach($oimages as $oimage){
            $image=new stdClass();
            $image->id=$oimage->seriesimg_id;
            $image->path=$oimage->image_large;
            $image->prepath="images/".$oimage->image_large;
            //缩略图路径
            $image->icopath=Gc::$upload_url."images/".$oimage->ico;
            //普通图片路径
            $image->norpath=Gc::$upload_url."images/".$oimage->img;
            //大图路径
            $image->larpath=Gc::$upload_url.$image->prepath;
            //是否显示
            $image->isShow=$oimage->isShow;
            //排序
            $image->sort_order=$oimage->sort_order;
            //是否主图
            $image->ismain=false;
            if (!empty($main_img)){
                $image->ismain=($main_img==$oimage->img);
            }
            $images[]=$image;
        }
    }else{
        //获取该文件夹下的所有jpg格式文件
        $oimages=UtilFileSystem::getFilesInDirectory($dir,array("jpg","gif",'png'));
        //删除临时文件
        if($oimages){
            UtilFileSystem::deleteFiles($oimages);
        }
        $count=0;
        $images="";
    }
    $arr['totalCount']= $count;
    $arr['images']    = $images;
    echo json_encode($arr);
?>
