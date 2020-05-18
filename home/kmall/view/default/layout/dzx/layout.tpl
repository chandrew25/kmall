<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="zh-CN" xml:lang="zh-CN" xmlns="http://www.w3.org/1999/xhtml" xmlns:wb="http://open.weibo.com/wb">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset={$encoding}">
		<title>{$site_name}</title>
		<meta content="海鲜大礼包、炒货大礼包、员工福利、企业福利、大闸蟹、通兑券" name="keywords">
		<meta content="海鲜大礼包、炒货大礼包、员工福利、企业福利、大闸蟹、通兑券" name="description">
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="x-ua-compatible" content="ie=7" />
		<meta property="qc:admins" content="456716630706165316375" />
		<!--<link href="{$template_url}resources/gzip.php?css={$template_url}resources/css/public.css" rel="stylesheet" type="text/css" />-->
		<!--[if lte IE 6]>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/DD_belatedPNG.js"></script>
		<![endif]-->
		<script type="text/javascript" src="{$url_base}common/js/gzip.php?js={$url_base}common/js/ajax/jquery/jquery-1.7.1.min.js"></script>
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/public.js"></script>
		{if Gc::$website_status}
		<script type="text/javascript" src="{$template_url}resources/gzip.php?js={$template_url}js/public_static.js"></script>
		{/if}
		<script src="http://l.tbcdn.cn/apps/top/x/sdk.js?appkey=21393424"></script>
		<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=1194546082" type="text/javascript" charset="utf-8"></script>
        <SCRIPT LANGUAGE="JavaScript" src=http://float2006.tq.cn/floatcard?adminid=9525196&sort=0 ></SCRIPT>
		{$viewObject->css_ready|default:""}
		{$viewObject->js_ready|default:""}
	</head>
	{php}flush();{/php}
	<body>
		{if !$smarty.post.print_order}
			{include file="$templateDir/layout/dzx/head.tpl"}
		{/if}
		{block name=body}{/block}
		{if !$smarty.post.print_order}
			{if $smarty.get.go=='kmall.act.lists'}
			{include file="$templateDir/layout/dzx/actfoot.tpl"}
			{else}
			{include file="$templateDir/layout/dzx/foot.tpl"}
			{/if}
		{/if}
	</body>
</html>