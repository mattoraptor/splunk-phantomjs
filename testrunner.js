//this needs to be run with the --ignore-ssl-errors=yes option to work
// on splunk apis with self-signed certs
var process = {env:{LOG_LEVEL: "WARN"}};
var splunkjs = require("./phantom_index");

var http = new splunkjs.Phantom.Http.PhantomHttp();

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
    
	var logger = new splunkjs.Phantom.Logger.Logger(service, {sourcetype: "testlogs", source: "test"});
    logger.info({"party":"cats", "awesome": "tacos"});
	//phantom.exit();
});