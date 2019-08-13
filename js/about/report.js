	function queryReportList() {

	data={
		reportYear:'2019'
  		
	}

	var result = AjaxUtil.ajaxPostWithLoading(platformApiUrl.queryReportList, JSON.stringify(data));
		console.log(result);
	return;
//		if (result) {
//			$(".accounttotleMoney i").html(dealNumber(result.data.repayTotalAmt));
//			var arr = result.data.investRepayItems;
//			listTotal = result.data.total;
//			loadAccountDetailInfo(arr);
//		}
}
//	var hrefUrl = window.location.href;
//	var	start = hrefUrl.indexOf('?');
//	var dateJson = {};
//		
//	if (start != -1) {
//		var paramsStr = hrefUrl.substring(start + 1);
//		var paramsArr = paramsStr.split('&');
//		
//		for (var i = 0; i < paramsArr.length; i++) {
//			var pairIndex = paramsArr[i].indexOf('=');
//			if (pairIndex != -1) {
//				var key = paramsArr[i].split('=')[0];
//				var value = paramsArr[i].split('=')[1];
//				dateJson[key] = value;
//			}
//		}
//	}
	
	dateJson = {
		year: '2019',
		month: '02'
	}
	
	new Vue({
		el: '.swiper-container',
		data: {
			tradeTotal: '1232',
			tradeCount: '',
			loanCount: '',
			loanBalance: '',
			
			lenderTotal: '',
			loanerTotal: '',
			lenderM: '',
			loanerM: '',
			
			tradeTotalM: '',
			InvestCountM: '',
			tradeCountM: '',
			aaa: 111,
			bbb: {
				xxx: {
					yyy: 1
				}
			},
			
			reportData: {}
			
		},
		created () {
			var self = this;
//			axios({
//				method: 'GET',
//				url: platformApiUrl.getReportDetail,
//				params: {reportId:'5c8b148c7a1e9b561c6cdf24'}
//			}).then(function (response) {
//				console.log(response.data.data)
//				self.reportData = response.data.data;
////				self.bbb = response.data.data.investMonthAmt;
//			})
			
		},
		mounted () {
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
//			var mySwiper = new Swiper('.swiper-container', {
//				direction: 'vertical',
//				pagination: '.swiper-pagination',
//		//		autoplay: true,
//				on: {
//					init: function() {
//						swiperAnimateCache(this); //隐藏动画元素 
//						this.emit('slideChangeTransitionEnd'); //在初始化时触发一次slideChangeTransitionEnd事件
//					},
//					slideChangeTransitionEnd: function() {
//						swiperAnimate(this); //每个slide切换结束时运行当前slide动画
//		//				this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); //动画只展示一次
//					}
//				}
//			})
		}
		
	})
	
	
	var url1 = platformApiUrl.queryReportList;
	var url2 = platformApiUrl.getReportDetail;
	
	
	
//	var mySwiper = new Swiper('.swiper-container', {
//		direction: 'vertical',
//		pagination: '.swiper-pagination',
////		autoplay: true,
//		on: {
//			init: function() {
//				swiperAnimateCache(this); //隐藏动画元素 
//				this.emit('slideChangeTransitionEnd'); //在初始化时触发一次slideChangeTransitionEnd事件
//			},
//			slideChangeTransitionEnd: function() {
//				swiperAnimate(this); //每个slide切换结束时运行当前slide动画
////				this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); //动画只展示一次
//			}
//		}
//	})
	
	
	
	var dom = document.getElementById('ratio1');
	var myChart = echarts.init(dom);
	
	// 柱状图
	option = {
		color: '#fff',
	    barWidth: '22px',
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
	        data: ['30岁及以下', '31岁到40岁', '41岁到50岁', '51岁及以上'],
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
	        data: [8, 15, 36, 43],
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
	