/**
 * Main application JS for: <%= projectName %>
 */


// Hack around existing jQuery
if (typeof window.jQuery != 'undefined') {
  window._jQuery = window.jQuery;
  window._$ = window.$;
}

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
 * Main application for: <%= projectName %>
 *
 * Update with any libraries that are needed.
 */
define('<%= projectName %>', ['jquery', 'underscore'],
  function($, _) {

  var defaultOptions = {
    el: '<%= projectName %>-inline-container',
    paths: {
      local: {
        css: '.tmp/css/styles.css',
        ie: '.tmp/css/styles.ie.css',
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
  }

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(defaultOptions, options);
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
    }

    this.determinePaths();
    this.getResources();
    this.start();
  };

  // Start function
  _.extend(App.prototype, {
    // Determine paths
    determinePaths: function() {
      this.paths = this.options.paths.local;
    },

    // Get resources, like CSS
    getResources: function() {

    },

    start: function() {


      /************************************
       * Enter main application logic here.
       ************************************/



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


// Hack back in the original jQuery
if (typeof window._jQuery != 'undefined') {
  window.jQuery = window._jQuery;
  window.$ = window._$;
}