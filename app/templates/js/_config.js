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
    components: '../bower_components',
    jquery: '../bower_components/jquery/jquery.min',
    backbone: '../bower_components/backbone/backbone-min',
    underscore: '../bower_components/underscore/underscore-min'
  }
});
