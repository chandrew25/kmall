{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
  <div class="container">
      <div class="member_top" id="shuaxin">
        <div class="member_code">
          <div class="code">手机号：{$member->user_mobile}</div>
          <div class="balance">￥{$member->user_balance}</div>
          <div class="point">{$member->user_point}</div>
        </div>
      </div>
      <div class="member_list">
          <div class="member_list_left">
            <a href="{$url_base}index.php?go=mobile2.member.add">
              <div class="member_info"></div>
            </a>
            <a href="{$url_base}index.php?go=mobile2.order.lists">
              <div class="orders_list"></div>
            </a>
          </div>
          <div class="member_list_right"> 
            <a href="{$url_base}index.php?go=mobile2.goods.lists">
              <div class="weiligoods"></div>
            </a>
            <a href="{$url_base}index.php?go=mobile2.index.addno&msg=3">
              <div class="coupon"></div>
            </a>
          </div>
      </div>
  </div>
  
{/block}
