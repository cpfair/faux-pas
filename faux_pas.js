$(function(){
	var frame = $("iframe").get(0);
	if (!frame) {
		frame = $("frame", parent.document).get(1);
	}
	frame.contentWindow.addEventListener("hashchange", function(){
		var in_watchfaces = frame.contentWindow.location.hash.indexOf("watchfaces") >= 0;
		$(".header-area .apps").toggleClass("active", !in_watchfaces);
		$(".header-area .faces").toggleClass("active", in_watchfaces);

		var app_id = frame.contentWindow.location.hash.match(/[a-f0-9]{24}/);
		$(".header-link").toggle(!!app_id);
		if (app_id) {
			$(".header-link a").attr("href", "https://apps.getpebble.com/applications/" + app_id)
		}
	}, false);

	$(".header-back").click(function(){
		frame.contentWindow.history.go(-1);
	});
	$(".header-search").click(function(){
		frame.contentWindow.location.hash = "/search/watchapps";
	});
	$(".header-area .apps").click(function(){
		frame.contentWindow.location.hash = "/";
	});
	$(".header-area .faces").click(function(){
		frame.contentWindow.location.hash = "/watchfaces";
	});
	$(".fullscreen-button").click(function(){
		$("body").addClass("fullscreen");
	});

});
