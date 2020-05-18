{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
{assign var="name_size" value=13}

<div class="floor" id="floor" style="display: none;">
	<div class="i"></div>
	<div class="t" to="floor1-1">F1-1 推荐产品</div>
	<div class="l"></div>
	<div class="t" to="floor1-2">F1-2 欧式家具</div>
	<div class="l"></div>
	<div class="t" to="floor1-3">F1-3 现代家具</div>
	<div class="l"></div>
	<div class="t" to="floor2">F2 建材城</div>
	<div class="l"></div>
	<div class="t" to="floor3">F3 家纺家饰</div>
</div>
<div class="container_width">
	<div class="bannerbox">
		<div class="banner" id="banner">
			<div class="imgw">
				<a><img src="{$template_url}resources/images/temp/flash001.jpg"/></a>
				<a><img src="{$template_url}resources/images/temp/flash002.jpg"/></a>
				<a><img src="{$template_url}resources/images/temp/flash003.jpg"/></a>
				<a><img src="{$template_url}resources/images/temp/flash004.jpg"/></a>
			</div>
			<div class="btnw"></div>
		</div>
	</div>
	<div class="block todayhot margintop">
		<div class="bt">
			<div class="i"></div>
			<span class="t">今日热销 Now sell like hot cakes</span>
			<span class="msg">今日特价热销，不容错过的好机会！</span>
		</div>
		<div class="bline"><div class="i"></div></div>
		<div class="bc">
			<ul class="pinfos">					 
				{foreach item=p from=$four_products['f0']}
				<li>
					<div class="pic"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img  src="{$base_url}upload/images/{$p.image}" width="180" height="178"/></a></div>
					<div class="name"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}">{$p.product_name}</a></div>
					<div class="price"><span class="i">今日特价</span><span class="color_red">￥{$p.price|string_format:'%d'}</span></div>
				</li>
				{/foreach}
				<li class="i"><a><img src="{$template_url}resources/images/temp/pic4.jpg" width="220" height="250"/></a></li>
			</ul>
		</div>
	</div>
	<div class="brands">
		<div class="left"></div>
		<div class="con">
			<ul>
      {foreach item=b from=$brands}
		    <li>
			    <div class="pic"><a><img src="{$base_url}upload/images/{$b.brand_logo}" width="110" height="68"/></a></div>
			    <div class="txt">{$b.brand_name}</div>
		    </li>
      {/foreach}
			</ul>
		</div>
		<div class="right"></div>
	</div>
	<div class="blockw margintop">
		<div class="block f1" id="floor1-1">
			<div class="bt">
				<span class="t">F1-1 推荐产品 Recommande products</span>
				<ul class="list">
					<a href="{$url_base}index.php?go=kmall.ptype.lists"><li class="more"></li></a>
				</ul>
			</div>
			<div class="bline"><div class="i"></div></div>
			<div class="bc">
				<div class="imgrec">
					<img src="{$template_url}resources/images/temp/a2.jpg"/>
					<div class="side">
						<div class="bg"></div>
						<div class="top"></div>
						<div class="con">
							<ul>
								{foreach item=p from=$recommend_products['f11']}
								<li>
									<div><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image}" width="124" height="124"/></a></div>
									<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
								</li>
								{/foreach}
							</ul>
						</div>
						<div class="bottom"></div>
					</div>
				</div>
				<ul class="plist margintop">
					{foreach item=p from=$four_products['f11']}
					<li>
						<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image}" width="238" height="238"/><img class="fimage" src="{$url_base}upload/images/{$p.fimage}"></a>
						<div class="text">
							<div class="name"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}" title="{$p.product_name}">{$p.product_name|truncate:$name_size:"..."}</a></div>
							<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
						</div>
						<div class="textbg"></div>
					</li>
					{/foreach}
				</ul>
			</div>
		</div>
		<a><img class="linkimg" src="{$template_url}resources/images/temp/showimg1.jpg"/></a>
		<div class="block f1" id="floor1-2">
			<div class="bt">
				<span class="t">F1-2 欧式家具 Europe type furniture</span>
				<ul class="list">
					<a href="{$url_base}index.php?go=kmall.ptype.lists"><li class="more"></li></a>
				</ul>
			</div>
			<div class="bline"><div class="i"></div></div>
			<div class="bc">
				<div class="imgrec">
					<img src="{$template_url}resources/images/temp/a3.jpg"/>
					<div class="side">
						<div class="bg"></div>
						<div class="top"></div>
						<div class="con">
							<ul>
								{foreach item=p from=$recommend_products['f12']}
								<li>
									<div><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image_large}" width="124" height="124"/></a></div>
									<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
								</li>
								{/foreach}
							</ul>
						</div>
						<div class="bottom"></div>
					</div>
				</div>
				<ul class="plist margintop">
					{foreach item=p from=$four_products['f12']}
					<li>
						<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image}" width="238" height="238"/><img class="fimage" src="{$url_base}upload/images/{$p.fimage}"></a>
						<div class="text">
							<div class="name"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}" title="{$p.product_name}">{$p.product_name|truncate:$name_size:"..."}</a></div>
							<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
						</div>
						<div class="textbg"></div>
					</li>
					{/foreach}
				</ul>
			</div>
		</div>
		<a><img class="linkimg" src="{$template_url}resources/images/temp/showimg1.jpg"/></a>
		<div class="block f1" id="floor1-3">
			<div class="bt">
				<span class="t">F1-3 现代家具 Korean style furniture</span>
				<ul class="list">
					<a href="{$url_base}index.php?go=kmall.ptype.lists"><li class="more"></li></a>
				</ul>
			</div>
			<div class="bline"><div class="i"></div></div>
			<div class="bc">
				<div class="imgrec">
					<img src="{$template_url}resources/images/temp/a4.jpg"/>
					<div class="side">
						<div class="bg"></div>
						<div class="top"></div>
						<div class="con">
							<ul>
								{foreach item=p from=$recommend_products['f13']}
								<li>
									<div><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image_large}" width="124" height="124"/></a></div>
									<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
								</li>
								{/foreach}
							</ul>
						</div>
						<div class="bottom"></div>
					</div>
				</div>
				<ul class="plist margintop">
					{foreach item=p from=$four_products['f13']}
					<li>
						<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image}" width="238" height="238"/><img class="fimage" src="{$url_base}upload/images/{$p.fimage}"></a>
						<div class="text">
							<div class="name"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}" title="{$p.product_name}">{$p.product_name|truncate:$name_size:"..."}</a></div>
							<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
						</div>
						<div class="textbg"></div>
					</li>
					{/foreach}
				</ul>
			</div>
		</div>
	</div>
	<div class="blockw margintop">
		<div class="block f2" id="floor2">
			<div class="bt">
				<span class="t">F2 建材城 Building Materials City</span>
				<ul class="list">
					<a href="{$url_base}index.php?go=kmall.ptype.lists"><li class="more"></li></a>
				</ul>
			</div>
			<div class="bline"><div class="i"></div></div> 
			<div class="bc">
				<div class="hotp">
					<div class="pl">
						<a><img src="{$base_url}upload/images/{$up_products.f2.left.image}" width="100%" height="100%"/></a>
						<div class="price">￥{$up_products.f2.left.price|string_format:'%d'}&nbsp;</div>
						<div class="name">{$up_products.f2.left.product_name|truncate:$name_size:"..."}</div>
						<div class="namebg"></div>
					</div>
					<div class="pr">
						<a><img src="{$base_url}upload/images/{$up_products.f2.right.image}" width="100%" height="100%"/></a>
						<div class="text">
							<div class="name">{$up_products.f2.right.product_name}</div>
							<div class="price">仅售：<span class="color_red">￥{$up_products.f2.right.price|string_format:'%d'}</span></div>
						</div>
						<div class="textbg"></div>
					</div>
				</div>
				<ul class="plist margintop">
					{foreach item=p from=$four_products['f2']}
					<li>
						<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image}" width="238" height="238"/></a>
						<div class="text">
							<div class="name"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}" title="{$p.product_name}">{$p.product_name|truncate:$name_size:"..."}</a></div>
							<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
						</div>
						<div class="textbg"></div>
					</li>
					{/foreach}
				</ul>
			</div>
		</div>
	</div>
	<a><img class="linkimg" src="{$template_url}resources/images/temp/showimg1.jpg"/></a>
	<div class="blockw margintop">
		<div class="block f3" id="floor3">
			<div class="bt">
				<span class="t">F3 家纺家饰 Home textile home act the role ofing</span>
				<ul class="list">
					<a href="{$url_base}index.php?go=kmall.ptype.lists"><li class="more"></li></a>
				</ul>
			</div>
			<div class="bline"><div class="i"></div></div>
			<div class="bc">
				<div class="hotp">
					<div class="pl">
						<a><img src="{$base_url}upload/images/{$up_products.f3.left.image_large}" width="100%" height="100%"/></a>
						<div class="price">￥{$up_products.f3.left.price|string_format:'%d'}&nbsp;</div>
						<div class="name">{$up_products.f3.left.product_name|truncate:$name_size:"..."}</div>
						<div class="namebg"></div>
					</div>
					<div class="pr">
						<a><img src="{$base_url}upload/images/{$up_products.f3.right.image}" width="100%" height="100%"/></a>
						<div class="text">
							<div class="name">{$up_products.f3.right.product_name}</div>
							<div class="price">仅售：<span class="color_red">￥{$up_products.f3.right.price|string_format:'%d'}</span></div>
						</div>
						<div class="textbg"></div>
					</div>
				</div>
				<ul class="plist margintop">
					{foreach item=p from=$four_products['f3']}
					<li>
						<a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}"><img src="{$base_url}upload/images/{$p.image}" width="238" height="238"/></a>
						<div class="text">
							<div class="name"><a target="_blank" href="{$url_base}index.php?go=kmall.product.view&product_id={$p.product_id}" title="{$p.product_name}">{$p.product_name|truncate:$name_size:"..."}</a></div>
							<div class="price color_red">￥{$p.price|string_format:'%d'}</div>
						</div>
						<div class="textbg"></div>
					</li>
					{/foreach}
				</ul>
			</div>
		</div>
	</div>
</div>
{/block}
