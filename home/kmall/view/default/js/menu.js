$(document).ready(function(){
		
	$("#nav_1").hover(function(){
		//鼠标移到"全部商品和分类"上面时
		$("#menu").show();
	},function(){
		//鼠标离开"全部商品和分类"时
		$("#menu").hide();
	});
		
	$("#menu").hover(function(){
		//鼠标移到菜单上面时
		$("#menu").show();
	},function(){
		//鼠标离开菜单时
		$("#menu").hide();
	});
	
});  