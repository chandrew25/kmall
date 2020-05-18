<div class="header">
    <div class="top_box">
        <div class="center">
            <div class="top_left">
                <span>您好，欢迎进入菲彼生活</span>
                {if $smarty.session.member_id}
                <a href="{$url_base}index.php?go=kmall.member.view" class="login_link">会员中心</a>
                <span class="top_line">&nbsp;</span>
                <a href="{$url_base}index.php?go=kmall.auth.logout" style="margin-left:0px;" class="login_link">退出</a>
                {else}
                <a href="{$url_base}index.php?go=kmall.auth.login" class="login_link">登录</a>
                <span class="top_line">&nbsp;</span>
                <a href="{$url_base}index.php?go=kmall.auth.register" style="margin-left:0px;" class="login_link">免费注册</a>
                {/if}
                <span class="top_line">&nbsp;</span>
                <a href="index.php?go=kmall.helpcenter.view" target="_blank">帮助中心</a>
                <!-- <span class="top_line">&nbsp;</span> -->
                <!-- <a href="#" target="_blank">在线客服</a> -->
                <span class="top_line">&nbsp;</span>
                <a href="javascript:addFavorite()">收藏我们</a>
            </div>
            <div class="top_right">
                <span>咨询热线：<span class="tel">400-8035-170</span></span>
                <span class="top_line">&nbsp;</span>
                <a href="{$url_base}index.php?go=kmall.cart.lists" target="_blank" class="car">购物车
                    <span class="car_num">{$memberInfo.count|default:'0'}</span>
                </a>
                <span class="top_line">&nbsp;</span>
                <a href="{$url_base}index.php?go=kmall.member.view" class="members">我的账户</a>
            </div>
        </div>
    </div>
    <div class="logo_box center">
        <div class="logo">
            <a href="{$url_base}index.php?go=kmall.index.index">
                <img src="{$template_url}resources/images/main/logo.png" width="339" height="39">
            </a>
        </div>
        <div class="search">
            <form action="{$url_base}index.php?" method="get">
                <input type="hidden" name="go" value="kmall.search.lists">
                <input type="text" name="search_keyword" value="{$search_keyword|default:''}" placeholder="请输入要搜索的名字"/>
                <input class="search_btn" type="submit" value=""/>
            </form>
        </div>
        <div class="erweima_box">
            <div class="erweima">
                <img src="{$template_url}resources/images/main/erweima.jpg" width="70" height="70">
            </div>
            <div class="erweima_txt">扫码关注<br>菲彼生活公众号</div>
        </div>
    </div>
    <div class="menu">
        <div class="center category_box">
            <div class="all_cg"><a style="color:#fff;" href="{$url_base}index.php?go=kmall.index.index">全部商品</a></div>
            <div class="menu_item menu_home"><a href="{$url_base}index.php?go=kmall.index.index">首页</a></div>
            <div class="menu_item"><a href="{$url_base}index.php?go=kmall.country.lists" target="_blank">国际馆</a></div>
            <div class="menu_item"><a href="{$url_base}index.php?go=kmall.brand.lists" target="_blank">大牌馆</a></div>
            <div class="menu_item"><a href="{$url_base}index.php?go=kmall.gift.lists" target="_blank">礼包馆</a></div>
            <div class="menu_item"><a href="{$url_base}index.php?go=kmall.index.wealth" target="_blank">拍卖馆</a></div>
            <div class="menu_item"><a href="{$url_base}index.php?go=kmall.active.lists" target="_blank">活动馆</a></div>
            <div class="menu_item"><a href="{$url_base}index.php?go=kmall.privatepet.lists" target="_blank">私宠馆</a></div>

            <div class="category">
                <div class="category_bg">
                    {foreach from=$ptype_arr item=top_ptype key=index}
                    <div class="category_item category_item{$index+1}">
                        <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$top_ptype->ptype_id}" target="_blank">{$top_ptype->name}</a>
                        <img class="category_icon" src="{$template_url}resources/images/c_icon_right.png">
                    </div>
                    {/foreach}
                </div>
            </div>

            <div class="ptype_box">
                {foreach from=$ptype_arr item=top_ptype key=index}
                <div class="ptype_lists">
                    {foreach from=$sub_ptype_arr[$top_ptype->ptype_id] item=sub_ptype}
                    <div class="ptype_line">
                        <div class="ptype_left"><a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$sub_ptype->ptype_id}" target="_blank">{$sub_ptype->name}</a></div>
                        <div class="ptype_right">
                            {foreach from=$thr_ptype_arr[$sub_ptype->ptype_id] item=thr_ptype}
                            <a href="{$url_base}index.php?go=kmall.ptype.lists&ptype_id={$thr_ptype->ptype_id}" target="_blank" class="ptype_item">{$thr_ptype->name}</a>
                            {/foreach}
                        </div>
                        <div class="clear"></div>
                    </div>
                    {/foreach}
                </div>
                {/foreach}
            </div>

        </div>
    </div>
</div>
<div class="fixed_search">
  <div class="fixed_logo center">
    <div class="logo">
      <a href="#">
        <img src="{$template_url}resources/images/main/logo.png" width="339" height="39">
      </a>
    </div>
    <div class="search">
      <form action="{$url_base}index.php?" method="get">
          <input type="hidden" name="go" value="kmall.search.lists">
          <input type="text" name="search_keyword" value="{$search_keyword|default:''}" placeholder="请输入要搜索的名字"/>
          <input class="search_btn" type="submit" value=""/>
      </form>
    </div>
  </div>
</div>
