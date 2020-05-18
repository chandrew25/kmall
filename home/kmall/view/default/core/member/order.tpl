{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div class="right_list">
		<div class="title"><span>订单查询</span></div>
		<div class="find">
			<form method="post">
				<input type="hidden" id="updateTime_value" value="{$temp_t}"/>
				<input type="hidden" id="ship_status_value" value="{$temp_st}"/>
				<input type="hidden" id="queryText_value" value="{$temp_text}"/>
				<select name="updateTime" id="updateTime">
					<option value="0">订单时间</option>
					<option value="1">一个月内订单</option>
					<option value="2">一个月前订单</option>
				</select>
				<!--
				<select name="ship_status" id="ship_status">
					<option value="0">订单状态</option>
					<option value="1">已完成</option>
					<option value="2">已取消</option>
				</select>
				-->
				<input type="text" value="" name="order_id" id="queryText"/>
				<div onclick="$(this).parents('form:first').submit();">查 询</div>
			</form>
		</div>
		<div class="div_tab">
			<table width="785" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<th width="130" align="center">编号</th>
					<th align="center">商品</th>
					<th width="120" align="center">状态</th>
					<th width="100" align="center">金额</th>
					<th width="100" align="center">积分</th>
					<th width="100" align="center">操作</th>
				</tr>
				{foreach item=order from=$orders}
				<tr>
					<td align="center" valign="middle">{$order.order_no}<br />{$order.updateTime|truncate:"10":""}</span></td>
					<td align="left" valign="middle">
						{foreach item=ecahgoods from=$order.goods name=i}
							{if $smarty.foreach.i.index < 3}
							<a target="_blank" href="index.php?go=kmall.product.view&product_id={$ecahgoods.goods_id}" alt="{$ecahgoods.goods_name}" title="{$ecahgoods.goods_name}">
								<img src="{$url_base}upload/images/{$ecahgoods.image}" width="65" height="65"/>
							</a>
							{/if}
						{/foreach}
					</td>
					<td align="center" valign="middle">{$order.ship_statusShow}</td>
					<td align="center" valign="middle"><span class="span_color">￥{$order.final_amount}</span></td>
					<td align="center" valign="middle"><span class="span_color">{$order.jifen}</span></td>
					<td align="center" valign="middle"><a target="_blank" href="index.php?go=kmall.member.order_detail&order_id={$order.order_id}"><span class="span_color">订单详情</span></a></td>
				</tr>
				{/foreach}
			</table>
		</div>
		<div class="fenye">
			<my:page src="{$url_base}index.php?go=kmall.member.order&updateTime={$temp_t}&ship_status={$temp_st}&queryText={$temp_text}"/></div>
		</div>
	</div>
</div>
{/block}