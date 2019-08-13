var laydate, laytable, laypage;
var pageSize = 10; // 每页显示的条数

var listTotal;//总条数

$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	// 初始化laydate
	layui.use(['laydate', 'table', 'laypage', 'layer'], function () {
		laydate = layui.laydate
			, laytable = layui.table
			, laypage = layui.laypage
			, layer = layui.layer;
		//日期范围选择
		laydate.render({
			elem: '#dateRange'
			,theme: '#3fabf7'
			, range: '至'
		});

		initDataTable(1, getParams());
		if (listTotal > 0) {
			initPaging(listTotal);
		}
	});

	$(".search-btn").click(function () {
		initDataTable(1, getParams());
        initPaging(listTotal);
	});

	$(".type-filter a").click(function () {
		$(this).addClass("active").siblings().removeClass("active");

		initDataTable(1, getParams());
        initPaging(listTotal);
	});


});

function getParams() {
	var params = {};
	var dr = $("#dateRange").val();
	if (dr) {
		var temp = dr.split(" 至 ");
		var statrTime = temp[0];
		var endTime = temp[1];
		params["startTm"] = statrTime;
		params["endTm"] = endTime;
	} else {
		params["startTm"] = "";
		params["endTm"] = "";
	}
	var searchType = $(".type-filter .active").attr("name");
	params["txnType"] = searchType;

	return params;
}


function initDataTable(pageNum, params) {
	var data = {pageNum: pageNum, pageSize: pageSize};
	if (params) {
		for (var attr in params) {
			data[attr] = params[attr];
		}
	}
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.tradeDetails, DataDeal.josnObjToString(data));
	if (result) {
		listTotal = result.total;
		loadAccountDetailInfo(result.rows);
	}
}

function loadAccountDetailInfo(list) {
	$("#accountDetail").html("");
	var total = list.length;
	if (total && total > 0) {
		$.each(list, function (i, item) {
			var con = '<tr><td>' + item.txnType.message + '</td><td>' + DateUtils.longToDateString(item.txnTime, '-') +
				'</td><td>' + MoneyUtil.formatMoney(item.txnAmt.amount) + '</td><td>' + item.txnStatus.message + '</td></tr>';
			$("#accountDetail").append(con);
		});
	} else {
		$("#accountDetail").html('<tr class="bn"><td class="ta-c" colspan="4"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

// 加载分页插件
function initPaging(total) {
	laypage.render({
		elem: 'accountDetailLaypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, theme: '#078eee'
		, layout: ['prev', 'page', 'next', 'count']
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				$(document).scrollTop(340);
				initDataTable(obj.curr, getParams());
			}
		}
	});
}

