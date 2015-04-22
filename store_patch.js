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