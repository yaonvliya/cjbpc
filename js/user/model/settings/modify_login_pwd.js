$(document).ready(function() {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	//校验表单
	modifyLoginpwdFormValidate();

	//绑定回车事件
	$(document).keydown(function () {
		if ('13' == event.keyCode) {//keyCode=13是回车键
			$("#confirmModifyLoginpwd").click();
		}
	});

	$("#confirmModifyLoginpwd").click(function () {
		if ($("#modifyLoginpwd").valid()) {
			var data = DataDeal.formToJson($('#modifyLoginpwd').serialize());
			AjaxUtil.ajaxPostCallBack(userProfileApiUrl.modifyLoginPwd, data, modifyPWDSuccess);
		}
	});

	$(".modify-type").focus(function () {
		$(this).attr("type", "password");
	});
});

function modifyLoginpwdFormValidate() {
	$("#modifyLoginpwd").validate({
		errorClass: "error",
		errorElement: "span",
		rules: {
			oldPass: {
				required: true,
				pwd: true
			},
			newPass: {
				required: true,
				pwd: true,
				notEqualTo:"#oldPassword"
			},
			confirmNewPass: {
				required: true,
				pwd: true,
				equalTo:"#newPassword"
			}
		},
		messages: {
			oldPass: {
				required: icon + "请输入旧的密码",
				pwd: icon + "密码必须是8-20位且为数字、字母、字符至少2种以上组合"
			},
			newPass: {
				required: icon + "请输入新的密码",
				pwd: icon + "密码必须是8-20位且为数字、字母、字符至少2种以上组合",
				notEqualTo: icon + "新密码跟旧密码一致"
			},
			confirmNewPass: {
				required: icon + "请再次输入新的密码",
				pwd: icon + "密码必须是8-20位且为数字、字母、字符至少2种以上组合",
				equalTo: icon + "两次密码必须一致"
			}

		}
	});
}

function modifyPWDSuccess(result) {
	layer.msg('修改密码成功', {
		time: 1000 //1秒关闭
	}, function () {
		//清除所有cookie
		CookieUtil.clearAllCookie();
		// 跳转至首页
		$_GLOBAL.jumpToLogin();
	});
}