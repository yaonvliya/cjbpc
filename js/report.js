dateJson = {
	year: '2019',
	month: '02'
}

new Vue({
	el: '.swiper-container',
	data: {
		year:'',
		month:'',
		invest_total_amt:'123',
		invest_total_num:'',
  		loan_month_num:'',
  		to_repay_amt:'',
  		investor_total_num:'',
  		loaner_total_num:'',
  		investor_month_num:'',
  		loaner_month_num:'',
  		invest_month_amt:'',
  		investing_user_num:'',
  		invest_month_num:'',
  		regionUser:[],
  		investorAgeMonthPercentJson:{
  			age:[],
  			data:[]
  		},
  		investorAmountPercentAgeMonthJson:{
  			age:[],
  			data:[]
  		},
  		investorSexMonthPercentJson:{
  			boy:'',
  			girl:''
  		},
  		investorAmountPercentSexMonthJson:{
  			boy:'',
  			girl:''
  		},
  		ten_investors_percent_to_repay:'',
  		investor_percent_to_repay:'',
  		nexus_users_loan_amt:'',
  		nexus_users_loan_num:'',
  		safe_operation_days:'0',
  		overdue_total_amt:'0',
  		overdue_total_num:'0',
  		overdue_ninety_days_amt:'0',
  		overdue_ninety_days_num:'0',
  		compensatory_total_amt:'0',
  		compensatory_total_num:'0',
  		withdraw_cost_amt:'0',
  		recharge_cost_amt:'0',
  		transfer_cost_amt:'0',
	},
	created () {
		var self = this;
		console.log(getQueryString('reportId'))
		console.log(getQueryString('year'))
		console.log(getQueryString('month'))
		self.year = getQueryString('year');
		self.month = getQueryString('month');
		
	},
	mounted () {
		var _this = this;
		_this.getOperationReportDetail();
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: false,
			direction: 'vertical',
			onInit: function(swiper){
    			swiperAnimateCache(swiper);
    			swiperAnimate(swiper);
			},
			onSlideChangeEnd: function(swiper){
				swiperAnimate(swiper);
		    }
		})
},
	methods:{
		getOperationReportDetail:function(){
			var _this = this;
			axios({
				method: 'POST',
				url: platformApiUrl.getReportDetail,
				params: {reportId:getQueryString('reportId')}
			}).then(function (res) {
				console.log(res)
				console.log(res.data.data)
				if(res.data.code == '20000'){
					console.log('success')
					console.log(_this.invest_total_amt);
					_this.canvasEcharth1();
					_this.canvasEcharth2();
					_this.canvasEcharth3();
					_this.canvasEcharth4();
					_this.invest_total_amt = dealNumber(res.data.data.investTotalAmt.amount)
					_this.invest_total_num=res.data.data.investTotalNum
			  		_this.loan_month_num=res.data.data.loanMonthNum
			  		_this.to_repay_amt=dealNumber(res.data.data.toRepayAmt.amount)
			  		_this.investor_total_num=res.data.data.investorTotalNum
			  		_this.loaner_total_num=res.data.data.loanerTotalNum
			  		_this.investor_month_num=res.data.data.investorMonthNum
			  		_this.loaner_month_num=res.data.data.loanerMonthNum
			  		_this.invest_month_amt=dealNumber(res.data.data.investMonthAmt.amount)
			  		_this.investing_user_num=res.data.data.investingUserNum
			  		_this.invest_month_num=res.data.data.investMonthNum;
			  		_this.regionUser = res.data.data.regionUserJson.slice(0,10);
			  		res.data.data.investorAgeMonthPercentJson.forEach(function(item){
			  			console.log(item)
			  			_this.investorAgeMonthPercentJson.age.push(item.message);
			  			_this.investorAgeMonthPercentJson.data.push(item.percent*100);
			  		})
			  		res.data.data.investorAmountPercentAgeMonthJson.forEach(function(item){
			  			console.log(item)
			  			_this.investorAmountPercentAgeMonthJson.age.push(item.message);
			  			_this.investorAmountPercentAgeMonthJson.data.push(item.percent*100);
			  		})
			  		res.data.data.investorSexMonthPercentJson.forEach(function(item){
			  			console.log(item)
			  			if(item.message == '男性'){
			  				_this.investorSexMonthPercentJson.boy = item.percent*100;
			  			}else{
			  				_this.investorSexMonthPercentJson.girl = item.percent*100;
			  			}
			  		})
			  		res.data.data.investorAmountPercentSexMonthJson.forEach(function(item){
			  			console.log(item)
			  			if(item.message == '男性'){
			  				_this.investorAmountPercentSexMonthJson.boy = item.percent*100;
			  			}else{
			  				_this.investorAmountPercentSexMonthJson.girl = item.percent*100;
			  			}
			  		})
			  		_this.ten_investors_percent_to_repay = res.data.data.tenInvestorsPercentToRepay*100;
			  		_this.investor_percent_to_repay = res.data.data.investorPercentToRepay*100;
			  		mui("#demo1").progressbar({progress:_this.ten_investors_percent_to_repay}).show();
					mui("#demo2").progressbar({progress:_this.investor_percent_to_repay}).show();
					_this.nexus_users_loan_amt = dealNumber(res.data.data.nexusUsersLoanAmt.amount);
					_this.nexus_users_loan_num = res.data.data.nexusUsersLoanNum;
					_this.safe_operation_days=res.data.data.safeOperationDays;
			  		_this.overdue_total_amt=dealNumber(res.data.data.overdueTotalAmt.amount);
			  		_this.overdue_total_num=res.data.data.overdueTotalNum;
			  		_this.overdue_ninety_days_amt=dealNumber(res.data.data.overdueNinetyDaysAmt.amount);
			  		_this.overdue_ninety_days_num=res.data.data.overdueNinetyDaysNum;
			  		_this.compensatory_total_amt=dealNumber(res.data.data.compensatoryTotalAmt.amount);
			  		_this.compensatory_total_num=res.data.data.compensatoryTotalNum;
			  		_this.withdraw_cost_amt=res.data.data.withdrawCostAmt.amount;
			  		_this.recharge_cost_amt=res.data.data.rechargeCostAmt/100;
			  		_this.transfer_cost_amt=dealNumber(res.data.data.transferCostAmt.amount);
				}
			}).catch(function(error){
				console.log(error);
			})
		},
		canvasEcharth1:function(){
			var _this = this;
			console.log('canvasEcharth1')
			setTimeout(function(){
			var dom = document.getElementById('ratio1');
			var myChart = echarts.init(dom);
			// 柱状图
			var option = {
				color: '#fff',
			    barWidth: '11px',
			    xAxis: {
			        show: false
			    },
				itemStyle: {
					barBorderRadius: [0, 50, 50, 0]
				},
				grid: {
			    	left: '20',
			    	right: '200'
			    },
			    yAxis: {
			        type: 'category',
			        data: _this.investorAgeMonthPercentJson.age,
			        axisLine: {
			        	lineStyle: {
			        		color: '#fff'
			        	}
			        },
			        position: 'right',
			        offset: 100,
			        axisTick: false
			    },
			    series: [{
			    	type: 'bar',
			        data: _this.investorAgeMonthPercentJson.data,
			        itemStyle: {
									normal: {
										label: {
											show: true, //开启显示
											position: 'right', //在上方显示
											textStyle: { //数值样式
												color: '#ffffff',
												fontSize: 14,
												formatter:'%'
											}
										}
									}
								},
		
			    }]
			};
			if (option && typeof option === "object") {
				myChart.setOption(option, true);
			}
			window.addEventListener('resize',function() {myChart.resize()});
				},500)
		},
		canvasEcharth2:function(){
			var _this = this;
			console.log('canvasEcharth2')
			setTimeout(function(){
			var doma = document.getElementById('main');
			var myCharta = echarts.init(doma);
			// 柱状图
			var optiona = {
				color: '#fff',
			    barWidth: '11px',
			    xAxis: {
			        show: false
			    },
				itemStyle: {
					barBorderRadius: [0, 50, 50, 0]
				},
				grid: {
			    	left: '20',
			    	right: '200'
			    },
			    yAxis: {
			        type: 'category',
			        data: _this.investorAmountPercentAgeMonthJson.age,
			        axisLine: {
			        	lineStyle: {
			        		color: '#fff'
			        	}
			        },
			        position: 'right',
			        offset: 100,
			        axisTick: false
			    },
			    series: [{
			    	type: 'bar',
			        data: _this.investorAmountPercentAgeMonthJson.data,
			        itemStyle: {
									normal: {
										label: {
											show: true, //开启显示
											position: 'right', //在上方显示
											textStyle: { //数值样式
												color: '#ffffff',
												fontSize: 14,
												formatter:'%'
											}
										}
									}
								},
		
			    }]
			};
			if (optiona && typeof optiona === "object") {
				myCharta.setOption(optiona, true);
			}
			window.addEventListener('resize',function() {myCharta.resize()});
				},500)
		},
		//环形图1
		canvasEcharth3:function(){
			var _this = this;
			setTimeout(function(){
				var domb = document.getElementById('pie1');
				var myChartb = echarts.init(domb);
				var optionb = {
				    legend: {
				        orient: 'vertical',
				        x: 'left',
				        data:[]
				    },
				     color:['#5777FF','#FFC468'],
				    series: [
				        {
				            name:'',
				            type:'pie',
				            radius: ['75%', '45%'],
				            center: ['60%', '50%'],
				            avoidLabelOverlap: false,
				            label: {
				                normal: {
				                    show: false,
				                    position: 'center'
				                },
				                emphasis: {
				                    show: false,
				                    textStyle: {
				                        fontSize: '16',
				                        fontWeight: 'bold'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    show: false
				                }
				            },
				            data:[
				                {value:_this.investorSexMonthPercentJson.boy, name:'男性'},
				                {value:_this.investorSexMonthPercentJson.girl, name:'女性'},
				
				            ]
				        }
				    ]
				};
				if (optionb && typeof optionb === "object") {
					myChartb.setOption(optionb, true);
				}
				window.addEventListener('resize',function() {myChartb.resize()});
			},500)
		},
		//环形图2
		canvasEcharth4:function(){
			var _this = this;
			setTimeout(function(){
				var domc = document.getElementById('pie2');
				var myChartc = echarts.init(domc);
				var optionc = {
				    legend: {
				        orient: 'vertical',
				        x: 'left',
				        data:[]
				    },
				    color:['#5777FF','#FFC468'],
				    series: [
				        {
				            name:'',
				            type:'pie',
				            radius: ['75%', '45%'],
				            center: ['50%', '50%'],
				            avoidLabelOverlap: false,
				            label: {
				                normal: {
				                    show: false,
				                    position: 'center'
				                },
				                emphasis: {
				                    show: false,
				                    textStyle: {
				                        fontSize: '16',
				                        fontWeight: 'bold'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    show: false
				                }
				            },
				            data:[
				                {value:_this.investorAmountPercentSexMonthJson.boy, name:'男性'},
				                {value:_this.investorAmountPercentSexMonthJson.girl, name:'女性'},
				
				            ]
				        }
				    ]
				};
				if (optionc && typeof optionc === "object") {
					myChartc.setOption(optionc, true);
				}
				window.addEventListener('resize',function() {myChartc.resize()});
			},500)
		},
	},
	
})


var url1 = platformApiUrl.queryReportList;
var url2 = platformApiUrl.getReportDetail;


function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
}
function dealNumber(money) {
			if(money && money != null) {
				money = String(money);
				var left = money.split('.')[0],
					right = money.split('.')[1];
				right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
				var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
				return(Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
			} else if(money === 0) { //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
				return '0.00';
			} else {
				return "";
			}
		}