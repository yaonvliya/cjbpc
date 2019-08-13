var laydate, laytable, laypage;
var pageSize = 10; // 每页显示的条数

var listTotal, investIndex = 0, jumpPageNum = 1;
var investId;

$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	// 初始化laydate
	layui.use(['laydate', 'table', 'laypage', 'layer'], function () {
		laydate = layui.laydate
			, laytable = layui.table
			, laypage = layui.laypage
			, layer = layui.layer;

		var json = CookieUtil.getCookie("MY_INVEST");
		CookieUtil.deleteCookie("MY_INVEST");
		if(json){
			json = JSON.parse(json);
			$(".common-navbar").find(".tab").eq(json.index).addClass("active").siblings().removeClass("active");
			pageInfo(json.index,json.pageNum);
			jumpPageNum = json.pageNum;
		} else {
			waitForProfit(1);
		}
		if (listTotal > 0) {
			initPaging(listTotal, jumpPageNum);
		}
	});

	$(".common-navbar .tab").click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		var index = $(this).index(".tab");
		pageInfo(index, 1);
		if (listTotal > 0) {
			initPaging(listTotal);
		} else {
			$("#investLaypageBox").html("")
		}

	});

	$('#table').on("click", ".preview", function () {
		investId = $(this).parent().parent().attr("name");
		location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#my_invest_detail";
		remindInfo();
	}).on("click", ".detail", function () {
		location.href = $(this).attr("data-href");
		remindInfo();
	});

});

// 加载分页插件
function initPaging(total, pageNum) {
	laypage.render({
		elem: 'investLaypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, layout: ['prev', 'page', 'next', 'count']
		, theme: '#078eee'
		, curr: pageNum
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				jumpPageNum = obj.curr;
				// $(document).scrollTop(350);
				if (investIndex == 0) {
					waitForProfit(obj.curr);
				} else if (investIndex == 1) {
					investing(obj.curr);
				} else if (investIndex == 2) {
					investBack(obj.curr);
				}
			}
		}
	});
}

function pageInfo(index, pageNum) {
	investIndex = index;
	jumpPageNum = 1;
	switch (index) {
		case 0:
			waitForProfit(pageNum); // 持有中
			break;
		case 1:
			investing(pageNum); // 已回款
			break;
		case 2:
			investBack(pageNum); // 已流标
			break;
		default :
			waitForProfit(1);
	}
}

function remindInfo() {
	var json = {index:investIndex,pageNum:jumpPageNum};
	CookieUtil.setCookie("MY_INVEST", JSON.stringify(json));
}

function waitForProfit(index) {
	var con = '<tr><th>项目名称</th><th>历史年化收益率</th><th>投资期限</th><th>投资金额(元)</th><th>投资时间</th><th>状态</th>' +
		'<th>操作</th></tr>';
	$("#investThead").html("").append(con);

	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.accountInvestPending, DataDeal.josnObjToString(data));
	if (result) {
		waitForProfitSuccess(result);
	}
}

function waitForProfitSuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#investTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.investId + '"><td><a class="modify-btn detail" href="javascript:void(0);" ' +
				'data-href="../invest/invest_detail.html?tradeId=' + item.tradeId + '">' + item.tradeName + '</a></td><td>' +
				NumberUtil.transfPercentage(item.tradeInterestRate) + '</td><td>' + item.investTerm + '</td><td>' +
				MoneyUtil.formatMoney(item.investAmount.amount) + '</td><td>' + DateUtils.longToDateString(item.investTime) + '</td><td>' +
				item.investStatus + '</td><td>' + '' + '<a class="modify-btn preview"  href="javascript:void(0);">详情</a></td></tr>';
			$("#investTbody").append(con);
		});

	} else {
		$("#investTbody").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function investing(index) {
	var con = '<tr><th>项目名称</th><th>历史年化收益率</th><th>投资期限</th><th>回款方式</th><th>回款本金(元)</th><th>获得收益(元)</th><th>操作</th></tr>';
	$("#investThead").html("").append(con);
	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.accountInvesting, DataDeal.josnObjToString(data));
	if (result) {
		investingSuccess(result);
	}
}

function investingSuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#investTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.investId + '"><td><a class="modify-btn detail" href="javascript:void(0);" ' +
				'data-href="../invest/invest_detail.html?tradeId=' + item.tradeId + '">' + item.tradeName + '</a></td><td>' +
				NumberUtil.transfPercentage(item.tradeInterestRate) + '</td><td>' + item.investTerm + '</td><td>' +
				item.repayMethod + '</td>' + '<td>' + MoneyUtil.formatMoney(item.investAmount.amount) + '</td><td>' +
				MoneyUtil.formatMoney(item.actualProceedsAmount.amount) + '</td>' +
				'<td><a class="modify-btn preview"  href="javascript:void(0);">详情</a></td></tr>';
			$("#investTbody").append(con);
		});

	} else {
		$("#investTbody").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function investBack(index) {
	var con = '<tr><th>项目名称</th><th>历史年化收益率</th><th>投资期限</th><th>投资金额(元)</th><th>流标时间</th><th>操作</th></tr>';
	$("#investThead").html("").append(con);
	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.accountInvestBack, DataDeal.josnObjToString(data));
	if (result) {
		investBackSuccess(result);
	}
}

function investBackSuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#investTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.investId + '"><td><a class="modify-btn detail" href="javascript:void(0);" ' +
				'data-href="../invest/invest_detail.html?tradeId=' + item.tradeId + '">' + item.tradeName + '</a></td><td>' +
				NumberUtil.transfPercentage(item.tradeInterestRate) + '</td><td>' + item.investTerm + '</td><td>' +
				MoneyUtil.formatMoney(item.investAmount.amount) + '</td><td>' + DateUtils.longToDateString(item.abortTime) + '</td><td>' +
				'<a class="modify-btn preview"  href="javascript:void(0);">详情</a></td></tr>';
			$("#investTbody").append(con);
		});

	} else {
		$("#investTbody").html('<tr class="bn"><td class="ta-c" colspan="6"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function showCalendarView() {
	location.href = $_GLOBAL.basePath() + "/views/user/user_index.html#repay_plan_calendar";
}