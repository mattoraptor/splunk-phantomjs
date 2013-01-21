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

		var phantom_http;
		var mockpage;

		beforeEach(function() {
			phantom_http = new splunkjs.Phantom.Http.PhantomHttp();
			mockpage = new pagemock();
			phantom_http.pageFactory = function() { return mockpage; }
		});
		
		it("request is successful returns not aborted", function() {
			var res = phantom_http.makeRequest("someUrl", {method:"post", body:"somedata"}, function(){ });
			expect(res.wasAborted).toBeFalsy();
		});

		it("request is not successful returns aborted", function() {
			mockpage.status = "failure";
			var res = phantom_http.makeRequest("someUrl", {method:"post", body:"somedata"}, function(){ });
			expect(res.wasAborted).toBeTruthy();
		});

		it("request is successful calls callback with success", function() {
			phantom_http.makeRequest("someUrl", {method:"post", body:"somedata"}, function(response) {
				expect(response.status).toEqual("200");
			});
		});
	
		it("request is not successful calls callback with failure", function () {
			mockpage.status = "failure";
			mockpage.response.status = "500";
			phantom_http.makeRequest("someUrl", {method:"post", body:"somedata"}, function(response) {
				console.log(JSON.stringify(response));
				expect(response.error).toEqual("failure");
				expect(response.status).toEqual("500");
			});
		});
	});
});