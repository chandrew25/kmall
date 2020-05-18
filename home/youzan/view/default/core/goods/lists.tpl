{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile.member.info">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				</div>
			</a>
		</div>
		<div class="title_inner" id="shuaxin">特惠商品</div>
	</div> -->
	<div class="content">
		<div class="list_outer">
            <div id="wrapper">
                <div id="scroller">
                    <div id="pullDown" style="display:none;">
                        <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
                    </div>
                    <ul id="thelist">
		            {foreach from=$goods item=item key=index}
			            <div class="list_s">
				            <div class="list_s_img">
					            <a href="{$url_base}index.php?go=mobile.goods.info&id={$item->goods_id}">
						            <img src="{$url_base}upload/images/{$item->image}" />
					            </a>
				            </div>
				            <a href="{$url_base}index.php?go=mobile.goods.info&id={$item->goods_id}">
				            <div class="list_s_con">
					            <div class="list_s_cont">
						            <span>{$item->goods_name}</span>
					            </div>
					            <div class="list_s_conct">
						            <span class="list_s_conct_red">￥{$item->sales_price|string_format:'%.2f'}</span>
                                    <span style="text-decoration:line-through;float:right;line-height:46px;margin-right:10px">￥{$item->market_price|string_format:'%.2f'}</span>
					            </div>
					            <!--<div class="list_s_concb">
						            <span>市场价：</span>
					            </div>-->
				            </div>
				            </a>
			            </div>
			            <div class="list_line"></div>
		            {/foreach}
                    </ul>
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
