var layer, laytable;
layui.use(['layer'], function () {
	layer = layui.layer;
    laytable = layui.table;
});

/**
 * ajax请求工具类
 */
var AjaxUtil = {
	/** ajax post 请求后台，获取数据
	 * @param url(请求地址)
	 * @param data(请求参数-json对象)
	 */
	ajaxPost: function (url, data) {
		var json = null;
		$.ajax({
			url: url,
			dataType: 'json',
			type: 'post',
			contentType: 'application/json;charse=UTF-8',
			async: false,
			data: data,
			beforeSend: function (request) {
				request.setRequestHeader("X-Auth-Token", $.cookie('X-Auth-Token') || "");
				request.setRequestHeader("X-Request-Terminal", "pc");
			},
			xhrFields: {
				withCredentials: true,
				useDefaultXhrHeader: false
			},
			crossDomain: true,
			success: function (result) {
				// console.info(result);
				json = result;
			},
			error: function (e) {
				layer.msg('网络异常');
			}
		});
		return json;
	},
	/*ajax get 请求后台，获取数据*/
	ajaxGet: function (url) {
		var json = null;
		$.ajax({
			url: url,
			type: 'get',
			async: false,
			beforeSend: function (request) {
				request.setRequestHeader("X-Auth-Token", $.cookie('X-Auth-Token') || "");
				request.setRequestHeader("X-Request-Terminal", "pc");
			},
			success: function (result) {
				// console.info(result);
				json = result;
			},
			error: function (e) {
				layer.msg('网络异常');
			}
		});
		return json;
	},
	/** ajax post 请求后台，获取数据(带加载中样式)
	 * @param url(请求地址)
	 * @param data(请求参数-json对象)
	 */
	ajaxPostWithLoading: function (url, data) {
		var json = null;
		layer.load(1, {shade: [0.3, '#333'] /*透明度，背景色*/});
		var result = AjaxUtil.ajaxPost(url, data);
		layer.closeAll('loading');
		if (result.code == '20000') {
			json = result;
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time:1000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
		}
		return json;
	},
	/** ajax get 请求后台，获取数据(带加载中样式)
	 * @param url(请求地址)
	 * @param data(请求参数-json对象)
	 */
	ajaxGetWithLoading: function (url) {
		var json = null;
		layer.load(1, {shade: [0.3, '#333'] /*透明度，背景色*/});
		var result = AjaxUtil.ajaxGet(url);
		layer.closeAll('loading');
		if (result.code == '20000') {
			json = result;
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time:1000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
		}
		return json;
	},
	/**
	 * 带成功回调的get请求
	 * @param url
	 * @param doSomething 交易成功后要处理的函数
	 */
	ajaxGetCallBack: function (url, doSomething) {
		var result = AjaxUtil.ajaxGet(url);
		if (result.code == '20000') {
			doSomething(result);
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time:1000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
		}
	},
	ajaxPostCallBack: function (url, data, doSomething) {
		var result = AjaxUtil.ajaxPost(url, data);
		if (result.code == '20000') {
			doSomething(result);
		} else if (result.code == "40404" || result.code == "40405") {
			layer.msg('由于您长时间未操作，请重新登录。', {time:1000}, function () {
				CookieUtil.clearAllCookie();
				$_GLOBAL.jumpToLogin();
			});
		} else {
			layer.msg(result.message);
		}
	},
	/**
	 * 上传图片、文件
	 * @param url （请求地址）
	 * @param data （请求参数 formData对象）
	 * @returns {*}
	 */
	ajaxFormData: function (url, data) {
		var json = null;
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function (request) {
				request.setRequestHeader("X-Auth-Token", $.cookie('X-Auth-Token') || "");
				request.setRequestHeader("X-Request-Terminal", "pc");
			},
			xhrFields: {
				withCredentials: true,
				useDefaultXhrHeader: false
			},
			crossDomain: true,
			success: function (result) {
				json = result;
			},
			error: function (e) {
				layer.msg('网络异常');
			}
		});
		return json;
	}
};

/**
 * 将从form中通过$('#formId').serialize()获取的值转成json格式字符串
 */
var DataDeal = {
	formToJson: function (data) {
		var dataCollect = decodeURIComponent(data, true);//防止中文乱码
		dataCollect = dataCollect.replace(/&/g, "\",\"");
		dataCollect = dataCollect.replace(/=/g, "\":\"");
		var jsonStr = "{\"" + dataCollect + "\"}";
		return jsonStr;
	},
	josnObjToString: function (jsonObj) {
		var jStr = '{';
		for (var item in jsonObj) {
			jStr += '"' + item + '":"' + jsonObj[item] + '",';
		}
		jStr = jStr.substr(0, jStr.length - 1);
		jStr += '}';
		return jStr;
	},
    /**
     * form表单数据转为Json对象
     */
    formToJsonObj: function (form) {
        let obj = {};
        $.each(form.serializeArray(), function (index) {
            if (obj[this['name']]) {
                obj[this['name']] = obj[this['name']] + "," + this['value'];
            } else {
                obj[this['name']] = this['value'];
            }
        });
        return obj;
    }
};

/**
 * 全局参数
 */
