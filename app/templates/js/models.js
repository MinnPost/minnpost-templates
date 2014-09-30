/**
 * Models
 */
define(['underscore', 'backbone'],
  function(_, Backbone) {
  'use strict';
  var models = {};

  // Base model
  models.Base = Backbone.Model.extend({
    initialize: function(data, options) {
      // Attach options
      this.options = options || {};
      this.app = options.app;

      // Call this in other models
      //models.NEWModel.__super__.initialize.apply(this, arguments);
    }

  });

  // Return what we have
  return models;
});
