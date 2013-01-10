//this needs to be run with the --ignore-ssl-errors=yes option to work
// on splunk apis with self-signed certs

var page = require("webpage").create();
var process = {env:{LOG_LEVEL: "WARN"}};
var splunkjs = require("./splunk-sdk-javascript/index");

page.open("https://localhost:8089/services/auth/login?output_mode=json", 
    "post", "username=admin&password=admin", function(status){
        console.log(status);
        console.log(page.content)
        phantom.exit();
})

var PhantomHttp = splunkjs.Http.extend({
        init: function() {
            this._super();
        },

        makeRequest: function(url, message, callback) {
        	console.log(url);
        	console.log(message.body);
        	console.log(message.method);
        	page.open(url, message.method, message.body, function (status) {
        		console.log(page.headers);
        		console.log(status);
        		callback({statusCode:status});
        	});
        },

        parseJson: function(json) {
           console.log(json);
        }
    });

var http = new PhantomHttp();

var service = new splunkjs.Service(http, {
		username: "admin",
    	password: "admin",
    	scheme: "https",
    	host: "localhost",
    	port: "8089",
    	version: "5.0"
});

// service.login(function(err, success) {
// 	if (err || !success) {
// 		console.error("couldn't log into splunk");
// 		phantom.exit(1);
// 	}

// 	var logger = new Logger(service, {sourcetype: "testlogs", source: "test"});
// 	logger.log({message:"This is a message for testing"});
// 	phantom.exit();
// });