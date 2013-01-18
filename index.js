(function() {
    var root = exports || this;
    
    module.exports = root = {
        Logger          : require('./splunk-sdk-javascript/lib/log').Logger,
        Context         : require('./splunk-sdk-javascript/lib/context'),
        Service         : require('./splunk-sdk-javascript/lib/service'),
        Http            : require('./splunk-sdk-javascript/lib/http'),
        Utils           : require('./splunk-sdk-javascript/lib/utils'),
        Async           : require('./splunk-sdk-javascript/lib/async'),
        Paths           : require('./splunk-sdk-javascript/lib/paths').Paths,
        Class           : require('./splunk-sdk-javascript/lib/jquery.class').Class,
        Phantom         : {
            Http        : require('./phantom_http'),
            Logger      : require('./phantom_logger')
        }
    };
})();