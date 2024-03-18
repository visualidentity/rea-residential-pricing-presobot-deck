var _pricingRender23 = function($elm, $type, $refresh) {
  var $pageContainer = $('article#' + $elm.id);
  var storePath = $elm.id;

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

  // Prep defaults
  var contextStore = Bridge.Context.match('.' + storePath, {
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
    ]
  });

  var $pricingData = Bridge.Feed.get('pricingsale').raw();
  var filters = [
    'subscription',
    'commitment',
    'productName',
    'duration',
    'state',
    'tier',
    'subscription',
    'subscription',
    'subscription',
    'commitment',
    'commitment',
    'commitment',
    'productName',
    'productName',
    'productName',
    'tier',
    'tier',
    'tier'
  ];
  if ($pricingData && !$refresh) {
    $.each(filters, function(index, filter) {
      var dropdownRef = index + 1;
      console.log(
        '$pricingData.filters[filter]',
        $pricingData.filters[filter],
        dropdownRef
      );
      $.each($pricingData.filters[filter], function(index, value) {
        $pageContainer
          .find('#header-dropdown-' + dropdownRef)
          .find('.header__input-dropdown--results')
          .append(
            '<div class="results__child" value="' +
              value +
              '">' +
              value +
              '</div>'
          );

        if (
          $pageContainer
            .find('#header-dropdown-' + dropdownRef + ' .input-label')
            .text() === ''
        ) {
          $pageContainer
            .find('#header-dropdown-' + dropdownRef + ' .input-label')
            .text(value);
          $selectedChild = $pageContainer
            .find('#header-dropdown-' + dropdownRef)
            .find('.results__child[value="' + value + '"]');

          console.log(value);
          $selectedChild.addClass('strong');
        }
      });
    });

    _dropdown($pageContainer);
  }

  // Initiate prep mode removables
  function _initRemovables() {
    var $removableColumn = $pageContainer.find('.pricing__removablesub');
    var $ref = $pageContainer.find('[data-header-refresh]');

    $removableColumn.click(function() {
      var index = $(this).attr('val');
      var newColumns = contextStore.columns;
      newColumns[index].visible = false;
      _.assign(contextStore.columns, newColumns);
      Bridge.Context.set(storePath, contextStore);

      _initRemovablesRender();
      Bridge.Event.trigger('master:pricing-context-23', { column: index });
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
      Bridge.Event.trigger('master:pricing-context-23', { refresh: true });
    });

    Bridge.Event.on('client:fetch-pricing-context-23', function() {
      Bridge.Event.trigger('master:pricing-context-23');
    });
  }

  _initRemovablesRender();

  function _initRemovablesRender() {
    $.each(contextStore.columns, function(index, value) {
      value.visible != true
        ? ($pageContainer.find('div[val="' + index + '"]').hide(),
          $pageContainer.find('th[val="' + index + '"]').hide(),
          $pageContainer.find('td[val="' + index + '"]').hide())
        : ($pageContainer.find('div[val="' + index + '"]').show(),
          $pageContainer.find('th[val="' + index + '"]').show(),
          $pageContainer.find('td[val="' + index + '"]').show());
    });
  }

  // Render data
  function _tableFRender(e) {
    var data = e;

    console.log('data: ', data);

    $.each(data, function(index, value) {
      if (index === 0) {
        $pageContainer
          .find('[data-current-monthly-cost]')
          .text(
            `${
              value.data[0]
                ? '$' +
                  addCommas(
                    Math.round(value.data[0].newMonthlySubscriptionCost)
                  )
                : '-'
            }`
          );
        // $pageContainer
        //   .find('[data-current-monthly-cost]')
        //   .text(
        //     `${
        //       value.data[0]
        //         ? '$' +
        //           addCommas(
        //             Math.round(value.data[0].currentMonthlySubscriptionCost)
        //           )
        //         : '-'
        //     }`
        //   );
        // $pageContainer
        //   .find('[data-new-monthly-cost]')
        //   .text(
        //     `${
        //       value.data[0]
        //         ? '$' +
        //           addCommas(
        //             Math.round(value.data[0].newMonthlySubscriptionCost)
        //           )
        //         : '-'
        //     }`
        //   );
        $pageContainer
          .find('[data-table-product]')
          .text(value.data[0] ? value.data[0].productName : '-');
        $pageContainer
          .find('[data-table-current-rate]')
          .text(
            `${
              value.data[0]
                ? '$' + addCommas(Math.round(value.data[0].newRate))
                : '-'
            }`
          );
        // $pageContainer
        //   .find('[data-table-your-rate]')
        //   .text(
        //     `${
        //       value.data[0]
        //         ? '$' + addCommas(Math.round(value.data[0].newRate))
        //         : '-'
        //     }`
        //   );
        $pageContainer
          .find('[data-table-rack-rate]')
          .text(
            `${
              value.data[0]
                ? '$' + addCommas(Math.round(value.data[0].rackRate))
                : '-'
            }`
          );
      } else if (value.data.length > 0) {
        $pageContainer
          .find(`[data-table-monthly-${index}]`)
          .text(
            `${
              value.data[0]
                ? '$' +
                  addCommas(
                    Math.round(value.data[0].currentMonthlySubscriptionCost)
                  )
                : '-'
            }`
          );
        $pageContainer
          .find(`[data-table-new-monthly-${index}]`)
          .text(
            `${
              value.data[0]
                ? '$' + addCommas(Math.round(value.data[0].newRate))
                : '-'
            }`
          );
      }
    });
  }

  // Fetch data
  var host = Bridge.Context.match('.feed_rca_host', '');
  function _initFRender() {
    var filters = [];
    $pageContainer.find('.header__input-dropdown').each(function(index) {
      filters.push(
        $(this)
          .find('.input-label')
          .text()
      );
    });

    var supplements = [
      {
        sub: filters[0],
        commitment: filters[1],
        productName: filters[2],
        duration: filters[3],
        state: filters[4],
        tier: filters[5]
      },
      {
        sub: filters[6],
        commitment: filters[9],
        productName: filters[12],
        duration: filters[3],
        state: filters[4],
        tier: filters[15]
      },
      {
        sub: filters[7],
        commitment: filters[10],
        productName: filters[13],
        duration: filters[3],
        state: filters[4],
        tier: filters[16]
      },
      {
        sub: filters[8],
        commitment: filters[11],
        productName: filters[14],
        duration: filters[3],
        state: filters[4],
        tier: filters[17]
      }
    ];

    var uris = [];
    $.each(supplements, function(index, value) {
      uris[index] = $.param(value);
    });

    var responseData = [];
    $.each(uris, function(index, value) {
      console.log(
        'api: ',
        `https://salespreso.api-realestate-com-au.vi.com.au/${host}/rca/pricing/${$type}?${value}`
      );
      Bridge.Request.get('/api-proxy/', {
        query: {
          url: `https://salespreso.api-realestate-com-au.vi.com.au/${host}/rca/pricing/${$type}?${value}`
        }
      })
        .then(function(response) {
          responseData[index] = response;

          if (responseData.length === 4) {
            // _tableFRender(responseData);
            // Bridge.Context.set(`${storePath}-table-${$type}`, responseData);
            Bridge.Event.trigger('master:response-table', responseData);
          }
        })
        .catch(function(e) {
          console.log(e);
        });
    });
  }

  function _bindMasterEvents() {
    var $apply = $pageContainer.find('.header__input-apply');
    $apply.click(function() {
      _initFRender();

      Bridge.Event.trigger('master:sale-context');
    });

    var $buy = $pageContainer.find('[data-sale]');
    var $lease = $pageContainer.find('[data-lease]');

    $buy.click(function() {
      Bridge.Sub.show('subslide-1');
    });

    $lease.click(function() {
      Bridge.Sub.show('subslide-2');
    });
  }

  // Executing clients
  function _bindClientEvents() {
    Bridge.Event.trigger('client:fetch-sale-context');
    Bridge.Event.on('master:sale-context', function(i, e, b) {
      _initFRender();
    });
  }

  Bridge.Event.on('master:response-table', function(e) {
    _tableFRender(e);
    Bridge.Context.set(`${storePath}-table-${$type}`, e);
  });

  Bridge.Event.on('master:dropdown-filter', function(value) {
    var extract =
      $(value)
        .attr('id')
        .replace('header-dropdown-', '') - 1;

    _initDropdownFilters(extract);
  });

  // Handle dropdown filters
  var $dropdownHeader = $pageContainer.find('.header__input-dropdown');
  var $dropdownLabel = $pageContainer.find('.input-label');
  var $dropdownChild = $pageContainer.find('.results__child');
  $dropdownChild.click(function() {
    Bridge.Event.trigger(
      'master:dropdown-filter',
      $(this).closest('.header__input-dropdown')
    );
  });

  var dropdownFilterData = {
    Access: {
      'Enhanced All': {
        Enhanced: ['30', '90', '180', '365'],
        Elite: ['90', '180', '365'],
        'Elite Plus': ['90', '180', '365']
      }
    },
    'All Contracts': {
      'Enhanced All': {
        Enhanced: ['90', '180', '365'],
        'Elite Step-up': ['90', '180', '365'],
        'Elite Plus Step-up': ['90', '180', '365']
      },
      'Elite All': {
        Enhanced: ['90', '180', '365'],
        Elite: ['90', '180', '365'],
        'Elite Plus Step-up': ['90', '180', '365']
      },
      'Elite Plus All': {
        Enhanced: ['90', '180', '365'],
        Elite: ['90', '180', '365'],
        'Elite Plus': ['90', '180', '365']
      },
      'No Commitment': {
        Enhanced: ['90', '180', '365'],
        Elite: ['90', '180', '365'],
        'Elite Plus': ['90', '180', '365']
      }
    },
    Standard: {
      'No Commitment': {
        Enhanced: ['30', '90', '180', '365'],
        Elite: ['90', '180', '365'],
        'Elite Plus': ['90', '180', '365'],
        Basic: ['30']
      }
    },
    Diamond: {
      'No Commitment': {
        Enhanced: ['30', '90', '180', '365'],
        Elite: ['90', '180', '365'],
        'Elite Plus': ['90', '180', '365'],
        Basic: ['30']
      }
    }
  };

  function _initDropdownFilters(e) {
    var subscription, commitment, product, duration;

    if (e === 6 || e === 9) {
      subscription = 6;
      commitment = 9;
      product = 12;
    } else if (e === 7 || e === 10) {
      subscription = 7;
      commitment = 10;
      product = 13;
    } else if (e === 8 || e === 11) {
      subscription = 8;
      commitment = 11;
      product = 14;
    } else if (e === 0 || e === 1 || e === 2) {
      subscription = 0;
      commitment = 1;
      product = 2;
      duration = 3;
    }

    if (subscription || commitment || product) {
      if (!($dropdownLabel.eq(subscription).text() === 'Subscription')) {
        $dropdownHeader
          .eq(commitment)
          .find('.results__child')
          .hide();
        $.each(
          dropdownFilterData[$dropdownLabel.eq(subscription).text()],
          function(index, item) {
            if (
              !(
                Object.keys(
                  dropdownFilterData[$dropdownLabel.eq(subscription).text()]
                ).length > 1
              )
            ) {
              $dropdownHeader.eq(commitment).addClass('disabled');
              $dropdownHeader
                .eq(commitment)
                .find('.results__child')
                .removeClass('strong');
              $dropdownHeader
                .eq(commitment)
                .find(`[value="${index}"]`)
                .addClass('strong');
              $dropdownLabel.eq(commitment).text(index);
            } else {
              $dropdownHeader.eq(commitment).removeClass('disabled');
              $dropdownHeader
                .eq(commitment)
                .find(`[value="${index}"]`)
                .show();
            }
          }
        );
      }

      if (
        !($dropdownLabel.eq(subscription).text() === 'Subscription') &&
        !($dropdownLabel.eq(commitment).text() === 'Commitment')
      ) {
        $dropdownHeader
          .eq(product)
          .find('.results__child')
          .hide();

        $.each(
          dropdownFilterData[$dropdownLabel.eq(subscription).text()][
            $dropdownLabel.eq(commitment).text()
          ],
          function(index, item) {
            $dropdownHeader
              .eq(product)
              .find(`[value="${index}"]`)
              .show();
          }
        );

        if (
          jQuery.inArray(
            $dropdownLabel.eq(product).text(),
            Object.keys(
              dropdownFilterData[$dropdownLabel.eq(subscription).text()][
                $dropdownLabel.eq(commitment).text()
              ]
            )
          ) == -1
        ) {
          $dropdownLabel.eq(product).text('Product');
          $dropdownHeader
            .eq(product)
            .find('.results__child')
            .removeClass('strong');
        }
      }

      if (
        !($dropdownLabel.eq(subscription).text() === 'Subscription') &&
        !($dropdownLabel.eq(commitment).text() === 'Commitment') &&
        !($dropdownLabel.eq(product).text() === 'Product') &&
        duration
      ) {
        $dropdownHeader
          .eq(duration)
          .find('.results__child')
          .hide();

        $.each(
          dropdownFilterData[$dropdownLabel.eq(subscription).text()][
            $dropdownLabel.eq(commitment).text()
          ][$dropdownLabel.eq(product).text()],
          function(index, item) {
            if (
              !(
                dropdownFilterData[$dropdownLabel.eq(subscription).text()][
                  $dropdownLabel.eq(commitment).text()
                ][$dropdownLabel.eq(product).text()].length > 1
              )
            ) {
              $dropdownHeader.eq(duration).addClass('disabled');
              $dropdownHeader
                .eq(duration)
                .find('.results__child')
                .removeClass('strong');
              $dropdownHeader
                .eq(duration)
                .find(`[value="${item}"]`)
                .addClass('strong');
              $dropdownLabel.eq(duration).text(item);
            } else {
              $dropdownHeader.eq(duration).removeClass('disabled');
              $dropdownHeader
                .eq(duration)
                .find(`[value="${item}"]`)
                .show();
            }
          }
        );

        if (
          jQuery.inArray(
            $dropdownLabel.eq(duration).text(),
            dropdownFilterData[$dropdownLabel.eq(subscription).text()][
              $dropdownLabel.eq(commitment).text()
            ][$dropdownLabel.eq(product).text()]
          ) == -1
        ) {
          $dropdownLabel.eq(duration).text('Campaign duration');
          $dropdownHeader
            .eq(duration)
            .find('.results__child')
            .removeClass('strong');
        }
      }
    }
  }

  // On load
  _initDropdownFilters(0);
  _initDropdownFilters(6);
  _initDropdownFilters(7);
  _initDropdownFilters(8);

  _initFRender();
};
