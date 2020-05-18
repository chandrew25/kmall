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
	<div class="dzndzs">定制你的专属唯一</div>
	<div class="dzndzs_cent">
		<div class="dzndzs_cent_info">
			<div class="itme">
				<img src="{$template_url}resources/images/kmall/dzndzs_1.png" >
			</div>
			<a href="#dzlc">
				<div class="dzndzs_itme1">
					<img src="{$template_url}resources/images/kmall/dzndzs_2.png" >
					<span>01 定制流程</span>
				</div>
			</a>
			<a href="#txks">
				<div class="dzndzs_itme1">
					<img src="{$template_url}resources/images/kmall/dzndzs_3.png" >
					<span>02 挑选款式</span>
				</div>
			</a>
			<a href="#zsfw">
				<div class="dzndzs_itme1">
					<img src="{$template_url}resources/images/kmall/dzndzs_4.png" >
					<span>03 专属服务</span>
				</div>
			</a>
		</div>
	</div>
	<!-定制流程-->
	<div class="dzlc_cent" id="dzlc">
		<div class="dzlc_cent_info">
			<div class="dzlc_cent_title">01 定制流程</div>
			<div class="dzlc_cent_img"><img src="{$template_url}resources/images/kmall/dzlc_cent_img.png" ></div>
		</div>
		<div class="dzlc_cent_info">
			<div class="dzlc_cent_itme">
				<img src="{$template_url}resources/images/kmall/dzlc_1.png" >
				<span>挑选款式</span>
			</div>
			<div class="dzlc_cent_itme">
				<img src="{$template_url}resources/images/kmall/dzlc_2.png" >
				<span>测量尺寸</span>
			</div>
			<div class="dzlc_cent_itme">
				<img src="{$template_url}resources/images/kmall/dzlc_3.png" >
				<span>专属服务</span>
			</div>
			<div class="dzlc_cent_itme">
				<img src="{$template_url}resources/images/kmall/dzlc_4.png" >
				<span>定制生产</span>
			</div>
			<div class="dzlc_cent_itme">
				<img src="{$template_url}resources/images/kmall/dzlc_5.png" >
				<span>惊喜收货</span>
			</div>
		</div>
	</div>
	<!-挑选款式-->
	<div class="txks_cent" id="txks">
		<div class="dzlc_cent_info">
			<div class="dzlc_cent_title">02 挑选款式</div>
			<div class="dzlc_cent_img"><img src="{$template_url}resources/images/kmall/dzlc_cent_img.png" ></div>
		</div>
		<div class="dzlc_cent_info">
			<div class="txks_cent_left">
				<img src="{$template_url}resources/images/kmall/txks_cent_left.jpg" >
			</div>
			{foreach item=p from=$products key=index}
			<div class="txks_cent_itme {if $index==4}txks_cent_itme2{/if}">
				<img src="{$url_base}upload/images/{$p->image}" >
				<div class="txks_cent_itme_title" >{$p->productShow|truncate:45}</div>
				<div class="txks_cent_itme_info">
					<a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}" >
						<div class="txks_cent_itme_a">查看详情</div>
					</a>
				</div>
			</div>
			{/foreach}

		</div>
	</div>
	<!-专属服务-->
	<div class="zsfw_cent" id="zsfw">
		<div class="dzlc_cent_info">
			<div class="dzlc_cent_title">03 专属服务</div>
			<div class="dzlc_cent_img"><img src="{$template_url}resources/images/kmall/dzlc_cent_img.png" ></div>
		</div>
		<div class="dzlc_cent_info">
			<div class="zsfw_cent_left"><img src="{$template_url}resources/images/kmall/zsfw_cent_left.png" ></div>
			<div class="zsfw_cent_right">
				<div class="zsfw_cent_top">尊享定制服务</div>
				<div class="zsfw_cent_cent">
					<span>与专属客服人员进行一对一交流并确认定制方案，</span>
					<span>确认完毕后客服会下单通知工厂进行定制。</span>
					<span>出货质检后通知您等待收取。</span>
				</div>
				<div class="zsfw_cent_bomt">
					<span>客服热线</span>
					<div class="tel">400-8035-170</div>
				</div>
			</div>
		</div>
	</div>
{/block}
