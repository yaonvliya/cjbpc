/* 这里列举了所有的api请求url */

// 通用接口
var commonApiUrl = {
	// 获取省份信息(get)
	getProvince: apiHost + apiContext +"/core/region/provinces",

	// 获取城市信息（需要拼接省份code）(get)
	getCity: apiHost + apiContext +"/core/region/cities/",

	// 获取区(县)信息（需要拼接城市code）(get)
	getAreas: apiHost + apiContext +"/core/region/areas/",

	// 获取企业开户银行列表(get)
	getBank: apiHost + apiContext +"/internal/user/deposit/deposit_support_banks",

	// 获取支行名称
	getBankBranch: apiHost + apiContext +"/core/bank/branch",

	// 获取服务器当前时间 (get)
	serverCurrentTime: apiHost + apiContext + "/internal/common/tools/current_server_time",

	// 计算预期收益
	expect: apiHost + apiContext + "/internal/finance/trade/cal_expect_proceeds"
};

//验证码接口
var captchaApiUrl = {
	// 获取UUID (get)
	uuid: apiHost + apiContext + "/internal/common/tools/uuid",

	// 获取图片验证码(get)
	getImgCode: apiHost + apiContext + "/internal/common/captcha/image",

	// 发送短信验证码（用户输入手机号）
	getSmsCode: apiHost + apiContext +"/internal/common/captcha/mobile/input",

	// 发送邮箱验证码（用户输入邮箱）
	getMailCode: apiHost + apiContext +"/internal/common/captcha/email/input",

	// 发送短信验证码（登录用户已绑定手机号）
	getSmsCodeBindMobile: apiHost + apiContext +"/internal/common/captcha/mobile/bind",

	// 发送邮箱验证码（登录用户已绑定邮箱）
	getMailCodeBindEmail: apiHost + apiContext +"/internal/common/captcha/email/bind"
};

// 首页
var indexApiUrl = {
	// 获取banner图
	banners: apiHost + apiContext +"/internal/common/home/banners",

	// 获取平台数据(get)
	platformData: apiHost + apiContext +"/internal/common/home/platformData",

	// 标的推荐(get)
	demandRecommend: apiHost + apiContext +"/internal/common/home/recommend",

	// 平台公告(get)
	announcements: apiHost + apiContext +"/internal/common/home/announcements",

	// 紧急公告(get)
	urgentAnnouncements: apiHost + apiContext +"/internal/common/home/urgent/announcement",

	// 常见问题(get)
	questions: apiHost + apiContext +"/internal/common/home/questions",

	// 平台公告列表
	announcementList: apiHost + apiContext + "/internal/common/platform/announcements",

	// 平台公告详情(get) 需拼接参数
	announcementDetail: apiHost + apiContext + "/internal/common/platform/announcement/",

	// 查询问题类型
	questionTypes: apiHost + apiContext + "/internal/common/faq/type/finance",

	// 查询问题
	faq : apiHost + apiContext + "/internal/common/faq/questions",

	// 问题分类查询 需拼接问题类型
	// questionClass: apiHost + apiContext + "/core/help/questions/"
};


