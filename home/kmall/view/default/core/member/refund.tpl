{extends file="$templateDir/layout/home/layout.tpl"}
{block name=body}
    <div id="content">
        <div id="center_down">
            {php}                   
            include(dirname(__FILE__)."/../../../../home/kmall/src/include/mcenter_list.php"); 
            {/php}
            <div id="member_wrapper" class="center_border_color">
                <div id="member">
                    <div id="member_title">退款管理</div>
                    <form action="index.php?go=kmall.member.refund" method="post">
                        <div class="tbl_title">
                            <div class="tbl_title_query">
                                <input id="queryText" name="queryfilter" class="inputBg hui_color" type="text" size="30" value="商品名称、商品编号、订单编号"/> 
                                <input type="image" class="png" src="{$template_url}resources/images/member/query.png" class="ml5" align="absbottom"/>
                                <input type="hidden" id="queryfilter_temp" value="{$queryfilter_temp}" />
                            </div>
                        </div>
                    </form>
                    <table class="tbl">
                        <tr class="tbl_head">
                            <td width="90">订单编号</td>
                            <td width="180">商品名称</td>
                            <td width="80">交易金额</td>
                            <td width="80">退款金额</td>
                            <td width="80">申请时间</td>
                            <td width="90">退款状态</td>
                            <td width="60">操作</td>
                        </tr>

                        {foreach item=refundproducts from=$refundproductss}
                        <tr>
                            <td>{$refundproducts.order_code}</td>
                            <td>{$refundproducts.product.name}</td>
                            <td>{$refundproducts.pay}</td>
                            <td>{$refundproducts.refund}</td>
                            <td>{$refundproducts.refundTime}</td> 
                            <td>{$refundproducts.statusShow}</td> 
                            <td>查看</td>
                        </tr>
                        {/foreach}
                    </table>
                    <my:page src="{$url_base}index.php?go=kmall.member.refund&queryfilter={$queryfilter_temp}">
                    <form id="refundForm" action="index.php?go=kmall.member.addrefund" method="post">
                        <table class="tbl">
                            <tr class="tbl_head">
                                <td colspan="2" class="refund_title">申请退款</td>
                            </tr>
                            <tr>
                                <td align="right" width="100">订单号码：</td>
                                <td>
                                    <p class="ml5"><input type="text" class="inputBg" size="20" id="refund_orderid" name="order_code"/><span class="notice ml5" id="refund_orderid_notice"></span></p>
                                    <p class="ml5">（请输入产生退款的订单号，一次退款申请只能输入一个订单号）</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="right">申请人姓名：</td>
                                <td>
                                    <input type="text" class="inputBg ml5" size="20" id="refund_name" name="name" /><span class="notice ml5" id="refund_name_notice"></span>
                                </td>
                            </tr>
                            <tr>
                                <td align="right">申请原因：</td>
                                <td>
                                    <textarea class="txts ml5" id="refund_reason" name="comment" ></textarea><span class="notice ml5" id="refund_reason_notice"></span>
                                </td>
                            </tr>
                            <tr>
                                <td align="right">验证码：</td>
                                <td>
                                    <input type="text" class="inputBg ml5" size="6" style="vertical-align:middle;"/>
                                    <img src="{$url_base}home/kmall/src/httpdata/validate.php" name="validateCode" onclick="this.src='{$url_base}home/kmall/src/httpdata/validate.php?'+Math.random()" style="vertical-align:middle;cursor:pointer;" title="看不清楚？点击换张图片"/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="pl">
                                    <input type="image" src="{$template_url}resources/images/member/confirm.png" class="ml5 png"/>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    </div>
{/block}