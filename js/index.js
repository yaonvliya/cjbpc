var selectionDemandId="", activityDemandId="", transferId="";
var serverCurrentTime; //服务端时间
var userInfo; //用户信息
var noticeArr = [];
var noticeArrLen;
$(document).ready(function () {
	// 初始化layer
	layui.use(['layer'], function () {
		layer = layui.layer;

		if(!navigator.cookieEnabled){
			layer.open({
				icon: 5,
				title: '温馨提示',
				content: 'cookie已被禁掉，无法正常使用车聚宝，请开启浏览器的cookie功能',
				shadeClose: true,
				time: 10000,
				anim: 0
			});
		}

		userInfo = commonAPIUtil.initUserInfoUnbindJump();
		var loginStatus = CookieUtil.getCookie('loginStatus');
		if (loginStatus == "true") {
			// 已登录
			$(".logged-in").show();
			$(".avatar").hover(function() {
				$(".avatar-ul").fadeIn(300)
			}, function() {
				$(".avatar-ul").hide();
			});

			if(!validateAPIUtil.validateUserHaseRealName(userInfo)){
				$(".account-name").text("您好，" + userInfo.safeLoginAccount);
			} else {
				$(".account-name").text("您好，" + userInfo.realName);
			}

		} else {
			// 未登录
			$(".logged-out").show();
		}

		//获取服务端时间
		AjaxUtil.ajaxGetCallBack(commonApiUrl.serverCurrentTime, currentTimeSuccess);
		//加载轮播图
		var data = {domain: $_GLOBAL.banner.PC_INDEX};
		AjaxUtil.ajaxPostCallBack(indexApiUrl.banners, JSON.stringify(data), banner);
		//运营数据
		AjaxUtil.ajaxGetCallBack(indexApiUrl.platformData, platformData);
		//标的推荐
		AjaxUtil.ajaxGetCallBack(indexApiUrl.demandRecommend, demandRecommend);
		//平台公告
		AjaxUtil.ajaxGetCallBack(indexApiUrl.announcements, notice);
		//平台公告
		AjaxUtil.ajaxGetCallBack(indexApiUrl.urgentAnnouncements, urgentNotice);
		//常见问题
		AjaxUtil.ajaxGetCallBack(indexApiUrl.questions, question);
	});


	layui.use('element', function() {
		var $ = layui.jquery
			, element = layui.element;

		var process = $('.layui-progress-bar');
		document.addEventListener('scroll',function(){
			//滚动条高度+视窗高度 = 可见区域底部高度
			var visibleBottom = window.scrollY + document.documentElement.clientHeight;
			//可见区域顶部高度
			var visibleTop = window.scrollY;
			for (var i = 0; i < process.length; i++) {
				var investPro = $(process[i]).attr('name');
				var centerY = $(process[i]).offset().top+6;
				if(centerY>visibleTop&&centerY<visibleBottom){
					element.progress('trade' + i, investPro);
				}else{
					element.progress('trade' + i, '0%');
				}
			}
		});
	});

	$("#footer").load($_GLOBAL.basePath() + "/views/common/footer.html");
	
	$("#selectionDemandId").click(function () {
		location.href = "views/invest/invest_detail.html?tradeId=" + selectionDemandId;
	});

	$("#activityDemandId").click(function () {
		location.href = "views/invest/invest_detail.html?tradeId=" + activityDemandId;
	});

	$("#transferId").click(function () {
		location.href = "views/invest/transfer_detail.html?tradeId=" + transferId;
	});

	$("#moreNotice").click(function () {
		window.location.href = "views/about/news.html";
	});

	$("#moreQuestion").click(function () {
		window.location.href = "views/about/help.html";
	});
	
	// 顶部二维码
	$(".qr-item").hover(function(){
	    $(this).find(".pic-box").show();
	}, function(){
	    $(".pic-box").hide();
	});

});

// 首页悬挂导航
$(window).scroll(function () {
	if ($(this).scrollTop() > 120) {
		$(".header-wrap").removeClass("header-hide").addClass("header-show");
	} else {
		$(".header-wrap").removeClass("header-show").addClass("header-hide");
	}
});

