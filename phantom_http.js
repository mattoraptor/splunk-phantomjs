//http for phantom js, based on node_http and proxy_http in the splunk javascript sdk
(function() {
	var Http = require('./splunk-sdk-javascript/lib/http');
    var root = exports || this;

    var getHeaders = function(headerArray) {
    	var headers = {};
    	for (var h in headerArray) {
        	var name = headerArray[h].name;
        	var value = headerArray[h].value;
        	headers[name] = value;
    	}
    	return headers;
	};

	root.PhantomHttp = Http.extend({
        init: function() {
            this._super();
        },

        pageFactory: function() {
            return require("webpage").create();
        },

        makeRequest: function(url, message, callback) {
            var that = this;
            var page = that.pageFactory();
            var ret = {};

            page.onResourceReceived = function(response) {
                that.lastResponse = response;
            };
        	page.customHeaders = message.headers;
            page.open(url, message.method, message.body, function (status) {
                
                if (status === "success") {
                    ret.wasAborted = false;
                } else {
                    ret.wasAborted = true;
                    console.error([url,
                        status, 
                        JSON.stringify(message),
                        JSON.stringify(page),
                        JSON.stringify(that.lastResponse)]);
                }
                var response = {
                    statusCode: that.lastResponse.status,
                    headers: getHeaders(that.lastResponse.headers)
                };      
                var complete_response = that._buildResponse(status, response, page.plainText);
                callback(complete_response);
            });

            return ret;
        },

        parseJson: function(json) {
           return JSON.parse(json);
        }
    });

})();