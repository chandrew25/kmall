{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="main" class="outermost_width">
        <div class="navi_left">
            <ul class="box">
                <li class="title">全部分类</li>
                {foreach item=cate_title from=$ptype_2_level name=ptype_level} 
                <li>
                    <div class="t2">
                        <div class="t2_img"><img src="{$template_url}resources/images/upload/tv{$smarty.foreach.ptype_level.iteration}.png" alt="" /></div>
                        <div class="t2_info">&nbsp;{$cate_title.name}</div>
                    </div>
                    <ul class="items">
                        {foreach item=cate from=$cate_title.children}
                        <li><a href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$cate.ptype_id}" title="{$cate.name}">{$cate.nameShow}</a></li>
                        {/foreach} 
                    </ul>
                </li>
                {/foreach}
            </ul>
            <ul class="box2">
                <li class="title">本周热销商品</li>
                {foreach item=hot_product from=$top_seller}   
                <li class="products">
                    <div class="pic"> 
                        <a href="{$url_base}index.php?go=kmall.product.view&product_id={$hot_product.product_id}" target="_blank">
                            <img src="{$url_base}/upload/images/{$hot_product.image}" width="90px" height="90px" alt="{$hot_product.product_name}" />
                        </a>
                    </div>
                    <div class="intro">
                        <div class="words">
                            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$hot_product.product_id}" title="{$hot_product.product_name}" target="_blank">{$hot_product.product_name|truncate:28:"..":true}</a>
                        </div>
                        <!--<div class="market_prise">市场价：<span class="line-through">￥{$hot_product.market_price|string_format:'%d'}</span></div>
                        <div class="prise">￥{$hot_product.price|string_format:'%d'}</div>-->
                        <div class="prise">￥{$hot_product.price|string_format:'%.2f'}</div>
                    </div>
                </li>
                {/foreach} 
            </ul>
            {if isset($smarty.session.member_id)&&$history_items}
            <ul class="box2">
                <li class="title">最近浏览过</li>
                {foreach item=history_item from=$history_items}
                <li class="products">
                    <div class="pic"><a href="{$url_base}index.php?go=kmall.product.view&product_id={$history_item.product_id}" target="_blank"><img src="{$url_base}/upload/images/{$history_item.image}" width="90px" height="90px" alt="{$history_item.product_name}" /></a></div>
                    <div class="intro">
                        <div class="words">
                            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$history_item.product_id}" title="{$history_item.product_name}" target="_blank">{$history_item.product_name|truncate:28:"..":true}</a>
                        </div>
                        <!--<div class="market_prise">市场价：<span class="line-through">￥{$history_item.market_price|string_format:'%d'}</span></div>
                        <div class="prise">￥{$history_item.price|string_format:'%d'}</div>-->
                        <div class="prise">￥{$history_item.price|string_format:'%.2f'}</div>
                    </div>
                </li>
                {/foreach}
                <li class="color_black delete"><a href="{$url_base}index.php?go=kmall.product.baseDeleteSeeProduct">清除浏览记录</a></li>
            </ul>
            {/if}
        </div>
        <div class="content">
            <div class="recommand">
                <div class="part_one">
                    <div class="title">推荐产品</div>
                    <div class="next">
                        <input id="prev_btn_re" class="btn paging_disabled_btn" disabled type="image" src="{$template_url}resources/images/arrow/arrowleft.jpg" alt="上一页" title="上一页"/>
                        <input id="next_btn_re" class="btn paging_disabled_btn" disabled type="image" src="{$template_url}resources/images/arrow/arrowright.jpg" alt="下一页" title="下一页"/>
                        <input type="hidden" id="ptype_id" value="{$ptype_id}"/>
                        <input type="hidden" id="rec_products_after" value="{$rec_products_after}"/><!--是否有下一页推荐商品-->
                        <input type="hidden" id="rec_products_no" value="{$rec_products_no}"/><!--第一个商品序号-->
                        <input type="hidden" id="url_base" value="{$url_base}"/><!--文件根路径-->
                        <input type="hidden" id="template_url" value="{$template_url}"/><!--文件根路径-->
                    </div>
                </div>
                <ul id="products_re">
                {foreach item=rec_product from=$rec_products}
                    <li>
                        <div class="recommend_product_new">
                            <div class="r_p_n_img">
                                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$rec_product.product_id}" title="{$rec_product.product_name}" target="_blank">
                                    <img src="{$url_base}/upload/images/{$rec_product.image}" alt="{$rec_product.product_name}" width="87" height="87" />
                                </a>
                            </div>
                            <div class="r_p_n_intro">
                                <div class="intro_name color_black">
                                    <a href="{$url_base}index.php?go=kmall.product.view&product_id={$rec_product.product_id}" title="{$rec_product.product_name}" target="_blank">{$rec_product.product_name|truncate:12:"..":true}</a>
                                </div>
                                <div class="intro_words">{$rec_product.message|truncate:12:"..":true}</div>
                                <div class="intro_prise">
                                    <span class="intro_selling">￥{$rec_product.price|string_format:'%.2f'}&nbsp;</span><!--<span class="intro_del">￥{$rec_product.market_price|string_format:'%d'}</span>-->
                                </div>
                                <div class="intro_img">
                                    <a href="{$url_base}index.php?go=kmall.product.addProduct&product_id={$rec_product.product_id}&num=1&addtype=1" target="_blank">
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                {/foreach}
                </ul>
            </div>
            <div class="choice">
                <div class="classify">
                    <div class="t">品牌：</div>
                    <ul>
                        <li class="selected_link_pre {if $brand_id==0}selected_link{/if}" ><a href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&brand_id=0&attr_key={$attr_key}&sorting={$smarty.get.sorting}">全部</a></li>
                        {foreach item=search_brand from=$search_brands}
                        <li class="selected_link_pre {if $brand_id == $search_brand.brand_id}selected_link{/if}" ><a href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&brand_id={$search_brand.brand_id}&attr_key={$attr_key}&sorting={$smarty.get.sorting}">{$search_brand.brand.brand_name}</a></li>
                        {/foreach}
                    </ul>
                </div>
            {foreach item=attribute from=$attributes}
                <div class="classify">
                    <div class="t">{$attribute.attribute_name}：</div>
                    <ul>
                        <li class="selected_link_pre {if $attr_selected[$attribute.attribute_id]==0}selected_link{/if}" ><a href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&attr_key={$attr_key}&attribute1_id={$attribute.attribute_id}&attribute_id=0&brand_id={$smarty.get.brand_id|default:'0'}&sorting={$smarty.get.sorting}">全部</a></li>
                        {foreach item=attribute_val from=$attribute.children}
                        <li class="selected_link_pre {if $attr_selected[$attribute.attribute_id]==$attribute_val.attribute_id}selected_link{/if}" ><a href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&attr_key={$attr_key}&attribute1_id={$attribute.attribute_id}&attribute_id={$attribute_val.attribute_id}&brand_id={$smarty.get.brand_id|default:'0'}&sorting={$smarty.get.sorting}">{$attribute_val.attribute.attribute_name}</a></li>
                        {/foreach}
                    </ul>
                </div>
            {/foreach}
            </div>
            <div class="head">
                <div class="bottom"></div>
                <div class="labs">
                    <ul class="clicks">
                        <li {if $sorting==1}class="selected_link_sort"{/if}><a class="fixpng" href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&attr_key={$attr_key}&brand_id={$smarty.get.brand_id|default:'0'}&sorting=1">热门</a></li>
                        <li class="line">&nbsp;&nbsp;|&nbsp;&nbsp;</li>
                        <li {if $sorting==2}class="selected_link_sort"{/if}><a class="fixpng" href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&attr_key={$attr_key}&brand_id={$smarty.get.brand_id|default:'0'}&sorting=2">最新</a></li>
                        <li class="line">&nbsp;&nbsp;|&nbsp;&nbsp;</li>
                        <li {if $sorting==3}class="selected_link_sort"{/if}><a class="fixpng" href="{$url_base}index.php?go=kmall.display.lists&ptype_id={$ptype_id}&attr_key={$attr_key}&brand_id={$smarty.get.brand_id|default:'0'}&sorting=3">价格</a></li>
                    </ul>
                </div>
            </div>
            <ul class="pros">
                {foreach item=product from=$products name=foo}  
                {if $smarty.foreach.foo.iteration % 3 ==1}
                <li class="box">
                    <ul class="items">
                {/if}
                        <li>
                            <div class="pic">
                                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" target="_blank"><img src="{$url_base}/upload/images/{$product.image}" width='223px' height='158px' alt="{$product.product_name}" /></a>
                                <div class="lable"><img class="fixpng" src="{$template_url}resources/images/Ninki.png" alt="" /></div>
                            </div>
                            <div class="name color_black">
                                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$product.product_id}" target="_blank">{$product.product_name|truncate:40:"...":true}</a>
                            </div>
                            <div class="intro">{$product.message|truncate:'20'}</div>
                            <div class="prise">  
                                ￥{$product.price|string_format:'%.2f'}                                            
                            </div>
                            <div class="buy"> 
                                <a href="{$url_base}index.php?go=kmall.product.addProduct&product_id={$product.product_id}&num=1"><div class="buy_img add_cart"></div></a>
                                <a href="{$url_base}index.php?go=kmall.product.addProduct&product_id={$product.product_id}&num=1&addtype=1" target="_blank"><div class="buy_img imm_buy"></div></a>
                            </div>
                        </li>
                {if $smarty.foreach.foo.iteration % 3 ==0||$smarty.foreach.foo.iteration ==$smarty.foreach.foo.total}
                    </ul>
                </li>
                {/if}
            {/foreach}
            </ul>
            <my:page src="{$url_base}index.php?go=kmall.display.lists&ptype_id={$smarty.get.ptype_id}&brand_id={$smarty.get.brand_id|default:'0'}&price_range={$smarty.get.price_range|default:'0'}&sorting={$smarty.get.sorting|default:'1'}" />
            </div>
        </div>    
    </div>
{/block}
