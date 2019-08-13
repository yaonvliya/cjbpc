var index = noticeIndex;
$(document).ready(function () {

	AjaxUtil.ajaxGetCallBack(indexApiUrl.announcementDetail + index, loadThisNotice);

	$(".goToNotice").click(function () {
		window.location.href = $_GLOBAL.basePath() + "/views/about/news.html";
	});
	
	$(".turn-page a").click(function () {
		index = $(this).attr('name');
		AjaxUtil.ajaxGetCallBack(indexApiUrl.announcementDetail + index, loadThisNotice);
	});
});

function loadThisNotice(result) {
	var data = result.data;

	$("#noticeTitle").html(data.ancTitle);
	$("#noticeText").html(data.ancContent);
	$("#noticeTime").text(DateUtils.longToDateString(data.ancTime, '-'));

	if(data.previousAncId){
		$("#preNotice").html(data.previousAncTitle).parent().show().attr("name", data.previousAncId).show();
	} else {
		$("#preNotice").empty().parent().hide();
	}

	if(data.nextAncId){
		$("#nextNotice").html(data.nextAncTitle).parent().show().attr("name", data.nextAncId).show();
	} else {
		$("#nextNotice").empty().parent().hide();
	}

//	var leftHeight = $('.content-left');
//	var rightHeight = $('.content-right');
//	leftHeight.height(rightHeight.height());
	// $(document).scrollTop(0);
}