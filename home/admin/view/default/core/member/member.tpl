{extends file="$templateDir/layout/normal/layout.tpl"}

{block name=body}
    <style media="screen">
      .unActiveMember{
        background-color:#f00;
        color:#fff;
      }
    </style>
    <div id="loading-mask" style=""></div>
    <div id="loading">
        <div class="loading-indicator"><img src="{$url_base}common/js/ajax/ext/resources/images/extanim32.gif" width="32" height="32" style="margin-right:8px;" align="absmiddle"/>正在加载中...</div>
    </div>

    <!-- use class="x-hide-display" to prevent a brief flicker of the content -->

    <!-- 内容 -->
    <div id="center1" class="x-hide-display">
    <!-- 内容 -->
    <!-- 基本信息 -->
    <div id="tab1" class="x-hide-display"/>
    <div id="dingdan1" class="x-hide-display"><!-- 订单商品（购买量） <table><tr><td></td><td></td></tr></table> -->
        <p id="text1" style="font-size: 10pt;"></p>
    </div>
    <div id="jiage" class="x-hide-display"><!-- 价格  -->
       <table>
            <tr><td style="font-size: 10pt;">商品总额：</td><td id="text2" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">配送费额：</td><td id="text3" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">订单总额：</td><td id="text4" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">已支付金额：</td><td id="text5" style="font-size: 10pt;"></td></tr>
       </table>
    </div>
    <div id="dingdanxinxi" class="x-hide-display"><!-- 订单信息  -->
       <table>
            <tr><td style="font-size: 10pt;">配送方式：</td><td id="text6" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">配送保价：</td><td id="text7" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">商品重量：</td><td id="text8" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">支付方式：</td><td id="text9" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">是否开票：</td><td id="text10" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">可得券：</td><td id="text11" style="font-size: 10pt;"></td></tr>
       </table>
    </div>
    <div id="goumairen" class="x-hide-display"><!-- 购买人  -->
       <table>
            <tr><td style="font-size: 10pt;">用户名：</td><td id="text12" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">姓名：&nbsp;&nbsp;</td><td id="text13" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">电话：&nbsp;&nbsp;</td><td id="text14" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">地区：&nbsp;&nbsp;</td><td id="text15" style="font-size: 10pt;"></td></tr>
            <tr><td style="font-size: 10pt;">Email：&nbsp;&nbsp;</td><td id="text16" style="font-size: 10pt;"></td></tr>
       </table>
    </div>
    <!-- 基本信息 -->
    <div id="tab2" class="x-hide-display"/>
<div id="tab3" class="x-hide-display"/>
<div id="tab4" class="x-hide-display"/>
<div id="tab5" class="x-hide-display"/>
<div id="tab6" class="x-hide-display"/>
<div id="tab7" class="x-hide-display"/>
<div id="tab8" class="x-hide-display"/>
    <div id="datagrid2" class="x-hide-display"/>
    <div id="content" class="x-hide-display"/>
{/block}