var $_GLOBAL = {
	winHeight: $(window).height(), //浏览器当前窗口可视区域高度
	winWidth: $(window).width(), //浏览器当前窗口可视区域宽度
	docHeight: $(document).height(), //浏览器当前窗口文档的高度
	docWidth: $(document).width(), //浏览器当前窗口文档对象宽度
	docBodyHeight: $(document.body).height(), //浏览器当前窗口文档body的高度
	docBodyWidth: $(document.body).width(), //浏览器当前窗口文档body的宽度
	screenTop: window.screenTop, //浏览器距离Top
	screenLeft: window.screenLeft, //浏览器距离Left
	screenHeight: window.screen.height, //屏幕分辨率的高
	screenWidth: window.screen.width, //屏幕分辨率的宽

	basePath: function () {
		return sysContext;
	},
	jumpToIndex:function () {
		window.location.href = $_GLOBAL.basePath() + "/index.html";
	},
	jumpToUserIndex:function (userRole) {
		var loaner = "loaner";
        var investor = "investor";
		if(StringUtil.isContains(userRole, loaner, true)){
            window.location.href = $_GLOBAL.basePath() + "/views/user_loaner.html";
        } else if(StringUtil.isContains(userRole, investor, true)){
            window.location.href = $_GLOBAL.basePath() + "/views/user_investor.html";
        } else {
            window.location.href = $_GLOBAL.basePath() + "/views/user_loaner.html";
        }
    },
    jumpToUserApply:function () {
        window.location.href = $_GLOBAL.basePath() + "/views/user.html#apply";
    },
    jumpToUserSettings:function () {
        window.location.href = $_GLOBAL.basePath() + "/views/user.html#settings";
    },
	jumpToLogin:function () {
		window.location.href = $_GLOBAL.basePath() + "/login.html";
	},
    jumpToDeposit:function (token) {
        window.location.href = $_GLOBAL.basePath() + "/deposit_loading.html?" + token;
    },
    jumpToLoan:function () {
        window.location.href = $_GLOBAL.basePath() + "/views/loan.html";
    },
    jumpToOpenAccount:function (userType) {
       	if(userType == $_GLOBAL.userType.GR){
            window.location.href = $_GLOBAL.basePath() + "/views/user.html#open_account_personal";
		} else if(userType == $_GLOBAL.userType.JG){
            window.location.href = $_GLOBAL.basePath() + "/views/user.html#open_account_company_info";
        }
    },
    jumpToUploadInfo:function (userType) {
        if(userType == $_GLOBAL.userType.GR){
            window.location.href = $_GLOBAL.basePath() + "/views/user.html#upload_personal_pic";
        } else if (userType == $_GLOBAL.userType.JG){
            window.location.href = $_GLOBAL.basePath() + "/views/user.html#upload_company_pic";
        }
    },
	doLogout:function () {
		AjaxUtil.ajaxPostCallBack(userProfileApiUrl.logout, null, function () {
			//清除所有cookie
			CookieUtil.clearAllCookie();
			// 跳转至首页
			$_GLOBAL.jumpToLogin();
		});
	},

	//获取短信验证码类型
	msgType: {
		//注册
		REGISTER: "register",
		//修改登录手机号
		MODIFY_LOGIN_MOBILE: "modifyLoginMobile",
		//绑定邮箱
		BIND_EMAIL: "bindEmail",
		//修改绑定邮箱
		MODIFY_BIND_EMAIL: "modifyBindEmail",
		//重置登录密码
		RESET_LOGIN_PASSWORD: "resetLoginPassword",
		//手机身份验证
		CHECK_IDENTITY_WITH_MOBILE: "checkIdentityWithMobile",
		//邮箱身份验证
		CHECK_IDENTITY_WITH_EMAIL: "checkIdentityWithEmail",
        //借款
        LOAN_APPLY: "loanApply",
        //还款
        REPAY: "repay",
        //缴纳服务费
        PAY_FEE: "payFee",
		UNBIND_CARD: "unbindCard",

	},

	// 业务类型
	bizType: {
		// 个人开户
		PERSONAL_REALNAME :"PERSONAL_REGISTER",

		// 企业开户
		ENTERPRISE_REALNAME :"ENTERPRISE_REGISTER",

		// 解绑银行卡
		UNBIND_CARD :"PERSONAL_UNBIND_BANKCARD",

		// 绑定银行卡
		BIND_CARD :"PERSONAL_BIND_BANKCARD",

		// 修改交易密码
		MODIFY_TRADE_PASS :"MODIFY_TRADE_PASS",

		// 重置交易密码
		RESET_TRADE_PASS :"RESET_PASSWORD",

		// 更换银行预留手机
		MODIFY_BANK_MOBILE :"MODIFY_MOBILE",

		//快捷充值
		QUICK_RECHARGE : "RECHARGE",

		//网银充值
		NET_SLIVER_RECHARGE : "RECHARGE",

		// 提现
		WITHDRAW : "WITHDRAW",

		//授权
		AUTHORIZATION : "USER_AUTHORIZE_NEW",

        //缴纳服务费
        PAY_FEE : "PAY_FEE"
	},

	banner: {
		//PC官网首页
		PC_INDEX: "PC||Index",

		//PC官网积分商城
		PC_POINTMALL: "PC||Pointmall",

		//H5首页
		H5_INDEX: "H5||Index",

		//H5积分商城
		H5_POINTMALL: "H5||Pointmall",

		//H5借款平台
		H5_ASSERTS: "H5||Asserts",

		//APP首页
		APP_INDEX: "APP||Index",

		//APP积分商城
		APP_POINTMALL: "APP||Pointmall",
	},

	//实名状态
	realnameStatus: {
        //未实名
        NOT_REALNAME: "--",
        //已实名
        HAS_REALNAME: "00",
        //待上传证件
        WAIT_UPLOAD_IMG: "01",
        //实名审核中
        AUDITING: "02",
        //实名审核不通过
        FAILED: "03",
	},

    //绑卡状态
    bindCardStatus: {
        NOT_BIND: "0",
        HAS_BIND: "1",
    },

    //用户类型
    userType: {
        GR: "GR",
        JG: "JG",
    },

	formatBankCode: function (code) {
		switch (code){
            case 'ICBC': return "中国工商银行";break;
            case 'ABC': return "中国农业银行";break;
            case 'CCB': return "中国建设银行";break;
            case 'BOC': return "中国银行";break;
            case 'BCOM': return "中国交通银行";break;
            case 'CIB': return "兴业银行";break;
            case 'CITIC': return "中信银行";break;
            case 'CEB': return "中国光大银行";break;
            case 'PAB': return "平安银行";break;
            case 'PSBC': return "中国邮政储蓄银行";break;
            case 'SHB': return "上海银行";break;
            case 'SPDB': return "浦东发展银行";break;
            case 'CMBC': return "中国民生银行";break;
            case 'CMB': return "招商银行";break;
            case 'GDB': return "广发银行";break;
            case 'HXB': return "华夏银行";break;
            case 'HZB': return "杭州银行";break;
            case 'BOB': return "北京银行";break;
            case 'NBCB': return  "宁波银行";break;
            case 'JSB': return "江苏银行";break;
            case 'ZSB': return "浙商银行";break;
            case 'IT': return "其他银行";break;
		}
	},

	credentials: function(code) {
		switch (code) {
			case "identityCertFlag" : return "身份证";break;
			case "legalPersonIdentityFlag" : return "法人身份证";break;
			case "legalPersonCreditReportingFlag" : return "法人征信报告";break;
			case "enterpriseCreditReportingFlag" : return "企业征信报告";break;
			case "businessLicenseFlag" : return "企业营业执照";break;
			case "drivingLicenseFlag" : return "行驶证";break;
			case "driverLicenseFlag" : return "驾驶证/挂靠协议";break;
			case "roadTransportLicenseFlag" : return "道路运输经营许可证";break;
			case "thirdContractFlag" : return "运输合同";break;

			case "certCardFront" : return "身份证正面";break;
			case "certCardBack" : return "身份证反面";break;
			case "certCardExpireTime" : return "身份证到期日期";break;
			case "certCardWithSelf" : return "身份证与本人合照";break;
			case "businessLicense" : return "营业执照";break;
			case "businessLicenseExpireTime" : return "营业执照到期日期";break;
			case "drivingLicense" : return "行驶证";break;
			case "driverLicense" : return "驾驶证/挂靠协议";break;
			case "driverLicenseExpireTime" : return "驾驶证/挂靠协议到期日期";break;
			case "roadTransportLicense" : return "道路运输经营许可证";break;
			case "roadTransportLicenseExpireTime" : return "道路运输经营许可证到期日期";break;
			case "transportContract" : return "运输合同";break;
			case "transportContractExpireTime" : return "运输合同到期日期";break;
		}
	},

	/** 添加渠道时也要在此添加，并在user服务中添加RegisterFromEnum */
	channel: function(channel){
		switch (channel) {
			case "cjb": return "cjb"; break;
			case "whlchain": return "whlchain"; break;
			default: return "cjb"; break;
		}
	},

	getElementLeft: function (element){
		var actualLeft = element.offsetLeft;
		var current = element.offsetParent;

		while (current !== null){
			actualLeft += current.offsetLeft;
			current = current.offsetParent;
		}

		return actualLeft;
	},

	getElementTop: function (element){
		var actualTop = element.offsetTop;
		var current = element.offsetParent;

		while (current !== null){
			actualTop += current.offsetTop;
			current = current.offsetParent;
		}

		return actualTop;
	},

};

