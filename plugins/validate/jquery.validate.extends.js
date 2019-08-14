!function (a) {
	"function" == typeof define && define.amd ? define(["jquery", "./additional-methods.min.js"], a) : a(jQuery)
}(function (a) {

	// 手机号码验证
	jQuery.validator.addMethod("mobile", function (value, element) {
		var length = value.length;
		var regex = /^1[0-9]{10}$/;
		return this.optional(element) || (length == 11 && regex.test(value));
	}, "手机号码格式错误");

	// 邮箱验证
	jQuery.validator.addMethod("email", function (value, element) {
		var regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		return this.optional(element) || regex.test(value);
	}, "手机号码格式错误");


	// 电话号码验证
	jQuery.validator.addMethod("telphone", function (value, element) {
		var regex = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
		return this.optional(element) || (regex.test(value));
	}, "电话号码格式错误");

	// 邮政编码验证
	jQuery.validator.addMethod("postalCode", function (value, element) {
		var regex = /^[0-9]{6}$/;
		return this.optional(element) || (regex.test(value));
	}, "邮政编码格式错误");

	// QQ号码验证
	jQuery.validator.addMethod("qq", function (value, element) {
		var regex = /^[1-9]\d{4,12}$/;
		return this.optional(element) || (regex.test(value));
	}, "qq号码格式错误");

	// 密码验证(只允许6-16位英文字母、数字和下画线)
	jQuery.validator.addMethod("pwd", function (value, element) {
		var regex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*_]+$)[a-zA-Z\d!@#$%^&*_]{8,20}$/;
		return this.optional(element) || (regex.test(value));
	}, "密码必须是8-20位且为数字、字母、字符至少2种以上组合");

	// 验证新旧值不一致
	jQuery.validator.addMethod("notEqualTo", function (value, element, notEqualElement) {
		return this.optional(element) || (value != $(notEqualElement).val());
	}, "新旧值不允许一致");

	// 验证身份证号是否正确
	jQuery.validator.addMethod("idCard", function (value, element) {
		var len = value.length;
		if (len < 15 || len > 18) {
			return false;
		}
		var rel = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
		var regex = rel.test(value);

		return this.optional(element) || (regex);
	}, "身份证号格式错误");

    // 验证营业执照号是否正确
    jQuery.validator.addMethod("businessLicenseNo", function (value, element) {
        var rel = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
        var regex = rel.test(value);

        return this.optional(element) || (regex);
    }, "营业执照号格式错误");

	// IP地址验证
	jQuery.validator.addMethod("ip", function (value, element) {
		var regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return this.optional(element) || (regex.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
	}, "Ip地址格式错误");

	// 字母和数字的验证
	jQuery.validator.addMethod("chrnum", function (value, element) {
		var regex = /^([a-zA-Z0-9]+)$/;
		return this.optional(element) || (regex.test(value));
	}, "只能输入数字和字母(字符A-Z, a-z, 0-9)");

	// 6位交易密码
	jQuery.validator.addMethod("payPasswordNum", function (value, element) {
		var regex = /^([0-9]{6})$/;
		return this.optional(element) || (regex.test(value));
	}, "请输入6位数字的交易密码");

	// 校验银行卡位数（16-21）位
	jQuery.validator.addMethod("bankCardNum", function (value, element) {
		// value = value.replace(/\s/g, "");//去除空格
		var regex = /^([1-9]{1})(\d{14,18})$/;
		return this.optional(element) || (regex.test(value));
	}, "请检查银行卡位数");

	// 中文的验证
	jQuery.validator.addMethod("chinese", function (value, element) {
		var regex = /^[\u4e00-\u9fa5]+$/;
		return this.optional(element) || (regex.test(value));
	}, "只能输入中文");

	// 下拉框验证
	$.validator.addMethod("selectNone", function (value, element) {
		return value.indexOf("请选择") > 0 || value == "";
	}, "必须选择一项");

	// 下拉框验证
	$.validator.addMethod("money", function (value, element) {
		var regex = /^\d+(?:\.\d{1,2})?$/;
		return this.optional(element) || (regex.test(value));
	}, "非法金额");

	// 字节长度验证
	jQuery.validator.addMethod("byteRangeLength", function (value, element, param) {
		var length = value.length;
		for (var i = 0; i < value.length; i++) {
			if (value.charCodeAt(i) > 127) {
				length++;
			}
		}
		return this.optional(element) || (length >= param[0] && length <= param[1]);
	}, $.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)"));
});

