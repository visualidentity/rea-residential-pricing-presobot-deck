function contractCompareCallback($pageContainer, type, additionalDisclaimers, rows) {

  var storePath = 'contract-compare' + type;

  var data = JSON.parse(JSON.stringify(Bridge.Feed.get("contractCompare").raw()));

  console.log(data);

  var contextStore = {
    contractData: {},
    buyDropdownData: [],
    rentDropdownData: [],
    tableData: {
      1: null,
      2: null,
    },
    additionalDisclaimers,
    channel: 'buy',
    maxRows: rows ? rows : 7,
    rowsCluster: null,
    disclaimers: null,
    rowChunk: 0,
    cards: [{
      visible: true,
    },{
      visible: true,
    },{
      visible: true,
    }]
  };

  var $close = $pageContainer.find('.stat-card__close');
  var $refresh = $pageContainer.find('.removable-refresh-btn');
  var $tab = $pageContainer.find('.input__tab');

  var renderData = function(data) {

    var client = $("body").hasClass("client") ? true : false;

    console.log('COMPARE_PRODUCT_DATA', data);
  
    var buyItems = data.buy.items;
    var rentItems = data.rent.items;

    _.assign(contextStore, {contractData: data});
    var context = Bridge.Context.match('.' + storePath, contextStore);

    _.assign(contextStore, context);

    var buyDropdownData = [];
    var rentDropdownData = [];

    if (type === 'promote') {

      buyDropdownData = _.map(_.filter(buyItems, function(item) {
        return item.title.trim() === 'Premiere All 60' || item.title.trim() === 'Premiere All 45'
      }), function(item) {
        return {
          title: item.title,
          value: item.title
        }
      });

      rentDropdownData = _.map(_.filter(rentItems, function(item) {
        return item.title.trim() === 'Premiere All 30' || item.title.trim() === 'Premiere All 30 as Uplift'
      }), function(item) {
        return {
          title: item.title,
          value: item.title
        }
      });

  
    } else {

      buyDropdownData = _.map(buyItems, function(item) {
        return {
          title: item.title,
          value: item.title
        }
      })

      rentDropdownData = _.map(rentItems, function(item) {
        return {
          title: item.title,
          value: item.title
        }
      })

    }

    var disclaimers;

    if (type === 'promote' && data.buy.promoteDisclaimers) {
      disclaimers = data.buy.promoteDisclaimers;
    } else {
      disclaimers = data.buy.disclaimers;
    }

    _.assign(contextStore, {rentDropdownData, buyDropdownData, disclaimers});
    Bridge.Context.set(storePath, contextStore);

    if (!client) {
      attachTableControls();
      attachTabControls();
      attachCloseControls();
      attachRefreshBtn();
      attachDropdownEvents();
    }

    if (client) {
      _bindClientEvents();
    }

    bindMasterEvents();

    if(client) {
      Bridge.Event.trigger("client:getState");
    } else {
      renderTable();
      var data = Bridge.Context.match('.' + storePath, null);
      Bridge.Event.trigger('master:renderContractCompareTable', data);
      Bridge.Event.on("client:getState", function() {
        var data = Bridge.Context.match('.' + storePath, null);
        Bridge.Event.trigger('master:renderContractCompareTable', data);
      });
    }
  };

  var attachRefreshBtn = function() {
    $refresh.on('click', function() {
      var cards = [{
        visible: true,
      },{
        visible: true,
      },{
        visible: true,
      }]
      _.assign(contextStore, {cards});
      Bridge.Context.set(storePath, contextStore);
      Bridge.Event.trigger('master:renderContractCompareTable', contextStore);
    })
  };

  var attachCloseControls = function() {
    $close.on('click', function() {
      var index = $(this).data('val');
      var newCards = contextStore.cards
      newCards[index].visible = false;
      _.assign(contextStore.cards, newCards);
      Bridge.Context.set(storePath, contextStore);
      Bridge.Event.trigger('master:renderContractCompareTable', contextStore);
    });
  };

  var bindMasterEvents = function () {
    Bridge.Event.on("master:renderContractCompareTable", function(data, options) {
      var $rent = $pageContainer.find('[data-value="Rent"]');
      var $buy = $pageContainer.find('[data-value="Buy"]');
      var $disclaimer = $pageContainer.find('.disclaimer-copy');
      var $slideTitle = $pageContainer.find('.slide-header-center__title');

      contextStore = data;
      
      if (options && options.attachDropdown) {
        attachDropdownEvents(false);
      }
            
      if (contextStore.channel === 'buy') {
        $pageContainer.removeClass('rent-channel').addClass('buy-channel');
        $buy.addClass('active');
        $rent.removeClass('active');

        $slideTitle.html($slideTitle.text().replace('landlords', 'vendors'));

        Bridge.Event.trigger('master:sale-switch', {buy: true, rent: false});
      } else {
        $pageContainer.removeClass('buy-channel').addClass('rent-channel');
        $rent.addClass('active');
        $buy.removeClass('active');

        $slideTitle.html($slideTitle.text().replace('vendors', 'landlords'));

        Bridge.Event.trigger('master:sale-switch', {buy: false, rent: true});
      }

      Bridge.Event.on("client:fetch-sale-state", function() {
        Bridge.Event.trigger('master:sale-switch', {buy: buy, rent: rent});
      });

      $close.each(function(index) {
        var $this = $(this);
        if (contextStore.cards[index].visible !== true) {
          $this.parent().hide();
        } else {
          $this.parent().show();
        }
      });

      var moreDisclaimers;
      
      if (contextStore.additionalDisclaimers) {
        moreDisclaimers = _.map(contextStore.additionalDisclaimers[contextStore.channel], function(item) {
            return item;
        });
      }
      
      var disclaimerCopy = _.map(contextStore.disclaimers, function(item) {
          if (item.charAt(item.length-1) != ".") {
            return item + '. ';
          }
          return item;
      });

      if (contextStore.additionalDisclaimers) {
        $disclaimer.html(moreDisclaimers + disclaimerCopy);
      } else {
        $disclaimer.html(disclaimerCopy);
      }

      renderTable();
    })
  };

  var attachDropdownEvents = function() {

    $pageContainer.find('.table-dropdown ul').remove();

    var dropdownData = contextStore.channel === 'buy' ? contextStore.buyDropdownData : contextStore.rentDropdownData;

    attachDropdown($pageContainer, dropdownData, '.table-dropdown-one');
    attachDropdown($pageContainer, dropdownData, '.table-dropdown-two');

    var $dropdownOneElem = $pageContainer.find('.table-dropdown-one');
    var $dropdownTwoElem = $pageContainer.find('.table-dropdown-two');

    $dropdownOneElem.on('dropdown-value-changed', function (e) {
      handleDropdownChange(e, 1);
    });

    $dropdownTwoElem.on('dropdown-value-changed', function (e) {
      handleDropdownChange(e, 2);
    });

    var $dropdownOne = $pageContainer.find('.table-dropdown-one .input-label');
    var $dropdownTwo = $pageContainer.find('.table-dropdown-two .input-label');

    var tableDataObj = {}

    tableDataObj[1] = dropdownData[0].title
    if (!type || type !== 'promote') {
      tableDataObj[2] = dropdownData[1].title
    }

    if (contextStore.tableData[1] === null || contextStore.tableData[2] === null) {
      $dropdownOne.html(dropdownData[0].title);
      if (!type || type !== 'promote') {
        $dropdownTwo.html(dropdownData[1].title);
      }
      _.assign(contextStore, {tableData: tableDataObj});
      Bridge.Context.set(storePath, contextStore);
    } else {
      $dropdownOne.html(contextStore.tableData[1]);
      if (!type || type !== 'promote') {
        $dropdownTwo.html(contextStore.tableData[2]);
      }
    }
    
  };

  var attachTabControls = function () {    
    
    $tab.on('click', function() {
      var val = $(this).data('value').toLowerCase();
      $tab.removeClass('active');
      $(this).addClass('active');

      attachCloseControls();

      if (val !== contextStore.channel) {

        var disclaimers;

        if (type === 'promote' && contextStore.contractData[val].promoteDisclaimers) {
          disclaimers = contextStore.contractData[val].promoteDisclaimers;
        } else if (contextStore.contractData[val].disclaimers) {
          disclaimers = contextStore.contractData[val].disclaimers;
        }

        var dropdownData = val === 'buy' ? contextStore.buyDropdownData : contextStore.rentDropdownData;

        var tableDataObj = {}

        tableDataObj[1] = dropdownData[0].title
        if (!type || type !== 'promote') {
          tableDataObj[2] = dropdownData[1].title
        }

        _.assign(contextStore, {channel: val, rowChunk: 0, disclaimers, tableData: tableDataObj});
        Bridge.Context.set(storePath, contextStore);
        Bridge.Event.trigger('master:renderContractCompareTable', contextStore, {attachDropdown: true});

      }
    });
  };

  var handleDropdownChange = function(e, cell) {
    var item = $(e.target).attr('data-selected')
    var tempItem = {};
    tempItem[cell] = item;
    var items = _.assign(contextStore.tableData, tempItem)
    _.assign(contextStore, {tableData: items, rowChunk: 0});
    Bridge.Context.set(storePath, contextStore);
    Bridge.Event.trigger('master:renderContractCompareTable', contextStore);
  };

  var attachTableControls = function() {
    var $prev = $pageContainer.find('.table-control--prev');
    var $next = $pageContainer.find('.table-control--next');

    $next.on('click', function() {
      if ((contextStore.rowChunk + 1) < contextStore.rowsCluster.length) {
         _.assign(contextStore, {rowChunk: contextStore.rowChunk + 1});
        $pageContainer.find('.table-data').html(contextStore.rowsCluster[ contextStore.rowChunk]);
        Bridge.Event.trigger('master:renderContractCompareTable', contextStore);
      }
    })

    $prev.on('click', function() {
      if ( contextStore.rowChunk > 0) {
        _.assign(contextStore, {rowChunk: contextStore.rowChunk - 1});
        $pageContainer.find('.table-data').html(contextStore.rowsCluster[ contextStore.rowChunk]);
        Bridge.Event.trigger('master:renderContractCompareTable', contextStore);
      }
    })

  };

  var renderCell = function(value) {
    if (value === false || value === '') {
      return "<td><span class='cross'></span></td>";
    }
    if (value === true) {
      return "<td><span class='tick'></span></td>";
    }
    if (value.toLowerCase() === 'n/a') {
      return "<td><span class='n-a'></span></td>";
    }
    return `<td>${value}</td>`;
  }

  var returnSuperscript = function(str) {
    var bracketValue = str.substring(str.indexOf( '(' ) + 1, str.indexOf( ')' ));
    if (isNaN(bracketValue)) {
      return str;
    } else {
      var trimString = str.replace(/\((.+?)\)/g, "").trim();
      return trimString + '<sup>' + bracketValue +'</sup>';
    }
    // var number = str.replace(/\((.+?)\)/g, "")
    // 
  }


  var renderTable = function() {

    $pageContainer.addClass('is-loaded');

    var rows = [];
    var data = contextStore.channel === 'buy' ? contextStore.contractData.buy.items : contextStore.contractData.rent.items;

    // console.log('data', data);
    // console.log('contextStore', contextStore);
    
    var firstCellValues = _.find(data, function(item) {
      if (item.title === contextStore.tableData[1]) {
        return item.values
      }
    }).values

    if (type !== 'promote') {
      var secondCellValues = _.find(data, function(item) {
        if (item.title === contextStore.tableData[2]) {
          return item.values
        }
      }).values
    }

    for (var i = 0; i < firstCellValues.length; i++) {
      var row;
      if (type && type === 'promote') {
        row = '<tr>' +
        renderCell(returnSuperscript(firstCellValues[i].title)) + 
        renderCell(firstCellValues[i].value) + 
        '</tr />'
        } else {
        row = '<tr>' +
        renderCell(returnSuperscript(firstCellValues[i].title)) + 
        renderCell(firstCellValues[i].value) +
        renderCell(secondCellValues[i].value) + 
        '</tr />'
      }

      rows.push(row)
    }

    _.assign(contextStore, {rowsCluster: chunkArray(rows, contextStore.maxRows)});
    Bridge.Context.set(storePath, contextStore);

    $pageContainer.find('.table-data').html(contextStore.rowsCluster[ contextStore.rowChunk]);
  };

  function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-sale-state");
        Bridge.Event.on("master:sale-switch", function (data) {
          var $rent = $pageContainer.find('[data-value="Rent"]');
          var $buy = $pageContainer.find('[data-value="Buy"]');
          var $slideTitle = $pageContainer.find('.slide-header-center__title');

          if (data.buy) {
            $pageContainer.removeClass('rent-channel').addClass('buy-channel');
            $buy.addClass('active');
            $rent.removeClass('active');

            $slideTitle.html($slideTitle.text().replace('landlords', 'vendors'));
          } else if (data.rent) {
            $pageContainer.removeClass('buy-channel').addClass('rent-channel');
            $rent.addClass('active');
            $buy.removeClass('active');

            $slideTitle.html($slideTitle.text().replace('vendors', 'landlords'));
          }

          console.log(data);
        });
    }

  renderData(data);

};