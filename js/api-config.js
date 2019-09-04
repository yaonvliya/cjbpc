/* 这里列举了所有的api请求url */

// 通用接口
var commonApiUrl = {

    //获取服务器当前时间
    serverCurrentTime: apiHost + "/front/common/tools/current_server_time",

    // 计算预期收益
    expect: apiHost + "/front/finance/trade/cal_expect_proceeds",

    // 获取UUID
    uuid: apiHost + "/common/tools/uuid",

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

    // 获取邮箱验证码 需传入邮箱、图片验证码参数
    getMailCode: apiHost + "/common/captcha/email/input",

    //获取短信验证码（登录账户） 不需传入手机号码、图片验证码参数
    getSmsCodeBindMobile: apiHost + "/common/captcha/mobile/bind",

    // 获取邮箱验证码（登录账户） 不需传入邮箱、图片验证码参数
    getMailCodeBindEmail: apiHost + "/common/captcha/email/bind"

};


// 用户基本信息接口
var userProfileApiUrl = {
    // 用户登录
    login: apiHost + "/front/user/login",

    // 用户登出
    logout: apiHost + "/front/user/logout",

    // 销户
    closeAccount: apiHost + "/front/user/account/close",

    // 销户缴费
    payFreeForClose: apiHost + "/front/user/account/pay_fee_close",

    // 获取用户近期登录日志
    loginLogs: apiHost + "/front/user/account/recent_login_logs",

    // 注册
    register: apiHost + "/front/user/account/register",

    // 获取用户个人设置(get)
    getUserSettings: apiHost + "/front/user/settings/get",

    // 获取用户信息(get)
    getUserInfo: apiHost + "/front/user/userInfo",

    // 获取借款用户信息
    getLoanerInfo: apiHost + "/front/loan/user/info",

    // 用户名校验
    validateUserName: apiHost + "/front/user/checkMobileExist/",

    // 邮箱校验
    validateEmail: apiHost + "/front/user/account/check_email_exist",

    // 短信身份验证(已登录用户）
    smsAuthUser: apiHost + "/front/common/identity_check/sms_with_login",

    // 短信身份验证(未登录用户）
    smsWithOutLogAuthUser: apiHost + "/front/common/identity_check/sms_without_login",

    // 邮箱身份验证（已登录用户）
    emailAuthUser: apiHost + "/front/common/identity_check/email_with_login",

    // 邮箱身份验证（未登录用户）
    emailWithOutLogAuthUser: apiHost + "/front/common/identity_check/email_without_login",

    // 重置登录密码
    resetLoginPwd: apiHost + "/front/user/account/reset_login_pass",

    // 修改登录密码
    modifyLoginPwd: apiHost + "/front/user/modifyLoginPwd",

    // 修改存管交易密码
    modifyTradePass: apiHost + "/front/user/deposit/modify_deposit_pass",

    // 重置存管交易密码
    resetTradePass: apiHost + "/front/user/deposit/reset_deposit_pass",

    //个人开通存管
    personalOpenAccount: apiHost + "/front/user/deposit/personal_open_deposit",

    //企业开通存管
    companyOpenAccount: apiHost + "/front/user/deposit/enterprise_open_deposit",

    //修改绑定手机
    modifyPhone: apiHost + "/front/user/account/modify_login_mobile",

    // 绑定邮箱
    bindEmail: apiHost + "/front/user/account/bind_email",

    //修改绑定邮箱
    modifyMail: apiHost + "/front/user/account/modify_bind_email",

    //修改银行卡预留手机
    modifyBankMobile: apiHost + "/front/user/deposit/modify_bank_mobile",

    // 解绑银行卡（个人）
    unbindCard: apiHost + "/front/user/deposit/personal_unbind_card",

    // 绑定银行卡（个人）
    bindCard: apiHost + "/front/user/deposit/personal_bind_card",

    //用户授权[跳转存管]
    authorization: apiHost + "/front/user/deposit/user_authorization",

    //用户余额查询
    balance: apiHost + "/front/user/deposit/user_balance",

    // 企业上传图片参数
    enterpriseUploadParam: apiHost + "/front/user/deposit/enterprise_upload_param",

    // 企业上传图片
    enterpriseUploadPic: apiHost + "/front/user/deposit/enterprise_upload_pic",

    // 获取账户总览
    getAccountOverView: apiHost + "/front/user/accountOverview",
};

//账户api
var userAccountApiUrl = {
    // 网银充值
    netSliverRecharge: apiHost + "/front/user/deposit/net_sliver_recharge",

    // 快捷充值
    quickRecharge: apiHost + "/front/user/deposit/quick_recharge",

    //账户提现
    withdraw: apiHost + "/front/user/deposit/withdraw"

};

//借款用户api
var loanUserApiUrl = {
    //个人完善资料
    personalUploadInfo: apiHost + "/front/loan/center/personal_cert_upload",
    //企业完善资料
    companyUploadInfo: apiHost + "/front/loan/center/enterprise_cert_upload",
    //更新资料
    updateUploadInfo: apiHost + "/front/loan/center/update_cert_upload",
    //获取账户信息
    getUserAccountInfo: apiHost + "/front/loan/center/account_info"

};

//借款api
var loanApiUrl = {
    // 判断当前用户是否具有借款资格
    checkRight: apiHost + "/front/loan/apply/check_right",
    //获取所属商户列表
    getMerchantList: apiHost + "/front/loan/apply/merchantList",
    //获取商户下产品列表
    getProductList: apiHost + "/front/loan/apply/productList",
    //获取产品下借款期限列表
    getLoanTermList: apiHost + "/front/loan/apply/loanTermList",
    //获取借款期限下子产品
    getProductItemList: apiHost + "/front/loan/apply/productItemList",
    //提交借款申请
    loanApply: apiHost + "/front/loan/apply/commit",

    //所有商户授信
    getCreditList: apiHost + "/front/loan/apply/creditList",
    //我的借款列表
    getApplyList: apiHost + "/front/loan/center/apply_list",
    //我的借款详情
    getApplyDetail: apiHost + "/front/loan/center/apply_detail",
    //我的还款列表
    getRepayList: apiHost + "/front/loan/center/to_repay_list",
    // 获取用户已还款列表
    getRepaidList: apiHost + "/front/loan/center/repaid_list",
    //我的还款详情
    getRepayDetail: apiHost + "/front/loan/center/repay_plan_detail",
    //获取还款信息
    getRepayInfo: apiHost + "/front/loan/common/repay_info",
    //还款
    repay: apiHost + "/front/loan/common/repay",
    //缴纳服务费
    payFee: apiHost + "/front/loan/apply/payServiceFee",
    //获取上传参数
    getUploadParam: apiHost + "/front/common/upload/get_upload_param",
    // 申请代偿
    applyCompensatory: apiHost + "/front/loan/center/apply_compensatory",
    // 撤销代偿
    cancelCompensatory: apiHost + "/front/loan/center/cancel_compensatory"

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