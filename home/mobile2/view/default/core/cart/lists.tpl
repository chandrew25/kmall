{extends file="$templateDir/layout/cart/layout.tpl"}
{block name=body}
	<div id="shopp_cart">
		<div class="s_title">
			<h2 class="s_t_width">购物车</h2>
		</div>
		{foreach item=cart from=$carts name=cartindex}
		<div class="supplier clearfix">
			<h2 class="supp_title"><span class="sprite-icon del_goods" goods_id="{$cart->goods_id}">删除</span></h2>
			<dl class="supp_main clearfix">
				<dt class="supp_pic_t">
					<img src="{$url_base}upload/images/{$cart->ico}" />
				</dt>
				<dd class="supp_con">
					<span class="supp_c_txt">{$cart->goods_name}</span>
					{*<span class="supp_c_money">规格：50ml</span>*}
					<div class="supp_c_price clearfix">
						<span class="supp_box">￥{$cart->sales_price*$cart->num|string_format:'%.2f'}+{$cart->jifen*$cart->num|default:'0'}券</span>
						<p class="supp_c_inpt">
							<input type="button" value="-" id="plus" class="cart_del" goods_id="{$cart->goods_id}"/>
							<input type="text"  class="num" value="{$cart->num}" readonly="true">
							<input type="button" value="+" id="reduce" class="cart_add" goods_id="{$cart->goods_id}"/>
						</p>
					</div>
				</dd>
			</dl>
		</div>
		{/foreach}
		<div class="con_sub cart_che clearfix">
					<span class="con_color cart_main fl">
						合计:<font>￥{$statistic.totalPrice+$foo}{if $statistic.totalJifen>0} + {$statistic.totalJifen} 券{/if}</font>
						<font class="cart_money">(含运费:{$foo})</font>
					</span>
			<a href="index.php?go=mobile2.checkout.view" class="con_ti fr">确认提交</a>
		</div>
	</div>
{/block}
