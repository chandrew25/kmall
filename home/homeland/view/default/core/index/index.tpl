{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<!--banner start-->
	<div id="slider">
		<div class="swiper-container clearfix">
			<ul class="swiper-wrapper">
				{foreach item=b from=$banner}
				<li class="swiper-slide">
					<a href="{$b->links}">
						<img src="{$url_base}upload/images/{$b->url}"/>
					</a>
				</li>
				{/foreach}
			</ul>
		</div>
		<div class="swiper-pagination"></div>
	</div>
	<!--banner end-->

	<!--nav start-->
	<div id="nav">
		<nav class="clearfix">
			{*<a href="Integral_mall.html">*}
				{*<img src="{$template_url}resources/images/1.png" />*}
				{*<span>积分商城</span>*}
			{*</a>*}
			{foreach item=p from=$ptype_arr}
			<a href="/index.php?go=mobile.type.lists_info&ptype_id={$p->ptype_id}">
				<img src="{$url_base}upload/images/{$p->ico}" />
				<span>{$p->name}</span>
			</a>
			{/foreach}

		</nav>
	</div>
	<!--nav end-->

	<!--menu  start-->
	<main>

		<!--描述：nav adv -->
		<div class="adv">
			<a href="{$banner2->links}">
				<img src="{$url_base}upload/images/{$banner2->url}"/>
			</a>
		</div>
		<!--描述：nav adv -->
		<!--floor start-->
		{*<div class="floor clearfix">*}
			{*<div class="floor-container">*}
				{*<div class="title-wrap">*}
					{*<span class="sprite-icon secskill-icon fl"></span>*}
					{*<h2 class="secskill-title fl">生日专区</h2>*}
					{*<a href="Birthday_zone.html">*}
						{*<div class="secskill-more fr">*}
							{*<span>查看更多</span>*}
							{*<span class="sprite-icon"></span>*}
						{*</div>*}
					{*</a>*}
				{*</div>*}
				{*<div class="floor-container morencon">*}
					{*<div class="left">*}
						{*<a href="Birthday_zone.html"><img src="{$template_url}resources/images/birthday/fuirt.png"/></a>*}
					{*</div>*}
					{*<div class="right">*}
						{*<div class="top">*}
							{*<a href="Birthday_zone.html"><img src="{$template_url}resources/images/birthday/friut2.png"</a>*}
						{*</div>*}
						{*<div class="bottom">*}
							{*<a href="Birthday_zone.html" class="line"><img src="{$template_url}resources/images/birthday/birth3.png"/></a>*}
							{*<a href="Birthday_zone.html" ><img src="{$template_url}resources/images/birthday/birth3-07.png"/></a>*}
						{*</div>*}
					{*</div>*}
				{*</div>*}
			{*</div>*}
		{*</div>*}
		<!--floor start-->
		<!--floor_2 start-->
		{*<div class="floor clearfix">*}
			{*<div class="floor-container">*}
				{*<div class="title-wrap">*}
					{*<span class="sprite-icon secskill-icon fl"></span>*}
					{*<h2 class="secskill-title fl">果园飘香</h2>*}
					{*<a href="Orchard_fragrance.html">*}
						{*<div class="secskill-more fr">*}
							{*<span>查看更多</span>*}
							{*<span class="sprite-icon"></span>*}
						{*</div>*}
					{*</a>*}
				{*</div>*}
				{*<div class="floor-container">*}
					{*<div class="left">*}
						{*<a href="Orchard_fragrance.html" class="line"><img src="{$template_url}resources/images/furit/fuirt-08.png"/></a>*}
					{*</div>*}
					{*<div class="right">*}
						{*<div class="top">*}
							{*<a href="Orchard_fragrance.html"><img src="{$template_url}resources/images/furit/friut2-09.png"/></a>*}
						{*</div>*}
						{*<div class="top topline">*}
							{*<a href="Orchard_fragrance.html"><img src="{$template_url}resources/images/furit/friut2-10.png"/></a>*}
						{*</div>*}
					{*</div>*}
				{*</div>*}
			{*</div>*}
		{*</div>*}
		<!--floor_2 start-->
		<!--floor_3 start-->
		{foreach item=p from=$ptype_goods}
		<div class="floor clearfix">
			<div class="floor-container">
				<div class="title-wrap">
					<span class="sprite-icon secskill-icon fl"></span>
					<h3 class="secskill-title fl">{$p->name}</h3>
					<a href="/index.php?go=mobile.type.lists_info&ptype_id={$p->ptype_id}">
						<div class="secskill-more fr">
							<span>查看更多</span>
							<span class="sprite-icon"></span>
						</div>
					</a>
				</div>
				<div class="floor-container center clearfix">
					{foreach item=g from=$p->goods}
						<div class="floor_left">
							<a href="/index.php?go=mobile.goods.info&id={$g->product_id}" class="line">
								<img src="{$url_base}upload/images/{$g->image}"/>
								<div class="goods">
									<span>{$g->productShow|truncate:18:"...":true}</span>
								</div>
								<div class="goods_jifen">
									￥{$g.price|string_format:'%.2f'}+{$g.jifen|string_format:'%d'}积分
								</div>
							</a>

						</div>
					{/foreach}
				</div>
			</div>
		</div>
		{/foreach}
		<!--floor_3 start-->
	</main>
	<!--menu  end-->
{/block}
