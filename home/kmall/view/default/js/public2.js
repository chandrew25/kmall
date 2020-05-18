$(function(){
	var container_width=1000;//主内容区宽度
	/*************链接美观*************/
	$("a").focus(function(){
		$(this).blur();
	});
	/*************处理png图片在IE6下的透明问题*************/
	if(window.DD_belatedPNG){
		DD_belatedPNG.fix(".png");
	}
	/*************页面宽度调整*************/
	$(window).resize(function(){
		$(".header,.footer").width(Math.max(container_width,$(window).width()));
	});
	/*************网站收藏*************/
	$("#collectus").click(function(){
		var aUrls=document.URL.split("/");
		var vDomainName="http://"+aUrls[2]+"/";
		var title=document.title;
		try{
			window.external.AddFavorite(vDomainName,title);
		}catch(e){
			try{
				window.sidebar.addPanel(title,vDomainName,"");
			}catch(e){
				alert("加入收藏失败，请使用Ctrl+D进行添加");
			}
		}
	});
	/*************顶部菜单*************/
	$(".menu .mi").hover(
		function(){
			$(this).children(".typew,.bg").show();
		},
		function(){
			$(this).children(".typew,.bg").hide();
		}
	);
	/********************侧边购物车*********************/
	var sidecart = { left: 15, right: 15, bottom: parseInt($("#sidecart").css("bottom").replace("px", "")), showheight: 200, opacity: 1, spacetime: 100, cwidth: 1000 };
 	var setSideCart=function() {
 	var obj = $("#sidecart");
 	var wwidth = $(window).width(), left;
 	if (wwidth > sidecart.cwidth + (obj.width() + sidecart.left + sidecart.right) * 2) {
 		left = wwidth / 2 + sidecart.cwidth / 2 + sidecart.left;
 	} else {
 		left = wwidth - obj.width() - sidecart.right;
 	}
 	obj.css({ left: left });
 };
 setSideCart();
	/*************************回到顶部*************************/
	var goup = { left: 15, right: 15, bottom: parseInt($("#goup").css("bottom").replace("px", "")), showheight: 200, opacity: 1, spacetime: 100, cwidth: 1000 };
	$("#goup").click(function () {
		$("body,html").animate({ scrollTop: 0 }, goup.spacetime);
	});
	$(window).bind("resize scroll", function () {
		var obj = $("#goup");
		if ($(window).scrollTop() < goup.showheight) {
			obj.stop().animate({ opacity: 0 }, goup.spacetime, function () {
				$(this).hide();
			});
		} else {
			obj.stop().show().animate({ opacity: goup.opacity }, goup.spacetime);
			var wwidth = $(window).width(), left;
			if (wwidth > goup.cwidth + (obj.width() + goup.left + goup.right) * 2) {
				left = wwidth / 2 + goup.cwidth / 2 + goup.left;
			} else {
				left = wwidth - obj.width() - goup.right;
			}
			if ($.browser.msie && parseInt($.browser.version) < 7) {//IE6特殊处理，绝对定位
				var top = $(window).scrollTop() + $(window).height() - obj.height() - goup.bottom;
				obj.css({ position: "absolute", top: top, bottom: "auto" });
				left += $(window).scrollLeft();
			}
			obj.css({ left: left });
		}
	});
	
	$(window).resize();
});
/*************封装工具*************/
(function ($) {
	/*
	 formatJSON
	 parseJSON
	 cookie
	*/
	var $specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };
	var $replaceChars = function (chr) { return $specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16); };
	//把对象转换为json格式的字符串
	$.formatJSON = function (o) {
		var s = [];
		switch ($.type(o)) {
			case 'string':
				return '"' + o.replace(/[\x00-\x1f\\"]/g, $replaceChars) + '"';
			case 'number':
			case 'boolean':
			case 'function':
				return o.toString();
			case 'date':
				var year = o.getFullYear(), month = o.getMonth() + 1, day = o.getDate(), hours = o.getHours(), minutes = o.getMinutes(), seconds = o.getSeconds(), milli = o.getMilliseconds();
				if (month < 10) { month = '0' + month; }
				if (day < 10) { day = '0' + day; }
				if (hours < 10) { hours = '0' + hours; }
				if (minutes < 10) { minutes = '0' + minutes; }
				if (seconds < 10) { seconds = '0' + seconds; }
				if (milli < 10) { milli = '0' + milli; };
				return '"' + year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '"';
			case 'array':
				for (var i = 0, l = o.length; i < l; i++) {
					s.push($.formatJSON(o[i]));
				}
				return '[' + s.join(',') + ']';
			case 'object':
			case 'error':
				for (var p in o) {
					s.push(p + ':' + $.formatJSON(o[p]));
				}
				return '{' + s.join(',') + '}';
			case 'undefined':
				return 'undefined';
			case 'null':
				return 'null';
			default:
				return '';
		}
	};
	//把json格式的字符串转换为对象
	$.parseJSON = function (s) {
		if ($.type(s) != 'string' || !s.length) return null;
		var obj = null;
		try {
			obj = eval('(' + s + ')');
		} catch (e) { }
		return obj;
	};
	//封装cookie
	//expires保存时间（秒，设置为0，有效期当前会话），path站点内可用路径，domain域名，secure是否使用其他协议（如：https）
	//$.cookie("age",10,{expires:30,path:"/",domain:"jquery.com",secure:false});
	$.cookie = function (name, value, options) {
		if (typeof value != "undefined") {//如果第二个参数存在
			options = options || {};//初始化第三个参数，如果不存在则设置为空字符串
			if (value === null) {//如果第二个参数值为null，则表示删除该cookie值
				value = "";//清空值
				options.expires = -1;//设置失效时间
			}
			var expires = "";
			if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == "number") {//设置时间，把天数转换为毫秒数添加到时间对象中
					date = new Date();
					date.setTime(date.getTime() + options.expires * 1000);
				} else {//如果是时间格式，则直接传递时间参数
					date = options.expires;
				}
				expires = ";expires=" + date.toUTCString();
			}
			var path = options.path ? ";path=" + options.path : "";//设置路径
			var domain = options.domain ? ";domain=" + options.domain : "";//设置域
			var secure = options.secure ? ";secure" : "";//设置安全措施
			document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("");
		} else {//如果第二个参数不存在，则表示读取指定cookie信息
			var cookieValue = null;
			if (document.cookie && document.cookie != "") {//如果cookie信息不存在且不为空
				var cookies = document.cookie.split(";");
				for (var i = 0; i < cookies.length; i++) {//遍历cookie信息
					var cookie = (cookies[i] || "").replace(/^\s+|\s+$/g, "");//清除两侧空格
					if (cookie.substring(0, name.length + 1) == (name + "=")) {//匹配指定cookie名称
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	}
	//////////////正则表达式验证字符串//////////////
	//手机号码
	$.isMobile = function (s) {
		return /^(13[0-9]|15[0-9]|18[0-9])[0-9]{8}$/.test(s);
	}
	//身份证号码后6位
	$.isIcardnoLastSix = function (s) {
		return /^(\d{6}|\d{5}x)$/.test(s);
	}
	//数字
	$.isNumber = function (s, len) {
		len = parseInt(len);
		if (isNaN(len) || len < 1) {
			return new RegExp("^\\d+$").test(s);
		} else {
			return new RegExp("^\\d{" + len + "}$").test(s);
		}
	}
})(window.$);
//去除空字符
String.prototype.trim=function(){
	return this.replace(/^\s+|\s+$/,"");
}