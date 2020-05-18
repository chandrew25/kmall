{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="shadow">
        <div class="main">
            <div class="light_banner light_border">
                <img src="{$template_url}resources/images/light/banner.jpg">
            </div>
            <div class="light_intro light_border">
                <div class="light_i_detail">
                    <p class="light_i_d_p"><span class="light_i_d_name">上海亚明照明有限公司(原上海亚明灯泡厂有限公司)</span>创建于1923年，是中国第一家民族照明企业，也是中国第一只灯泡的制造者。“亚”字品牌，更是近一个世纪家喻户晓的著名民族品牌。历经几十年的发展壮大，公司业已成为集研发、制造、营销和工程服务为一体的专业照明企业，形成了光源、电器、灯具、零部件产品系列，并以技术雄厚、规格齐全、质量上乘、服务优质而享誉海内外市场。</p>
                </div>
                <div class="light_i_pic">
                    <div class="light_i_p_block">
                        <div class="light_i_p_img">
                            <img src="{$template_url}resources/images/light/light1.jpg">
                        </div>
                        <div class="light_i_p_info">现代简约水晶灯LED吊灯</div>
                    </div>
                    <div class="light_i_p_block">
                        <div class="light_i_p_img">
                            <img src="{$template_url}resources/images/light/light2.jpg">
                        </div>
                        <div class="light_i_p_info">现代简约水晶灯LED吊灯</div>
                    </div>
                    <div class="light_i_p_block">
                        <div class="light_i_p_img">
                            <img src="{$template_url}resources/images/light/light3.jpg">
                        </div>
                        <div class="light_i_p_info">现代简约水晶灯LED吊灯</div>
                    </div>
                </div>
            </div>
            <div class="light_content">
                <div class="light_c_topbar">
                    <div class="light_c_t_name">排序:</div>
                    <ul class="light_c_t_ul">
                        <li class="{if $sorting==1}light_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.lightingele.lists&sorting=1">销量</a>
                        </li>
                        <li class="{if $sorting==2}light_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.lightingele.lists&sorting=2">最新</a>
                        </li>
                        <li class="{if $sorting==3}light_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.lightingele.lists&sorting=3">价格</a>
                        </li>
                        <li class="{if $sorting==4}light_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.lightingele.lists&sorting=4">人气</a>
                        </li>
                        <li class="{if $sorting==5}light_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.lightingele.lists&sorting=5">评论</a>
                        </li>
                    </ul>
                </div>
                <div class="light_c_lists">
                    {foreach item=eachgoods from=$goods name=pfoo}
                    <div class="light_c_l_show {if $smarty.foreach.pfoo.iteration % 4 ==0}light_c_l_show_last{/if}">
                        <div class="light_cls_pic">
                            <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                <img src="{$url_base}/upload/images/{$eachgoods.product.image}">
                            </a>
                        </div>
                        <div class="light_cls_title">
                            <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                <p>{$eachgoods.goods_name}</p>
                            </a>
                        </div>
                        <div class="light_cls_line"></div>
                        <div class="light_cls_deatil">
                            <div class="light_clsd_price">
                                <div class="light_clsdp_shoprice">商城价:</div>
                                {if $eachgoods.sales_price!=0}
                                <div class="light_clsdp_pricestyle light_clsdp_sign">￥</div>
                                <div class="light_clsdp_pricestyle">{$eachgoods.sales_price|string_format:"%.2f"}</div>
                                {else}
                                <div class="light_clsdp_pricestyle">&nbsp;&nbsp;&nbsp;&nbsp;待上市</div>
                                {/if}
                            </div>
                            <div class="light_clsd_cart">
                                {if $eachgoods.sales_price!=0}
                                <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                    <img class="fixpng" src="{$template_url}resources/images/public/cart.png">
                                </a>
                                {/if}
                            </div>
                        </div>
                    </div>
                    {/foreach}                                      
                    <div class="light_c_l_clear"></div>
                </div>
            </div>
            <div class="light_sort">
                <my:page src="{$url_base}index.php?go=kmall.lightingele.lists&sorting={$smarty.get.sorting|default:'1'}" />
                </div>
            </div>
        </div>
    </div>
{/block}