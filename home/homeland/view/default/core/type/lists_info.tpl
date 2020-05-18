{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
{*<div id="wrapper" class="inner_style">*}
    <div class="int_title">
        <span class="int_pic">
            <a href="{$url_base}index.php?go=mobile.index.index">
                <img src="{$template_url}resources/images/jifen/left.png"/>
            </a>
        </span>
        {$pty->name}
    </div>
    <div class="secskill-content inner_pages topline">
        <ul class="swiper-wrapper inner_nav">
            {foreach from=$ptype item=top_ptype key=index}

            <li class="swiper-slide inner_con {if $ptypeid==$top_ptype->ptype_id}inner_con_style{/if}">
                <a href="{$url_base}index.php?go=mobile.type.lists_info&ptype_id={$ptype_id}&ptypeid={$top_ptype->ptype_id}">
                {$top_ptype->name}
                </a>
                <span class="inner_border_con" {if $ptypeid==$top_ptype->ptype_id}style="display: block;"{/if} ></span>
            </li>

            {/foreach}
        </ul>
    </div>
    <!--商品-->
    <main>
        <div class="best_Sellers best_top clearfix">
            <ul style="display: block;" class="clearfix best_content">
                {foreach from=$goodsData item=p}
                <a href="{$url_base}index.php?go=mobile.goods.info&id={$p->product_id}">
                    <li class="border_right fl">
                        <img src="{$url_base}upload/images/{$p->image}" />
                        <span>{$p->productShow}</span>
                        <span class="int_color">￥{$p.price|string_format:'%.2f'}+{$p.jifen|string_format:'%d'}积分</span>
                    </li>
                </a>
                {/foreach}
            </ul>
        </div>
        <p class="notice">没有更多商品了！</p>
    </main>
{/block}