/**
 * 按钮倒计时定时器处理工具
 */
var TimerUtil = {
	originalSecond: 60,
	/**
	 * 启动定时器
	 * @param btnId(按钮id)
	 * @returns {number|*}
	 */
	setRemainTime: function (obj) {
		var curCount = this.originalSecond;
		$(obj).attr("disabled", "true").removeClass("layui-btn-primary").addClass("layui-btn-disabled").text("重新获取（" + curCount + "）");
		var InterValObj = window.setInterval(function () {
			curCount--;
			if (curCount == 0) {
				window.clearInterval(InterValObj);
				curCount = this.originalSecond;
				$(obj).removeAttr("disabled").removeClass("layui-btn-disabled").addClass("layui-btn-primary").text("重新获取");
			} else {
				$(obj).text("重新获取(" + curCount + ")");
			}
		}, 1000);
		return InterValObj;
	}
};

/**
 * cookie处理工具
 */
var CookieUtil = {
	// 设置永久cookie
	setCookie: function (name, value) {
		$.cookie(name, value, CookieNeverExpireConfig);
	},
	// 设置session cookie
	setSessionCookie: function (name, value) {
		$.cookie(name, value, CookieSessionConfig);
	},
	// 获取cookie
	getCookie: function (name) {
		return $.cookie(name);
	},
	// 删除cookie
	deleteCookie: function (name) {
		$.cookie(name, null, {expires: -1, path: '/'});
	},
	//清除所有cookie
	clearAllCookie: function () {
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		}
		if (cookies.length > 0) {
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				var domain = location.host.substr(location.host.indexOf('.'));
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + domain;
			}
		}
	}
};

/**
 * 通用工具类
 */
var BaseUtil = {
	/**
	 * 得到文件的扩展名
	 *
	 * @param filename-String
	 * @return
	 */
	getFileExt: function (filename) {
		var d = /\.[^\.]+$/.exec(filename);
		var ext = new String(d);
		var s = ext.toLowerCase();
		return s;
	},
	/**
	 * 获取url中的参数
	 *
	 * @param url
	 * @return json
	 */
	getUrlParams: function (url) {
		var json = {};
		var searchURL = url || window.location.search;
		var index = searchURL.indexOf("?");
		if (index >= 0) {
			var params = searchURL.substring(index + 1, searchURL.length);
			var arr = params.split("&"); // 各个参数放到数组里
			for (var i = 0; i < arr.length; i++) {
				var num = arr[i].indexOf("=");
				if (num > 0) {
					var key = arr[i].substring(0, num);
					var value = arr[i].substr(num + 1);
					json[key] = value;
				}
			}
		}
		return json;
	},
	/**
	 *  把对象转换成URL的hash值
	 * @param params
	 * @return String
	 */
	paramsToUrlHash: function (params) {
		var result = "";
		$.each(params, function (i, item) {
			result += i + "=" + item + "&";
		});

		return result;
	},
	/**
	 * 随机数UUID(32位)
	 *
	 * @return UUID
	 */
	createUUID: function () {
		var S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
	},

	notifyMe: function (message) {
		// 先检查浏览器是否支持
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		} else if (Notification.permission === "granted") {
			// 检查用户是否同意接受通知
			var notification = new Notification(message);
		} else if (Notification.permission !== 'denied') {
			// 否则我们需要向用户获取权限
			Notification.requestPermission(function (permission) {
				// 如果用户同意，就可以向他们发送通知
				if (permission === "granted") {
					var notification = new Notification(message);
				}
			});
		}

		notification.onclick = function() {
			//可直接打开通知notification相关联的tab窗口
			window.focus();
		};

		//设置定时撤销机制，防止通知长时间显示不被关闭
		notification.onshow = function () {
			setTimeout(function () {
				notification.close()
			}, 5000);
		};
	},

	/**
	 *  判断一个元素是否是另一个元素的子元素
	 * @param obj
	 * @param parentObj
	 * @return {boolean}
	 */
	isParent: function (obj, parentObj) {
		while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY'){
			if (obj == parentObj){
				return true;
			}
			obj = obj.parentNode;
		}
		return false;
	}

};

/**
 * 数字工具类
 */
