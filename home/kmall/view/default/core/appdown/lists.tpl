{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="main" class="outermost_width">
        <div class="navi_left">
            <ul>
            <!--
                <li class="choice">
                    <div class="pic">
                        <img src="{$template_url}resources/images/display.png" alt="" />
                    </div>
                    <div class="button">
                        <a><img src="{$template_url}resources/images/choose_type.jpg" alt="" /></a>
                    </div>
                    <div class="intro">
                        查看适合您电视机的应用
                    </div>
                </li>
                <li>
                    <ul class="items">
                        <li id="activity_announcement" class="tipshow tipshow_hover color_white"><span>活动公告</span></li>
                        <li id="newest_trends" class="tipshow color_white"><span>最新动态</span></li>
                        <li id="newhand_course" class="tipshow color_white right"><span>新手教程</span></li>
                    </ul>
                    <ul id="activity_announcement_show" class="box color_gray box_show">
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                        <li>
                            <a>家电厂商称不支持苏宁</a>
                        </li>
                    </ul>
                    <ul id="newest_trends_show" class="box color_gray box_show">
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                        <li>
                            <a>三军可夺帅也，匹夫不可夺志也。</a>
                        </li>
                    </ul>
                    <ul id="newhand_course_show" class="box color_gray box_show">
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                        <li>
                            <a>穷且益坚，不坠青云之志。</a>
                        </li>
                    </ul>
                </li>
                -->
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
                                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$weektopten->appdown_id}" title="{$weektopten->appdown_name}">{$weektopten->appdown_name|truncate:'12'}</a>
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
                                        <a>{$weektopten->appdown_name}</a>
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
                                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$monthtopten->appdown_id}" title="{$weektopten->appdown_name}">{$monthtopten->appdown_name|truncate:'12'}</a>
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
                                        <a>{$monthtopten->appdown_name|truncate:'8'}</a>
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
            <div class="banner">
                <a><img src="{$template_url}resources/images/upload/banner2.jpg" alt="" /></a>
            </div>
            <div class="service">
                <div class="title">
                    <div class="t">免费专区</div>
                    <div class="pages"><span id="free_page_no1" class="free_page_no free_page_no_show">1</span>&nbsp;<span id="free_page_no2" class="free_page_no">2</span>&nbsp;<span id="free_page_no3" class="free_page_no">3</span>&nbsp;&nbsp;<img id="free_left" class="turn_arrow" src="{$template_url}resources/images/arrow5.jpg" alt="" />&nbsp;&nbsp;<img id="free_right" class="turn_arrow" src="{$template_url}resources/images/arrow6.jpg" alt="" /></div>
                </div>
                <ul class="details">
                {foreach item=appfree from=$appfrees name=foo}
                    <li class="free_show {if $smarty.foreach.foo.iteration  % 6==0}right{/if} {if $smarty.foreach.foo.iteration <= 12}free_first_page{/if} {if $smarty.foreach.foo.iteration > 12&&$smarty.foreach.foo.iteration <= 24}free_second_page{/if} {if $smarty.foreach.foo.iteration > 24}free_third_page{/if}">
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appfree.appdown_id}"><img src="{$url_base}upload/images/{$appfree.ico}" alt="{$appfree.appdown_name}" title="{$appfree.appdown_name}" width="75px" height="75px" /></a><br />
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appfree.appdown_id}" title="{$appfree.appdown_name}">{$appfree.appdown_name|truncate:'12'}</a><br />
                        <div class="star star{$appfree.recommendlevel}"></div>
                        <div class="type">{$appfree.tag}</div>
                    </li>
                {/foreach}
                </ul>
            </div>
            <div class="service">
                <div class="title">
                    <div class="t">热门推荐</div>
                    <div class="pages"><span id="hot_page_no1" class="hot_page_no hot_page_no_show">1</span>&nbsp;<span id="hot_page_no2" class="hot_page_no">2</span>&nbsp;<span id="hot_page_no3" class="hot_page_no">3</span>&nbsp;&nbsp;<a><img id="hot_left" src="{$template_url}resources/images/arrow5.jpg" alt="" /></a>&nbsp;&nbsp;<a><img id="hot_right" src="{$template_url}resources/images/arrow6.jpg" alt="" /></a></div>
                </div>
                <div class="recommend">
                {foreach item=apphotrecommendshow from=$apphotrecommendfirst}
                    <div class="white">
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$apphotrecommendshow.appdown_id}"><img src="{$url_base}upload/images/{$apphotrecommendshow.image}" alt="{$apphotrecommendshow.appdown_name}" /></a><br />
                        <span><a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$apphotrecommendshow.appdown_id}">{$apphotrecommendshow.appdown_name}&nbsp;{$apphotrecommendshow.edition}</a></span><br />
                        <div class="star star{$apphotrecommendshow.recommendlevel} stars"></div>
                        <div class="type"><span>{$apphotrecommendshow.tag}</span></div>
                    </div>
                    <div class="words">&nbsp;&nbsp;&nbsp;&nbsp;{$apphotrecommendshow.introduction}</div>
                {/foreach}
                </div>
                <ul class="details2">
                {foreach  item=apphotrecommend from=$apphotrecommends name=text}
                    <li class="hot_show {if $smarty.foreach.text.iteration  % 4==0}right{/if} {if $smarty.foreach.text.iteration <= 8}hot_first_page{/if} {if $smarty.foreach.text.iteration > 8&&$smarty.foreach.text.iteration <= 16}hot_second_page{/if} {if $smarty.foreach.text.iteration > 16}hot_third_page{/if}">
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$apphotrecommend.appdown_id}"><img src="{$url_base}upload/images/{$apphotrecommend.ico}" alt="{$apphotrecommend.appdown_name}" title="{$apphotrecommend.appdown_name}" width="75px" height="75px"  /></a><br />
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$apphotrecommend.appdown_id}" title="{$apphotrecommend.appdown_name}">{$apphotrecommend.appdown_name}</a><br />
                        <div class="star star{$apphotrecommend.recommendlevel}"></div>
                        <div class="type">{$apphotrecommend.tag}</div>
                    </li>
                {/foreach}
                </ul>
            </div>
            <div class="service">
                <div class="title">
                    <div class="t">最新上架</div>
                    <div class="pages"><span id="newest_page_no1" class="newest_page_no newest_page_no_show">1</span>&nbsp;<span id="newest_page_no2" class="newest_page_no">2</span>&nbsp;<span id="newest_page_no3" class="newest_page_no">3</span>&nbsp;&nbsp;<a><img id="newest_left" src="{$template_url}resources/images/arrow5.jpg" alt="" /></a>&nbsp;&nbsp;<a><img id="newest_right" src="{$template_url}resources/images/arrow6.jpg" alt="" /></a></div>
                </div>
                <div class="recommend">
                {foreach item=appnewestshow from=$appnewestfirst}
                    <div class="white">
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appnewestshow.appdown_id}"><img src="{$url_base}upload/images/{$appnewestshow.image}" alt="{$appnewestshow.appdown_name}" /></a><br />
                        <span><a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appnewestshow.appdown_id}">{$appnewestshow.appdown_name}&nbsp;{$appnewestshow.edition}</a></span><br />
                        <div class="star star{$appnewestshow.recommendlevel} stars"></div>
                        <div class="type"><span>{$appnewestshow.tag}</span></div>
                    </div>
                    <div class="words">&nbsp;&nbsp;&nbsp;&nbsp;{$appnewestshow.introduction}</div>
                {/foreach}
                </div>
                <ul class="details2">
                {foreach item=appnewest from=$appnewests name=fxz}
                    <li class="newest_show {if $smarty.foreach.fxz.iteration  % 4==0}right{/if} {if $smarty.foreach.fxz.iteration <= 8}newest_first_page{/if} {if $smarty.foreach.fxz.iteration > 8&&$smarty.foreach.fxz.iteration <= 16}newest_second_page{/if} {if $smarty.foreach.fxz.iteration > 16}newest_third_page{/if}">
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appnewest.appdown_id}"><img src="{$url_base}upload/images/{$appnewest.ico}" alt="{$appnewest.appdown_name}" title="{$appnewest.appdown_name}" width="75px" height="75px"  /></a><br />
                        <a href="{$url_base}index.php?go=kmall.appdown.view&appdown_id={$appnewest.appdown_id}" title="{$appnewest.appdown_name}">{$appnewest.appdown_name}</a><br />
                        <div class="star star{$appnewest.recommendlevel}"></div>
                        <div class="type">{$appnewest.tag}</div>
                    </li>
                {/foreach}
                </ul>
            </div>
        </div>
    </div>
{/block}