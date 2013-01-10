//this needs to be run with the --ignore-ssl-errors=yes option to work
// on splunk apis with self-signed certs
var process = {env:{LOG_LEVEL: "WARN"}};
var logger = console;
var splunkjs = require("./splunk-sdk-javascript/index");

var getHeaders = function(headerArray) {
    var headers = {};
    for (var h in headerArray) {
        var name = headerArray[h].name;
        var value = headerArray[h].value;
        headers[name] = value;
    }
    return headers;
};

var PhantomHttp = splunkjs.Http.extend({
        init: function() {
            this._super();
        },

        makeRequest: function(url, message, callback) {
            var that = this;
            console.log(url);
            var page = require("webpage").create();
            
            page.onResourceReceived = function(response) {
                that.lastResponse = response;
            };
        	
            page.open(url, message.method, message.body, function (status) {
                if (status === "success") {
                    var response = {
                        statusCode: that.lastResponse.status,
                        headers: getHeaders(that.lastResponse.headers)
                    };
                    var complete_response = that._buildResponse(status, response, page.plainText);
                    callback(complete_response);
                 }
            });
        },

        parseJson: function(json) {
           return JSON.parse(json);
        }
    });

var http = new PhantomHttp();

var service = new splunkjs.Service(http, {
		username: "admin",
    	password: "admin",
    	scheme: "https",
    	host: "localhost",
    	port: "8089",
    	version: "5.0.1"
});

service.login(function(err, success) {
	if (err || !success) {
        console.log(err);
		console.error("couldn't log into splunk");
		phantom.exit(1);
	}
    console.log("logged in");

	//var logger = new Logger(service, {sourcetype: "testlogs", source: "test"});
    console.log("logged in");
	//logger.log({message:"This is a message for testing"});
	phantom.exit();
});