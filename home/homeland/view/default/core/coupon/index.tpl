{extends file="$templateDir/layout/member/layout.tpl"}
{block name=body}
  <div class="container">
      <div class="member_title">
          <div class="member_title_left">使用优惠券</div>
      </div>
      {if count($data)>0}
      {foreach from=$data item=coupon key=index}
      <div class="coupon_li">
          <div class="coupon_li_top" id="{$index}">
            <div class="coupon_li_left">
                <div class="name">{$coupon->batch_name}</div>
                <div class="time">
                    {$coupon->time|date_format:"%Y-%m-%d"}至{$coupon->exp_date|date_format:"%Y-%m-%d"}
                </div>
            </div>
            <div class="coupon_li_right">
                <div class="amount">￥{$coupon->amount}</div>
                <div class="up" id="up{$index}">∧</div>
                <div class="ub" id="ub{$index}">∨</div>
            </div>
          </div>
          <div class="coupon_li_bottom" id="bottom{$index}">
            <div class="pwd">券码:{$coupon->coupon_pwd}</div>
            <div class="remarks">{$coupon->remarks}</div>
          </div>
      </div>
      {/foreach}
      {/if}
  </div>
{/block}
