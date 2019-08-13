/**
 * 获取省份、城市下拉菜单信息
 */
var RegionUtil = {
	/**
	 * 获取省份信息
	 */
	getProvince: function (layer) {
		var $provinceSelect = $("#province");
		$provinceSelect.empty();
		$provinceSelect.append("<option value=''>请选择省份</option>");

		AjaxUtil.ajaxGetCallBack(commonApiUrl.getProvince, function (result) {
			for( var i in result.data){
				var code = result.data[i].provinceCode;
				var name = result.data[i].provinceName;
				$provinceSelect.append("<option name= '"+ code + "'  value='"+ name + "'>" + name + "</option>");
			}
		});
	},
	/**
	 * 获取城市信息
	 * @param provinceCode 城市编号
	 */
	getCity: function (provinceCode, layer) {
		var $citySelect = $("#city");
		$citySelect.empty();
		$citySelect.append("<option value=''>请选择城市</option>");

		AjaxUtil.ajaxGetCallBack(commonApiUrl.getCity + provinceCode, function (result) {
			for( var i in result.data){
				var code = result.data[i].cityCode;
				var name = result.data[i].cityName;
				$citySelect.append("<option name= '"+ code + "' value='"+ name + "'>" + name + "</option>");
			}
		});
	},
	getAreas: function (cityCode, layer) {
		var $areasSelect = $("#areas");
		$areasSelect.empty();
		$areasSelect.append("<option value=''>请选择区(县)</option>");

		AjaxUtil.ajaxGetCallBack(commonApiUrl.getAreas + cityCode, function (result) {
			if(result.data.length == 0){
				$areasSelect.append("<option name= '"+ cityCode + "' value='市辖区'>市辖区</option>");
				return;
			}
			for( var i in result.data){
				var code = result.data[i].areaCode;
				var name = result.data[i].areaName;
				$areasSelect.append("<option name= '"+ code + "' value='"+ name + "'>" + name + "</option>");
			}
		});
	},
	getBank: function (layer) {
		var $bank = $("#bank");
		$bank.empty();
		$bank.append("<option value=''>请选择开户行</option>");

		AjaxUtil.ajaxGetCallBack(commonApiUrl.getBank, function (result) {
			for( var i in result.data){
				var code = result.data[i].bankCode;
				var name = result.data[i].bankName;
				$bank.append("<option  name= '"+ code + "' value='"+ name + "'>" + name + "</option>");
			}
		});
	},

	getBankBranch: function (bankCode, bankAreaCode, layer) {
		var data = {
			bankCode: bankCode,
			areaCode: bankAreaCode,
			bankBranchName:""
		};
		var result = AjaxUtil.ajaxPostCallBack(commonApiUrl.getBankBranch, DataDeal.josnObjToString(data), function () {
			var TempArr = [];
			for( var i in result.data){
				TempArr[i] = result.data[i].bankBranchName;
			}
			return TempArr;
		});
	}
};

/**
 * 加载密码框效果
 * @type {{sixPassWorldBox: cursorUtil.sixPassWorldBox}}
 */
