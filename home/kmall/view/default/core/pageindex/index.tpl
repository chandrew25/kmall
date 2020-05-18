{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="bannerw" style="overflow: hidden;">
    <div class="bbg"></div>
    <div id="banner" class="banner container_width">
        <div class="bimgwlayer" style="left: -194.5px; width: 1349px; opacity: 0;"></div>
        <div class="bimgw">
            <a href="{$url_base}index.php?go=kmall.act.lists" target="_blank"><img src="{$template_url}resources/images/ban_01.jpg" style="display: block;"></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=604" target="_blank"><img src="{$template_url}resources/images/ban_02.jpg" style="display: none;"></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=603" target="_blank"><img src="{$template_url}resources/images/ban_03.jpg" style="display: none;"></a>
            <a href="{$url_base}index.php?go=kmall.product.view&product_id=602" target="_blank"><img src="{$template_url}resources/images/ban_04.jpg" style="display: none;"></a>
           </div>
        <div class="down">
            <div class="dbg"></div>
            <div class="textw">
                <div class="t" style="display: block;"><p class="n color_white">激情二月，菲彼生活智能电视火爆预约中...</p><p class="d color_gray">精准引领精彩&nbsp;智慧引领时尚</p></div>
                <div class="t" style="display: none;"><p class="n color_white">如意系列 55寸 iLE5501-CW01-UF</p><p class="d color_gray">全新产品&nbsp;震撼上市</p></div>
                <div class="t" style="display: none;"><p class="n color_white">如意系列 47寸 iLE4701-CW01-UF</p><p class="d color_gray">全新产品&nbsp;震撼上市</p></div>
                <div class="t" style="display: none;"><p class="n color_white">如意系列 42寸 iLE4201-CW01-UF</p><p class="d color_gray">全新产品&nbsp;震撼上市</p></div>
            </div>
            <div class="dimgw">
                <img class="f" src="{$template_url}resources/images/banner_s1.jpg">
                <img class="b" src="{$template_url}resources/images/banner_s2.jpg">
                <img class="b" src="{$template_url}resources/images/banner_s3.jpg">
                <img class="b" src="{$template_url}resources/images/banner_s4.jpg">
              </div>
        </div>
    </div>
</div>
<div id="pop_up">
    <div class="dis_bg"></div>
    <div class="pop_win fixpng">
        <!--新品上架-->
        <div id="np_win">
            <form id="np_sort" action="tosort.php">
                <input type="hidden" name="classify_id" value="1">
                <div class="operate_tip">优先值高的排在前</div>
                <div class="np_title">
                    <div class="np_win_title_name">标题</div>
                    <div class="np_win_input_name">优先值</div>
                </div>
                {foreach item=newshow from=$newshows}
                <div class="np_win_list">
                    <div class="np_win_title">{$newshow.title}</div>
                    <div class="np_win_input">
                        <input class="np_win_input_show" type='text' name='sort_order{$newshow.indexpage_id}' item="{$newshow.sort_order}" value='{$newshow.sort_order}'>
                    </div>
                </div>
                {/foreach}
                <div class='np_win_submit'>保存</div>
            </form>
        </div>
        <!--热销排行-->
        <div id="hs_win">
            <form id="hs_sort" action="tosort.php">
                <input type="hidden" name="classify_id" value="2">
                <div class="operate_tip">优先值高的排在前</div>
                <div class="np_title">
                    <div class="np_win_title_name">标题</div>
                    <div class="np_win_input_name">优先值</div>
                </div>
                {foreach item=hotshow from=$hotshows}
                <div class="np_win_list">
                    <div class="np_win_title">{$hotshow.title}</div>
                    <div class="np_win_input">
                        <input class="np_win_input_show" type='text' name='sort_order{$hotshow.indexpage_id}' item="{$hotshow.sort_order}" value='{$hotshow.sort_order}'>
                    </div>
                </div>
                {/foreach}
                <div class='hs_win_submit'>保存</div>
            </form>
        </div>
        <!--center排序-->
        <div id="center_sort" class="win_style">
            <form id="center_form" action="center_sort.php">
                <input type="hidden" name="classify_id" value="5">
                <div class="operate_tip">优先值高的排在前</div>
                <div class="np_title">
                    <div class="np_win_title_name">标题</div>
                    <div class="np_win_input_name">优先值</div>
                </div>
                {foreach item=center from=$centers}
                <div class="np_win_list">
                    <div class="np_win_title">{$center.title}</div>
                    <div class="np_win_input">
                        <input class="np_win_input_show" type='text' name='sort_order{$center.indexpage_id}' item="{$center.sort_order}" value='{$center.sort_order}'>
                    </div>
                </div>
                {/foreach}
                <div class='center_sort_submit submit_style'>保存</div>
            </form>
        </div>
        <!--center顶部链接-->
        {foreach item=center from=$centers}
        <div id="center_link_sort{$center.indexpage_id}" class="win_style">
            <form class="center_link_form{$center.indexpage_id}" item="{$center.indexpage_id}" >
                <input type="hidden" name="classify_id" value="7">
                <input type="hidden" name="parent_id" value="{$center.indexpage_id}">
                <div class="operate_tip">优先值高的排在前</div>
                <div class="np_title">
                    <div class="center_win_title_name">标题</div>
                    <div class="center_win_link2_name">链接</div>
                    <div class="np_win_input2_name">优先值</div>
                    <div class="np_to_delete_name">操作</div>
                </div>
                {foreach item=showtype from=$center.children}
                <div class="np_win_list np_win_list{$showtype.indexpage_id}">
                    <div class="center_win_title">
                        <input class="center_win_title_input" type='text' name='clink[{$showtype.indexpage_id}][title]' value='{$showtype.title}'>
                    </div>
                    <div class="center_win_link2">
                        <input class="center_win_link2_input" type='text' name='clink[{$showtype.indexpage_id}][link]' value='{$showtype.link}'>
                    </div>
                    <div class="np_win_input2">
                        <input class="np_win_input_show" type='text' name='clink[{$showtype.indexpage_id}][sort_order]' item="{$showtype.sort_order}" value='{$showtype.sort_order}'>
                    </div>
                    <div class="np_to_delete_input" item="{$showtype.indexpage_id}">删除</div>
                </div>
                {/foreach}
            </form>
            <div class="add_link">
                <form class="add_link{$center.indexpage_id}">
                    <input type="hidden" name="classify_id" value="7">
                    <input type="hidden" name="parent_id" value="{$center.indexpage_id}">
                    <div class="add_button" item="{$center.indexpage_id}"></div>
                    <div class="add_info">添加链接</div>
                    <div class="add_info add_info2">（在页面显示，请点保存）</div>
                </form>
            </div>
            <div class='center_link_submit submit_style'>保存</div>
        </div>
        {/foreach}
        <!--商品详情-->
        {foreach item=allproduct from=$allproducts name=all}
        <div class="product{$allproduct.indexpage_id} allproduct">
           <form class="revise{$allproduct.indexpage_id}" enctype="multipart/form-data" action="torevise.php" item="{$allproduct.indexpage_id}">
                <input type="hidden" name="indexpage_id" value="{$allproduct.indexpage_id}">
                <div class="revise_title">商品详情</div>
                <div class="revise_body">
                    <table cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td class="td_left"><div class="revise_left">标题</div></td>
                                <td><div><input class="input_stl" type="text" name="title" value="{$allproduct.title}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">描述</div></td>
                                <td><div><input class="input_stl" type="text" name="discribe" value="{$allproduct.discribe}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">系列名</div></td>
                                <td><div><input class="input_stl" type="text" name="type_name" value="{$allproduct.type_name}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">价格</div></td>
                                <td><div><input class="input_stl" type="text" name="price" value="{$allproduct.price}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">mouseover</div></td>
                                <td><div><input class="input_stl" type="text" name="mouseover" value="{$allproduct.mouseover}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">链接</div></td>
                                <td><div><input class="input_stl" type="text" name="link" value="{$allproduct.link}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">静态链接</div></td>
                                <td><div><input class="input_stl" type="text" name="sta_link" value="{$allproduct.sta_link}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">图片</div></td>
                                <td><div><input class="input_stl input_file" name="image" type="file" value="{$allproduct.image}" /></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">图片宽高</div></td>
                                <td>
                                    <div>
                                        <div class="size_di"><input class="input_stl input_size" type="text" name="width" value="{$allproduct.width}"></div><div class="imp_tip">宽（<span class="color_red">不要修改</span>）</div>
                                        <div class="size_di"><input class="input_stl input_size" type="text" name="height" value="{$allproduct.height}"></div><div class="imp_tip">高（<span class="color_red">不要修改</span>）</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">说明</div></td>
                                <td><div><textarea class="input_text" wrap="physical" name="intro" value="{$allproduct.intro}"></textarea></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class='{if $allproduct.classify_id==8}revise_submit_s{else}revise_submit{/if} submit_style'>保存</div>
            </form>
        </div>
        {/foreach}
        <!--center左侧大图-->
        {foreach item=center from=$centers name=center_img}
        <div id="allimage{$center.showimg.indexpage_id}" class="allimage">
           <form class="imgrevise{$center.showimg.indexpage_id}" enctype="multipart/form-data" action="torevise.php" item="{$center.showimg.indexpage_id}">
                <input type="hidden" name="indexpage_id" value="{$center.showimg.indexpage_id}">
                <div class="revise_title">左侧大图修改</div>
                <div class="revise_body">
                    <table cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td class="td_left"><div class="revise_left">描述</div></td>
                                <td><div><input class="input_stl" type="text" name="discribe" value="{$center.showimg.discribe}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">mouseover</div></td>
                                <td><div><input class="input_stl" type="text" name="mouseover" value="{$center.showimg.mouseover}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">链接</div></td>
                                <td><div><input class="input_stl" type="text" name="link" value="{$center.showimg.link}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">静态链接</div></td>
                                <td><div><input class="input_stl" type="text" name="sta_link" value="{$center.showimg.sta_link}"></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">图片</div></td>
                                <td><div><input class="input_stl input_file" name="image" type="file" value="{$center.showimg.image}" /></div></td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">图片宽高</div></td>
                                <td>
                                    <div>
                                        <div class="size_di"><input class="input_stl input_size" type="text" name="width" value="{$center.showimg.width}"></div><div class="imp_tip">宽（<span class="color_red">不要修改</span>）</div>
                                        <div class="size_di"><input class="input_stl input_size" type="text" name="height" value="{$center.showimg.height}"></div><div class="imp_tip">高（<span class="color_red">不要修改</span>）</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="td_left"><div class="revise_left">说明</div></td>
                                <td><div><textarea class="input_text" wrap="physical" name="intro" value="{$center.showimg.intro}"></textarea></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class='center_img_submit submit_style'>保存</div>
            </form>
        </div>
        {/foreach}
        <!--新闻-->
        <div id="news_to_revise" class="win_style">
            <form class="news_revise_form">
                <input type="hidden" name="classify_id" value="9">
                <div class="operate_tip">优先值高的排在前</div>
                <div class="np_title">
                    <div class="center_win_title_name">标题</div>
                    <div class="center_win_mouseover_name">鼠标悬停提示</div>
                    <div class="center_win_link3_name">链接</div>
                    <div class="np_win_input_name">优先值</div>
                </div>
                {foreach item=newslist from=$newslists}
                <div class="np_win_list">
                    <div class="center_win_title">
                        <input class="center_win_title_input" type='text' name='news[{$newslist.indexpage_id}][title]' value='{$newslist.title}'>
                    </div>
                    <div class="center_win_mouseover">
                        <input class="center_win_mouseover_input" type='text' name='news[{$newslist.indexpage_id}][mouseover]'  value='{$newslist.mouseover}'>
                    </div>
                    <div class="center_win_link3">
                        <input class="center_win_link3_input" type='text' name='news[{$newslist.indexpage_id}][link]'  value='{$newslist.link}'>
                    </div>
                    <div class="np_win_input">
                        <input class="np_win_input_show" type='text' name='news[{$newslist.indexpage_id}][sort_order]' item="{$newslist.sort_order}" value='{$newslist.sort_order}'>
                    </div>
                </div>
                {/foreach}
                <div class='news_revise_submit submit_style'>保存</div>
            </form>
        </div>
        <div id="win_close"></div>
    </div>
</div>
<div id="shadow">
    <div class="main" url="{$template_url}" path="{$url_base}">
        <div class="mart">

            <div class="newproduct">
                <div class="newproduct_h"><img src="{$template_url}resources/images/newproduct.gif" /></div>
                <ul id="newarrival">
                {foreach item=newshow from=$newshows name=foo}
                    <li class="rela{$newshow.indexpage_id} rela" item="{$newshow.indexpage_id}">
                        <img class="new fixpng" src="{$template_url}resources/images/new.png" />
                        <div class="product_show{$newshow.indexpage_id} product_show">
                            <a class="img_link" href="{$newshow.link}">
                                <img src="{$newshow.image}" width="{$newshow.width}" height="{$newshow.height}" title="{$newshow.mouseover}" />
                            </a>
                            <h4>
                                <a href="{$newshow.link}" title="{$newshow.mouseover}" >{$newshow.type_name}<span>&nbsp;&nbsp;{$newshow.discribe}</span><br /><span>{$newshow.title}</span></a><br />
                                <span class="scj">商城价</span><span class="red">￥{$newshow.price}</span>
                            </h4>
                        </div>
                    </li>
                {if !$smarty.foreach.foo.last}
                    <li><img class="fixpng" src="{$template_url}resources/images/fenggexian.png" /></li>
                {/if}
                {/foreach}
                </ul>
            </div>

            <div class="hotsell">
                <div class="hotsell_h"><img src="{$template_url}resources/images/hotsell.gif" /></div>
                <ul id="hotcharts">
                {foreach item=hotshow from=$hotshows name=text}
                    <li class="rela{$hotshow.indexpage_id} rela"  item="{$hotshow.indexpage_id}">
                        <img class="new fixpng" src="{$template_url}resources/images/new.png" />
                        <div class="product_show{$hotshow.indexpage_id} product_show">
                            <a class="img_link" href="{$hotshow.link}">
                                <img src="{$hotshow.image}" width="{$hotshow.width}" height="{$hotshow.height}" title="{$hotshow.title}" />
                            </a>
                            <h4>
                                <a href="{$hotshow.link}" title="{$hotshow.mouseover}">{$hotshow.type_name}<span>&nbsp;&nbsp;{$hotshow.discribe}</span><br /><span>{$hotshow.title}</span></a><br />
                                <span class="scj">商城价</span><span class="red">￥{$hotshow.price}</span>
                            </h4>
                        </div>
                    </li>
                {if !$smarty.foreach.text.last}
                    <li><img class="fixpng" src="{$template_url}resources/images/fenggexian.png" /></li>
                {/if}
                {/foreach}
               </ul>
             </div>

         </div>

         <div class="main_right">
            <div class="yuyue">
                <div class="t png"></div>
                <div class="c color_white">
                    <img class="img" src="{$template_url}resources/images/index/yuyuebg.jpg"/>
                    <div class="info">
                        <div class="name">菲彼生活智能电视震撼上市</div>
                        <div class="descr"><font class="f">如意系列</b>&nbsp;感临场之美</div>
                        <div class="bm png">
                            <div class="price">￥6999</div>
                            <a href="{$url_base}index.php?go=kmall.act.lists"><div class="btn png"></div></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_top" item="news_to_revise">
                <div class="right_top_h fixpng"></div>
                <ul class="news_revise">
                    {foreach item=newslist from=$newslists}
                    <li><a href="{$newslist.link}" title="{$newslist.mouseover}"  target="_blank">{$newslist.title}</a></li>
                    {/foreach}
                </ul>
            </div>
         </div>
         <div class="main_center_bottom"></div>
         <div class="center" item="center_sort">
            {foreach item=center from=$centers}
             <div class="ishowbox" style="background:url({$center.image}) no-repeat;">
                <span class="classify_re_show{$center.indexpage_id} classify_re_show" item="center_link_sort{$center.indexpage_id}">
                    {foreach item=showtype from=$center.children name=show_type}
                    <a href="{$showtype.link_url}">{$showtype.title}</a>
                    {if !$smarty.foreach.show_type.last}&nbsp;|&nbsp;{/if}
                    {/foreach}
                </span>
                <div class="tv_pic">
                    <div class="showimg_revise showimg_revise{$center.showimg.indexpage_id}" item="allimage{$center.showimg.indexpage_id}">
                        <img  src="{$center.showimg.image}" width="{$center.showimg.width}" height="{$center.showimg.height}" title="{$center.showimg.mouseover}" />
                    </div>
                    <ul class="showbox_product_sort">
                        <img src="{$template_url}resources/images/bg/jianbian_short.jpg" />
                        {foreach item=kid from=$center.kids name=text_s}
                        <li class="rela{$kid.indexpage_id} rela" item="{$kid.indexpage_id}">
                            <div class="center_product_show{$kid.indexpage_id} center_product_show">
                                <a href="{$kid.link}" title="{$kid.mouseover}"><img src="{$kid.image}" width="{$kid.width}" height="{$kid.height}" /></a>
                                <h4><a href="{$kid.link}" title="{$kid.mouseover}">&nbsp;<strong>{$kid.type_name}&nbsp;</strong>{$kid.discribe}<br>{$kid.title}</a><br /></h4>
                                <span class="scj">商城价</span><span class="red">￥{$kid.price}</span>
                            </div>
                        </li>
                        {if !$smarty.foreach.text_s.last}
                        <li class="fenge"><img src="{$template_url}resources/images/fenggexian.png" /></li>
                        {/if}
                        {/foreach}
                    </ul>
                </div>
            </div>
            <div class="center_bottom"></div>
            {/foreach}
         </div>
     </div>
</div>
{/block}
