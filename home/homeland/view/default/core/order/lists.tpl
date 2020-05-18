{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
	<div id="wrapper" class="m_pwd">
		<!--<h2 class="int_title clearfix"><span class="int_pic"><img src="images/jifen/left.png"/></span>积分商城</h2>-->
		<div class="int_title"><span class="int_pic"><a href="index.php?go=mobile.member.view"><img src="{$template_url}resources/images/jifen/left.png"/></a></span>我的订单</div>
		<!--banner start-->
		{foreach item=order from=$orders name=index}
		<div class="order">
			<p class="o_txt clearfix">
				编号 : {$order->order_no}
				<span class="fr">{$order->ship_status}</span>
			</p>
			{foreach item=goods from=$order->goods name=goodsindex}
			<dl class="order_box topline clearfix">
				<dt class="order_pic fl">
					<img src="{$url_base}upload/images/{$goods->image}" />
				</dt>
				<dd class="order_txt fr">
					<p class="order_con">{$goods->goods_name}</p>
					<span class="order_line"></span>
					<p class="order_number clearfix">￥{$goods->price*$goods->nums|string_format:'%.2f'}+{$goods->jifen*$goods->nums|default:'0'}积分<span class="order_add fr">x{$goods->nums}</span></p>
				</dd>
			</dl>
			{/foreach}
			<div class="order_btn topline clearfix">
				<p class="order_t_box clearfix fr">
					<a href="index.php?go=mobile.order.info&id={$order->order_id}" class="p_money order_border order_style fl">订单详情</a>
					{if $order->pay_status==0}
					<a href="index.php?go=mobile.checkout.show&order_id={$order->order_id}" class="p_money order_border  fr">付款</a>
					{else}
					<a href="#" class="p_money order_border  fr">确认收货</a>
					{/if}
				</p>
			</div>
		</div>
		{/foreach}

		<!--menu  start-->
	</div>
	<!--menu  end-->
	<div id="back_top">
		<a href="#"><img src="images/xqq/the_top.png" /></a>
	</div>
{/block}
