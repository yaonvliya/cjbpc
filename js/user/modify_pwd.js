$(document).ready(function () {
    validateForm();
});

function validateForm(){
    $("#modifyPwdForm").validate({
        rules:{
            oldPass:{
                required: true,
            },
            newPass:{
                required: true,
                pwd: true,
            },
            confirmNewPass:{
                required: true,
                equalTo: "#newPass"
            }
        },
        messages:{
            oldPass:{
                required: "旧密码不能为空",
            },
            newPass:{
                required: "新密码不能为空",
                pwd: "密码为数字、字母、字符2种及以上组合的8-20位字符"
            },
            confirmNewPass:{
                required: "确认新密码不能为空",
                equalTo: "两次密码输入不一致"
            },
        },
        errorClass: "form-error-msg",
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
        },

    });
}

function modifyPwd() {
    if($("#modifyPwdForm").valid()){
        var data = DataDeal.formToJson($("#modifyPwdForm").serialize());
        AjaxUtil.ajaxPostCallBack(userProfileApiUrl.modifyLoginPwd, data, function (result) {
            layer.msg("登录密码修改成功", {time: 1000}, function(){
                //清除所有cookie
                CookieUtil.clearAllCookie();
                // 跳转至登录
                $_GLOBAL.jumpToLogin();
            });
        });
    }
}