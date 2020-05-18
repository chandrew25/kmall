<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset={$encoding}">
		<title>{$site_name}</title>
		<!--新增-->
		<meta HTTP-EQUIV="pragma" CONTENT="no-cache">
		<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate">
		<meta HTTP-EQUIV="expires" CONTENT="0">
		<meta name="apple-touch-fullscreen" content="yes" />
		<meta name="format-detection" content="telephone=no" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		<meta http-equiv="Expires" content="-1" />
		<meta http-equiv="pragram" content="no-cache" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=0, maximum-scale=1.0" />
		<link rel="icon" href="{$url_base}favicon.ico" mce_href="favicon.ico" type="image/x-icon">
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/reset.css">
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/index.css">
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/swiper.min.css">
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/jquery-1.11.3.min.js" ></script>
		<script type="text/javascript">
			// if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
			// 	var version = parseFloat(RegExp.$1);
			// 	if(version>2.3){
			// 	  var phoneScale = parseInt(window.screen.width)/640;
			// 	  document.write('<meta name="viewport" content="width=640, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
			// 	}else{
			// 	  document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
			// 	}
			// }else{
			// 	document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
			// }
		</script>
		<!--新增-->
		{$viewObject->css_ready|default:""}
		{$viewObject->js_ready|default:""}
	</head>
	{php}flush();{/php}
	<body style="-webkit-text-size-adjust: 100%!important;">
		<div id="wrapper">
			{include file="$templateDir/layout/home/head.tpl"}
			{block name=body}{/block}
			{include file="$templateDir/layout/home/foot.tpl"}
		</div>
		<div id="back_top">
			<a href="#"><img src="{$template_url}resources/images/xqq/the_top.png" /></a>
		</div>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/rem.js" ></script>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/swiper.min.js" ></script>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/index.js" ></script>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/top.js" ></script>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/menu.js" ></script>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/login.js"></script>
	</body>
</html>
