<!DOCTYPE html>
	<head>
	    <meta charset="utf-8">
	    <title>ECharts</title>
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