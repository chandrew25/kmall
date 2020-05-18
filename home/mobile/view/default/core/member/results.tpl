{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
    <div id="wrapper" class="m_pwd">
        <!--<h2 class="int_title clearfix"><span class="int_pic"><img src="images/jifen/left.png"/></span>券商城</h2>-->
        <div class="int_title"><span class="int_pic"><a href="index.php?go=mobile.member.view"><img src="{$template_url}resources/images/jifen/left.png"/></a></span>我的收货地址</div>
        <!--banner start-->
        <div class="fill_order clearfix">
            <ul class="fill_box">
                {foreach item=address from=$addresses name=index}
                <a class="fill_box" href="{$url_base}index.php?go=mobile.member.addressupd&aid={$address->address_id}">
                <li class="fill_left fill_list fl">
                    <span class="fill_span">{$address->consignee}  {$address->mobile}</span>
                    <p class="fill_pic clearfix">
                        <span class="span_pic fl"><img src="{$template_url}resources/images/ddxq/icon.png"></span>
                        <span class="span_text fr">{$address->allregion}{$address->address}</span>
                    </p>
                </li>
                <li class="fill_right fill_list fr">
                <img src="{$template_url}resources/images/ddxq/right.png" class="fill_img" />
                </li>
                </a>
                {/foreach}
            </ul>
        </div>
        <p class="new_ti">
            <a href="{$url_base}index.php?go=mobile.member.address" class="add_bc">新增收货地址</a>
        </p>
        <!--menu  start-->
    </div>
    <!--menu  end-->
    <div id="back_top">
        <a href="#"><img src="{$template_url}resources/images/xqq/the_top.png" /></a>
    </div>
{/block}
