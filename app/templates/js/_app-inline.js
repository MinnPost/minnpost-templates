/**
 * Main JS for: <%= projectName %>
 */

/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'Backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    // Mapbox and requireJS don't really work, so we just let
    // the L be global
    'mapbox': {
      exports: 'mapbox'
    }
  },
  baseUrl: 'js',
  paths: {
    <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js) { %>
    '<%= filteredComponentMap[c].rname %>': '../bower_components/<%= filteredComponentMap[c].js[0] %>',<% }} %>
    <% if (projectType === 'datatablesTable') { %>
    'datatablesPlugins': 'datatables-plugins',<% } %>
    '<%= projectName %>': 'app'
  }
});

/**
 * Create <%= projectName %> application class.
 *
 * Update with any libraries that are needed.
 */
define('<%= projectName %>', [
  'jquery', 'underscore', 'helpers',
  <%= (projectType === 'leafletMap') ? "'Leaflet', " : '' %>
  <%= (projectType === 'mapboxMap') ? "'mapbox', " : '' %>
  <%= (projectType === 'highchartsChart') ? "'Highcharts', " : '' %>
  <% if (projectType === 'datatablesTable') { %>
  'datatables', 'jqueryCSV', 'datatablesPlugins', 'text!../data/example.csv',<% } %>
  'text!templates/application.underscore', 'text!templates/loading.underscore'
],
function($, _, helpers,
  <%= (projectType === 'leafletMap') ? "L, " : '' %>
  <%= (projectType === 'mapboxMap') ? "mapbox, " : '' %>
  <%= (projectType === 'highchartsChart') ? "Highcharts, " : '' %>
  <% if (projectType === 'datatablesTable') { %>
  dataTable, jqueryCSV, datatablesPlugins, csvExample,<% } %>
  tApplication, tLoading) {

  // Main function for execution, proxied here so that
  // you do not have to scroll down all the way
  var startProxy = function() {
    var thisApp = this;
    this.$content = this.$el.find('.content-container');

    /************************************
     * Enter main application logic here.
     ************************************/

    // You can reference the main container with:
    //   this.$el
    // Or you probably want the content container,
    // assuming you are using the default template
    //   this.$content

    // All the methods from helpers.js are attached
    // to `this` as well.  These include things like
    // formatters.

    <% if (projectType === 'datatablesTable') { %>
    // Parse data from CSV
    this.csvData = $.csv.toArrays(csvExample, {
      separator: ',',
      delimiter: '"'
    });

    // Create titles from first row and remove it
    this.tableColumns = {};
    _.each(this.csvData[0], function(c, ci) {
      thisApp.tableColumns[ci] = { sTitle: c };
    });
    this.csvData = _.rest(this.csvData);

    // Define specific about how the columns work.
    this.tableColumns = $.extend(true, this.tableColumns, {
      // Makes it so that the last name column sorts on
      // both last and first name
      4: { aDataSort: [4, 5] },
      5: { bSortable: false },
      3: {
        bSearchable: false,
        mRender: function(data, type, full) {
          return thisApp.formatNumber(parseFloat(data), 2);
        }
      },
      2: {
        sClass: 'money',
        bSearchable: false,
        mRender: function(data, type, full) {
          return thisApp.formatCurrency(parseFloat(data), 2);
        }
      }
    });

    // Extend the default options
    this.options.dataTables = $.extend(true, this.options.dataTables, {
      aaData: this.csvData,
      aoColumns: _.values(this.tableColumns)
    });

    // Make data table
    this.$dataTable = this.$el.find('table');
    this.$dataTable.dataTable(this.options.dataTables);

    // Add filter links
    this.addFilterLinks([
      { term: 'Examplton', col: 4 }
    ]);
    <% } %>

    <% if (projectType === 'mapboxMap') { %>
    // Use compositing for custom Mapbox maps.  This means
    // adding multiple layers with one call:
    //   ex. minnpost.map-4v6echxm,minnpost.map-BNMSNS
    //
    // See Mapbox.js API and examples
    // https://www.mapbox.com/mapbox.js/api/
    this.map = L.mapbox.map(this.options.defaultMapId, this.options.mapboxStreetsLightLabels);
    // This removes the embedded attribution which should be in the footnote
    // but ensure that attribution is given correctly
    this.map.attributionControl.setPrefix(false);
    <% } %>

    <% if (projectType === 'leafletMap') { %>
    // Make map.  Check the options below to see what
    // the defaults are.
    this.map = new L.Map(this.options.defaultMapId, this.options.defaultMapOptions);
    // Add base layer
    this.map.addLayer(this.options.defaultBaseLayer);
    // Center view
    this.map.setView(this.options.minneapolisPoint, 8);
    // This removes the embedded attribution which should be in the footnote
    // but ensure that attribution is given correctly
    this.map.attributionControl.setPrefix(false);

    // Do more with the map here

    // Due to how Leaflet animates and (probably) how the CSS
    // is pulled in dynamically, the map gets offset, so we wait
    // just a moment and invalidate the size to reset the map
    window.setTimeout(function() {
      thisApp.map.invalidateSize();
    }, 500);
    <% } %>
  };

  // Default options
  var defaultOptions = {
    el: '.<%= projectName %>-inline-container',
    paths: {
      local: {
        <% if (projectPrerequisites.useCompass) { %>
        css: '.tmp/css/main.css',
        ie: '.tmp/css/main.ie.css',<% } else { %>
        css: 'styles/styles.css',
        ie: 'styles/styles.ie.css',<% } %>
        images: 'images/',
        data: 'data/'
      },
      build: {
        css: 'dist/<%= projectName %>.latest.css',
        ie: 'dist/<%= projectName %>.latest.ie.css',
        images: 'dist/images/',
        data: 'dist/data/'
      },
      deploy: {
        css: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>.latest.css',
        ie: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>.latest.ie.css',
        images: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>/images/',
        data: 'https://s3.amazonaws.com/data.minnpost/projects-inline/<%= projectName %>/<%= projectName %>/data/'
      }
    }
  };

  <% if (projectType === 'leafletMap' || projectType === 'mapboxMap') { %>
  // Add in some default map values
  defaultOptions = _.extend(defaultOptions, {
    defaultMapId: '<%= projectName %>-map',
    minneapolisPoint: L.latLng(44.983333998267824, -93.26667000248563),
    stpaulPoint: L.latLng(44.95370289870105, -93.08995780069381),
    minnesotaPoint: L.latLng(46.518286790004616, -94.55406386114191),
    mapboxSatelliteStreets: 'minnpost.map-95lgm5jf',
    mapboxStreetsDarkLabels: 'minnpost.map-4v6echxm',
    mapboxStreetsLightLabels: 'minnpost.map-wi88b700',
    mapboxTerrainLight: 'minnpost.map-vhjzpwel',
    mapboxTerrainDark: 'minnpost.map-dhba3e3l',
    defaultBaseLayer: new L.tileLayer('//{s}.tiles.mapbox.com/v3/minnpost.map-wi88b700/{z}/{x}/{y}.png'),
    defaultMapOptions: {
      scrollWheelZoom: false,
      trackResize: true
    },
    defaultMapStyle: {
      stroke: true,
      color: '#2DA51D',
      weight: 1.5,
      opacity: 0.9,
      fill: true,
      fillColor: '#2DA51D',
      fillOpacity: 0.2,
      clickable: false
    }
  });
  <% } %>

  <% if (projectType === 'datatablesTable') { %>
  // Add on some default options for data tables
  defaultOptions = _.extend(defaultOptions, {
    dataTables: {
      iDisplayLength: 20,
      bLengthChange: false,
      bProcessing: true,
      bAutoWidth: true,
      aaSorting: [[ 0, 'asc' ]],
      aLengthMenu: [[10, 20, 50, -1], [10, 20, 50, 'All']]
    }
  });
  <% } %>

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(defaultOptions, options);
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
    }
    this.setup();
  };

  // Extend with helpers
  _.extend(App.prototype, helpers);

  <% if (projectType === 'datatablesTable') { %>
  // Extend with data tables extras
  _.extend(App.prototype, datatablesPlugins);
  <% } %>

  // Start function
  _.extend(App.prototype, {

    // General setup tasks
    setup: function() {
      var thisApp = this;

      // Determine path
      if (window.location.host.indexOf('localhost') !== -1) {
        this.paths = this.options.paths.local;
        this.options.isLocal = true;
        if (window.location.pathname.indexOf('index-build') !== -1) {
          this.paths = this.options.paths.build;
        }
      }
      else {
        this.paths = this.options.paths.deploy;
      }

      // If local read in the bower map and add css
      if (this.options.isLocal) {
        $.getJSON('bower_map.json', function(data) {
          _.each(data, function(c, ci) {
            if (c.css) {
              _.each(c.css, function(s, si) {
                $('head').append('<link rel="stylesheet" href="bower_components/' + s + '.css" type="text/css" />');
              });
            }
            if (c.ie && (thisApp.isMSIE() && thisApp.isMSIE() <= 8)) {
              _.each(c.ie, function(s, si) {
                $('head').append('<link rel="stylesheet" href="bower_components/' + s + '.css" type="text/css" />');
              });
            }
          });

          thisApp.render();
        });
      }
      else {
        thisApp.render();
      }
    },

    // Rendering tasks
    render: function() {
      // Get main CSS
      $('head').append('<link rel="stylesheet" href="' + this.paths.css + '" type="text/css" />');
      if (this.isMSIE() && this.isMSIE() <= 8) {
        $('head').append('<link rel="stylesheet" href="' + this.paths.ie + '" type="text/css" />');
      }

      // Add a processing class
      this.$el.addClass('inline-processed');

      // Render main template
      this.$el.html(_.template(tApplication, {
        loading: _.template(tLoading, {})
      }));

      this.start();
    },

    // Main execution
    start: startProxy
  });

  return App;
});

/**
 * Run application
 */
require(['jquery', '<%= projectName %>'], function($, App) {
  $(document).ready(function() {
    var app = new App();
  });
});
