var layer, laypage;
var pageSize = 5; // 每页显示的条数

$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	// 初始化layer
	layui.use(['layer', 'laypage'], function () {
		layer = layui.layer;
		laypage = layui.laypage;

		// 默认显示可使用红包
		var total = getAvailableInterest(1);
		if (total > 0) {
			initPaging(total, 0);
		}
	});
	$(".common-navbar .tab").click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		var index = $(this).index(".tab");
		var total = 0;
		if (index == 0) {
			// 可使用
			total = getAvailableInterest(1);
		} else if (index == 1) {
			// 已使用
			total = getUsedInterest(1);
		} else if (index == 2) {
			// 已过期
			total = getExpiredInterest(1);
		}
		if (total > 0) {
			initPaging(total, index);
		} else {
			$("#laypageBox").html("");
		}

	});


});

// 加载分页插件
function initPaging(total, index) {
	laypage.render({
		elem: 'laypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, layout: ['prev', 'page', 'next', 'count']
		, theme: '#078eee'
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				$(document).scrollTop(280);
				if (index == 0) {
					getAvailableInterest(obj.curr);
				} else if (index == 1) {
					getUsedInterest(obj.curr);
				} else if (index == 2) {
					getExpiredInterest(obj.curr);
				}
			}
		}
	});
}

// 获取可使用加息券
function getAvailableInterest(pageNum) {
	var total = 0;
	var data = {pageNum: pageNum, pageSize: pageSize};
	var res = AjaxUtil.ajaxPostWithLoading(userCouponApiUrl.getAvailableInterest, DataDeal.josnObjToString(data));

	if (res) {
		total = res.total;
		if (total > 0) {
			$("#tabContent").html("");
			var rows = res.rows;

			$.each(rows, function (i, item) {
				var con = '<div class="content-item">' +
					'<div class="interest-coupon-bg-pic">' +
					'<div class="actual-value">' +
					'<span class="fs-44">' + NumberUtil.transfPercentage(item.couponInterestRate) + '</span></div></div>' +
					'<ul class="clearfix"><li><p>有效期</p><p>' + DateUtils.longToDateStringYMD(item.couponEffectiveTime, '.') + ' - ' +
					DateUtils.longToDateStringYMD(item.couponExpireTime, '.') + '</p></li><li><p>使用条件</p><p>满' +
					item.leastActivateAmount.amount + '元</p></li><li><p>来源</p><p>' + item.couponObtainSource.message + '</p></li></ul></div>';
				$("#tabContent").append(con);
			});
		} else {
			$("#tabContent").html('<div class="content-item"><img class="no-data" src="../../img/no_data.png"/><p class="ta-c">没有可使用的加息券</p></div>');
		}

	}
	return total;
}

// 获取已使用加息券
function getUsedInterest(pageNum) {
	var total = 0;
	var data = {pageNum: pageNum, pageSize: pageSize};
	var res = AjaxUtil.ajaxPostWithLoading(userCouponApiUrl.getUsedInterest, DataDeal.josnObjToString(data));

	if (res) {
		total = res.total;
		if (total > 0) {
			$("#tabContent").html("");
			var rows = res.rows;
			$.each(rows, function (i, item) {
				var con = '<div class="content-item">' +
					'<div class="interest-coupon-bg-pic">' +
					'<div class="actual-value">' +
					'<span class="fs-44">' + NumberUtil.transfPercentage(item.couponInterestRate) + '</span></div></div>' +
					'<ul class="clearfix"><li><p>使用时间</p><p>' + DateUtils.longToDateString(item.couponUsedTime, '.') +
					'</p></li><li><p>使用项目</p><p>' + item.couponTradeName +
					'</p></li><li><p>来源</p><p>' + item.couponObtainSource.message + '</p></li></ul></div>';
				$("#tabContent").append(con);
			});
		} else {
			$("#tabContent").html('<div class="content-item"><img class="no-data" src="../../img/no_data.png"/><p class="ta-c">没有已使用的加息券</p></div>');
		}

	}
	return total;
}

// 获取已过期加息券
function getExpiredInterest(pageNum) {
	var total = 0;
	var data = {pageNum: pageNum, pageSize: pageSize};
	var res = AjaxUtil.ajaxPostWithLoading(userCouponApiUrl.getExpiredInterest, DataDeal.josnObjToString(data));

	if (res) {
		total = res.total;
		if (total > 0) {
			$("#tabContent").html("");
			var rows = res.rows;
			$.each(rows, function (i, item) {
				var con = '<div class="content-item">' +
					'<div class="interest-coupon-bg-pic">' +
					'<div class="actual-value">' +
					'<span class="fs-44">' + NumberUtil.transfPercentage(item.couponInterestRate) + '</span></div></div>' +
					'<ul class="clearfix"><li><p>有效期</p><p>' + DateUtils.longToDateStringYMD(item.couponEffectiveTime, '.') + ' - ' +
					DateUtils.longToDateStringYMD(item.couponExpireTime, '.') + '</p></li><li><p>使用条件</p><p>满' +
					item.leastActivateAmount.amount + '元</p></li><li><p>来源</p><p>' + item.couponObtainSource.message + '</p></li></ul></div>';
				$("#tabContent").append(con);
			});
		} else {
			$("#tabContent").html('<div class="content-item"><img class="no-data" src="../../img/no_data.png"/><p class="ta-c">没有已过期的加息券</p></div>');
		}

	}
	return total;
}