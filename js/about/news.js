var noticeIndex, total;
var pageSize = 10;
$(document).ready(function () {
	// 初始化laydate
	layui.use(['laypage', 'layer', 'element'], function () {
		laypage = layui.laypage
			,layer = layui.layer
			, element = layui.element;

		//平台公告
		announcements(1);
		if (total > 0) {
			initPaging(total);
		} else {
			$("#newListLaypageBox").html("");
		}
		screenHeight();
	});

	$("#header").load("../common/header.html");
	$("#footer").load("../common/footer.html");

	var url = window.location.search;
	if (StringUtil.isContains(url, "ancId", false)) {
		var index = url.substring(url.indexOf('=') + 1, url.length);
		noticeIndex = index;
		$(".content-right").load("news_detail.html");
	}

	$(".list").on("click", ".acticle-btn", function () {
		noticeIndex = $(this).attr("name");
		$(".content-right").load("news_detail.html");
	});
});

// 加载分页插件
function initPaging(total) {
	laypage.render({
		elem: 'newListLaypageBox' //指向存放分页的容器，值可以是容器ID、DOM对象，不用加 # 号
		, count: total //数据总数，从服务端得到
		, limit: pageSize //每页显示的条数
		, layout: ['prev', 'page', 'next', 'count']
		, theme: '#078eee'
		, jump: function (obj, first) {
			//首次不执行
			if (!first) {
				announcements(obj.curr);
				$(document).scrollTop(0);
			}
		}
	});
}

function announcements(index) {
	var data = {pageNum: index, pageSize: pageSize};
	AjaxUtil.ajaxPostCallBack(indexApiUrl.announcementList, JSON.stringify(data), announcementsSuccess);
	screenHeight();
}

function announcementsSuccess(result) {
	total = result.total;
	if (total > 0) {
		$(".list").html("");
		var rows = result.rows;
		$.each(rows, function (i, item) {
			var con = '<li><a class="acticle-btn" href="javascript:void(0);" name="' + item.ancId + '">' + item.ancTitle + '</a><span>' +
				DateUtils.longToDateStringYMD(item.ancTime, '-') +'</span></li>';
			$(".list").append(con);
		});
	} else {
		$(".list").html('<div class="none-data"><img src="../../img/no_data.png"/><p class="ta-c">没有数据</p></div>');
	}
}

function screenHeight() {
//	var leftHeight = $('.content-left');
//	var rightHeight = $('.content-right');
//	if(leftHeight.height() > rightHeight.height()){
//		rightHeight.height(leftHeight.height());
//	} else {
//		leftHeight.height(rightHeight.height());
//	}
}