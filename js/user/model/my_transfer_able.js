$(document).ready(function () {
	if ('undefined' == typeof transferInvestId) {
		window.location.href = "user_index.html#my_transfer";
		return false;
	}

	$('#my_transfer > a').addClass('active');
	$("#bankPhone").text(commonAPIUtil.initUserInfo().safeLoginAccount);

	var data = {investId: transferInvestId};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.transferAble, JSON.stringify(data));
	if(result){
		transferAbleSuccess(result);
	}

	$("#getSms").click(function () {
		var data = {
			captchaBizType: $_GLOBAL.msgType.SUBMIT_TRANSFER
		};
		var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, JSON.stringify(data));
		if (result.code == '20000') {
			layer.msg('发送成功');
			$("#captcha").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime("getSms");
			$(this).parent().next().show();
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time:2000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
			$("#captcha").focus();
		}
	});

	$("#confirmTransfer").click(function () {
		var cap = $('#captcha').val();
		if(StringUtil.isEmpty(cap)){
			layer.msg("请先获取并输入短信验证码");
			return;
		}

		var result = AjaxUtil.ajaxPost(userAccountApiUrl.transfer, DataDeal.formToJson($('#transferForm').serialize()));
		if (result.code == '20000') {
			transferSuccess(result);
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
});

function transferAbleSuccess(result) {
	var data = result.data;

	$("#investAmount").text(MoneyUtil.formatMoney(data.transferCapitalAmt.amount) + '元');
	$("#expectedProfitAmount").text(MoneyUtil.formatMoney(data.transferProceedsAmt.amount) + '元');
	$("#totalAmount").text(MoneyUtil.formatMoney(NumberUtil.add(data.transferCapitalAmt.amount, data.transferProceedsAmt.amount)) + '元');
	// $("#transferChargeAmt").text(MoneyUtil.formatMoney(data.transferChargeAmt.amount) + '元');
	$("#interestEndTime").text(DateUtils.longToDateString(data.transferExpireTime));

	$("#investId").val(data.investId);
}

function transferSuccess(result) {
	$(".right-content").load($_GLOBAL.basePath() + '/views/user/model/my_transfer_success.html');
	$(document).scrollTop(80);
}