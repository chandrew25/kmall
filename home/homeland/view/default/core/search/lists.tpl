{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
    <div class="int_title">
        <span class="int_pic">
            <a href="{$url_base}index.php?go=mobile.index.index">
                <img src="{$template_url}resources/images/jifen/left.png"/>
            </a>
        </span>
        {$search_keyword}
    </div>
    {*<div class="secskill-content inner_pages topline">*}
        {*<ul class="swiper-wrapper inner_nav">*}
            {*{foreach from=$ptype item=top_ptype key=index}*}
                {*<li class="swiper-slide inner_con {if $index==0}inner_con_style{/if}">*}
                    {*{$top_ptype->name}*}
                    {*<span class="inner_border_con" {if $index==0}style="display: block;"{/if} ></span>*}
                {*</li>*}
            {*{/foreach}*}
        {*</ul>*}
    {*</div>*}
    <!--商品-->
    <main>
        <div class="best_Sellers best_top clearfix" style="margin-top: 40px;">
                <ul {if $index==0}style="display: block;"{/if} class="clearfix best_content">
                    {foreach from=$products item=goods key=index}
                        <a href="{$url_base}index.php?go=mobile.goods.info&id={$goods->product_id}">
                            <li class="border_right fl">
                                <img src="{$url_base}upload/images/{$goods->image}" />
                                <span>{$goods->productShow}</span>
                                <span class="int_color">￥{$goods.price|string_format:'%.2f'}+{$goods.jifen|string_format:'%d'}积分</span>
                            </li>
                        </a>
                    {/foreach}
                </ul>
        </div>
        <p class="notice">没有更多商品了！</p>
    </main>
    <div id="back_top">
        <a href="#"><img src="{$template_url}resources/images/xqq/the_top.png" /></a>
    </div>
    {/block}
