{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="shadow">
        <div class="main">
            <div class="smartcard_banner smartcard_border">
                <img src="{$template_url}resources/images/smartcard/banner.jpg">
            </div>
            <div class="smartcard_intro smartcard_border">
                <div class="smartcard_i_detail">
                    <p class="smartcard_i_d_p"><span class="smartcard_i_d_name">长丰智能卡有限公司</span>位于上海浦东金桥出口加工区，占地面积10000平方
米，拥有6000平方米的现代化厂房和办公大楼。厂房具有恒温、恒湿和防
静电的功能，洁净度达到1万级，达到国家金库的安保标准。公司拥有高度
自动化的国际先进制卡与制模块设备以及功能齐全的质量检测分析和个人
化处理设备，智能卡模块（Memory卡模块、CPU卡模块、非接触式模块、双
界面模块）的年生产能力达1.5亿片，各类IC卡片的年生产能力达2000万片
以上。 长丰在十年艰苦创业发展历程中，坚持以科研开发为先导，通过产
品开发，不断完善和提高IC卡和模块制造技术，增强产品竞争优势和市场
领先优势，拥有很多令长丰人骄傲的'第一'。</p>
                </div>
                <div class="smartcard_i_pic">
                    <div class="smartcard_i_p_block">
                        <div class="smartcard_i_p_img">
                            <img src="{$template_url}resources/images/smartcard/smartcard1.jpg">
                        </div>
                        <div class="smartcard_i_p_info">13.56MHz射频通信智能卡</div>
                    </div>
                    <div class="smartcard_i_p_block">
                        <div class="smartcard_i_p_img">
                            <img src="{$template_url}resources/images/smartcard/smartcard2.jpg">
                        </div>
                        <div class="smartcard_i_p_info">2.45GHz射频通信智能卡</div>
                    </div>
                    <div class="smartcard_i_p_block">
                        <div class="smartcard_i_p_img">
                            <img src="{$template_url}resources/images/smartcard/smartcard3.jpg">
                        </div>
                        <div class="smartcard_i_p_info">彩色模塑封装智能卡</div>
                    </div>
                </div>
            </div>
            <div class="smartcard_content">
                <div class="smartcard_c_topbar">
                    <div class="smartcard_c_t_name">排序:</div>
                    <ul class="smartcard_c_t_ul">
                        <li class="{if $sorting==1}smartcard_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.smartcard.lists&sorting=1">销量</a>
                        </li>
                        <li class="{if $sorting==2}smartcard_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.smartcard.lists&sorting=2">最新</a>
                        </li>
                        <li class="{if $sorting==3}smartcard_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.smartcard.lists&sorting=3">价格</a>
                        </li>
                        <li class="{if $sorting==4}smartcard_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.smartcard.lists&sorting=4">人气</a>
                        </li>
                        <li class="{if $sorting==5}smartcard_c_t_ul_bg{else}btn_hover{/if}">
                            <a href="{$url_base}index.php?go=kmall.smartcard.lists&sorting=5">评论</a>
                        </li>
                    </ul>
                </div>
                <div class="smartcard_c_lists">
                    {foreach item=eachgoods from=$goods name=pfoo}
                    <div class="smartcard_c_l_show {if $smarty.foreach.pfoo.iteration % 4 ==0}smartcard_c_l_show_last{/if}">
                        <div class="smartcard_cls_pic">
                            <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                <img src="{$url_base}/upload/images/{$eachgoods.product.image}">
                            </a>
                        </div>
                        <div class="smartcard_cls_title">
                            <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                <p>{$eachgoods.goods_name}</p>
                            </a>
                        </div>
                        <div class="smartcard_cls_line"></div>
                        <div class="smartcard_cls_deatil">
                            <div class="smartcard_clsd_price">
                                <div class="smartcard_clsdp_shoprice">商城价:</div>
                                <div class="smartcard_clsdp_pricestyle smartcard_clsdp_sign">￥</div>
                                <div class="smartcard_clsdp_pricestyle">{$eachgoods.sales_price|string_format:"%.2f"}</div>
                            </div>
                            <div class="smartcard_clsd_cart">
                                <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$eachgoods.goods_id}" target="_blank">
                                    <img class="fixpng" src="{$template_url}resources/images/public/cart.png">
                                </a>
                            </div>
                        </div>
                    </div>
                    {/foreach}                                      
                    <div class="smartcard_c_l_clear"></div>
                </div>
            </div>
            <div class="smartcard_sort">
                <my:page src="{$url_base}index.php?go=kmall.smartcard.lists&sorting={$smarty.get.sorting|default:'1'}" />
                </div>
            </div>
        </div>
    </div>
{/block}