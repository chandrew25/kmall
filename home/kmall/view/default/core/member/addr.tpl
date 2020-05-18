{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
    {php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
    <div class="right_list">
        <div class="title"><span class="span_w">收货地址</span><span class="span_color">（“<span>*</span>”为必填选项）</span></div>
        <div class="add" onclick="click_add();"><span>增加收货地址</span></div>
        <div class="div_tab" id="tab_add" style="display:none;">
        <form method="get" action="{$url_base}index.php?go=kmall.member.addAddress">
                    <!--<table class="tbl">
                        <tr>
                            <td align="right">配送区域：</td>
                            <td colspan="3">
                                &nbsp;
                                <select name="country">
                                    <option value="0">请选择国家</option>
                                    <option value="1" selected="selected">中国</option>
                                </select>
                                <select name="province" id="province{$address.address_id}">
                                    <option value="0">请选择省</option>
                                    {foreach item=region from=$regions}
                                    <option value="{$region->region_id}" {if ($region->region_id==$address.province)}selected{/if}>{$region->region_name}</option>
                                    {/foreach}
                                </select>
                                <select name="city" id="city{$address.address_id}">
                                    <option value="0">请选择市</option>
                                    {foreach item=region from=$address.citys_by_province}
                                    <option value="{$region->region_id}" {if ($region->region_id==$address.city)}selected{/if}>{$region->region_name}</option>
                                    {/foreach}
                                </select>
                                <select name="district" id="district{$address.address_id}">     
                                    <option value="0">请选择区</option>
                                    {foreach item=region from=$address.district_by_city}
                                    <option value="{$region->region_id}" {if ($region->region_id==$address.district)}selected{/if}>{$region->region_name}</option>
                                    {/foreach}
                                </select><span>（必填）</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="right" width="100">收货人姓名：</td>
                            <td width="260"><input name="consignee" type="text" class="inputBg" size="20" value="{$address.consignee}"/><span>（必填）</span></td>
                            <td align="right" width="100">电子邮箱地址：</td>
                            <td width="260"><input name="email" type="text" class="inputBg" size="20" value="{$address.email}" /><span></span></td>
                        </tr>
                        <tr>
                            <td align="right">详细地址：</td>
                            <td><input name="address" type="text" class="inputBg" size="20" value="{$address.address}"/><span>（必填）</span></td>
                            <td align="right">邮政编码：</td>
                            <td><input name="zipcode" type="text" class="inputBg" size="20" value="{$address.zipcode}"/><span class="notice"></span></td>
                        </tr>
                        <tr>
                            <td align="right">电话：</td>
                            <td><input name="tel" type="text" class="inputBg" size="20" value="{$address.tel}"/><span>（电话，手机必填一项）</span></td>
                            <td align="right">手机：</td>
                            <td><input name="mobile" type="text" class="inputBg" size="20" value="{$address.mobile}"/><span>（电话，手机必填一项）</span></td>
                        </tr>
                        <tr>
                            <td align="right">标志建筑：</td>
                            <td><input name="sign_building" type="text" class="inputBg" size="20" value="{$address.sign_building}" /><span></span></td>
                            <td align="right">最佳送货时间：</td>
                            <td><input name="bestTime" type="text" class="inputBg" size="20" value="{$address.best_time}"/></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td colspan="3">
                                <input type="hidden" name="add_go" value="kmall.member.addAddress" />
                                <input type="hidden" name="del_go" value="kmall.member.delAddress" />
                                
                                <input type="hidden" name="go"/>
                                <input name="location" type="hidden" value="{$smarty.get.location}" />
                                <input name="address_id" type="hidden" value="{$address.address_id}" />
                                <img class="confirmUpdate" src="{$template_url}resources/images/member/confirmUpdate.jpg"/><!--修改-->
                                <img class="del" src="{$template_url}resources/images/member/del.jpg"/><!--删除-->
                            </td>
                        </tr>
                    </table>-->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="80" class="td_tl" id="name"><p class="span_f">*</p>真实姓名：</td>
                        <td width="500"><input type="text" name="consignee" id="input_name" class="input_name" value="" /></td> 
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f">*</p>地　　区：</td>
                        <td width="500">
                            <select name="country"><option value="0">请选择国</option><option value="1">中国</option></select>
                            <select name="province" id="province"><option value="0">请选择省</option></select>
                            <select name="city" id="city"><option value="0">请选择市</option></select>
                            <select name="district" id="district"><option value="0">请选择区</option></select>                    
                        </td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f">*</p>详细地址：</td>
                        <td width="500"><input name="address" type="text" id="input_address" class="input_add" value="" /></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f"></p>邮政编码：</td>
                        <td width="500"><input name="zipcode" type="text" id="input_yb" value="" /></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f">*</p>手　　机：</td>
                        <td width="500"><input name="mobile" type="text" id="input_phone" value="" /></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f"></p>邮　　箱：</td>
                        <td width="500"><input name="email" type="text" id="input_email" value="" /></td>
                      </tr>
                      </table>
                <input type="hidden" name="go" value="kmall.member.addAddress" />
                <input type="submit" class="update" onclick="click_addbc();" value="保  存"/>
                <div class="back" onclick="click_back();"><span>返  回</span></div>
                <div class="clear"></div>
            </form>
        </div>
        <div class="div_tab" id="tab_ud">
            {if count($addresses)>0}
            {foreach item=address from=$addresses}
                <form method="get" action="{$url_base}index.php?go=kmall.member.addAddress">
                    <!--<table class="tbl">
                        <tr>
                            <td align="right">配送区域：</td>
                            <td colspan="3">
                                &nbsp;
                                <select name="country"><option value="0">请选择国</option><option value="1">中国</option></select>
                                <select name="province" id="province"><option value="0">请选择省</option></select>
                                <select name="city" id="city"><option value="0">请选择市</option></select>
                                <select name="district" id="district"><option value="0">请选择区</option></select><span>（必填）</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="right" width="100">收货人姓名：</td>
                            <td width="260"><input name="consignee" type="text" class="inputBg" size="20"/><span>（必填）</span></td>
                            <td align="right" width="100">电子邮箱地址：</td>
                            <td width="260"><input name="email" type="text" class="inputBg" size="20" value=""/><span></span></td>
                        </tr>
                        <tr>
                            <td align="right">详细地址：</td>
                            <td><input name="address" type="text" class="inputBg" size="20"/><span>（必填）</span></td>
                            <td align="right">邮政编码：</td>
                            <td><input name="zipcode" type="text" class="inputBg" size="20"/><span class="notice"></span></td>
                        </tr>
                        <tr>
                            <td align="right">电话：</td>
                            <td><input name="tel" type="text" class="inputBg" size="20"/><span>（电话，手机必填一项）</span></td>
                            <td align="right">手机：</td>
                            <td><input name="mobile" type="text" class="inputBg" size="20"/><span>（电话，手机必填一项）</span></td>
                        </tr>
                        <tr>
                            <td align="right">标志建筑：</td>
                            <td><input name="sign_building" type="text" class="inputBg" size="20"/><span></span></td>
                            <td align="right">最佳送货时间：</td>
                            <td><input name="bestTime" type="text" class="inputBg" size="20"/></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td colspan="3" align="center">
                                <input type="hidden" name="go" value="kmall.member.addAddress" />
                                <img class="newAdd png" src="{$template_url}resources/images/member/add.png"/>
                            </td>
                        </tr>
                    </table>-->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="80" class="td_tl" id="name"><p style="display:none;" class="span_f">*</p>真实姓名：</td>
                        <td width="500"><input name="consignee" type="text" style="display:none;" id="input_name" class="input_name" value="{$address.consignee}" /><span>{$address.consignee}</span></td> 
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f">*</p>地　　区：</td>
                        <td width="500">
                            <select name="country" style="display: none;">
                                <option value="0">请选择国家</option>
                                <option value="1" selected="selected">中国</option>
                            </select>
                            <select name="province" style="display: none;" id="province{$address.address_id}">
                                <option value="0">请选择省</option>
                                {foreach item=region from=$regions}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.province)}selected{/if}>{$region->region_name}</option>
                                {/foreach}
                            </select>
                            <select name="city" style="display: none;" id="city{$address.address_id}">
                                <option value="0">请选择市</option>
                                {foreach item=region from=$address.citys_by_province}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.city)}selected{/if}>{$region->region_name}</option>
                                {/foreach}
                            </select>
                            <select name="district" style="display: none;" id="district{$address.address_id}">     
                                <option value="0">请选择区</option>
                                {foreach item=region from=$address.district_by_city}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.district)}selected{/if}>{$region->region_name}</option>
                                {/foreach}
                            </select>
                            <span>{$address.allregion}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f">*</p>详细地址：</td>
                        <td width="500"><input type="text" name="address" style="display:none;" id="input_address" class="input_add" value="{$address.address}" /><span>{$address.address}</span></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f"></p>邮政编码：</td>
                        <td width="500"><input type="text" name="zipcode" style="display:none;" id="input_yb" value="{$address.zipcode}" /><span>{$address.zipcode}</span></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f">*</p>手　　机：</td>
                        <td width="500"><input type="text" name="mobile" style="display:none;" id="input_phone" value="{$address.mobile}" /><span>{$address.mobile}</span></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f"></p>邮　　箱：</td>
                        <td width="500"><input type="text" name="email" style="display:none;" id="input_email" value="{$address.email}" /><span>{$address.email}</span></td>
                      </tr>
                    </table>
                    <div class="update" onclick="click_update();"><span>修  改</span></div>
                    <div class="del"><span>删  除</span></div>
                    <input type="hidden" name="go" value="kmall.member.addAddress" />
                    <input class="bc" type="submit" onclick="click_bc();" style="display:none;" value="保  存"/>
                </form>
            {/foreach}
            {/if}
        </div>
    </div>
    <div class="clear"></div>
