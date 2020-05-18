<!--{if $smarty.session.member_id}
	<div class="uinfoi png" id="uinfoi">
		<div class="color_white">
			<div class="row">
				<div class="rank1"></div>
				<div class="name" title="{$session_member.name}">{$session_member.name}</div>
			</div>
			<div class="movew">
				<div class="move" id="uinfoimove">
					<div class="roww">
						<div class="row">积分</div>
						<div class="row"><span class="bonlijifen">{$session_member.jifen|default:"0"}</span></div>
					</div>
					{foreach from=$companybrands item=companybrand}
					<div class="roww">
						<div class="row">{$companybrand.cbrand_name}积分</div>
						<div class="row"><span class="cbrand{$companybrand.companybrand_id}jifen">{$companybrand.jifen|default:"0"}</span></div>
					</div>
					{/foreach}
				</div>
			</div>
		</div>
		<div class="uinfoshow" id="uinfoshow">
			<div class="i png"></div>
			<div class="ct png"></div>
			<div class="cm">
				<div class="con">
					<div class="list">
						<div class="r">
							<div class="c type">积分：</div>
							<div class="c jifenw"><span class="jifen bonlijifen">{$session_member.jifen|default:"0"}</span></div>
							<a target="_blank" href="{$url_base}index.php?go=foru.mall.view"><div class="c duihuan"></div></a>
							<div class="c chongzhi"></div>
						</div>
						{foreach from=$companybrands item=companybrand}
						<div class="r" cid="{$companybrand.companybrand_id}" rate="{$companybrand.rate}">
							<div class="c type"><span class="cbrand_name"></span>积分：</div>
							<div class="c jifenw"><span class="jifen cbrand{$companybrand.companybrand_id}jifen">{$companybrand.jifen|default:"0"}</span></div>
							<a href="{$url_base}index.php?go=foru.companybrand.lists&companybrand_id={$companybrand.companybrand_id}"><div class="c duihuan"></div></a>
							{if $companybrand.jifen>0}
							<div class="c zhuanhuan cbrand{$companybrand.companybrand_id}zhuanhuan"></div>
							{/if}
						</div>
						{/foreach}
					</div>
					<div class="line"></div>
					<div class="btnw">
						<a><div class="pinpai"></div></a>
						<a><div class="geren"></div></a>
					</div>
				</div>
			</div>
			<div class="cb png"></div>
		</div>
	</div>
{/if}
-->
 <a target="_blank" href="{$url_base}index.php?go=kmall.cart.lists">
	<div class="cartcar" id="mbasket">
		<div class="n">(<span id="cartpcount">{$memberInfo.count|default:"0"}</span>)</div>
	</div>
	</a>
	<div class="goup" title="回到顶部" id="goup"><a class="ico ico_goup"></a></div>

<div class="foot_sitemap">
	<div class="center">
		<div>
			<p><img src="{$template_url}resources/images/public/header/button_ico1.png"/>新手上路</p>
			<ul>
					<li><a>支付方式</a></li>
					<li><a>如何退款</a></li>
					<li><a>红包说明</a></li>
					<li><a>发票服务</a></li>
				</ul>
		</div>
		<img src="{$template_url}resources/images/public/header/foot_map_bg.png">
		<div>
			<p><img src="{$template_url}resources/images/public/header/button_ico2.png"/>付款方式</p>
			<ul>
					<li><a>支付方式</a></li>
					<li><a>如何退款</a></li>
					<li><a>红包说明</a></li>
					<li><a>发票服务</a></li>
				</ul>
		</div>
		<img src="{$template_url}resources/images/public/header/foot_map_bg.png">
		<div>
			<p><img src="{$template_url}resources/images/public/header/button_ico3.png"/>配送方式</p>
			<ul>
					<li><a>支付方式</a></li>
					<li><a>如何退款</a></li>
					<li><a>红包说明</a></li>
					<li><a>发票服务</a></li>
				</ul>
		</div>
		<img src="{$template_url}resources/images/public/header/foot_map_bg.png">
		<div>
			<p><img src="{$template_url}resources/images/public/header/button_ico4.png"/>消费者保护</p>
			<ul>
					<li><a>支付方式</a></li>
					<li><a>如何退款</a></li>
					<li><a>红包说明</a></li>
					<li><a>发票服务</a></li>
				</ul>
		</div>

		<img src="{$template_url}resources/images/public/header/foot_map_bg.png">
		<div>
			<p><img src="{$template_url}resources/images/public/header/button_ico5.png"/>申请合作</p>
			<ul>
					<li><a>支付方式</a></li>
					<li><a>如何退款</a></li>
					<li><a>红包说明</a></li>
					<li><a>发票服务</a></li>
				</ul>
		</div>
		<img src="{$template_url}resources/images/public/header/foot_map_bg.png">
		<div>
			<p><img src="{$template_url}resources/images/public/header/button_ico6.png"/>关于我们</p>
			<ul>
					<li><a>支付方式</a></li>
					<li><a>如何退款</a></li>
					<li><a>红包说明</a></li>
					<li><a>发票服务</a></li>
				</ul>
		</div>
	</div>
</div>
<div class="foot_banner">
	<div class="center">
		<img src="{$template_url}resources/images/public/header/foot_banner.jpg"/>
	</div>
</div>
<div class="final_foot">
	<div class="center">
		<p>
			<a>首 页</a>
			|
			<a>公司介绍</a>
			|
			<a>个性化服务</a>
			|
			<a>供应商利益</a>
			|
			<a>求职信息</a>
			|
			<a>法律申明</a>
			|
			<a>任何疑问</a>
			|
			<a>采购品类</a>
			|
			<a>联系我们</a>

		</p>
		<p>菲彼生活网2013-2013
		<script type="text/javascript">
			var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
			document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F8c3c1ab0ed274ebf386e69952e455530' type='text/javascript'%3E%3C/script%3E"));
			</script></p>
	</div>
</div>
