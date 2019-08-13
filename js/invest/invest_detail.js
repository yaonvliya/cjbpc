var userInfo, loginStatus, singleMinAmount, singleMaxAmount, increaseAmount, availableBalance; //用户信息， 用户状态， 最小投资额，最大投资额, 递增金额， 用户可用余额
var nowDate, endDate, interval; //标的募集结束时间
var investSuccessTimer, investMsgTimer; // 投资成功后定时器    获取验证码定时器
var cashCouponSwitch, interestCouponSwitch; // 是否可用红包或加息券
var couponFlag = 1;//卡券展开、隐藏卡券列表
var cashCouponId, interestCouponId, demandId, cashMoney = 0; //红包ID，加息券ID， 标的ID, 红包金额
var cashText = '', rateText = ''; //已选中的红包，已选中的加息券
var tradeInfo; //标的信息
$(document).ready(function () {
	// 初始化laydate
	layui.use(['laypage', 'table', 'layer'], function () {
		laypage = layui.laypage
			, laytable = layui.table
			, layer = layui.layer;

		CookieUtil.deleteCookie("TO_INVEST");
		CookieUtil.deleteCookie("baoFu-callBack-URL");
		AjaxUtil.ajaxGetCallBack(commonApiUrl.serverCurrentTime, currentTimeSuccess);

		//加载标的信息
		var url = window.location.search;
		var tradeId = url.split('=')[1];
		var data = {tradeId: tradeId, directTradeAuthToken: CookieUtil.getCookie(tradeId)};
		var result = AjaxUtil.ajaxPost(investApiUrl.investDetail, DataDeal.josnObjToString(data));
		if (result.code == '20000') {
			tradeInfo = result.data;
			investDetailSuccess(result);
			tradeInfoSuccess(result);
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time: 2000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else if (result.code == "104014") {
			$('body').addClass("not-flow");
			$('#directPass').prev().val(tradeId);
			$('.mask').show();
			$('.direct-box').show();
		} else {
			layer.msg(result.message);
		}

		// 获取用户信息
		userInfo = commonAPIUtil.initUserInfoUnbindJump();

		//获取用户登录状态
		loginStatus = CookieUtil.getCookie('loginStatus');
		if ("true" == loginStatus) {
			//加载用户可用余额
			if (validateAPIUtil.validateUserHaseRealName(userInfo)) {
				availableBalance = MoneyUtil.formatMoney(commonAPIUtil.getUserBalance().availableBalance);

				$(".canUsed").html(availableBalance + '&emsp;<button class="recharge">充值</button>');
				$("#canUsed").text(availableBalance);
				$("#bankPhone").text(userInfo.safeLoginAccount);
			} else {
				$(".canUsed").html('<button class="openAccount cr-pr">去实名认证</button>');
			}
			$('#postLoanInfo').prev().find('[class="pt20 ml20"]').html("");
		} else {
			$(".canUsed").html('<button class="login_btn cr-pr">登录后可见</button>');
		}
	});

	$("#header").load("../common/header.html");
	$("#footer").load("../common/footer.html");

	//点击全投
	$(".invest-total-btn").click(function () {
		var amount = null;
		var canInvestAmount = parseFloat(MoneyUtil.parseMoney($("#canInvest").text()));
		var availableBals = parseFloat(MoneyUtil.parseMoney(availableBalance));
		var singleMinAms = parseFloat(singleMinAmount);
		var increaseAms = parseFloat(increaseAmount);
		var singleMaxAms = parseFloat(singleMaxAmount);
		if ("true" == loginStatus) {
			if (hasRealName(userInfo)) {
				return;
			}
			if (availableBals > canInvestAmount) {
				amount = NumberUtil.sub(canInvestAmount, NumberUtil.mod(canInvestAmount, increaseAms));
				// amount = canInvestAmount.toFixed(2);
			} else {
				// 可用余额 < 可投金额
				if (availableBals < singleMinAms) {
					// 余额 < 起投金额
					layer.msg('余额不足，请先充值！');
				} else {
					// 余额 - 向上取整((可用余额 * 100) 取余 (递增金额 * 100)) / 100
					amount = (availableBals - (Math.ceil((availableBals * 100) % (increaseAms * 100)) / 100)).toFixed(2);
					if (amount == 0) {
						// 如果算出来为0，投资额只能是起投金额
						amount = singleMinAms.toFixed(2);
					}
				}
			}
			if(amount > singleMaxAms){
				layer.msg('单笔投资金额上限为' + singleMaxAmount + '元！');
				amount = NumberUtil.sub(singleMaxAms, NumberUtil.mod(singleMaxAms, increaseAms));
			}
			$("#investAmount").focus().val(amount).blur();
		} else {
			login();
		}
	});

	//判断递增倍数并计算收益
	$("#investAmount").blur(function () {
		var amount = $(this).val() ? $(this).val() : 0;
		var data = {
			investAmt: amount,
			investTerm: tradeInfo.loanTerm,
			investTermUnit: tradeInfo.loanTermUnit.code,
			repayMethod: tradeInfo.repayMethod.code,
			interestRate: tradeInfo.tradeInterestRate
		};
		var result = AjaxUtil.ajaxPostWithLoading(commonApiUrl.expect, JSON.stringify(data));
		if (result) {
			$('.expectAmount').text(result.data.amount);
		}
	});

	//点击立即投资
	$("#investRightAwayInvestment").click(function () {
		$('.coupon-row').removeClass("hide");
		$('#canUseCash').prev().removeClass("hide");
		$('#canUseInterest').prev().removeClass("hide");
		var $investAmount = $("#investAmount");
		var investMoney = $investAmount.val();
		$("#confirmInvestAmount").text($investAmount.val());
		$("#CnyMoney").text(MoneyUtil.moneyToCny(investMoney));
		//判断是否登录，未登录则跳转到登录页面
		if ("true" == loginStatus) {
			if (hasRealName(userInfo)) {
				return;
			}

			if (!userInfo.riskLevel) {
				layer.msg("风险评测之后才可以进行投资，即将到个人中心进行风险测评。", {time: 3000}, function () {
					window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#risk_assessment";
				});
				return;
			}

			//判断是否输入投资金额
			if (!investMoney || investMoney == 0) {
				layer.msg("请输入投资金额");
				$investAmount.focus();
				return;
			}

			//判断账户余额是否大于输入的金额
			if (NumberUtil.sub(availableBalance, investMoney) < 0) {
				layer.msg("账户余额不足，请先充值!");
				return;
			}

			if (NumberUtil.sub(investMoney, singleMinAmount) < 0) {
				layer.msg("投资金额不能少于起投金额。");
				return;
			}

			//判断是否输入的金额是递增倍数
			if (NumberUtil.mod(investMoney, increaseAmount) != 0) {
				layer.msg("投资金额应该为递增金额的倍数。");
				return true;
			}

			if (investMoney > singleMaxAmount) {
				layer.msg('投资额不能大于单笔上限' + singleMaxAmount + '元！');
				return;
			}

			if (NumberUtil.sub(investMoney, MoneyUtil.parseMoney($('#canInvest').text())) > 0) {
				layer.msg("投资金额不能超过可投金额。");
				return;
			}

			if (cashCouponSwitch) {
				AjaxUtil.ajaxPostCallBack(userCouponApiUrl.getCanUseCash, JSON.stringify({investAmount: investMoney}), getCanUseCashSuccess);
			} else {
				$('#canUseCash').prev().text("该项目不可使用红包").addClass("hide");
			}

			if (interestCouponSwitch) {
				AjaxUtil.ajaxPostCallBack(userCouponApiUrl.getCanUseInterest, JSON.stringify({investAmount: investMoney}), getCanUseInterestSuccess);
			} else {
				$('#canUseInterest').prev().text("该项目不可使用加息券").addClass("hide");
			}

			if(!cashCouponSwitch && !interestCouponSwitch){
				$('.coupon-row').addClass("hide");
			}

			if (!CheckBoxUtil.isChecked("investAgreement")) {
				layer.msg("请阅读并勾选协议!");
				return;
			}

			var limitMoney = $_GLOBAL.riskLevelLimitAmount(userInfo.riskLevel);
			var invertingMoney = commonAPIUtil.getUserInvestingMoney();

			if (NumberUtil.checkPlusNum(limitMoney) && NumberUtil.add(invertingMoney, investMoney) > limitMoney) {
				layer.msg("在投金额超过风险评估上限了，可到个人中心重新进行风险评估");
				return;
			}

			//投资弹框
			$(".mask").show();
			$(".pop-invest").show();
		} else {
			login();
		}
	});

	$("#getInvestMsg").click(function () {
		var data = {
			captchaBizType: $_GLOBAL.msgType.INVEST
		};
		var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, DataDeal.josnObjToString(data));

		if (result.code == '20000') {
			layer.msg('发送成功');
			$("#message").focus();
			// 禁用“获取验证码”按钮，开始计时
			investMsgTimer = TimerUtil.setRemainTime("getInvestMsg");
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time: 2000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
			$("#message").focus();
		}
	});

	//确认投资
	$('#confirmInvest').click(function () {
		var captcha = $('#message').val();
		if (StringUtil.isEmpty(captcha)) {
			layer.msg("请输入获得到的短信验证码");
			$('#message').focus();
			return;
		}

		var data = {
			tradeId: demandId,
			investAmount: $("#confirmInvestAmount").text(),
			cashCouponId: cashCouponId,
			interestCouponId: interestCouponId,
			smsCaptcha: captcha
		};
		var result = AjaxUtil.ajaxPost(investApiUrl.demandInvest, JSON.stringify(data));
		window.clearInterval(investMsgTimer);
		if (result.code == '20000') {
			demandInvestSuccess(result);
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time: 2000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else if (result.code == '104999') {
			layer.msg(result.message, {time: 2000}, function () {
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.authorization, null, function (autoResult) {
					if (autoResult.data) {
						CookieUtil.setCookie("baoFu-callBack-URL", location.href);
						location.href = $_GLOBAL.basePath() + "/wait.html?" + autoResult.data;
					} else {
						layer.msg("服务器错误")
					}
				});
			});
		} else {
			layer.msg(result.message);
		}
	});

	$(".login_btn").click(function () {
		CookieUtil.setCookie("TO_INVEST", location.href);
		window.location.href = $_GLOBAL.basePath() + "/login.html#detail";
	});

	$(".canUsed").on("click", ".login_btn", function () {
		CookieUtil.setCookie("TO_INVEST", location.href);
		window.location.href = $_GLOBAL.basePath() + "/login.html#detail";
		/*//登录弹框
		$(".mask").show();
		$(".pop-login").show();*/
	}).on("click", ".openAccount", function () {
		hasRealName(userInfo);
	}).on("click", '.recharge', function () {
		CookieUtil.setCookie("baoFu-callBack-URL", location.href);
		window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#recharge";
	});

	//隐藏
	$(".mask").click(function () {
		cancleMask();
	});

	$(".suc-close").click(function () {
		cancleMask();
	});

	//项目详情导航
	$(".project-info-nav li").click(function () {
		var index = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$(".project-info-item").eq(index).show().siblings(".project-info-item").hide();

		switch (index) {
			case 1:
				loanDetail();
				break;
			case 2:
				if ("true" == loginStatus) {
					investInfo();
				}
				break;
			/*case 3:
				safeguard();
				break;
			case 4:
				pointDanger();
				break;*/
			case 5:
				if ("true" == loginStatus) {
					postLoanInfo();
				}
				break;
		}
	});

	//选择卡券
	$(".coupon-input").click(function () {
		if (couponFlag == 1) {
			$(".coupon-input").addClass("active");
			$(".select-btn").text("确定");
			$(".coupon-input .iconfont").addClass("active");
			$(".coupon-box").slideDown("normal");
			couponFlag = 0;
		} else {
			$(".select-btn").text("选择卡券");
			$(".coupon-input .iconfont").removeClass("active");
			$(".coupon-box").slideUp("normal", function () {
				$(".coupon-input").removeClass("active");
			});
			couponFlag = 1;
		}
	});

	//选择卡券
	$(".coupon-box").on("click", 'input', function () {
		var checked;
		// 展示已选卡券
		var couponName = $(this).attr('name');
		var couponText = $(this).next().text();

		var checkedState = $(this).attr('class');
		if (checkedState == "active") {
			$("input:radio[name='" + couponName + "']").attr('checked', false).removeClass("active");
			checked = 0;
		} else {
			checked = couponName + 1;
			$("input:radio[name='" + couponName + "']").removeClass("active");
			$(this).addClass("active");
		}

		if (couponName == 'couponCash') {   //红包
			if (checked == "couponCash1") {
				cashText = "红包" + couponText + "&emsp;";
				cashMoney = $(this).val();
				cashCouponId = $(this).parent().parent().attr('name');
			} else {
				cashText = "";
				cashMoney = 0;
				cashCouponId = "";
			}
		} else if (couponName == 'couponRate') {    //加息券
			if (checked == "couponRate1") {
				rateText = "加息券" + couponText;
				interestCouponId = $(this).parent().parent().attr('name');
			} else {
				rateText = "";
				interestCouponId = "";
			}
		}

		if (cashText || rateText) {
			$(".selected-coupon").html(cashText + rateText);
			$(".no-use").hide();
		} else {
			$(".selected-coupon").text("");
			$(".no-use").show();
		}
	});

	$(document).click(function (event) {
		if (!BaseUtil.isParent(event.target, $(".coupon-row")[0])) {
			$(".select-btn").text("选择卡券");
			$(".coupon-input .iconfont").removeClass("active");
			$(".coupon-box").slideUp("normal", function () {
				$(".coupon-input").removeClass("active");
			});
			couponFlag = 1;
		}
	});

	$(".modify-type").focus(function () {
		$(this).attr("type", "password");
	});

	/*定向标确认身份*/
	$('#confirmBtn').click(function () {
		var tradeId = $(this).prev().prev().val();
		var pass = $(this).prev().val();
		if (!pass) {
			layer.msg("请输入定向融资密码。");
			$(this).prev().focus();
			return false;
		}
		AjaxUtil.ajaxPostCallBack(investApiUrl.tradeCheckAuth, DataDeal.formToJson($('#directInvest').serialize()), function (result) {
			// 用于记录定向标是否已认证
			CookieUtil.setCookie(tradeId, result.data);
			location.reload();
		})
	});

	$('#directInvest').bind("keypress", function (e) {
		if (e.keyCode == '13') {
			$("#confirmBtn").click();
		}
	})
});

