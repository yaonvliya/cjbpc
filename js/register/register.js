var registerType = 0;//注册类型（个人-0、企业-1）

var smsFlag = false;//是否已经获取了验证码

var icon = "<i class='iconfont icon-cuowu'></i> ";//表单验证错误图标

var layer;

var captchaId;

$(document).ready(function () {
	// 初始化layer
	layui.use(['layer'], function () {
		layer = layui.layer;
	});

	// 初始化表单验证
	registerFormValidate();

	// 切换个人、企业
	$(".tab-nav li").click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		registerType = $(this).index();
		$("input[name='userType']").val($(this).attr("data-name"));
	});

	// 注册弹出图片验证码窗口
	$("#getSmsCodeBtn").click(function () {
		var $mobile = $("#mobile");
		var $pwd = $("#password");
		var mobile = $mobile.val();
		var password = $pwd.val();
		if (!VerificationUtil.isMobile(mobile)) {
			layer.msg("请输入正确的手机号");
			$mobile.focus();
			return false;
		}
		if (!validateUserName(mobile)) {
			layer.msg("手机号[" + mobile + "]已被注册！");
			$mobile.focus();
			return false;
		}
		if(StringUtil.isEmpty(password)){
			layer.msg("请输入密码");
			$pwd.focus();
			return false;
		}
		if(!VerificationUtil.pwd(password)){
			layer.msg("密码必须是8-20位且为数字、字母、字符至少2种以上组合");
			$pwd.focus();
			return false;
		}

		showCaptchaBox();
	});

	// 弹出层确定事件
	$("#confirmBtn").click(function () {
		// 验证图形验证码格式是否正确
		var captchaCode = $("#captchaCode").val();
		if (captchaCode) {
			// 注册发送短信
			var data = {
				imgCode: captchaCode,
				mobile: $("#mobile").val(),
				captchaBizType: $_GLOBAL.msgType.REGISTER,
				imgCaptchaId:captchaId
			};
			var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCode, DataDeal.josnObjToString(data));
			if (result.code == '20000') {
				layer.msg('发送成功');
				hideCaptchaBox();
				smsFlag = true;
				$("#smsCode").focus();
				// 禁用个人注册“获取验证码”按钮，开始计时
				TimerUtil.setRemainTime("getSmsCodeBtn");
			} else {
				layer.msg(result.message);
				$("#captchaCode").focus();
				getCaptchaImg();
			}
		} else {
			layer.msg('请输入图片验证码！');
			$("#captchaCode").focus();
		}
	});

	// 图形验证码关闭按钮事件
	$(".suc-close").click(function () {
		hideCaptchaBox();
	});

	// 个人注册
	$("#registerFormBtn").click(function () {
		if ($("#registerForm").valid()) {
			if (smsFlag) {
				var result = AjaxUtil.ajaxPost(userProfileApiUrl.register,
					DataDeal.formToJson($('#registerForm').serialize())
				);
				if (result.code == '20000') {
//					showGiftModel(result.data);
					
					// 注册成功后，设置全局cookie(用户登录凭证)
					CookieUtil.setSessionCookie('X-Auth-Token', result.data.token);
					// 设置会话cookie(标识用户是否已经登录)
					CookieUtil.setSessionCookie('loginStatus', true);
					
					window.location.href = 'register_result.html'
					
				} else {
					layer.msg(result.message);
				}
			} else {
				layer.msg('请先获取验证码！');
			}
		}

	});
});

// 注册成功后显示体验金窗口
function showGiftModel(data) {
//	layer.msg("注册成功");
	// 注册成功后，设置全局cookie(用户登录凭证)
	CookieUtil.setSessionCookie('X-Auth-Token', data.token);
	// 设置会话cookie(标识用户是否已经登录)
	CookieUtil.setSessionCookie('loginStatus', true);
	$(".not-hide-mask").show();
	$(".popup-gift").fadeIn(150);

	AjaxUtil.ajaxGetCallBack(userCouponApiUrl.cashCouponDetail + data.couponCashId, function (result) {
		$(".cashMoney").text(result.data.couponCashAmount.amount);
		$(".leastActivateAmount").text(result.data.leastActivateAmount.amount);
	} );

	$("#afterRegister").html("<li><a href='../../index.html'>返回首页</a></li>");
}

// 用户名校验(用户是否存在)
function validateUserName(userName) {
	if (validateAPIUtil.validateUserName(userName) == true) return false; else return true;
}

// 显示图形验证码窗口
function showCaptchaBox() {
	// 初始化图形验证码
	getCaptchaImg();

	$(".popup-captcha-box").show();
	$(".mask").show();

	// 重置验证码
	$("#captchaCode").val("").focus();
}

// 隐藏图形验证码窗口
function hideCaptchaBox() {
	$(".mask").hide();
	$(".popup-captcha-box").hide();
}

// 重新获取图形验证码
function getCaptchaImg() {
	captchaId = commonAPIUtil.getCaptchaImg();
}

// 个人注册表单验证
function registerFormValidate() {
	$("#registerForm").validate({
		errorClass: "form-error-msg",
		errorElement: "span",
		rules: {
			mobile: {
				required: true,
				mobile: true
			},
			password: {
				required: true,
				pwd: true
			},
			smsCaptcha: "required",
			agree: "required"
		},
		messages: {
			mobile: {
				required: icon + "请输入手机号",
				mobile: icon + "手机号码格式错误"
			},
			password: {
				required: icon + "请输入您的密码",
				pwd: icon + "密码必须是8-20位且为数字、字母、字符至少2种以上组合"
			},
			smsCaptcha: {
				required: icon + "请输入短信验证码"
			},
			agree: {
				required: icon + "必须同意协议后才能注册"
			}
		},
		errorPlacement: function (error, element) { //错误信息位置设置方法
			if (element.attr("name") == "agree") {
				error.appendTo(element.parent().parent().parent()); //这里的element是录入数据的对象
			} else {
				error.appendTo(element.parent());
			}
		}
	});
}
