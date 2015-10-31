$(function(){
    var frame = $("iframe").get(0);
    if (!frame) {
        frame = parent.window.frames[1];
    }

    window.frame_load_cb = function(){
        window.frame_location_change_cb(frame.window.location.pathname);
    }

	var current_app_id, current_app_type;
    window.frame_location_change_cb = function(location){
        console.log("PAS navigated to", location);

        current_app_id = location.match(/[a-f0-9]{24}/);
        var in_watchfaces = (location.indexOf("watchfaces") >= 0) || (!!current_app_id && frame.window.app_meta_cache[current_app_id].type == "watchapp");
        $(".header-area .apps").toggleClass("active", !in_watchfaces);
        $(".header-area .faces").toggleClass("active", in_watchfaces);
		$(".header-link .link").toggle(!!current_app_id);
        current_app_type = in_watchfaces ? "watchfaces" : "watchapps";

		if (current_app_id) {
			$(".header-link .link").attr("href", "https://apps.getpebble.com/applications/" + current_app_id)
		}
        update_pbw_link();
    };

	var update_pbw_link = function() {
		if (frame.window.app_meta_cache[current_app_id]) {
			var meta = frame.window.app_meta_cache[current_app_id];
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
        };
        frame.window.location.search = '?platform=pas&hardware=' + platform + '&pebble_color=' + platform_colours[platform];
    };

	window.frame_app_meta_cache_update_cb = function() {
		update_pbw_link();
	}

    var frame_nav = function(){
        frame.window.set_location.apply(this, arguments)
    };

    var goto_search = function() {
        frame_nav("search/" + current_app_type + "/1");
    }

    var goto_type_home = function() {
        frame_nav(current_app_type);
    }

    $(".header-search").click(function(){
        goto_search();
    });

    $(".header-area .apps").click(function(){
        current_app_type = "watchapps";
        if (frame.window.location.pathname.indexOf("search") >= 0) {
            goto_search();
        } else {
            goto_type_home();
        }
    });

    $(".header-area .faces").click(function(){
        current_app_type = "watchfaces";
        if (frame.window.location.pathname.indexOf("search") >= 0) {
            goto_search();
        } else {
            goto_type_home();
        }
    });

    $(".platform").click(function(){
        $(".platform").removeClass("active");
        $(this).addClass("active");
        var classes = [].slice.call(this.classList);
        var this_platform = classes[(classes.indexOf("platform") + 1) % classes.length]; // The class that isn't "platform"
        set_platform(this_platform);
    });
});
