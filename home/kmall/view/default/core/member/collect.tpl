{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
	{php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
	<div id="member_wrapper" class="center_border_color">
		<div id="member">
			<div id="member_title">我的收藏</div>
			<table class="tbl">
				<tr class="tbl_head">
					<td width="300">商品名称</td>
					<td width="150">价格</td>
					<td width="150">积分</td>
					<td width="200">操作</td>
				</tr>
				{if count($collects) !=0}
				{foreach item=collect from=$collects}
				<tr>
					<td align="left">&nbsp;<a href="index.php?go=kmall.product.view&product_id={$collect.product_id}">{$collect.product_name}</a></td>                                                                                                                                             
					<td>&nbsp;￥{$collect.price}</td>
					<td>&nbsp;{$collect.jifen}</td>
					<td>
						<a href="index.php?go=kmall.cart.addProduct&product_id={$collect.product_id}&num=1">加入购物车</a>
						<a href="javascript:if(confirm('确认要删除吗？'))location='index.php?go=kmall.member.delCollect&collect_id={$collect.collect_id}'">删除</a>
					</td>
				</tr>
				{/foreach}
				{else}
					<td colspan="3" height="60" align="center">你在近期没有收藏</td>
				{/if}
			</table>
			<div id="orderList_count_wrapper" align="left">
				<my:page src="{$url_base}index.php?go=kmall.member.collect" /></div>
			</div>
		</div>
	</div>
</div>
{/block}