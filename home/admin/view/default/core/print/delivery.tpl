<!doctype html public "-//w3c//dtd xhtml 1.0 transitional//en" "http://www.w3.org/tr/xhtml1/dtd/xhtml1-strict.dtd">
<html lang="zh-cn" xml:lang="zh-cn" xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>配送单打印</title>
<meta content="text/html; charset=utf-8" http-equiv="content-type">
<style type="text/css" media="print">
.noprint {
	display: none
}
</style>
<style type="text/css" media="screen,print">
.x-barcode {
	padding-bottom: 0px;
	margin: 0px;
	padding-left: 0px;
	padding-right: 0px;
	padding-top: 0px
}
body {
	margin: 0px;
	font-family: 微软雅黑, arial, helvetica, sans-serif;
	font-size: 11px
}
.td_frame {
	border-bottom: #000000 2px solid;
	padding-bottom: 2px;
	padding-left: 0px;
	padding-right: 0px;
	padding-top: 2px
}
.td_frame1 {
	border-bottom: #000000 2px solid;
	border-bottom:1px dashed;
	padding-bottom: 15px;
	padding-left: 0px;
	padding-right: 0px;
	padding-top: 10px
}
img {
	border-bottom: 0px;
	border-left: 0px;
	padding-bottom: 2px;
	padding-left: 2px;
	padding-right: 2px;
	border-top: 0px;
	border-right: 0px;
	padding-top: 2px
}
p {
	margin: 5px 0px
}
h1 {
	margin: 0px;
	font-size: 14px;
	font-weight: bold
}
h2 {
	margin: 0px;
	font-size: 14px;
	font-weight: bold
}
.table_data_title {
	height: 25px;
	font-size: 12px;
}
.table_data_content {
	line-height: 20px;
	height: 20px
}
#print_confirm {
	position: absolute;
	background-color: #5473ae;
	width: 100%;
	height: 30px;
	border-top: #999999 1px solid;
	padding-top: 4px
}
#btn_print {
	background-image: url({$template_url}/resources/images/btn_print.gif);
	width: 71px;
	height: 24px;
	margin-left: auto;
	cursor: pointer;
	margin-right: auto
}
</style>
</head>
<body>
<div id="print">
  <table class="table_frame" align="center" border="0" cellpadding="0" cellspacing="0" width="95%">
	<tbody>
	  <tr>
		<td><table border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
			  <tr>
				<td class="td_frame"><table border="0" cellpadding="0" cellspacing="0" width="100%">
					<tbody>
					  <tr>
						<td><img src="home/admin/src/httpdata/barcode.php?order_no={$order.order_no}&codetype=code128" /></td>
					  </tr>
					  <tr>
						<td width="30%"> 订单号<strong>：{$order.order_no}</strong></td>
						<td width="20%">客户：{$order.ship_name}</td>
						<td width="20%">电话：{$order.ship_mobile}</td>
						<td align="right" width="30%"> 日期：{$order.ordertime|date_format:"%Y-%m-%d %H:%M"} </td>
					  </tr>
					</tbody>
				  </table></td>
			  </tr>
			</tbody>
		  </table></td>
	  </tr>
	  <tr>
		<td class="td_frame"><table align="center" border="0" cellpadding="0" cellspacing="0" width="98%">
			<tbody>
			  <tr>
				<td width="5%">序号</td>
				<td width="16%">货号</td>
				<td width="40%">商品名称</td>
				<td align="right" width="12%">单价</td>
        <td align="right" width="9%">券</td>
				<td align="right" width="6%">数量</td>
				<td align="right" width="12%">配货状态</td>
			  </tr>
			</tbody>
		  </table></td>
	  </tr>
	  <tr>
		<td class="td_frame1"><table align="center" border="0" cellpadding="0" cellspacing="0" width="98%">
			<tbody>
			{foreach item=eachgoods from=$ordergoods name=ordergoodslist}
			  <tr class="table_data_title">
				<td width="5%">{$smarty.foreach.ordergoodslist.index+1}</td>
				<td width="16%">{$eachgoods.goods_code}</td>
				<td width="40%">{$eachgoods.goods_name}</td>
				<td align="right" width="12%">￥{$eachgoods.price}</td>
        <td align="right" width="9%">{$eachgoods.jifen|default:0}</td>
				<td align="right" width="6%">{$eachgoods.nums}</td>
				<td align="right" width="12%"><div style="border-bottom: #000 1pt solid; border-left: #000 1pt solid; width: 10pt; height: 10pt; border-top: #000 1pt solid; border-right: #000 1pt solid"></div></td>
			  </tr>
			{/foreach}
			</tbody>
		  </table></td>
	  </tr>
	  <tr>
		<td class="td_frame"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
			<tbody>
			  <tr>
				<td style="height: 150px" valign="top" width="50%"><p>备注：{$order.intro}</p></td>
				<td valign="top" width="50%"><div id="print_address">
					<p>配送：{$order.deliverytype.name}</p>
					<p>收货人：{$order.ship_name}</p>
					<p>手机：{$order.ship_mobile}</p>
					<p>地区：{$order.addr}</p>
					<p>地址：﻿{$order.ship_addr}</p>
					<p>邮编：﻿{$order.ship_zipcode}</p>
					{if $order.member_no}
					<p>会员卡号：﻿{$order.member_no}</p>
					{/if}
				  </div></td>
			  </tr>
			</tbody>
		  </table></td>
	  </tr>
	  <tr>
		<td style="height: 40px"><h1>签字：</h1></td>
	  </tr>
	</tbody>
  </table>
</div>
<div id="print_confirm" class="noprint">
  <div id="btn_print" onclick="window.print()"></div>
</div>
</body>
</html>
