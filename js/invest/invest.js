var pageSize = 10;
var total, demandType = "0";
var investSortCount = '', transferSortCount = "";
var serverCurrentTime; //服务端时间
$(document).ready(function () {

	window.addEventListener("popstate", function(e) {
		popStats();
	}, false);

	// 初始化laydate
	layui.use(['laypage', 'layer', 'element'], function () {
		laypage = layui.laypage
			,layer = layui.layer
			, element = layui.element;
		popStats();
	});

	$("#header").load("../common/header.html", function() {
		$(".header-nav li").eq(1).find("a").addClass("active");
	});
	$("#footer").load("../common/footer.html");

	$(".invest-transfer-nav a").click(function () {
		var index = $(this).index();
		demandType = index;
		$(this).addClass("active").siblings().removeClass("active");
		if(index == 0){
			transferSortCount = "";
			investList(1);
			$(".investFitter").show().next().hide();
			$(".invest-list-box").show().next().hide();
			window.location.hash = "select=0&pageNum=1&term=0&desc=";
		} else if(index == 1){
			investSortCount = "";
			transferList(1);
			$(".transferFitter").show().prev().hide();
			$(".transfer-list-box").show().prev().hide();
			window.location.hash = "transfer=&pageNum=1&amount=0&term-0&desc=";
		}
		canLoadPage(1, total);

	});

	$(".invest-filter a").click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		investList(1);
		canLoadPage(1, total);
		modifyPageNum(1);
	});

	$(".investMoney a").click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		transferList(1);
		canLoadPage(1, total);
	});

	$('.investTerm a').click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		investList(1);
		canLoadPage(1, total);
		modifyPageNum(1);
	});

	$('.transferInvestTerm a').click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		transferList(1);
		canLoadPage(1, total);
	});

	$(".expectedInterestRate").click(function(){
		if (investSortCount == '') {
			investSortCount = 'true';
			$(this).addClass("active").addClass("is-status-desc-true");
		} else if (investSortCount == 'true') {
			investSortCount = 'false';
			$(this).removeClass("is-status-desc-true").addClass("is-status-desc-false");
		} else if (investSortCount == 'false') {
			investSortCount = '';
			$(this).removeClass("is-status-desc-false");
		}
		investList(1);
		canLoadPage(1, total);
	});

	$(".transferExpectedInterestRate").click(function(){
		if (transferSortCount == '') {
			transferSortCount = 'true';
			$(this).addClass("active").addClass("is-status-desc-true");
		} else if (transferSortCount == 'true') {
			transferSortCount = 'false';
			$(this).removeClass("is-status-desc-true").addClass("is-status-desc-false");
		} else if (transferSortCount == 'false') {
			transferSortCount = '';
			$(this).removeClass("is-status-desc-false");
		}
		transferList(1);
		canLoadPage(1, total);
	});

	$('#investList').on("click", '.list-btn', function () {
		var msg = $(this).parent().attr('id');
		var tradeId = msg.split(';')[0];
		if(StringUtil.isContains(msg, 'false')){
			location.href = $_GLOBAL.basePath() + "/views/invest/invest_detail.html?tradeId=" + tradeId;
		} else {
			if(!CookieUtil.getCookie(msg.split(';')[0])){
				$('#directPass').prev().val(tradeId);
				$('.mask').show();
				$('.direct-box').show();
			} else {
				location.href = $_GLOBAL.basePath() + "/views/invest/invest_detail.html?transferId=" + tradeId;
			}
		}
	});
	
	$('.suc-close').click(function () {
		$('.mask').hide();
		$('.direct-box').hide();
	});
	$('.mask').click(function () {
		$('.suc-close').click();
	});

	/*定向标确认身份*/
	$('#confirmBtn').click(function () {
		var tradeId = $(this).prev().prev().val();
		var pass = $(this).prev().val();
		if(!pass){
			layer.msg("请输入定向融资密码。");
			$(this).prev().focus();
			return false;
		}
		AjaxUtil.ajaxPostCallBack(investApiUrl.tradeCheckAuth, DataDeal.formToJson($('#directInvest').serialize()), function (result) {
			// 用于记录定向标是否已认证
			CookieUtil.setCookie(tradeId, result.data);
			location.href = $_GLOBAL.basePath() + "/views/invest/invest_detail.html?transferId=" + tradeId;
		})
	});

	$('#directInvest').bind("keypress", function (e) {
		if(e.keyCode == '13'){
			$("#confirmBtn").click();
		}
	})

});
function canLoadPage(index, total) {
	if (total > 0) {
		initPaging(index, total);
	} else {
		$("#investListLaypageBox").html("");
	}
}

