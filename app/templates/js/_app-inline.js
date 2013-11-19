/**
 * Main JS for: <%= projectName %>
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
 * Create <%= projectName %> application class.
 *
 * Update with any libraries that are needed.
 */
define('<%= projectName %>', [
  'jquery', 'underscore', 'helpers',
  'text!templates/application.underscore', 'text!templates/loading.underscore'],
  function($, _, helpers, tApplication, tLoading) {

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
  };

  // Default options
  var defaultOptions = {
    el: '.<%= projectName %>-inline-container',
    paths: {
      local: {
        <% if (projectPrerequisites.useCompass) { %>
        css: '.tmp/css/styles.css',
        ie: '.tmp/css/styles.ie.css',<% } else { %>
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
  }

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


// Hack back in the original jQuery
if (typeof window._jQuery != 'undefined') {
  window.jQuery = window._jQuery;
  window.$ = window._$;
}
