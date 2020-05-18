{extends file="$templateDir/layout/home/layout.tpl"}
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
	<div class="list_outer">
            <div id="wrapper">
                <div id="scroller">
                    <div id="pullDown" style="display:none;">
                        <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
                    </div>
					<div class="content">
					{if count($orders)>0}
					{foreach from=$orders item=item key=index}
						<div class="order_li">
							<div class="order_li_up">
								<div class="order_li_order_no">
									
								</div>
								<div class="order_li_pay_status" id="shuaxin">
									
								</div>
							</div>
							<div class="order_li_bomt">
								<div class="order_li_total_amount">
									<div class="total_amount">￥</div>
								</div>
								<div class="order_li_ship_status">
									<div class="ship_status"></div>
								</div>
							</div>
							<div class="order_li_info_ordertime">
								<div class="ordertime"></div>
							</div>
						</div>
					{/foreach}
					{else}
						<div class="content_no">
							<img src="{$template_url}resources/images/public/order_no.png">
						</div>
					{/if}
					</div>
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
