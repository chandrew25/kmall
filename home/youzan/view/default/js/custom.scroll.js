function loaded(wrapperId, pullUpId) {
	var pullUpEl = document.getElementById(pullUpId);
	var pullUpOffset = pullUpEl.offsetHeight;
	var myScroll = new iScroll(
			wrapperId,
			{
				useTransition : true,
				topOffset : 0,
				onRefresh : function() {
					if (pullUpEl.className.match('loading')) {
						pullUpEl.className = 'pullUp';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '显示更多...';
					}
				},
				onScrollMove : function() {
					if (this.y < (this.maxScrollY - 5)
							&& !pullUpEl.className.match('flip')) {
						pullUpEl.className = 'flip pullUp';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '准备刷新...';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5)
							&& pullUpEl.className.match('flip')) {
						pullUpEl.className = 'pullUp';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉显示更多...';
						this.maxScrollY = pullUpOffset;
					}
				},
				onScrollEnd : function() {
					if (pullUpEl.className.match('flip')) {
						pullUpEl.className = 'loading pullUp';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '努力加载中...';
						switch(wrapperId){
							case 'wrapper':pullUpAction();break;
							case 'trans_wrapper':trans_pullUpAction();break;
							case 'recharge_wrapper':recharge_pullUpAction();break;
						}
					}
				}
			});

	setTimeout(function() {
		document.getElementById(wrapperId).style.left = '0';
	}, 800);

	return myScroll;
}
