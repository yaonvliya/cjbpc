$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	personalRealNameFormValidate();

	$("#personalRealName").bind("keypress", function (e) {
		if('13' == e.keyCode){
			$("#realNamePerBtn").click();
		}
	});

	$("#realNamePerBtn").click(function () {
		if ($("#personalRealName").valid()) {
			var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.personalBandCard, DataDeal.formToJson($('#personalRealName').serialize()));
			if(result.data){
				location.href = $_GLOBAL.basePath() + "/wait.html?" + result.data;
			} else {
				layer.msg("服务器错误")
			}
		}
	});

});

function personalRealNameFormValidate() {
	$("#personalRealName").validate({
		errorClass: "error",
		errorElement: "span",
		rules: {
			realName: {
				required: true,
				chinese: true
			},
			cert: {
				required: true,
				idCard: true
			},
			agreement: {
				required: false
			}
		},
		messages: {
			realName: {
				required: icon + "请输入您的真实姓名",
				chinese: icon + "姓名必须是中文"
			},
			cert: {
				required: icon + "请输入您的身份证号",
				idCard: icon + "请输入您的身份证号"
			},
			agreement: {
				required: icon + "必须阅读并同意协议后才能实名认证"
			}
		},
		errorPlacement: function (error, element) { //错误信息位置设置方法
			if ("agreement" == element.attr("name")) {
				error.appendTo(element.parent().parent()); //这里的element是录入数据的对象
			} else {
				error.appendTo(element.parent());
			}
		}
	});
}
