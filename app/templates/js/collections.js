/**
 * Collections
 */
define(['underscore', 'backbone', 'models'],
  function(_, Backbone, models) {
  'use strict';
  var collections = {};

  // Base collection
  collections.Base = Backbone.Collection.extend({
    initialize: function(models, options) {
      // Attach options
      this.options = options || {};
      this.app = options.app;

      // Call this in other collections
      //collection.NEWCollection.__super__.initialize.apply(this, arguments);
    }

  });

  // Return what we have
  return collections;
});