function login() {
	layer.msg('您还没有登录，请先登录', {
		time: 1000 //1秒关闭
	}, function () {
		CookieUtil.setCookie("TO_INVEST", location.href);
		window.location.href = $_GLOBAL.basePath() + "/login.html#detail";
	});
}

function investDetailSuccess(result) {
	var data = result.data;

	demandId = data.tradeId;
	singleMinAmount = data.singleMinAmount.amount;
	singleMaxAmount = data.singleMaxAmount.amount;
	increaseAmount = data.singleIncrAmount.amount;
	cashCouponSwitch = data.cashCouponSwitch;
	interestCouponSwitch = data.interestCouponSwitch;

	$(".demandName").text(data.tradeName);
	$(".investInterestRate").text(NumberUtil.transfPercentage(data.tradeInterestRate));
	$(".loanTerm").text(data.loanTerm + data.loanTermUnit.message);
	$(".loanAmount").text(MoneyUtil.formatMoney(data.loanAmount.amount) + '元');
	$(".loanPurpose").text(data.loanPurpose);
	$(".repayMethod").text(data.repayMethod.message);
	$("#canInvest").text(MoneyUtil.formatMoney(NumberUtil.sub(data.loanAmount.amount, data.collectedAmount.amount)));
	$("#loanAmount").text(MoneyUtil.formatMoney(data.loanAmount.anount) + "元");
	$("#investAmount").attr("placeholder", "起投金额" + MoneyUtil.formatMoney(singleMinAmount) + ", 递增金额" + MoneyUtil.formatMoney(increaseAmount)).val("");

	var percentage = NumberUtil.div(data.collectedAmount.amount, data.loanAmount.amount);
	if ("0.00" == percentage) {
		if (data.collectedAmount.amount) {
			percentage = 0.01;
		}
	} else if ("1.00" == percentage) {
		if (data.collectedAmount.amount != data.loanAmount.amount) {
			percentage = 0.99;
		}
	}
	percentage = NumberUtil.transfPercentage(percentage);

	$("#loanSpeed").attr("lay-filter", demandId).html('<div class="layui-progress-bar layui-bg-blue ky-progress-bar" ' +
		'lay-percent="' + percentage + '" style="width: ' + percentage + '"></div>').next().text(percentage);

	$("#repayGuarantee").text(data.repayGuarantee);

	endDate = data.investDeadline;

	/*标的状态*/
	var status = $('.trade-status');
	if (data.collectedAmount.amount == data.loanAmount.amount) {
		status.show().prev().empty();
		status.find('.status-tips').text("该项目已投满，请关注其他项目!");
		$(".circle-box").addClass("status-sold-out");
	} else if (nowDate > data.investDeadline) {
		status.show().prev().empty();
		status.find('.status-tips').text("该项目已结束，请关注其他项目!");
		$(".circle-box").addClass("status-finished");
		$('.timer-task').text("剩余投资时间：投资已结束").removeClass("timer-task");
	} else if (nowDate < data.investBeginTime) {
		status.show().prev().empty();
		status.find('.status-tips').text("项目即将开始!");
//		status.find('.circle-box span').text("即将开始");
		$(".circle-box").addClass("status-not-started");
		$('.timer-task').children("span:first-child").text("开始投资倒计时：");
		endDate = data.investBeginTime;
	} else {
		status.empty().prev().show();
	}

	setUpInterval();
	interval = window.setInterval(setUpInterval, 1000);
	if ((endDate - nowDate) <= 179000) {
		$(".timer-task").append('<span class="c-main-blue fs-20" id="endTimeSecond"></span>秒');
	}
}

