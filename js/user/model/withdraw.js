$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();
	withDrawFormValidate();

	if(userInfo){
		$("#bankCode").attr("xlink:href","#icon-" + userInfo.bankCode );
		var bankNum = userInfo.bankCardNo;
		$("#bankInfo").text($_GLOBAL.formatBankCode(userInfo.bankCode) + " 尾号（" + bankNum.substring(bankNum.length-4,bankNum.length) + "）");
	}

	$("#confirmWithDraw").click(function () {
		var withDrawForm = $("#withDrawForm");
		if (withDrawForm.valid()) {
			AjaxUtil.ajaxPostCallBack(userAccountApiUrl.withdraw, DataDeal.formToJson(withDrawForm.serialize()), function (result) {
				if(result.data){
					CookieUtil.deleteCookie('accountAmount');
					location.href = $_GLOBAL.basePath() + "/wait.html?" + result.data;
				} else {
					layer.msg("服务器错误")
				}
			});
		}
	});
});

function withDrawFormValidate() {
	$("#withDrawForm").validate({
		errorClass: "error",
		errorElement: "span",
		rules: {
			amount: {
				required: true,
				money: true
			}
		},
		messages: {
			amount: {
				required: icon + "请输入提现金额",
				money: icon + "请输入合法的金额"
			}
		},
		errorPlacement: function (error, element) { //错误信息位置设置方法
			error.appendTo(element.parent());
		}
	});
}
