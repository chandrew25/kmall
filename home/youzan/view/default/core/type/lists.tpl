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
	<div class="content">
	<div class="list_outer">
            <div id="wrapper">
                <div id="scroller">
                    <div id="pullDown" style="display:none;">
                        <span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>
                    </div>
					{foreach from=$voucher item=item key=index}
						<div class="type_li">
							<a href="{$url_base}index.php?go=mobile.goods.lists&id={$item->voucher_id}"> 
								<div class="type_li_name">{$item->voucher_name}</div>
							</a>
						</div>
					{/foreach}
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
