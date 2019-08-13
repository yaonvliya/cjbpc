var oldSmsFlag = false, newSmsFlag = false;//是否已经获取了验证码
var userInfo;

var operateToken;//用户身份token

var captchaId;

$(document).ready(function() {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	userInfo = commonAPIUtil.initUserInfo();
	$("#checkPhone").text(userInfo.safeLoginAccount);

	getCaptchaImg();

	$("#next-btn").click(function () {
		var smsCaptcha = $("#bindEmailCaptcha").val();
		if (smsCaptcha) {
			var data = {smsCaptcha: smsCaptcha};
			AjaxUtil.ajaxPostCallBack(userProfileApiUrl.smsAuthUser, DataDeal.josnObjToString(data), nextSuccess);
		} else {
			layer.msg('请输入短信验证码！');
			$("#bindEmailCaptcha").focus();
			return;
		}
	});

	$("#bindEmail").click(function () {
		var email = $("#email").val();
		if (!VerificationUtil.isEmail(email)) {
			layer.msg("请输入正确的邮箱号码！");
			$("#email").focus();
			return;
		}
		if (newSmsFlag) {
			var smsCaptcha = $("#newCaptcha").val();
			if (smsCaptcha) {
				var data = {emailCaptcha: smsCaptcha, email: email, identityCheckToken: operateToken};
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.bindEmail, DataDeal.josnObjToString(data), confirmSuccess);
			} else {
				layer.msg('请输入验证码！');
				$("#newCaptcha").focus();
				return;
			}
		} else {
			layer.msg('请先获取验证码！');
			$("#newCaptchaCode").focus();
			return;
		}
	});




	$("#getSmsForBindEmail").click(function () {
		var data = {
			captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_MOBILE
		};
		var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, DataDeal.josnObjToString(data));
		if ('20000' == result.code) {
			layer.msg('发送成功');
			oldSmsFlag = true;
			$("#bindEmailCaptcha").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime("getSmsForBindEmail");
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time:2000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
			$("#oldCaptchaCode").focus();
		}
	});

	$("#getSmsForNewMobile").click(function () {
		var captchaCode = $("#newCaptchaCode").val();
		var email = $("#email").val();
		if (!VerificationUtil.isEmail(email)) {
			layer.msg("请输入正确的手机号码！");
			$("#email").focus();
			return;
		}

		// 验证身份真实性(用户是否存在)
		if (!validateEmail(email)) return;

		if (captchaCode) {
			var data = {
				imgCode: captchaCode,
				captchaBizType: $_GLOBAL.msgType.BIND_EMAIL,
				imgCaptchaId:captchaId,
				email: email
			};
			var result = AjaxUtil.ajaxPost(captchaApiUrl.getMailCode, DataDeal.josnObjToString(data));
			if ('20000' == result.code) {
				layer.msg('发送成功');
				newSmsFlag = true;
				$("#newCaptcha").focus();
				// 禁用“获取验证码”按钮，开始计时
				TimerUtil.setRemainTime("getSmsForNewMobile");
			} else if (result.code == "40404" || result.code == "40405") {
				layer.msg('由于您长时间未操作，请重新登录。', {time:2000}, function () {
					CookieUtil.clearAllCookie();
					$_GLOBAL.jumpToLogin();
				});
			} else {
				layer.msg(result.message);
				$("#newCaptchaCode").focus();
				getCaptchaImg();
			}

		} else {
			layer.msg("请先输入图形验证码！");
			$("#newCaptchaCode").focus();
			return;
		}
	});

});

// 重新获取图形验证码
function getCaptchaImg() {
	captchaId = commonAPIUtil.getCaptchaImg();
}

function nextSuccess(data) {
	operateToken = data.data;
	// 切换tab
	$("#bindEmailCheckPhone").hide();
	$("#emailForm").show();
	$(".step-item").addClass("active").eq(0).addClass("pass");
}

function confirmSuccess(data) {
	$(".step-3-row").css("background-image", "url(../../img/step_three_3.png)").find("span").eq(2).addClass("active");
	layer.msg('绑定邮箱成功！', {
		time: 1000 //1秒关闭
	}, function () {
		// 跳转至个人中心页面
		$_GLOBAL.jumpToUserIndex();
	});
}

function validateEmail(email) {
	if (validateAPIUtil.validateEmail(email)) {
		layer.msg("邮箱[ " + email + " ]已存在，请重新输入！");
		$("#email").focus();
		return false;
	} else {
		return true;
	}
}