var NumberUtil = {
	/**
	 * 生成指定位数的随机整数
	 *
	 * @param count-int(位数)
	 * @return number
	 */
	getRandomNum: function (count) {
		var arr = new Array;
		var reNum = "";
		for (var i = 0; i < count; i++) {
			arr[i] = parseInt(Math.random() * 10);
			reNum += String(arr[i]);
		}
		return reNum;
	},
	/**
	 * 生成指定区间的随机整数
	 *
	 * @param min-int(最小值)
	 * @param max-int(最大值（不包含）)
	 * @return number
	 */
	randomInMinToMax: function (min, max) {
		return Math.floor(min + Math.random() * (max - min));
	},
	/**
	 * 验证是否是整数或1-2位小数的数
	 *
	 * @param ource
	 */
	checkTowFloat: function (source) {
		// var regex = /^[1-9]+\d*[\.\d]?\d{1,2}$/g;
		// return regex.test(source);
		var regex = /^\d+(?:\.\d{1,2})?$/;
		return regex.test(source);
	},
	checkBankCardNum: function (source) {
		// source = source.replace(/\s/g, "");//去除空格
		var regex = /^([1-9]{1})(\d{14,18})$/;
		return regex.test(source);
	},
	checkPassWordNum: function (source) {
		// var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
		var regex = /^\d{6}$/g;
		return regex.test(source);
	},
	/**
	 * 小数转为百分比，百分比保留两位小数。不做四舍五入
	 * @param source
	 */
	transfPercentage: function (source) {
		return  NumberUtil.mul(source, 100) + "%";
	},

	/*把银行卡4位分割*/
	splitFour: function (val) {
		//result = val.replace(/[ \f\t\v]/g, '').replace(/(\d{6})(?=\d)/, "$1 ").replace(/(\d{8})(?=\d)/g, "$1 ");//身份证
		return val.replace(/[ \f\t\v]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");//银行卡
	},

	/*把身份证6-8-4位分割*/
	splitForCardNum: function (val) {
		return val.replace(/[ \f\t\v]/g, '').replace(/(\d{6})(?=\d)/, "$1 ").replace(/(\d{8})(?=\d)/g, "$1 ");//身份证
	},
	/**两个数值加法运算*/
	add: function (a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (NumberUtil.mul(a, e) + NumberUtil.mul(b, e)) / e;
	},
	/**两个数值减法运算*/
	sub: function (a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (NumberUtil.mul(a, e) - NumberUtil.mul(b, e)) / e;
	},
	/**两个数值乘法运算*/
	mul: function (a, b) {
		var c = 0,
			d = a.toString(),
			e = b.toString();
		try {
			c += d.split(".")[1].length;
		} catch (f) {}
		try {
			c += e.split(".")[1].length;
		} catch (f) {}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	},
	/**两个数值除法运算*/
	div: function (a, b) {
		var c, d, e = 0,
			f = 0;
		try {
			e = a.toString().split(".")[1].length;
		} catch (g) {}
		try {
			f = b.toString().split(".")[1].length;
		} catch (g) {}
		return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), NumberUtil.mul(c / d, Math.pow(10, f - e)).toFixed(4);
	},
	/**两个数值求余运算*/
	mod: function (a, b) {
		var c, d;
		c = NumberUtil.div(a,b);
		c = c.toString().split(".")[0];
		d = NumberUtil.mul(b,c);
		return NumberUtil.sub(a,d);
	}
};

/**
 * 金额处理工具类
 */
