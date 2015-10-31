$(function(){
    var frame = $("iframe").get(0);
    if (!frame) {
        frame = parent.window.frames[1];
    }

	var current_app_id, current_app_type;
    var update_nav_bar = function(location){
        location = location || frame.window.location.pathname;
        current_app_id = location.match(/[a-f0-9]{24}/);
        if (!!current_app_id && !!frame.window.app_meta_cache && !!frame.window.app_meta_cache[current_app_id]) {
            current_app_type = frame.window.app_meta_cache[current_app_id].type + "s";
        } else {
            current_app_type = location.indexOf("watchfaces") >= 0 ? "watchfaces" : "watchapps";
        }

        $(".header-area .apps").toggleClass("active", current_app_type == "watchapps");
        $(".header-area .faces").toggleClass("active", current_app_type == "watchfaces");
        $(".header-link .link").toggle(!!current_app_id);

        if (current_app_id) {
            $(".header-link .link").attr("href", "https://apps.getpebble.com/applications/" + current_app_id)
        }

        update_pbw_link();
    }

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

    // If I ever need to differentiate these, I'm prepared!
    window.frame_load_cb = update_nav_bar;
    window.frame_location_change_cb = update_nav_bar;

	window.frame_app_meta_cache_update_cb = function() {
        update_nav_bar();
	}

    var frame_nav = function(path){
        frame.window.location.pathname = "/en_US/" + path;
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
