var laytable, laypage;
var pageSize = 10; // 每页显示的条数

var total;//总条数

$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
	commonAPIUtil.isLogin();

	// 初始化laydate
	layui.use(['table', 'laypage'], function () {
		laytable = layui.table;
		laypage = layui.laypage;

		initDataTable(1);
		if (total > 0) {
			initPaging(total);
		}

	});

});

function initDataTable(pageNum) {
	var data = {pageNum: pageNum, pageSize: pageSize};
	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.invitationFriendsList, DataDeal.josnObjToString(data));
	if(result){
		loadTableInfo(result);
	}
}

function loadTableInfo(data) {
	total = data.total;
	if (total > 0) {
		$("#invitingListInfo").html("");
		var rows = data.rows;
		$.each(rows, function (i, item) {
			var con = '<tr><td>' + item.safeLoginAccount + '</td><td>' + DateUtils.longToDateString(item.registerTime) +
				'</td><td>' + item.realnameStatus.message + '</td></tr>';
			$("#invitingListInfo").append(con);
		});

	} else {
		$("#invitingListInfo").html('<tr class="bn"><td class="ta-c" colspan="4"><div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div></td></tr>');
	}
}

// 加载分页插件
function initPaging(total) {
	laypage.render({
		elem: 'laypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, theme: '#078eee'
		, layout: ['prev', 'page', 'next', 'count']
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				initDataTable(obj.curr);
			}
		}
	});
}