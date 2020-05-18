<!doctype html public "-//w3c//dtd xhtml 1.0 transitional//en" "http://www.w3.org/tr/xhtml1/dtd/xhtml1-strict.dtd">
<html lang="zh-cn" xml:lang="zh-cn" xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>快递单打印</title>
<meta content="text/html; charset=utf-8" http-equiv="content-type">
<style type="text/css" media="print">
.noprint {
    display: none
}
</style>
<style type="text/css" media="screen,print">
body {
	margin: 0px;
}
#container{
    position:relative;width: 100%;top:2px;
}
#print {
    position:relative;width:873px;height:491px;left:250px;
    background:url({$url_base}upload/delivery/{$layout.bg}) no-repeat;
}
#print_confirm {
    position: relative;
    background-color: #5473ae;
    width: 100%;height: 30px;
    border-top: #999999 1px solid;
    padding-top: 4px
}
#btn_print {
    background-image: url({$template_url}/resources/images/btn_print.gif);
    width: 71px;height: 24px;
    margin-left: auto;
    cursor: pointer;
    margin-right: auto
}
#ship_addr_from {
    position:absolute;
    font-family:KaiTi;font-size:14px;
    width: 215px;
    left:162px;top:128px;
}
#delivery {
    position:absolute;
    font-family:KaiTi;font-size:14px;font-weight:bold;
    width: 226px;
    left:{$layout.delivery.left};top:{$layout.delivery.top};
}
#companyNameAlias{
    position:absolute;
    font-family:KaiTi;font-size:14px;font-weight:bold;
    width: 179px;
    left:{$layout.companyNameAlias.left};top:{$layout.companyNameAlias.top};
}
#ship_tel_from{
    position:absolute;
    font-family:Arial, Helvetica, sans-serif;font-size:13px;
    width: 100px;height: 16px;
    left:{$layout.ship_tel_from.left};top:{$layout.ship_tel_from.top};
}
#ship_mobile_from{
    position:absolute;
    font-family:Arial, Helvetica, sans-serif;font-size:13px;
    width: 100px;height: 16px;
    left:{$layout.ship_mobile_from.left};top:{$layout.ship_mobile_from.top};
}
#ship_zip_from {
    position:absolute;
    font-family:"Times New Roman", Times, serif;
    width: 110px;height: 16px;
    left:{$layout.ship_zip_from.left};top:{$layout.ship_zip_from.top};
}

#ship_addr {
    position:absolute;
    font-family:KaiTi;font-weight:bold;font-size:14px;
    width: 225px;height: 16px;
    left:{$layout.ship_addr.left};top:{$layout.ship_addr.top};
}
#ship_name {
    position:absolute;
    font-family:KaiTi;font-size:18px;font-weight:bold;
    width: 77px;height: 21px;
    left:{$layout.ship_name.left};top:{$layout.ship_name.top};
}
#ship_tel{
    position:absolute;
    font-weight:bold;font-size:13px;
    width: 132px;height: 16px;
    left:{$layout.ship_tel.left};top:{$layout.ship_tel.top};
}
#ship_mobile{
    position:absolute;
    font-weight:bold;font-size:13px;
    width: 127px;
    left:{$layout.ship_mobile.left};top:{$layout.ship_mobile.top};
}
#ship_zip {
    position:absolute;
    font-family:"Times New Roman", Times, serif;
    width: 110px;height: 16px;
    left:{$layout.ship_zip.left};top:{$layout.ship_zip.top};
}

#ship_area {
    position:absolute;
    font-family:KaiTi;font-weight:bold;font-size:18px;
    width: {$layout.ship_area.width};
    left:{$layout.ship_area.left};top:{$layout.ship_area.top};
}
#num {
    position:absolute;
    font-family:KaiTi;
    width: 35px;height: 16px;
    left:{$layout.num.left};top:{$layout.num.top};
}
#gouxuan {
    position:absolute;
    width: 20px;height: 16px;
    left:{$layout.gouxuan.left};top:{$layout.gouxuan.top};
}
</style>
</head>
<body>
    <div id="container">
        <div id="print">
            <span id="ship_addr_from">上海赢滨电子商务有限公司</span>
            <span id="delivery">{$delivery.delivery}</span>
            <span id="companyNameAlias">Phoebelife</span>
            <span id="ship_tel_from">12121212</span>
            <span id="ship_mobile_from">021-24122600</span>
            <span id="ship_zip_from">
                2&nbsp;&nbsp;0&nbsp;0&nbsp;&nbsp;0&nbsp;&nbsp;3&nbsp;0
            </span>
            <span id="ship_addr">{$delivery.ship_addr}</span>
            <span id="ship_name">{$delivery.ship_name}</span>
            <span id="ship_tel">{$delivery.ship_tel}</span>
            <span id="ship_mobile">{$delivery.ship_mobile}</span>
            <span id="ship_zip">
                {$delivery.ship_zip}
            </span>
            <span id="ship_area">{$delivery.ship_area}</span>
            <span id="num">{$itemCount}</span>
            <span id="gouxuan">√</span>
        </div>
        <div id="print_confirm" class="noprint">
          <div id="btn_print" onclick="window.print()"></div>
        </div>
    </div>
</body>
</html>
