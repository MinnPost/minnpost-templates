/**
 * Main application file for: <%= projectName %>
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */
define('<%= projectName %>', ['jquery', 'underscore', 'helpers', 'routers'],
  function($, _, helpers, routers) {

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
    }
  };

  // Extend with custom methods
  _.extend(App.prototype, {
    // Start function
    start: function() {
      // Create router
      this.router = new routers.Router({
        app: this
      });

      // Start backbone history
      this.router.start();
    },

    // Default options
    defaultOptions: {

    }
  });

  return App;
});
