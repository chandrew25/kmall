$(document).ready(function(){
    //查询列表输入提示
    $("#queryText").focus(function(){
        if($("#queryText").val()==queryText_notice){
            $("#queryText").removeClass("hui_color");
            $("#queryText").val("");
        }
    }).blur(function(){
        if($("#queryText").val()==""){
            $("#queryText").addClass("hui_color");
            $("#queryText").val(queryText_notice);
        }
    });
    //更改下拉列表时更改
    $("select[name=country]").change(function(){
        region.changed(this, 1, $(this).nextAll("select")[0].id);
    });
    $("select[name=province]").change(function(){
        region.changed(this, 2, $(this).nextAll("select")[0].id);
    });
    $("select[name=city]").change(function(){
        region.changed(this, 3, $(this).nextAll("select")[0].id);
    });
});
var queryText_notice="-输入您需要查询的店铺-";

var region = new Object();
var process_request = "正在处理您的请求...";
region.isAdmin = false;
region.loadRegions = function(parent, type, target)
{
  Ajax.call(region.getFileName(), 'type=' + type + '&target=' + target + "&parent=" + parent , region.response, "GET", "JSON");
};

/* *
 * 载入指定的国家下所有的省份
 *
 * @country integer     国家的编号
 * @selName string      列表框的名称
 */
region.loadProvinces = function(country, selName)
{
  var objName = (typeof selName == "undefined") ? "selProvinces" : selName;

  region.loadRegions(country, 1, objName);
};

/* *
 * 载入指定的省份下所有的城市
 *
 * @province    integer 省份的编号
 * @selName     string  列表框的名称
 */
region.loadCities = function(province, selName)
{
  var objName = (typeof selName == "undefined") ? "selCities" : selName;

  region.loadRegions(province, 2, objName);
};

/* *
 * 处理下拉列表改变的函数
 *
 * @obj     object  下拉列表
 * @type    integer 类型
 * @selName string  目标列表框的名称
 */
region.changed = function(obj, type, selName)
{
  var parent = obj.options[obj.selectedIndex].value;

  region.loadRegions(parent, type, selName);
};

region.response = function(result, text_result)
{
  var sel = document.getElementById(result.target);

  sel.length = 1;
  sel.selectedIndex = 0;
  if (result.regions&&result.regions.length>0){
      sel.style.display = '';
  }
  if (document.all)
  {
    sel.fireEvent("onchange");
  }
  else
  {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('change', true, true);
    sel.dispatchEvent(evt);
  }

  if (result.regions)
  {
    for (i = 0; i < result.regions.length; i ++ )
    {
      var opt = document.createElement("OPTION");
      opt.value = result.regions[i].region_id;
      opt.text  = result.regions[i].region_name;

      sel.options.add(opt);
    }
  }
};

region.getFileName = function()
{   
    var pathName = window.location.pathname.substring(1); 
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/')); 
    var root= window.location.protocol + '\/\/' + window.location.host + '/'+ webName + '/'; 
    return root+"home/kmall/src/httpdata/region.php"; 
};

function checkResults(e){
    var form=$(e.target).parents("form")[0];
    var ok=true;
    var province=$(form.province);
    var city=$(form.city);
    var address=$(form.address);
    if(district.val()==0){
        district.nextAll("span").addClass("notice");
        district.nextAll("span").text(district_notice);
        if(ok)district[0].focus();
        ok=false;
    }
    if(city.val()==0){
        city.nextAll("span").addClass("notice");
        city.nextAll("span").text(city_notice);
        if(ok)city[0].focus();
        ok=false;
    }
    if(province.val()==0){
        province.nextAll("span").addClass("notice");
        province.nextAll("span").text(province_notice);
        if(ok)province[0].focus();
        ok=false;
    }
    if(country.val()==0){
        country.nextAll("span").addClass("notice");
        country.nextAll("span").text(country_notice);
        if(ok)country[0].focus();
        ok=false;
    }
    if(consignee.val()==""){
        consignee.next("span").addClass("notice");
        consignee.next("span").text(consignee_notice);
        if(ok)consignee[0].focus();
        ok=false;
    }
    //验证详细地址
    if(address.val()==""){
        address.next("span").addClass("notice");
        address.next("span").text(address_notice);
        if(ok)address[0].focus();
        ok=false;
    }
    if(form["add_go"])form["go"].value=form["add_go"].value;
    if(ok)form.submit();
}