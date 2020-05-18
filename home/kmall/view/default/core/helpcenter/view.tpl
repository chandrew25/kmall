{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="main outermost_width">
    ﻿<div class="mbar">
        <div class="caselist">
            <div class="ct">帮助中心</div>
            <ul class="clist">
                {foreach item=b from=$help key=index}
                <li><div class="i"></div><a href="index.php?go=kmall.helpcenter.view&help_id={$b->helpcenter_id}">{$b->help_title}</a></li>
                {/foreach}
            </ul>
        </div>
    </div>
    <div class="mcon">
        <div class="ct">帮助中心</div>
        <div class="cbor">
            <div class="bred"></div>
            <div class="bgray"></div>
        </div>
        <div class="ht">{$help_center.help_title}</div>
        <div class="hcon">{$help_center.help_content}</div>
    </div>
</div>
{/block}