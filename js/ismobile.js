(function () {
	var url = window.location.search;
	var a = navigator.userAgent.toLowerCase();
	var b = a.match(/ipad/i) == "ipad";
	var c = a.match(/iphone os/i) == "iphone os";
	var d = a.match(/midp/i) == "midp";
	var e = a.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var f = a.match(/ucweb/i) == "ucweb";
	var g = a.match(/android/i) == "android";
	var h = a.match(/windows ce/i) == "windows ce";
	var i = a.match(/windows mobile/i) == "windows mobile";
	if (url) {
	} else {
		if (b || c || d || e || f || g || h || i) {
			// TODO wap端线上环境的url
			window.location.href = "https://m.chejubao.cn"
		}
	}
})();