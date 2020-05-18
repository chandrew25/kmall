<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset={$encoding}">
		<title>{$site_name}</title>
		<!-- <link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/jquery.mobile-1.3.1.min.css" /> -->
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/public.css" />
		<script type="text/javascript" src="{$url_base}common/js/gzip.php?js={$url_base}common/js/ajax/jquery/jquery-1.7.1.min.js"></script>
		<!-- <script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/jquery.mobile-1.3.1.min.js"></script> -->
		<!-- <script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/mobiscroll.custom-2.5.0.min.js"></script> -->
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/public.js"></script>
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
	  	<script type="text/javascript">
		 	if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
				var version = parseFloat(RegExp.$1);
				if(version>2.3){
				  var phoneScale = parseInt(window.screen.width)/640;
				  document.write('<meta name="viewport" content="width=640, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
				}else{
				  document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
				}
			}else{
				document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
			}
		</script>
		<!--新增-->
		{$viewObject->css_ready|default:""}
		{$viewObject->js_ready|default:""}
	</head>
		{php}flush();{/php}
	<body>
		{include file="$templateDir/layout/home/head.tpl"}
		{block name=body}{/block}
		{include file="$templateDir/layout/home/foot.tpl"}
	</body>
</html>