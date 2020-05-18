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
            <a href="{$url_base}index.php?go=youzan.member.edit">
              <div class="member_info"></div>
            </a>
            <a href="{$url_base}index.php?go=youzan.order.invoice">
              <div class="invon_lists"></div>
            </a>
          </div>
          <div class="member_list_right"> 
            <a href="{$url_base}index.php?go=youzan.order.recharge">
              <div class="recharge_list"></div>
            </a>
            <a href="{$url_base}index.php?go=youzan.coupon.lists">
              <div class="coupon"><div class="coupon_count">{$count} 张</div></div>
            </a>
          </div>
      </div>
  </div>
  
{/block}