// 加载分页插件
function initPaging(index, total) {
	laypage.render({
		elem: 'investListLaypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, layout: ['prev', 'page', 'next', 'count']
		, theme: '#078eee'
		, curr: index
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				modifyPageNum(obj.curr);
				$(document).scrollTop(100);
				// $(window).animate({ scrolltop: 100 }, 1000);
				if (demandType == 0) {
					investList(obj.curr);
				} else if (demandType == 1) {
					transferList(obj.curr);
				}
			}
		}
	});
}

function investList(index) {
	var data = getInvestParams(index);
	var result = AjaxUtil.ajaxPostWithLoading(investApiUrl.investList, JSON.stringify(data));
	if(result){
		investListSuccess(result);
	}
}

function investListSuccess(result) {
	total = result.total;
	if (total > 0) {
		$("#investList").html("");
		var rows = result.rows;
		$.each(rows, function (i, item) {
			var showMoneyText, operation;
			if (serverCurrentTime <= item.investBeginTime) {
				operation = '<a class="list-btn" href="javascript:void(0);">即将开始</a><p class="time-row">'
					+ DateUtils.longToDateYMDHM(item.investBeginTime) + '&nbsp;开抢</p>';
				showMoneyText = '可投金额：' + MoneyUtil.formatMoney(item.loanAmount.amount);
			} else if (serverCurrentTime >= item.investDeadline) {
				operation = '<a class="list-btn end" href="javascript:void(0);">已结束</a>';
				showMoneyText = '总额：' + MoneyUtil.formatMoney(item.loanAmount.amount);
			} else if (item.collectedAmount.amount == item.loanAmount.amount) {
				operation = '<a class="list-btn out" href="javascript:void(0);">已抢光</a>';
				showMoneyText = '总额：' + MoneyUtil.formatMoney(item.loanAmount.amount);
			} else {
				operation = '<a class="list-btn" href="javascript:void(0);">立即投资</a>';
				showMoneyText = '可投金额：' + MoneyUtil.formatMoney(NumberUtil.sub(item.loanAmount.amount, item.collectedAmount.amount));
			}

			var investProgress = NumberUtil.div(item.collectedAmount.amount, item.loanAmount.amount);
			if ("0.00" == investProgress) {
				if (item.collectedAmount.amount) {
					investProgress = 0.01;
				}
			} else if ("1.00" == investProgress) {
				if (item.collectedAmount.amount != item.loanAmount.amount) {
					investProgress = 0.99;
				}
			}
			investProgress = NumberUtil.transfPercentage(investProgress);

			var investInterestRate = NumberUtil.transfPercentage(item.tradeInterestRate);
			var cashCouponSwitch = '', interestCouponSwitch = '', customLock = '';
			if (item.cashCouponSwitch) {
				cashCouponSwitch = "<span>红包</span>";
			}
			if (item.interestCouponSwitch) {
				interestCouponSwitch = "<span>加息券</span>";
			}
			// 定向投资标
			if (item.investDirectFlag) {
				customLock = '<i class="iconfont icon-denglumima">&nbsp;<span class="fs-14">定向投资</span></i>';
			}

			var con = '<ul>' +
					'<li class="li-1"><p class="li-top">' + item.tradeName + '</p><p class="li-bottom coupon-tag">' +
						cashCouponSwitch + interestCouponSwitch + '</p>' + customLock + '</li>' +
					'<li class="li-2"><p class=" li-top c-main-red fs-26"><span>' + investInterestRate +
						'</span></p><p class="li-bottom">历史年化收益率</p></li>' +
					'<li class="li-3"><p class="li-top">' + item.loanTerm + item.loanTermUnit.message +
						'</p><p class="li-bottom">投资期限</p></li>' +
					'<li class="li-4">' +
						'<div class="li-top"><div class="layui-progress ky-progress" lay-filter="trade' + i + '">' +
							'<div class="layui-progress-bar ky-progress-bar" name="' + investProgress +
								'" lay-percent="' + investProgress + '" style="width: ' + investProgress + '"></div>' +
						'</div>' +
						'<span class="va-m">' + investProgress + '</span></div><p class="li-bottom">' + showMoneyText + '元</p>' +
					'</li>' +
					'<li class="li-5" id="' + item.tradeId + ';' + item.investDirectFlag + '">' + operation + '</li>' +
				'</ul>';

			$("#investList").append(con);
		});
	} else {
		$("#investList").html('<div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div>');
	}
}

