{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="main outermost_width">
    <div class="navi_left">
        <div class="box1">
            <div class="title color_white"><a href="{$url_base}index.php?go=kmall.news.lists">关于我们</a></div>
            <ul class="items">
                <li class="tt">商城公告</li>
                {foreach from=$noticelist item=item}
                <li><a href="{$url_base}index.php?go=kmall.news.lists&news_id={$item.news_id}">{$item.news_title|truncate:15:"..."}</a></li>
                {/foreach}
                <li class="tt">导购信息</li>
                {foreach from=$guidelist item=item}
                <li><a href="{$url_base}index.php?go=kmall.news.lists&news_id={$item.news_id}">{$item.news_title|truncate:15:"..."}</a></li>
                {/foreach}
            </ul>
        </div>
    </div>
    <div class="content">
        <div class="passage">
            <div class="head">
                <div class="title">{$news.news_title}</div>
                <!--
                <div class="more"><a><img src="{$template_url}resources/images/upload/more.png" alt="more" /></a></div>
                -->
            </div>
            <div class="time_share">
                <div class="time">时间：{$news.sendTime|date_format:'%Y-%m-%d'}</div>
                <div class="share">
                	<div class="txt">分享到：</div>
                	<div class="plugin jiathis_style">
						<a class="jiathis_button_tqq"></a>
						<a class="jiathis_button_douban"></a>
						<a class="jiathis_button_renren"></a>
						<a class="jiathis_button_kaixin001"></a>
						<a class="jiathis_button_tsina"></a>
						<a href="http://www.jiathis.com/share" class="jiathis jiathis_txt jtico jtico_jiathis" target="_blank"></a>
					</div>
					<script type="text/javascript" src="http://v3.jiathis.com/code_mini/jia.js?uid=1354881411804640" charset="utf-8"></script>
				</div>
            </div>
            <div class="main_passage">{$news.news_content}</div>
        </div>
    </div>
</div>
{/block}
