var _listingPerformanceRender = function($elm, store) {
  var $pageContainer = $('article#' + $elm.id);
  var storePath = store ? store : 'listing-performance';

  var client = $('body').hasClass('client') ? true : false;
  var preview = $('body').hasClass('preview') ? true : false;

  if (client) {
    _bindClientEvents();
  } else {
    _bindMasterEvents();
  }

  if (preview) {
    _initRemovables();
  }

  // Nested data if none
  var contextStore = {
    rows: [
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      }
    ],
    columns: [
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      },
      {
        visible: true
      }
    ]
  };

  // Initiate prep mode removables
  function _initRemovables() {
    var $removableRow = $pageContainer.find(
      '.table-performance__removable > .table-performance__heading'
    );
    var $removableColumn = $pageContainer.find(
      '.table-performance__removablesub'
    );
    var $ref = $pageContainer.find('.removable-refresh-btn');

    $removableRow.click(function() {
      var index = $(this)
        .closest('tr')
        .attr('val');
      var newRows = contextStore.rows;
      newRows[index].visible = false;
      _.assign(contextStore.rows, newRows);
      Bridge.Context.set(storePath, contextStore);

      _initRemovablesRender();
      Bridge.Event.trigger('master:listing-performance-context', {
        row: index
      });
    });

    $removableColumn.click(function() {
      var index = $(this).attr('val');
      var newColumns = contextStore.columns;
      newColumns[index].visible = false;
      _.assign(contextStore.columns, newColumns);
      Bridge.Context.set(storePath, contextStore);

      _initRemovablesRender();
      Bridge.Event.trigger('master:listing-performance-context', {
        column: index
      });
    });

    // Table refresh
    $ref.click(function() {
      var tableRef = contextStore;

      $.each(tableRef.rows, function(index, row) {
        row.visible = true;
      });
      $.each(tableRef.columns, function(index, column) {
        column.visible = true;
      });
      _.assign(contextStore.tile, tableRef);
      Bridge.Context.set(storePath, contextStore);

      _initRemovablesRender();
      Bridge.Event.trigger('master:listing-performance-context', {
        refresh: true
      });
    });

    Bridge.Event.on('client:fetch-listing-performance-context', function() {
      Bridge.Event.trigger('master:listing-performance-context');
    });
  }

  _initRemovablesRender();

  function _initRemovablesRender() {
    var $context = Bridge.Context.match('.' + storePath, contextStore);

    $.each($context.rows, function(index, value) {
      value.visible != true
        ? $pageContainer.find('tr[val="' + index + '"]').hide()
        : $pageContainer.find('tr[val="' + index + '"]').show();
    });

    $.each($context.columns, function(index, value) {
      var inc = index - 1;
      value.visible != true
        ? ($pageContainer.find('th[val="' + index + '"]').hide(),
          $pageContainer.find('td[val="' + inc + '"]').hide())
        : ($pageContainer.find('th[val="' + index + '"]').show(),
          $pageContainer.find('td[val="' + inc + '"]').show());
    });
  }

  // Client master catchup
  function _bindMasterEvents() {}

  // Executing clients
  function _bindClientEvents() {
    Bridge.Event.trigger('client:fetch-listing-performance-context');
    Bridge.Event.on('master:listing-performance-context', function(data) {
      if (data.row) {
        var newRows = contextStore.rows;
        newRows[data.row].visible = false;
        _.assign(contextStore.rows, newRows);
        Bridge.Context.set(storePath, contextStore);

        _initRemovablesRender();
      } else if (data.column) {
        var newColumns = contextStore.columns;
        newColumns[data.column].visible = false;
        _.assign(contextStore.columns, newColumns);
        Bridge.Context.set(storePath, contextStore);

        _initRemovablesRender();
      } else if (data.refresh) {
        var tableRef = contextStore;

        $.each(tableRef.rows, function(index, row) {
          row.visible = true;
        });
        $.each(tableRef.columns, function(index, column) {
          column.visible = true;
        });
        _.assign(contextStore.tile, tableRef);
        Bridge.Context.set(storePath, contextStore);

        _initRemovablesRender();
      }
    });
  }
};
