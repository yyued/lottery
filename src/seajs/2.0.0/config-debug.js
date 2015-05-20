seajs.config({
	debug: true,
	alias: {
		"jquery": "gallery/jquery/1.10.1/jquery",
		"underscore": "gallery/underscore/1.4.4/underscore",
		"oop": "lib/oop/1.0/oop",
		"cevent": "lib/cevent/1.0/cevent"
	},
	moduleVersion: [
		["jquery.js", "2013061602"]
	]
});

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