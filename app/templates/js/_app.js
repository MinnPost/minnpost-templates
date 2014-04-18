/**
 * Main application file for: <%= projectName %>
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

<% var templateExt = (projectFeatures.hasRactive === true) ? 'mustache' : 'underscore'; %>

// Create main application
define('<%= projectName %>', [
  <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js && filteredComponentMap[c].returns) { %>'<%= filteredComponentMap[c].rname %>', <% }} %>
  <%= (projectFeatures.hasCSVs === true) ? "'text!../data/example.csv', " : "" %>
  'text!templates/application.<%= templateExt %>',
  'text!templates/loading.<%= templateExt %>'
], function(
  <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js && filteredComponentMap[c].returns) { %><%= filteredComponentMap[c].returns %>, <% }} %>
  <%= (projectFeatures.hasCSVs === true) ? "tExampleCSV, " : "" %>
  tApplication, tLoading
  ) {

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
      this.$content = this.$el.find('.content-container');
    }

    <% if (isInline) { %>
    // Inline apps render CSS on the fly
    this.setup(function(map) {
      this.render(map);
      this.start();
    });
    <% } %>
  };

  // Extend with custom methods
  _.extend(App.prototype, {
    // Start function
    start: function() {

      // Main logic goes here
      //
      // Some examples provided

      <% if (projectFeatures['hasBackbone'] === true) { %>
      // Create router
      this.router = new routers.Router({
        app: this
      });

      // Start backbone history
      this.router.start();
      <% } %>

      <% if (projectFeatures['hasBackbone'] !== true) { %>
      <% if (projectFeatures['hasRactive'] === true) { %>
      // Create main application view
      this.mainView = new Ractive({
        el: this.$el,
        template: tApplication,
        data: {

        },
        partials: {
          loading: tLoading
        }
      });
      <% } %>
      <% if (projectFeatures['hasRactive'] !== true) { %>
      // Create main application view
      this.$content.html(_.template(tApplication, {
        data: {

        },
        loading: _.template(tLoading, {})
      }));
      <% } %>
      <% } %>


      <% if (isInline && projectFeatures['hasHighCharts'] === true) { %>
      // Highcharts example
      this.chartData = [{
        name: 'Example',
        data: [ 6 , 11, 32, 110, 235, 369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605, 24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104 ]
      }];
      // Add any custom highchart options
      this.options.highChartOptions = $.extend(this.options.highChartOptions, {
        series: this.chartData
      });

      // Create chart and assign some variables
      this.$chart = this.$el.find('.highcharts-chart-container');
      this.$wrapper = this.$el.find('.highcharts-chart-wrapper');
      this.chart = this.$chart.highcharts(this.options.highChartOptions);
      this.chart = this.chart.highcharts();

      // Highcharts is not respecting the container dimensions,
      // it seems to be because the element is not fully
      // loaded, but still not able to find a good answer, so
      // manually set dimentsions
      this.chart.setSize(640, 200);
      <% } %>


      <% if (isInline && projectFeatures['hasDatatables'] === true) { %>
      // Datatables example
      <% if (projectFeatures['hasCSVs'] === true) { %>
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
      <% } %>

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
        <% if (projectFeatures['hasCSVs'] === true) { %>
        aaData: this.csvData,
        <% } %>
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


      <% if (isInline && projectFeatures['hasMapbox'] === true) { %>
      // Example map

      // Use compositing for custom Mapbox maps.  This means
      // adding multiple layers with one call:
      //   ex. minnpost.map-4v6echxm,minnpost.map-BNMSNS
      //
      // See Mapbox.js API and examples
      // https://www.mapbox.com/mapbox.js/api/
      this.map = L.mapbox.map(this.options.defaultMapId, this.options.mapboxStreetsLightLabels);
      <% } %>



      <% if (isInline && projectFeatures['hasLeaflet'] === true) { %>
      // Make map.  Check the options below to see what
      // the defaults are.
      this.map = new L.Map(this.options.defaultMapId, this.options.defaultMapOptions);
      // Add base layer
      this.map.addLayer(this.options.defaultBaseLayer);
      // Center view
      this.map.setView(this.options.minneapolisPoint, 8);
      // This removes the embedded attribution which should be in the footnote
      // but ensure that attribution is given correctly
      this.map.removeControl(this.map.attributionControl);

      // Do more with the map here

      // Due to how Leaflet animates and (probably) how the CSS
      // is pulled in dynamically, the map gets offset, so we wait
      // just a moment and invalidate the size to reset the map
      window.setTimeout(function() {
        thisApp.map.invalidateSize();
      }, 500);
      <% } %>

    },

    // Default options
    defaultOptions: {
      projectName: '<%= projectName %>',
      <% if (isInline) { %>
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
      },
      <% } %>
      <% if (projectFeatures['hasLeaflet'] === true || projectFeatures['hasMapbox'] === true) { %>
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
      <% } %>
      <% if (projectFeatures['hasDatatables'] === true) { %>
      dataTables: {
        iDisplayLength: 20,
        bLengthChange: false,
        bProcessing: true,
        bAutoWidth: true,
        aaSorting: [[ 0, 'asc' ]],
        aLengthMenu: [[10, 20, 50, -1], [10, 20, 50, 'All']]
      },
      <% } %>
      <% if (projectFeatures['hasHighcharts'] === true) { %>
      highChartOptions: {
        chart: {
          type: 'line',
          style: {
            fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
            color: '#BCBCBC'
          }
        },
        colors: ['#094C86', '#BCBCBC'],
        credits: {
          enabled: false
        },
        title: {
          enabled: false,
          text: ''
        },
        legend: {
          borderWidth: 0
        },
        plotOptions: {
          line: {
            lineWidth: 4,
            states: {
              hover: {
                lineWidth: 5
              }
            },
            marker: {
              fillColor: '#ffffff',
              lineWidth: 2,
              lineColor: null,
              symbol: 'circle',
              enabled: false,
              states: {
                hover: {
                  enabled: true
                }
              }
            }
          }
        },
        xAxis: {
          title: { },
          minPadding: 0,
          maxPadding: 0,
          type: 'category',
          labels: {
            formatter: function() {
              return this.value;
            }
          }
        },
        yAxis: {
          title: {
            enabled: false,
            text: '[Update me]',
            margin: 40,
            style: {
              color: 'inherit',
              fontWeight: 'normal'
            }
          },
          min: 0,
          gridLineColor: '#BCBCBC'
        },
        tooltip: {
          //shadow: false,
          //borderRadius: 0,
          //borderWidth: 0,
          style: {},
          useHTML: true,
          formatter: function() {
            return '<strong>' + this.series.name + '</strong><br />' +
              this.y + '<br /><br />' +
              '<em>For months ' + this.key + '</em>';
          }
        }
      },
      <% } %>
    }

    <% if (isInline) { %>
    // General setup tasks
    setup: function(callback) {
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
        $.getJSON('bower.json', function(data) {
          callback.apply([data.dependencyMap], thisApp);
        });
      }
      else {
        callback.apply([], this);
      }
    },

    // Rendering tasks
    render: function(map) {
      // Add CSS from bower map
      if (_.isObject(map)) {
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
      }

      // Get main CSS
      $('head').append('<link rel="stylesheet" href="' + this.paths.css + '" type="text/css" />');
      if (this.isMSIE() && this.isMSIE() <= 8) {
        $('head').append('<link rel="stylesheet" href="' + this.paths.ie + '" type="text/css" />');
      }

      // Add a processing class
      this.$el.addClass('inline-processed');
    }
    <% } %>
  });

  return App;
});


<% if (isInline) { %>
/**
 * Run application
 */
require(['jquery', '<%= projectName %>'], function($, App) {
  $(document).ready(function() {
    var app = new App();
  });
});
<% } %>
