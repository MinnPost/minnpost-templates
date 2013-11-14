/**
 * Routers
 */
define('routers', [
  'underscore', 'Backbone', 'Ractive', 'Ractive-Backbone',
  'helpers', 'models', 'collections', 'views',
  'text!templates/application.mustache',
  'text!templates/loading.mustache'
], function(_, Backbone, Ractive, RactiveBackbone,
    helpers, models, collections, views,
    tApplication, tLoading) {
  var routers = {};

  // Base model
  routers.Router = Backbone.Router.extend({
    views: {},

    initialize: function(options) {
      this.options = options;
      this.app = options.app;

      // Create application view
      this.views.application = new views.Application({
        el: this.app.$el,
        template: tApplication,
        data: {

        },
        router: this,
        partials: {
          loading: tLoading
        },
        adaptors: [ 'Backbone' ]
      });
    },

    routes: {
      'routeOne': 'routeOne',
      '*default': 'routeDefault'
    },

    start: function() {
      Backbone.history.start();
    },

    routeDefault: function() {
      this.navigate('/routeOne', { trigger: true, replace: true });
    },

    routeRouteOne: function() {
      // this is just a placeholder for a route
    }
  });

  // Return what we have
  return routers;
});
