//this needs to be run with the --ignore-ssl-errors=yes option to work
// on splunk apis with self-signed certs
var process = {env:{LOG_LEVEL: "WARN"}};
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
            var page = require("webpage").create();
            
            page.onResourceReceived = function(response) {
                that.lastResponse = response;
            };
        	page.customHeaders = message.headers;
            page.open(url, message.method, message.body, function (status) {
                if (status === "success") {
                } else {
                    console.log(url);
                    console.log(status);
                    console.log(JSON.stringify(message));
                    console.log(JSON.stringify(page));
                    console.log(JSON.stringify(that.lastResponse));
                }
                var response = {
                    statusCode: that.lastResponse.status,
                    headers: getHeaders(that.lastResponse.headers)
                };      
                var complete_response = that._buildResponse(status, response, page.plainText);
                callback(complete_response);
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

var Logger = splunkjs.Class.extend({
    init: function(service, opts) {
        this.service = service;
        
        opts = opts || {};
        
        this.params = {};
        if (opts.index)      this.params.index      = opts.index;
        if (opts.host)       this.params.host       = opts.host;
        if (opts.source)     this.params.source     = opts.source;
        if (opts.sourcetype) this.params.sourcetype = opts.sourcetype || "demo-logger";
        
        if (!this.service) {
            throw new Error("Must supply a valid service");
        }
    },
    
    log: function(data) {
        var message = {
            __time: (new Date()).toUTCString(),
            level: "LOG",
            data: data
        };
        
        this.service.log(message, this.params);
        console.log(data);
    },
    
    error: function(data) {
        var message = {
            __time: (new Date()).toUTCString(),
            level: "ERROR",
            data: data
        };
        
        this.service.log(message, this.params);
        console.error(data);
    },
    
    info: function(data) {
        var message = {
            __time: (new Date()).toUTCString(),
            level: "INFO",
            data: data
        };
        
        this.service.log(message, this.params);
        console.info(data);
    },
    
    warn: function(data) {
        var message = {
            __time: (new Date()).toUTCString(),
            level: "WARN",
            data: data
        };
        
        this.service.log(message, this.params);
        console.warn(data);
    },
});

service.login(function(err, success) {
	if (err || !success) {
        console.log(err);
		console.error("couldn't log into splunk");
		phantom.exit(1);
	}
    
	var logger = new Logger(service, {sourcetype: "testlogs", source: "test"});
	logger.log("more test");
    logger.info({"party":"cats", "awesome": "pizza"});
	//phantom.exit();
});