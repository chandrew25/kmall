<?php
/**
 * 仅供使用Smarty模板开发使用生成全网站静态
 */
require_once ("../../../init.php"); 

/**
 * 是否显示耗时信息 
 */
Gc::$dev_profile_on=true;
$html_dir=Gc::$nav_root_path."html".DIRECTORY_SEPARATOR;
UtilFileSystem::createDir($html_dir);
Gc::$url_base=UtilNet::urlbase();
/**
 * 是否输出返回静态页面信息 
 */
Dispatcher::$isOutputStatic=true;
/**
 * 是否在线优化:是否html文本压缩 
 */
Gc::$is_online_optimize=true;
	/*
	//二级页
	$ptype_ids=Ptype::select("ptype_id",null,"ptype_id asc");
	$ptype_ids[]=0;
	$brand_ids=Brand::select("brand_id",null,"brand_id asc");
	$brand_ids[]=0;
	$minjifen_range=0;
	$maxjifen_range=6;
	$minsorting=1;
	$maxsorting=4;
	for($ii=count($ptype_ids)-1;$ii>=0;$ii--){
		$ptype_id=$ptype_ids[$ii];
		for($jj=count($brand_ids)-1;$jj>=0;$jj--){
			$brand_id=$brand_ids[$jj];
			$count=Product::count("ptype_id=$ptype_id and brand_id=$brand_id");
			$pagesize=25;//分页数量
			$pagecount=$count==0?0:($count-1)/$pagesize+1;
			for($jifen_range=$minjifen_range;$jifen_range<=$maxjifen_range;$jifen_range++){
				for($sorting=$minsorting;$sorting<=$maxsorting;$sorting++){
					for($pageNo=1;$pageNo<=$pagecount;$pageNo++){
						createOneStaticHtmlPage("bonli.ptype.lists",$html_dir."ptype".DIRECTORY_SEPARATOR."ptype_".$ptype_id."_".$brand_id."_".$jifen_range."_".$sorting."_0"."_".$pageNo.".html",
												array(
													"ptype_id"=>$ptype_id,
													"brand_id"=>$brand_id,
													"jifen_range"=>$jifen_range,
													"sorting"=>$sorting,
													"orderby"=>0,
													"pageNo"=>$pageNo
													)
												);
						createOneStaticHtmlPage("bonli.ptype.lists",$html_dir."ptype".DIRECTORY_SEPARATOR."ptype_".$ptype_id."_".$brand_id."_".$jifen_range."_".$sorting."_1"."_".$pageNo.".html",
												array(
													"ptype_id"=>$ptype_id,
													"brand_id"=>$brand_id,
													"jifen_range"=>$jifen_range,
													"sorting"=>$sorting,
													"orderby"=>1,
													"pageNo"=>$pageNo
													)
												);
						die();
					}
				}
			}
		}
	}
	*/
	///*
	//产品
	$product_ids=Product::select("product_id");
	foreach($product_ids as $product_id){
		createOneStaticHtmlPage("bonli.product.view",$html_dir."product".DIRECTORY_SEPARATOR."product_$product_id.html",array("product_id"=>$product_id));
	}
	//*/
	/*
	//首页
	createOneStaticHtmlPage("bonli.index.index",$html_dir."index.html");
	//商城
	createOneStaticHtmlPage("bonli.mall.view",$html_dir."mall.html");
	//积分
	$integralhelp_ids=Integralhelp::select("integralhelp_id",null,"integralhelp_id asc");
	for($i=0;$i<count($integralhelp_ids);$i++){
		$integralhelp_id=$integralhelp_ids[$i];
		createOneStaticHtmlPage("bonli.integralhelp.view",$html_dir."integralhelp".DIRECTORY_SEPARATOR."integralhelp_$integralhelp_id.html",array("id"=>$integralhelp_id));
	}
	//会员章程
	$memberhelp_ids=Memberhelp::select("memberhelp_id",null,"memberhelp_id asc");
	for($i=0;$i<count($memberhelp_ids);$i++){
		$memberhelp_id=$memberhelp_ids[$i];
		createOneStaticHtmlPage("bonli.memberhelp.view",$html_dir."memberhelp".DIRECTORY_SEPARATOR."memberhelp_$memberhelp_id.html",array("id"=>$memberhelp_id));
	}
	//帮派
	$bonpaihelp_ids=Bonpaihelp::select("bonpaihelp_id",null,"bonpaihelp_id asc");
	for($i=0;$i<count($bonpaihelp_ids);$i++){
		$bonpaihelp_id=$bonpaihelp_ids[$i];
		createOneStaticHtmlPage("bonli.bonpaihelp.view",$html_dir."bonpaihelp".DIRECTORY_SEPARATOR."bonpaihelp_$bonpaihelp_id.html",array("id"=>$bonpaihelp_id));
	}
	//服务
	$servicehelp_ids=Servicehelp::select("servicehelp_id",null,"servicehelp_id asc");
	for($i=0;$i<count($servicehelp_ids);$i++){
		$servicehelp_id=$servicehelp_ids[$i];
		createOneStaticHtmlPage("bonli.servicehelp.view",$html_dir."servicehelp".DIRECTORY_SEPARATOR."servicehelp_$servicehelp_id.html",array("id"=>$servicehelp_id));
	}
	//帮助中心
	$helpcenter_ids=Helpcenter::select("helpcenter_id",null,"helpcenter_id asc");
	for($i=0;$i<count($helpcenter_ids);$i++){
		$helpcenter_id=$helpcenter_ids[$i];
		createOneStaticHtmlPage("bonli.helpcenter.view",$html_dir."helpcenter".DIRECTORY_SEPARATOR."helpcenter_$helpcenter_id.html",array("id"=>$helpcenter_id));
	}
	*/
	/*
	if (Gc::$dev_profile_on){
		Profiler::init();
		Profiler::mark("生成首页");
		echo "/".str_repeat("*",40).UtilDateTime::now().":生成首页".str_repeat("*",40)."<br/>";
	}
	if (Gc::$dev_profile_on){
		Profiler::unmark("生成首页");
	}
	if (Gc::$dev_profile_on){
		Profiler::show();
	}
	*/
	echo "静态页面全部生成！";

