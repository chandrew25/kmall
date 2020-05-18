<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="zh-CN" xml:lang="zh-CN" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		{include file="$templateDir/layout/normal/header.tpl"}
		<meta http-equiv="cache-control" content="no-cache" />
		<link rel="icon" href="favicon.ico" mce_href="favicon.ico" type="image/x-icon">
		{$viewObject->css_ready|default:""}
		{$viewObject->js_ready|default:""}
		{* 此处原为本应用框架加载Ext必须加载的文件。先已通过Gzip动态加载生成。*}
	</head>
	{php}
	 flush();
	{/php}
	<body>
		{block name=body}{/block}
	</body>
</html>