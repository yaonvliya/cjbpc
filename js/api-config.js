/* 这里列举了所有的api请求url */

// 通用接口
var commonApiUrl = {
	//获取省份信息(get)
	getProvince: apiHost + apiContext +"/core/region/provinces",

	//获取城市信息（需要拼接省份code）(get)
	getCity: apiHost + apiContext +"/core/region/cities/",

	//获取区(县)信息（需要拼接城市code）(get)
	getAreas: apiHost + apiContext +"/core/region/areas/",

	//获取银行列表(get)
	getBank: apiHost + apiContext +"/front/user/deposit/deposit_support_banks",

	//获取支行名称
	getBankBranch: apiHost + apiContext +"/core/bank/branch",

	//获取服务器当前时间
	serverCurrentTime: apiHost + apiContext + "/front/common/tools/current_server_time",

	// 计算预期收益
	expect: apiHost + apiContext + "/front/finance/trade/cal_expect_proceeds",

	// 获取UUID
	uuid: apiHost + apiContext + "/common/tools/uuid",

	//获取文件上传参数
	getUploadParam: apiHost + apiContext + "/front/common/upload/get_upload_param",
	
	// 交易明细查询
	tradeDetails: apiHost + apiContext + "/front/common/txn_detail/list"
};

//验证码接口
var captchaApiUrl = {

	// 获取图片验证码(get)
	getImgCode: apiHost + apiContext + "/front/common/captcha/image",

	// 获取短信验证码 需传入手机号码、图片验证码参数
	getSmsCode: apiHost + apiContext +"/front/common/captcha/mobile/input",

	// 获取邮箱验证码 需传入邮箱、图片验证码参数
	getMailCode: apiHost + apiContext +"/front/common/captcha/email/input",

	//获取短信验证码（登录账户） 不需传入手机号码、图片验证码参数
	getSmsCodeBindMobile: apiHost + apiContext +"/front/common/captcha/mobile/bind",

	// 获取邮箱验证码（登录账户） 不需传入邮箱、图片验证码参数
	getMailCodeBindEmail: apiHost + apiContext +"/front/common/captcha/email/bind"

};

var depositApiUrl = {
    //获取存管API上下文
    depositApiContext: apiHost + apiContext + "/front/user/deposit/page_api_params",

    //获取存管API调用结果
    depositResult: apiHost + apiContext + "/front/user/deposit/page_api_result"
};

// 用户基本信息接口
var userProfileApiUrl = {
	// 用户登录
	login: apiHost + apiContext + "/front/user/login",

	// 用户登出
	logout: apiHost + apiContext +"/front/user/logout",

	// 销户
	closeAccount: apiHost + apiContext + "/front/user/account/close",

	// 销户缴费
	payFreeForClose: apiHost + apiContext + "/front/user/account/pay_fee_close",

	// 获取用户近期登录日志
	loginLogs: apiHost + apiContext +"/front/user/account/recent_login_logs",

	// 注册
	register: apiHost + apiContext + "/front/user/account/register",

	// 获取用户个人设置(get)
	getUserSettings: apiHost + apiContext +"/front/user/settings/get",

	// 获取用户信息(get)
	getUserInfo: apiHost + apiContext +"/front/user/userInfo",

	// 获取借款用户信息
	getLoanerInfo: apiHost + apiContext +"/front/loan/user/info",

	// 用户名校验
	validateUserName: apiHost + apiContext +"/front/user/checkMobileExist",

	// 邮箱校验
	validateEmail: apiHost + apiContext +"/front/user/account/check_email_exist",

	// 短信身份验证(已登录用户）
	smsAuthUser: apiHost + apiContext + "/front/common/identity_check/sms_with_login",

	// 短信身份验证(未登录用户）
	smsWithOutLogAuthUser: apiHost + apiContext + "/front/common/identity_check/sms_without_login",

	// 邮箱身份验证（已登录用户）
	emailAuthUser: apiHost + apiContext + "/front/common/identity_check/email_with_login",

	// 邮箱身份验证（未登录用户）
	emailWithOutLogAuthUser: apiHost + apiContext + "/front/common/identity_check/email_without_login",

	// 重置登录密码
	resetLoginPwd: apiHost + apiContext +"/front/user/account/reset_login_pass",

	// 修改登录密码
	modifyLoginPwd: apiHost + apiContext +"/front/user/modifyLoginPwd",

	// 修改存管交易密码
	modifyTradePass: apiHost + apiContext + "/front/user/deposit/modify_deposit_pass",

	// 重置存管交易密码
	resetTradePass: apiHost + apiContext + "/front/user/deposit/reset_deposit_pass",

	//个人开通存管
	personalOpenAccount: apiHost + apiContext +"/front/user/deposit/personal_open_deposit",

	//企业开通存管
	companyOpenAccount: apiHost + apiContext +"/front/user/deposit/enterprise_open_deposit",

	//修改绑定手机
	modifyPhone: apiHost + apiContext +"/front/user/account/modify_login_mobile",

	// 绑定邮箱
	bindEmail: apiHost + apiContext + "/front/user/account/bind_email",

	//修改绑定邮箱
	modifyMail: apiHost + apiContext +"/front/user/account/modify_bind_email",

	//修改银行卡预留手机
	modifyBankMobile: apiHost + apiContext +"/front/user/deposit/modify_bank_mobile",

	// 解绑银行卡（个人）
	unbindCard: apiHost + apiContext + "/front/user/deposit/personal_unbind_card",

	// 绑定银行卡（个人）
	bindCard: apiHost + apiContext + "/front/user/deposit/personal_bind_card",

	//用户授权[跳转存管]
	authorization : apiHost + apiContext + "/front/user/deposit/user_authorization",

    //用户余额查询
    balance : apiHost + apiContext + "/front/user/deposit/user_balance",

    // 企业上传图片参数
    enterpriseUploadParam: apiHost + apiContext + "/front/user/deposit/enterprise_upload_param",

    // 企业上传图片
    enterpriseUploadPic: apiHost + apiContext + "/front/user/deposit/enterprise_upload_pic",

    // 获取账户总览
    getAccountOverView: apiHost + apiContext +"/front/user/accountOverview",
};

