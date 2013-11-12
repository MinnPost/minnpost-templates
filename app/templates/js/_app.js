/**
 * Main application file.  This pulls in all the parts
 * and creates the main object for the application.
 */
define('<%= projectName %>', ['underscore', 'helpers', 'models', 'collections', 'views', 'routers'],
  function(_, helpers, models, collections, views, routers) {

  // Constructor for app
  var App = function(options) {
    this.options = options;
    if (this.el) {
      this.$el = $(el);
    }
  };

  // Extend with helpers
  _.extend(App.prototype, helpers);

  // Start function
  App.prototype.start = function() {
    // Get initial data
    // Create router
    // Start backbone history
  };

  return App;
});