function setUpInterval() {
	nowDate = nowDate + 1000;
	if (((endDate - nowDate) / 1000).toFixed() == 179) {
		$(".timer-task").append('<span class="c-main-blue fs-20" id="endTimeSecond">59</span>秒');
		$("#endTimeSecond").text((DateUtils.dateDiff('s', nowDate, endDate)) % 60);
	} else if (nowDate >= endDate) {
		window.clearInterval(interval);
		$("#endTimeDay").text(0);
		$("#endTimeHour").text(0);
		$("#endTimeMinute").text(0);
		$("#endTimeSecond").text(0);
		if ($('.trade-status').find('span').text() == "即将开始") {
			location.reload();
		}
		return false;
	}

	$("#endTimeDay").text(DateUtils.dateDiff('d', nowDate, endDate));
	$("#endTimeHour").text((DateUtils.dateDiff('h', nowDate, endDate)) % 24);
	$("#endTimeMinute").text((DateUtils.dateDiff('n', nowDate, endDate)) % 60);
	$("#endTimeSecond").text((DateUtils.dateDiff('s', nowDate, endDate)) % 60);
}

function tradeInfoSuccess(result) {
	var data = result.data;
	var table = $('.project-info');

	layui.each(result.data, function (k, v) {
		var selector = '[class="' + k + '"]';
		var elt = table.find(selector);
		if (!v) {
			v = "- - -"
		}
		if (typeof (v) == 'string') {
			elt.text("" + v);
		} else if (typeof (v) == 'object') {
			elt.text(MoneyUtil.formatMoney(v.amount));
		}
	});
	table.find('[class="tradeInterestRate"]').text(NumberUtil.transfPercentage(data.tradeInterestRate));
	table.find('[class="tradeStatus"]').text(data.tradeStatus.message);
	table.find('[class="repayMethod"]').text(data.repayMethod.message);
	table.find('[class="loanTerm"]').text(data.loanTerm + data.loanTermUnit.message);
	table.find('[class="investBeginTime"]').text(DateUtils.longToDateString(data.investBeginTime));
	table.find('[class="investDeadline"]').text(DateUtils.longToDateString(data.investDeadline));
	if (data.transferSwitch) {
		table.find('[class="transferSwitch"]').text("可转让");
	} else {
		table.find('[class="transferSwitch"]').text("不可转让");
	}
	StartsUtil.createStars(data.riskLevel, "starts");
	StartsUtil.createStars('保守型', "conservativeStarts");
	StartsUtil.createStars('稳健型', "robustStarts");
	StartsUtil.createStars('成长型', "growthStarts");
	StartsUtil.createStars('进取型', "aggressiveStarts");
}

