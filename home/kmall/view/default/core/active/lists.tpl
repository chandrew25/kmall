{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div class="banner">
      <ul class="banner_list">
        {foreach item=b from=$banner}
        <li class="banner_item">
          <a href="{$b->links}" target="_blank">
            <img src="{$url_base}upload/images/{$b->url}">
          </a>
        </li>
        {/foreach}
      </ul>
      <!-- <div class="b_btn_box">
        {foreach item=b from=$banner key=index}
        <div class="btn_item {if index==0}on_btn_item{/if}"></div>
        {/foreach}
      </div> -->
    </div>
    <div class="hotActive">
			<div class="activeTitle">
				<h2><span>热销排行榜</span></h2>
			</div>
			<div class="hotActiveBox">
				<div class="hot-top clearfix">
					<div class="leftImage">
						<a href="{$banner1->links}" target="_blank">
						   <img src="{$url_base}upload/images/{$banner1->url}" />
						</a>
					</div>
					<div class="rightGoods">
						<div class="bgColor">
							<div class="hotGoods clearfix">
								{foreach item=p from=$hotSaleProducts1 key=index}
								<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
									<img src="{$url_base}upload/images/{$p->image}" />
									<p>{$p->productShow|truncate:25}</p>
								</a>
								{/foreach}
							</div>
						</div>
					</div>
				</div>
				<div class="hot-bottom">
					<ul class="clearfix">
						{foreach item=p from=$hotSaleProducts2 key=index}
						<li>
							<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" target="_blank">
								<img src="{$url_base}upload/images/{$p->image}" />
								<p>{$p->productShow|truncate:25}</p>
			 				 	<p style="color:#f00">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</p>
							</a>
						</li>
						{/foreach}
					</ul>
				</div>
			</div>
		</div>
		<div class="hotActive" style="padding-top: 0;">
			<div class="activeTitle">
				<h2><span style="border-bottom: 2px solid #bb9a55;">必买清单</span></h2>
			</div>
			<div class="hotActiveBox clearfix" style="height: 510px;">
				 <div class="myslide">
						<!-- <ul class="myslidetwo"> -->
   					<ul>
							{foreach item=b from=$banner2 key=index}
							<li>
								<a href="{$b->links}" target="_blank">
									<img src="{$url_base}upload/images/{$b->url}" width="100%"/>
								</a>
							</li>
							{/foreach}
						</ul>

						<!-- <ol class="label">
							{foreach item=b from=$banner2 key=index}
							<li {if $index ==0} class="current" {/if}></li>
							{/foreach}
						</ol> -->
				 </div>
				 <div class="showImage">
				 	{foreach item=b from=$banner3 key=index}
				 	<a href="{$b->links}" target="_blank">
				 		<img src="{$url_base}upload/images/{$b->url}" />
				 	</a>
				 	{/foreach}
				 </div>
			</div>
		</div>
		<div class="SelectedBox">
			<div class="activeTitle">
				<h2><span style="border-bottom: 2px solid #b95054;">精选活动</span></h2>
			</div>
			<ul>
				{foreach item=a from=$activity key=index}
				<li class="clearfix">
					<a href="{$a->url}#" target="_blank"><img src="{$url_base}upload/images/{$a->images}"/></a>
					{foreach item=p from=$a->getProduct key=indx}
					<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}" target="_blank">
						<img src="{$url_base}upload/images/{$p.image}" />
						{if !contain($p.product_name, $p.brand_name)}
						<p class="title">{$p.brand_name}{$p.product_name}</p>
						{else}
						<p class="title">{$p.product_name}</p>
						{/if}
	 				 	<p style="color:#f00">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</p>
					</a>
					{/foreach}
				</li>
				{/foreach}
			</ul>
		</div>
{/block}
