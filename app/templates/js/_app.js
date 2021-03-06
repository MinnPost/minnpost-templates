/**
 * Main application file for: <%= projectName %>
 *
 * This pulls in all the parts
 * and creates the main object for the application.
 */

// Create main application
require([
  <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js && filteredComponentMap[c].returns) { %>'<%= filteredComponentMap[c].rname %>', <% }} %>
  'base',
  <%= (projectFeatures.hasModeling) ? "'routers', " : "" %>
  <%= (projectFeatures.hasCSVs) ? "'text!../data/example.csv', " : "" %>
  'text!templates/application.<%= templateExt %>'
], function(
  <% for (var c in filteredComponentMap) { if (filteredComponentMap[c].js && filteredComponentMap[c].returns) { %><%= filteredComponentMap[c].returns %>, <% }} %>
  Base,
  <%= (projectFeatures.hasBackbone) ? "routers, " : "" %>
  <%= (projectFeatures.hasCSVs) ? "tExampleCSV, " : "" %>
  tApplication
  ) {
  'use strict';

  // Create new class for app
  var App = Base.BaseApp.extend({

    defaults: {
      name: '<%= projectName %>',
      el: '.<%= projectName %>-container'
    },

    initialize: function() {
      var thisApp = this;

      <% if (projectFeatures.hasBackbone) { %>
      // Create router
      this.router = new routers.Router({
        app: this
      });
      // Start backbone history
      this.router.start();
      <% } else if (!projectFeatures.hasBackbone && projectFeatures.hasRactive) { %>
      // Create main application view
      this.mainView = new Ractive({
        el: this.$el,
        template: tApplication,
        data: {
        },
        partials: {
        }
      });
      <% } else if (!projectFeatures.hasBackbone && !projectFeatures.hasRactive) { %>
      // Create main application view
      this.$content.html(_.template(tApplication, {
        data: {
        }
      }));
      <% } %>

      <% if (includeExamples) { %>
      // Run examples.  Please remove for real application.
      //
      // Because of how Ractive initializes and how Highcharts work
      // there is an inconsitency of when the container for the chart
      // is ready and when highcharts loads the chart.  So, we put a bit of
      // of a pause.
      //
      // In production, intializing a chart should be tied to data which
      // can be used with a Ractive observer.
      //
      // This should not happen with underscore templates.
      _.delay(function() { thisApp.makeExamples(); }, 400);
      <% } %>
    },

    <% if (includeExamples) { %>
    // Make some example depending on what parts were asked for in the
    // templating process.  Remove, rename, or alter this.
    makeExamples: function() {
      <% if (projectFeatures.hasHighcharts) { %>
      var exampleData = [{
        name: 'Example',
        data: [ 6 , 11, 32, 110, 235, 369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605, 24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104 ]
      }];

      // Line chart
      mpHighcharts.makeChart(this.$('.chart-line-example'),
        $.extend(true, {}, mpHighcharts.lineOptions, {
          colors: _.sample(_.values(mpConfig['colors-data']), 3),
          series: exampleData,
          legend: { enabled: false },
          yAxis: {
            title: { enabled: false }
          }
        }
      ));

      // Column chart
      mpHighcharts.makeChart(this.$('.chart-column-example'),
        $.extend(true, {}, mpHighcharts.columnOptions, {
          colors: _.sample(_.values(mpConfig['colors-data']), 3),
          series: exampleData,
          legend: { enabled: false }
        }
      ));
      <% } %>

      <% if (projectFeatures.hasDatatables) { %>
      var sampleCSVData = [];
      var tableColumns = {};
      var options = {};
      var i;
      var row;
      var $dataTable;

      // Make some data
      for (i = 0; i < 55; i++) {
        row = [];
        row.push(_.sample(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']));
        row.push(_.random(1, 12) + '/' + _.random(1, 28) + '/' + _.random(1975, 2014));
        row.push((_.random(1000, 10000) / 100).toString());
        row.push(_.random(10000, 100000).toString());
        row.push(_.sample(['lastA', 'lastB', 'lastC', 'lastD', 'lastE', 'lastF', 'lastG', 'lastH', 'lastI', 'lastJ', 'lastK']));
        row.push(_.sample(['firstA', 'firstB', 'firstC', 'firstD', 'firstE', 'firstF', 'firstG', 'firstH', 'firstI', 'firstJ', 'firstK']));
        sampleCSVData.push(row);
      }

      // Define specific about how the columns work.
      tableColumns = $.extend(true, {}, {
        0: { sTitle: 'Thing' },
        1: { sTitle: 'Date' },
        // Makes it so that the last name column sorts on
        // both last and first name
        4: {
          sTitle: 'Last',
          aDataSort: [4, 5]
        },
        5: {
          sTitle: 'First',
          bSortable: false
        },
        3: {
          sTitle: 'Number',
          bSearchable: false,
          mRender: function(data, type, full) {
            return mpFormatters.integer(parseFloat(data));
          }
        },
        2: {
          sTitle: 'Money',
          sClass: 'money',
          bSearchable: false,
          mRender: function(data, type, full) {
            return mpFormatters.currency(parseFloat(data));
          }
        }
      });
      options = $.extend(true, {}, {
        aaData: sampleCSVData,
        aoColumns: _.values(tableColumns)
      }, options);

      mpDatatables.makeTable(this.$('.datatable-example'), options);
      <% } %>

      <% if (projectFeatures.hasMapbox || projectFeatures.hasLeaflet) { %>
      var markerMap = mpMaps.makeLeafletMap('example-markers-features-map');
      var tooltipControl = new mpMaps.TooltipControl();
      markerMap.setZoom(9);
      markerMap.addControl(tooltipControl);

      // Markers
      var iconCinema = mpMaps.makeMakiIcon('cinema', 'm');
      var iconBlank = mpMaps.makeMakiIcon('', 's', '222222');
      L.marker(mpMaps.minneapolisPoint, { icon: iconCinema })
        .addTo(markerMap).bindPopup('Minneapolis', {
          closeButton: false
        });
      L.marker(mpMaps.stPaulPoint, { icon: iconBlank })
        .addTo(markerMap).bindPopup('St. Paul', {
          closeButton: false
        });

      // GeoJSON example
      $.getJSON('//boundaries.minnpost.com/1.0/boundary/27-county-2010/?callback=?', function(data) {
        if (data.simple_shape) {
          L.geoJson(data.simple_shape, {
            style: mpMaps.mapStyle,
            onEachFeature: function(feature, layer) {
              layer.on('mouseover', function(e) {
                tooltipControl.update('Hennepin County');
              });
              layer.on('mouseout', function(e) {
                tooltipControl.hide();
              });
            }
          }).addTo(markerMap);
        }
      });
      <% } %>
    },
    <% } %>
  });

  // Create instance and return
  return new App({});
});
