{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div class="checkview_main">
        <form action="{$url_base}index.php?go=kmall.voucher.checkoutover" method="post" id="checkoverForm">
            <div class="flowBox">
                <h6><span>商品列表</span></h6>
                <table width="99%" border="0" cellpadding="5" cellspacing="1" bgcolor="#dddddd">
                    <tr>
                      <th bgcolor="#ffffff">商品名称</th>
                      <!--<th bgcolor="#ffffff" width="100">市场价</th>-->
                      <th bgcolor="#ffffff" width="150">商城价(每件)</th>
                      <th bgcolor="#ffffff" width="150">兑换数量</th>
                      <th bgcolor="#ffffff" width="150">总价值</th>
                    </tr>
                    {foreach item=v_goods from=$goods}
                    <tr style="border-top:1px solid #ccc;">
                      <td bgcolor="#ffffff">
                        <a href="{$url_base}index.php?go=kmall.product.view&goods_id={$v_goods->goods_id}" target="_blank" style="display:block">{$v_goods->goods_name}</a>
                      </td>
                      <td bgcolor="#ffffff" align="center">￥{$v_goods->market_price|string_format:'%.2f'}</td>
                      <td bgcolor="#ffffff" align="center">{$v_goods->num}</td>
                      <td bgcolor="#ffffff" align="center">￥{($v_goods->market_price*$v_goods->num)|string_format:'%.2f'}</td>
                    </tr>
                    {/foreach}
<!--                    <tr style="border-top:1px solid #ccc;">
                      <td bgcolor="#ffffff" colspan="7">购物金额小计￥{*$statistic.totalPrice*}</td>
                    </tr>-->
                </table>
            </div>
            <div class="blank"></div>
            <div id="add_content">
                <div class="blank"></div>
                <div class="block">
                    <div class="flowBox whitebox" id="member_info">
                        <h6><span>收货人信息</span></h6>
                        <div class="member_info_box">
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">收货人姓名:(<font class="color_red">*</font>)</div>
                            <div class="m_i_left"><input name="consignee" id="consignee_check" type="text" class="inputBg"/><span></span></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">手机号码:(<font class="color_red">*</font>)</div>
                            <div class="m_i_left"><input name="mobile" id="mobile_check" type="text" class="inputBg"/><span></span></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">邮政编码:</div>
                            <div class="m_i_left"><input name="zipcode" id="zipcode_chech" type="text" class="inputBg"/><span></span></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">邮箱地址:</div>
                            <div class="m_i_left"><input name="email" id="email_check" type="text" class="inputBg email_input" /><span></span></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">配送区域:(<font class="color_red">*</font>)</div>
                            <div class="m_i_left">
                                <select name="country" id="country_check"><option value="0">请选择国</option><option value="1">中国</option></select>
                                        <select name="province" id="province"><option value="0">请选择省</option></select>
                                        <select name="city" id="city"><option value="0">请选择市</option></select>
                                        <select name="district" id="district"><option value="0">请选择区</option></select><span></span>
                            </div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">详细地址:(<font class="color_red">*</font>)</div>
                            <div class="m_i_left"><input name="address" id="address_check" type="text" class="inputBg address_input"/><span></span></div>
	                        <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">备注信息:</div>
                            <div class="m_i_left"><input name="remark" id="remark_check" type="text" class="inputBg address_input"/><span></span></div>
                            <div class="clear_both"></div>
                            <div id="checkaddress" class="btnAddrSendnew">保存收货人信息</div>
                        </div>
                    </div>
                    <div class="flowBox whitebox" id="member_info_detail" style="display:none;" item="0">
                        <h6><span>收货人信息</span></h6>
                        <div class="member_info_box">
                            <div class="m_i_left m_i_left_name">收货人姓名:</div>
                            <div class="m_i_left" id="name_confirm"></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">手机:</div>
                            <div class="m_i_left" id="phone_confirm"></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">邮政编码:</div>
                            <div class="m_i_left" id="code_confirm"></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">邮箱地址:</div>
                            <div class="m_i_left" id="email_confirm"></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">配送区域:</div>
                            <div class="m_i_left" id="area_confirm"></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">详细地址:</div>
                            <div class="m_i_left" id="address_confirm"></div>
                            <div class="clear_both"></div>
                            <div class="m_i_left m_i_left_name">备注信息:</div>
                            <div class="m_i_left" id="remark_confirm"></div>
                            <div class="clear_both"></div>
                            <div id="backaddress" class="btnAddrSendnew2">修改</div>
                        </div>
                    </div>
                </div>
                <div class="blank5"></div>
            </div>
            <div class="blank"></div>
            <div class="flowBox">
                <h6><span>配送方式</span></h6>
                <table width="99%" align="center" border="0" cellpadding="5" cellspacing="1" bgcolor="#dddddd" id="shippingTable">
                    <tr>
                      <th bgcolor="#ffffff" width="40">&nbsp;</th>
                      <th bgcolor="#ffffff" width="150">名称</th>
                      <th bgcolor="#ffffff">描述</th>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" valign="top"><input name="delivtype" type="radio" checked="checked" value="{$delivery}" />
                      </td>
                      <td bgcolor="#ffffff" align="center" valign="top"><b>菲彼生活发货</b></td>
                      <td bgcolor="#ffffff" align="center" valign="top">菲彼生活发货</td>
                    </tr>
                </table>
            </div>
            <div class="blank"></div>
            <!--<div class="flowBox">
                <h6><span>支付方式</span></h6>
                <table width="99%" align="center" border="0" cellpadding="5" cellspacing="1" bgcolor="#dddddd" id="paymentTable">
                    <tr>
                      <th width="30" bgcolor="#ffffff">&nbsp;</th>
                      <th width="250" bgcolor="#ffffff">名称</th>
                      <th bgcolor="#ffffff">订购描述</th>
                      <th bgcolor="#ffffff" width="100">手续费</th>
                    </tr>
                    {foreach name="ptype" item=paymenttype from=$paymenttypes}
                    <tr>
                      <td valign="middle" bgcolor="#ffffff"><input class="ptypeinput" type="radio" name="ptype" {if $paymenttype.childscount>0}to="{$paymenttype.paymenttype_code}"{/if} {if $smarty.foreach.ptype.index ==0}checked{/if}  value="{$paymenttype.paymenttype_code}" /></td>
                      <td valign="middle" bgcolor="#ffffff">
                        <div class="pay_type_ico"><img src="{$url_base}upload/images/{$paymenttype.ico}"></div>
                        <div class="paytype">{$paymenttype.name}</div>
                        <img class="ptypeimg" to="{$paymenttype.paymenttype_code}" />
                      </td>
                      <td valign="middle" bgcolor="#ffffff">{$paymenttype.description}</td>
                      <td valign="middle" bgcolor="#ffffff" align="center">￥{$paymenttype.pay_fee}</td>
                    </tr>
                    {/foreach}
                </table>
            </div>
            <div class="blank"></div>
            <div class="flowBox">
                <h6><span>发票信息</span><a href="javascript:;" class="f6" id="invoice_update">添加发票</a></h6>
                <div id="invoice_wrapper" style="display:none;">
                    <table id="invoice">
                        <tr>
                            <td align="right" width="100">发票类型：</td>
                            <td>
                                <label><input type="radio" name="invoice_type" value="1" checked="checked"/>普通发票</label>
                                <label><input type="radio" name="invoice_type" value="2"/>商业零售发票</label>
                                <span class="hui_color edit">提示：尊敬的用户您好，如果您需要开具增值税发票，建议您联系企业客户代表，将有专人为您处理！</span>
                               </td>
                        </tr>
                        <tr class="type1">
                            <td align="right"><span class="mr notice edit">*</span>发票抬头：</td>
                            <td><label><input type="radio" name="invoice_head" checked="checked" value="1"/>个人</label><label><input type="radio" name="invoice_head" value="2"/>单位</label></td>
                        </tr>
                        <tr class="type1">
                            <td align="right"><span class="mr notice edit">*</span><span id="invoice_name_txt">个人</span>名称：</td>
                            <td><span></span><input type="text" class="inputBg" size="30" name="invoice_name" id="invoice_name"/><span id="invoice_name_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2 edit">
                            <td colspan="2" class="pleft">
                                增值税发票转用发票资质填写：
                            </td>
                        </tr>
                        <tr class="type2">
                            <td align="right"><span class="mr notice edit">*</span>单位名称：</td>
                            <td><span></span><input type="text" class="inputBg" size="20" id="company" name="company"/><span id="company_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2">
                            <td align="right"><span class="mr notice edit">*</span>纳税人识别号：</td>
                            <td><span></span><input type="text" class="inputBg" size="20" id="taxpayer" name="taxpayer"/><span id="taxpayer_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2">
                            <td align="right"><span class="mr notice edit">*</span>注册地址：</td>
                            <td><span></span><input type="text" class="inputBg" size="20" id="reg_address" name="reg_address"/><span id="reg_address_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2">
                            <td align="right"><span class="mr notice edit">*</span>注册电话：</td>
                            <td><span></span><input type="text" class="inputBg" size="20" id="reg_tel" name="reg_tel"/><span id="reg_tel_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2">
                            <td align="right"><span class="mr notice edit">*</span>开户银行：</td>
                            <td><span></span><input type="text" class="inputBg" size="20" id="bank" name="bank"/><span id="bank_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2">
                            <td align="right"><span class="mr notice edit">*</span>银行账户：</td>
                            <td><span></span><input type="text" class="inputBg" size="20" id="bank_account" name="bank_account"/><span id="bank_account_notice" class="ml notice"></span></td>
                        </tr>
                        <tr class="type2 edit">
                            <td></td>
                            <td>
                                <div class="hui_color">
                                    <p>首次开具增值税专用发票的客户需传真加盖公章的营业执照副本、税务登记证副本、一般纳税人资格证书、银行开户许可证复印件至我司增值税发客服：</p>
                                    <p>北京：010-59547000-8042</p>
                                    <p>上海：021-39915634</p>
                                    <p>广州：020-34285500-1305</p>
                                    <p>成都：028-65976713</p>
                                    <p>武汉：027-85697760</p>
                                    <p>增值税专用发票不随货物一起发放（包括自提）</p>
                                </div>
                            </td>
                        </tr>
                        <tr class="edit">
                            <td colspan="2" class="pleft"><font id="invoice_tishi">发票信息将被系统自动打印到发票上，请勿填写和发票无关的信息。</font></td>
                        </tr>
                        <tr>
                            <td align="right">发票内容：</td>
                            <td><label><input type="radio" checked="checked"/>商品明细</label></td>
                        </tr>
                        <tr class="edit">
                            <td colspan="2" class="pleft"><img id="invoiceok" src="{$template_url}resources/images/shop/invoiceok.jpg"/></td>
                        </tr>
                    </table>
                  </div>
            </div>-->
            <div class="blank"></div>
            <div class="flowBox">
                <h6><span>费用总计</span></h6>
                <div id="ECS_ORDERTOTAL">
                    <table width="99%" align="center" border="0" cellpadding="5" cellspacing="1" bgcolor="#dddddd">
                        <tr>
                            <td align="right" bgcolor="#ffffff">商品总价值: <font class="f4_b">￥{$totalprice}元</font>
                            </td>
                        </tr>
<!--                        <tr>
                            <td align="right" bgcolor="#ffffff"> 应付款金额: <font class="f4_b">￥{$statisticAll.realFee}元</font></td>
                        </tr>-->
                    </table>
                </div>
                <!--提交订单-->
                <div align="center" style="margin:8px auto;">
                    <input type="hidden" name="paytype" value="{$paytype}">
                    <input type="hidden" name="totalValue" value="{$statisticAll.realFee}" />
                    <div id="order_submit" class="order_settle">提交订单</div>
                </div>
            </div>
        </form>
    </div>
    <!--选择支付类型弹出窗口-->
    <!--<div id="paytypebg"></div>
    {foreach item=paymenttype from=$paymenttypes}
    {if $paymenttype.childscount>0}
    <div id="paytype_show" class="_paytype" to="{$paymenttype.paymenttype_code}">
        <div id="paytitle">
            选择支付平台或支付银行<b id="paytitleclose">关闭</b>
        </div>
        <div id="paycontent">
            <div class="payitem">支付平台<span>(用银联在线支付，购物满百有机会获得购物返现)</span></div>
            <ul class="paylist plist">
               {foreach item=payment from=$paymenttype.childs name=payment}
                <li><input type="radio" name="bankcode" value="{$payment.paymenttype_code}" {if $smarty.foreach.payment.index==0}checked="checked"{/if}/><img src="{$url_base}upload/images/{$payment.ico}"/></li>
                {/foreach}
            </ul>
            <div class="payitem">支付网银</div>
            {foreach item=payment from=$paymenttype.childs name=payment}
            <ul class="paylist clist" {if $smarty.foreach.payment.index>0}style="display:none;"{/if}>
                {foreach item=pay from=$payment.childs}
                <li><input type="radio" name="bankcode" value="{$pay.paymenttype_code}"/><img src="{$url_base}upload/images/{$pay.ico}"/></li>
                {/foreach}
            </ul>
            {/foreach}
            <div class="payitem">为了保证及时处理您的订单，请于下单24小时内付款，逾期未付款订单将被取消，需重新下单。</div>
            <img id="payok" src="{$template_url}resources/images/member/ok.jpg"/>
        </div>
    </div>
    {/if}
    {/foreach}-->
{/block}
