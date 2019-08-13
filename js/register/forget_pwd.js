var icon = "<i class='iconfont icon-cuowu'></i> ";//表单验证错误图标

var msgFlag = false;//是否已经获取了验证码

var layer;

var userName;//用户名

var operateToken;//用户身份token

var captchaId;

$(document).ready(function () {
	// 初始化layer
	layui.use(['layer'], function () {
		layer = layui.layer;
	});

	// 初始化验证码
	getCaptchaImg();

	// 初始化表单验证
	firstStepFormValidate();
	secondStepFormValidate();

	// 获取验证码点击事件
	$("#getMsgCodeBtn").click(function () {
		userName = $("#userName").val();
		if (userName) {
			var captchaCode = $("#captchaCode").val();
			if (captchaCode) {
				// 验证身份真实性(用户是否存在)
				if (!validateUserName(userName)) return;

				sendMsg(captchaCode);
			} else {
				layer.msg("请先输入图形验证码！");
				$("#captchaCode").focus();
			}
		} else {
			layer.msg("请先输入手机号码！");
			$("#userName").focus();
		}
	});

	// 下一步，验证身份表单，切换tab
	$("#nextStepBtn").click(function () {
		if ($("#validateUserForm").valid()) {
			if (msgFlag) {
				var data = {
					mobile: userName,
					smsCaptcha: $('#msgCode').val()
				};
				var result = AjaxUtil.ajaxPost(userProfileApiUrl.smsWithOutLogAuthUser, DataDeal.josnObjToString(data));
				if (result.code == '20000') {
					operateToken = result.data;
					// 切换tab
					$(".tab-content").eq(0).hide();
					$(".tab-content").eq(1).show();
					$(".pwd-step li").eq(0).addClass("pass");
					$(".pwd-step li").eq(1).addClass("active");
					$(".pwd-step li").eq(2).addClass("active");

					$("#newPassword").focus();
				} else {
					layer.msg(result.message);
				}
			} else {
				layer.msg('请先获取动态验证码！');
			}
		}
	});

	// 确认重置密码
	$("#submitBtn").click(function () {
		if ($("#resetPwdForm").valid()) {
			var password = $("#newPassword").val();
			var data = {
				password: password,
				confirmPassword: password,
				identityCheckToken: operateToken
			};
			var result = AjaxUtil.ajaxPost(userProfileApiUrl.resetLoginPwd, DataDeal.josnObjToString(data));
			if (result.code == '20000') {
				// 显示重置密码成功提示
				$(".mask").show();
				$(".suc-box").show();
			} else if( result.code == '101007' || result.code == '101008'){
				layer.msg(result.message, {time:500}, function () {
					location.reload();
				})
			} else {
				layer.msg(result.message);
			}
		}
	});

	// 立即登陆按钮(跳转到登录页)
	$(".suc-b").click(function () {
		window.location.href = $_GLOBAL.basePath() + "/login.html";
	});
	// 关闭提示(跳转到首页)
	$(".suc-close").click(function () {
		window.location.href = $_GLOBAL.basePath() + "/index.html";
	});

});

// 重新获取图形验证码
function getCaptchaImg() {
	captchaId = commonAPIUtil.getCaptchaImg();
}

// 验证用户是否存在
function validateUserName(userName) {
	if (validateAPIUtil.validateUserName(userName) == true) {
		return true;
	} else {
		layer.msg("该手机号未注册!");
		$("#userName").focus();
		return false;
	}
}

// 发送验证码
function sendMsg(captchaCode) {
	var data = {
		imgCode: captchaCode,
		mobile: userName,
		captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_MOBILE,
		imgCaptchaId:captchaId
	};
	var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCode, DataDeal.josnObjToString(data));
	if (result) {
		if (result.code == '20000') {
			layer.msg('发送成功');
			msgFlag = true;
			$("#msgCode").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime("getMsgCodeBtn");
		} else {
			layer.msg(result.message);
			$("#captchaCode").focus();
			getCaptchaImg();
		}
	} else {
		layer.msg('网络异常');
	}
}

// 第一步表单验证
function firstStepFormValidate() {
	$("#validateUserForm").validate({
		errorClass: "form-error-msg",
		errorElement: "span",
		rules: {
			loginAccount: {
				required: true,
				mobile: true
			},
			captchaCode: "required",
			smsCaptcha: "required"
		},
		messages: {
			loginAccount: {
				required: icon + "请输入手机号",
				mobile: icon + "非法手机号码"
			},
			captchaCode: {
				required: icon + "请输入图形验证码"
			},
			smsCaptcha: {
				required: icon + "请输入动态验证码"
			}
		}
	});
}

// 第二步表单验证
function secondStepFormValidate() {
	$("#resetPwdForm").validate({
		errorClass: "form-error-msg",
		errorElement: "span",
		rules: {
			newPassword: {
				required: true,
				pwd: true
			},
			newPwdRev: {
				required: true,
				equalTo: "#newPassword"
			}
		},
		messages: {
			newPassword: {
				required: icon + "请输入您的密码",
				pwd: icon + "密码必须是8-20位且为数字、字母、字符至少2种以上组合"
			},
			newPwdRev: {
				required: icon + "请输入您的密码",
				equalTo: icon + "两次密码输入不一致"
			}
		}
	});
}