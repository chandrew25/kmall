{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div class="floor" id="floor" style="display: none;">
        <div class="i"></div>
        <div class="t" to="floor1">F1 节日礼品</div>
        <div class="l"></div>
        <div class="t" to="floor1">F2 员工福利</div>
        <div class="l"></div>
        <div class="t" to="floor1">F3 客户礼品</div>
        <div class="l"></div>
        <div class="t" to="floor2">F4 票卡卷&nbsp;&nbsp;&nbsp;</div>
        <div class="l"></div>
        <div class="t" to="floor3">F5 团购活动</div>
    </div>
    <div class="focus_box center">
        <div class="imagebox" id="banner">
            <div class="imgw">
                <!--  <a href="{$url_base}index.php?go=kmall.dzx.index">
                    <img src="{$template_url}resources/images/kmall/image1.jpg" alt="">
                </a>
                <a href="{$url_base}index.php?go=kmall.festival.lists" target="_blank">
                    <img src="{$template_url}resources/images/kmall/image2.jpg" alt="">
                </a>
                <a href="{$url_base}index.php?go=kmall.dzx.index">
                    <img src="{$template_url}resources/images/kmall/image1.jpg" alt="">
                </a>
                <a href="{$url_base}index.php?go=kmall.dzx.index">
                    <img src="{$template_url}resources/images/kmall/image2.jpg" alt="">
                </a>
                <a href="{$url_base}magazine/index.html" target="_blank">
                    <img src="{$template_url}resources/images/kmall/images5.jpg" alt="">
                </a>-->
                <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=1">
                    <img src="{$template_url}resources/images/kmall/images4.jpg" alt="">
                </a>
                 <!--<a href="{$url_base}index.php?go=kmall.voucher.index">
                    <img src="{$template_url}resources/images/kmall/images6.jpg" alt="">
                </a> -->
            </div>
            <!-- <div class="btnw"></div> -->
        </div>
        <div class=""></div>
    </div>
    <div class="hot_sell_box box">
        <div class="tipbar">
            <a href="" class="more">更多</a>
        </div>
        {foreach item=p from=$f0_arr}
        <div class="hot_item">
            <div class="img_box">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">
                <img src="{$url_base}upload/images/{$p->image}">
            </a>
            </div>
            <p>
                <a href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">{$p->product_name|truncate:45}</a>
            </p>
            <p>
                <span class="today_price_tag">今日特价</span>
                <span class="today_price">￥{$p.price|string_format:'%d'}</span>
            </p>
        </div>
        {/foreach}
        <div class="hot_right">
            <a href="{$url_base}magazine/index.html" target="_blank">
                <img src="{$template_url}resources/images/kmall/hot_right.jpg" alt="">
            </a>
        </div>
        <div class="clear"></div>
    </div>
    <div class="brand_box box">
        <div class="btn_move move_prv">
            <div class="btn_move_in"></div>
        </div>
        <div class="brand_lists">
            {foreach item=brand from=$brands}
            <div class="brand_item">
                <a href="">
                    <img src="{$url_base}upload/images/{$brand->brand_logo}">
                </a>
                <div>
                    <a href="">{$brand->brand_name}</a>
                </div>
            </div>
            {/foreach}
        </div>
        <div class="btn_move move_next">
            <div class="btn_move_in"></div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="floor_box box">
        <div class="floor_tip_bar">
            <div class="floor_title">
                <img src="{$template_url}resources/images/kmall/title_f1.png">
            </div>
            <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=929" target="_blank" class="more">更多</a>
        </div>
        <a class="top_item" href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=929" target="_blank">
            <img src="{$template_url}resources/images/kmall/top_f1.jpg">
        </a>
        {foreach item=p from=$f1_arr}
        <div class="floor_item">
            <img src="{$url_base}upload/images/{$p->image}">
            <div>
                <a class="left" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">{$p->product_name|truncate:13:"...":true}</a>
                <span class="right">￥{$p.price|string_format:'%d'}</span>
            </div>
            <div class="op_bg"></div>
        </div>
        {/foreach}
        <div class="clear"></div>
    </div>
    <div class="banner_box center">
        <a href="{$url_base}index.php?go=kmall.ptype.lists" target="_blank">
            <img src="{$template_url}resources/images/kmall/banner_f1.jpg" alt="">
        </a>
    </div>
    <div class="floor_box box">
        <div class="floor_tip_bar">
            <div class="floor_title">
                <img src="{$template_url}resources/images/kmall/title_f2.png">
            </div>
            <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=888" class="more">更多</a>
        </div>
        <a class="top_item" href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=888" target="_blank">
            <img src="{$template_url}resources/images/kmall/top_f2.png">
        </a>
        {foreach item=p from=$f2_arr}
        <div class="floor_item">
            <img src="{$url_base}upload/images/{$p->image}">
            <div>
                <a class="left" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">{$p->product_name|truncate:13:"...":true}</a>
                <span class="right">￥{$p.price|string_format:'%d'}</span>
            </div>
            <div class="op_bg"></div>
        </div>
        {/foreach}
        <div class="clear"></div>
    </div>
    <div class="banner_box center">
        <a href="{$url_base}index.php?go=kmall.ptype.lists" target="_blank">
            <img src="{$template_url}resources/images/kmall/banner_f2.jpg" alt="">
        </a>
    </div>
    <div class="floor_box box">
        <div class="floor_tip_bar">
            <div class="floor_title">
                <img src="{$template_url}resources/images/kmall/title_f3.png">
            </div>
            <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=640" target="_blank" class="more">更多</a>
        </div>
        <a class="top_item" href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=640" target="_blank">
            <img src="{$template_url}resources/images/kmall/top_f3.png">
        </a>
        {foreach item=p from=$f3_arr}
        <div class="floor_item">
            <img src="{$url_base}upload/images/{$p.image}">
            <div>
                <a class="left" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">{$p->product_name|truncate:13:"...":true}</a>
                <span class="right">￥{$p.price|string_format:'%d'}</span>
            </div>
            <div class="op_bg"></div>
        </div>
        {/foreach}
        <div class="clear"></div>
    </div>
    <div class="banner_box center">
        <a href="{$url_base}index.php?go=kmall.ptype.lists" target="_blank">
            <img src="{$template_url}resources/images/kmall/banner_f3.jpg" alt="">
        </a>
    </div>
    <div class="floor_box box">
        <div class="floor_tip_bar">
            <div class="floor_title">
                <img src="{$template_url}resources/images/kmall/title_f4.jpg">
            </div>
            <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id=931" target="_blank" class="more">更多</a>
        </div>
        {foreach item=p from=$f4_arr}
        <div class="floor_item">
            <img src="{$url_base}upload/images/{$p->image}">
            <div>
                <a class="left" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">{$p->product_name|truncate:13:"...":true}</a>
                <span class="right">￥{$p.price|string_format:'%d'}</span>
            </div>
            <div class="op_bg"></div>
        </div>
        {/foreach}
        <div class="clear"></div>
    </div>
    <div class="floor_box box">
        <div class="floor_tip_bar">
            <div class="floor_title">
                <img src="{$template_url}resources/images/kmall/title_f5.png">
            </div>
            <a href="" class="more">更多</a>
        </div>
        {foreach item=p from=$f5_arr}
        <div class="floor_item">
            <img src="{$url_base}upload/images/{$p->image}">
            <div>
                <a class="left" href="{$url_base}index.php?go=kmall.product.view&product_id={$p->product_id}">{$p->product_name|truncate:13:"...":true}</a>
                <span class="right">￥{$p.price|string_format:'%d'}</span>
            </div>
            <div class="op_bg"></div>
        </div>
        {/foreach}
        <div class="clear"></div>
    </div>
{/block}
