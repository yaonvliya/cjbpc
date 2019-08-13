var oldSmsFlag = false, newSmsFlag = false;//是否已经获取了验证码

var operateToken;//用户身份token

var email = 1;

var captchaId;

$(document).ready(function() {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	//获取图片验证码
	getCaptchaImg();

	//显示注册的邮箱
	$("#oldAccountEmail").text(commonAPIUtil.initUserInfo().safeEmail);

	$("#nextBtn").click(function () {
		var mailCaptcha = $("#oldCaptcha").val();
		if (mailCaptcha) {
			var data;
			if(1 == email){
				data = {mailCaptcha: mailCaptcha};
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.emailAuthUser, DataDeal.josnObjToString(data), nextSuccess);
			} else {
				data = {smsCaptcha: mailCaptcha};
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.smsAuthUser, DataDeal.josnObjToString(data), nextSuccess);
			}

		} else {
			layer.msg('请先输入获取到的验证码！');
			$("#oldCaptcha").focus();
			return;
		}
	});

	$("#modifyEmailConfirm").click(function () {
		var newEmail = $("#newAccountEmail").val();
		if (!VerificationUtil.isEmail(newEmail)) {
			layer.msg("请输入正确的邮箱！");
			$("#newAccountEmail").focus();
			return;
		}

		if (newSmsFlag) {
			var smsCaptcha = $("#newCaptcha").val();
			if (smsCaptcha) {
				var data = {newEmailCaptcha: smsCaptcha, newEmail: newEmail, identityCheckToken: operateToken};
				 AjaxUtil.ajaxPostCallBack(userProfileApiUrl.modifyMail, DataDeal.josnObjToString(data), confirmSuccess);
			} else {
				layer.msg('请输入邮箱验证码！');
				$("#newCaptcha").focus();
				return;
			}
		} else {
			layer.msg('请先获取邮箱验证码！');
			$("#newCaptcha").focus();
			return;
		}
	});

	$(".getSmsForOldEmail").click(function () {
		var result, data;
		if(1 == email){
			data = {
				captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_EMAIL
			};
			result = AjaxUtil.ajaxPost(captchaApiUrl.getMailCodeBindEmail, DataDeal.josnObjToString(data));
		} else {
			data = {
				captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_MOBILE
			};
			result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, DataDeal.josnObjToString(data));
		}
		if ('20000' == result.code) {
			layer.msg('发送成功');
			oldSmsFlag = true;
			$("#oldCaptcha").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime($(this).attr("id"));
		} else if('40404' == result.code || '40405' == result.code){
			CookieUtil.setSessionCookie('loginStatus', false);
			window.location.href = $_GLOBAL.basePath() + "/login.html";
		} else {
			layer.msg(result.message);
			$("#newCaptchaCode").focus();
		}
	});

	$("#getSmsForNewEmail").click(function () {
		var newEmail = $("#newAccountEmail").val();
		if (!VerificationUtil.isEmail(newEmail)) {
			layer.msg("请输入正确的邮箱！");
			$("#newAccountEmail").focus();
			return;
		}

		// 验证身份真实性(用户是否存在)
		if (!validateEmail(newEmail)) return;

		var captchaCode = $("#newCaptchaCode").val();

		if(StringUtil.isEmpty(captchaCode)){
			layer.msg("请输入图片验证码！");
			$("#newCaptchaCode").focus();
			return;
		}
		var data = {
			captchaBizType: $_GLOBAL.msgType.MODIFY_BIND_EMAIL,
			email: newEmail,
			imgCode: captchaCode,
			imgCaptchaId:captchaId
		};
		var result = AjaxUtil.ajaxPost(captchaApiUrl.getMailCode, DataDeal.josnObjToString(data));
		if ('20000' == result.code) {
			layer.msg('发送成功');
			newSmsFlag = true;
			$("#newCaptcha").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime("getSmsForNewEmail");
		} else if('40404' == result.code || '40405' == result.code){
			CookieUtil.setSessionCookie('loginStatus', false);
			window.location.href = $_GLOBAL.basePath() + "/login.html";
		} else {
			layer.msg(result.message);
			$("#newCaptchaCode").focus();
			getCaptchaImg();
		}
	});

	$("#modifyEmailCheckMobile").click(function () {
		$('#getCaptchaForEmail').removeClass("hideI").prev().addClass("hideI");
		$("#oldAccountEmail").text(userInfo.safeLoginAccount).prev().text("当前手机号：");
		$(this).parent().hide().next().show();
		email = 0;
	});
	$("#modifyEmailCheckEmail").click(function () {
		$('#getCaptchaForSms').removeClass("hideI").next().addClass("hideI");
		$("#oldAccountEmail").text(userInfo.safeEmail).prev().text("旧的邮箱：");
		$(this).parent().hide().prev().show();
		email = 1;
	});

});

function nextSuccess(data) {
	operateToken = data.data;
	// 切换tab
	$("#oldEmail").hide();
	$("#newEmail").show();
//	$(".step-3-row").css("background-image", "url(../../img/step_three_2.png)");
//	$(".step-3-row").find("span").eq(1).addClass("active");

	$(".step-item").eq(0).addClass("pass");
	$(".step-item").addClass("active");
}

function confirmSuccess(data) {
	$(".step-3-row").css("background-image", "url(../../img/step_three_3.png)");
	$(".step-3-row").find("span").eq(2).addClass("active");
	layer.msg('注册邮箱修改成功', {
		time: 1000 //1秒关闭
	}, function () {
		// 跳转至个人中心页面
		$_GLOBAL.jumpToUserIndex();
	});
}

function validateEmail(email) {
	if (validateAPIUtil.validateEmail(email)) {
		layer.msg("邮箱[ " + email + " ]已存在，请重新输入！");
		$("#newAccountEmail").focus();
		return false;
	} else {
		return true;
	}
}

function getCaptchaImg() {
	captchaId = commonAPIUtil.getCaptchaImg();
}