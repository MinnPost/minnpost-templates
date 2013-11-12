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
    components: '../bower_components'
  }
});
