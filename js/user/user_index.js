var layer;

var icon = "<i class='iconfont icon-cuowu'></i> ";

var showAmount = 1;//是否显示金额（用户配置,默认:1-打开，0-关闭）

var userInfo;

var loginLogResult = null;
var interval;

//TODO:调试
//$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/settings/company_deposit_upload.html");

$(document).ready(function () {
	// 初始化layer
	layui.use(['layer'], function () {
		layer = layui.layer;

		//判断是否登录，未登录则跳转到登录页面
		commonAPIUtil.isLogin();

		//加载头部信息
		$("#header").load($_GLOBAL.basePath() + "/views/common/header.html");
		// 初始化加载底部
		$("#footer").load($_GLOBAL.basePath() + "/views/common/footer.html");

		// 获取用户配置
		getUserSettings();

		$(".login-log").mouseover(function(){
			$(".login-log-tablebox").fadeIn(300);
			if(!loginLogResult){
				loginLogResult = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.loginLogs);
			}
			loadLoginLogs(loginLogResult);
		}).mouseout(function(){
			$(".login-log-tablebox").hide();
			$('#loginLog').empty();
		})
	});

	// 左侧菜单点击事件
	$(".nav-item").click(function () {
		var url = $(this).attr("data-url");
		if (url) {
			window.history.pushState(null, null, $_GLOBAL.basePath() + "/views/user/user_index.html#" + url);
			$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + url + ".html");
		}
		// 聚焦
		$(".nav-item").removeClass("active");
		$(this).addClass("active");
		$(document).scrollTop(80);
	});
	// 头部功能点击事件
	$(".load-page").click(function () {
		var url = $(this).attr("data-url");
		jumppage(url);
	});

	$('.bank-page').click(function () {
		var url = $(this).attr("data-url");
		var flg;
		if(url == "withdraw"){
			flg = validateAPIUtil.validateCanWithDraw(userInfo.openDepositStatus, userInfo.bindCardStatus);
		} else {
			flg = validateAPIUtil.validateCanRecharge(userInfo.openDepositStatus, userInfo.bindCardStatus);
		}

		if(flg) {
			jumppage(url);
		} else {
			layer.msg('您还没有绑定银行卡，请到个人中心页面操作', {
				time: 1000
			}, function () {
				if(userInfo.userType.code == "GR"){
					window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#personal_info";
				} else {
					window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#company_info";
				}
			});
		}
	});

	$('#riskAssessment').click(function () {
		/*if(!validateAPIUtil.validateUserHaseRealName(userInfo)){
			layer.msg('您还没有实名认证，实名认证后才可以做风险测评！', {
				time: 1000 //2秒关闭
			}, function () {
				if("GR" == userInfo.userType.code){
					window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/personal_real_name";
				} else {
					window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/company_real_name";
				}
			});
			return;
		}*/
		if(userInfo.riskLevel){
			window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#risk_assessment_result";
		} else {
			window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#risk_assessment";
		}
		$(".nav-item").removeClass("active");
		$(this).addClass("active");
	});
});

// 绑定浏览器前进后退事件
window.onpopstate = function (event) {
	loadChildPage();
};

/**获取用户基本信息*/
function initUserInfo() {
	userInfo = commonAPIUtil.initUserInfo();
	if(validateAPIUtil.validateUserHaseRealName(userInfo)){
		$("#showLoginAccount").text(userInfo.realName);// 已实名，则展示真实姓名或公司名称
	} else {
		$("#showLoginAccount").text(userInfo.safeLoginAccount);// 未实名，则展示账号信息
	}

	$("#mobileAuth").addClass("active").attr("title", "手机号[" + userInfo.safeLoginAccount + "]已绑定");
	if(userInfo.safeEmail){
		$("#emailAuth").addClass("active").attr("title", "邮箱[" + userInfo.safeEmail + "]已绑定");
	}
	if (userInfo.userType.code == "GR") {// 个人用户
		if (validateAPIUtil.validateUserHaseRealName(userInfo)) {// 是否实名认证
			$("#realNameAuth").addClass("active").attr("title", "已实名");
		}

		$("#realNameAuth").parent().show();
		$("#personalSettingMenu").show();
	} else {// 机构用户
		if (validateAPIUtil.validateUserHaseRealName(userInfo)) {// 是否实名认证
			$("#companyAuth").addClass("active").attr("title", "企业已认证");
		}

		$("#companyAuth").parent().show();
		$("#companySettingMenu").show();
	}
	// 是否绑卡
	if (userInfo.bindCardStatus.code != "0") {
		$("#bindCardAuth").addClass("active").attr("title", "银行卡[" + userInfo.bankCardNo + "]已绑定");
	}

	if (showAmount == 1) {
		$(".myacc").text(MoneyUtil.formatMoney(commonAPIUtil.getUserBalance().availableBalance));//显示余额
	} else {
		$(".myacc").text('****');//隐藏余额
	}

	AjaxUtil.ajaxGetCallBack(userProfileApiUrl.getCouponCount, function (result) {
		$(".hd-jxq").text(result.data.interestCouponCount + ' 张');//加息券
		$(".hd-hb").text(result.data.cashCouponCount + ' 个');//红包
	});

	// 初始化加载账户总览
	loadChildPage();
}

/**获取用户个人设置*/
function getUserSettings() {
	var res = AjaxUtil.ajaxGet(userProfileApiUrl.getUserSettings);
	if (res.code == "20000") {
		showAmount = res.data || 1;

		// 初始化用户基本信息
		initUserInfo();
	} else if (res.code == "40404" || res.code == "40405") {
		// layer.msg('登录状态已失效，即将跳转到登录页');
		CookieUtil.setSessionCookie('loginStatus', false);
		window.location.href = $_GLOBAL.basePath() + "/login.html";
	}
}

/**加载右侧子页面*/
function loadChildPage() {
	var jumpUrl;
	var hashURL = window.location.hash;
	if (hashURL) {
		jumpUrl = hashURL.substring(1, hashURL.length);
	}
	if (jumpUrl) {
		$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + jumpUrl + ".html");
		// 聚焦
		$(".nav-item").each(function () {
			if (jumpUrl == $(this).attr("data-url")) {
				$(this).addClass("active");
			} else {
				$(this).removeClass("active");
			}
		});
	} else {
		$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/account_overview.html");
		$(".nav-item").removeClass("active");
		$(".nav-item").eq(0).addClass("active");
	}
}

function jumppage(url) {
	if (url) {
		window.history.pushState(null, null, $_GLOBAL.basePath() + "/views/user/user_index.html#" + url);
		$(".right-content").load($_GLOBAL.basePath() + "/views/user/model/" + url + ".html");
		// 聚焦
		$(".nav-item").each(function () {
			if (url == $(this).attr("data-url")) {
				$(this).addClass("active");
			} else {
				$(this).removeClass("active");
			}
		});
	}
}

function loadLoginLogs(result) {
	if(result){
		loginLogResult = result;
		$.each(result.rows, function (i, item) {
			var con = ' <tr><td>' + item.loginIp + '</td><td>' + DateUtils.longToDateString(item.loginTime) + '</td></tr>';
			$("#loginLog").append(con);
		});
		window.clearInterval(interval);
		interval = setTimeout(function () {
			loginLogResult = null;
		}, 3000);
	}
}

function goBack() {
	window.history.back();
}