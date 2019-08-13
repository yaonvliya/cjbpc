var userInfo, transferId, availableBalance, transferAmount;
var tradeId; //原标的ID
var loginStatus; //登录状态
var serverCurrentTime; //服务端时间
var transferSuccessTimer, transferMsgTimer; //投资成功定时器    获取验证码定时器
$(document).ready(function () {
	// 初始化laydate
	layui.use(['laypage', 'table', 'layer'], function () {
		laypage = layui.laypage
			, laytable = layui.table
			, layer = layui.layer;

		CookieUtil.deleteCookie("TO_INVEST");
		CookieUtil.deleteCookie("baoFu-callBack-URL");
		//获取服务端时间
		AjaxUtil.ajaxGetCallBack(commonApiUrl.serverCurrentTime, currentTimeSuccess);

		//加载标的信息
		var url = window.location.search;
		transferId = url.split('=')[1];
		AjaxUtil.ajaxPostCallBack(investApiUrl.transferDetail, JSON.stringify({transferId: transferId}), transferDetailSuccess);

		// 获取用户信息
		userInfo = commonAPIUtil.initUserInfoUnbindJump();

		//获取用户登录状态
		loginStatus = CookieUtil.getCookie('loginStatus');
		if ("true" == loginStatus) {
			//加载用户可用余额
			if (validateAPIUtil.validateUserHaseRealName(userInfo)) {
				availableBalance = MoneyUtil.formatMoney(commonAPIUtil.getUserBalance().availableBalance);

				$(".canUseMoney").html(availableBalance + '&nbsp;&nbsp;&nbsp;&nbsp;<button class="recharge">充值</button>');
				$("#canUseMoney").text(availableBalance);
				$("#loginAccount").text(userInfo.safeLoginAccount);
			} else {
				$(".canUseMoney").html('<button class="openAccount">去实名认证</button>');
			}
		} else {
			$(".canUseMoney").html('<button class="login_btn">登录后可见</button>');
		}
	});

	$("#header").load("../common/header.html");
	$("#footer").load("../common/footer.html");

	$("#transferRightAwayInvestment").click(function () {
		if ("true" == loginStatus) {
			if (!userInfo.riskLevel) {
				layer.msg("风险评测之后才可以进行投资，即将到个人中心进行风险测评。", {time: 3000}, function () {
					window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#risk_assessment";
				});
				return;
			}

			if (hasRealName(userInfo)) {
				return;
			}

			AjaxUtil.ajaxGetCallBack(userAccountApiUrl.getBalance, getavailableBalance);

			//判断账户余额是否大于输入的金额
			if (NumberUtil.sub(availableBalance, transferAmount) < 0) {
				layer.msg("账户余额不足，请先充值!");
				return;
			}

			if (!CheckBoxUtil.isChecked("transferAgreement")) {
				layer.msg("请阅读并勾选协议");
				return;
			}

			var limitMoney = $_GLOBAL.riskLevelLimitAmount(userInfo.riskLevel);
			var invertingMoney = commonAPIUtil.getUserInvestingMoney();

			if (NumberUtil.checkPlusNum(limitMoney) && NumberUtil.add(invertingMoney, transferAmount) > limitMoney) {
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

	$("#getTransferMsg").click(function () {
		var data = {
			captchaBizType: $_GLOBAL.msgType.PURCHASE_TRANSFER
		};
		var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, DataDeal.josnObjToString(data));

		if (result.code == '20000') {
			layer.msg('发送成功');
			$("#message").focus();
			// 禁用“获取验证码”按钮，开始计时
			transferMsgTimer = TimerUtil.setRemainTime("getTransferMsg");
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

	$("#confirmInvest").click(function () {
		var captcha = $("#message");
		if (captcha.val()) {
			var data = {transferId: transferId, smsCaptcha: captcha.val()};
			var result = AjaxUtil.ajaxPost(investApiUrl.transferInvest, JSON.stringify(data));
			window.clearInterval(transferMsgTimer);
			if (result.code == '20000') {
				confirmInvestSuccess(result);
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
		} else {
			layer.msg("请输入获取的验证码!");
			captcha.focus();
		}
	});

	$(".canUseMoney").on("click", ".login_btn", function () {
		CookieUtil.setCookie("TO_INVEST", location.href);
		window.location.href = $_GLOBAL.basePath() + "/login.html#detail";
	}).on("click", ".openAccount", function () {
		layer.msg('请到个人中心实名认证', {
			time: 2000 //2秒关闭
		}, function () {
			if ("GR" == userInfo.userType.code) {
				window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/personal_real_name";
			} else {
				window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/company_real_name";
			}
		});
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
			/*case 2:
				AjaxUtil.ajaxPostCallBack(investApiUrl.safeguard, JSON.stringify({demandId: tradeId}), safeguardSuccess);
				break;
			case 3:
				AjaxUtil.ajaxPostCallBack(investApiUrl.pointDanger, JSON.stringify({demandId: tradeId}), pointDangerSuccess);
				break;*/
		}
	});

	$(".modify-type").focus(function () {
		$(this).attr("type", "password");
	});
});

function login() {
	layer.msg('您还没有登录，请先登录', {
		time: 1000 //1秒关闭
	}, function () {
		CookieUtil.setCookie("TO_INVEST", location.href);
		window.location.href = $_GLOBAL.basePath() + "/login.html#detail";
	});
}

function transferDetailSuccess(result) {
	var data = result.data;
	var table = $('.transfer-project-info-item');
	layui.each(data, function (k, v) {
		var selector = '[class="' + k + '"]';
		var elt = table.find(selector);
		if (!v) {
			v = "---"
		}

		if (typeof (v) == 'string') {
			elt.text("" + v);
		} else if (typeof (v) == 'object') {
			elt.text(MoneyUtil.formatMoney(v.amount) + "元");
		} else if (typeof (v) == 'number') {
			elt.text(DateUtils.longToDateString(v));
		}
	});
	transferAmount = data.transferActualAmt.amount;
	tradeId = data.tradeId;

	$(".tradeInterestRate").text(NumberUtil.transfPercentage(data.tradeInterestRate));
	$(".remainInvestDays").text(data.remainInvestDays + "天");
	table.find('[class="tradeRepayMethod"]').text(data.tradeRepayMethod.message);
	$("#loanPurpose").text(data.tradeLoanPurpose);
	$("#repayMethod").text(data.tradeRepayMethod.message);
	$("#nextRepayTime").text(data.nextRepayDate);
	$(".transferAmount").text(MoneyUtil.formatMoney(data.transferActualAmt.amount));
	$("#transferAmount").text(MoneyUtil.formatMoney(data.transferActualAmt.amount) + "元");
	$(".expectedInterestAmount").text(MoneyUtil.formatMoney(data.remainProceedsAmt.amount));
	$(".tradeName").text(data.tradeName);
	$("#CnyMoney").text(MoneyUtil.moneyToCny(data.transferActualAmt.amount));
}

function getavailableBalance(result) {
	availableBalance = result.data.availableBalanceAmt;
}

function confirmInvestSuccess(result) {
	$(".pop-invest").hide();
	$(".suc-box").show();

	var num = 10;
	transferSuccessTimer = setInterval(function () {
		$('#investSuccessTimer').text(num);
		num--;
		if (num < 0) {
			clearInterval(transferSuccessTimer);
			window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html";
		}
	}, 1000);
}

function loanDetail() {
	var result = AjaxUtil.ajaxPostWithLoading(investApiUrl.loanDetail, JSON.stringify({tradeId: tradeId}));
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

function safeguardSuccess(result) {
	$("#safeguard").html(result.data);
}

function pointDangerSuccess(result) {
	$("#pointDanger").html(result.data);
}

function currentTimeSuccess(result) {
	serverCurrentTime = result.data;
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

function cancleMask() {
	$(".mask").hide();
	$(".pop-invest").hide();
	$(".suc-box").hide();
	$('#message').val('');
	clearInterval(transferSuccessTimer);
}