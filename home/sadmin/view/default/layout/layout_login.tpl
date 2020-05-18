<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    {include file="$templateDir/layout/normal/header.tpl"}
    <link rel="icon" href="favicon.ico" mce_href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="{$template_url}resources/css/public.css" />
    <link rel="stylesheet" href="{$template_url}resources/css/common.min.css">
    <script src="{$template_url}js/common/base.min.js"></script>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    {$viewObject->css_ready|default:""}
    {$viewObject->js_ready|default:""}
  </head>
  {php}
     flush();
  {/php}
  <body>
    {block name=body}{/block}
  </body>
</html>
