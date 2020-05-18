{extends file="$templateDir/layout/brand/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile.order.lists">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				<div class="title_back_a">
			</a>
		</div>
		<div class="title_inner" id="shuaxin">订单详情</div>
	</div> -->
	<div class="content">
		<div class="order_info">
			<div class="order_info_li order_no">{$orders->order_no}</div>
			<div class="order_info_li total_amount">￥{$orders->total_amount|string_format:'%.2f'}</div>
			<div class="order_info_li pay_status">{$orders->pay_status}</div>
			<div class="order_info_li ship_status">{$orders->ship_status}</div>
			<div class="order_info_li commitTime">{$orders->commitTime}</div>
		</div>
		<div class="orderinf_li">
			<div class="orderinf_li_title">&nbsp;&nbsp;收货信息</div>
			<div class="orderinf_li_info">
				<div class="orderinf_li_info_title">收件人</div>
				<div class="orderinf_li_info_cen">{$orders->ship_name}</div>
			</div>
			<div class="orderinf_li_info">
				<div class="orderinf_li_info_title">联系电话</div>
				<div class="orderinf_li_info_cen">{$orders->ship_mobile}</div>
			</div>
			<div class="orderinf_li_adrss">
				<div class="orderinf_li_info_title">收货地址</div>
				<div class="orderinf_li_info_cen">{$orders->ship_addr}</div>
			</div>
		</div>
		<div class="orderinf_li">
			<div class="orderinf_li_title">&nbsp;&nbsp;货物清单</div>
			{foreach from=$ordergoods item=item key=index}
			{if $index >0}
			<div class="hr"></div>
			{/if}
			<div class="orderinf_li_goods">
				<a href="{$url_base}index.php?go=mobile.goods.info&id={$item.goods_id}">
				<div class="orderinf_li_googds_img">
					<img src="{$url_base}upload/images/{$item.image}">
				</div>
				<div class="orderinf_li_goods_cen">
					<div class="ordergoods_name">{$item.goods_name}</div>
					<div class="ordergoods_num">
						<span>价格：￥{$item.price|string_format:'%.2f'}</span>
						<span>数量：{$item.nums}</span>
					</div>
				</div>
				</a>
			</div>
			{/foreach}
		</div>
	</div>
</div>
{/block}