var MoneyUtil = {
	/**
	 * 格式化 (数字,金额用逗号隔开)
	 * @params money {Number or String} 金额
	 * @params digit {Number} 小数点的位数，不够补0
	 * @returns {String} 格式化后的金额
	 */
	formatMoney: function (money, digit) {
		var tpMoney = '0.00';
		digit = digit ? digit : 2;
		if (undefined != money) {
			tpMoney = money;
		}
		tpMoney = new Number(tpMoney);
		if (isNaN(tpMoney)) {
			return '0.00';
		}
		tpMoney = tpMoney.toFixed(digit) + '';
		var re = /^(-?\d+)(\d{3})(\.?\d*)/;
		while (re.test(tpMoney)) {
			tpMoney = tpMoney.replace(re, "$1,$2$3")
		}
		return tpMoney;
	},
	/**
	 * 反格式化 (数字,金额去掉逗号隔开)
	 * @params money {Number or String} 金额
	 * @params digit {Number} 小数点的位数，不够补0
	 * @returns {String} 反格式化后的金额
	 */
	parseMoney: function (money, digit) {
		digit = digit > 0 && digit <= 20 ? digit : 2;
		return parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(digit) + "";
	},
	/**
	 * 数字金额大写转换(可以处理整数,小数,负数)
	 * @params money {Number or String} 金额
	 */
	moneyToCny: function (money) {
		money = MoneyUtil.parseMoney(money);
		var fraction = ['角', '分'];
		var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
		var unit = [
			['元', '万', '亿'],
			['', '拾', '佰', '仟']
		];
		var head = money < 0 ? '欠' : '';
		money = Math.abs(money);

		var s = '';

		for (var i = 0; i < fraction.length; i++) {
			s += (digit[Math.floor(money * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
		}
		s = s || '整';
		money = Math.floor(money);

		for (var i = 0; i < unit[0].length && money > 0; i++) {
			var p = '';
			for (var j = 0; j < unit[1].length && money > 0; j++) {
				p = digit[money % 10] + unit[1][j] + p;
				money = Math.floor(money / 10);
			}
			s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
		}
		return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
	}
};

/**
 * 字符串处理工具类
 */
var StringUtil = {
	/**
	 * 验证字符串是否为数字
	 *
	 * @param source-String
	 * @return boolean true或false
	 */
	isNumber: function (str) {
		var regExp = /^\d+$/g;
		return regExp.test(str);
	},
	/**
	 * 判断字符串是否为空
	 *
	 * @param source-String
	 * @return boolean true或false
	 */
	isEmpty: function (source) {
		if (source === null || source === undefined) {
			return true;
		}
		var str = source.replace(/(^\s*)|(\s*$)/g, "");
		if (str == "" || str.toLowerCase() == "null" || str.length <= 0) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 验证字符串是否是中文
	 *
	 * @param source:需要验证的字符串
	 * @return boolean true或false
	 */
	isChines: function (source) {
		var regex = /^[\u4E00-\u9FA5]+$/;
		return regex.test(source);
	},
	/**
	 * 判断字符串中是否包含指定字符串
	 *
	 * @param string:原始字符串
	 * @param substr:子字符串
	 * @param isIgnoreCase:忽略大小写
	 * @return boolean true或false
	 */
	isContains: function (string, substr, isIgnoreCase) {
		if (isIgnoreCase) {
			string = string.toLowerCase();
			substr = substr.toLowerCase();
		}
		var startChar = substr.substring(0, 1);
		var strLen = substr.length;
		for (var j = 0; j < string.length - strLen + 1; j++) {
			if (string.charAt(j) == startChar) { // 如果匹配起始字符,开始查找
				if (string.substring(j, j + strLen) == substr) { // 如果从j开始的字符与str匹配，那ok
					return true;
				}
			}
		}
		return false;
	},
	/**
	 *  返回字符串长度，去除空格
	 * @param str
	 * @returns {Number}
	 */
	strLength: function (str) {
		if (str === null || str === undefined) {
			return 0;
		}
		str = str.replace(/\s/g, "");
		return str.length;
	}
};

/**
 * 表单验证工具类
 */
var VerificationUtil = {
	/** 验证是否为电话号码（座机） */
	isTelephone: function (source) {
		var regex = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
		return regex.test(source);
	},
	/** 验证是否为手机号码 */
	isMobile: function (source) {
		// source = source.replace(/\s/g, "");//去除空格
		var regex = /^1[0-9]{10}$/;
		return regex.test(source);
	},
	/** 验证是否为电子邮箱 */
	isEmail: function (source) {
		var regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		return regex.test(source);
	},
	/** 验证身份证号是否正确 */
	isIdCard: function (num) {
		// num = num.replace(/\s/g, "");//去除空格
		if (isNaN(num)) {
			//return false;
		}
		var len = num.length;
		if (len < 15 || len > 18) {
			return false;
		}
		var rel = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
		// var re15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
		// var re18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x)$/i;
		// var res = (re15.test(num) || re18.test(num));
		var res = rel.test(num);
		if (res == false) {
			return false;
		}
		return res;
	},
    /** 验证是否为金额 */
    isMoney: function (source) {
        var regex = /^\d+(?:\.\d{1,2})?$/;
        return regex.test(source);
    },

};

/**
 * 日期处理工具类
 */
var DateUtils = {
	/**
	 * 校验时间格式
	 *
	 * @param timevale-String(日期字符串)
	 * @return boolean true或false
	 */
	checkTime: function (timevale) {
		var regex = /^(([0-1][0-9])|([2][0-4]))(\:)[0-5][0-9](\:)[0-5][0-9]$/g;
		return regex.test(timevale);
	},
	/**
	 * 判断闰年
	 *
	 * @param date-Date(日期对象)
	 * @return boolean true或false
	 */
	isLeapYear: function (date) {
		return (0 == date.getYear() % 4 && ((date.getYear() % 100 != 0) || (date.getYear() % 400 == 0)));
	},
	/**
	 * 日期对象转换为指定格式的字符串
	 *
	 * @param formatStr-String(日期格式,格式定义如下
	 *            yyyy-MM-dd HH:mm:ss)
	 * @param date-Date(日期对象,
	 *            如果缺省，则为当前时间--YYYY/yyyy/YY/yy 表示年份 MM/M 月份 W/w 星期 dd/DD/d/D 日期
	 *            hh/HH/h/H 时间 mm/m 分钟 ss/SS/s/S 秒)
	 * @return string(指定格式的时间字符串)
	 */
	dateToStr: function (formatStr, date) {
		formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
		date = arguments[1] || new Date();
		var str = formatStr;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];
		str = str.replace(/yyyy|YYYY/, date.getFullYear());
		str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
		str = str.replace(/MM/, date.getMonth() > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1));
		str = str.replace(/M/g, date.getMonth());
		str = str.replace(/w|W/g, Week[date.getDay()]);

		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
		str = str.replace(/d|D/g, date.getDate());

		str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
		str = str.replace(/h|H/g, date.getHours());
		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
		str = str.replace(/m/g, date.getMinutes());

		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
		str = str.replace(/s|S/g, date.getSeconds());

		return str;
	},
	/**
	 * 日期计算
	 *
	 * @param strInterval(string
	 *            可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒)
	 * @param num-int(需要加的数值(负数就是减))
	 * @param date-Date(日期对象)
	 * @return Date 返回日期对象
	 */
	dateAdd: function (strInterval, num, date) {
		date = arguments[2] || new Date();
		switch (strInterval) {
			case 's':
				return new Date(date.getTime() + (1000 * num));
			case 'n':
				return new Date(date.getTime() + (60000 * num));
			case 'h':
				return new Date(date.getTime() + (3600000 * num));
			case 'd':
				return new Date(date.getTime() + (86400000 * num));
			case 'w':
				return new Date(date.getTime() + ((86400000 * 7) * num));
			case 'm':
				return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			case 'y':
				return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
		}
	},
	/**
	 * 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
	 *
	 * @param strInterval-string(可选值
	 *            y 年 m月 d日 w星期 ww周 h时 n分 s秒)
	 * @param dtStart-Date
	 * @param dtEnd-Date
	 */
	dateDiff: function (strInterval, dtStart, dtEnd) {
		switch (strInterval) {
			case 's':
				return parseInt((dtEnd - dtStart) / 1000);
			case 'n':
				return parseInt((dtEnd - dtStart) / 60000);
			case 'h':
				return parseInt((dtEnd - dtStart) / 3600000);
			case 'd':
				return parseInt(((dtEnd - dtStart) / 86400000).toFixed(2));
			case 'w':
				return parseInt(((dtEnd - dtStart) / (86400000 * 7)).toFixed(2));
			case 'm':
				return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
			case 'y':
				return dtEnd.getFullYear() - dtStart.getFullYear();
		}
	},
	/**
	 * 字符串转换为日期对象
	 *
	 * @param date-Date(格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制)
	 */
	strToDate: function (dateStr) {
		var data = dateStr;
		var reCat = /(\d{1,4})/gm;
		var t = data.match(reCat);
		t[1] = t[1] - 1;
		eval('var d = new Date(' + t.join(',') + ');');
		return d;
	},
	/**
	 * 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
	 */
	strFormatToDate: function (formatStr, dateStr) {
		var year = 0;
		var start = -1;
		var len = dateStr.length;
		if ((start = formatStr.indexOf('yyyy')) > -1 && start < len) {
			year = dateStr.substr(start, 4);
		}
		var month = 0;
		if ((start = formatStr.indexOf('MM')) > -1 && start < len) {
			month = parseInt(dateStr.substr(start, 2)) - 1;
		}
		var day = 0;
		if ((start = formatStr.indexOf('dd')) > -1 && start < len) {
			day = parseInt(dateStr.substr(start, 2));
		}
		var hour = 0;
		if (((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len) {
			hour = parseInt(dateStr.substr(start, 2));
		}
		var minute = 0;
		if ((start = formatStr.indexOf('mm')) > -1 && start < len) {
			minute = dateStr.substr(start, 2);
		}
		var second = 0;
		if ((start = formatStr.indexOf('ss')) > -1 && start < len) {
			second = dateStr.substr(start, 2);
		}
		return new Date(year, month, day, hour, minute, second);
	},
	/**
	 * 日期对象转换为毫秒数
	 */
	dateToLong: function (date) {
		return date.getTime();
	},
	/**
	 * 毫秒转换为日期对象
	 */
	longToDate: function (dateVal) {
		return new Date(dateVal);
	},
	/**
	 * 毫秒转换为日期格式字符串(年月日时分秒)
	 */
	longToDateString: function (dateVal, str) {
		str = str || "-";
		var date = new Date(dateVal);
		var Y = date.getFullYear();
		var M = date.getMonth() + 1;
		var D = date.getDate();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		return Y +
			str + (M < 10 ? ('0' + M) : M) +
			str + (D < 10 ? ('0' + D) : D) +
			" " + (h < 10 ? ('0' + h) : h) +
			":" + (m < 10 ? ('0' + m) : m) +
			":" + (s < 10 ? ('0' + s) : s);
	},

	/**
	 * 毫秒转换为日期格式字符串(年月日时分秒)
	 */
	longToDateYMDHM: function (dateVal, str) {
		str = str || "-";
		var date = new Date(dateVal);
		var Y = date.getFullYear();
		var M = date.getMonth() + 1;
		var D = date.getDate();
		var h = date.getHours();
		var m = date.getMinutes();
		return Y +
			str + (M < 10 ? ('0' + M) : M) +
			str + (D < 10 ? ('0' + D) : D) +
			" " + (h < 10 ? ('0' + h) : h) +
			":" + (m < 10 ? ('0' + m) : m);
	},
	/**
	 * 毫秒转换为日期格式字符串(年月日)
	 */
	longToDateStringYMD: function (dateVal, str) {
		str = str || "-";
		var date = new Date(dateVal);
		var Y = date.getFullYear();
		var M = date.getMonth() + 1;
		var D = date.getDate();
		return Y +
			str + (M < 10 ? ('0' + M) : M) +
			str + (D < 10 ? ('0' + D) : D);
	},
	/**
	 * 判断字符串是否为日期格式
	 *
	 * @param str-string(字符串)
	 * @param formatStr-string(日期格式，如 yyyy-MM-dd)
	 */
	isDate: function (str, formatStr) {
		if (formatStr == null) {
			formatStr = "yyyyMMdd";
		}
		var yIndex = formatStr.indexOf("yyyy");
		if (yIndex == -1) {
			return false;
		}
		var year = str.substring(yIndex, yIndex + 4);
		var mIndex = formatStr.indexOf("MM");
		if (mIndex == -1) {
			return false;
		}
		var month = str.substring(mIndex, mIndex + 2);
		var dIndex = formatStr.indexOf("dd");
		if (dIndex == -1) {
			return false;
		}
		var day = str.substring(dIndex, dIndex + 2);
		if (!isNumber(year) || year > "2100" || year < "1900") {
			return false;
		}
		if (!isNumber(month) || month > "12" || month < "01") {
			return false;
		}
		if (day > getMaxDay(year, month) || day < "01") {
			return false;
		}
		return true;
	},
	getMaxDay: function (year, month) {
		if (month == 4 || month == 6 || month == 9 || month == 11)
			return "30";
		if (month == 2)
			if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)
				return "29";
			else
				return "28";
		return "31";
	},
	/**
	 * 把日期分割成数组 [年、月、日、时、分、秒]
	 */
	toArray: function (myDate) {
		myDate = arguments[0] || new Date();
		var myArray = Array();
		myArray[0] = myDate.getFullYear();
		myArray[1] = myDate.getMonth();
		myArray[2] = myDate.getDate();
		myArray[3] = myDate.getHours();
		myArray[4] = myDate.getMinutes();
		myArray[5] = myDate.getSeconds();
		return myArray;
	},
	/**
	 * 取得日期数据信息 参数 interval 表示数据类型 y 年 M月 d日 w星期 ww周 h时 n分 s秒
	 */
	datePart: function (interval, myDate) {
		myDate = arguments[1] || new Date();
		var partStr = '';
		var Week = ['日', '一', '二', '三', '四', '五', '六'];
		switch (interval) {
			case 'y':
				partStr = myDate.getFullYear();
				break;
			case 'M':
				partStr = myDate.getMonth() + 1;
				break;
			case 'd':
				partStr = myDate.getDate();
				break;
			case 'w':
				partStr = Week[myDate.getDay()];
				break;
			case 'ww':
				partStr = myDate.WeekNumOfYear();
				break;
			case 'h':
				partStr = myDate.getHours();
				break;
			case 'm':
				partStr = myDate.getMinutes();
				break;
			case 's':
				partStr = myDate.getSeconds();
				break;
		}
		return partStr;
	},
	/**
	 * 取得当前日期所在月的最大天数
	 */
	maxDayOfDate: function (date) {
		date = arguments[0] || new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() + 1);
		var time = date.getTime() - 24 * 60 * 60 * 1000;
		var newDate = new Date(time);
		return newDate.getDate();
	},
	/** 比较时间大小:start<=end返回false,start>end返回true */
	compareDate: function (start, end) {
		var startdate = new Date((start).replace(/-/g, "/"));
		var enddate = new Date((end).replace(/-/g, "/"));
		if (startdate <= enddate) {
			return false;
		}
		return true;
	}
};

var CheckBoxUtil = {
	/**
	 * 判断指定名称的复选框是否被选中
	 * @param chname复选框名称
	 */
	isChecked: function (chname) {
		var obj = $("[name='" + chname + "']");
		var isCheck = false;
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked == true) {
				isCheck = true;
				break;
			}
		}
		return isCheck;
	},
	/**
	 * 得到指定名称的复选框被选中个数
	 * @param  chname
	 */
	getCheckedCount: function (chname) {
		var obj = $("[name='" + chname + "']");
		var count = 0;
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].checked == true) {
				count++;
			}
		}
		return count;
	},
	/**
	 * 得到多个已选中的复选框的值
	 * @param   chname
	 */
	getCheckedVals: function (chname) {
		var arr = new Array();
		$("[name='" + chname + "'][checked]").each(function (index) {
			arr[index] = $(this).val();
		});
		return arr;
	},
	/**
	 * 得到所有复选框的值
	 * @param   chname
	 */
	getAllCheckboxVals: function (chname) {
		var arr = new Array();
		$("[name='" + chname + "']").each(function (index) {
			arr[index] = $(this).val();
		});
		return arr;
	},
	/**
	 * 复选框全选
	 * @param  chname
	 */
	setAllChecked: function (chname) {
		$("[name='" + chname + "']").each(function () {
			$(this).prop("checked", true);
		});
	},
	/**
	 * 复选框全不选(取消全选)
	 * @param  chname
	 */
	setAllUnChecked: function (chname) {
		$("[name='" + chname + "']").each(function () {
			$(this).prop("checked", false);
		});
	},

	/**
	 * 复选框反选
	 * @param  chname
	 */
	setInverChecked: function (chname) {
		$("[name='" + chname + "']").each(function () {
			if ($(this).is(':checked')) {
				$(this).prop("checked", false);
			} else {
				$(this).prop("checked", true);
			}
		});
	},
	/**
	 * 绑定全选/全不选
	 * @param  all_id 复选框id
	 * @param  chname
	 */
	bindCheckFun: function (all_id, chname) {
		$("#" + all_id).click(function () {
			if ($(this).is(':checked')) {
				CheckBoxUtil.setAllChecked("myckeck");
			} else {
				CheckBoxUtil.setAllUnChecked("myckeck");
			}
		});
	}
};

