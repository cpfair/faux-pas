// This is how the PAS web UI communicates with the outside world
// ...by creating iframes
// we only care about the openURL method, and can safely black-hole everything else
var nav_frame = window.parent.frames[0];

var old_createElement = document.createElement;
document.createElement = function(element_name) {
    var el = old_createElement.call(document, element_name);
    if (element_name == "iframe") {
        var old_setAttribute = el.setAttribute;
        el.setAttribute = function(attr, val) {
            if (attr == "src" && val.indexOf("pebble-method-call-js-frame://") >= 0) {
                var method = val.match(/method=([^&]+)/)[1];
                var args = decodeURIComponent(val.match(/args=([^&]+)/)[1]);
                if (method == "openURL") {
                    url = JSON.parse(args).data.url;
                    window.open(url);
                }
                return;
            }
            old_setAttribute.call(el, attr, val);
        }
    }
    return el;
}

// Export this so the navbar frame can see it.
window.app_meta_cache = {};

var old_xhr = XMLHttpRequest;

XMLHttpRequest = function() {
	var xhr = new old_xhr();
	xhr.addEventListener("readystatechange", function(e){
		if (xhr.status == 200) {
			try {
				var res = JSON.parse(xhr.responseText);
				if (res.data) {
					for (var i = res.data.length - 1; i >= 0; i--) {
                        if (!res.data[i].latest_release) continue
						window.app_meta_cache[res.data[i].id] = res.data[i];
					};
					if (nav_frame) nav_frame.frame_app_meta_cache_update_cb();
				}
			} catch(err) {
				// oops!
			}
		}
	});
	return xhr;
};

document.addEventListener("DOMContentLoaded", function(){
    var injector = angular.element(document.body).injector();
    var location = injector.get("$location");
    var rootScope = injector.get("$rootScope");

    if (nav_frame) nav_frame.frame_load_cb();
    rootScope.$on('$locationChangeStart', function(e, next, curr){
        if (nav_frame) nav_frame.frame_location_change_cb(next);
    });
});
