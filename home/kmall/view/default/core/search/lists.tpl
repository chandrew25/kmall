{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="main" class="outermost_width">
        <div class="content">
            <div class="head">
                <div id="search_title">
                    <span class="bold">搜索关键字为：<span class="keyword_red">{$search_keyword|default:'无'}</span></span>
                    <span class="search_count">总共找到(<span class="keyword_red">{$count}</span>)件商品</span>
                </div>
                <div class="bottom"></div>
                <div class="labs">
                    <ul class="clicks">
                        {if $sorting==1}
                            {if $orderby==1}
                            <li class="selected_link_sort2"><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=1&orderby=2">销量</a>
                            {else}
                            <li class="selected_link_sort"><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=1&orderby=1">销量</a>
                            {/if}
                        </li>
                        {else}
                         <li><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=1&orderby=1">销量</a></li>
                        {/if}
                        <li class="line">&nbsp;&nbsp;|&nbsp;&nbsp;</li>
                        {if $sorting==2}
                            {if $orderby==1}
                            <li class="selected_link_sort2"><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=2&orderby=2">最新</a>
                            {else}
                            <li class="selected_link_sort"><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=2&orderby=1">最新</a>
                            {/if}
                        </li>
                        {else}
                         <li><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=2&orderby=1">最新</a></li>
                        {/if}
                        <li class="line">&nbsp;&nbsp;|&nbsp;&nbsp;</li>
                        {if $sorting==3}
                            {if $orderby==1}
                            <li class="selected_link_sort2"><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=3&orderby=2">价格</a>
                            {else}
                            <li class="selected_link_sort"><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=3&orderby=1">价格</a>
                            {/if}
                        </li>
                        {else}
                         <li><a class="fixpng" href="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting=3&orderby=1">价格</a></li>
                        {/if}
                    </ul>
                </div>
            </div>
            <ul class="pros">
                {foreach item=product from=$products name=foo}  
                {if $smarty.foreach.foo.iteration % 4 ==1}
                <li class="box">
                    <ul class="items">
                {/if}
                        <li>
                            <div class="pic">
                                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" target="_blank">
                                    <img src="{$url_base}/upload/images/{$product.image}" alt="{$product.productShow}" />
                                </a>
                                <!-- <div class="lable">
                                    <img class="fixpng" src="{$template_url}resources/images/Ninki.png" alt="" />
                                </div> -->
                            </div>
                            <div class="name color_black">
                                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" target="_blank">{$product.productShow}</a>
                            </div>
                            {if $product.price!=0}
                            <div class="prise">
                                <span class="lable">市场价：</span>
                                <span class="market_price">￥{$product.market_price|string_format:'%.2f'}</span>
                                <span class="lable">价格：</span>
                                <span class="price">￥{$product.price|string_format:'%.2f'}+{$product.jifen|string_format:'%d'}积分
                                </span>
                            </div>
                            <div class="buy">
                                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" target="_blank" ><div class="buy_img add_cart">加入购物车</div></a>
                            </div>
                            {else}
                            <div class="prise">
                                待上市
                            </div>
                            {/if}
                        </li>
                {if $smarty.foreach.foo.iteration % 4 ==0||$smarty.foreach.foo.iteration ==$smarty.foreach.foo.total}
                    </ul>
                </li>
                {/if}
            {/foreach}
            </ul>
            <div style="float:left;width:100%;margin-bottom: 20px;">
                <my:page src="{$url_base}index.php?go=kmall.search.lists&search_keyword={$search_keyword}&sorting={$sorting}&orderby={$orderby}" />
            </div>
            </div>
        </div>    
    </div>
{/block}