function transferList(index) {
	var data = getTransferParams(index);
	var result = AjaxUtil.ajaxPostWithLoading(investApiUrl.transferList, JSON.stringify(data));
	if(result){
		transferListSuccess(result);
	}
}

function transferListSuccess(result) {
	total = result.total;
	if (total > 0) {
		$("#transferList").html("");
		var rows = result.rows;
		$.each(rows, function (i, item) {

			var con = '<ul class="transfer-list-item">' +
				'<li class="li-1"><p class="li-top">'+ item.tradeName +'</p></li>' +
				'<li class="li-2 c-main-red fs-26"><p class="li-top">'+ NumberUtil.transfPercentage(item.tradeInterestRate) +'</p><p class="li-bottom">历史年化收益率</p></li>' +
				'<li class="li-3"><p class="li-top">'+ item.remainInvestDays +'天</p><p class="li-bottom">投资期限</p></li>' +
				'<li class="li-4"><p class="li-top">'+ MoneyUtil.formatMoney(item.transferActualAmt.amount) +'元</p><p class="li-bottom">转让金额</p></li>' +
				'<li class="li-5"><p class="li-top">'+ MoneyUtil.formatMoney(item.remainProceedsAmt.amount) +'元</p><p class="li-bottom">预期收益</p></li>' +
				'<li class="li-6 toInvest"><a class="list-btn" href="transfer_detail.html?transferId=' + item.transferId + '">立即投资</a></li>' +
				'</ul>';
			$("#transferList").append(con);
		});
	} else {
		$("#transferList").html('<div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div>');
	}
}

function getInvestParams(index) {
	var hash = window.location.hash;

	var url = BaseUtil.getUrlParams("?" + hash.substring(1, hash.length));
	var $select =  $(".invest-filter .active");
	var $term = $('.investTerm .active');

	url['select'] = $select.index();
	url['term'] = $term.index();
	url['desc'] = investSortCount;
	window.location.hash = BaseUtil.paramsToUrlHash(url);

	var params = {};
	params["riskLevel"] = $select.attr('name');
	params["investDaysLeftRange"] = $term.attr('data-min');
	params["investDaysRightRange"] = $term.attr('data-max');
	params["sortByInterestRateDesc"] = investSortCount;
	params["pageNum"] = index;
	params["pageSize"] = pageSize;

	return params;
}

