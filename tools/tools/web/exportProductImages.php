<?php
  /**
  * 设计思路:
  *     准备工作:从Excel文件里复制图片列到一个或多个文本文件
  *     逐行读取文本文件，在指定文件夹下把指定文件名的图片复制到输出文件夹下。
  */
require_once ("../../../init.php"); 
class UtilExportProductImages extends Util
{
    private static $txtDir;//导入图片列表的文本文件所在的路径
    private static $importDir;//导入商品图片的路径 
    private static $exportDir;//导出商品图片的路径
    
    private static $importDetailDir;//导入商品详情图片的路径
    private static $exportDetailDir;//导出商品详情图片的路径
    
    private static $countAllFiles;//导出商品图片的总计数
    private static $countActualFiles;//实际导出商品图片的总计数 
    
    private static $countAllDetailFiles;//导出商品详情图片的总计数
    private static $countActualDetailFiles;//实际导出商品详情图片的总计数 
   
    private static $detailReplaceDomainName=array(
        "http://bonli.cn/upload/userfiles/",
        "http://www.bonli.net/upload/userfiles/",
        "http://bonli.net/upload/userfiles/",
        "http://www.bonli.cn/upload/userfiles/"
        
    ); 

    private static $txtFileArr=array(
            "product.txt",
            "seriesimg.txt"
    );

    private static $txtDetailFileArr=array(
            "detail.txt",
    );    

    private static $noIdsArr=array();
    
    private static $noImagesArr=array();
    
    private static function init()
    {
        $outputPath=Gc::$upload_path."exportImages".DIRECTORY_SEPARATOR;
        self::$txtDir=$outputPath."report".DIRECTORY_SEPARATOR;
        UtilFileSystem::createDir(self::$txtDir);

        $outputPath.="output".DIRECTORY_SEPARATOR;
        self::$importDir=Gc::$upload_path."images".DIRECTORY_SEPARATOR;
        self::$exportDir=$outputPath."images".DIRECTORY_SEPARATOR;
        UtilFileSystem::createDir(self::$exportDir);
        
        self::$importDetailDir=Gc::$upload_path."userfiles".DIRECTORY_SEPARATOR;
        self::$exportDetailDir=$outputPath."userfiles".DIRECTORY_SEPARATOR;
        UtilFileSystem::createDir(self::$exportDetailDir);
    }
  
    public static function run()
    {      
        self::init();
        self::ready();
        self::exportImg();
        self::exportProductDetailImg();
        self::report();
    }

    public static function ready()
    {
        self::$noIdsArr=array();
        $product_ids=$_REQUEST["product_ids"];
        $product_ids=str_replace(array("'","\"",","), "",$product_ids);
        $ids_arr=preg_split("/[\s,]+/", $product_ids);
        $count=count($ids_arr);
        $productIds=array();
        $productImg=array();
        $seriesImgArr=array();
        $detailImg=array();
        if ($count>0){
            foreach ($ids_arr as $product_id) {
                if (!empty($product_id)){
                    $productIds[]=$product_id;
                    $product=Product::get_by_id($product_id);
                    if (empty($product))$product=Product::get_one("product_code='$product_id'");
                    if (empty($product)){
                        self::$noIdsArr[]=$product_id;
                    }else{
                        $productImg[]=$product->image;
                        $productImg[]=$product->image_large;
                        $detailImg[]=$product->intro;
                        $product_id=$product->product_id;
                        $seriesImgs=Seriesimg::get("product_id='$product_id'");
                        foreach ($seriesImgs as $seriesImg) {
                            $img=$seriesImg->ico;
                            $seriesImgArr[]=$img;
                            $img=$seriesImg->img;
                            $seriesImgArr[]=$img;
                            $img=$seriesImg->image_large;
                            $seriesImgArr[]=$img;
                        }
                    }
                }
            }
        }
        $content=implode("\r\n", $productIds);
        UtilFileSystem::save_file_content(self::$txtDir."ids.txt",$content);
        $content=implode("\r\n", $productImg);
        UtilFileSystem::save_file_content(self::$txtDir.self::$txtFileArr[0],$content);
        $content=implode("\r\n", $seriesImgArr);
        UtilFileSystem::save_file_content(self::$txtDir.self::$txtFileArr[1],$content);
        $content=implode("\r\n", $detailImg);
        UtilFileSystem::save_file_content(self::$txtDir.self::$txtDetailFileArr[0],$content);
    }
        
                                                                   
    private static function report()
    {       
        $result= "共计需要导出".self::$countAllFiles."张商品图片\r\n";
        $result.= "共计实际导出".self::$countActualFiles."张商品图片\r\n";                         
        $result.= "需导出的源图片路径:".self::$importDir."\r\n";
        $result.= "导出图片路径:".self::$exportDir."\r\n";                                                           
        $result.= "说明需导出的商品图片的文本文件路径:".self::$txtDir."\r\n";   
        foreach (self::$txtFileArr as $txtFile){
            $result.= "    ".$txtFile."\r\n";
        }                                                              
        $result.="\r\n\r\n";
        $result.= "共计需要导出".self::$countAllDetailFiles."张商品详情图片\r\n";
        $result.= "共计实际导出".self::$countActualDetailFiles."张商品详情图片\r\n";                         
        $result.= "需导出的源商品详情图片路径:".self::$importDetailDir."\r\n";
        $result.= "导出商品详情图片路径:".self::$exportDetailDir."\r\n";                                                         
        $result.= "说明需导出的商品详情图片的文本文件路径:".self::$txtDir."\r\n"; 
        
        foreach (self::$txtDetailFileArr as $txtFile){
            $result.= "    ".$txtFile."\r\n";
        }                                                                 
        $result.="\r\n\r\n";         
                                                                     
        $result.= "以下标识的商品未找到:"."\r\n"; 
        foreach (self::$noIdsArr as $noIds) {
            $result.= "    ".$noIds."\r\n";         
        }                             
        $result.= "以下文件未找到:"."\r\n"; 
        foreach (self::$noImagesArr as $noImages) {
            $result.= "    ".$noImages."\r\n";         
        }                          
        
        $result=str_replace("\r\n","<br/>",$result);
        $result=str_replace(" ","&nbsp;",$result);
        echo $result; 
    }                                                      

