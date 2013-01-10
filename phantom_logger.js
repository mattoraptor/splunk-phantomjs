(function() {
	var splunkjs = require('./splunk-sdk-javascript/lib/jquery.class');
	var root = exports || this;

	root.Logger = splunkjs.Class.extend({
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
})();