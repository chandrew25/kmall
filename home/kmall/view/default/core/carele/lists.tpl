{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="shadow">
        <div class="main">
            <div class="carele_banner carele_border">
                <div class="carele_b_left">
                    <img src="{$template_url}resources/images/carele/banner.jpg">
                </div>
                <div class="carele_b_right">
                    <a href="{$url_base}index.php?go=kmall.carele.lists&ptype_id=21" class="carele_b_r_sel carele_brs_one">
                        <br />汽<br />车<br />电<br />子<br />电<br />器
                    </a>
                    <a href="{$url_base}index.php?go=kmall.carele.lists&ptype_id=22" class="carele_b_r_sel carele_brs_two">
                        <br />汽<br />车<br />仪<br />表
                    </a>
                    <a href="{$url_base}index.php?go=kmall.carele.lists&ptype_id=23" class="carele_b_r_sel carele_brs_three">
                        <br />汽<br />车<br />线<br />束
                    </a>
                    <a href="{$url_base}index.php?go=kmall.carele.lists&ptype_id=24" class="carele_b_r_sel carele_brs_four">
                        <br />汽<br />车<br />传<br />感<br />器<br />组<br />件<br />及其他
                    </a>
                </div>
            </div>
            <div class="carele_intro carele_border">
                <div class="carele_i_detail">
                    <p class="carele_i_d_p"><span class="carele_i_d_name">上海飞乐股份有限公司</span>(股票代码：600654)作为国内汽车零部件配套服务的专业企业之一，自1987年改制并上市后，一直致力于电子产品的开发和研制。</p>
                    <p>经过二十余年的持续发展，公司已逐步发展成为具有研发和制造汽车电子电器、汽车仪表、汽车线束三大汽车零部件为主的高科技企业。公司投资的控股企业有上海沪工汽车电器有限公司、上海德科电子仪表有限公司、上海元一电子有限公司、珠海乐星电子有限公司、上海飞乐汽车控制系统有限公司，这些企业均为国内外汽车知名企业提供专业的配套及服务。公司将通过技术创新和高效运营为我们的用户提供最优质的服务和最安全、环保的产品。</p>
                </div>
                <div class="carele_i_pic">
                    <div class="carele_i_p_block">
                        <div class="carele_i_p_img">
                            <img src="{$template_url}resources/images/carele/carele1.jpg">
                        </div>
                        <div class="carele_i_p_info">组合仪表</div>
                    </div>
                    <div class="carele_i_p_block">
                        <div class="carele_i_p_img">
                            <img src="{$template_url}resources/images/carele/carele2.jpg">
                        </div>
                        <div class="carele_i_p_info">BCM控制器</div>
                    </div>
                    <div class="carele_i_p_block">
                        <div class="carele_i_p_img">
                            <img src="{$template_url}resources/images/carele/carele3.jpg">
                        </div>
                        <div class="carele_i_p_info">空调控制器</div>
                    </div>
                </div>
            </div>
            <div class="carele_content">
                <div class="carele_c_topbar">
                    <div class="carele_c_t_name">排序:</div>
                    <ul class="carele_c_t_ul">
                        <li class="{if $sorting==1}carele_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.carele.lists&sorting=1&ptype_id={$ptype_id|default:''}">销量</a>
                        </li>
                        <li class="{if $sorting==2}carele_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.carele.lists&sorting=2&ptype_id={$ptype_id|default:''}">最新</a>
                        </li>
                        <li class="{if $sorting==3}carele_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.carele.lists&sorting=3&ptype_id={$ptype_id|default:''}">价格</a>
                        </li>
                        <li class="{if $sorting==4}carele_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.carele.lists&sorting=4&ptype_id={$ptype_id|default:''}">人气</a>
                        </li>
                        <li class="{if $sorting==5}carele_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.carele.lists&sorting=5&ptype_id={$ptype_id|default:''}">评论</a>
                        </li>
                    </ul>
                </div>
                <div class="carele_c_lists">
                    {foreach item=eachgoods from=$goods name=pfoo}
                    <div class="carele_c_l_show {if $smarty.foreach.pfoo.iteration % 4 ==0}carele_c_l_show_last{/if}">
                        <div class="carele_cls_pic">
                            <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                <img src="{$url_base}/upload/images/{$eachgoods.product.image}">
                            </a>
                        </div>
                        <div class="carele_cls_title">
                            <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                <p>{$eachgoods.goods_name}</p>
                            </a>
                        </div>
                        <div class="carele_cls_line"></div>
                        <div class="carele_cls_deatil">
                            <div class="carele_clsd_price">
                                <div class="carele_clsdp_shoprice">商城价:</div>
                                <div class="carele_clsdp_pricestyle carele_clsdp_sign">￥</div>
                                <div class="carele_clsdp_pricestyle">{$eachgoods.sales_price|string_format:"%.2f"}</div>
                            </div>
                            <div class="carele_clsd_cart">
                                <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                    <img class="fixpng" src="{$template_url}resources/images/public/cart.png">
                                </a>
                            </div>
                        </div>
                    </div>
                    {/foreach}                                      
                    <div class="carele_c_l_clear"></div>
                </div>
            </div>
            <div class="carele_sort">
                <my:page src="{$url_base}index.php?go=kmall.carele.lists&sorting={$smarty.get.sorting|default:'1'}&ptype_id={$ptype_id|default:''}" />
                </div>
            </div>
        </div>
    </div>
{/block}