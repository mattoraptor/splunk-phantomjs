(function() {
    if (! jasmine) {
        throw new Exception("jasmine library does not exist in global namespace!");
    }

    /**
     * Basic reporter that outputs spec results to splunk
     * Adapted from our jasmine teamcity reporter
     * Usage:
     *
     * jasmine.getEnv().addReporter(new jasmine.TeamcityReporter());
     * jasmine.getEnv().execute();
    */

    var SplunkReporter = function(logger) {
        this.logger = logger;
        this.started = false;
        this.finished = false;
    };

    SplunkReporter.prototype = {
    	reportRunnerResults: function(runner) { },
        reportRunnerStarting: function(runner) { },
        reportSpecResults: function(spec) { 
            this.logger.info({
                "description" : spec.description,
                "id" : spec.id,
                "suite" : {  
                    "id" : spec.suite.id, 
                    "description" : spec.suite.description,
                    "parent" : (spec.suite.parentSuite ? { 
                        "id" : spec.suite.parentSuite.id, 
                        "description" : spec.suite.parentSuite.description
                    } : null)
                },
                "results" : spec.results()
            });
        },
        reportSpecStarting: function(spec) { },
        reportSuiteResults: function(suite) { 
        }
    };

	// export public
    jasmine.SplunkReporter = SplunkReporter;

})();