window.onscroll = function () {
	var sl = -Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
	if (Math.abs(sl) > 0) {
		$(".header-wrap").css("transition", "all 0s");
		document.getElementsByClassName("header-wrap")[0].style.left = sl + 'px';
	}
};

$(window).resize(function () {
	document.getElementsByClassName("header-wrap")[0].style.left='0px';
});

function banner(result) {
	var data = result.data;
	//轮播图数据
	$.each(data, function (i, item) {
		var con = '<a href="' + item.bannerJumpUrl + '" class="swiper-slide a1" target="_blank"><img src="' + item.bannerImgUrl + '"/></a>';
		$(".swiper-wrapper").append(con);
	});
	
	//初始化轮播图
	var mySwiper = new Swiper('.swiper-container', {
		direction: 'horizontal',
		loop: true,
		autoplay: 3000,
		speed: 1000,
		autoplayDisableOnInteraction: false,

		//取消鼠标滑动事件
		simulateTouch: false,

		// 如果需要分页器
		pagination: '.swiper-pagination',

		//前进后退按钮
		prevButton: '.swiper-button-prev',
		nextButton: '.swiper-button-next',

		//pc端所需要的分页器可点击
		//paginationClickable :true,
		
		effect : 'fade',
		fade: {
		  crossFade: true,
		}

	});
	
	$('.swiper-slide').mouseenter(function() {
    	mySwiper.stopAutoplay();
	}).mouseleave(function() {
	    mySwiper.startAutoplay();
	});
}

function platformData(result) {
	var data = result.data;
	
	$('#safeOperationDays').animateNumber({
		number: data.safeOperationDays,
		numberStep: function(now, tween) {
			var floored_number = Math.floor(now),
				target = $(tween.elem);
			target.text(floored_number);
		}
	}, 1000);
	
	$('#userAccumulatedEarnings').animateNumber({
		number: data.totalProfitAmount,
		numberStep: function(now, tween) {
			var floored_number = Math.floor(now),
				target = $(tween.elem);
			var innerTxt = MoneyUtil.formatMoney(NumberUtil.div(floored_number, 10000));
			target.text(innerTxt);
		}
	}, 1000);
	
	$('#totalTransactionAmount').animateNumber({
		number: data.totalTradeAmount,
		numberStep: function(now, tween) {
			var floored_number = Math.floor(now),
				target = $(tween.elem);
			var innerTxt = MoneyUtil.formatMoney(NumberUtil.div(floored_number, 10000));
			target.text(innerTxt);
		}
	}, 1000);
	
}

function demandRecommend(result) {
	var data = result.data;
	//精选标
	if(data.selection){
		$("#selectionDemandName").text(data.selection.tradeName);
		$("#selectionInterestRate").text(NumberUtil.transfPercentage(data.selection.investInterestRateText));
		$("#selectionInvestTerm").text(data.selection.loanTerm);
		$("#selectionInvestTermPrecision").text(data.selection.loanTermUnit.message);
		var investProgress = NumberUtil.transfPercentage(NumberUtil.div(data.selection.collectedAmount, data.selection.loanAmount));
		$("#selectionInvestProgress").text(investProgress).prev().children().attr('name', investProgress).attr("style", "width: " + investProgress + "");
		selectionDemandId = data.selection.tradeId;
		if(serverCurrentTime <= data.selection.investStartTime){
			$("#selectionDemandId").html("即将开始");
		} else if(serverCurrentTime > data.selection.investEndTime) {
			$("#selectionDemandId").html("已结束");
		}else if(data.selection.collectedAmount == data.selection.loanAmount){
			$("#selectionDemandId").html("已抢光");
		} else if("collecting" != data.selection.tradeStatus) {
			$("#selectionDemandId").html("已完成");
		}
	} else {
		$(".selection").remove();
	}



	//活动标
	if(data.activity){
		$("#activityDemandName").text(data.activity.tradeName);
		$("#activityInterestRate").text(NumberUtil.transfPercentage(data.activity.investInterestRateText));
		$("#activityInvestTerm").text(data.activity.loanTerm);
		$("#activityInvestTermPrecision").text(data.activity.loanTermUnit.message);
		var activityProgress = NumberUtil.transfPercentage(NumberUtil.div(data.activity.collectedAmount, data.activity.loanAmount));
		$("#activityInvestProgress").text(activityProgress).prev().children().attr('name', activityProgress).attr("style", "width: " + activityProgress + "");
		activityDemandId = data.activity.tradeId;
		if(serverCurrentTime <= data.activity.investStartTime){
			$("#activityDemandId").html("即将开始");
		} else if(serverCurrentTime > data.activity.investEndTime) {
			$("#activityDemandId").html("已结束");
		}else if(data.activity.collectedAmount == data.activity.loanAmount){
			$("#activityDemandId").html("已抢光");
		} else if("collecting" != data.activity.tradeStatus) {
			$("#activityDemandId").html("已完成");
		}
	} else {
		$(".activity").remove();
	}


	//转让标
	if(data.transfer){
		$("#transferTransferName").text(data.transfer.tradeName);
		$("#transferInterestRate").text(NumberUtil.transfPercentage(data.transfer.expectedInterestRate));

		$("#transferRemainTerm").text(data.transfer.remainInvestDays);
		$("#transferAmount").text(data.transfer.transferAmount);
		transferId = data.transfer.transferId;
		if("transferring" != data.transfer.transferStatus){
			$("#transferId").html("已转让");
		}
	} else {
		$(".transfer").remove()
	}

}