    private static function exportProductDetailImg()
    {
        self::$countAllDetailFiles=0;
        self::$countActualDetailFiles=0;
        foreach (self::$txtDetailFileArr as $txtFile) {
            $contents=file_get_contents(self::$txtDir.$txtFile);
            preg_match_all("/src=\"(\S+)\"/",$contents,$imgFileName, PREG_SET_ORDER);
            $countImgs=count($imgFileName);
            if ($countImgs<=0) {
                preg_match_all("/src=\"\"(\S+)\"\"/",$contents,$imgFileName, PREG_SET_ORDER);
            }
            
            foreach ($imgFileName as $imgName) {
                self::$countAllDetailFiles+=1;
                $imgName=$imgName[1];
                foreach (self::$detailReplaceDomainName as $detailDomainName) {
                    $imgName=str_replace($detailDomainName,"",$imgName);
                }                                                                 
                
                $fileName=self::$importDetailDir.$imgName;
                $fileName=str_replace("/",DIRECTORY_SEPARATOR,$fileName);
                if (file_exists($fileName)){
                    $exportFileName=self::$exportDetailDir.$imgName;
                    $exportFileName=str_replace("/",DIRECTORY_SEPARATOR,$exportFileName); 
                    if(is_dir($exportFileName)){
                        $exportFileDir=$exportFileName;
                    }else{ 
                        $exportFileDir=dirname($exportFileName);
                    }
                    UtilFileSystem::createDir($exportFileDir);
                    copy($fileName,$exportFileName); 
                    self::$countActualDetailFiles+=1;  
                }else{
                    self::$noImagesArr[]=$fileName;
                }    
            }
        }
    }         
    
    private static function exportImg()
    {      
        self::$countAllFiles=0;
        self::$countActualFiles=0;      
        foreach (self::$txtFileArr as $txtFile) {
            $contents=file_get_contents(self::$txtDir.$txtFile);            
            if (contain($contents,"\r\n")){
                $imgFileName=explode("\r\n",$contents); 
            }else{
                $imgFileName=explode("\n",$contents); 
            }
            foreach ($imgFileName as $imgName) {
                self::$countAllFiles+=1;
                $fileName=self::$importDir.$imgName;
                $fileName=str_replace("/",DIRECTORY_SEPARATOR,$fileName);
                if (file_exists($fileName)){
                    $exportFileName=self::$exportDir.$imgName;
                    $exportFileName=str_replace("/",DIRECTORY_SEPARATOR,$exportFileName); 
                    if(is_dir($exportFileName)){
                        $exportFileDir=$exportFileName;
                    }else{ 
                        $exportFileDir=dirname($exportFileName);
                    }
                    UtilFileSystem::createDir($exportFileDir);
                    copy($fileName,$exportFileName); 
                    self::$countActualFiles+=1;  
                }else{
                    self::$noImagesArr[]=$fileName;
                }
            }
        }                                                           
    }


    /**
     * 用户输入需求
     * @param 输入用户需求的选项
     */
    public static function UserInput($title)
    {
        /**
         * javascript文件夹选择框的两种解决方案,这里选择了第一种
         * @link http://www.blogjava.net/supercrsky/archive/2008/06/17/208641.html
         */
        echo  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                <html lang="zh-CN" xml:lang="zh-CN" xmlns="http://www.w3.org/1999/xhtml">';
        echo "<head>\r\n";
        echo UtilCss::form_css()."\r\n";
        echo "<script type='text/javascript' src='".$url_base."common/js/util/file.js'></script>";
        echo "</head>";
        echo "<body>";
        echo "<h1 align='center' style='padding:20px 0 0 180px;'>$title</h1>";
        echo "<div align='center' style='line-height:30px; height:90%;'>";
        echo "<form>";
        echo "<table style='width:90%;height:550px;' border='0' cellspacing='0' cellpadding='2'>";
        echo "  <tr><td width='120' align='right'>商品标识列表</td><td><textarea style='width:90%;height:440px;' cols='60' rows='35' name='product_ids' id='product_ids'></textarea>";
        echo "  </td></tr>";
        echo "  <tr><td colspan='2' align='center' width='100%'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input type='submit' value='导出' /></td></tr>";
        echo "</table>";
        echo "</form>";
        echo "</div>";
        echo "</body>";
        echo "</html>";
    }
}

if (isset($_REQUEST["product_ids"])&&!empty($_REQUEST["product_ids"]))
{    
    UtilExportProductImages::run();
}else{
    UtilExportProductImages::UserInput("批量导出商品图片");
}
?>                             
