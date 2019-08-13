var bindCard = '<a class="modify-btn company-btn" data-url="settings/company_real_name"  href="javascript:void(0);">重新认证</a>';
var uploadImg = '<a class="modify-btn company-btn" data-url="settings/company_deposit_upload"  href="javascript:void(0);">待上传资料</a>';
$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	//加载个人信息
	initUserInfo(commonAPIUtil.initUserInfo());

	// 右侧菜单点击事件
	$(".company-btn").click(function () {
		var url = $(this).attr("data-url");
		if (url) {
			window.history.pushState(null, null, $_GLOBAL.basePath() + "/views/user/user_index.html#" + url);
			$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + url + ".html");
			$("#personalSettingMenu > a").addClass("active");
			$(document).scrollTop(80);
		}
	});

	//公用加载
	$(".personal-btn").click(function () {
		$(document).scrollTop(0);
		var $_this = $(this);
		var url = $_this.attr("data-url");
		$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + url);
	});

	$("#modifyBankMobileCompany").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.modifyBankMobile);
		companyWait(result.data);
	});

	$("#modifyLoginPassCompany").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.modifyTradePass);
		companyWait(result.data);
	});

	$("#resetPayPassCompany").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.resetTradePass);
		companyWait(result.data);
	});

	$('#closeAccount').click(function () {
		var res = AjaxUtil.ajaxGet(userProfileApiUrl.closeAccount);
		if (res.data){
			location.href = $_GLOBAL.basePath() + "/wait.html?" + res.data;
		} else if (res.code == '20000') {
			layer.msg("销户成功!", {time:500}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToIndex();
			});
		} else if (res.code == "40404" || res.code == "40405") {
			CookieUtil.setSessionCookie('loginStatus', false);
		} else if (res.code == "101120") {
			$('#payFree').show();
			layer.msg(res.message);
		} else {
			layer.msg(res.message);
		}
	});

	$('#payFree').click(function () {
		AjaxUtil.ajaxGetCallBack(userProfileApiUrl.payFreeForClose, function (result) {
			if(result.data){
				location.href = $_GLOBAL.basePath() + "/wait.html?" + result.data;
			} else if(result.code == '20000'){
				layer.msg("销户成功!", {time:500}, function () {
					CookieUtil.clearAllCookie();
					$_GLOBAL.jumpToIndex();
				});
			} else {
				layer.msg("服务器错误")
			}
		})
	});
});

/**获取用户基本信息，并根据用户实名绑卡信息加载对应模块*/
function initUserInfo(userInfo) {
	//展示注册手机
	$("#loginAccount").text(userInfo.safeLoginAccount);

	//判断邮箱状态
	if(userInfo.safeEmail){
		$("#email").text(userInfo.safeEmail);
	} else {
		$("#email").parent().hide().next().show();
	}

	//判断是否实名
	if (validateAPIUtil.validateUserHaseRealName(userInfo)) {
		$("#realName").show().text(userInfo.realName).next().hide();
		$("#bandCard").show().html($_GLOBAL.formatBankCode(userInfo.bankCode) + "（" + userInfo.bankCardNo + ")").next().hide();
	} else {
		if (userInfo.openDepositStatus.code == $_GLOBAL.openDepositStatus.NON) {
			$("#realName").hide().next().show();
		} else if(userInfo.openDepositStatus.code == $_GLOBAL.openDepositStatus.FAILED){
			$("#realName").show().html(userInfo.openDepositStatus.message + bindCard).next().hide();
		} else if(userInfo.openDepositStatus.code == $_GLOBAL.openDepositStatus.AUDITING) {
			$("#realName").show().text(userInfo.openDepositStatus.message).next().hide();
		} else {
			$("#realName").show().html(uploadImg).next().hide();
		}
		$("#bandCard").parent().hide();
		$("#bankPhone").hide();
		$("#resetPayPwd").hide();
	}
}

function companyWait(data) {
	if(data){
		location.href = $_GLOBAL.basePath() + "/wait.html?" + data;
	} else {
		layer.msg("服务器错误")
	}
}