var cursorUtil = {
	/**
	 * 六个格子的密码框
	 */
	sixPassWorldBox: function () {
		var inp_v;
		$(".i-text").keyup(function(event) {
			inp_v = $(this).val();
			if(event.keyCode != 8){
				if(!StringUtil.isNumber(inp_v)){
					$(this).val(inp_v.substring(0,inp_v.length-1));
					layer.msg("交易密码必须为数字");
					return;
				}
			}
			var inp_l = inp_v.length;
			for(var x = 0; x <= 6; x++) {
				$(".sixDigitPassword").find("i").eq(inp_l).addClass("active").siblings("i").removeClass("active");
				$(".sixDigitPassword").find("i").eq(inp_l).prevAll("i").find("b").css({
					"display": "block"
				});
				$(".sixDigitPassword").find("i").eq(inp_l - 1).nextAll("i").find("b").css({
					"display": "none"
				});

				$(".guangbiao").css({
					"left": inp_l * 46.3
				}); //光标位置

				if(inp_l == 0) {
					$(".sixDigitPassword").find("i").eq(0).addClass("active").siblings("i").removeClass("active");
					$(".sixDigitPassword").find("b").css({
						"display": "none"
					});
					$(".guangbiao").css({
						"left": 0
					});
				} else if(inp_l == 6) {
					$(".sixDigitPassword").find("b").css({
						"display": "block"
					});
					$(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
					$(".guangbiao").css({
						"left": 5 * 46
					});
				}
			}
			if(inp_l === 6) {
				// $("#gb").removeClass("guangbiao");
				// $(".sixDigitPassword").find("i").removeClass("active");
				// $(".i-text").blur();
			}
		}).blur(function() {
			$("#gb").removeClass("guangbiao");
			$(".sixDigitPassword").find("i").removeClass("active");
		}).click(function() {
			$("#gb").addClass("guangbiao");
			inp_v = $(this).val();
			var inp_l = inp_v.length;
			if(inp_l === 6){
				inp_l = 5;
			}
			for(var x = 0; x < 6; x++) {
				$(".sixDigitPassword").find("i").eq(inp_l).addClass("active").siblings("i").removeClass("active");
				$(".sixDigitPassword").find("i").eq(inp_l).prevAll("i").find("b").css({
					"display": "block"
				});
				$(".sixDigitPassword").find("i").eq(inp_l - 1).nextAll("i").find("b").css({
					"display": "none"
				});

				$(".guangbiao").css({
					"left": inp_l * 46.3
				}); //光标位置
			}
		});
	},

	sixPassWorldForNew: function () {
		var keyCode, pwd;
		var $_input = $("#fake-box input");
		//输入六位密码
		$("#passWord").keydown(function (e) {
			keyCode = e.keyCode;
			if(keyCode == 36 || keyCode == 37) {
				$(this).blur();
			}
		}).focus().on("input", function () {
			var $_this = $(this);
			pwd = $_this.val();
			if(keyCode != 8){
				if (!StringUtil.isNumber(pwd)) {
					for(var i = 0; i < pwd.length; i++ ){
						if (!StringUtil.isNumber(pwd.charAt(i))) {
							pwd = pwd.substring(0, i);
							$(this).val("").val(pwd);
							layer.msg("交易密码必须为数字");
							return;
						}
					}
				}
			} else {
				$(this).val("").val(pwd);
			}
			var len = pwd.length;
			if (len > 6) {
				$_this.val(pwd.slice(0, 6));
			}
			for (var i = 0; i < len; i++) {
				$_input.eq(i).val(pwd[i]);
				$_input.eq(i + 1).addClass("active").siblings().removeClass("active");
			}
			if (len == 0) {
				$_input.eq(0).addClass("active").siblings().removeClass("active");
			}
			$_input.each(function (index) {
				if (index >= len) {
					$(this).val("");
				}
			});
			if (len == 6) {
				//执行其他操作
				// $_input.removeClass("active");
			}
		}).blur(function () {
			$_input.removeClass("active");
			$(this).attr("readonly",true);
		}).focus(function () {
			$(this).attr("type", "password").removeAttr("readonly").val("").val(pwd);
		});

		$("#fake-box").click(function(){
			$(this).prev().focus();
			var leng = $(this).prev().val().length;
			if(leng >= 6){
				leng = 5;
			}
			$_input.eq(leng).addClass("active");
		});
	}
};

var commonAPIUtil = {
	getCaptchaImg: function () {
		var result = AjaxUtil.ajaxGet(captchaApiUrl.getImgCode + "?r=" + Math.random());
		if(result){
			$(".captcha-img").attr("src", result.data.base64Img);
			return result.data.captchaId
		}
	},

	/**获取用户基本信息*/
	initUserInfo: function () {
		var userInfo = {};
		AjaxUtil.ajaxGetCallBack(userProfileApiUrl.getUserInfo, function (result) {
			userInfo = result.data;
		});
		return userInfo;
	},

	/**获取用户基本信息,token失效不跳转登录页面*/
	initUserInfoUnbindJump: function () {
		var userInfo = {};
		var res = AjaxUtil.ajaxGet(userProfileApiUrl.getUserInfo);
		if (res.code == "20000") {
			userInfo = res.data;
		} else if (res.code == "40404" || res.code == "40405") {
			CookieUtil.setSessionCookie('loginStatus', false);
		} else {
			layer.msg(res.message);
		}
		return userInfo;
	},

	isLogin: function () {
		var loginStatus = CookieUtil.getCookie('loginStatus');
		if ("true" != loginStatus) {
			layer.msg('由于您长时间未操作，请重新登录。', {time:2000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		}
	},

	/**获取用户余额*/
	getUserBalance: function () {
		var accountAmount = {};
		AjaxUtil.ajaxGetCallBack(userAccountApiUrl.getBalance, function (result) {
			var data = result.data;
			accountAmount = {
				totalBalanceAmt: data.totalBalanceAmt,
				availableBalance: data.availableBalanceAmt,
				frozenBalance: data.frozenBalanceAmt
			};
		});
		return accountAmount;
	},

	/**获取用户再投金额*/
	getUserInvestingMoney: function () {
		var investingMoney = 0;
		AjaxUtil.ajaxPostCallBack(userAccountApiUrl.getInvestingMoney, null, function (result) {
			investingMoney = result.data.amount;
		});
		return investingMoney;
	}

};

var validateAPIUtil = {
	validateUserName: function (mobile) {
		var data = {mobile: mobile};
		var result = AjaxUtil.ajaxPostWithLoading(userProfileApiUrl.validateUserName, DataDeal.josnObjToString(data));
		if (result.code == '20000') {
			return result.data;
		} else {
			layer.msg(result.message);
			return false;
		}
	},

	validateEmail: function (email) {
		var data = {email: email};
		var result = AjaxUtil.ajaxPost(userProfileApiUrl.validateEmail, DataDeal.josnObjToString(data));
		if (result.code == '20000') {
			return result.data;
		} else {
			layer.msg(result.message);
			return false;
		}
	},
	
	validateCanRecharge: function (openDepositStatus, bindcardStatus) {
		if(openDepositStatus.code == '00'){
			if(bindcardStatus.code == '1'){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	
	validateCanWithDraw: function (openDepositStatus, bindcardStatus) {
		if(openDepositStatus.code == '00'){
			if(bindcardStatus.code == '1'){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	validateUserHaseRealName: function (userInfo) {
		if(userInfo.openDepositStatus.code == $_GLOBAL.openDepositStatus.SUCCESS){
			return true;
		} else {
			return false;
		}
	}
	
};