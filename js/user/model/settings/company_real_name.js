$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	/*AjaxUtil.ajaxGetCallBack(commonApiUrl.getBank, function (result) {
		SelectUtil.setSelectOpts(result.data, "bankCode", "code", "desc", "请选择企业开户银行")
	});*/

	companyRealNameFormValidate();

	$("#companyRealName").bind("keypress", function (e) {
		if ('13' == e.keyCode) {
			$("#realNameCompany").click();
		}
	});

	$("#realNameCompany").click(function () {
		if ($("#companyRealName").valid()) {
			var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.companyBandCard, DataDeal.formToJson($('#companyRealName').serialize()));
			if (result.data) {
				location.href = $_GLOBAL.basePath() + "/wait.html?" + result.data;
			} else {
				layer.msg("服务器错误")
			}
		}
	});

});

function companyRealNameFormValidate() {
	$("#companyRealName").validate({
		errorClass: "error",
		errorElement: "span",
		rules: {
			realName: {
				required: true
			},
			legalName: {
				required: true,
				chinese: true
			},
			legalCert: {
				required: true,
				idCard: true
			},
			businessLicense: {
				required: true
			}

			/*
			bankLicense: {
				required: true
			},
			contact: {
				required: true,
				chinese: true
			},
			contactPhone: {
				required: true,
				mobile: true
			},
			bankCode: {
				required: true
			}*/
		},
		messages: {
			realName: {
				required: icon + "请输入公司名称"
			},
			legalName: {
				required: icon + "请输入您的公司法人名字",
				chinese: icon + "请输入正确的公司法人名字"
			},
			legalCert: {
				required: icon + "请输入您的公司法人的身份证号",
				idCard: icon + "请输入正确的身份证号"
			},
			businessLicense: {
				required: icon + "请输入公司营业执照号"
			}

			/*
			bankLicense: {
				required: icon + "请输入开户银行许可证号"
			},
			contact: {
				required: icon + "请输入企业联系人",
				chinese: icon + "请输入正确的企业联系人"
			},
			contactPhone: {
				required: icon + "请输入联系方式",
				mobile: icon + "请输入正确的联系方式"
			},
			bankCode: {
				required: icon + "请选择开户银行"
			}*/
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
