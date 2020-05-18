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
            <div class="ce xuxian" style="overflow:hidden;" >
                <h2 class="fl" style=" font-size:16px; font-weight:bold; line-height:30px; ">
                {if $classify_id==1}
                游戏天地
                {elseif $classify_id==2}
                影音娱乐
                {elseif $classify_id==3}
                教育阅读
                {elseif $classify_id==4}
                旅行购物
                {elseif $classify_id==5}
                生活休闲
                {/if}
                </h2>
                <p class="fr" style=" font-size:14px;"><a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id={$classify_id}&sorting=1"><span {if $sorting==1}style="color:#0099cc;"{/if}>按时间排序</span></a>|<a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id={$classify_id}&sorting=2"><span {if $sorting==2}style="color:#0099cc;"{/if}>按大小排序</span></a>|<a href="{$url_base}index.php?go=kmall.appdown.classify&classify_id={$classify_id}&sorting=3"><span {if $sorting==3}style="color:#0099cc;"{/if}>按人气排序</span></a></p>
            </div>
            {foreach item=appdownshow from=$appdownshows}
            <div class="wenzi">
                <dl>
                    <dt><a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appdownshow.appdown_id}"><img src="{$url_base}upload/images/{$appdownshow.ico}" width="90" height="91" alt="{$appdownshow.appdown_name}"/></a></dt>
                    <dd class="biaoti">
                        <h4><a target="_blank" title="{$appdownshow.appdown_name}" href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appdownshow.appdown_id}">{$appdownshow.appdown_name}</a></h4>
                        <span id="star_big" class="star_big_show star_big{$appdownshow.recommendlevel}"></span>
                        <span> 日期：{$appdownshow.publishtime|date_format:"%Y-%m-%d"}</span>
                    </dd>
                    <dd class="info"><a target="_blank"  href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appdownshow.appdown_id}">
                        <em>{$appdownshow.appdown_name}</em></a> | {$appdownshow.edition} | 大小:{$appdownshow.docsize|string_format:'%.2f'}MB | 支持固件:1.5及以上 | 下载次数:{$appdownshow.downloadcount}
                    </dd>
                    <dd>
                        <p class="dec">简介：{$appdownshow.introduction}</p>
                    </dd>
                </dl>
            </div>
            {/foreach}
            <my:page src="{$url_base}index.php?go=kmall.appdown.classify&classify_id={$smarty.get.classify_id}&sorting={$smarty.get.sorting|default:'1'}" />
            </div>
        </div>
    </div>
{/block}