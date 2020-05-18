{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div class="bannerw url" item="{$template_url}">
        <div class="container_width" id="banner">
            <div class="bimgwlayer"></div>
            <div class="bimgw">
                <a><img src="{$template_url}resources/images/banner/smartv_banner.jpg"/></a>
                <a><img src="{$template_url}resources/images/banner/ban02.jpg"/></a>
                <a><img src="{$template_url}resources/images/banner/ban03.jpg"/></a>
                <a><img src="{$template_url}resources/images/banner/ban04.jpg"/></a>
                <a><img src="{$template_url}resources/images/banner/ban05.jpg"/></a>
            </div>
            <div class="btnw"></div>
        </div>
    </div>
    <div id="main" class="outermost_width fixpng">
        <div id="left">
            <div class="title"></div>
            <div class="type_title">
                <div class="tt_ico"></div>
                <div class="tt_name">尺寸</div>
            </div>
            <div class="size_list">
                <div class="size_show">
                    <label>
                        <div class="ss_ico">
                            <input type="checkbox" checked=""> 
                        </div>
                        <div class="ss_show">28"</div>
                    </label>
                </div>
                <div class="size_show">
                    <label>
                        <div class="ss_ico">
                            <input type="checkbox" checked=""> 
                        </div>
                        <div class="ss_show">36"</div>
                    </label>
                </div>
                <div class="size_show">
                    <label>
                        <div class="ss_ico">
                            <input type="checkbox" checked=""> 
                        </div>
                        <div class="ss_show">42"</div>
                    </label>
                </div>
            </div>
            <div class="type_title">
                <div class="tt_ico"></div>
                <div class="tt_name">系列</div>
            </div>
            <div class="series_list">
                <div class="series_show">
                    <label>
                        <div class="ses_ico">
                            <input type="checkbox" checked=""> 
                        </div>
                        <div class="ses_show">V7500A-3D系列</div>
                    </label>
                </div>
                <div class="series_show">
                    <label>
                        <div class="ses_ico">
                            <input type="checkbox" checked=""> 
                        </div>
                        <div class="ses_show">E5010系列</div>
                    </label>
                </div>
                <div class="series_show">
                    <label>
                        <div class="ses_ico">
                            <input type="checkbox" checked=""> 
                        </div>
                        <div class="ses_show">X9200-3D系列</div>
                    </label>
                </div>
            </div>
        </div>
        <div id="right">
            <div class="lists">
                <div class="tv_image"></div>
                <div class="tv_detail"></div>
                <div class="tv_price"></div>
                <div class="tv_buy"></div>
            </div>
            <div class="lists"></div>
            <div class="lists"></div>
            <div class="lists"></div>
            <div class="lists"></div>
            <div class="lists"></div>
        </div>
    </div>
{/block}