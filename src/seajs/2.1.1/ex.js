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


/**
 * The Sea.js plugin for concatenating HTTP requests, customized for assets.dwstatic.com
 */
(function(seajs) {
	if (!seajs.pluginLoaded) seajs.pluginLoaded = {};

	if (seajs.pluginLoaded["combo-dw"]) return;
	seajs.pluginLoaded["combo-dw"] = true;

	var REG_DW_STATIC = /^http:\/\/assets\.dwstatic\.com\/(.+)/i,
		REG_CSS = /\.css$/i;

	var Module = seajs.Module
	var FETCHING = Module.STATUS.FETCHING

	var data = seajs.data
	var comboHash = data.comboHash = {}

	var comboSyntax = ["&f=", ","]
	var comboMaxLength = 2000
	var comboExcludes


	seajs.on("load", setComboHash)
	seajs.on("fetch", setRequestUri)

	function getCacheSuffix(uri, single) {
		var versions = [data.comboVersion || "0"],
			moduleVersion = data.moduleVersion;

		if (moduleVersion) {
			for (var i = 0, len = moduleVersion.length; i < len; i++) {
				var arr = moduleVersion[i];
				if (!arr) continue;
				var key = arr[0];
				if (!key) continue;
				var matched = false;
				if (typeof key === "string") {
					if (uri.indexOf(key) >= 0) {
						matched = true;
					}
				} else if (key.test) {
					if (key.test(uri)) {
						matched = true;
					}
				} else if (key.call) {
					if (key.call(arr, uri)) {
						matched = true;
					}
				}
				if (matched) {
					if (arr[1]) {
						versions.push(arr[1]);
					} else if (single && arr[1] === false) {
						versions = false;
						break;
					} else {
						versions = [];
						break;
					}
				}
			}
			if (versions && versions.length > 1) {
				versions.sort(function(a, b) {
					if (a > b) {
						return -1;
					} else if (a < b) {
						return 1;
					}
					return 0;
				});
			}
		}

		if (versions === false) return false;

		var suffix = "&nm";
		if (versions[0]) {
			suffix += "&" + versions[0];
		}
		if (REG_CSS.test(uri)) suffix += versions[0] ? ".css" : "c.css";

		return suffix;
	}

	function resolveAsset(uri) {
		if (uri) {
			if (comboHash[uri]) {
				return comboHash[uri];
			}
			var match = uri.match(REG_DW_STATIC);
			if (match) {
				var suffix = getCacheSuffix(match[1], true);
				if (suffix) {
					return comboHash[uri] = "http://assets.dwstatic.com/f=" + match[1] + suffix;
				}
			}
		}
		return uri;
	}

	seajs.resolveAsset = resolveAsset;

	function setComboHash(uris) {
		data.comboSyntax && (comboSyntax = data.comboSyntax)
		data.comboMaxLength && (comboMaxLength = data.comboMaxLength)

		comboExcludes = data.comboExcludes
		var needComboUris = []

		for (var i = 0, len = uris.length; i < len; i++) {
			var uri = uris[i]

			if (comboHash[uri]) {
				continue
			}

			var mod = Module.get(uri)

			// Remove fetching and fetched uris, excluded uris, combo uris
			if (mod.status < FETCHING && !isExcluded(uri) && !isComboUri(uri)) {
				needComboUris.push(uri)
			}
		}

		if (needComboUris.length > 1) {
			paths2hash(uris2paths(needComboUris))
		} else {
			resolveAsset(needComboUris[0]);
		}
	}

	function setRequestUri(data) {
		data.requestUri = comboHash[data.uri] || data.uri
	}


	// Helpers

	function uris2paths(uris) {
		return meta2paths(uris2meta(uris))
	}

	// [
	//   "http://example.com/p/a.js",
	//   "https://example2.com/b.js",
	//   "http://example.com/p/c/d.js",
	//   "http://example.com/p/c/e.js"
	// ]
	// ==>
	// {
	//   "http__example.com": {
	//                          "p": {
	//                                 "a.js": { __KEYS: [] },
	//                                 "c": {
	//                                        "d.js": { __KEYS: [] },
	//                                        "e.js": { __KEYS: [] },
	//                                        __KEYS: ["d.js", "e.js"]
	//                                 },
	//                                 __KEYS: ["a.js", "c"]
	//                               },
	//                          __KEYS: ["p"]
	//                        },
	//   "https__example2.com": {
	//                            "b.js": { __KEYS: [] },
	//                            _KEYS: ["b.js"]
	//                          },
	//   __KEYS: ["http__example.com", "https__example2.com"]
	// }
	function uris2meta(uris) {
		var meta = { __KEYS: [] }

		for (var i = 0, len = uris.length; i < len; i++) {
			var parts = uris[i].replace("://", "__").split("/")
			var m = meta

			for (var j = 0, l = parts.length; j < l; j++) {
				var part = parts[j]

				if (!m[part]) {
					m[part] = { __KEYS: [] }
					m.__KEYS.push(part)
				}
				m = m[part]
			}
		}

		return meta
	}

	// {
	//   "http__example.com": {
	//                          "p": {
	//                                 "a.js": { __KEYS: [] },
	//                                 "c": {
	//                                        "d.js": { __KEYS: [] },
	//                                        "e.js": { __KEYS: [] },
	//                                        __KEYS: ["d.js", "e.js"]
	//                                 },
	//                                 __KEYS: ["a.js", "c"]
	//                               },
	//                          __KEYS: ["p"]
	//                        },
	//   "https__example2.com": {
	//                            "b.js": { __KEYS: [] },
	//                            _KEYS: ["b.js"]
	//                          },
	//   __KEYS: ["http__example.com", "https__example2.com"]
	// }
	// ==>
	// [
	//   ["http://example.com/p", ["a.js", "c/d.js", "c/e.js"]]
	// ]
	function meta2paths(meta) {
		var paths = []
		var __KEYS = meta.__KEYS

		for (var i = 0, len = __KEYS.length; i < len; i++) {
			var part = __KEYS[i]
			var root = part
			var m = meta[part]
			var KEYS = m.__KEYS

			while (KEYS.length === 1) {
				root += "/" + KEYS[0]
				m = m[KEYS[0]]
				KEYS = m.__KEYS
			}

			if (KEYS.length) {
				paths.push([root.replace("__", "://"), meta2arr(m)])
			}
		}

		return paths
	}

	// {
	//   "a.js": { __KEYS: [] },
	//   "c": {
	//          "d.js": { __KEYS: [] },
	//          "e.js": { __KEYS: [] },
	//          __KEYS: ["d.js", "e.js"]
	//        },
	//   __KEYS: ["a.js", "c"]
	// }
	// ==>
	// [
	//   "a.js", "c/d.js", "c/e.js"
	// ]
	function meta2arr(meta) {
		var arr = []
		var __KEYS = meta.__KEYS

		for (var i = 0, len = __KEYS.length; i < len; i++) {
			var key = __KEYS[i]
			var r = meta2arr(meta[key])

			// key = "c"
			// r = ["d.js", "e.js"]
			var m = r.length
			if (m) {
				for (var j = 0; j < m; j++) {
					arr.push(key + "/" + r[j])
				}
			}
			else {
				arr.push(key)
			}
		}

		return arr
	}

	// [
	//   [ "http://example.com/p", ["a.js", "c/d.js", "c/e.js", "a.css", "b.css"] ]
	// ]
	// ==>
	//
	// a hash cache
	//
	// "http://example.com/p/a.js"  ==> "http://example.com/p/??a.js,c/d.js,c/e.js"
	// "http://example.com/p/c/d.js"  ==> "http://example.com/p/??a.js,c/d.js,c/e.js"
	// "http://example.com/p/c/e.js"  ==> "http://example.com/p/??a.js,c/d.js,c/e.js"
	// "http://example.com/p/a.css"  ==> "http://example.com/p/??a.css,b.css"
	// "http://example.com/p/b.css"  ==> "http://example.com/p/??a.css,b.css"
	//
	function paths2hash(paths) {
		for (var i = 0, len = paths.length; i < len; i++) {
			var path = paths[i]
			var match = path[0].match(REG_DW_STATIC)
			if (!match) continue;

			var root = path[0] + "/"
			var group = files2group(path[1])
			var dwRoot = "http://assets.dwstatic.com/b=" + match[1]
			var commonPath = match[1] + "/"

			for (var j = 0, m = group.length; j < m; j++) {
				setHash(root, group[j], dwRoot, commonPath)
			}
		}

		return comboHash
	}

	function setHash(root, files, dwRoot, commonPath) {
		var filesWithPath = []
		for (var i = 0, len = files.length; i < len; i++) {
			filesWithPath.push(commonPath + files[i])
		}

		var comboPath = dwRoot + comboSyntax[0] + files.join(comboSyntax[1]) + getCacheSuffix(filesWithPath.join(comboSyntax[1]))
		var exceedMax = comboPath.length > comboMaxLength

		// http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url
		if (files.length > 1 && exceedMax) {
			var parts = splitFiles(files,
				comboMaxLength - (comboPath.length - files.join(comboSyntax[1]).length))

			setHash(root, parts[0], dwRoot, commonPath)
			setHash(root, parts[1], dwRoot, commonPath)
		}
		else {
			if (exceedMax) {
				throw new Error("The combo url is too long: " + comboPath)
			}

			for (var i = 0, len = files.length; i < len; i++) {
				comboHash[root + files[i]] = comboPath
			}
		}
	}

	function splitFiles(files, filesMaxLength) {
		var sep = comboSyntax[1]
		var s = files[0]

		for (var i = 1, len = files.length; i < len; i++) {
			s += sep + files[i]
			if (s.length > filesMaxLength) {
				return [files.splice(0, i), files]
			}
		}
	}

	//
	//  ["a.js", "c/d.js", "c/e.js", "a.css", "b.css", "z"]
	// ==>
	//  [ ["a.js", "c/d.js", "c/e.js"], ["a.css", "b.css"] ]
	//
	function files2group(files) {
		var group = []
		var hash = {}

		for (var i = 0, len = files.length; i < len; i++) {
			var file = files[i]
			var ext = getExt(file)
			if (ext) {
				(hash[ext] || (hash[ext] = [])).push(file)
			}
		}

		for (var k in hash) {
			if (hash.hasOwnProperty(k)) {
				group.push(hash[k])
			}
		}

		return group
	}

	function getExt(file) {
		var p = file.lastIndexOf(".")
		return p >= 0 ? file.substring(p) : ""
	}

	function isExcluded(uri) {
		if (comboExcludes) {
			return comboExcludes.test ?
				comboExcludes.test(uri) :
				comboExcludes(uri)
		}
	}

	function isComboUri(uri) {
		//var s1 = comboSyntax[0]
		var s1 = "f=";
		var s2 = comboSyntax[1]

		return s1 && uri.indexOf(s1) > 0 || s2 && uri.indexOf(s2) > 0
	}


	// For test
	if (data.test) {
		var test = seajs.test || (seajs.test = {})
		test.uris2paths = uris2paths
		test.paths2hash = paths2hash
	}


	// Register as module
	define("seajs-combo", [], {})

})(seajs);


seajs.config({
	base: "http://assets.dwstatic.com/amkit/"
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


try { document.execCommand("BackgroundImageCache", false, true); } catch (ex) { }