{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
{*<div id="wrapper" class="inner_style">*}
    <div class="int_title">
        <span class="int_pic">
            <a href="{$url_base}index.php?go=mobile.index.index">
                <img src="{$template_url}resources/images/jifen/left.png"/>
            </a>
        </span>
        {$pty->name}
        <label class="sel_type">筛选</label>
    </div>
    {*<div class="secskill-content inner_pages topline">*}
        {*<ul class="swiper-wrapper inner_nav">*}
            {*{foreach from=$ptype item=top_ptype key=index}*}
            {*<li class="swiper-slide inner_con {if $ptypeid==$top_ptype->ptype_id}inner_con_style{/if}">*}
                {*<a href="{$url_base}index.php?go=mobile.type.lists_info&ptype_id={$ptype_id}&ptypeid={$top_ptype->ptype_id}">*}
                {*{$top_ptype->name}*}
                {*</a>*}
                {*<span class="inner_border_con" {if $ptypeid==$top_ptype->ptype_id}style="display: block;"{/if} ></span>*}
            {*</li>*}
            {*{/foreach}*}
        {*</ul>*}
    {*</div>*}
    <div class="type_list">
        <div class="type_list_title">二级分类</div>
        <ul>
            {foreach from=$ptype item=top_ptype key=index}
            <li class="{if $ptypeid==$top_ptype.ptype_id}inner_con_style{/if}">
                <a class="tl_title" href="{$url_base}index.php?go=mobile.type.lists_info2&ptype_id={$ptype_id}&ptypeid={$top_ptype.ptype_id}">
                {$top_ptype.name}
                </a>
            </li>
            {/foreach}
        </ul>
    </div>
    <!--商品-->
    <main>
        <div class="best_Sellers best_top clearfix">
            <ul style="display: block;" class="clearfix best_content">
                {foreach from=$productData item=p}
                <a href="{$url_base}index.php?go=mobile.goods.info&id={$p->product_id}">
                    <li class="border_right fl">
                        <img src="{$upload_url}images/{$p->image}" style='min-width:180px; min-height:180px;line-height:180px;text-align:center;' alt="暂无图片" />
                        <span>{$p->productShow}</span>
                        <span class="int_color">￥{$p.price|string_format:'%d'}+{$p.jifen|string_format:'%d'}券</span>
                    </li>
                </a>
                {/foreach}
            </ul>
        </div>
        <p class="notice">没有更多商品了！</p>
    </main>
    <script>
        $(function(){
            $("body").css("background-color", "#f2f2f2");
            var currentScreen = 1;
            var maxScreen     = 1;
            mimicData(currentScreen);

            //滚动翻页: https://stackoverflow.com/questions/14035180/jquery-load-more-data-on-scroll
            $(window).scroll(function() {
                if ( $(window).scrollTop() == $(document).height() - $(window).height() ) {
                    mimicData(++currentScreen);
                }
            });
            var url_base = "{$url_base}";
            function mimicData(screen){
                if (currentScreen > maxScreen) {
                    var page = currentScreen;
                    $.ajax({
                        url:"api/mobile/type1.php",
                        data: {
                            page: page,
                            pageSize: 10,
                            ptype_id: "{$smarty.get.ptype_id}",
                            ptypeid: "{$ptypeid}"
                        },
                        dataType: "json",
                        success: function(response){
                            var data = response.data;
                            var countAll = response.recordsFiltered;
                            var currentCount = ( currentScreen - 1 ) * 10 + data.length;
                            console.log(data);

                            if ( data && data.length > 0 ) {
                                var product;
                                var result = "";

                                if (countAll > currentCount){
                                    for (var i = 0; i < data.length; i++) {
                                        product = data[i];
                                        result += "    <a href='" + url_base + "index.php?go=mobile.goods.info&id=" + product.product_id + "'>" +
                                                  "        <li class='border_right fl'> " +
                                                  "            <img src='" + product.image + "' style='min-width:180px; min-height:180px;line-height:180px;text-align:center;' alt='暂无图片' /> " +
                                                  "            <span>" + product.productShow + "</span>" +
                                                  "            <span class='int_color'>￥" + product.price + "+" + product.jifen + "券</span>" +
                                                  "        </li>" +
                                                  "    </a>";
                                    }
                                    $(".best_content").append(result).fadeIn();
                                    $(window).scrollTop($(window).scrollTop()-1);
                                    if ( countAll == data.length) $(".notice").css("display", "block");
                                } else {
                                    $(".notice").css("display", "block");
                                }
                            }else{
                                $(".notice").css("display", "block");
                            }
                        }
                    });
                }
            }
        });

    </script>
{/block}
