{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile2.member.info">
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
						<div class="content_no">
							<img src="{$template_url}resources/images/cart/cart_no.jpg">
						</div>
						<a href="{$url_base}index.php?go=mobile2.goods.lists">
							<div class="goods_index"></div>
						</a>
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
