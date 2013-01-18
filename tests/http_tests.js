var pagemock = {
	response : {},
	status: "success",
	open: function(url, http_method, data, callback) {
		if (this.onResourceReceived) {
			onResourceReceived(response);
		}
		callback(status);
	},

	create: function() {
		return this;
	}
};

var process = {env:{LOG_LEVEL: "WARN"}};
var page = require("webpage").create();
var splunkjs = require("../index");

var baseRequire = require;
require = function(str) {
	if (str === "webpage") {
		return pagemock;
	}

	return baseRequire(str);
};

describe("phantom http", function() {

	describe("makeRequest", function() {
		
		it("request is sucessful returns not aborted", function() {
			var phantom_http = new splunkjs.Phantom.Http.PhantomHttp();
			var res = phantom_http.makeRequest("someUrl", "post", {data:"somedata"}, function(){});
			expect(res.wasAborted).toBeFalsy();
		});
	});

});