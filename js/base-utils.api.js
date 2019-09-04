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
            for (var i in result.data) {
                var code = result.data[i].provinceCode;
                var name = result.data[i].provinceName;
                $provinceSelect.append("<option name= '" + code + "'  value='" + name + "'>" + name + "</option>");
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
            for (var i in result.data) {
                var code = result.data[i].cityCode;
                var name = result.data[i].cityName;
                $citySelect.append("<option name= '" + code + "' value='" + name + "'>" + name + "</option>");
            }
        });
    },
    getAreas: function (cityCode, layer) {
        var $areasSelect = $("#areas");
        $areasSelect.empty();
        $areasSelect.append("<option value=''>请选择区(县)</option>");

        AjaxUtil.ajaxGetCallBack(commonApiUrl.getAreas + cityCode, function (result) {
            if (result.data.length == 0) {
                $areasSelect.append("<option name= '" + cityCode + "' value='市辖区'>市辖区</option>");
                return;
            }
            for (var i in result.data) {
                var code = result.data[i].areaCode;
                var name = result.data[i].areaName;
                $areasSelect.append("<option name= '" + code + "' value='" + name + "'>" + name + "</option>");
            }
        });
    },
    getBank: function (layer) {
        var $bank = $("#bank");
        $bank.empty();
        $bank.append("<option value=''>请选择开户行</option>");

        AjaxUtil.ajaxGetCallBack(commonApiUrl.getBank, function (result) {
            for (var i in result.data) {
                var code = result.data[i].bankCode;
                var name = result.data[i].bankName;
                $bank.append("<option  name= '" + code + "' value='" + name + "'>" + name + "</option>");
            }
        });
    },

    getBankBranch: function (bankCode, bankAreaCode, layer) {
        var data = {
            bankCode: bankCode,
            areaCode: bankAreaCode,
            bankBranchName: ""
        };
        var result = AjaxUtil.ajaxPostCallBack(commonApiUrl.getBankBranch, DataDeal.josnObjToString(data), function () {
            var TempArr = [];
            for (var i in result.data) {
                TempArr[i] = result.data[i].bankBranchName;
            }
            return TempArr;
        });
    }
};

var commonAPIUtil = {
    getCaptchaImg: function () {
        var result = AjaxUtil.ajaxGet(captchaApiUrl.getImgCode + "?r=" + Math.random());
        if (result) {
            $(".img-code").attr("src", result.data.base64Img);
            return result.data.captchaId;
        }
    },

    /**获取用户基本信息*/
    initUserInfo: function () {
        var userInfo;
        AjaxUtil.ajaxPostCallBack(userProfileApiUrl.getUserInfo, null, function (result) {
            userInfo = result.data;
        });
        return userInfo;
    },

    /**获取用户基本信息,token失效不跳转登录页面*/
    initUserInfoUnbindJump: function () {
        var userInfo;
        var res = AjaxUtil.ajaxPost(userProfileApiUrl.getUserInfo);
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
            layer.msg('由于您长时间未操作，请重新登录。', {time: 1000}, function () {
                CookieUtil.clearAllCookie();
                $_GLOBAL.jumpToLogin();
            });
        }
    },

    getUserAvailableBalance: function () {
        var availableBalance;
        var res = AjaxUtil.ajaxGetCallBack(userProfileApiUrl.balance, function (result) {
            availableBalance = result.data.availableBalanceAmt;
        });
        return availableBalance;
    },

};

var validateAPIUtil = {
    /** 判断当前用户是否具有借款资格*/
    checkRight: function () {
        var res = AjaxUtil.ajaxPost(loanApiUrl.checkRight);
        if (res) {
            if (res.data == true) {
                return true;
            } else {
                layer.msg(res.message);
            }
        }
        return false;
    },

    validateUserName: function (mobile) {
        var result = AjaxUtil.ajaxGet(userProfileApiUrl.validateUserName + mobile);
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


};