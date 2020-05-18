{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div class="right_list">
		<div class="title"><span>订单详情</span></div>
		<div class="detail">
			<table width="785" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td width="60">订单编号:</td>
					<td><span>{$order.order_no}</span></td>
				</tr>
				<tr>
					<td>订单状态：</td>
					<td><span>{$order.ship_statusShow}</span></td>
				</tr>
                <tr>
                    <td>订单总计：</td>
                    <td><span>￥{$order.final_amount|string_format:'%.2f'}+{$order.jifen|string_format:'%d'}积分</span></td>
                </tr>
				<tr>
					<td>收 货 人：</td>
					<td><span>{$order.ship_name}</span></td>
				</tr>
				<tr>
					<td>支付方式：</td>
					<td><span>{$order.paymenttype.name}</span></td>
				</tr>
				<tr>
					<td>配送方式：</td>
					<td><span>{$order.deliverytype.name}</span></td>
				</tr>
				<tr>
					<td>收货地址：</td>
					<td><span>{$order.ship_addr}</span></td>
				</tr>
				<tr>
					<td>电话号码：</td>
					<td><span>{if $order.ship_mobile}{$order.ship_mobile}{else}{$order.ship_tel}{/if}</span></td>
				</tr>
			</table>
		</div>
		<div class="follow_up">
			<div class="titles"><span>订单跟踪</span></div>
			<div id="dispose">
				<div id="nowstatus" class="dispose{if $order.ship_status==0}1{else if $order.ship_status==1||$order.ship_status==2}2{else if $order.ship_status==3||$order.ship_status==4}3{/if}">等待处理</div>
				<div id="dispose_middle">
					<div class="{if $order.ship_status==0}dispose_middle_current{else}dispose_middle_other{/if}"></div>
					<div class="dispose_middle_arrow"></div>
					<div class="{if $order.ship_status==1||$order.ship_status==2}dispose_middle_current{else}dispose_middle_other{/if}"></div>
					<div class="dispose_middle_arrow"></div>
					<div class="{if $order.ship_status==3||$order.ship_status==4}dispose_middle_current{else}dispose_middle_other{/if}"></div>
					<div class="dispose_middle_arrow"></div>
					<div class="{if $order.ship_status==5}dispose_middle_current{else}dispose_middle_other{/if}"></div>
				</div>
				<div id="dispose_down">
					<span class="dispose1">提交订单</span>
					<span class="dispose2 hui_color">商品出库</span>
					<span class="dispose3 hui_color">等待收货</span>
					<span class="dispose4 hui_color">完成</span>
				</div>
			</div>
			<table id="genzong_tbl">
				{foreach item=orderlog from=$orderlogs name=orderlog}
				<tr>
					<td width="130">{$orderlog.commitTime|date_format:"%Y-%m-%d %H:%M:%S"}</td>
					<td>{$orderlog.info}</td>
				</tr>
				{/foreach}
			</table>
			<!--
			<div class="bor_c"><span class="m">提交订单</span><span class="time">2013-07-06 21:45:47</span></div>
			<div class="bg_c"></div>
			<div class="bor_c"><span class="m">商品出库</span><span class="time">2013-07-06 21:45:47</span></div>
			<div class="bg_c"></div>
			<div class="bor_c"><span class="m">等待收货</span><span class="time">2013-07-06 21:45:47</span></div>
			<div class="bg_h"></div>
			<div class="bor_h"><span class="m">完成</span></div>
			-->
		</div>
		<div class="bill">
			<div class="titles" style="clear:both;"><span>商品清单</span></div>
			<table width="785" border="0" cellspacing="0" cellpadding="0">
				<tr class="tr_bg">
					<td>商品名称</td>
					<td width="100">积分</td>
					<td width="100">单价</td>
					<td width="80">数量</td>
					<td width="120">小计</td>
				</tr>
				{foreach item=ordergoods from=$order.goods name=i}
				<tr class="tr_bor">
					<td class="td_left"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$ordergoods.goods_id}">{$ordergoods.goods_name}</a></td>
					<td><span>{$ordergoods.jifen|string_format:'%d'}</span></td>
					<td><span>￥{$ordergoods.price|string_format:'%.2f'}</span></td>
					<td><span>{$ordergoods.nums}</span></td>
					<td><span class="span_color">¥{$ordergoods.amount|string_format:'%.2f'}</span></td>
				</tr>
				{/foreach}
			</table>
		</div>
		<div class="total">
			<!--
			<span class="span_s">商品金额：¥88888.00</span><span class="span_s">运费金额：¥0.00</span>
			-->
			<span><span class="span_b">应付款总计：</span><span class="span_color">￥{$order.final_amount|string_format:'%.2f'}+{$order.jifen|string_format:'%d'}积分</span></span>
		</div>
	</div>
</div>
{/block}