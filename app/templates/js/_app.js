/**
 * Main application file for: <%= projectName %>
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */
define('<%= projectName %>', ['underscore', 'helpers', 'routers'],
  function(_, helpers, routers) {

  // Constructor for app
  var App = function(options) {
    this.options = options;
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
    }
  };

  // Extend with helpers
  _.extend(App.prototype, helpers);

  // Start function
  App.prototype.start = function() {
    // Create router
    this.router = new routers.Router({
      app: this
    });

    // Start backbone history
    this.router.start();
  };

  return App;
});