function getTransferParams(index) {
	var hash = window.location.hash;

	var transferUrl = BaseUtil.getUrlParams("?" + hash.substring(1, hash.length));
	var $transferTerm = $('.transferInvestTerm .active');
	var $transferMoney = $('.investMoney .active');

	transferUrl['term'] = $transferTerm.index();
	transferUrl['amount'] = $transferMoney.index();
	transferUrl['desc'] = transferSortCount || "";
	window.location.hash = BaseUtil.paramsToUrlHash(transferUrl);

	var params = {};
	params["transferAmtLeftRange"] = $transferMoney.attr('data-min');
	params["transferAmtRightRange"] = $transferMoney.attr('data-max');
	params["investDaysLeftRange"] = $transferTerm.attr('data-min');
	params["investDaysRightRange"] = $transferTerm.attr('data-max');
	params["sortByInterestRateDesc"] = transferSortCount;
	params["pageNum"] = index;
	params["pageSize"] = pageSize;

	return params;
}

function popStats() {
	//获取服务端时间
	AjaxUtil.ajaxGetCallBack(commonApiUrl.serverCurrentTime, currentTimeSuccess);

	//判断是否从首页点进来的
	var url = window.location.hash;
	var urlJson = BaseUtil.getUrlParams('?' + url.substring(1, url.length));

	var pageNum = urlJson.pageNum || "1";
	if (StringUtil.isContains(url, "transfer", false)) {
		demandType = 1;
		$("#transfer-list-btn").addClass("active").siblings().removeClass("active");
		$(".transferFitter").show().prev().hide();
		$(".transfer-list-box").show().prev().hide();
		$(".investMoney").find('a').eq(urlJson.amount).addClass("active").siblings().removeClass("active");
		$(".transferInvestTerm").find('a').eq(urlJson.term).addClass("active").siblings().removeClass("active");
		desc($(".transferExpectedInterestRate "), urlJson.desc);
		transferSortCount = urlJson.desc;

		transferList(pageNum);
		canLoadPage(pageNum, total);
	} else if(StringUtil.isContains(url, "select", false)) {
		$("#invest-list-btn").addClass("active").siblings().removeClass("active");
		$('.investFitter').show().next().hide();
		$(".invest-list-box").show().next().hide();
		$(".invest-filter").find('a').eq(urlJson.select).addClass("active").siblings().removeClass("active");
		$(".investTerm").find('a').eq(urlJson.term).addClass("active").siblings().removeClass("active");
		desc($(".expectedInterestRate "), urlJson.desc);
		investSortCount = urlJson.desc;

		investList(pageNum);
		canLoadPage(pageNum, total);
	} else {
		$("#invest-list-btn").addClass("active").siblings().removeClass("active");
		$(".invest-filter").show().find('a').eq(0).addClass("active").siblings().removeClass("active");
		$(".invest-list-box").show().next().hide();

		investList(1);
		canLoadPage(1, total);
	}

	/*使进度条滚动*/
	var process = $("#investList").find('.layui-progress-bar');
	document.addEventListener('scroll',function(){
		//滚动条高度+视窗高度 = 可见区域底部高度
		var visibleBottom = window.scrollY + document.documentElement.clientHeight;
		//可见区域顶部高度
		var visibleTop = window.scrollY;
		for (var i = 0; i < process.length; i++) {
			var item = $(process[i]);
			var InvestPro = item.attr("name");
			var centerY = item.offset().top+6;
			if(centerY>visibleTop&&centerY<visibleBottom){
				element.progress('trade' + i, InvestPro);
			}else{
				element.progress('trade' + i, '0%');
			}
		}
	});
}

function modifyPageNum(pageNum) {
	var hash = window.location.hash;
	var transferUrl = BaseUtil.getUrlParams("?" + hash.substring(1, hash.length));
	transferUrl['pageNum'] = pageNum;
	window.location.hash = BaseUtil.paramsToUrlHash(transferUrl);
}

function desc(element, desc) {
	if (desc == 'true') {
		element.removeClass("is-status-desc-false").addClass("is-status-desc-true");
	} else if (desc == 'false') {
		element.removeClass("is-status-desc-true").addClass("is-status-desc-false");
	} else {
		element.removeClass("is-status-desc-true").removeClass("is-status-desc-false");
	}
}

function currentTimeSuccess(result) {
	serverCurrentTime = result.data;
}

