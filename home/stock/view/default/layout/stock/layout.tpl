<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset={$encoding}">
		<title>美国纳斯达克OTC股票</title>
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
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/index.css">
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/common.min.css">
    <link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/normalize.css">
		<link rel="stylesheet" type="text/css"  href="{$template_url}resources/gzip.php?css={$template_url}resources/css/public.css">
		<script type="text/javascript" src="{$template_url}js/public.js"></script>
		<script type="text/javascript" src="{$template_url}js/common/bower.min.js"></script>

		<!--新增-->
		{$viewObject->css_ready|default:""}
		{$viewObject->js_ready|default:""}
	</head>
	{php}flush();{/php}
	<body style="-webkit-text-size-adjust: 100%!important;">
		<div id="wrapper">
			{include file="$templateDir/layout/stock/head.tpl"}
			{block name=body}{/block}
			{include file="$templateDir/layout/stock/foot.tpl"}
		</div>
	</body>
</html>
