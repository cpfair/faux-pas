$(function(){
	var frame = $("iframe").get(0);
	if (!frame) {
		frame = $("frame", parent.document).get(1);
	}

	var current_app_id;

	frame.contentWindow.addEventListener("hashchange", function(){
		var in_watchfaces = frame.contentWindow.location.hash.indexOf("watchfaces") >= 0;
		$(".header-area .apps").toggleClass("active", !in_watchfaces);
		$(".header-area .faces").toggleClass("active", in_watchfaces);

		current_app_id = frame.contentWindow.location.hash.match(/[a-f0-9]{24}/);
		$(".header-link .link").toggle(!!current_app_id);
		if (current_app_id) {
			$(".header-link .link").attr("href", "https://apps.getpebble.com/applications/" + current_app_id)
			update_pbw_link();
		}
	}, false);

	var update_pbw_link = function() {
		if (frame.contentWindow.app_meta_cache[current_app_id]) {
			var meta = frame.contentWindow.app_meta_cache[current_app_id];
			$(".header-link .pbw").toggle(true);
			$(".header-link .pbw").attr("href", meta["pbw_file"]);
		} else {
			$(".header-link.pbw").toggle(false);
		}
	}

	frame.contentWindow.app_meta_cache_update_cb = function() {
		update_pbw_link();
	}

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