function notice(result) {
	var data = result.data;
	$.each(data, function (i, item) {
		var con = '<li><a href="views/about/news.html?ancId=' + item.ancId + '">' + item.ancTitle + '</a><span>' + DateUtils.longToDateString(item.ancTime, '-') +'</span></li>';
		$("#notice").append(con);
	});
}
function urgentNotice(result) {
	var data = result.data;
	$.each(data, function (i, item) {
		noticeArr.push([item.ancTitle, item.ancId, DateUtils.longToDateStringYMD(item.ancTime)]);
	});
	noticeArrLen = noticeArr.length;
	if (noticeArrLen == 0) {
		$(".notice-panel").hide();
	} else {
//		$(".notice-panel").append('<i class="iconfont icon-gonggao11"></i>');
		
		$(".notice-panel").show();
		$rollBox.html(noticeMessage(0));
	}
	startTimer();
}

function question(result) {
	var data = result.data;
	$.each(data, function (i, item) {
//		var con = '<li><a href="views/about/help.html?' + item.questionTypeId + ';' + item.questionId + '">' + item.questionTitle + '</a></li>';
		var con = '<li><a href="views/about/help.html#faqTypeId=' + item.questionTypeId + '">' + item.questionTitle + '</a></li>';
		$("#question").append(con);
	});
}

function currentTimeSuccess(result) {
	serverCurrentTime = result.data;
}

var timer = null;
var noticeIndex = 1;
var $rollBox = $("#rollBox");

$rollBox.on("mouseover", function () {
	clearInterval(timer);
}).mouseout(function () {
	startTimer();
});

window.onblur = function () {
	clearInterval(timer);
};

window.onfocus = function () {
	clearInterval(timer);
	startTimer();
};

function startTimer () {
	timer = setInterval(function () {
		initRoll();
	}, 6000);
}

function initRoll () {
	if(noticeArrLen <= 0){
		return;
	}
	if (noticeIndex >= noticeArrLen) {
		noticeIndex = 0;
	}

	$("#rollBox").append(noticeMessage(noticeIndex));

	$("#rollBox li").eq(0).stop().animate({"top": "-40px"}, 1000);
	$("#rollBox li").eq(1).stop().animate({"top": "0px"}, 1000, function () {
		$("#rollBox li").eq(0).remove();
		noticeIndex++;
	});
}

function noticeMessage(i) {
	return '<li>' +
		'<a class="notice-preview" href="views/about/news.html?ancId=' + noticeArr[i][1] + '">' +
		'<span class="notice-content">' + noticeArr[i][0] + '</span>' +
		'</a>' +
		'<span class="notice-date">' + noticeArr[i][2] + '</span>' +
		'</li>';
}


