var top_div = document.getElementById( "back_top" );
setTimeout(function(){
	window.onscroll = function(){
		var n = document.body.scrollTop;
		if(n>300)
		{
			if (top_div.style) top_div.style.opacity = "1";
		}else{
			 if (top_div.style) top_div.style.opacity = "0";
		}
	}
},300);
