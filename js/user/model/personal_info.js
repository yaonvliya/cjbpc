var unbundling = '<a class="modify-btn" id="unbindCard" href="javascript:void(0);">解绑</a>';
$(document).ready(function () {
	//加载个人信息
	initUserInfo(commonAPIUtil.initUserInfo());

// 右侧菜单点击事件
	$(".personal-btn").click(function () {
		var url = $(this).attr("data-url");
		if (url) {
			window.history.pushState(null, null, $_GLOBAL.basePath() + "/views/user/user_index.html#" + url);
			$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + url + ".html");
			$("#personalSettingMenu > a").addClass("active");
			$(document).scrollTop(80);
		}
	});

//公用加载
	$(".personal-btn").click(function(){
		$(document).scrollTop(0);
		var $_this = $(this);
		var url = $_this.attr("data-url");
		$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + url);
	});

	/**获取用户基本信息，并根据用户实名绑卡信息加载对应模块*/
	function initUserInfo(userInfo) {
		//展示注册手机
		$("#loginAccount").text(userInfo.safeLoginAccount);
		$("#checkPhone").text(userInfo.safeLoginAccount);
		//判断邮箱状态
		if(userInfo.safeEmail){
			$("#email").text(userInfo.safeEmail);
		} else {
			$("#email").parent().hide().next().show();
		}
		//判断是否实名
		if(validateAPIUtil.validateUserHaseRealName(userInfo)){
			$("#realName").show().text(userInfo.realName).next().hide();

			if(userInfo.bindCardStatus.code == '0') {
				//判断是否绑卡
				$("#resetPayPwd").hide();
				$("#bankPhone").hide();
				$("#bandCard").hide().next().show();
			} else {
				$("#bandCard").show().html($_GLOBAL.formatBankCode(userInfo.bankCode) + "（" + userInfo.bankCardNo.substring(userInfo.bankCardNo.length-4,userInfo.bankCardNo.length) + "）" + unbundling).next().hide();
			}
		} else {
			$("#realName").hide().next().show();
			$("#bandCard").parent().hide();
			$("#bankPhone").hide();
			$("#resetPayPwd").hide();
		}
	}
	
	/*$("#unbindCard").on("click", function () {
		$('.mask').show();
		$('.bind-card-box').show();
	});

	$("#unbindCardBtn").on("click", function () {
		var data = {smsCaptcha: $('#smsForUnbindCard').val()};
		AjaxUtil.ajaxPostCallBack(userProfileApiUrl.unbindCard, JSON.stringify(data), function (result) {
			if(result.data){
				window.location.reload();
			}
		});
	});*/
	$("#unbindCard").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.unbindCard);
		wait(result.data);
	});

	$("#getSmsForUnbindCard").click(function () {
		var data = {
			captchaBizType: $_GLOBAL.msgType.UNBIND_CARD
		};
		var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, DataDeal.josnObjToString(data));
		if ('20000' == result.code) {
			layer.msg('发送成功');
			$("#smsForUnbindCard").focus();
			// 禁用“获取验证码”按钮，开始计时
			TimerUtil.setRemainTime("getSmsForUnbindCard");
		} else if('40404' == result.code || '40405' == result.code){
			CookieUtil.setSessionCookie('loginStatus', false);
			window.location.href = $_GLOBAL.basePath() + "/login.html";
		} else {
			layer.msg(result.message);
		}
	});

	$('.mask').click(function () {
		$('.mask').hide();
		$('.bind-card-box').hide();
	});

	$("#bindCard").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.bindCard);
		wait(result.data);
	});

	$("#modifyBankMobile").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.modifyBankMobile);
		wait(result.data);
	});

	$("#modifyLoginPass").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.modifyTradePass);
		wait(result.data);
	});

	$("#resetPayPass").on("click", function () {
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.resetTradePass);
		wait(result.data);
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

function wait(data) {
	if(data){
		location.href = $_GLOBAL.basePath() + "/wait.html?" + data;
	} else {
		layer.msg("服务器错误")
	}
}
