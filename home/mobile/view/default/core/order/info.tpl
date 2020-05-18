{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
	<div id="wrapper" class="m_pwd">
		<!--<h2 class="int_title clearfix"><span class="int_pic"><img src="images/jifen/left.png"/></span>券商城</h2>-->
		<div class="int_title"><span class="int_pic"><a href="index.php?go=mobile.order.lists"><img src="{$template_url}resources/images/jifen/left.png"/></a></span>订单详情</div>
		<div class="fill_order clearfix">
			<ul class="fill_box">
				<li class="fill_left fill_list fl">
					<span class="fill_span">{$orders->ship_name}  {$orders->ship_mobile}</span>
					<p class="fill_pic clearfix">
						<span class="span_pic fl"><img src="{$template_url}resources/images/ddxq/icon.png"></span>
						<span class="span_text fr">{$address}</span>
					</p>
				</li>
				{*<li class="fill_right fill_list fr">*}
					{*<img src="images/ddxq/right.png" class="fill_img" />*}
				{*</li>*}
			</ul>
		</div>
		<!--banner start-->
		<div class="order">
			<p class="o_txt clearfix">
				订单编号 : {$orders->order_no}
				<span class="fr">{$orders->ship_status}</span>
			</p>
			{foreach item=goods from=$ordergoods name=goodsindex}
			<dl class="order_box topline clearfix">
				<dt class="order_pic fl">
					<img src="{$url_base}upload/images/{$goods->image}" />
				</dt>
				<dd class="order_txt fr">
					<p class="order_con">{$goods->goods_name}</p>
					<span class="order_line"></span>
					<p class="order_number clearfix">￥{$goods->price*$goods->nums|string_format:'%d'}+{$goods->jifen*$goods->nums|default:'0'}券<span class="order_add fr">x{$goods->nums}</span></p>
				</dd>
			</dl>
			{/foreach}
		</div>
		<div class="payment">
			<p class="p_info">
				支付信息
			</p>
			<p class="p_content topline">
				<span class="p_c_txt">支付方式：{$orders->order_no}</span>
				<span class="p_c_txt">支付状态：{$orders->pay_status}</span>
				<span class="p_c_txt">综合服务费：{$orders->cost_other}</span>
				<span class="p_c_txt">支付金额：￥{$orders->total_amount}+{$orders->jifen}券</span>
				<span class="p_c_txt">下单时间：{$orders->commitTime}</span>
			</p>
		</div>
		<br/><br/><br/><br/>
	</div>
{/block}
