{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="main" class="outermost_width">
        <div class="navi_left">
            <ul>
                <li>
                    <div class="title">
                        <div class="words color_white">应用分类</div>
                    </div>
                    <ul class="box color_black">
                        <li class="single">
                            <a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id=1&sorting={$smarty.get.sorting|default:'1'}"><img src="{$template_url}resources/images/details_icon1.png" alt="" />&nbsp;&nbsp;游戏天地&nbsp;&gt;&gt;</a>
                        </li>
                        <li class="double">
                            <a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id=2&sorting={$smarty.get.sorting|default:'1'}"><img src="{$template_url}resources/images/details_icon2.png" alt="" />&nbsp;&nbsp;影音娱乐&nbsp;&gt;&gt;</a>
                        </li>
                        <li class="single">
                            <a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id=3&sorting={$smarty.get.sorting|default:'1'}"><img src="{$template_url}resources/images/details_icon3.png" alt="" />&nbsp;&nbsp;教育阅读&nbsp;&gt;&gt;</a>
                        </li>
                        <li class="double">
                            <a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id=4&sorting={$smarty.get.sorting|default:'1'}"><img src="{$template_url}resources/images/details_icon4.png" alt="" />&nbsp;&nbsp;旅行购物&nbsp;&gt;&gt;</a>
                        </li>
                        <li class="single">
                            <a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id=5&sorting={$smarty.get.sorting|default:'1'}"><img src="{$template_url}resources/images/details_icon5.png" alt="" />&nbsp;&nbsp;生活休闲&nbsp;&gt;&gt;</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="title">
                        <div class="words color_white">综合排行榜</div>
                        <div class="time">
                            <div class="week_month week_month_show" id="week_hover"><span>周</span></div>
                            <div class="week_month" id="month_hover"><span>月</span></div>
                        </div>
                    </div>
                    <ul class="box color_gray week_month_box" id="week_show">
                    {foreach item=weektopten from=$weektoptens name=foo}
                        <li class="top week_show_detail {if $smarty.foreach.foo.iteration==1}week_show_detail_show{/if}">
                            <div class="number"><span>{$smarty.foreach.foo.iteration}</span></div>
                            <div class="pic"><a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$weektopten->appdown_id}"><img src="{$url_base}upload/images/{$weektopten->ico}" alt="{$weektopten->appdown_name}" width="53px" height="53px" /></a></div>
                            <div class="intro">
                                <div class="name">
                                    <div class="words">
                                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$weektopten->appdown_id}">{$weektopten->appdown_name|truncate:'8'}</a>
                                    </div>
                                    <div class="condition">
                                        <img src="{$template_url}resources/images/condition1.jpg" alt="" />
                                    </div>
                                </div>
                                <div class="grade star star{$weektopten->recommendlevel}"></div>
                                <div class="type">{$weektopten->tag}</div>
                            </div>
                        </li>
                        <li class="normal week_show_lists {if $smarty.foreach.foo.iteration==1}week_show_lists_hide{/if}">
                            <div class="number">{$smarty.foreach.foo.iteration}</div>
                            <div class="pic"><a><img src="{$url_base}upload/images/{$weektopten->smallicon}" /></a></div>
                            <div class="intro">
                                <div class="name">
                                    <div class="words">
                                        <a>{$weektopten->appdown_name|truncate:'8'}</a>
                                    </div>
                                    <div class="condition">
                                        <img src="{$template_url}resources/images/condition2.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    {/foreach}
                    </ul>
                    <ul class="box color_gray week_month_box" id="month_show">
                    {foreach item=monthtopten from=$monthtoptens name=test}
                        <li class="top month_show_detail {if $smarty.foreach.test.iteration==1}month_show_detail_show{/if}">
                            <div class="number"><span>{$smarty.foreach.test.iteration}</span></div>
                            <div class="pic"><a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$monthtopten->appdown_id}"><img src="{$url_base}upload/images/{$monthtopten->ico}" alt="{$monthtopten->appdown_name}" width="53px" height="53px" /></a></div>
                            <div class="intro">
                                <div class="name">
                                    <div class="words">
                                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$monthtopten->appdown_id}">{$monthtopten->appdown_name}</a>
                                    </div>
                                    <div class="condition">
                                        <img src="{$template_url}resources/images/condition1.jpg" alt="" />
                                    </div>
                                </div>
                                <div class="grade star star{$monthtopten->recommendlevel}"></div>
                                <div class="type">{$monthtopten->tag}</div>
                            </div>
                        </li>
                        <li class="normal month_show_lists {if $smarty.foreach.test.iteration==1}month_show_lists_hide{/if}">
                            <div class="number">{$smarty.foreach.test.iteration}</div>
                            <div class="pic"><a><img src="{$url_base}upload/images/{$monthtopten->smallicon}" /></a></div>
                            <div class="intro">
                                <div class="name">
                                    <div class="words">
                                        <a>{$monthtopten->appdown_name}</a>
                                    </div>
                                    <div class="condition">
                                        <img src="{$template_url}resources/images/condition2.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    {/foreach}
                    </ul>
                </li>
            </ul>
        </div>
        <div class="content">
            <div class="title" id="appdown_id_show" item="{$appdown.appdown_id}">{$appdown.appdown_name}</div>
            <div class="general">
                <div class="pic"><img src="{$url_base}upload/images/{$appdown.image}" alt="{$appdown.appdown_name}" width="158px" height="158px" /></div>
                <table cellspacing="3">
                    <tr>
                        <td>【&nbsp;分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类&nbsp;】&nbsp;{$appdown.getTypeShow}</td>
                        <td>【&nbsp;开&nbsp;&nbsp;发&nbsp;&nbsp;者&nbsp;】&nbsp;{$appdown.developer}</td>
                    </tr>
                    <tr>
                        <td>【&nbsp;版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本&nbsp;】&nbsp;{$appdown.edition}</td>
                        <td>【&nbsp;发布日期&nbsp;】&nbsp;{$appdown.publishtime|date_format:"%Y-%m-%d"}</td>
                    </tr>   
                    <tr>
                        <td>【&nbsp;推荐指数&nbsp;】&nbsp;<span class="stargrade star star{$appdown.recommendlevel}"></span></td>
                        <td>【&nbsp;文件大小&nbsp;】&nbsp;{$appdown.docsize|string_format:'%.2f'}M</td>
                    </tr>
                    <tr>
                        <td>【&nbsp;下载次数&nbsp;】&nbsp;{$appdown.downloadcount}次</td>
                        <td>【&nbsp;购买次数&nbsp;】&nbsp;{$appdown.buycount}次</td>
                    </tr>
                    <tr>
                        <td>【&nbsp;标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签&nbsp;】&nbsp;<u>{$appdown.tag}</u></td>
                        <td rowspan="2"><a style="display:block;width:71px;height:32px" target="_blank" href="{$url_base}index.php?go=kmall.appdown.download&appdown_id={$appdown.appdown_id}"><img class="fixpng"  id="appdown_count"  src="{$template_url}resources/images/button/download1.png" alt="点击下载" width="120px" height="29px" /></a></td>
                    </tr>
                    <tr>
                        <td>【&nbsp;价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格&nbsp;】&nbsp;{if $appdown.isFree}免费{else}{$appdown.price}&nbsp;元{/if}</td>
                    </tr>
                </table>
            </div>
            <div class="intro">
                <div class="head">
                    <ul class="name">
                        <li id="app_detail" class="color_white app_tip app_tip_hover"><span>应用详情</span></li>
                        <li id="use_in" class="color_white app_tip"><span>适配机型</span></li>
                    </ul>
                    <div class="bottom"></div>
                </div>
                <div id="app_detail_show">{$appdown.introduce}</div>
                <div id="use_in_show">{$appdown.suitabletype}</div>
            </div>
        </div>
    </div>
{/block}
