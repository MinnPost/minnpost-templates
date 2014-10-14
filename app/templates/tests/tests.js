/**
 * Main tests
 */

// Rquier and QUnit don't play well together
QUnit.config.autostart = false;

// Ensure require is pointed correctly
require.config({
  baseUrl: '../js'
});

// Base class
require(['base'], function(Base) {
  'use strict';
  QUnit.start();

  // Create new class for app
  var appName = 'minnpost-test';
  var App = Base.BaseApp.extend({
    defaults: {
      name: appName,
      el: '.' + appName + '-container',
      basePath: '../'
    },

    initialize: function() {
    }
  });

  // Basic parts
  QUnit.test('Base class basics', function(assert) {
    var app = new App({});

    assert.equal(app.name, appName, 'App is named correctly.');
    assert.equal(app.options.deployment, 'local', 'App deployment is determined and local.');
  });

  // CSS Loading
  QUnit.asyncTest('Base class CSS loading', function(assert) {
    expect(1);
    var app = new App({});

    // "timeout"
    var t = setTimeout(function() {
      assert.ok(false, 'Timeout reached for CSS Loaded event.');
      QUnit.start();
    }, 5000);


    app.on('cssLoaded', function() {
      assert.ok(true, 'CSS Loaded event triggered.');
      clearTimeout(t);
      QUnit.start();
    });
  });

  // Data requests
  QUnit.asyncTest('Base JSONP requests', function(assert) {
    expect(1);
    var app = new App({});
    var testEndpoint = 'https://s3.amazonaws.com/data.minnpost/projects/' +
      'minnpost-green-line-demographics/data/census-tracts-ids.json';

    // "timeout"
    var t = setTimeout(function() {
      assert.ok(false, 'Timeout reached for Base JSONP requests.');
      QUnit.start();
    }, 9000);

    app.jsonpRequest({
      url: testEndpoint
    })
    .done('cssLoaded', function(data) {
      assert.ok((data.length > 5), 'Base JSONP request made.');
      clearTimeout(t);
      QUnit.start();
    });
  });
});
