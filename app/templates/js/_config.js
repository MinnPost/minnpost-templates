/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  baseUrl: 'js',
  paths: {
    '<%= projectName %>': 'app',
    <% for (var c in filteredComponentMap.js) { %>
    '<%= c %>': '../bower_components/<%= filteredComponentMap.js[c][0] %>',<% } %>
    // Hard code a few libraries that some libraries already
    // refer to but with different names
    Backbone: '../bower_components/backbone/backbone-min',
    Ractive: '../bower_components/ractive/build/Ractive-legacy.min'
  }
});
