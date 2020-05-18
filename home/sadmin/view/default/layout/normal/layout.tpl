<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    {include file="$templateDir/layout/normal/header.tpl"}
    <link rel="icon" href="{$url_base}favicon.ico" mce_href="favicon.ico" type="image/x-icon">
    {if $isDev}
    <link rel="stylesheet" href="{$template_url}resources/css/common.css">
    <script src="{$template_url}js/common/base.js"></script>
    {else}
    <link rel="stylesheet" href="{$template_url}resources/css/common.min.css">
    <script src="{$template_url}js/common/base.min.js"></script>
    {/if}
    <link rel="stylesheet" type="text/css" href="{$template_url}resources/css/public.css" />
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    {$viewObject->css_ready|default:""}
  </head>
  {php}
     flush();
  {/php}
  <body>
    {include file="$templateDir/layout/normal/navbar.tpl"}
    {block name=body}{/block}
    {$viewObject->js_ready|default:""}
  </body>
</html>