function safeguard() {
	var result = AjaxUtil.ajaxPostWithLoading(investApiUrl.safeguard, JSON.stringify({demandId: demandId}));
	if (result) {
		$("#safeguard").html(result.data);
	}
}

function pointDanger() {
	var result = AjaxUtil.ajaxPostWithLoading(investApiUrl.pointDanger, JSON.stringify({demandId: demandId}));
	if (result) {
		$("#pointDanger").html(result.data);
	}
}

function postLoanInfo() {
	var result = AjaxUtil.ajaxPost(investApiUrl.postLoanInfo, JSON.stringify({tradeId: demandId}));
	if (result.code == '20000') {
		$('#postLoanInfo').show().prev().hide();
		var data = result.data;
		var elm = $('#loanManage');
		layui.each(result.data, function (k, v) {
			var selector = '[class="' + k + '"]';
			var elt = elm.find(selector);
			if (!v) {
				v = "- - -"
			}
			elt.text("" + v);
		});
		elm.find('[class="loanTimes"]').text(data.loanOverview.loanTimes);
		elm.find('[class="overdueTimes"]').text(data.loanOverview.overdueTimes);
		elm.find('[class="overdueAmount"]').text(MoneyUtil.formatMoney(data.loanOverview.overdueAmount.amount));
	} else if (result.code == "40404" || result.code == "40405") {
		layer.msg('由于您长时间未操作，请重新登录。', {time: 2000}, function () {
			CookieUtil.clearAllCookie();
			$_GLOBAL.jumpToLogin();
		});
	} else if (result.code == '30000') {
		$('#postLoanInfo').prev().find('[class="pt20 ml20"]').html(result.message);
	} else {
		layer.msg(result.message);
	}
}

