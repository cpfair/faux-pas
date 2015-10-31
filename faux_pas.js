$(function(){
    var frame = $("iframe").get(0);
    if (!frame) {
        frame = $("frame", parent.document).get(1);
    }
	var current_app_id;
    frame.contentWindow.location_change_cb = function(location){
        var in_watchfaces = location.indexOf("watchfaces") >= 0;
        $(".header-area .apps").toggleClass("active", !in_watchfaces);
        $(".header-area .faces").toggleClass("active", in_watchfaces);

        current_app_id = location.match(/[a-f0-9]{24}/);
		$(".header-link .link").toggle(!!current_app_id);
		if (current_app_id) {
			$(".header-link .link").attr("href", "https://apps.getpebble.com/applications/" + current_app_id)
		}
        update_pbw_link();
    };

	var update_pbw_link = function() {
		if (frame.contentWindow.app_meta_cache[current_app_id]) {
			var meta = frame.contentWindow.app_meta_cache[current_app_id];
			$(".header-link .pbw").toggle(true);
			$(".header-link .pbw").attr("href", meta.latest_release.pbw_file);
		} else {
			$(".header-link .pbw").toggle(false);
		}
	}

    var set_platform = function(platform){
        var platform_colours = {
            aplite: 1,
            basalt: 12,
            chalk: 18
        }
        frame.contentWindow.location.search = '?platform=pas&hardware=' + platform + '&pebble_color=' + platform_colours[platform];
    };

	frame.contentWindow.app_meta_cache_update_cb = function() {
		update_pbw_link();
	}

    var frame_nav = function(){ frame.contentWindow.set_location.apply(this, arguments) };

    $(".header-back").click(function(){
        frame.contentWindow.history.go(-1);
    });

    $(".header-search").click(function(){
        frame_nav("search/watchapps/1");
    });

    $(".header-area .apps").click(function(){
        frame_nav("watchapps");
    });

    $(".header-area .faces").click(function(){
        frame_nav("watchfaces");
    });

    $(".platform").click(function(){
        $(".platform").removeClass("active");
        $(this).addClass("active");
        var classes = [].slice.call(this.classList);
        var this_platform = classes[(classes.indexOf("platform") + 1) % classes.length]; // The class that isn't "platform"
        set_platform(this_platform);
    });
});
