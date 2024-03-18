var initTable = function(options) {
  var table = 1;
  var tables = $(".int-table").length;
  var dom;
  dom = options.slide;
  var $intTable = dom.find(".int-table");
  var $counter = dom.find(".counter");
  var $forwards = dom.find(".forwards");
  var $backwards = dom.find(".backwards");

  processTable(table);

  if (client) {
    _bindClientEvents();
  }
  else {
    _bindMasterEvents();
  }
    
  function processTable(table) {
    $intTable.css("display", "none");
    dom.find(".table-" + table).css("display", "block");
    $counter.html(table + " / " + tables);

    if (table === tables) {
      $forwards.css("opacity", ".3");
    } else if (table === 1) {
      $backwards.css("opacity", ".3");
    } else {
      $forwards.css("opacity", "1");
      $backwards.css("opacity", "1");
    }
  }

  function _bindMasterEvents() {
    $forwards.click(function(e) {
			if (table != tables) {
        table++;
        processTable(table);
        Bridge.Event.trigger('master:table-process', {table: table});
      }
    });
        
    $backwards.click(function(e) {
      if (table != 1) {
        table--;
        processTable(table);
        Bridge.Event.trigger('master:table-process', {table: table});
      }
    });

    Bridge.Event.on("client:fetch-table-state", function() {
			Bridge.Event.trigger('master:table-process', {table: table});
		});
  }
  
  function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-table-state");
		Bridge.Event.on("master:table-process", function (data) {
      processTable(data.table);
    });
	}
}