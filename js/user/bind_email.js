var SmsInterValObj,smsMsgFlag,imgCaptchaId,EmailInterValObj,emailMsgFlag;

$(document).ready(function () {
    var userInfo = commonAPIUtil.initUserInfo();
    $("#showMobile").text(userInfo.safeLoginAccount);

    validateForm();

    $("#authBtn").click(function(){
        if($("#authForm").valid()){
            if (!smsMsgFlag) {
                layer.msg("请先获取验证码！");
                return;
            }

            var data = DataDeal.formToJson($("#authForm").serialize());
            AjaxUtil.ajaxPostCallBack(userProfileApiUrl.smsAuthUser, data, function(result){
                clearInterval(SmsInterValObj);

                var operateToken = result.data;
                $("#identityCheckToken").val(operateToken);

                // 分步样式
                $(".two-step li").eq(0).addClass("pass");
                $(".two-step li:eq(1), .two-step li:eq(2)").addClass("active");

                $(".step-box-1").hide();
                $(".step-box-2").show();

                getImgCaptcha();
            });

        }
    });

    $("#bindEmailBtn").click(function(){
        if($("#bindEmailForm").valid()){
            if (!emailMsgFlag) {
                layer.msg("请先获取验证码！");
                return;
            }

            var data = DataDeal.formToJson($("#bindEmailForm").serialize());
            AjaxUtil.ajaxPostCallBack(userProfileApiUrl.bindEmail, data, function(result){
                clearInterval(EmailInterValObj);
                layer.msg('绑定邮箱成功！', {
                    time: 1000 //1秒关闭
                }, function () {
                    // 跳转至个人中心账户设置页面
                    $_GLOBAL.jumpToUserSettings();
                    //刷新页面图标变化
                    location.reload();
                });
            });

        }
    });

});

function validateForm() {
    $("#authForm").validate({
        rules:{
            smsCaptcha:{
                required: true,
            }
        },
        messages:{
            smsCaptcha:{
                required: "短信验证码不能为空",
            }
        },
        errorClass: "form-error-msg",
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
        },

    });

    $("#bindEmailForm").validate({
        rules:{
            email:{
                required: true,
                email: true,
            },
            emailCaptcha:{
                required: true,
            }
        },
        messages:{
            email:{
                required: "邮箱不能为空",
                email: "请输入有效的邮箱",
            },
            emailCaptcha:{
                required: "邮箱验证码不能为空",
            }
        },
        errorClass: "form-error-msg",
        errorElement: "span",
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
        },

    });
}

function getSmsCaptcha(obj){
    var data = {
        captchaBizType: $_GLOBAL.msgType.CHECK_IDENTITY_WITH_MOBILE
    };
    var result = AjaxUtil.ajaxPost(captchaApiUrl.getSmsCodeBindMobile, JSON.stringify(data));
    if(result && result.code == "20000"){
        layer.msg('发送成功');
        smsMsgFlag = true;
        SmsInterValObj = TimerUtil.setRemainTime(obj);
        $("#smsCaptcha").focus();
    } else {
        getImgCaptcha();
    }
}

function getImgCaptcha(){
    imgCaptchaId = commonAPIUtil.getCaptchaImg();
}

function getEmailCaptcha(obj){
    var email = $('#email').val();
    var imgCaptcha = $('#imgCaptcha').val();
    if(!VerificationUtil.isEmail(email)){
        layer.msg("请输入有效的邮箱");
        return;
    }
    if(StringUtil.isEmpty(imgCaptcha)){
        layer.msg("请输入图片验证码");
        return;
    }
    // 验证邮箱是否已绑定
    var emailFlag = validateAPIUtil.validateEmail(email);
    if(emailFlag){
        layer.msg("该邮箱已被绑定，请重新输入！");
        $("#email").focus();
        return;
    }

    var data = {
        imgCaptchaId: imgCaptchaId,
        imgCode: imgCaptcha,
        email: email,
        captchaBizType: $_GLOBAL.msgType.BIND_EMAIL
    };
    var result = AjaxUtil.ajaxPost(captchaApiUrl.getMailCode, JSON.stringify(data));
    if(result){
        if(result.code == "20000"){
            layer.msg('发送成功');
            emailMsgFlag = true;
            EmailInterValObj = TimerUtil.setRemainTime(obj);
            $("#emailCaptcha").focus();
        } else {
            layer.msg(result.message);
            getImgCaptcha();
        }
    }

}
