var oldSmsFlag = false, newSmsFlag = false;//是否已经获取了验证码
var userInfo;

var operateToken;//用户身份token

var mobile = 1;

var captchaId;

$(document).ready(function() {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	userInfo = commonAPIUtil.initUserInfo();
	$("#oldRegisterPhone").text(userInfo.safeLoginAccount);

	getCaptchaImg();

	$("#next-btn").click(function () {
		var data;
		var smsCaptcha = $("#oldCaptcha").val();
		if (smsCaptcha) {
			if(1 == mobile){
				data = {smsCaptcha: smsCaptcha};
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.smsAuthUser, DataDeal.josnObjToString(data), nextSuccess);
			} else {
				data = {mailCaptcha: smsCaptcha};
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.emailAuthUser, DataDeal.josnObjToString(data), nextSuccess);
			}
		} else {
			layer.msg('请输入短信验证码！');
			$("#oldCaptcha").focus();
			return;
		}
	});

	$("#modifyRegisterPhoneConfirm").click(function () {
		var newPhone = $("#newRegisterPhone").val();
		if (!VerificationUtil.isMobile(newPhone)) {
			layer.msg("请输入正确的手机号码！");
			$("#newRegisterPhone").focus();
			return;
		}
		if (newSmsFlag) {
			var smsCaptcha = $("#newCaptcha").val();
			if (smsCaptcha) {
				var data = {
					smsCaptcha: smsCaptcha,
					mobile: newPhone,
					identityCheckToken: operateToken
				};
				AjaxUtil.ajaxPostCallBack(userProfileApiUrl.modifyPhone, DataDeal.josnObjToString(data), confirmSuccess);
			} else {
				layer.msg('请输入短信验证码！');
				$("#newCaptcha").focus();
				return;
			}
		} else {
			layer.msg('请先获取验证码！');
			$("#newCaptchaCode").focus();
			return;
		}
	});
	
	$("#modifyMobileCheckEmail").click(function () {
		if(userInfo.safeEmail){
			$(this).parent().hide().next().show();
			$('#getEmailCaptcha').removeClass("hideI").prev().addClass("hideI");
			$("#oldRegisterPhone").text(userInfo.safeEmail).prev().text("当前邮箱：");
			mobile = 0;
		} else {
			layer.msg("您还未绑定邮箱！")
		}
	});

	$("#modifyMobileCheckMobile").click(function () {
		$('#getSmsCaptcha').removeClass("hideI").next().addClass("hideI");
		$(this).parent().hide().prev().show();
		$("#oldRegisterPhone").text(userInfo.safeLoginAccount).prev().text("当前手机号：");
		mobile = 1;
	});



	$(".getSmsForOldMobile").click(function () {
		var result;
		if(1 == mobile){
			var data = {
				captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_MOBILE
			};
			result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, DataDeal.josnObjToString(data));
		} else {
			var data = {
				captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_EMAIL
			};
			result = AjaxUtil.ajaxPost(captchaApiUrl.getMailCodeBindEmail, DataDeal.josnObjToString(data));
		}
		if ('20000' == result.code) {
			layer.msg('发送成功');
			oldSmsFlag = true;
			$("#oldCaptcha").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime($(this).attr("id"));
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
		var newPhone = $("#newRegisterPhone").val();
		if (!VerificationUtil.isMobile(newPhone)) {
			layer.msg("请输入正确的手机号码！");
			$("#newRegisterPhone").focus();
			return;
		}

		// 验证身份真实性(用户是否存在)
		if (!validateUserName(newPhone)) return;

		if (captchaCode) {
			var data = {
				imgCode: captchaCode,
				captchaBizType: $_GLOBAL.msgType.MODIFY_LOGIN_MOBILE,
				imgCaptchaId:captchaId,
				mobile: newPhone
			};
			var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCode, DataDeal.josnObjToString(data));
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
	$("#oldPhone").hide();
	$("#newPhone").show();
//	$(".step-3-row").css("background-image", "url(../../img/step_three_2.png)");
//	$(".step-3-row").find("span").eq(1).addClass("active");
	
	$(".step-item").eq(0).addClass("pass");
	$(".step-item").addClass("active");
}

function confirmSuccess(data) {
	$(".step-3-row").css("background-image", "url(../../img/step_three_3.png)");
	$(".step-3-row").find("span").eq(2).addClass("active");
	layer.msg('注册手机修改成功', {
		time: 1000 //1秒关闭
	}, function () {
		//清除所有cookie
		CookieUtil.clearAllCookie();
		// 跳转至首页
		$_GLOBAL.jumpToLogin();
	});
}

function validateUserName(userName) {
	if (validateAPIUtil.validateUserName(userName)) {
		layer.msg("手机号码[" + userName + "]已存在，请重新输入！");
		$("#userName").focus();
		return false;
	} else {
		return true;
	}
}