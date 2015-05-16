window.confirm = function(){}; // Problem solved. - this is representative of the quality of code you'll find in the rest of this thing.
var old_createElement = document.createElement;
document.createElement = function(element_name) {
	var el = old_createElement.call(document, element_name);
	if (element_name == "IFRAME") {
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
				if (res.applications) {
					for (var i = res.applications.length - 1; i >= 0; i--) {
						window.app_meta_cache[res.applications[i].id] = res.applications[i];
					};
					// The navbar frame pastes a callback into this variable.
					if (window.app_meta_cache_update_cb) window.app_meta_cache_update_cb();
				}
			} catch(err) {
				// oops!
			}
		}
	});
	return xhr;
}
