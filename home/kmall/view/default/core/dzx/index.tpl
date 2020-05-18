{extends file="$templateDir/layout/home/layout.tpl"}  
{block name=body}
<input type="hidden" id="template_url" value="{$template_url}"/>
<script>
    $(function(){
        /***************图片延迟加载***************/
        $("img[original]").lazyload({
            placeholder:$("#template_url").val()+"resources/images/public/public/loading.jpg",
            effect:"fadeIn"
        });
    });
</script>


<div class="activity normalWith">
    <a href="{$url_base}index.php?go=kmall.product.view&product_id=14" target="_blank">
        <div class="act_header"></div>
    </a>
    <div class="act_center">
        <div class="act_top">
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=2" target="_blank"><div class="act_immediate_buy act_immediate_buy398"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=3" target="_blank"><div class="act_coupon_buy act_coupon_buy398"></div></a>
            <div class="act_pinfo act_pinfo398">
                <div class="act_pname">阳澄湖大闸蟹398型</div>
                <div class="act_dottedline png"></div>
                <div class="act_desc">阳澄湖3.0-3.4两公蟹X4只</div>
                <div class="act_desc">阳澄湖2.0-2.4两母蟹X4只</div>
                <div class="act_desc">赠品：吃蟹工具1套、紫苏包X1</div>
                <div class="act_desc act_desc_mprice"><font>原价：</font><font class="act_decoration">￥{$product398Packages->market_price|string_format:'%.2f'}</font></div>
                <div class="act_price_info">
                    <div class="act_price_name"></div>
                    <div class="act_price">
                        <span class="act_price_symbol">￥</span><span class="act_price_numeric">{$product398Packages->price|string_format:'%.2f'}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="act_loop">
            <div class="act_pinfo act_pinfo598">
                <div class="act_pname">阳澄湖大闸蟹598型</div>
                <div class="act_dottedline png"></div>
                <div class="act_desc">阳澄湖3.0-3.4两公蟹X5只</div>
                <div class="act_desc">阳澄湖2.0-2.4两母蟹X5只</div>
                <div class="act_desc">赠品：吃蟹工具1套、紫苏包X1</div>
                <div class="act_desc act_desc_mprice"><font>原价：</font><font class="act_decoration">￥{$product598Packages->market_price|string_format:'%.2f'}</font></div>
                <div class="act_price_info">
                    <div class="act_price_name"></div>
                    <div class="act_price">
                        <span class="act_price_symbol">￥</span><span class="act_price_numeric">{$product598Packages->price|string_format:'%.2f'}</span>
                    </div>
                </div>
            </div>
            <div class="act_pinfo act_pinfo798">
                <div class="act_pname">阳澄湖大闸蟹798型</div>
                <div class="act_dottedline png"></div>
                <div class="act_desc">阳澄湖3.5-3.9两公蟹X4只</div>
                <div class="act_desc">阳澄湖2.5-2.9两母蟹X4只</div>
                <div class="act_desc">赠品：吃蟹工具1件套X1、紫苏包X1</div>
                <div class="act_desc act_desc_mprice"><font>原价：</font><font class="act_decoration">￥{$product798Packages->market_price|string_format:'%.2f'}</font></div>
                <div class="act_price_info">
                    <div class="act_price_name"></div>
                    <div class="act_price">
                        <span class="act_price_symbol">￥</span><span class="act_price_numeric">{$product798Packages->price|string_format:'%.2f'}</span>
                    </div>
                </div>
            </div>
            <div class="act_pinfo act_pinfo998">
                <div class="act_pname">阳澄湖大闸蟹998型</div>
                <div class="act_dottedline png"></div>
                <div class="act_desc">阳澄湖4.0-4.4两公蟹X4只</div>
                <div class="act_desc">阳澄湖3.0-3.4两母蟹X4只</div>
                <div class="act_desc">赠品：吃蟹工具1件套X1、紫苏包X1</div>
                <div class="act_desc act_desc_mprice"><font>原价：</font><font class="act_decoration">￥{$product998Packages->market_price|string_format:'%.2f'}</font></div>
                <div class="act_price_info">
                    <div class="act_price_name"></div>
                    <div class="act_price">
                        <span class="act_price_symbol">￥</span><span class="act_price_numeric">{$product998Packages->price|string_format:'%.2f'}</span>
                    </div>
                </div>
            </div>
            <div class="act_pinfo act_pinfo1398">
                <div class="act_pname">阳澄湖大闸蟹1398型</div>
                <div class="act_dottedline png"></div>
                <div class="act_desc">阳澄湖4.0-4.4两公蟹X5只</div>
                <div class="act_desc">阳澄湖3.0-3.4两母蟹X5只</div>
                <div class="act_desc">赠品：吃蟹工具1件套X1、紫苏包X1</div>
                <div class="act_desc act_desc_mprice"><font>原价：</font><font class="act_decoration">￥{$product1398Packages->market_price|string_format:'%.2f'}</font></div>
                <div class="act_price_info">
                    <div class="act_price_name"></div>
                    <div class="act_price">
                        <span class="act_price_symbol">￥</span><span class="act_price_numeric">{$product1398Packages->price|string_format:'%.2f'}</span>
                    </div>
                </div>
            </div>
            <div class="act_pinfo act_pinfo1698">
                <div class="act_pname">阳澄湖大闸蟹1698型</div>
                <div class="act_dottedline png"></div>
                <div class="act_desc">阳澄湖4.2-4.6两公蟹X5只</div>
                <div class="act_desc">阳澄湖3.2-3.6两母蟹X5只</div>
                <div class="act_desc">赠品：吃蟹工具1件套X1、紫苏包X1</div>
                <div class="act_desc act_desc_mprice"><font>原价：</font><font class="act_decoration">￥{$product1698Packages->market_price|string_format:'%.2f'}</font></div>
                <div class="act_price_info">
                    <div class="act_price_name"></div>
                    <div class="act_price">
                        <span class="act_price_symbol">￥</span><span class="act_price_numeric">{$product1698Packages->price|string_format:'%.2f'}</span>
                    </div>
                </div>
            </div>
            <div class="act_ptype act_ptype598"></div>
            <div class="act_ptype act_ptype798"></div>
            <div class="act_ptype act_ptype998"></div>
            <div class="act_ptype act_ptype1398"></div>
            <div class="act_ptype act_ptype1698"></div>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=4" target="_blank"><div class="act_immediate_buy act_immediate_buy598 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=6" target="_blank"><div class="act_immediate_buy act_immediate_buy798 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=8" target="_blank"><div class="act_immediate_buy act_immediate_buy998 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=10" target="_blank"><div class="act_immediate_buy act_immediate_buy1398 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=12" target="_blank"><div class="act_immediate_buy act_immediate_buy1698 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=5" target="_blank"><div class="act_coupon_buy act_coupon_buy598 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=7" target="_blank"><div class="act_coupon_buy act_coupon_buy798 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=9" target="_blank"><div class="act_coupon_buy act_coupon_buy998 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=11" target="_blank"><div class="act_coupon_buy act_coupon_buy1398 png"></div></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=13" target="_blank"><div class="act_coupon_buy act_coupon_buy1698 png"></div></a>
        </div>
    </div>
    <div class="act_clear"></div>
</div>
{/block}