</div>
{/block}{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
<div class="manage">
    {php}include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php");{/php}
    <div class="right_list">
        <div class="title"><span class="span_w">收货地址</span><span class="span_color">（“<span>*</span>”为必填选项）</span></div>
        <div class="add" onclick="click_add();"><span>增加收货地址</span></div>
        <div class="div_tab" id="tab_add" style="display:none;">
        <form method="get" action="{$url_base}index.php?go=kmall.member.addAddress">
                    <!--<table class="tbl">
                        <tr>
                            <td align="right">配送区域：</td>
                            <td colspan="3">
                                &nbsp;
                                <select name="country">
                                    <option value="0">请选择国家</option>
                                    <option value="1" selected="selected">中国</option>
                                </select>
                                <select name="province" id="province{$address.address_id}">
                                    <option value="0">请选择省</option>
                                    {foreach item=region from=$regions}
                                    <option value="{$region->region_id}" {if ($region->region_id==$address.province)}selected{/if}>{$region->region_name}</option>
                                    {/foreach}
                                </select>
                                <select name="city" id="city{$address.address_id}">
                                    <option value="0">请选择市</option>
                                    {foreach item=region from=$address.citys_by_province}
                                    <option value="{$region->region_id}" {if ($region->region_id==$address.city)}selected{/if}>{$region->region_name}</option>
                                    {/foreach}
                                </select>
                                <select name="district" id="district{$address.address_id}">     
                                    <option value="0">请选择区</option>
                                    {foreach item=region from=$address.district_by_city}
                                    <option value="{$region->region_id}" {if ($region->region_id==$address.district)}selected{/if}>{$region->region_name}</option>
                                    {/foreach}
                                </select><span>（必填）</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="right" width="100">收货人姓名：</td>
                            <td width="260"><input name="consignee" type="text" class="inputBg" size="20" value="{$address.consignee}"/><span>（必填）</span></td>
                            <td align="right" width="100">电子邮箱地址：</td>
                            <td width="260"><input name="email" type="text" class="inputBg" size="20" value="{$address.email}" /><span></span></td>
                        </tr>
                        <tr>
                            <td align="right">详细地址：</td>
                            <td><input name="address" type="text" class="inputBg" size="20" value="{$address.address}"/><span>（必填）</span></td>
                            <td align="right">邮政编码：</td>
                            <td><input name="zipcode" type="text" class="inputBg" size="20" value="{$address.zipcode}"/><span class="notice"></span></td>
                        </tr>
                        <tr>
                            <td align="right">电话：</td>
                            <td><input name="tel" type="text" class="inputBg" size="20" value="{$address.tel}"/><span>（电话，手机必填一项）</span></td>
                            <td align="right">手机：</td>
                            <td><input name="mobile" type="text" class="inputBg" size="20" value="{$address.mobile}"/><span>（电话，手机必填一项）</span></td>
                        </tr>
                        <tr>
                            <td align="right">标志建筑：</td>
                            <td><input name="sign_building" type="text" class="inputBg" size="20" value="{$address.sign_building}" /><span></span></td>
                            <td align="right">最佳送货时间：</td>
                            <td><input name="bestTime" type="text" class="inputBg" size="20" value="{$address.best_time}"/></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td colspan="3">
                                <input type="hidden" name="add_go" value="kmall.member.addAddress" />
                                <input type="hidden" name="del_go" value="kmall.member.delAddress" />
                                
                                <input type="hidden" name="go"/>
                                <input name="location" type="hidden" value="{$smarty.get.location}" />
                                <input name="address_id" type="hidden" value="{$address.address_id}" />
                                <img class="confirmUpdate" src="{$template_url}resources/images/member/confirmUpdate.jpg"/><!--修改-->
                                <img class="del" src="{$template_url}resources/images/member/del.jpg"/><!--删除-->
                            </td>
                        </tr>
                    </table>-->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="80" class="td_tl" id="name"><p class="span_f">*</p>真实姓名：</td>
                        <td width="500"><input type="text" name="consignee" id="input_name" class="input_name" value="" /></td> 
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f">*</p>地　　区：</td>
                        <td width="500">
                            <select name="country"><option value="0">请选择国</option><option value="1">中国</option></select>
                            <select name="province" id="province"><option value="0">请选择省</option></select>
                            <select name="city" id="city"><option value="0">请选择市</option></select>
                            <select name="district" id="district"><option value="0">请选择区</option></select>                    
                        </td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f">*</p>详细地址：</td>
                        <td width="500"><input name="address" type="text" id="input_address" class="input_add" value="" /></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f"></p>邮政编码：</td>
                        <td width="500"><input name="zipcode" type="text" id="input_yb" value="" /></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f">*</p>手　　机：</td>
                        <td width="500"><input name="mobile" type="text" id="input_phone" value="" /></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p class="span_f"></p>邮　　箱：</td>
                        <td width="500"><input name="email" type="text" id="input_email" value="" /></td>
                      </tr>
                      </table>
                <input type="hidden" name="go" value="kmall.member.addAddress" />
                <input type="submit" class="update" onclick="click_addbc();" value="保  存"/>
                <div class="back" onclick="click_back();"><span>返  回</span></div>
                <div class="clear"></div>
            </form>
        </div>
        {if count($addresses)>0}
            {foreach item=address from=$addresses}
        <div class="div_tab" id="tab_ud">
            
                <form method="get" action="{$url_base}index.php?go=kmall.member.addAddress">
                    <!--<table class="tbl">
                        <tr>
                            <td align="right">配送区域：</td>
                            <td colspan="3">
                                &nbsp;
                                <select name="country"><option value="0">请选择国</option><option value="1">中国</option></select>
                                <select name="province" id="province"><option value="0">请选择省</option></select>
                                <select name="city" id="city"><option value="0">请选择市</option></select>
                                <select name="district" id="district"><option value="0">请选择区</option></select><span>（必填）</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="right" width="100">收货人姓名：</td>
                            <td width="260"><input name="consignee" type="text" class="inputBg" size="20"/><span>（必填）</span></td>
                            <td align="right" width="100">电子邮箱地址：</td>
                            <td width="260"><input name="email" type="text" class="inputBg" size="20" value=""/><span></span></td>
                        </tr>
                        <tr>
                            <td align="right">详细地址：</td>
                            <td><input name="address" type="text" class="inputBg" size="20"/><span>（必填）</span></td>
                            <td align="right">邮政编码：</td>
                            <td><input name="zipcode" type="text" class="inputBg" size="20"/><span class="notice"></span></td>
                        </tr>
                        <tr>
                            <td align="right">电话：</td>
                            <td><input name="tel" type="text" class="inputBg" size="20"/><span>（电话，手机必填一项）</span></td>
                            <td align="right">手机：</td>
                            <td><input name="mobile" type="text" class="inputBg" size="20"/><span>（电话，手机必填一项）</span></td>
                        </tr>
                        <tr>
                            <td align="right">标志建筑：</td>
                            <td><input name="sign_building" type="text" class="inputBg" size="20"/><span></span></td>
                            <td align="right">最佳送货时间：</td>
                            <td><input name="bestTime" type="text" class="inputBg" size="20"/></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td colspan="3" align="center">
                                <input type="hidden" name="go" value="kmall.member.addAddress" />
                                <img class="newAdd png" src="{$template_url}resources/images/member/add.png"/>
                            </td>
                        </tr>
                    </table>-->
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="80" class="td_tl" id="name"><p style="display:none;" class="span_f">*</p>真实姓名：</td>
                        <td width="500"><input name="consignee" type="text" style="display:none;" id="input_name" class="input_name" value="{$address.consignee}" /><span>{$address.consignee}</span></td> 
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f">*</p>地　　区：</td>
                        <td width="500">
                            <select name="country" style="display: none;">
                                <option value="0">请选择国家</option>
                                <option value="1" selected="selected">中国</option>
                            </select>
                            <select name="province" style="display: none;" id="province{$address.address_id}">
                                <option value="0">请选择省</option>
                                {foreach item=region from=$regions}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.province)}selected{/if}>{$region->region_name}</option>
                                {/foreach}
                            </select>
                            <select name="city" style="display: none;" id="city{$address.address_id}">
                                <option value="0">请选择市</option>
                                {foreach item=region from=$address.citys_by_province}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.city)}selected{/if}>{$region->region_name}</option>
                                {/foreach}
                            </select>
                            <select name="district" style="display: none;" id="district{$address.address_id}">     
                                <option value="0">请选择区</option>
                                {foreach item=region from=$address.district_by_city}
                                <option value="{$region->region_id}" {if ($region->region_id==$address.district)}selected{/if}>{$region->region_name}</option>
                                {/foreach}
                            </select>
                            <span>{$address.allregion}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f">*</p>详细地址：</td>
                        <td width="500"><input type="text" name="address" style="display:none;" id="input_address" class="input_add" value="{$address.address}" /><span>{$address.address}</span></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f"></p>邮政编码：</td>
                        <td width="500"><input type="text" name="zipcode" style="display:none;" id="input_yb" value="{$address.zipcode}" /><span>{$address.zipcode}</span></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f">*</p>手　　机：</td>
                        <td width="500"><input type="text" name="mobile" style="display:none;" id="input_phone" value="{$address.mobile}" /><span>{$address.mobile}</span></td>
                      </tr>
                      <tr>
                        <td width="80" class="td_tl"><p style="display:none;" class="span_f"></p>邮　　箱：</td>
                        <td width="500"><input type="text" name="email" style="display:none;" id="input_email" value="{$address.email}" /><span>{$address.email}</span></td>
                      </tr>
                    </table>
                    <div class="update" onclick="click_update();"><span>修  改</span></div>
                    <div class="del"><span>删  除</span></div>
                    <input type="hidden" name="go" value="kmall.member.addAddress" />
                    <input class="bc" type="submit" onclick="click_bc();" style="display:none;" value="保  存"/>
                </form>
            
        </div>
        {/foreach}
            {/if}
    </div>
    <div class="clear"></div>
</div>
{/block}