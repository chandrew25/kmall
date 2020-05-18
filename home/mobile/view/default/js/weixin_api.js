function createSelect(ActionFlag) {
    var selYear = document.getElementById("tYEAR");
    var selMonth = document.getElementById("tMON");
    var selDay = document.getElementById("tDAY");
    var dt = new Date();
    if (ActionFlag == 1) {
        MaxYear = dt.getFullYear();
        MinYear = parseInt(MaxYear)-50;
        for (var i = MinYear; i <= MaxYear; i++) {
            var op = document.createElement("OPTION");
            op.value = i;
            op.innerHTML = i;
            selYear.appendChild(op);
        }
        selYear.selectedIndex = 0;

        for (var i = 1; i < 13; i++) {
            var op = document.createElement("OPTION");
            if (i > 9) {
                op.value = i;
                op.innerHTML = i;
            } else {
                op.value = "0" + i;
                op.innerHTML = "0" + i;
            }
            selMonth.appendChild(op);
        }
        selMonth.selectedIndex = 0;
    } else {
        var date = new Date(selYear.value, selMonth.value, 0);
        var daysInMonth = date.getDate();
        selDay.options.length = 1;
        for (var i = 1; i <= daysInMonth; i++) {
            var op = document.createElement("OPTION");
            if (i > 9) {
                op.value = i;
                op.innerHTML = i;
            } else {
                op.value = "0" + i;
                op.innerHTML = "0" + i;
            }
            
            selDay.appendChild(op);
        }
        selDay.selectedIndex = 0;
    }
}
$(function(){
	$(".weixin_api_submit").click(function(){
		var realname = $("#realname").val();
		var mobile = $("#mobile").val();
		if (realname=="") {
			alert("姓名不能为空");
			return false;
		};
		if (mobile=="") {
			alert("手机不能为空");
			return false;
		};
	 	var url = "index.php?go=membership.weixin.ajaxSave";
		var data = $("#frmedit").serialize();
		$.ajax({
			url  	 : url,
			data 	 : data,
			type  	 : 'POST',
			dataType : 'html',
			success: function(response){
				if(response=="success"){
					alert("绑定成功");
					window.location.href = "index.php?go=membership.member.info";
				}else{
					alert(response);
				}
			}
		});
	 });
});