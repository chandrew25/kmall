{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div id="{$test}" ></div>
<div class="con_bg">                                       
    <div class="con_bg_img">
        <div class="con_bg_left">
            <div class="left_txt">
                <p>1、输入礼券号与密码 </p>
                <p>2、选择需要兑换的商品 </p>
                <p>3、填写收货人信息  </p>
                <p>4、信息确认 </p>
                <p>5、提交成功 </p>
            </div>
            <div class="right_login">
                <form action="{$url_base}index.php?go=kmall.voucher.view" method="post" id="voucherForm">
                <div class="right_title">兑换券兑换处</div>
                <div class="right_name">礼券号码：</div>
                <div class="right_input"><input type="text" name="voucher_key" value="" class="inputField" /></div>
                <div class="right_name">礼券密码：<span style="color:red">(背面刮开区)</span></div>
                <div class="right_input"><input type="text" name="voucher_cipher" value="" class="inputField" /></div>
                <div>
                    <div class="login_btn submit_btn"></div>
                    <div class="login_btn reset_btn"></div>
                    <div class="clear"></div>
                </div>
                </form>
                <div class="bottom_txt">
                    <div class="right_name tishi">温馨提示：</div>
                    <div class="msg_gift">您的券号和密码位于券的里侧左下角，请小心刮
开密码区，输入正确的券号和密码进行验证。</div>
                </div>
            </div>    
        </div>   
    </div>      
</div>
{/block}