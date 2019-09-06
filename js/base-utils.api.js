
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


};

var validateAPIUtil = {
    validateUserName: function (mobile) {
        var result = AjaxUtil.ajaxGet(userProfileApiUrl.validateUserName + mobile);
        if (result.code == '20000') {
            return result.data;
        } else {
            layer.msg(result.message);
            return false;
        }
    },



};