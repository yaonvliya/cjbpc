	// 初始化laydate
	layui.use(['laypage', 'table', 'layer'], function () {
		laypage = layui.laypage
			, laytable = layui.table
			, layer = layui.layer;	
	});
	
$(document).ready(function () {
	$("#investAmt").bind('input propertychange', function(){
		if($(this).val()==''){
			$("#investAmt-empty").html('不能为空').show();
		}else{
			$("#investAmt-empty").hide();
		}
	})
	$("#interestRate").bind('input propertychange', function(){
		if($(this).val()>=5 && $(this).val() <= 100){
			$("#interestRate-empty").html('不能为空').hide();
		}else{
			//利率需在5%-100%之间
			$("#interestRate-empty").html('利率需在5%-100%之间').show();
		}
	})
	$("#investTerm").bind('input propertychange', function(){
		if($(this).val()>0 && $(this).val() <= 48){
			$("#investTerm-empty").html('不能为空').hide();
		}else{
			//期限需在48个月以内
			$("#investTerm-empty").html('期限需在48个月以内').show();
		}
	})
	//点击计算弹出列表
	$("#calculateBtn").click(function () {

		var num = 0
		$(".input-verify input").each(function(){
			if($(this).val() == ''){
				$(this).next().show();
				return;
			}else if($(this)[0].id == 'investTerm' && (!($(this).val()>0 && $(this).val() <= 48))){
				$("#investTerm-empty").html('期限需在48个月以内').show();
			}else if($(this)[0].id == 'interestRate' && (!($(this).val()>=5 && $(this).val() <= 100))){
				$(this).next().html('利率需在5%-100%之间').show();
			} else{
				num ++; 
				$(this).next().hide();
			}

		})
		if(num === $(".input-verify input").length){
			$(".revenue-calculator-bottom").show();
			calculate();
		}

	});
	function calculate() {
		var data = {
		  "investAmt" : $("#investAmt").val(),//出借金额
		  "investTerm" : $("#investTerm").val(),//项目期限
		  "investTermUnit" : "M",
		  "repayMethod" : $("#repayMethod option:selected").val(),//还款方式
		  "interestRate" : $("#interestRate").val()/100//历史年化收益
			
		};
		AjaxUtil.ajaxPostCallBack(capitalApiUrl.calculator, JSON.stringify(data), calculateSuccess);
	}
	function calculateSuccess(result){
		console.log(result.data);
		var arr =result.data;
		var html='';
		var totalMoney=0;
		var wantMomey = 0;
		var principalMomey=0;
		var interestMomey = 0;
		$("#tbody").html('');
		for(var i = 1; i < arr.length+1;i++){
			principalMomey = NumberUtil.add(principalMomey,arr[i-1].principal.amount);
			interestMomey = NumberUtil.add(interestMomey , arr[i-1].interest.amount);
			
			totalMoney=NumberUtil.add(arr[i-1].principal.amount, arr[i-1].interest.amount);
			wantMomey = NumberUtil.add(wantMomey,totalMoney);
			html+='<tr><td>'+i+'期'+'</td><td>'+DateUtils.longToDateString(arr[i-1].repayDate).split(' ')[0]+'</td><td>'+totalMoney+'</td><td>'+arr[i-1].principal.amount+'</td><td>'+arr[i-1].interest.amount+'</td></tr>';
		}
		$("#want-momey").html(wantMomey);
		$("#principal-momey").html(principalMomey);
		$("#interest-momey").html(interestMomey);
		$("#tbody").append(html);
	}
});


	$("#header").load("../common/header.html");
	$("#footer").load("../common/footer.html");
