var laydate, laytable, laypage;
var pageSize = 10; // 每页显示的条数
var listTotal;//总条数
var selectBtnText = '';
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

//		initDataTable(1, getParams());
		//默认全部；
		var params = {
			leftTimeRange:'',
			rightTimeRange:'',
			pageSize:pageSize,
		}
		initDataTable(1, params);
		if (listTotal > 0) {
			initPaging(listTotal);
			
		}
	});


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
//				console.log(selectBtnText);
				initDataTable(obj.curr, getParams(selectBtnText));
			}
		}
	});
}

$(document).ready(function () {
	//判断是否登录，未登录则跳转到登录页面
		commonAPIUtil.isLogin();

		$("#btn-box button").click(function(){
//			console.log($(this).text());
			var params = {};
			$(this).addClass('activeBtn');
			$(this).siblings().removeClass('activeBtn');
			selectBtnText = $(this).text();
//			console.log(selectBtnText)
			params.pageSize = pageSize;
			initDataTable(1, getParams($(this).text()));
		})
	

});
//让分页清空，回到1
	$(".type-filter button").click(function () {
		$(this).addClass("activeBtn").siblings().removeClass("activeBtn");
		initDataTable(1, getParams());
        initPaging(listTotal);
	});
function getParams(text) {
	var params = {};
		if(text == '1个月内'){
			params = {
				leftTimeRange:'',
				rightTimeRange:moment().add(1, "months").format("YYYY-MM-DD"),
			}
		}else if(text == '3个月内'){
			params = {
				leftTimeRange:'',
				rightTimeRange:moment().add(3, "months").format("YYYY-MM-DD"),
			}
		}else if(text == '3个月以上'){
			params = {
				leftTimeRange:moment().add(3, "months").format("YYYY-MM-DD"),
				rightTimeRange:'',
			}
		}else{
			params = {
				leftTimeRange:'',
				rightTimeRange:'',
			}
		}
		params.pageSize = pageSize;
		return params;
}


function initDataTable(pageNum, params) {

	data={
		"leftTimeRange" : params.leftTimeRange,
  		"rightTimeRange" : params.rightTimeRange,
  		"pageNum" : pageNum,
  		"pageSize": params.pageSize
  		
	}

	var result = AjaxUtil.ajaxPostWithLoading(userAccountApiUrl.getRepayPlanCalendar, JSON.stringify(data));
		//console.log(data);
	
		if (result) {
			$(".accounttotleMoney i").html(dealNumber(result.data.repayTotalAmt));
			var arr = result.data.investRepayItems;
			listTotal = result.data.total;
			loadAccountDetailInfo(arr);
		}
}

function loadAccountDetailInfo(arr) {
		var html='';
		$("#tableTbody").html('');
		var accounttotleMoney = 0;
		for(var i = 0;i<arr.length;i++){
			accounttotleMoney = accAdd(accounttotleMoney,Number(arr[i].currentRepayTotalAmt));
			html+='<tr><td>'+DateUtils.longToDateYMDHM(arr[i].planRepayTime)+'</td><td>'+arr[i].tradeName+'</td><td>'+arr[i].currentRepayTotalAmt+'</td><td>'+arr[i].currentCapitalAmt+'</td><td>'+arr[i].currentTradeInterestAmt+'</td></tr>'
		}
		$("#tableTbody").append(html);
		
}


//解决js小数点相加的问题
function accAdd(arg1,arg2){ 
		var r1,r2,m;  
		try{
		　　r1 = arg1.toString().split(".")[1].length;
		}catch(e){r1=0}  
		
		try{
		　　r2 = arg2.toString().split(".")[1].length;
		}catch(e){r2=0}
		m = Math.pow(10,Math.max(r1,r2));
		return (arg1*m+arg2*m)/m;
}

//小数点分割
function dealNumber(money){
    if(money && money!=null){
        money = String(money);
        var left=money.split('.')[0],right=money.split('.')[1];
        right = right ? (right.length>=2 ? '.'+right.substr(0,2) : '.'+right+'0') : '.00';
        var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('')+right;
    }else if(money===0){   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return '0.00';
    }else{
        return "";
    }
}

