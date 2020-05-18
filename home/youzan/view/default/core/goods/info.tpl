{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
<!-- <div id="maxImages">
	<img src="{$url_base}upload/images/{$goods->image}" />
</div>
<div id="maxImages_bj"></div> -->
<div class="container">
	<!-- <div class="title">
		<div class="title_back">
			<a href="{$url_base}index.php?go=mobile.goods.lists">
				<div class="title_back_a">
					<img src="{$template_url}resources/images/public/title_back.png" />
				</div>
			</a>
		</div>
		<div class="title_inner" id="shuaxin">购买商品</div>
	</div> -->
	<div class="list_outer">
		<div id="wrapper">
		    <div id="scroller">
		        <div id="pullDown" style="display:none;">
		            <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
		        </div>
	<div class="content">
	<form action="{$url_base}index.php?go=mobile.order.add" method="post" id="orderFrm">
		<div class="commerce_outer">
			<div class="commerce_top">
				<div class="commerce_top_detail" id="maximg_s">
					<a href="{$url_base}index.php?go=mobile.goods.specification&id={$goods->goods_id}">
						<img src="{$url_base}upload/images/{$goods->image}" />
					</a>
				</div>
				<div class="commerce_shadow">
					<a href="#">{$goods->goods_name}</a>
				</div>
			</div>
			<div class="commerce_bottom">
				<div class="commerce_bottom_inner">
					<div class="commerce_bottom_inner_s">
						<div class="commerce_bottom_inner_slin">
							<div class="commerce_bottom_inner_sl">特惠价：</div>
							<div class="commerce_bottom_inner_sr commerce_bottom_inner_srn">￥{$goods->sales_price|string_format:'%.2f'}</div>
						</div>
						<div class="commerce_bottom_inner_srin">
							<div class="commerce_bottom_inner_sl">市场价：</div>
							<div class="commerce_bottom_inner_sr" style="text-decoration:line-through">￥{$goods->market_price|string_format:'%.2f'}</div>
						</div>
					</div>
					<div class="commerce_bottom_line"></div>
					<div class="commerce_bottom_inner_s" >
						<a href="{$url_base}index.php?go=mobile.goods.specification&id={$goods->goods_id}">
							<div class="goods_s">
								<div class="goods_info">商品详情</div>
								<div class="goods_info_right"></div>
							</div>
						</a>
					</div>
                    <div class="commerce_bottom_line"></div>
                    <div class="commerce_bottom_inner_s" >
                        <a href="{$url_base}index.php?go=mobile.goods.delivery">
                            <div class="goods_s">
                                <div class="goods_info">配送及售后</div>
                                <div class="goods_info_right"></div>
                            </div>
                        </a>
                    </div>
					<div class="commerce_bottom_line"></div> 
					<div class="commerce_bottom_inner_s">
						<div class="commerce_bottom_inner_sls">购买数量：</div>
						<div class="commerce_bottom_inner_srs" style="margin-top:0;">
							<a href="javascript:void(0);">
								<div class="mp_btn_jian mp_btn" str="-"></div>
							</a>
							<div class="mp_input" >
								<input type="text" name="num" id="num" value="1" />
							</div>
							<a href="javascript:void(0);">
								<div class="mp_btn_jia mp_btn" str="+"></div>
							</a>
						</div>
					</div>
					<div class="commerce_bottom_line" style="margin-top:20px;"></div>
					<div class="commerce_bottom_inner_s">
						<div class="commerce_bottom_inner_sl">总金额：</div>
						<div class="commerce_bottom_inner_sr commerce_bottom_inner_srn" id="price">￥{$goods->sales_price|string_format:'%.2f'}</div>
					</div>   
					<div class="commerce_bottom_line"></div>
					<input type="hidden" id="goods_id" name="goods_id" value="{$goods->goods_id}">
					<input type="hidden" name="sales_price" id="sales_price" value="{$goods->sales_price}">
					<!-- <input type="button" class="commerce_commit_btn" value="￥确认购买" /> -->
				</div>
			</div>
		</div>
	</form>
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
