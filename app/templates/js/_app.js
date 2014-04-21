/**
 * Main application file for: <%= projectName %>
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
define('<%= projectName %>', [
  <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js && filteredComponentMap[c].returns) { %>'<%= filteredComponentMap[c].rname %>', <% }} %>
  'helpers',
  <%= (projectFeatures.hasCSVs === true) ? "'text!../data/example.csv', " : "" %>
  'text!templates/application.<%= templateExt %>',
  'text!templates/loading.<%= templateExt %>'
], function(
  <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js && filteredComponentMap[c].returns) { %><%= filteredComponentMap[c].returns %>, <% }} %>
  helpers,
  <%= (projectFeatures.hasCSVs === true) ? "tExampleCSV, " : "" %>
  tApplication, tLoading
  ) {

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.el = this.options.el;
    this.$el = $(this.el);
    this.$content = this.$el.find('.content-container');
    this.loadApp();
  };

  // Extend with custom methods
  _.extend(App.prototype, {
    // Start function
    start: function() {

      <% if (projectFeatures['hasBackbone'] === true) { %>
      // Override backbone's ajax request for use with JSONP
      // which is not preferred but we have to support
      // older browsers
      Backbone.ajax = helpers.BackboneAJAX;

      // Create router
      this.router = new routers.Router({
        app: this
      });
      // Start backbone history
      this.router.start();
      <% } %>

      <% if (projectFeatures['hasBackbone'] !== true && projectFeatures['hasRactive'] === true) { %>
      // Create main application view
      this.mainView = new Ractive({
        el: this.$el,
        template: tApplication,
        data: {

        },
        partials: {
          loading: tLoading
        }
      });
      <% } %>
      <% if (projectFeatures['hasBackbone'] !== true && projectFeatures['hasRactive'] !== true) { %>
      // Create main application view
      this.$content.html(_.template(tApplication, {
        data: {

        },
        loading: _.template(tLoading, {})
      }));
      <% } %>

      <% if (projectFeatures['hasHighCharts'] === true) { %>
      <% } %>

      <% if (projectFeatures['hasDatatables'] === true) { %>
      <% } %>

      <% if (projectFeatures['hasMapbox'] === true) { %>
      <% } %>
      <% if (projectFeatures['hasLeaflet'] === true) { %>
      // Due to how Leaflet animates and (probably) how the CSS
      // is pulled in dynamically, the map gets offset, so we wait
      // just a moment and invalidate the size to reset the map
      window.setTimeout(function() {
        map.invalidateSize();
      }, 500);
      <% } %>

    },

    // Default options
    defaultOptions: {
      projectName: '<%= projectName %>',
      remoteProxy: null,
      el: '.<%= projectName %>-container',
      availablePaths: {
        local: {
          <% if (projectPrerequisites.useCompass) { %>
          css: ['.tmp/css/main.css'],<% } else { %>
          css: ['styles/styles.css'],<% } %>
          images: 'images/',
          data: 'data/'
        },
        build: {
          css: [
            'dist/<%= projectName %>.libs.min.css',
            'dist/<%= projectName %>.latest.min.css'
          ],
          ie: [
            'dist/<%= projectName %>.libs.min.ie.css',
            'dist/<%= projectName %>.latest.min.ie.css'
          ],
          images: 'dist/images/',
          data: 'dist/data/'
        },
        deploy: {
          css: [
            'https://s3.amazonaws.com/data.minnpost/projects/<%= projectName %>/<%= projectName %>.libs.min.css',
            'https://s3.amazonaws.com/data.minnpost/projects/<%= projectName %>/<%= projectName %>.latest.min.css'
          ],
          ie: [
            'https://s3.amazonaws.com/data.minnpost/projects/<%= projectName %>/<%= projectName %>.libs.min.ie.css',
            'https://s3.amazonaws.com/data.minnpost/projects/<%= projectName %>/<%= projectName %>.latest.min.ie.css'
          ],
          images: 'https://s3.amazonaws.com/data.minnpost/projects/<%= projectName %>/<%= projectName %>/images/',
          data: 'https://s3.amazonaws.com/data.minnpost/projects/<%= projectName %>/<%= projectName %>/data/'
        }
      }
    },

    // Load up app
    loadApp: function() {
      this.determinePaths();
      this.getLocalAssests(function(map) {
        this.renderAssests(map);
        this.start();
      });
    },

    // Determine paths.  A bit hacky.
    determinePaths: function() {
      var query;
      this.options.deployment = 'deploy';

      if (window.location.host.indexOf('localhost') !== -1) {
        this.options.deployment = 'local';

        // Check if a query string forces something
        query = helpers.parseQueryString();
        if (_.isObject(query) && _.isString(query.mpDeployment)) {
          this.options.deployment = query.mpDeployment;
        }
      }

      this.options.paths = this.options.availablePaths[this.options.deployment];
    },

    // Get local assests, if needed
    getLocalAssests: function(callback) {
      var thisApp = this;

      // If local read in the bower map
      if (this.options.deployment === 'local') {
        $.getJSON('bower.json', function(data) {
          callback.apply(thisApp, [data.dependencyMap]);
        });
      }
      else {
        callback.apply(this, []);
      }
    },

    // Rendering tasks
    renderAssests: function(map) {
      var isIE = (helpers.isMSIE() && helpers.isMSIE() <= 8);

      // Add CSS from bower map
      if (_.isObject(map)) {
        _.each(map, function(c, ci) {
          if (c.css) {
            _.each(c.css, function(s, si) {
              $('head').append('<link rel="stylesheet" href="bower_components/' + s + '.css" type="text/css" />');
            });
          }
          if (c.ie && isIE) {
            _.each(c.ie, function(s, si) {
              $('head').append('<link rel="stylesheet" href="bower_components/' + s + '.css" type="text/css" />');
            });
          }
        });
      }

      // Get main CSS
      _.each(this.options.paths.css, function(c, ci) {
        $('head').append('<link rel="stylesheet" href="' + c + '" type="text/css" />');
      });
      if (isIE) {
        _.each(this.options.paths.ie, function(c, ci) {
          $('head').append('<link rel="stylesheet" href="' + c + '" type="text/css" />');
        });
      }

      // Add a processed class
      this.$el.addClass('inline-processed');
    }
  });

  return App;
});


/**
 * Run application
 */
require(['jquery', '<%= projectName %>'], function($, App) {
  $(document).ready(function() {
    var app = new App();
  });
});
