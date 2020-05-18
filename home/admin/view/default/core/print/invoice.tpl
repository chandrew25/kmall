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
	margin: 5px;
	font-size: 24px;
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
						<td align="center"><h1>上海市乐乐商品销售统一发票<br/>发票联</h1></td>
						<td align="right" width="20%">发票号码:{$invoice_nos}</td>
					  </tr>
					  <tr>
						<td width="90%">顾客名称：{$order.ship_name}</td>
						<td align="right"> 日期：{$smarty.now|date_format:"%Y-%m-%d"} </td>
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
				<td width="16%">发票号</td>
				<td width="16%">发票抬头</td>
				<td align="right" width="33%">发票内容</td>
				<td align="right" width="12%">金额</td>
				<td align="right" width="6%">发票费用</td>
			  </tr>
			</tbody>
		  </table></td>
	  </tr>
	  <tr>
		<td class="td_frame1"><table align="center" border="0" cellpadding="0" cellspacing="0" width="98%">
			<tbody>            
			{foreach item=invoice from=$invoices name=invoicelist} 
			  <tr class="table_data_title">
				<td width="5%">{$smarty.foreach.invoicelist.index+1}</td>
				<td width="16%">{$invoice.invoice_code}</td>
				<td width="16%">{$invoice.header}</td>
				<td width="33%">{$invoice.content}</td>
				<td align="right" width="12%">￥{$invoice.price}</td>
				<td align="right" width="6%">{$invoice.fee}</td>
			  </tr> 
			{/foreach}        
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