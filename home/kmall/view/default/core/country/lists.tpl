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

    <div class="otherCountyHref clearfix">
	{foreach item=c from=$country key=index}
		<a href="#index_{$index}">
			<img src="{$url_base}upload/images/{$c->thumbnail}" />
			<!-- <span>{$c->name}</span> -->
		</a>
	{/foreach}
	</div>
	<div class="GoodsBox">
		 <ul>
		 	{foreach item=c from=$country1 key=index}
		 	<li id="index_{$index}">
		 		<div class="topCountry clearfix">
		 			<div class="leftBg fl">
		 				<img src="{$url_base}upload/images/{$c->images}"></img>
		 			</div>
		 			<div class="rightMsg fl">
		 				<h2>{$c->name}馆</h2>
		 				<div>
		 					<p>{$c->introduction}</p>
		 				</div>
		 			</div>
		 			<div class="goods">
		 				 <h3>{$c->name}优选<a href="">查看更多</a></h3>
		 				 <div class="goodsMsg clearfix">
		 				 	{foreach item=p from=$c->getProduct key=indx}
		 				 	{if $indx< 10}
		 				 	<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">
		 				 		<img src="{$url_base}upload/images/{$p->image}">
		 				 		<p>{$p->productShow|truncate:45}</p>
		 				 		<p style="color:#f00">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</p>
		 				 	</a>
		 				 	{/if}
		 				 	{/foreach}
		 				 </div>
		 			</div>
		 		</div>
		 	</li>
		 	{/foreach}
		 </ul>
	</div>
	<div class="Sixteen">
		<div class="sixteenBg"><img src="{$url_base}upload/images/{$banner1->url}"/></div>
		<ul>
			{foreach item=c from=$country2 key=index}
			<li id="index_{$index+3}">
				<div class="group clearfix">
					<a href="{$url_base}index.php?go=kmall.ptype.lists&country_id={$c->country_id}">
						<img src="{$url_base}upload/images/{$c->flagimage}" />
					</a>
					{foreach item=p from=$c->getProduct key=indx}
 				 	{if $indx< 4}
 				 	<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">
 				 		<img src="{$url_base}upload/images/{$p->image}">
 				 		<p>{$p->productShow|truncate:45}</p>
 				 		<p style="color:#f00">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</p>
 				 	</a>
 				 	{/if}
 				 	{/foreach}
				</div>
			</li>
			{/foreach}
		</ul>
		<div class="moreCountyInfo">
			<div class="Info clearfix">
				 <a class="fl" style="height:264px;width: 230px; font-size: 32px; color: #fff;background: #d2d6d7; line-height: 66px; box-sizing: border-box; padding-top: 50px;" href="javascript:">更多国家<br/>敬请期待</a>
				 {foreach item=c from=$country3 key=index}
				 {if $index==0}
				 <a class="fl" style="line-height: 264px;height: 264px;width: 190px; border-right: 1px solid #819b98;"><img src="{$url_base}upload/images/{$c->thumbnail}" style="height: 135px;width: 136px;margin-top:64px;"/></a>
				 {else}
				 <a class="fl" style="height: 132px; width: 150px;border-right: 1px solid #819b98;border-bottom: 1px solid #819b98;"><img src="{$url_base}upload/images/{$c->thumbnail}" style="height: 98px;width: 99;margin-top:18px;"/></a>
				 {/if}
				{/foreach}
			</div>
		</div>
	</div>
{/block}