//账户api
var userAccountApiUrl = {
    // 网银充值
    netSliverRecharge : apiHost + apiContext + "/front/user/deposit/net_sliver_recharge",

    // 快捷充值
    quickRecharge: apiHost + apiContext + "/front/user/deposit/quick_recharge",

    //账户提现
    withdraw: apiHost + apiContext +"/front/user/deposit/withdraw"

};

//借款用户api
var loanUserApiUrl = {
	//个人完善资料
	personalUploadInfo: apiHost + apiContext + "/front/loan/center/personal_cert_upload",
    //企业完善资料
    companyUploadInfo: apiHost + apiContext + "/front/loan/center/enterprise_cert_upload",
	//更新资料
	updateUploadInfo: apiHost + apiContext + "/front/loan/center/update_cert_upload",
	//获取账户信息
    getUserAccountInfo: apiHost + apiContext + "/front/loan/center/account_info"

};

//借款api
var loanApiUrl = {
    // 判断当前用户是否具有借款资格
    checkRight: apiHost + apiContext + "/front/loan/apply/check_right",
    //获取所属商户列表
    getMerchantList: apiHost + apiContext + "/front/loan/apply/merchantList",
    //获取商户下产品列表
    getProductList: apiHost + apiContext + "/front/loan/apply/productList",
    //获取产品下借款期限列表
    getLoanTermList: apiHost + apiContext + "/front/loan/apply/loanTermList",
    //获取借款期限下子产品
    getProductItemList: apiHost + apiContext + "/front/loan/apply/productItemList",
    //提交借款申请
    loanApply: apiHost + apiContext + "/front/loan/apply/commit",

	//所有商户授信
    getCreditList: apiHost + apiContext + "/front/loan/apply/creditList",
	//我的借款列表
    getApplyList: apiHost + apiContext + "/front/loan/center/apply_list",
    //我的借款详情
    getApplyDetail: apiHost + apiContext + "/front/loan/center/apply_detail",
    //我的还款列表
    getRepayList: apiHost + apiContext + "/front/loan/center/to_repay_list",
	// 获取用户已还款列表
	getRepaidList: apiHost + apiContext + "/front/loan/center/repaid_list",
    //我的还款详情
    getRepayDetail: apiHost + apiContext + "/front/loan/center/repay_plan_detail",
	//获取还款信息
    getRepayInfo: apiHost + apiContext + "/front/loan/common/repay_info",
    //还款
    repay: apiHost + apiContext + "/front/loan/common/repay",
    //缴纳服务费
    payFee: apiHost + apiContext + "/front/loan/apply/payServiceFee",
	//获取上传参数
	getUploadParam: apiHost + apiContext + "/front/common/upload/get_upload_param",
	// 申请代偿
	applyCompensatory: apiHost + apiContext + "/front/loan/center/apply_compensatory",
	// 撤销代偿
	cancelCompensatory: apiHost + apiContext + "/front/loan/center/cancel_compensatory"

};

var contractApiUrl = {
    //获取合同地址
    getContract: apiHost + apiContext + "/front/common/contract/url"
};


var productApiUrl = {
    //获取产品列表
    getProductList: apiHost + apiContext + "/front/product/queryList",
    //获取产品详情
    getProductDetail: apiHost + apiContext + "/front/product/queryList"
};

var projectApiUrl = {
    //获取产品列表
    getProjectList: apiHost + apiContext + "/front/project/queryList",
    //获取产品详情
    getProjectDetail: apiHost + apiContext + "/front/project/get"
};

var repayPlanApiUrl = {
    //获取产品列表
    getRepayPlanList: apiHost + apiContext + "/front/repayPlan/queryList",
    //获取产品详情
    getRepayPlanDetail: apiHost + apiContext + "/front/repayPlan/get"
};