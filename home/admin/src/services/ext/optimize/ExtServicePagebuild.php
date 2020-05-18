<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:页面处理<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServicePagebuild extends ServiceBasic
{
    /**
     * 首页生成
     */
    public function index($params)
    {
        $this->removemember();
        $html_dir=Gc::$nav_root_path;
        UtilFileSystem::createDir($html_dir);
        Gc::$url_base=UtilNet::urlbase();
        //是否显示耗时信息
        Gc::$dev_profile_on=true;
        //是否输出返回静态页面信息
        Dispatcher::$isOutputStatic=true;
        //是否在线优化:是否html文本压缩
        Gc::$is_online_optimize=true;
        $this->createOneStaticHtmlPage("kmall.index.index",$html_dir."index.html");

        $this->createOneStaticHtmlPage(
            "kmall.guide.lists",
            $html_dir."welcome.html"
        );
        return array(
            'success' => true,
            'data'    => $data
        );
    }
    /**
     * 全站生成
     */
    public function allstations($params)
    {
        $this->removemember();
        $html_dir=Gc::$nav_root_path."html".DIRECTORY_SEPARATOR."product".DIRECTORY_SEPARATOR;
        UtilFileSystem::createDir($html_dir);
        Gc::$url_base=UtilNet::urlbase();
        //是否显示耗时信息
        Gc::$dev_profile_on=true;
        //是否输出返回静态页面信息
        Dispatcher::$isOutputStatic=true;
        //是否在线优化:是否html文本压缩
        Gc::$is_online_optimize=true;
        //产品页
        $product_ids=Product::select("product_id",null,"product_id asc");
        for($i=0;$i<count($product_ids);$i++){
            //不生成55寸 7465块商品的静态页面
            if($product_ids[$i]!=641){
                $this->createOneStaticHtmlPage(
                    "kmall.product.view",
                    $html_dir."product_".$product_ids[$i].".html",
                    array("product_id"=>$product_ids[$i])
                );
            }
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }
    /**
     * 生成单个静态的页面
     * @param mixed $go
     * @param mixed $htmlfilename
     * @param mixed $go_param
     */
    function createOneStaticHtmlPage($go,$htmlfilename,$go_param=null)
    {
        $htmlcontent=$this->runphp($go,$go_param);
        $htmlcontent=$this->replaceProductDetailLink($htmlcontent);
        file_put_contents($htmlfilename,$htmlcontent);
    }
    /**
     * 替换商品详情链接
     */
    function replaceProductDetailLink($content)
    {
        if(!empty($content)){
            //首页
            $content=preg_replace("/index.php\\?go=kmall\\.index\\.index/im","index.html",$content);
            //产品页
            $content=preg_replace("/index.php\\?go=kmall\\.product\\.view&product_id=(\d+)/im","html/product/product_\\1.html",$content);
        }
        return $content;
    }
    /**
     * 运行动态php程序代码
     * @param mixed $go
     * @param mixed $pararm
     */
    function runphp($go,$pararm=null)
    {
        $_GET["go"]=$go;
        if (is_string($pararm)){
            $pararm=parse_str($pararm);
        }
        if (is_array($pararm)){
            foreach ($pararm as $key=>$value) {
                $_GET[$key]=$value;
            }
        }
        $result=Dispatcher::dispatch(new Router());
        if (!empty($result)){
            if (Gc::$is_online_optimize){
                if (contain($result,"<body")){
                    /************************start:整个Html页面去除注释，换行，空格********************/
                    $result=preg_replace("/<\!--(.*?)-->/","",$result);//去掉html里的注释
                    $result = preg_replace("~>\s+\n~",">",$result);
                    $result = preg_replace("~>\s+\r~",">",$result);
                    $result = preg_replace("~>\s+<~","><",$result);
                    $result=str_replace("\r\n","",$result);
                    /************************end  :整个Html页面去除注释，换行，空格********************/
                }
            }
        }
        return $result;
    }

    /**
     * 删除前台登录session
     */
    function removemember()
    {
        //删除前台登录状态
        HttpSession::init();
        HttpSession::remove("member_id");
    }
}
?>
