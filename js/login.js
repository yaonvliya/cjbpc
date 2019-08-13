var source = 0;
$(document).ready(function () {
	var url = window.location.href;
	if (StringUtil.isContains(url, "detail", false)) {
		source = 1;
	}
	// 初始化表单验证规则
	formValidate();

	$("#password").focus(function () {
		$(this).attr("type", "password");
	});

	//绑定回车事件
	$('#loginForm').bind("keypress", function (e) {
		if (e.keyCode == "13") {
			$("#loginBtn").click();
		}
	});

	$("#loginBtn").click(function () {
		if ($("#loginForm").valid()) {
			var result = AjaxUtil.ajaxPostWithLoading(
				userProfileApiUrl.login,
				DataDeal.formToJson($('#loginForm').serialize())
			);
			if (result) {
				// 登录成功后，设置全局cookie(用户登录凭证)
				CookieUtil.setSessionCookie('X-Auth-Token', result.data);
				// 设置会话cookie(标识用户是否已经登录)
				CookieUtil.setSessionCookie('loginStatus', true);
				layer.msg('登录成功', {
					time: 1000 //1秒关闭
				}, function () {
					// 跳转至首页
					if (source == 1) {
						var url = CookieUtil.getCookie("TO_INVEST");
						CookieUtil.deleteCookie("TO_INVEST");
						window.location.href = url;
					} else {
						$_GLOBAL.jumpToIndex();
					}
				});
			}
		}
	});
});

function formValidate() {
	var icon = "<i class='iconfont icon-cuowu'></i> ";
	$("#loginForm").validate({
		errorClass: "form-error-msg",
		errorElement: "span",
		rules: {
			mobile: {
				required: true,
				mobile: true
			},
			password: {
				required: true
			}
		},
		messages: {
			mobile: {
				required: icon + "请输入您的用户名",
				mobile: icon + "用户名格式错误"
			},
			password: {
				required: icon + "请输入您的密码"
			}
		}
	});
}