// 用户基本信息接口
var userProfileApiUrl = {
	// 注册
	register: apiHost + apiContext + "/internal/user/account/register",

	// 登录
	login: apiHost + apiContext + "/internal/user/account/login",

	// 登出
	logout: apiHost + apiContext +"/internal/user/account/logout",

	// 销户
	closeAccount: apiHost + apiContext + "/internal/user/account/close",

	// 销户缴费
	payFreeForClose: apiHost + apiContext + "/internal/user/account/pay_fee_close",

	// 获取用户近期登录日志
	loginLogs: apiHost + apiContext +"/internal/user/account/recent_login_logs",

	// 获取用户金额显示开关(get)
	getUserSettings: apiHost + apiContext +"/internal/user/settings/showAmount/get",

	// 保存用户金额显示开关
	saveUserSetting: apiHost + apiContext +"/internal/user/settings/showAmount/save",

	// 获取用户信息(get)
	getUserInfo: apiHost + apiContext +"/internal/user/account/userInfo",

	// 获取登录用户加息券、红包个数
	getCouponCount: apiHost + apiContext + "/internal/user/account/couponCount",

	// 检查手机号是否已注册
	validateUserName: apiHost + apiContext +"/internal/user/account/check_mobile_exist",

	// 检查邮箱是否已被绑定
	validateEmail: apiHost + apiContext +"/internal/user/account/check_email_exist",

	// 短信身份验证(已登录用户）
	smsAuthUser: apiHost + apiContext + "/internal/common/identity_check/sms_with_login",

	// 短信身份验证(未登录用户）
	smsWithOutLogAuthUser: apiHost + apiContext + "/internal/common/identity_check/sms_without_login",

	// 邮箱身份验证（已登录用户）
	emailAuthUser: apiHost + apiContext + "/internal/common/identity_check/email_with_login",

	// 邮箱身份验证（未登录用户）
	emailWithOutLogAuthUser: apiHost + apiContext + "/internal/common/identity_check/email_without_login",

	// 重置登录密码
	resetLoginPwd: apiHost + apiContext +"/internal/user/account/reset_login_pass",

	// 修改登录密码
	modifyLoginPwd: apiHost + apiContext +"/internal/user/account/modify_login_pass",

	// 修改宝付交易密码 (宝付不支持修改交易密码)
	modifyTradePass: apiHost + apiContext + "/internal/user/deposit/modify_deposit_pass",

	// 重置存管交易密码[跳转宝付]
	resetTradePass: apiHost + apiContext + "/internal/user/deposit/reset_deposit_pass",

	// 实名-个人[跳转宝付]
	personalBandCard: apiHost + apiContext +"/internal/user/deposit/personal_open_deposit",

	// 实名-企业[跳转宝付]
	companyBandCard: apiHost + apiContext +"/internal/user/deposit/enterprise_open_deposit",

	// 获取存管系统网页类型API请求报文
	baoFuApiContext: apiHost + apiContext + "/internal/user/deposit/page_api_params",

	// 获取存管系统网页类型API请求报文
	baoFuResult: apiHost + apiContext + "/internal/user/deposit/page_api_result",

	// 修改登录手机号
	modifyPhone: apiHost + apiContext +"/internal/user/account/modify_login_mobile",

	// 绑定邮箱
	bindEmail: apiHost + apiContext + "/internal/user/account/bind_email",

	// 修改绑定邮箱
	modifyMail: apiHost + apiContext +"/internal/user/account/modify_bind_email",

	// 修改银行卡预留手机号[跳转宝付]
	modifyBankMobile: apiHost + apiContext +"/internal/user/deposit/modify_bank_mobile",

	// 解绑银行卡（个人）[直连接口]
	unbindCard: apiHost + apiContext + "/internal/user/deposit/personal_unbind_card",

	// 绑定银行卡（个人）[跳转宝付]
	bindCard: apiHost + apiContext + "/internal/user/deposit/personal_bind_card",

	// 用户授权[跳转宝付]
	authorization : apiHost + apiContext + "/internal/user/deposit/user_authorization",

	// 上传图片参数
	getUploadParam: apiHost + apiContext + "/internal/common/upload/get_upload_param",

	// 企业上传图片
	enterpriseUploadPic: apiHost + apiContext + "/internal/user/deposit/enterprise_upload_pic",

	// 用户风险测评等级设置
	riskLevel: apiHost + apiContext + "/internal/finance/account/set_risk_level"
};

