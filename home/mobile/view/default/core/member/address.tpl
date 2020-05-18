{extends file="$templateDir/layout/goods/layout.tpl"}
{block name=body}
    <!-- <div id="wrapper"> -->
        <div class="int_title">
          <span class="int_pic">
            <a href="javascript:history.back(-1);">
              <img src="{$template_url}resources/images/jifen/left.png"/>
            </a>
          </span>
          新建地址
        </div>
        <div class="m_pwd">
            <form method="get" action="{$url_base}index.php?go=mobile.member.addAddress" id="addAddressFrom">
            <span class="new topline">收货人：
                <input type="text" name="consignee" id="input_name" class="input_name" value="" />
                <span></span>
            </span>
            <span class="new topline">联系方式：
                <input name="mobile" type="text" id="input_phone" value="" />
                <span></span>
            </span>
            <span class="new topline">选择地区：
                <select name="country" id="country"><option value="0">选国</option><option value="1">中国</option></select>
                <select name="province" id="province"><option value="0">选省</option></select>
                <select name="city" id="city"><option value="0">选市</option></select>
                <select name="district" id="district" style="width:80px;"><option value="0">选区</option></select>
                <span></span>
            </span>
            <span class="new topline">详细地址：<input name="address" type="text" id="input_address" class="input_add" value="" />
                <span></span>
            </span>
                <p class="new_ti">
                    <input type="hidden" name="go" value="mobile.member.addAddress" />
                    <input name="location" type="hidden" value="{$smarty.get.location}" />
                    <a href="#" class="add_bc">保存并使用</a>
                </p>
            </form>
        </div>
    <!-- </div> -->
{/block}
