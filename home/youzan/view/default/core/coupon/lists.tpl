{extends file="$templateDir/layout/brand/layout.tpl"}
{block name=body}
<div class="container">
	<div class="list_outer">
		<div id="wrapper">
		    <div id="scroller">
		        <div id="pullDown" style="display:none;">
		            <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
		        </div>
				<div class="content">
				{if count($coupon)>0}
					{foreach from=$coupon item=item key=index}
					<div class="coupon_li">
						<div class="b b1"></div>
						<div class="b b2"></div>
						<div class="b b3"></div>
						<div class="coupon_main">
							<div class="coupon_main_b">
								<div class="coupon_name">优惠券</div>
								<div class="coupon_info">
									<div class="coupon_remarks">{$item->remarks}</div>
									<div class="coupon_pwd">NO:{$item->coupon_pwd}</div>
									<div class="coupon_time">有效期：{$item->time} 至 {$item->exp_date}</div>
								</div>
								<div class="coupon_amount">{$item->amount}<br>元</div>
							</div>
						</div>
						<div class="b b3"></div>
						<div class="b b2"></div>
						<div class="b b1"></div>
					</div>
					{/foreach}
				{else}
					<div class="content_no">
						<img src="{$template_url}resources/images/no_menu.png">
						<p>暂无数据</p>
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

{/block}
