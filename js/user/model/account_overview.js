var laytable;
var userOverviewAmount = {
	availableBalance: "0.00",
	totalProfit: "0.00",
	totalAssets: "0.00",
	toBeReceivedProfit: "0.00",
	frozenBalance: "0.00",
	toBeReceivedPrincipal: "0.00"
};
var timeoutFlag = null;// 延时操作计时器
var submitStatus = showAmount;// 最终提交的状态(showAmount参数在user_index页面中)
$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	// 初始化laydate
	layui.use(['table'], function () {
		laytable = layui.table;

		if (userInfo.openDepositStatus.code == '--') {
			$(".not-hide-mask").show();
			$(".popup-open").fadeIn(150);
		}
	});

	if(validateAPIUtil.validateUserHaseRealName(userInfo)){
		getUserOverview();
	} else {
		if (submitStatus == 0) {
			$(this).removeClass("icon-yanjing").addClass("icon-yanjing-guan");
			$(".money-count").text("****");
		}
	}

	// 眼睛点击事件
	$(".eye-btn").click(function () {
		if (submitStatus == 1) {
			$(this).removeClass("icon-yanjing").addClass("icon-yanjing-guan");
			$(".money-count").text("****");
			showAmount = 0;
			submitStatus = 0;
		} else {
			$(this).removeClass("icon-yanjing-guan").addClass("icon-yanjing");
			showAmount = 1;
			submitStatus = 1;

			$(".myacc").text(MoneyUtil.formatMoney(userOverviewAmount.availableBalance));// 可用余额

			$('#totalProfit').text(MoneyUtil.formatMoney(userOverviewAmount.totalProfit));//累计收益
			$('#totalAssets').text(MoneyUtil.formatMoney(userOverviewAmount.totalAssets));//总资产
			$("#toBeReceivedPrincipal").text(MoneyUtil.formatMoney(userOverviewAmount.toBeReceivedPrincipal));// 待收本金
			$("#toBeReceivedProfit").text(MoneyUtil.formatMoney(userOverviewAmount.toBeReceivedProfit));// 待收收益
			$("#frozenBalance").text(MoneyUtil.formatMoney(userOverviewAmount.frozenBalance));// 冻结金额
		}

		if (timeoutFlag != null) {
			clearTimeout(timeoutFlag);
		}
		// 设置为延时3秒后才提交
		timeoutFlag = setTimeout(function () {
			saveSetting(submitStatus);
		}, 1000);

	});

	// 小图标提示
	$(".icon-tips").mouseover(function () {
		var htm = "<span>" + $(this).attr("data-title") + "</span>";
		$(this).append(htm);

		var iconWidth = $(this).innerWidth(),
			tipsWidth = $(this).find("span").innerWidth(),
			tipsLeft = (tipsWidth - iconWidth) / 2 + 4;
		$(this).find("span").css({left: -tipsLeft})
	}).mouseout(function () {
		$(this).find("span").remove();
	});

});

// 获取个人中心首页的金额
function getUserOverview() {
	/**获取用户首页总览数据*/
	AjaxUtil.ajaxGetCallBack(userAccountApiUrl.getUserOverview, function (result) {
		var data = result.data;
		userOverviewAmount = {
			availableBalance: data.availableBalanceAmt,
			totalProfit: data.totalReceivedProceedsAmt,
			totalAssets: data.totalAssetsAmt,
			toBeReceivedProfit: data.toReceiveProceedsAmt,
			frozenBalance: data.frozenBalanceAmt,
			toBeReceivedPrincipal: data.toReceiveCapitalAmt
		};
		// 最近收益
		recentTransaction(result.data.txnList);
	});


	if (showAmount == 1) {
		$(".myacc").text(MoneyUtil.formatMoney(userOverviewAmount.availableBalance));//可用余额

		$('#totalProfit').text(MoneyUtil.formatMoney(userOverviewAmount.totalProfit));//累计收益
		$('#totalAssets').text(MoneyUtil.formatMoney(userOverviewAmount.totalAssets));//总资产
		$("#toBeReceivedProfit").text(MoneyUtil.formatMoney(userOverviewAmount.toBeReceivedProfit));// 待收收益
		$("#frozenBalance").text(MoneyUtil.formatMoney(userOverviewAmount.frozenBalance));// 冻结金额
		$("#toBeReceivedPrincipal").text(MoneyUtil.formatMoney(userOverviewAmount.toBeReceivedPrincipal));// 待收本金

	} else {
		$(".eye-btn").removeClass("icon-yanjing").addClass("icon-yanjing-guan");
		$(".money-count").text("****");
	}


}

// 账户总览下边的最近交易
function recentTransaction(list) {
	$("#accountDetail").html("");
	var total = list.length;
	if (total && total > 0) {
		$.each(list, function (i, item) {
			var con = '<tr><td>' + item.txnType + '</td><td>' + item.txnTime +
				'</td><td>' + MoneyUtil.formatMoney(item.txnAmount) + '</td><td>' + item.txnStatus + '</td></tr>';
			$("#accountDetail").append(con);
		});
	} else {
		$("#accountDetail").html('<tr class="bn"><td class="ta-c" colspan="4"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

// 用户个人设置保存
function saveSetting(status) {
	var data = {showAmount: status};
	AjaxUtil.ajaxPostCallBack(userProfileApiUrl.saveUserSetting, DataDeal.josnObjToString(data), function () {
	});
}

// 跳转到实名页面
function goRealName() {
	if (validateAPIUtil.validateUserHaseRealName(userInfo)) {
		cancelRealName();
		return false;
	}
	if ("GR" == userInfo.userType.code) {
		window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/personal_real_name";
	} else {
		window.location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#settings/company_real_name";
	}
	cancelRealName();
}

function cancelRealName() {
	$(".not-hide-mask").hide();
	$(".popup-open").fadeOut(150);
}

