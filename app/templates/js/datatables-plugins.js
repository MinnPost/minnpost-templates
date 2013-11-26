/**
 * Datatables plugins are just JS copied, so we put them
 * here.
 */
define('datatablesPlugins', ['jquery', 'underscore', 'datatables', 'text!templates/datatables-filter-links.underscore'],
  function($, _, dataTable, tFilterLinks) {

  /**
   * Clear all filtering.
   * See: http://datatables.net/plug-ins/api#fnFilterClear
   */
  $.fn.dataTableExt.oApi.fnFilterClear = function(oSettings) {
    var n;
    var i;
    /* Remove global filter */
    oSettings.oPreviousSearch.sSearch = "";

    /* Remove the text of the global filter in the input boxes */
    if (typeof oSettings.aanFeatures.f != 'undefined') {
      n = oSettings.aanFeatures.f;

      for (i=0, iLen=n.length ; i<iLen ; i++ ) {
        $('input', n[i]).val( '' );
      }
    }

    /* Remove the search text for the column filters
     * NOTE - if you have input boxes for these
     * filters, these will need to be reset
     */
    for (i=0, iLen=oSettings.aoPreSearchCols.length ; i<iLen ; i++) {
      oSettings.aoPreSearchCols[i].sSearch = "";
    }

    /* Redraw */
    oSettings.oApi._fnReDraw( oSettings );
  };

  /**
   * Type deteection for formatted numbers.
   * From: http://datatables.net/plug-ins/type-detection
   */
  $.fn.dataTableExt.aTypes.unshift(function(sData) {
    var deformatted = sData.replace(/[^\d\-\.\/a-zA-Z]/g,'');
    if ( $.isNumeric( deformatted ) || deformatted === "-" ) {
      return 'formatted-num';
    }
    return null;
  });

  /**
   * Sorting for numbers so that characters do not interfere
   */
  $.fn.dataTableExt.oSort['formatted-num-asc'] = function(a,b) {
    /* Remove any formatting */
    var x = a.match(/\d/) ? a.replace( /[^\d\-\.]/g, "" ) : 0;
    var y = b.match(/\d/) ? b.replace( /[^\d\-\.]/g, "" ) : 0;
    return parseFloat(x) - parseFloat(y);
  };
  $.fn.dataTableExt.oSort['formatted-num-desc'] = function(a,b) {
    var x = a.match(/\d/) ? a.replace( /[^\d\-\.]/g, "" ) : 0;
    var y = b.match(/\d/) ? b.replace( /[^\d\-\.]/g, "" ) : 0;
    return parseFloat(y) - parseFloat(x);
  };

  // Some extra methods to attach to application
  return {
    // Filter links for table tables
    addFilterLinks: function(options) {
      var thisApp = this;
      var $container = this.$content.find('.datatables-table');

      $container.prepend(_.template(tFilterLinks, { options: options }));
      $container.on('click', '.datatables-filter-links a', function(e) {
        e.preventDefault();
        var $thisLink = $(this);

        if ($thisLink.hasClass('filter-clear')) {
          thisApp.$dataTable.fnFilterClear();
        }
        else {
          thisApp.$dataTable.fnFilter($thisLink.text(), $thisLink.data('col'));
        }

        $container.find('.datatables-filter-links a').removeClass('filtering');
        $thisLink.addClass('filtering');
      });
    }
  };
});
