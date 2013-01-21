var pagemock = function (){
	this.response  = {status: "200"};
	this.status = "success";
	this.open = function(url, http_method, data, callback) {
		if (this.onResourceReceived) {
			this.onResourceReceived(this.response);
		}
		callback(this.status);
	};
};

var process = {env:{LOG_LEVEL: "WARN"}};
var page = require("webpage").create();
var splunkjs = require("../index");

describe("phantom http", function() {

	describe("makeRequest", function() {
		
		it("request is successful returns not aborted", function() {
			var phantom_http = new splunkjs.Phantom.Http.PhantomHttp();
			phantom_http.pageFactory = function() { return new pagemock(); }
			var res = phantom_http.makeRequest("someUrl", {method:"post", body:"somedata"}, function(){ });
			expect(res.wasAborted).toBeFalsy();
		});

		it("request is successful calls callback with success", function() {
			var phantom_http = new splunkjs.Phantom.Http.PhantomHttp();
			phantom_http.pageFactory = function() { return new pagemock(); }
			phantom_http.makeRequest("someUrl", {method:"post", body:"somedata"}, function(response) {
				expect(response.status).toEqual("200");
			});
		});
	});

});