function loanDetail() {
	var result = AjaxUtil.ajaxPostWithLoading(investApiUrl.loanDetail, JSON.stringify({tradeId: demandId}));
	if (result) {
		var data = result.data;
		var elm;
		if (data.loanerUserType.code == 'JG') {
			elm = $('.company');
			elm.show().prev().empty();
		} else {
			elm = $('.personal');
			elm.show().next().empty();
		}
		layui.each(result.data, function (k, v) {
			var selector = '[class="' + k + '"]';
			var elt = elm.find(selector);
			if (!v) {
				v = "- - -"
			}
			if (typeof (v) == 'string') {
				elt.html("" + v);
			} else if (typeof (v) == 'boolean') {
				if (v) {
					elm.find('[data-class="' + k + '"]').children('i').addClass("active");
				}
			}
		});
		elm.find('[class="loanTimes"]').text(data.loanOverview.loanTimes);
		elm.find('[class="overdueTimes"]').text(data.loanOverview.overdueTimes);
		elm.find('[class="overdueAmount"]').text(MoneyUtil.formatMoney(data.loanOverview.overdueAmount.amount));
	}
}

function investInfo() {
	var data = {tradeId: demandId};
	var result = AjaxUtil.ajaxPost(investApiUrl.investInfo, JSON.stringify(data));
	if (result.code == '20000') {
		investInfoTable(result);
	} else if (result.code == '30000') {
		$("#investDetailList").html("<span class='pt20 ml20'>" + result.message + "</span>");
	} else if (result.code == "40404" || result.code == "40405") {
		layer.msg('由于您长时间未操作，请重新登录。', {time: 2000}, function () {
			CookieUtil.clearAllCookie();
			$_GLOBAL.jumpToLogin();
		});
	} else {
		layer.msg(result.message);
	}


}

