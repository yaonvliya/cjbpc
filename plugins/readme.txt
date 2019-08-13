本文档将详细解释plugins目录下的所有插件名称和用途

>>  插件名称：layui
	功能说明：经典模块化前端框架(引入layui.css、layui.js)
	使用规范：独立模块，不依赖任何库，可以单独作为框架使用，参考：http://www.layui.com/demo/
	
>>  插件名称：select2
	功能说明：下拉框select功能扩展和美化插件(引入select2.min.css、select2.js)
	使用规范：依赖jquery,参考：http://www.cnblogs.com/landeanfen/p/5099332.html
					或     http://select2.github.io/examples.html

>>  插件名称：swiper
	功能说明：轮播图(引入swiper.min.css、swiper.min.js)
	使用规范：依赖jquery

>>  插件名称：validate
	功能说明：jquery 表单验证插件(引入jquery.validate.min.js、messages_zh.min.js)
	使用规范：依赖jquery，参考：http://www.runoob.com/jquery/jquery-plugin-validate.html
	特别说明：additional-methods.min.js是扩展插件，允许添加自定义验证方式，一般情况下jquery.validate已经够用了
			源码参考：http://www.souvc.com/?p=2511

>>  插件名称：QR-code
    功能说明：生成二维码（引入jquery.qrcode.min.js，和excanvas.compiled.js（画二维码））

>>  插件名称：pdfJs
    功能说明：预览PDF文件
    使用说明：<a target="_blank" href="../../plugins/pdfJs/web/viewer.html?file=url"> url为下载PDF文件的路径。没有参数会预览默认的PDF文件
    cmaps文件夹下边的.bcmap文件是PDF的字符映射文件，把ASCII码转为各地方言的文件。

