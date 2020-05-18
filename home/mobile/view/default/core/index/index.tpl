{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
	<!--banner start-->
	<div id="slider">
		<div class="swiper-container clearfix" style="width:100%;height:auto;">
			<ul class="swiper-wrapper">
				{foreach item=b from=$banner}
				<li class="swiper-slide">
					<a href="{$b->links}">
						<img src="{$upload_url}images/{$b->url}"/>
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
				{*<span>券商城</span>*}
			{*</a>*}
			{foreach item=p from=$ptype_arr}
			<a href="{$url_base}index.php?go=mobile.type.lists_info2&ptype_id={$p->ptype_id}">
				<img src="{$upload_url}images/{$p->ico}" />
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
				<img src="{$upload_url}images/{$banner2->url}"/>
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
					<a href="{$url_base}index.php?go=mobile.type.lists_info&ptype_id={$p->ptype_id}">
						<div class="secskill-more fr">
							<span>查看更多</span>
							<span class="sprite-icon"></span>
						</div>
					</a>
				</div>
				<div class="floor-container center clearfix">
					{foreach item=g from=$p->goods}
						<div class="floor_left">
							<a href="{$url_base}index.php?go=mobile.goods.info&id={$g->product_id}" class="line">
								<img src="{$upload_url}images/{$g->image}"/>
								<div class="goods">
									<span>{$g->productShow|truncate:18:"...":true}</span>
								</div>
								<div class="goods_jifen">
									￥{$g.price|string_format:'%d'}+{$g.jifen|string_format:'%d'}券
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
    <script>
	function heredoc(fn) {
		return fn.toString().split('\n').slice(1,-1).join('\n') + '\n';
	}

	var tmpl = heredoc(function(){
		/*
        <div class="floor clearfix">
            <div class="floor-container">
                <div class="title-wrap">
                    <span class="sprite-icon secskill-icon fl"></span>
                    <h3 class="secskill-title fl">#pname#</h3>
                    <a href="{$url_base}index.php?go=mobile.type.lists_info&ptype_id=#pptype_id#">
                        <div class="secskill-more fr">
                            <span>查看更多</span>
                            <span class="sprite-icon"></span>
                        </div>
                    </a>
                </div>
                <div class="floor-container center clearfix">
                    #product_content#
                </div>
            </div>
        </div>
		*/
	});

    var ptmpl = heredoc(function(){
		/*
        <div class="floor_left">
            <a href="{$url_base}index.php?go=mobile.goods.info&id=#gproduct_id#" class="line">
                <img src="{$upload_url}images/#gimage#"/>
                <div class="goods">
                    <span>#productShow#</span>
                </div>
                <div class="goods_jifen">
                    ￥#gprice#+#gjifen#券
                </div>
            </a>

        </div>
    	*/
	});

    $(function(){
        $.ajax({
            url:"api/mobile/index.php",
            dataType: "json",
            success: function(response){
                var data = response.data;
                if ( data && data.length > 0 ) {
                    var ptype_product;
                    var product;
                    var result         = "";
					var presult        = "";
                    var productContent = "";
                    for (var i = 0; i < data.length; i++) {
                        result         = "";
                        ptype_product  = data[i];
                        result         = tmpl.replace("#pname#", ptype_product.name);
                        result         = result.replace("#pptype_id#", ptype_product.ptype_id);
                        
                        products       = ptype_product.goods;
						presult        = "";
                        productContent = "";
                        for (var j = 0; j < products.length; j++) {
                            var product = products[j];
                            productContent = ptmpl.replace("#gproduct_id#", product.product_id);
                            productContent = productContent.replace("#gimage#", product.image);
                            productContent = productContent.replace("#productShow#", product.productShow);
                            productContent = productContent.replace("#gprice#", product.price);
                            productContent = productContent.replace("#gjifen#", product.jifen);
							presult += productContent;
							presult  = presult.replace("/*", "");
							presult  = presult.replace("*/", "");
                        }
                        result = result.replace("#product_content#", presult);
						result = result.replace("/*", "");
						result = result.replace("*/", "");
                        $("main").append(result);
                    }
                }
            }
        });
	});
    </script>
    




{/block}
