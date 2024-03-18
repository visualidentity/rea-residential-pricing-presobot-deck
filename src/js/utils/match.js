function attachMatchEvents($pageContainer, data, disclaimerTemplate) {
  var comparison = $pageContainer.find('[data-m-comparison-new]');
  var $dateRange;
  var $comparisonBlock = $pageContainer.find('.comparison-new-block');

  var $refresh = $pageContainer.find('.removable-refresh-btn');

  var storePath = 'agent-match';

  var preview = $('body').hasClass('preview') ? true : false;

  if (preview) {
    _initRemovables();
  }

  // Removable rows
	var contextStore = {
		rows: [{
			visible: true,
		},{
			visible: true,
		},{
			visible: true,
		},{
			visible: true,
		},{
			visible: true,
		},{
			visible: true,
		},{
			visible: true,
		}]
  };
  
  // Initiate prep mode removables
	function _initRemovables() {
    var $removable = $pageContainer.find('.remove-icon');

		$removable.click(function() {
      var index = $(this).closest('[data-m-comparison-new]').attr('val');
			var newRows = contextStore.rows
			newRows[index].visible = false;
			_.assign(contextStore.rows, newRows);
			Bridge.Context.set(storePath, contextStore);
			
      _initRemovablesRender();

			Bridge.Event.trigger('master:' + storePath, {row: index});
		});

		$refresh.click(function() {
			var columnRef = contextStore;

			$.each( columnRef.rows, function( index, row ) {
				row.visible = true;
			});
			_.assign(contextStore.rows, columnRef);
			Bridge.Context.set(storePath, contextStore);

			_initRemovablesRender();

			Bridge.Event.trigger('master:' + storePath, {refresh: true});
		});

    // Calling client show removed modules in realtime
		Bridge.Event.on('client:fetch-' + storePath + '-context', function() {
			Bridge.Event.trigger('master:' + storePath + '-context');
		});
  }
  
  // Initial call to compare tables with context
  _initRemovablesRender();

	function _initRemovablesRender() {
		var $context = Bridge.Context.match('.' + storePath, contextStore);

		$.each( $context.rows, function( index, value ) {
			value.visible != true ? (
        $pageContainer.find(comparison[index]).closest('.simple-col').hide()
			) : (
				$pageContainer.find(comparison[index]).closest('.simple-col').show()
			);
		});
	}

  function init() {
    var client = $("body").hasClass("client") ? true : false;
    $dateRange = $pageContainer.find('.date-range');
    $comparisonBlock.fadeIn();

    if (client) {
      Bridge.Event.trigger("client:fetchMatch");
    }

    if (!client) {
      Bridge.Event.on("client:fetchMatch", function() {
        var data = Bridge.Context.match('.match-data', null);
        Bridge.Event.trigger("slide:updateData", data);
      });
    }

    Bridge.Event.on("slide:updateData", function(visible, obj) {
      if (obj) {
        updateData(obj.data);
        $dateRange.find('h6').html(obj.dropdown);
        $pageContainer.find('.disclaimer-copy').html(disclaimerTemplate(
          { date: obj.dropdown}
        ));
      }
    });

    var dropdownData = [];

    _.forEach(data, function(item, key) {
        dropdownData.push({
          title: key,
          value: key
        });
    });

    if (dropdownData.length !== 0) {

      var matchContext = Bridge.Context.match('.match-data', null);

      var obj;

      if ( matchContext !== null) {
        obj = {
          data: matchContext.data,
          dropdown: matchContext.dropdown
        }
        Bridge.Event.trigger('updateMatchData', {data: matchContext.data, disclaimer: matchContext.dropdown});
      } else {
        obj = {
          data: data[dropdownData[0].value],
          dropdown: dropdownData[0].value
        }
      }

      updateData(obj.data);
      
      $dateRange.find('h6').html(obj.dropdown);
      
      $pageContainer.find('.disclaimer-copy').html(disclaimerTemplate(
        { date: obj.dropdown}
      ));
    }

    bindMasterEvents();

    attachDropdown($pageContainer, dropdownData, '.date-range');

    $dateRange.on('dropdown-value-changed', function (e) {
      var val = $(e.target).find('h6').html();

      Bridge.Context.set('match-data', {
        dropdown: val,
        data: data[val]
      })

      Bridge.Event.trigger('updateMatchData', {data: data[val], disclaimer: val});

      updateData(data[val], $pageContainer);
    })

  }

  init();

  function bindMasterEvents() {
    Bridge.Event.on("updateMatchData", function(obj) {

      updateData(obj.data);

      if (obj.disclaimer) {
        $pageContainer.find('.disclaimer-copy').html(disclaimerTemplate(
          { date: obj.disclaimer}
        ));
      }

    });


    Bridge.Event.on("client:getState", function() {

    })

    Bridge.Event.trigger('client:' + storePath + '-context');
		Bridge.Event.on('master:' + storePath, function (data) {
			if (data.row) {
				var newRows = contextStore.rows
				newRows[data.row].visible = false;
				_.assign(contextStore.rows, newRows);
				Bridge.Context.set(storePath, contextStore);
				
				_initRemovablesRender();
			}
			if (data.refresh) {
				var columnRef = contextStore;

				$.each( columnRef.rows, function( index, row ) {
					row.visible = true;
				});
				_.assign(contextStore.row, columnRef);
				Bridge.Context.set(storePath, contextStore);

				_initRemovablesRender();
			}
		});
    
  }


  function updateData(data) {

    var $agentProfileViews = $(comparison[0]).find('[data-value]')
    var $agentProfileEnquiries = $(comparison[1]).find('[data-value]')
    var $volumeOfReviews = $(comparison[2]).find('[data-value]')
    var $sellerleads = $(comparison[3]).find('[data-value]')
    var $averageResponseTime = $(comparison[4]).find('[data-value]')
    var $topChart = $(comparison[5]).find('[data-value]')
    var $bottomChart = $(comparison[6]).find('[data-value]')

    $agentProfileViews.attr('data-value', data.agentProfileViews)
    $agentProfileEnquiries.attr('data-value', data.agentProfileEnquiries)
    $volumeOfReviews.attr('data-value', data.volumeOfReviews)
    $sellerleads.attr('data-value', data.sellerleads)
    $averageResponseTime.attr('data-value', data.averageResponseTime)
    $($topChart[0]).attr('data-value', data.totalListed)
    $($topChart[1]).attr('data-value', data.otherTotalListed)
    $($bottomChart[0]).attr('data-value', data.totalSold)
    $($bottomChart[1]).attr('data-value', data.otherTotalSold)

    $agentProfileViews.html(data.agentProfileViews);
    $agentProfileEnquiries.html(data.agentProfileEnquiries);
    $volumeOfReviews.html(data.volumeOfReviews);
    $sellerleads.html(data.sellerleads);
    $averageResponseTime.html(data.averageResponseTime);
    
    _renderBarChart($($topChart[0]), $($topChart[1]));
    _renderBarChart($($bottomChart[0]), $($bottomChart[1]));
  }

  function _renderBarChart($elemOne, $elemTwo) {

    var valueOne = parseInt($elemOne.attr('data-value'));
    var valueTwo = parseInt($elemTwo.attr('data-value'));

    if (valueOne > valueTwo) {
      $elemTwo.removeClass('full');
      $elemOne.addClass('full');
      var barWidth = (valueTwo / valueOne * 100);
      $elemTwo.css('width', barWidth + '%' || 0);
    }
    else if (valueOne == 0 && valueTwo == 0) {
      $elemOne.removeClass('full');
      $elemTwo.removeClass('full');
      $elemOne.css('width', 0 + '%' || 0);
      $elemTwo.css('width', 0 + '%' || 0);
    }
    else {
      $elemOne.removeClass('full');
      $elemTwo.addClass('full');
      var barWidth = (valueOne / valueTwo * 100);
      $elemOne.css('width', barWidth + '%' || 0);
    }
    var currency = $elemOne.attr('data-currency');
    var prefix = typeof currency !== typeof undefined && currency !== false ? '$' : '';
    var percentile = $elemOne.attr('data-percentile');
    var postfix = typeof percentile !== typeof undefined && percentile !== false ? '%' : '';
    $elemOne.attr('data-value', prefix + addCommas(valueOne) + postfix);
    $elemTwo.attr('data-value', prefix + addCommas(valueTwo) + postfix);
  }
}