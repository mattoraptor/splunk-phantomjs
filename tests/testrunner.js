
//dependencies
phantom.injectJs("./Jasmine/lib/jasmine-core/jasmine.js");
phantom.injectJs("./Jasmine/src/console/ConsoleReporter.js");

//test specs
phantom.injectJs("./http_tests.js");

//phantom.exit called when done
var finishCallback = jasmine.Runner.prototype.finishCallback;
jasmine.Runner.prototype.finishCallback = function() {
	try { finishCallback.call(this); }
	finally { phantom.exit(); }
};

//run tests with console.log output
var jasmineEnv = jasmine.getEnv();
jasmineEnv.addReporter(new jasmine.ConsoleReporter(function(str) { console.log(str); }));
jasmineEnv.execute();


// var process = {env:{LOG_LEVEL: "WARN"}};
// var splunkjs = require("../phantom_index");

// var http = new splunkjs.Phantom.Http.PhantomHttp();

// var service = new splunkjs.Service(http, {
// 		username: "admin",
//     	password: "admin",
//     	scheme: "https",
//     	host: "localhost",
//     	port: "8089",
//     	version: "5.0.1"
// });

// service.login(function(err, success) {
// 	if (err || !success) {
//         console.log(err);
// 		console.error("couldn't log into splunk");
// 		phantom.exit(1);
// 	}
    
// 	var logger = new splunkjs.Phantom.Logger.Logger(service, {sourcetype: "testlogs", source: "test"});
//     logger.info({"party":"cats", "awesome": "tacos"});
// 	//phantom.exit();
// });