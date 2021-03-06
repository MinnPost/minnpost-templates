/**
 * Routers
 */
define([
  'underscore', 'backbone', 'ractive', 'ractive-backbone',
  'models', 'collections', 'views',
  'text!templates/application.mustache',
  'text!templates/loading.mustache'
], function(_, Backbone, Ractive, RactiveBackbone,
    models, collections, views,
    tApplication, tLoading) {
  'use strict';
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
        adapt: [ 'Backbone' ]
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
