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
     <!--  <div class="b_btn_box">
        {foreach item=b from=$banner key=index}
        <div class="btn_item {if index==0}on_btn_item{/if}"></div>
        {/foreach}
      </div> -->
    </div>
	<div class="giftBox">
			 <div class="giftBoxInfo">
			 	 <h3>我们的爱从这礼开始</h3>
			 	 <h2>特别的爱给特别的她</h2>
			 	 <h1>FOR HER</h1>
			 </div>
			 <div class="giftBoxGoods">
			 	<ul class="clearfix">
			 		{foreach item=p from=$hotSaleProducts key=index}
			 		<li>
			 			<img <img src="{$url_base}upload/images/{$banner1.$index->url}" />
			 			<a class="mengban" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">
			 				<h2>{$p->productShow|truncate:35}</h2>
			 				<p><span>￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span><span style="border: 1px solid #fff; padding: 0 5px; border-radius: 15px;margin-left: 5px;font-size: 12px;">立即兑换</span></p>
			 			</a>
			 			<div class="botgs clearfix">
			 				{foreach item=img from=$p->getProductImg key=indx}
			 				{if $indx < 3}
			 				<a href="">
			 					<img <img src="{$url_base}upload/images/{$img->img}" />
			 				</a>
			 				{/if}
			 				{/foreach}
			 				
			 				<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" style="border: none;">			 					
			 					<span><i></i>查看完整<br/>礼包清单</span>
			 				</a>
			 			</div>
			 		</li>
			 		{/foreach}
			 	</ul>
			 </div>
		</div>
		<div class="giftBox" style="background: #deebfe;">
			 <div class="giftBoxInfo">
			 	 <h2>特别的爱给特别的他</h2>
			 	 <h1>FOR HIS</h1>
			 </div>
			 <div class="giftBoxGoods">
			 	<ul class="clearfix">
			 		{foreach item=p from=$hotSaleProducts2 key=index}
			 		<li>
			 			<img <img src="{$url_base}upload/images/{$banner2.$index->url}" />
			 			<a class="mengban" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">
			 				<h2>{$p->productShow|truncate:35}</h2>
			 				<p><span>￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span><span style="border: 1px solid #fff; padding: 0 5px; border-radius: 15px;margin-left: 5px;font-size: 12px;">立即兑换</span></p>
			 			</a>
			 			<div class="botgs clearfix">
			 				{foreach item=img from=$p->getProductImg key=indx}
			 				{if $indx < 3}
			 				<a href="">
			 					<img <img src="{$url_base}upload/images/{$img->img}" />
			 				</a>
			 				{/if}
			 				{/foreach}
			 				<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" style="border: none;">			 					
			 					<span><i></i>查看完整<br/>礼包清单</span>
			 				</a>
			 			</div>
			 		</li>
			 		{/foreach}
			 	</ul>
			 </div>
		</div>
{/block}