// 用户卡券（红包、加息券）
var userCouponApiUrl = {
	// 获取可使用红包
	getAvailableCash: apiHost + apiContext +"/internal/finance/coupon/cash/list/available",

	// 获取已使用红包
	getUsedCash: apiHost + apiContext +"/internal/finance/coupon/cash/list/used",

	// 获取已过期红包
	getExpiredCash: apiHost + apiContext +"/internal/finance/coupon/cash/list/expired",

	// 获取可使用加息劵
	getAvailableInterest: apiHost + apiContext +"/internal/finance/coupon/interest/list/available",

	// 获取已使用加息劵
	getUsedInterest: apiHost + apiContext +"/internal/finance/coupon/interest/list/used",

	// 获取已过期加息劵
	getExpiredInterest: apiHost + apiContext +"/internal/finance/coupon/interest/list/expired",

	// 获取投资可用红包
	getCanUseCash: apiHost + apiContext + "/internal/finance/coupon/cash/list/available/invest",

	// 获取投资可用加息劵
	getCanUseInterest: apiHost + apiContext + "/internal/finance/coupon/interest/list/available/invest",

	// 获取红包详情 get
	cashCouponDetail: apiHost + apiContext + "/internal/finance/coupon/cash/detail/",

	// 获取加息券详情 get
	interestCouponDetail: apiHost + apiContext + "/internal/finance/coupon/interest/detail/"
};
// 平台相关其他接口
var platformApiUrl = {
	// 获取运营报告列表
	queryReportList: apiHost + apiContext + "/internal/common/report/queryOperationReportList",
	
	// 查询运营报告数据
	getReportDetail: apiHost + apiContext + "/internal/common/report/getOperationReportDetail",

};
// 用户账户接口
var userAccountApiUrl = {
	// 获取用户首页信息
	getUserOverview: apiHost + apiContext +"/internal/finance/account/overview",

	// 交易明细查询
	tradeDetails: apiHost + apiContext + "/internal/common/txn_detail/list",

	// 账户可用余额查询(get)
	getBalance: apiHost + apiContext + "/internal/user/deposit/user_balance",

	// 查询再投金额
	getInvestingMoney: apiHost + apiContext + "/internal/finance/invest/investing/money",

	// 网银充值[跳转宝付]
	netSliverRecharge : apiHost + apiContext + "/internal/user/deposit/net_sliver_recharge",

	// 快捷充值[跳转宝付]
	quickRecharge: apiHost + apiContext + "/internal/user/deposit/quick_recharge",

	// 提现[跳转宝付]
	withdraw: apiHost + apiContext +"/internal/user/deposit/withdraw",

	// 邀请好友信息(get)
	invitationFriends: apiHost + apiContext +"/core/user/account/invite/info",

	// 邀请好友记录
	invitationFriendsList: apiHost + apiContext +"/internal/finance/account/invite_records",

	// 用户投资记录（持有中）
	accountInvestPending: apiHost + apiContext +"/internal/finance/invest/records/ongoing",

	// 用户投资记录（已回款）
	accountInvesting: apiHost + apiContext +"/internal/finance/invest/records/repaid",

	// 用户投资记录（已流标）
	accountInvestBack: apiHost + apiContext +"/internal/finance/invest/records/aborted",

	// 用户投资详情
	investDetail: apiHost + apiContext +"/internal/finance/invest/detail",

	// 债权转让【可转让】
	accountTransferAllow: apiHost + apiContext +"/internal/finance/invest/records/transfer_allowed",

	// 债权转让【转让中】
	accountTransferring: apiHost + apiContext +"/internal/finance/transfer/list/ongoing",

	// 债权转让【已转让】
	accountTransferred: apiHost + apiContext +"/internal/finance/transfer/list/success",

	// 个人中心-债权转让-购买的债权【已购买】
	received: apiHost + apiContext + "/internal/finance/transfer/list/received",

	// 债权转让【转让】
	// investTransfer: apiHost + apiContext + "/core/user/account/invest/transfer",

	// 债权转让【转让取消】
	transferCancel: apiHost + apiContext + "/internal/finance/transfer/cancel",

	// 债权转让->转让页面->转让数据获取
	transferAble: apiHost + apiContext + "/internal/finance/invest/transfer_context",

	// 债权转让【转让】
	transfer: apiHost + apiContext + "/internal/finance/transfer/submit",

	// 债权转让-转让详情
	transferDetail: apiHost + apiContext + "/internal/finance/transfer/detail_for_user",

	// 获取合同地址
    getContract: apiHost + apiContext + "/internal/common/contract/url",

	// 回款日历
	getRepayPlanCalendar: apiHost + apiContext + "/internal/finance/invest/getRepayPlanCalendar"
};


// 投资、转让
var investApiUrl = {
	// 定向标用户投资权限认证
	tradeCheckAuth: apiHost + apiContext + "/internal/finance/trade/check_auth",

	// 获取标的类型(get)
	// demandType: apiHost + apiContext + "/core/invest/demandType",

	// 投资标列表查询
	investList: apiHost + apiContext + "/internal/finance/project/trade_list",

	// 转让标列表查询
	transferList: apiHost + apiContext + "/internal/finance/project/transfer_list",

	// 投资标详情
	investDetail: apiHost + apiContext + "/internal/finance/trade/info",

	// 转让标详情
	transferDetail: apiHost + apiContext + "/internal/finance/transfer/detail_for_purchase",

	/*//标的详情-项目信息
	tradeInfo: apiHost + apiContext + "/trade/info",*/

	// 投资标详情->借款信息
	loanDetail: apiHost + apiContext + "/internal/finance/trade/loaner_info",

	// 投资标详情->项目文件
	// loanFile: apiHost + apiContext + "/core/invest/demand/files",

	// 投资标详情->投资明细
	investInfo: apiHost + apiContext + "/internal/finance/trade/invest_list",

	// 投资标详情->安全保障
	// safeguard: apiHost + apiContext + "/core/invest/demand/safety-guarantee",

	// 投资标详情->风险提示
	// pointDanger: apiHost + apiContext + "/core/invest/demand/risk-warning",

	// 标的详情-贷后管理
	postLoanInfo: apiHost + apiContext + "/internal/finance/trade/post_loan_info",

	// 判断用户是否投资标的
	// checkInvest: apiHost + apiContext + "/core/invest/checkUserIsInvested",

	// 转让投资
	transferInvest: apiHost + apiContext + "/internal/finance/transfer/purchase",

	// 标的投资
	demandInvest: apiHost + apiContext + "/internal/finance/trade/invest"

};

//资金api
var capitalApiUrl={
	//收益计算器
	calculator: apiHost + apiContext + "/internal/finance/trade/calculator",
}
// 积分商城
// var pointMallApiUrl = {};