function investInfoTable(result) {
	$("#investDetailList").html("<table class='layui-table' lay-skin='nob'>" +
		"<thead>" +
		"<tr>" +
		"<th>投资人</th>" +
		"<th>投资金额(元)</th>" +
		"<th>投资时间</th>" +
		"</tr>" +
		"</thead>" +
		"<tbody id='loadInvestDetail'></tbody>" +
		"</table>");

	if (result.data) {
		$("#loadInvestDetail").html("");
		var rows = result.data;
		$.each(rows, function (i, item) {
			var con = '<tr>' +
				'<td>' + item.investUser + '</td>' +
				'<td>' + MoneyUtil.formatMoney(item.investAmount.amount) + '</td>' +
				'<td>' + DateUtils.longToDateString(item.investTime) + '</td>' +
				'</tr>';
			$("#loadInvestDetail").append(con);
		});
	} else {
		$("#loadInvestDetail").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function hasRealName(userInfo) {
	if (!validateAPIUtil.validateUserHaseRealName(userInfo)) {
		layer.msg('您还没有实名认证，先到个人中心进行实名认证', {
			time: 2000 //2秒关闭
		}, function () {
			if ("GR" == userInfo.userType.code) {
				window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/personal_real_name";
			} else {
				window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/company_real_name";
			}
		});
		return true;
	}
}

function getCanUseCashSuccess(result) {
	var checked = "checked", active = "class = 'active'";
	$("#canUseCash").html("");
	$('#canUseCash').prev().text("红包").show();
	var rows = result.data;
	if (rows.length) {
		$.each(rows, function (i, item) {
			var con = '<li name="' + item.couponCashId + '">' +
				'<label>' +
				'<input type="radio"' + active + ' name="couponCash"' + checked + ' value="' + item.couponCashAmount.amount + '" />' +
				'<span class="coupon-txt">' + item.couponCashAmount.amount + '元</span>' +
				'</label>' +
				'<span class="coupon-data">有效期至' + DateUtils.longToDateStringYMD(item.couponExpireTime, '.') + '</span>' +
				'</li>';
			$("#canUseCash").append(con);
			if (i == 0) {
				checked = '';
				active = "";
			}
		});
	} else {
		$('#canUseCash').prev().text("没有可使用的红包").hide();
	}
	showCoupon("couponCash");
}

function getCanUseInterestSuccess(result) {
	var checked = "checked", active = "class = 'active'";
	$("#canUseInterest").html("");
	$('#canUseInterest').prev().text("加息券").show();
	var rows = result.data;
	if (rows.length) {
		$.each(rows, function (i, item) {
			var con = '<li name="' + item.couponInterestId + '">' +
				'<label>' +
				'<input type="radio"' + active + ' name="couponRate"' + checked + ' />' +
				'<span class="coupon-txt">' + NumberUtil.transfPercentage(item.couponInterestRate) + '</span>' +
				'</label>' +
				'<span class="coupon-data">有效期至' + DateUtils.longToDateStringYMD(item.couponExpireTime, '.') + '</span>' +
				'</li>';
			$("#canUseInterest").append(con);
			if (i == 0) {
				checked = '';
				active = "";
			}
		});
	} else {
		$('#canUseInterest').prev().text("没有可使用的加息券").hide();
	}
	showCoupon("couponRate");
}

/*展示已经选择的红包、加息券*/
function showCoupon(scene) {
	var flage = false;
	$(".coupon-row").show();
	if ($('#canUseCash li').length == 0 && $('#canUseInterest li').length == 0) {
		$(".no-use").text('暂无可用卡券');
	}
	if(scene == "couponCash"){
		$("#canUseInterest").html("");
	}

	// 展示已选卡券
	$("input[type='radio']").each(function () {
		var checkedState = $(this).attr('checked');
		if (checkedState == 'checked') {
			flage = true;
			var couponName = $(this).attr('name');
			var couponText = $(this).next().text();

			if (couponName == 'couponCash') {   //红包
				cashText = "红包" + couponText + "&emsp;";
				cashMoney = $(this).val();
				cashCouponId = $(this).parent().parent().attr('name');
			} else if (couponName == 'couponRate') {    //加息券
				rateText = "加息券" + couponText;
				interestCouponId = $(this).parent().parent().attr('name');
			}
		}
	});

	if (cashText != "" || rateText != "") {
		$(".no-use").hide();
	}
	$(".selected-coupon").html(cashText + rateText);
	if(!flage){
		$(".coupon-row").hide();
	}
}

function demandInvestSuccess(result) {
	$(".pop-invest").hide();
	$(".suc-box").show();

	var num = 10;
	investSuccessTimer = setInterval(function () {
		$('#investSuccessTimer').text(num);
		num--;
		if (num < 0) {
			clearInterval(investSuccessTimer);
			window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html";
		}
	}, 1000);
}

function currentTimeSuccess(result) {
	nowDate = result.data;
}

function cancleMask() {
	$(".mask").hide();
	$(".pop-invest").hide();
	$(".suc-box").hide();
	cashMoney = 0;
	interestCouponId = '';
	cashCouponId = '';
	cashText = '';
	rateText = '';
	$(".no-use").show();
	clearInterval(investSuccessTimer);
	$('#message').val("");
}
