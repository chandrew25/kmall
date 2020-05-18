{foreach from=$goods item=p}
    <a href="{$url_base}index.php?go=mobile.goods.info&id={$p->product_id}">
        <li class="border_right fl">
            <img src="{$url_base}upload/images/{$p->image}" />
            <span>{$p->productShow}</span>
            <span class="int_color">￥{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}券</span>
        </li>
    </a>
{/foreach}
