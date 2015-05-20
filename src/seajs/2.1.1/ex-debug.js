(function() {
	if (!seajs.pluginLoaded) seajs.pluginLoaded = {};

	if (seajs.pluginLoaded["id-abbr"]) return;
	seajs.pluginLoaded["id-abbr"] = true;

	// for example: gallery/jquery@1.9.1 => gallery/jquery/1.9.1/jquery
	var REG_ID_ABBR = /([^\/\\]+)@([\w\.\-]+)/ig;
	seajs.on("resolve", function(data) {
		if (!data.id) return;
		data.id = data.id.replace(REG_ID_ABBR, function(m, m1, m2) {
			return m1 + "/" + m2 + "/" + m1;
		});
	});
})();


seajs.config({
	debug: true,
	map: [
		function(uri) {
			// arale/tip/1.2.0/tip.js => arale/tip/1.2.0/tip-debug.js
			if (!/\-debug\.(js|css)+/g.test(uri)) {
				uri = uri.replace(/((?:arale|alice)\/.*)\.(js|css)/g, "$1-debug.$2");
			}
			return uri;
		}
	]
});
(function(window) {
	function globalConfig() {
		var jQueryAlias = (function() {
			var $ = window.jQuery, v, a;
			if ($) {
				v = $.fn.jquery, a = v.split(".");
				if (a[0] == 1 && a[1] >= 9) {
					define("jquery", [], function() {
						return $;
					});
					define("$", [], function() {
						return $;
					});
					return;
				}
			}
			return "gallery/jquery/1.10.2/jquery";
		})();
		seajs.config({
			alias: {
				"jquery": jQueryAlias,
				"$": jQueryAlias,
				"$-debug": jQueryAlias,
				"underscore": "gallery/underscore/1.5.2/underscore",
				"oop": "lib/oop/1.0/oop",
				"cevent": "lib/cevent/1.0/cevent"
			},
			comboVersion: "20140121"
		});
	}

	globalConfig();

	if (seajs.sessionDebug) return;

	var SESSION_NAME = "seajs_debug_base";

	var getSessionDebug, setSessionDebug;
	if (window.sessionStorage) {
		getSessionDebug = function() {
			return sessionStorage.getItem(SESSION_NAME);
		};
		setSessionDebug = function(v) {
			sessionStorage.setItem(SESSION_NAME, v);
		};
	} else {
		getSessionDebug = function() {
			var matched = document.cookie.match(/seajs_debug_base=([^;]+)/);
			if (matched) {
				return decodeURIComponent(matched[1]);
			}
			return null;
		};
		setSessionDebug = function(v) {
			seajs.use("lib/cookie@1.0", function(Cookie) {
				Cookie.set(SESSION_NAME, v);
			});
		};
	}

	var sessionDebug = seajs.sessionDebug = function(base, updateSession) {
		seajs.config({
			debug: true,
			base: base
		});
		globalConfig();

		window.console && window.console.log("session debug base:" + base);

		if (updateSession !== false) {
			setSessionDebug(base);
		}
	};

	var debugBaseMatched = window.location.href.match(/seajs_debug_base=([^&\?#]+)/);
	if (debugBaseMatched) {
		sessionDebug(debugBaseMatched[1]);
	} else {
		var debugBase = getSessionDebug();
		if (debugBase) {
			sessionDebug(debugBase, false);
		}
	}
})(this);


seajs.execPreorders && seajs.execPreorders();


try {
	document.execCommand("BackgroundImageCache", false, true);
} catch (ex) {
}