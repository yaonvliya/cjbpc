var submitUrl;
var icon = "<i class='iconfont icon-cuowu'></i> ";
$(document).ready(function () {
	submitUrl = userAccountApiUrl.quickRecharge;
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();
	rechargeFormValidate();
	// console.log(userInfo);
	if("JG" == userInfo.userType.code){
		$("#netSilverRecharge").addClass("active").removeClass('ml15').prev().remove();

		submitUrl = userAccountApiUrl.netSliverRecharge;
	}

	$("#bankCode").attr("xlink:href","#icon-" + userInfo.bankCode );
	var bankNum = userInfo.bankCardNo;
	$("#bankInfo").text($_GLOBAL.formatBankCode(userInfo.bankCode) + " 尾号（" + bankNum.substring(bankNum.length-4,bankNum.length) + "）");

	$("#quickRecharge").click(function () {
		submitUrl = userAccountApiUrl.quickRecharge;
		$(this).addClass("active").next().removeClass("active");
	});

	$("#netSilverRecharge").click(function () {
		submitUrl = userAccountApiUrl.netSliverRecharge;
		$(this).addClass("active").prev().removeClass("active");
	});

	$("#confirmRecharge").click(function () {
		var rechargeForm = $("#rechargeForm");
		if (rechargeForm.valid()) {
			AjaxUtil.ajaxPostCallBack(submitUrl, DataDeal.formToJson(rechargeForm.serialize()), function (result) {
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

function rechargeFormValidate() {
	$("#rechargeForm").validate({
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

