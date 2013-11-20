/**
 * Main JS for: <%= projectName %>
 */

/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'Backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  baseUrl: 'js',
  paths: {
    <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js) { %>
    '<%= filteredComponentMap[c].rname %>': '../bower_components/<%= filteredComponentMap[c].js[0] %>',<% }} %>
    '<%= projectName %>': 'app'
  }
});

/**
 * Create <%= projectName %> application class.
 *
 * Update with any libraries that are needed.
 */
define('<%= projectName %>', [
  'jquery', 'underscore', 'helpers',
  <%= (projectType === 'leafletMap') ? "'Leaflet', " : '' %>
  <%= (projectType === 'highchartsChart') ? "'Highcharts', " : '' %>
  'text!templates/application.underscore', 'text!templates/loading.underscore'
],
function($, _, helpers,
  <%= (projectType === 'leafletMap') ? "L, " : '' %>
  <%= (projectType === 'highchartsChart') ? "Highcharts, " : '' %>
  tApplication, tLoading) {

  // Main function for execution, proxied here so that
  // you do not have to scroll down all the way
  var startProxy = function() {
    var thisApp = this;
    this.$content = this.$el.find('.content-container');

    /************************************
     * Enter main application logic here.
     ************************************/

     // You can reference the main container with:
     //   this.$el
     // Or you probably want the content container,
     // assuming you are using the default template
     //   this.$content

     // All the methods from helpers.js are attached
     // to `this` as well.  These include things like
     // formatters.

    <% if (projectType === 'leafletMap') { %>
    // Make map.  Check the options below to see what
    // the defaults are.
    this.map = new L.Map(this.options.defaultMapId, this.options.defaultMapOptions);
    this.map.setView(this.options.minneapolisPoint, 8);
    // This removes the embedded attribution which should be in the footnote
    // but ensure that attribution is given correctly
    this.map.attributionControl.setPrefix(false);
    // Add base lyaer
    this.map.addLayer(this.options.minnpostBaseLayer);

    // Do more with the map here
    <% } %>
  };

  // Default options
  var defaultOptions = {
    el: '.<%= projectName %>-inline-container',
    paths: {
      local: {
        <% if (projectPrerequisites.useCompass) { %>
        css: '.tmp/css/main.css',
        ie: '.tmp/css/main.ie.css',<% } else { %>
        css: 'styles/styles.css',
        ie: 'styles/styles.ie.css',<% } %>
        images: 'images/',
        data: 'data/'
      },
      build: {
        css: 'dist/<%= projectName %>.latest.css',
        ie: 'dist/<%= projectName %>.latest.ie.css',
        images: 'dist/images/',
        data: 'dist/data/'
      },
      deploy: {
        css: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>.latest.css',
        ie: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>.latest.ie.css',
        images: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>/images/',
        data: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>/data/'
      }
    }
  };

  <% if (projectType === 'leafletMap') { %>
  // Add in some default map values
  defaultOptions = _.extend(defaultOptions, {
    defaultMapId: '<%= projectName %>-map',
    minneapolisPoint: L.latLng(44.983333998267824, -93.26667000248563),
    stpaulPoint: L.latLng(44.95370289870105, -93.08995780069381),
    minnesotaPoint: L.latLng(46.518286790004616, -94.55406386114191),
    minnpostBaseLayer: new L.tileLayer('//{s}.tiles.mapbox.com/v3/minnpost.map-wi88b700/{z}/{x}/{y}.png'),
    defaultMapOptions: {
      scrollWheelZoom: false,
      trackResize: true
    },
    defaultMapStyle: {
      stroke: true,
      color: '#2DA51D',
      weight: 1.5,
      opacity: 0.9,
      fill: true,
      fillColor: '#2DA51D',
      fillOpacity: 0.2,
      clickable: false
    }
  });
  <% } %>

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(defaultOptions, options);
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
    }

    this.setup();
    this.start();
  };

  // Extend with helpers
  _.extend(App.prototype, helpers);

  // Start function
  _.extend(App.prototype, {

    // General setup tasks
    setup: function() {
      // Determine path
      if (window.location.host.indexOf('localhost') !== -1) {
        this.paths = this.options.paths.local;
        if (window.location.pathname.indexOf('index-build') !== -1) {
          this.paths = this.options.paths.build;
        }
      }
      else {
        this.paths = this.options.paths.deploy;
      }

      // Get resources like CSS
      $('head').append('<link rel="stylesheet" href="' + this.paths.css + '" type="text/css" />');
      if (this.isMSIE() && this.isMSIE() <= 8) {
        $('head').append('<link rel="stylesheet" href="' + this.paths.ie + '" type="text/css" />');
      }

      // Add a processing class
      this.$el.addClass('inline-processed');

      // Render main template
      this.$el.html(_.template(tApplication, {
        loading: _.template(tLoading, {})
      }));
    },

    // Main execution
    start: startProxy
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