var StartsUtil = {
	/**
	 * 创建安全等级星数
	 * @param riskLevel(String) 安全等级字符串，必填
	 * @param eleId(String) 页面元素id，可不传（不传时，返回转化后的字符串，用于字符串拼接的方式展现）
	 */
	createStars: function(riskLevel, eleId) {
		var solidIcon = '<i class="iconfont icon-xingxing- c-icon-blue fs-12"></i>&nbsp;';
		var hollowIcon = '<i class="iconfont icon-xingxing- c-icon-gray fs-12"></i>&nbsp;';
		riskLevel = riskLevel ? riskLevel : '';
		var starCount = 0;
		switch (riskLevel) {
			case '保守型' : starCount = 4;break;
			case '稳健型' : starCount = 3;break;
			case '成长型' : starCount = 2;break;
			case '进取型' : starCount = 1;break;
		}
		var starsContent = '';
		for(var i = 0; i < 4; i++) {
			if(i < starCount){
				starsContent += solidIcon;
			} else {
				starsContent += hollowIcon;
			}
		}
		if(eleId) {
			$("#" + eleId).html(starsContent);
		} else {
			return starsContent;
		}
	}
};

/**
 * select控件处理工具
 */
var SelectUtil = {
    /**
     * 动态添加select控件的选项（直接添加）
     * @param jsonobj(json对象)
     * @param elemId(select控件ID)
     * @param value(设置option的value对应的key的名称，可不传，默认为value)
     * @param text(设置option的text对应的key的名称，可不传，默认为text)
     */
    addSelectOpts: function (jsonobj, elemId, value, text) {
        value = value ? value : 'value';
        text = text ? text : 'text';
        $.each(jsonobj, function (index, item) {
            var opt = '<option value="' + item[value] + '">' + item[text] + '</option>';
            $('#' + elemId).append(opt);
        });
    },
    /**
     * 动态添加select控件的选项（先删除旧的选项，再添加）
     */
    setSelectOpts: function (jsonobj, elemId, value, text) {
        SelectUtil.clearSelectOpt(elemId);
        SelectUtil.appendSelectOpt(elemId, '', '');
        SelectUtil.addSelectOpts(jsonobj, elemId, value, text);
    },
    /**
     * 清除select控件的所有选项
     * @param elemId(select控件ID)
     */
    clearSelectOpt: function (elemId) {
        $("#" + elemId).empty();
    },
    /**
     * 为Select追加一个Option
     * @param elemId(select控件ID)
     * @param elemId(要设置的值)
     * @param elemId(要显示的内容)
     */
    appendSelectOpt: function (elemId, value, text) {
        $('#' + elemId).append('<option value="' + value + '">' + text + '</option>');
    },
    /**
     * 为Select插入一个Option(第一个位置)
     * @param elemId(select控件ID)
     * @param elemId(要设置的值)
     * @param elemId(要显示的内容)
     */
    prependSelectOpt: function (elemId, value, text) {
        $('#' + elemId).prepend('<option value="' + value + '">' + text + '</option>');
    },
    /**
     * 获取选中的选项的值
     * @param elemId(select控件ID)
     */
    getSelectedValue:function (elemId) {
        return $('#' + elemId).find("option:selected").val();
    },
    /**
     * 获取选中的选项的内容
     * @param elemId(select控件ID)
     */
    getSelectedText:function (elemId) {
        return $('#' + elemId).find("option:selected").text();
    }
};


