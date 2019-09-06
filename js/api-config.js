/* 这里列举了所有的api请求url */

// 通用接口
var commonApiUrl = {

    //获取文件上传参数
    getUploadParam: apiHost + "/front/common/upload/get_upload_param",

    // 交易明细查询
    tradeDetails: apiHost + "/front/common/txn_detail/list"
};

//验证码接口
var captchaApiUrl = {

    // 获取图片验证码(get)
    getImgCode: apiHost + "/common/captcha/image",

    // 获取短信验证码 需传入手机号码、图片验证码参数
    getSmsCode: apiHost + "/common/captcha/mobile/input",

    //获取短信验证码（登录账户） 不需传入手机号码、图片验证码参数
    getSmsCodeBindMobile: apiHost + "/common/captcha/mobile/bind",


};


// 用户基本信息接口
var userProfileApiUrl = {
    // 用户登录
    login: apiHost + "/front/user/login",

    // 用户登出
    logout: apiHost + "/front/user/logout",

    // 获取用户信息(get)
    getUserInfo: apiHost + "/front/user/userInfo",

    // 获取借款用户信息
    getLoanerInfo: apiHost + "/front/loan/user/info",

    // 用户名校验
    validateUserName: apiHost + "/front/user/checkMobileExist/",

    // 短信身份验证(未登录用户）
    smsWithOutLogAuthUser: apiHost + "/front/common/identityCheck/smsWithoutLogin",

    // 重置登录密码
    resetLoginPwd: apiHost + "/front/user/resetLoginPass",

    // 修改登录密码
    modifyLoginPwd: apiHost + "/front/user/modifyLoginPwd",

    // 获取账户总览
    getAccountOverView: apiHost + "/front/user/accountOverview",
};


var contractApiUrl = {
    //获取合同地址
    getContract: apiHost + "/front/common/contract/url"
};


var productApiUrl = {
    //获取产品列表
    getProductList: apiHost + "/front/product/queryList",
    //获取产品详情
    getProductDetail: apiHost + "/front/product/queryList"
};

var projectApiUrl = {
    //获取产品列表
    getProjectList: apiHost + "/front/project/queryList",
    //获取产品详情
    getProjectDetail: apiHost + "/front/project/get"

};

var repayPlanApiUrl = {
    //获取产品列表
    getRepayPlanList: apiHost + "/front/repayPlan/queryList",
    //获取产品详情
    getRepayPlanDetail: apiHost + "/front/repayPlan/get"
};