/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {
    <% if (projectFeatures.hasHighcharts === true) { %>
    'Highcharts': {
      exports: 'Highcharts',
      'deps': [ 'jquery']
    },
    <% } %>
    <% if (projectFeatures.hasMapbox === true) { %>
    // Mapbox and requireJS don't really work, so we just let
    // the L be global
    'mapbox': {
      exports: 'mapbox'
    },
    <% } %>
  },
  baseUrl: 'js',
  paths: {
    <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js) { %>
    '<%= filteredComponentMap[c].rname %>': '../bower_components/<%= filteredComponentMap[c].js[0] %>',<% }} %>
    '<%= projectName %>': 'app'
  }
});
