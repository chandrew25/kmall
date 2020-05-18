{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="pop_up">
        <div class="dis_bg"></div>
        <div class="bulk_win fixpng">
            <div class="bulk_win_in">
                <div class="bulk_win_title">
                    <div class="bwt_title">大宗采购</div>
                    <div class="bwt_close fixpng"></div>
                </div>
                <div class="bulk_win_content">
                    <div class="bwc_title"></div>
                    <div class="bwc_detail">
                        <form action="{$url_base}index.php" id="bulk_submit">
                            <input type="hidden" name="go" value="kmall.bulkpurchase.tosubmit" >
                            <input type="hidden" name="product_id" class="product_id_i" value="">
                            <div class="bwcd_input">
                                <div class="bwcdi_tip">
                                    <div class="bwcdi_tip_ico fixpng"></div>
                                    <div class="bwcdi_tip_shwo">温馨提示：如果您需要<span>大宗采购菲彼生活商品</span>，请填写如下信息，我们会第一时间与您联系！</div>
                                </div>
                                <div class="bwcdi_left">
                                    <table cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div class="bp_name input_lab_left">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</div>
                                                </td>
                                                <td>
                                                    <div><input class="bp_name_i fixpng bq_name_sub" type="text" name="name"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="bp_tel input_lab_left">联系电话：</div>
                                                </td>
                                                <td>
                                                    <div><input class="bp_name_i fixpng bq_tel_sub" type="text" name="tel"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="bp_com input_lab_left">公司名称：</div>
                                                </td>
                                                <td>
                                                    <div><input class="bp_name_i fixpng bq_com_name_sub" type="text" name="com_name"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div  class="bp_email input_lab_left">邮箱地址：</div>
                                                </td>
                                                <td>
                                                    <div><input class="bp_name_i fixpng bq_email_sub" type="text" name="email"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="bwcdi_right">
                                    <table cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td valign="top">
                                                    <div class="bp_req input_lab_left">购买需求：</div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <textarea class="le_message fixpng" wrap="physical" name="message"></textarea>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div class="bp_com input_lab_left">公司地址：</div>
                                                </td>
                                                <td>
                                                    <div><input class="bp_name_i fixpng bq_addr_sub" type="text" name="addr"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="to_check_code">
                                    <div class="bp_check input_lab_left">验&nbsp;证&nbsp;码：</div>
                                    <div class="check_code">
                                        <div class="bp_check_d"><input class="bp_check_i fixpng" type="text" id="validate" name="check"></div>
                                        <div class="bp_check_code">
                                            <div class="check_img"><img id="validateCode" style="vertical-align:text-bottom;" onclick="changeCode();" name="validateCode" src="{$url_base}home/kmall/src/httpdata/validate.php?0.18667046210217964"></div>
                                            <a class="micro" onclick="changeCode();">看不清楚？换张图片</a>
                                        </div>
                                    </div>
                                    <div class="message_re"></div>
                                </div>
                            </div>
                            <div class="bwcd_button fixpng"></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="success" item="{$success}"></div>
    </div>
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
                        <li><a href="{$url_base}index.php?go=kmall.bulkpurchase.lists&ptype_id={$cate.ptype_id}" title="{$cate.name}">{$cate.nameShow}</a></li>
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
                        <span class="bulk_purchase">
                            <img src="{$url_base}/upload/images/{$hot_product.image}" width="90px" height="90px" alt="{$hot_product.productShow}"  item="{$hot_product.product_id}" />
                        </span>
                    </div>
                    <div class="intro">
                        <div class="words">
                            <span class="bulk_purchase" title="{$hot_product.productShow}" item="{$hot_product.product_id}" >{$hot_product.productShow|truncate:28:"..":true}</span>
                        </div>
                        <!--<div class="market_prise">市场价：<span class="line-through">￥{$hot_product.market_price|string_format:'%d'}</span></div>-->
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
                    <div class="pic">
                        <span class="bulk_purchase">
                            <img src="{$url_base}/upload/images/{$history_item.image}" width="90px" height="90px" alt="{$history_item.productShow}" item="{$history_item.product_id}"/>
                        </span>
                    </div>
                    <div class="intro">
                        <div class="words">
                            <span class="bulk_purchase" title="{$history_item.productShow}" item="{$history_item.product_id}" >{$history_item.productShow|truncate:28:"..":true}</span>
                        </div>
                        <!--<div class="market_prise">市场价：<span class="line-through">￥{$history_item.market_price|string_format:'%d'}</span></div>-->
                        <div class="prise">￥{$history_item.price|string_format:'%.2f'}</div>
                    </div>
                </li>
                {/foreach}
                <li class="color_black delete"><a href="{$url_base}index.php?go=kmall.product.baseDeleteSeeProduct">清除浏览记录</a></li>
            </ul>
            {/if}
        </div>
        <div class="content">
            <div class="bulk_banner"><img src="{$template_url}resources/images/banner/bulk_p_banner.jpg" width="748px" height="248px"/></div>
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
                        {foreach item=attribute_val from=$attribute["children"]}
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
                                <span class="bulk_purchase">
                                    <img src="{$url_base}/upload/images/{$product.image}" width='223px' height='158px' alt="{$product.productShow}" item="{$product.product_id}"/>
                                </span>
                                <div class="lable"><img class="fixpng" src="{$template_url}resources/images/Ninki.png" alt="" /></div>
                            </div>
                            <div class="name color_black">
                                <span class="bulk_purchase" alt="{$product.productShow}" item="{$product.product_id}">{$product.productShow|truncate:40:"...":true}</span>
                            </div>
                            <div class="intro">{$product.message|truncate:'20'}</div>
                            <div class="prise">
                                ￥{$product.price|string_format:'%.2f'}
                            </div>
                            <div class="buy">
                                <span class="bulk_purchase"><div class="buy_img add_cart" alt="{$product.productShow}" item="{$product.product_id}"></div></span>
                                <span class="bulk_purchase"><div class="buy_img imm_buy" alt="{$product.productShow}" item="{$product.product_id}"></div></span>
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







    <script>
    function changeCode(){
        document.getElementById('validateCode').src="{$url_base}home/kmall/src/httpdata/validate.php?r="+Math.random();
    }
    </script>
{/block}
