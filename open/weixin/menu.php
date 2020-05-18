<?php
/**
 * 创建菜单
 */
require_once("../../init.php");
require_once("access/Access.php");
require_once("menu/MenuManager.php");
//请求access_token
$accessToken=new AccessToken();
$accessToken->requestAccessToken();
echo "access_token: ".$accessToken->getAccess_token()."<br />";
echo "expires_in: 7200 seconds";
//创建菜单
$menuManager=new MenuManager();
$data=$menuManager->getJson_Menu();//微信自定义菜单json
echo "menu_json: ".$data."<br />";
$url=$menuManager->genMenuCreateUrl($accessToken->getAccess_token());//创建菜单请求地址
echo "create_menu_url: ".$url."<br />";
echo "return: ".UtilWeChat::curl_post($url,$data);//发送post请求
?>