/**
 * 生成单个静态的页面 
 * @param mixed $go
 * @param mixed $htmlfilename
 */
function createOneStaticHtmlPage($go,$htmlfilename,$go_param=null)
{
	$htmlcontent=runphp($go,$go_param); 
	$htmlcontent=replaceProductDetailLink($htmlcontent);
	file_put_contents($htmlfilename,$htmlcontent);
}

/**
 * 替换商品详情链接
 */
function replaceProductDetailLink($content)
{
	if(!empty($content)){
		//$content=preg_replace("/index.php[?]go=model.blog.view&blog_id=(\d+)/i","html/blog_\\1.html",$content);
		//首页
		$content=preg_replace("/index.php\\?go=bonli\\.index\\.index/im","html/index.html",$content);
		//商城
		$content=preg_replace("/index.php\\?go=bonli\\.mall\\.view/im","html/mall.html",$content);
		//产品
		$content=preg_replace("/index.php\\?go=bonli\\.product\\.view&product_id=(\d+)/im","html/product/product_\\1.html",$content);
		//二级页
		$content=preg_replace("/index.php\\?go=bonli\\.ptype\\.lists&ptype_id=(\d+)&brand_id=(\d+)&jifen_range=(\d+)&sorting=(\d+)&orderby=(\d+)&pageNo=(\d+)/im","html/ptype/ptype_\\1_\\2_\\3_\\4_\\5_\\6.html",$content);
		$content=preg_replace("/index.php\\?go=bonli\\.ptype\\.lists&ptype_id=(\d+)/im","html/ptype/ptype_\\1_0_0_4_0_1.html",$content);
		//积分
		$content=preg_replace("/index.php\\?go=bonli\\.integralhelp\\.view&id=(\d+)/im","html/integralhelp/integralhelp_\\1.html",$content);
		//会员章程
		$content=preg_replace("/index.php\\?go=bonli\\.memberhelp\\.view&id=(\d+)/im","html/memberhelp/memberhelp_\\1.html",$content);
		//帮派
		$content=preg_replace("/index.php\\?go=bonli\\.bonpaihelp\\.view&id=(\d+)/im","html/bonpaihelp/bonpaihelp_\\1.html",$content);
		//服务
		$content=preg_replace("/index.php\\?go=bonli\\.servicehelp\\.view&id=(\d+)/im","html/servicehelp/servicehelp_\\1.html",$content);
		//帮助中心
		$content=preg_replace("/index.php\\?go=bonli\\.helpcenter\\.view&id=(\d+)/im","html/helpcenter/helpcenter_\\1.html",$content);
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
?>

<?php
/**
 * 传统的生成全静态网站页面策略:访问网站得到静态html页面另存为指定策略的静态网页文件 
 */
/**
require_once ("../../../init.php"); 
$html_dir=Gc::$nav_root_path."html".DIRECTORY_SEPARATOR;
UtilFileSystem::createDir($html_dir);
$url_base=UtilNet::urlbase();
echo "/".str_repeat("*",40)."start:生成首页".str_repeat("*",40)."<br/>";
$htmlcontent=file_get_contents($url_base."index.php?go=model.index.index");
file_put_contents($html_dir."index.html",$htmlcontent);
echo "/".str_repeat("*",40)."end  :生成首页".str_repeat("*",40)."<br/>";
//header("location:".$url_base."html/index.html"); 
 */
?>