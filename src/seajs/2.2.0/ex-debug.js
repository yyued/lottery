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
			if (/arale|alice/.test(uri) && !/\-debug\.(js|css)+/g.test(uri)) {
				uri = uri.replace(/((?:arale|alice)\/.*)\.(js|css)/g, "$1-debug.$2");
			}
			return uri;
		}
	]
});
(function(window) {
	function globalConfig() {
		var jQueryAlias = "gallery/jquery/1.11.1/jquery";
		seajs.config({
			alias: {
				"jquery": jQueryAlias,
				"$": jQueryAlias,
				"$-debug": jQueryAlias,
				"underscore": "gallery/underscore/1.6.0/underscore",
				"oop": "lib/oop/1.0/oop",
				"cevent": "lib/cevent/1.0/cevent"
			},
			comboVersion: "20140310"
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


// seajs-style
(function() {
	/**
	 * The Sea.js plugin for embedding style text in JavaScript code
	 */

	var RE_NON_WORD = /\W/g
	var doc = document
	var head = document.getElementsByTagName('head')[0] || document.documentElement
	var styleNode

	seajs.importStyle = function(cssText, id) {
		if (id) {
			// Convert id to valid string
			id = id.replace(RE_NON_WORD, '-')

			// Don't add multiple times
			if (doc.getElementById(id)) return
		}

		var element

		// Don't share styleNode when id is spectied
		if (!styleNode || id) {
			element = doc.createElement('style')
			id && (element.id = id)

			// Adds to DOM first to avoid the css hack invalid
			head.appendChild(element)
		} else {
			element = styleNode
		}

		// IE
		if (element.styleSheet) {

			// http://support.microsoft.com/kb/262161
			if (doc.getElementsByTagName('style').length > 31) {
				throw new Error('Exceed the maximal count of style tags in IE')
			}

			element.styleSheet.cssText += cssText
		}
		// W3C
		else {
			element.appendChild(doc.createTextNode(cssText))
		}

		if (!id) {
			styleNode = element
		}
	}

	define("seajs/seajs-style/1.0.2/seajs-style", [], {});
})();