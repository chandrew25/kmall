{extends file="$templateDir/layout/cart/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile.member.info">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				<div class="title_back_a">
			</a>
		</div>
		<div class="title_inner" id="shuaxin">订单列表</div>
	</div> -->
	<div class="content">
	<div class="list_outer">
            <div id="wrapper">
                <div id="scroller">
                    <div id="pullDown" style="display:none;">
                        <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
                    </div>
                    <form action="{$url_base}index.php?go=mobile.order.add" method="post" id="orderFrm">
                    <div class="cart_li_up"></div>
					{foreach from=$goods item=item key=index}
						<div class="cart_li" id="{$item->cart_id}">
							<div class="cart_li_goods">
								<div class="cart_li_left">
									<img src="upload/images/{$item->product_ico}">
								</div>
								<div class="cart_li_right">
									<div class="goods_info">
										<div class="goods_name">
											{$item->product_name}
										</div>
										<div class="price">
											<div class="price_i">
												<span>￥</span>{$item->price}
											</div>
											<div class="price_n">
												￥{$item->market_price}
											</div>
										</div>
									</div>
									<div class="cart_oth">
										<div class="cart_num">
											<div class="cart_del" cartId="{$item->cart_id}"></div>
											<div class="cart_show_num">
												<input type="text" name="num" id="num{$item->cart_id}" value="{$item->num}" readonly="true">
											</div>
											<div class="cart_add" cartId="{$item->cart_id}"></div>
										</div>
										<div class="del_goods" cartId="{$item->cart_id}"></div>
									</div>
								</div>
							</div>
						</div>
					{/foreach}
					<div class="cart_li_bmt"></div>
					<input type="hidden" name="cart" value="1">
					</form>
					<div id="pullUp" style="display:none;">
                        <span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>
                    </div>
                    <div class="list_blank"></div>
                </div>
            </div>
		</div>
	</div>
</div>
{/block}