const LayTableUtil = {
    /**
     * 详细参考：https://www.layui.com/doc/modules/table.html#options
     *
     elem		必填	String/DOM	指定原始 table 容器的选择器或 DOM，方法渲染方式必填	"#demo"
     cols		必填	Array		设置表头。值是一个二维数组。方法渲染方式必填	详见表头参数
     ---------------------以下为异步接口参数--------------------------
     url		必填	String		接口地址。默认会自动传递两个参数：?page=1&limit=30（该参数可通过 request 自定义）
     page 		选填	number		代表当前页码、limit代表当前页码、limit 代表每页数据量
     method		选填	enum		接口http请求类型，默认：get
     where		选填	JSON		接口的其它参数。如：where: {token: 'sasasas', id: 123}
     contentType选填	String		发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
     headers	选填	JSON		接口的请求头。如：headers: {token: 'sasasas'}
     parseData	选填	String		数据预解析回调函数，用于将返回的任意数据格式解析成 table 组件规定的数据格式
     request	选填	JSON		用于对分页请求的参数：page、limit重新设定名称，如：
     request: {
					pageName: 'curr' //页码的参数名称，默认：page
					,limitName: 'nums' //每页数据量的参数名，默认：limit
				  }
     response	选填	JSON		table 组件默认规定的数据格式为：
     默认规定的数据格式layui.code
     {
       "code": 0,
       "msg": "",
       "count": 1000,
       "data": [{}, {}]
     }

     如果你想重新规定返回的数据格式，那么可以借助 response 参数，如：
     response: {
					statusName: 'status' //规定数据状态的字段名称，默认：code
					,statusCode: 200 //规定成功的状态码，默认：0
					,msgName: 'hint' //规定状态信息的字段名称，默认：msg
					,countName: 'total' //规定数据总数的字段名称，默认：count
					,dataName: 'rows' //规定数据列表的字段名称，默认：data
				  }
     ---------------------以上为异步接口参数--------------------------

     toolbar	选填	String/DOM/Boolean	开启表格头部工具栏区域，该参数支持四种类型值：
     toolbar: '#toolbarDemo' //指向自定义工具栏模板选择器
     toolbar: '<div>xxx</div>' //直接传入工具栏模板字符
     toolbar: true //仅开启工具栏，不显示左侧模板
     toolbar: 'default' //让工具栏左侧显示默认的内置模板

     defaultToolbar	选填	Array	自由配置头部工具栏右侧的图标，数组支持以下可选值：
     filter: 显示筛选图标
     exports: 显示导出图标
     print: 显示打印图标
     可根据值的顺序显示排版图标，如：defaultToolbar: ['filter', 'print', 'exports']
     width		选填	Number		设定容器宽度。table容器的默认宽度是跟随它的父元素铺满，你也可以设定一个固定值，当容器中的内容超出了该宽度时，会自动出现横向滚动条。
     height		选填	Number/String	设定容器高度	详见height
     cellMinWidth	选填	Number	全局定义所有常规单元格的最小宽度（默认：60），一般用于列宽自动分配的情况。其优先级低于表头参数中的 minWidth
     done		选填	Function	数据渲染完的回调。你可以借此做一些其它的操作	详见done回调
     data		选填	Array		直接赋值数据。既适用于只展示一页数据，也非常适用于对一段已知数据进行多页展示。
     totalRow	选填	Boolean		是否开启合计行区域。
     page		选填	Boolean/Object	开启分页，支持传入一个对象，里面可包含 laypage 组件所有支持的参数（jump、elem除外）	{theme: '#c00'}
     limit		选填	Number		每页显示的条数（默认：10）。值务必对应 limits 参数的选项。优先级低于 page 参数中的 limit 参数。
     limits		选填	Array		每页条数的选择项，默认：[10,20,30,40,50,60,70,80,90]。优先级低于 page 参数中的 limits 参数。
     loading	选填	Boolean		是否显示加载条（默认：true）。如果设置 false，则在切换分页时，不会出现加载条。该参数只适用于 url 参数开启的方式
     title		选填	String		定义 table 的大标题（在文件导出等地方会用到）
     text		选填	Object		自定义文本，如空数据时的异常提示等。
     autoSort	选填	Boolean		默认 true，即直接由 table 组件在前端自动处理排序。
     initSort	选填	Object		初始排序状态。用于在数据表格渲染完毕时，默认按某个字段排序。
     id			选填	String		设定容器唯一 id。该参数也可以自动从 <table id="test"></table> 中的 id 参数中获取。
     skin		选填	String		用于设定表格风格,line（行边框风格）;row（列边框风格）;nob（无边框风格）)
     even		选填	Boolean		开启隔行背景,true/false)
     size		选填	String		设定表格尺寸,sm（小尺寸）;lg（大尺寸）)
     */
    render: function (obj) {
        return laytable.render({
            elem: obj.elem
            , id: obj.id ? obj.id : null
            , height: obj.height ? obj.height : 'full-240'
            , width: obj.width ? obj.width : null
            , cellMinWidth: obj.cellMinWidth ? obj.cellMinWidth : 100
            , cols: obj.cols
            , url: obj.url
            , contentType: 'application/json'
            , method: obj.method ? obj.method : 'post'
            , page: obj.page ? {theme: '#009688'} : false
            , done: obj.done ?	obj.done : null
            , toolbar: obj.toolbar ? obj.toolbar : false
            , defaultToolbar: obj.defaultToolbar ? obj.defaultToolbar : null
            , title: obj.title ? obj.title : null
            , loading: true
            , totalRow: obj.totalRow ? true : false
            , limit: obj.limit ? obj.limit : 10
            , limits: obj.limits ? obj.limits : [10, 30, 50, 100]
            , text: {none: '未查询到相关数据'}
            , where: obj.where ? obj.where : null
            , request: obj.page ? {
                pageName: 'pageNum'
                , limitName: 'pageSize'
            } : null
            , response: {
                statusName: 'code'
                , statusCode: '20000'
                , msgName: 'message'
                , countName: 'total'
                , dataName: obj.page ? 'rows' : 'data'
            }
            , skin: obj.skin ? obj.skin : null
            , even: obj.even ? obj.even : null
            , size: obj.size ? obj.size : null
        });
    },
    reload: function (tableIns, whereFormId) {
        layer.load(1, {shade: [0.3, '#333'] /*透明度，背景色*/});
        tableIns.reload({
            page: {
                curr: 1 //重新从第 1 页开始
            }
            , where: whereFormId ? DataDeal.formToJsonObj($("#" + whereFormId)) : null
        });
        layer.closeAll('loading');
    },
    refresh: function (tableIns, whereFormId) {
        layer.load(1, {shade: [0.3, '#333'] /*透明度，背景色*/});
        tableIns.reload({
            where: whereFormId ? DataDeal.formToJsonObj($("#" + whereFormId)) : null
        });
        layer.closeAll('loading');
    }
};

/**
 * 绑定查询表单回车事件
 * @param formId
 */
function bindSearchFormEnterEvent(formId) {
    $("#" + formId).bind('keypress', function (event) {
        let theEvent = event || window.event;
        let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 13) {
            $(this).find('[data-search-btn="true"]').click();
        }
    });
}

$.ajaxSetup({
    cache: false, //关闭AJAX缓存
    async: false, //同步请求
    beforeSend: function (request) {
        request.setRequestHeader("X-Auth-Token", $.cookie('X-Auth-Token') || "");
    }
});