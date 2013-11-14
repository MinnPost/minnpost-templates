
/**
 * Helpers to extend to an app.
 */
define('helpers', ['jquery', 'underscore', 'Backbone'],
  function($, _, Backbone) {

  return {
    /**
     * Formats number
     */
    formatNumber: function(num, decimals) {
      decimals = (_.isUndefined(decimals)) ? 2 : decimals;
      var rgx = (/(\d+)(\d{3})/);
      split = num.toFixed(decimals).toString().split('.');

      while (rgx.test(split[0])) {
        split[0] = split[0].replace(rgx, '$1' + ',' + '$2');
      }
      return (decimals) ? split[0] + '.' + split[1] : split[0];
    },

    /**
     * Formats number into currency
     */
    formatCurrency: function(num) {
      return '$' + _.formatNumber(num, 2);
    },

    /**
     * Formats percentage
     */
    formatPercent: function(num) {
      return _.formatNumber(num * 100, 1) + '%';
    },

    /**
     * Formats percent change
     */
    formatPercentChange: function(num) {
      return ((num > 0) ? '+' : '') + _.formatPercent(num);
    },

    /**
     * Converts string into a hash (very basically).
     */
    hash: function(str) {
      return Math.abs(_.reduce(str.split(''), function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0));
    },

    /**
     * Returns version of MSIE.
     */
    isMSIE: function() {
      var match = /(msie) ([\w.]+)/i.exec(navigator.userAgent);
      return match ? parseInt(match[2], 10) : false;
    },

    /**
     * Override Backbone's ajax call to use JSONP by default as well
     * as force a specific callback to ensure that server side
     * caching is effective.
     */
    BackboneAJAX: function() {
      var options = arguments;

      if (options[0].dataTypeForce !== true) {
        options[0].dataType = 'jsonp';
        options[0].jsonpCallback = 'mpServerSideCachingHelper' +
          _.hash(options[0].url);
      }
      return Backbone.$.ajax.apply(Backbone.$, options);
    },

    /**
     * Wrapper for a JSONP request
     */
    jsonpRequest: function() {
      var options = arguments[0];

      options.dataType = 'jsonp';
      options.jsonpCallback = 'mpServerSideCachingHelper' +
        _.hash(options.url);
      return $.ajax.apply($, [options]);
    },

    /**
     * Data source handling.  For development, we can call
     * the data directly from the JSON file, but for production
     * we want to proxy for JSONP.
     *
     * `name` should be relative path to dataset minus the .json
     *
     * Returns jQuery's defferred object.
     */
    getLocalData: function(name) {
      var thisApp = this;
      var proxyPrefix = this.options.jsonpProxy;
      var useJSONP = false;
      var defers = [];

      this.data = this.data || {};
      name = (_.isArray(name)) ? name : [ name ];

      // If the data path is not relative, then use JSONP
      if (this.options && this.options.dataPath.indexOf('http') === 0) {
        useJSONP = true;
      }

      // Go through each file and add to defers
      _.each(name, function(d) {
        var defer;
        if (_.isUndefined(thisApp.data[d])) {

          if (useJSONP) {
            defer = this.jsonpRequest({
              url: proxyPrefix + encodeURI(thisApp.options.dataPath + d + '.json')
            });
          }
          else {
            defer = $.getJSON(thisApp.options.dataPath + d + '.json');
          }

          $.when(defer).done(function(data) {
            thisApp.data[d] = data;
          });
          defers.push(defer);
        }
      });

      return $.when.apply($, defers);
    },

    /**
     * Get remote data.  Provides a wrapper around
     * getting a remote data source, to use a proxy
     * if needed, such as using a cache.
     */
    getRemoteData: function(options) {
      options.dataType = 'jsonp';

      if (this.options.remoteProxy) {
        options.url = options.url + '&callback=proxied_jqjsp';
        options.url = app.options.remoteProxy + encodeURIComponent(options.url);
        options.callback = 'proxied_jqjsp';
        options.cache = true;
      }

      return $.ajax(options);
    }
  };
});
