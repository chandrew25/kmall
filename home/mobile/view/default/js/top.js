window.onload=function() {
    var sEar = document.getElementById("search");
    var lOgin = document.getElementById("loginmain");
    var top_div = $("#back_top");
    window.onscroll = function () {
        var h = $(window).scrollTop();
        //console.log(h);
        if (h > 0) {
            if (sEar) sEar.style.background = "rgba(255,255,255,0.85)";
            if (lOgin) lOgin.style.color = "#282828";
        } else if (h == 0) {
            if (sEar) sEar.style.background = "rgba(255,255,255,0.85)";
            if (lOgin) lOgin.style.color = "#989898";
        }
        if (h > 300) {
            // if (top_div) top_div.style.opacity = "1";
            top_div.css("opacity", 1);
        } else {
            // if (top_div) top_div.style.opacity = "0";
            top_div.css("opacity", 0);
        }
    }
    if (top_div) {
        top_div.onclick = function () {
            document.body.scrollTop = 0;
        }
    }
}
