var laydate, laytable, laypage;
var pageSize = 10, jumpPageNum = 1; // 每页显示的条数

var listTotal, transferIndex = 0;//总条数
var transferInvestId, transferId;

$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	// 初始化laydate
	layui.use(['laydate', 'table', 'laypage', 'layer'], function () {
		laydate = layui.laydate
			, laytable = layui.table
			, laypage = layui.laypage
			, layer = layui.layer;

		var json = CookieUtil.getCookie("MY_TRANSFER");
		CookieUtil.deleteCookie("MY_TRANSFER");
		if(json){
			json = JSON.parse(json);
			$(".common-navbar").find(".tab").eq(json.index).addClass("active").siblings().removeClass("active");
			pageInfo(json.index,json.pageNum);
			jumpPageNum = json.pageNum;
		} else {
			canTransfer(1);
		}

		canLoadPage(listTotal, jumpPageNum);
	});

	$(".common-navbar .tab").click(function () {
		$(this).addClass("active").siblings().removeClass("active");
		var index = $(this).index(".tab");
		pageInfo(index, 1);

		canLoadPage(listTotal, 1);
	});

	$("#transferTbody").on("click", ".transfer-back", function () {
		transferId = $(this).parent().parent().attr("name");
		layer.open({
			icon: 3,
			title: '温馨提示',
			content: '是否确认取消转让',
			shadeClose: true,
			anim: 0,
			yes: function (index, layero) {
				var data = {transferId: transferId};
				AjaxUtil.ajaxPostCallBack(userAccountApiUrl.transferCancel, DataDeal.josnObjToString(data), transferCancelSuccess);
				layer.close(index);
			}
		});
	}).on("click", ".to-transfer", function () {
		window.history.pushState(null, null, $_GLOBAL.basePath() + "/views/user/user_index.html#my_transfer_able");
		$(".right-content").load($_GLOBAL.basePath() + '/views/user/model/my_transfer_able.html');
		// $(document).scrollTop(80);
		transferInvestId = $(this).parent().attr('class');
		remindInfo();
	}).on('click', '.detail', function () {
		transferId = $(this).parent().parent().attr('name');
		var url = $(this).attr('data-url');
		window.history.pushState(null, null, $_GLOBAL.basePath() + "/views/user/user_index.html#" + url);
		$(".right-content").load($_GLOBAL.basePath() + '/views/user/model/' + url + '.html');
		remindInfo();
	});

});

function canLoadPage(total, index) {
	if (total > 0) {
		initPaging(listTotal, index);
	} else {
		$("#myTransferLaypageBox").html("");
	}
}

// 加载分页插件
function initPaging(total, index) {
	laypage.render({
		elem: 'myTransferLaypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, layout: ['prev', 'page', 'next', 'count']
		, theme: '#078eee'
		, curr: index
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				jumpPageNum = obj.curr;
				// $(document).scrollTop(350);
				if (transferIndex == 0) {
					canTransfer(obj.curr);
				} else if (transferIndex == 1) {
					transferring(obj.curr);
				} else if (transferIndex == 2) {
					transferred(obj.curr);
				} else if (transferIndex == 2) {
					buy(obj.curr);
				}
			}
		}
	});
}

function remindInfo() {
	var json = {index:transferIndex,pageNum:jumpPageNum};
	CookieUtil.setCookie("MY_TRANSFER", JSON.stringify(json));
}

function pageInfo(index, pageNum) {
	transferIndex = index;
	jumpPageNum = 1;
	switch (index) {
		case 0:
			canTransfer(pageNum); // 可转让
			break;
		case 1:
			transferring(pageNum); // 转让中
			break;
		case 2:
			transferred(pageNum); // 已转让
			break;
		case 3:
			buy(pageNum); // 已购买
			break;
		default :
			canTransfer(1);
	}
}

function canTransfer(index) {
	var con = '<tr><th>项目名称</th><th>历史年化收益率</th><th>投资金额(元)</th><th>投资时间</th><th>操作</th></tr>';
	$("#transferThead").html("").append(con);
	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.accountTransferAllow, DataDeal.josnObjToString(data));
	if (result) {
		canTransferSuccess(result);
	}
}

function canTransferSuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#transferTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.investId + '"><td>' + item.tradeName + '</td><td>' + NumberUtil.transfPercentage(item.tradeInterestRate) +
				'</td><td>' + MoneyUtil.formatMoney(item.investAmount.amount) + '</td><td>' + DateUtils.longToDateString(item.investTime) +
				'</td>' + '<td class="' + item.investId + '">' + '<button class="modify-btn detail" data-url="transfer_allowed_detail">详情</button>' +
				'<button class="to-transfer modify-btn">转让</button></td></tr>';
			$("#transferTbody").append(con);
		});

	} else {
		$("#transferTbody").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function transferring(index) {
	var con = '<tr><th>项目名称</th><th>历史年化收益率</th><th>原始金额(元)</th><th>转让金额(元)</th>' +
		'<th>转让截止时间</th><th>操作</th></tr>';
	$("#transferThead").html("").append(con);
	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.accountTransferring, DataDeal.josnObjToString(data));
	if (result) {
		transferringSuccess(result);
	}
}

function transferringSuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#transferTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.transferId + '"><td>' + item.tradeName + '</td><td>' + NumberUtil.transfPercentage(item.tradeInterestRate) +
				'</td><td>' + MoneyUtil.formatMoney(item.transferOriginAmt.amount) + '</td><td>' + MoneyUtil.formatMoney(item.transferActualAmt.amount) +
				'</td><td>' + DateUtils.longToDateString(item.transferExpireTime) + '</td><td class="' + item.investId + '">' +
				'<button class="modify-btn detail" data-url="transfer_ongoing_detail">详情</button>' +
				'<button class="transfer-back modify-btn">取消转让</button></td></tr>';
			$("#transferTbody").append(con);
		});

	} else {
		$("#transferTbody").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function transferred(index) {
	// var con = '<tr><th>项目名称</th><th>原始金额(元)</th><th>转让金额(元)</th><th>手续费(元)</th><th>受让用户</th><th>受让时间</th><th>操作</th></tr>';
	var con = '<tr><th>项目名称</th><th>原始金额(元)</th><th>转让金额(元)</th><th>受让用户</th><th>受让时间</th><th>操作</th></tr>';
	$("#transferThead").html("").append(con);
	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.accountTransferred, DataDeal.josnObjToString(data));
	if (result) {
		transferredSuccess(result);
	}
}

function transferredSuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#transferTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.transferId + '"><td>' + item.tradeName + '</td><td> ' + MoneyUtil.formatMoney(item.transferOriginAmt.amount) +
				// '</td><td>' + MoneyUtil.formatMoney(item.transferActualAmt.amount) + '</td><td>' + MoneyUtil.formatMoney(item.transferChargeAmt.amount) +
				'</td><td>' + MoneyUtil.formatMoney(item.transferActualAmt.amount) +
				'</td><td>' + item.receiveUserName + '</td><td>' + DateUtils.longToDateString(item.receiveTime, '-') +
				'</td><td class="' + item.investId + '"><button class="modify-btn detail"  data-url="transfer_success_detail">详情</button></td></tr>';
			$("#transferTbody").append(con);
		});

	} else {
		$("#transferTbody").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function buy(index) {
	var con = '<tr><th>项目名称</th><th>转让用户</th><th>购买时间</th><th>购买金额(元)</th><th>操作</th></tr>';
	$("#transferThead").html("").append(con);
	var data = {pageNum: index, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.received, DataDeal.josnObjToString(data));
	if (result) {
		buySuccess(result);
	}
}

function buySuccess(data) {
	listTotal = data.total;
	if (listTotal > 0) {
		$("#transferTbody").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr name="' + item.transferId + '"><td>' + item.tradeName + '</td><td>' + item.transferUserName + '</td><td>'
				+ DateUtils.longToDateString(item.receiveTime, '-') + '</td><td>' + MoneyUtil.formatMoney(item.transferActualAmt.amount) + '</td>' +
				'<td class="' + item.investId + '"><button class="modify-btn detail"  data-url="transfer_received_detail">详情</button></td></tr>';
			$("#transferTbody").append(con);
		});

	} else {
		$("#transferTbody").html('<tr class="bn"><td class="ta-c" colspan="7"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

function transferCancelSuccess(result) {
	var index = $(".layui-laypage-curr").text();
	transferring(index);
	canLoadPage(listTotal, index);
}