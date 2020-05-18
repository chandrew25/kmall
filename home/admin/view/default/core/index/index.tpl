{extends file="$templateDir/layout/normal/layout.tpl"}
{block name=body}
	<div id="loading-mask"></div>
	<div id="loading">
		<div class="loading-indicator"><img src="{$url_base}common/js/ajax/ext/resources/images/extanim32.gif" width="32" height="32" style="margin-right:8px;" align="absmiddle"/>正在加载中...</div>
	</div>
	<div id="header" class='x-hide-display'>
		<table>
		  <tr>
			<td><img style="margin-left: 5px" src="{$url_base}home/kmall/view/default/resources/images/public/header/logo.png" width="150" height="60" /><span style="float:right; margin-top: 10px;margin-right: 10px;color: #CCC"><a href="{$url_base}index.php?go=admin.index.logout" style="padding:5px">退出</a></td>
		  </tr>
		</table>
	</div>
	{foreach item=menuGroup from=$menuGroups}
		<div id='{$menuGroup.id}' class="x-hide-display">
			{if ($menuGroup.lang neq "")}<div class="{$menuGroup.lang}">{/if}
				{foreach item=menu from=$menuGroup.menus}
					<p><a href="{$menu.address}" title="{$menu.title|default:$menu.name}" {if ($menu.lang neq "")}class="menuIcon {$menu.lang}"{else}class="menuIcon"{/if}>{$menu.name}</a></p>
				{/foreach}
			{if ($menuGroup.lang neq "")}</div>{/if}
		</div>
	{/foreach}
	<div id="centerArea" class="x-hide-display">
		<link href="{$url_base}home/admin/view/default/resources/gzip.php?css={$url_base}home/admin/view/default/resources/css/index.css" rel="stylesheet" type="text/css" />
		<!--[if lte IE 6]>
		<script type="text/javascript" src="{$url_base}home/admin/view/default/resources/gzip.php?js={$url_base}home/admin/view/default/js/DD_belatedPNG.js"></script>
		<![endif]-->
		<script type="text/javascript" src="{$url_base}home/admin/view/default/resources/gzip.php?js={$url_base}common/js/ajax/jquery/jquery-1.7.1.min.js"></script>
		<script type="text/javascript" src="{$url_base}home/admin/view/default/resources/gzip.php?js={$url_base}home/admin/view/default/js/index.js"></script>
		<div class="header container_width" id="deskheader">
			<div class="logo"></div>
			<ul class="list">
				<li class="txt">在线支付:</li>
				<a><li class="btn">下订单</li></a>
				<li class="right"></li>
				<a><li class="btn">财务审核</li></a>
				<li class="right"></li>
				<a><li class="btn">发&nbsp;&nbsp;货</li></a>
				<li class="right"></li>
				<a><li class="btn">收&nbsp;&nbsp;货</li></a>
				<li class="right"></li>
				<a><li class="btn">淘宝交易对账</li></a>
				<li class="right"></li>
				<a><li class="btn">订单完成</li></a>
			</ul>
			<ul class="list">
				<li class="txt">货到付款:</li>
				<a><li class="btn">下订单</li></a>
				<li class="right"></li>
				<a><li class="btn">发&nbsp;&nbsp;货</li></a>
				<li class="right"></li>
				<a><li class="btn">收&nbsp;&nbsp;货</li></a>
				<li class="right"></li>
				<a><li class="btn">货到结账付款</li></a>
				<li class="right"></li>
				<a><li class="btn">收&nbsp;&nbsp;款</li></a>
				<li class="right"></li>
				<a><li class="btn">订单完成</li></a>
			</ul>
		</div>
		<div class="contract container_width" id="contract">
			<div class="i t"></div>
		</div>
		<div class="main container_width">
			<div class="con" id="mcon">
				<div class="top" id="mctop">
					<ul class="list" id="txtlist">
						<a><li class="f"><div class="i i1"></div><div class="t">订单管理</div></li></a>
						<a><li><div class="i i2"></div><div class="t">会员管理</div></li></a>
						<a><li><div class="i i3"></div><div class="t">商品发布</div></li></a>
						<a><li><div class="i i4"></div><div class="t">进销存</div></li></a>
					</ul>
				</div>
				<div class="view">
					<ul class="list" id="imglist">
						<li class="i1">
							<a><div class="btn" style="left:197px; top:2px;">手工建单</div></a>
							<a><div class="btn" style="left:307px; top:2px;">在线建单</div></a>
							<a><div class="btn" style="left:658px; top:171px;">待发货</div></a>
							<a><div class="btn" style="left:659px; top:216px;">待支付</div></a>
							<a><div class="btn" style="left:658px; top:261px;">已完成</div></a>
							<a><div class="btn" style="left:467px; top:346px;">确认退货</div></a>
							<a><div class="btn" style="left:358px; top:346px;">确认支付</div></a>
							<a><div class="btn" style="left:249px; top:346px;">确认签收</div></a>
							<a><div class="btn" style="left:140px; top:346px;">确认发货</div></a>
							<a><div class="btn" style="left:63px; top:147px;">售后回访</div></a>
						</li>
						<li class="i2">
							<a><div class="btn" style="left:232px; top:0px;">网站注册</div></a>
							<a><div class="btn" style="left:654px; top:82px;">按品牌区分</div></a>
							<a><div class="btn" style="left:653px; top:171px;">按等级区分</div></a>
							<a>
							<div class="btn" style="left:232px; top:347px;">按订单分析</div></a>
							<a><div class="btn" style="left:63px; top:260px;">促销</div></a>
							<a><div class="btn" style="left:64px; top:82px;">活动</div></a>
						</li>
						<li class="i3">
							<a><div class="btn" style="left:197px; top:2px;">新产品入库</div></a>
							<a><div class="btn" style="left:367px; top:0px;">已有产品入库</div></a>
							<a><div class="btn" style="left:658px; top:197px;">调价</div></a>
							<a><div class="btn" style="left:659px; top:259px;">日志</div></a>
							<a><div class="btn" style="left:239px; top:347px;">订单出库</div></a>
							<a><div class="btn" style="left:62px; top:236px;">合同管理</div></a>
							<a><div class="btn" style="left:63px; top:102px;">供应商管理</div></a>
						</li>
						<li class="i4">
							<a><div class="btn" style="left:197px; top:2px;">新产品入库</div></a>
							<a><div class="btn" style="left:367px; top:0px;">新商品上架</div></a>
							<a><div class="btn" style="left:659px; top:101px;">商品多规格发布</div></a>
							<a><div class="btn" style="left:659px; top:235px;">商品详情发布</div></a>
							<a><div class="btn" style="left:239px; top:347px;">商品出入库</div></a>
							<a><div class="btn" style="left:63px; top:236px;">属性规格</div></a>
							<a><div class="btn" style="left:63px; top:102px;">品牌设置</div></a>
						</li>
					</ul>
				</div>
			</div>
			<div class="info">
				<table class="tbl">
					<tr>
						<td class="th" colspan="2">待处理事务（单位：个）</td>
					</tr>
					<tr>
						<td class="r1" width="50%"><a>未处理订单(100)</a></td>
						<td class="r1" width="50%"><a>待审核订单(100)</a></td>
					</tr>
					<tr>
						<td class="r2"><a>待发货订单(100)</a></td>
						<td class="r2"><a>待收货订单(100)</a></td>
					</tr>
					<tr>
						<td class="r1"><a>待收款订单(100)</a></td>
						<td class="r1"><a>待对账订单(100)</a></td>
					</tr>
					<tr>
						<td class="r2"><a>商品库存报警(100)</a></td>
						<td class="r2"><a>未处理商品评论(5)</a></td>
					</tr>
					<tr>
						<td class="r1"><a>未处理购买咨询(5)</a></td>
						<td class="r1"></td>
					</tr>
				</table>
				<div class="space"></div>
				<table class="tbl">
					<tr>
						<td class="th" colspan="2">统计信息</td>
					</tr>
					<tr>
						<td class="r1" width="50%">今日订单:<span class="num">100</span></td>
						<td class="r1" width="50%">今日订单总额:<span class="num">100000</span></td>
					</tr>
					<tr>
						<td class="r2">新增会员:<span class="num">100</span></td>
						<td class="r2">总会员数:<span class="num">100</span></td>
					</tr>
					<tr>
						<td class="r1">新增商品:<span class="num">100</span></td>
						<td class="r1">商品总数:<span class="num">100000</span></td>
					</tr>
					<tr>
						<td class="r2">今日访问:<span class="num">100</span></td>
						<td class="r2">在线人数:<span class="num">100</span></td>
					</tr>
					<tr>
						<td class="r1">上架商品:<span class="num">10</span></td>
						<td class="r1">下架商品:<span class="num">5</span></td>
					</tr>
				</table>
			</div>
		</div>
		<div class="footer container_width">
			Copyright&nbsp;&copy;&nbsp;2006-2013&nbsp;customer&nbsp;卡斯特曼版权所有
		</div>
	</div>
	<div id="south" class="x-hide-display">
		<p>这是状态栏位</p>
	</div>
{/block}
