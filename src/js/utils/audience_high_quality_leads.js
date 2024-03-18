
var attachAudienceHighQualityLeadsEvents = function (options) {

    function convertToInternationalCurrencySystem (labelValue) {

        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9

        ? Math.round((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1)) + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6

        ? Math.round((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1)) + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3

        ? Math.round((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1)) + "K"

        : Math.round(Math.abs(Number(labelValue)));

    }
    
  var $pageContainer;

  var {
    slide,
    data
  } = options

  var stateDd = Bridge.Context.get('state_dropdown-2' + slide);

  this.init = function () {
    $pageContainer = $(options.container);
    this.stateDropdown();
  };


  this.stateDropdown = function () {

    // Easy dropdown
    var $value;
    var defaultState = "national";
    var modalState = Bridge.Context.match('.audience-leads-context', []);

    var defaultData = data.audienceData.states.find(function (item) {
      return item.state.toLowerCase() === defaultState.toLowerCase()
    });

    $btn = $pageContainer.find('[data-audience-high-quality-leads-btn]');
    $closeBtn = $pageContainer.find('[data-audience-high-quality-leads-close]');
    $toggleContent = $pageContainer.find('[audience-high-quality-leads-toggle]');
    $refreshBtn = $pageContainer.find('[data-refresh-block]');

    if (stateDd) {
      $value = stateDd.state;
      $pageContainer.find('[data-state]').attr('data-state', stateDd.state);

      if (stateDd.avg_views_YoY != undefined) {
        $pageContainer.find('[data-average-views]').html(addCommas(stateDd.avg_views_YoY));
      }
      if (stateDd.total_inspections_YoY != undefined) {
        $pageContainer.find('[data-total-inspections]').html(addCommas(stateDd.total_inspections_YoY));
      }
      if (stateDd.saved_properties_YoY != undefined) {
        $pageContainer.find('[data-saved-properties]').html(addCommas(stateDd.saved_properties_YoY));
      }
      if (stateDd.saved_buy_inspections_YoY != undefined) {
        $pageContainer.find('[data-saved-buys]').html(addCommas(stateDd.saved_buy_inspections_YoY));
      }
      if (stateDd.buyer_enquiries_YoY != undefined) {
        $pageContainer.find('[data-buyer-enquiries]').html(addCommas(stateDd.buyer_enquiries_YoY));
      }
      if (stateDd.seller_leads_growth_YoY != undefined) {
        $pageContainer.find('[data-seller-leads]').html(addCommas(stateDd.seller_leads_growth_YoY));
      }

      $btn.on("click", function() {
        $(this).next($toggleContent).show();
        $(this).addClass('toggle-open');
        modalState[$(this).index()] = 'visible';
        Bridge.Context.set('audience-leads-context', modalState);
        
      })
      if ($("body").hasClass("preview")) {
        $refreshBtn.on("click", function() {
          $toggleContent.show();
          $btn.addClass('toggle-open');
          modalState.map((item) => item = 'visible');
          Bridge.Context.set('audience-leads-context', modalState);
        })
      }

      $closeBtn.on("click", function() {
        $(this).parent($toggleContent).hide().prev().removeClass('toggle-open');
        modalState[$(this).parent($toggleContent).index() - 1] = 'hidden';
        Bridge.Context.set('audience-leads-context', modalState);
      })

    } else {
      $value = defaultState;
      $pageContainer.find('[data-state]').attr('data-state', defaultData.state);

      if (defaultData.avg_views_YoY != undefined) {
        $pageContainer.find('[data-average-views]').html(addCommas(defaultData.avg_views_YoY));
      }
      if (defaultData.total_inspections_YoY != undefined) {
        $pageContainer.find('[data-total-inspections]').html(addCommas(defaultData.total_inspections_YoY));
      }
      if (defaultData.saved_properties_YoY != undefined) {
        $pageContainer.find('[data-saved-properties]').html(addCommas(defaultData.saved_properties_YoY));
      }
      if (defaultData.saved_buy_inspections_YoY != undefined) {
        $pageContainer.find('[data-saved-buys]').html(addCommas(defaultData.saved_buy_inspections_YoY));
      }
      if (defaultData.buyer_enquiries_YoY != undefined) {
        $pageContainer.find('[data-buyer-enquiries]').html(addCommas(defaultData.buyer_enquiries_YoY));
      }
      if (defaultData.seller_leads_growth_YoY != undefined) {
        $pageContainer.find('[data-seller-leads]').html(addCommas(defaultData.seller_leads_growth_YoY));
      }

      $btn.on("click", function() {
        $(this).next($toggleContent).show();
        $(this).addClass('toggle-open');
        modalState[$(this).index()] = 'visible';
        Bridge.Context.set('audience-leads-context', modalState);
      })
      if ($("body").hasClass("preview")) {
        $refreshBtn.on("click", function() {
          $toggleContent.show();
          $btn.addClass('toggle-open');
          modalState.map((item) => item = 'visible');
          Bridge.Context.set('audience-leads-context', modalState);
          
        })
      }

      $closeBtn.on("click", function() {
        $(this).parent($toggleContent).hide().prev().removeClass('toggle-open');
        modalState[$(this).parent($toggleContent).index() - 1] = 'hidden';
        Bridge.Context.set('audience-leads-context', modalState);
      })
    }

    if (modalState.length > 0) {
      $.each( modalState, function( key, value ) {
        if (value == 'hidden') {
          $pageContainer.find(`[audience-high-quality-leads-toggle="${key}"]`).hide().prev().removeClass('toggle-open');
        }
      });
    }

    var $smallDropdownName = $pageContainer.find('.state-dropdown .input-label');
    $smallDropdownName.text($value);
    var $dropdown = $pageContainer.find('.state-dropdown .input--dropdown');

    var listHtml = ''
    data.audienceData.states.filter((item) => item.state != 'TAS' && item.state != 'NT' && item.state != 'ACT').forEach(function (item) {
      listHtml += '<li data-value="' + item.state.replace(/NATIONAL/g, 'National') + '" data-dropdown>' + item.state.replace(/NATIONAL/g, 'National') + '</li>'
    })

    $pageContainer.find('.state-dropdown #dropdown_group').html(
      '<div class="dropdown-icon"></div>' +
      '<ul>' +
      listHtml +
      '</ul>'
    );

    if (listHtml == '') {
      $pageContainer.find('.region-dropdown').addClass('inactive');
    } else {
      $pageContainer.find('.region-dropdown').removeClass('inactive');
    }

    if ($("body").hasClass("master") || $("body").hasClass("share_online")) {
      $smallDropdownName.click(function () {
        $dropdown.toggleClass('dropdown--open');
      });
    }

    var $dropdownListing = $pageContainer.find('.state-dropdown [data-dropdown]');

    $dropdownListing.click(function () {
      $value = $(this).closest('li').attr('data-value');
      $dropdown.toggleClass('dropdown--open');
      Bridge.Event.trigger('master:' + $pageContainer + 'state-update', { instance: $value });
    });

    // Bridging events for client
    Bridge.Event.on('client:fetch-' + $pageContainer + '-state', function () {
      Bridge.Event.trigger('master:' + $pageContainer + '-update', { instance: $value });
    });

    Bridge.Event.on('master:' + $pageContainer + 'state-update', function (state) {

      var stateData = data.audienceData.states.find(function (item) {
        return item.state.toLowerCase() === state.instance.toLowerCase()
      })

      $smallDropdownName.text(stateData.state.replace(/NATIONAL/g, 'National'));

      $pageContainer.find('[data-state]').attr('data-state', stateData.state.replace(/NATIONAL/g, 'National'));
      // $pageContainer.find('[data-ma-reaUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(stateData.reaUniqueAudience.replace(/,/g, "")))));
  

      if (stateData.avg_views_YoY != undefined) {
        $pageContainer.find('[data-average-views]').html(addCommas(stateData.avg_views_YoY));
      } else {
        $pageContainer.find('[data-average-views]').html(addCommas('XX'));

      }
      if (stateData.total_inspections_YoY != undefined) {
        $pageContainer.find('[data-total-inspections]').html(addCommas(stateData.total_inspections_YoY));
      } else {
        $pageContainer.find('[data-total-inspections]').html(addCommas('XX'));
      }
      if (stateData.saved_properties_YoY != undefined) {
        $pageContainer.find('[data-saved-properties]').html(addCommas(stateData.saved_properties_YoY));
      } else {
        $pageContainer.find('[data-saved-properties]').html(addCommas('XX'));
      }
      if (stateData.saved_buy_inspections_YoY != undefined) {
        $pageContainer.find('[data-saved-buys]').html(addCommas(stateData.saved_buy_inspections_YoY));
      } else {
        $pageContainer.find('[data-saved-buys]').html(addCommas('XX'));
      }
      if (stateData.buyer_enquiries_YoY != undefined) {
        $pageContainer.find('[data-buyer-enquiries]').html(addCommas(stateData.buyer_enquiries_YoY));
      } else {
        $pageContainer.find('[data-buyer-enquiries]').html(addCommas('XX'));
      }
      if (stateData.seller_leads_growth_YoY != undefined) {
        $pageContainer.find('[data-seller-leads]').html(addCommas(stateData.seller_leads_growth_YoY));
      } else {
        $pageContainer.find('[data-seller-leads]').html(addCommas('XX'));
      }




      Bridge.Context.set('state_dropdown-2' + slide, stateData);


    });
  }


  _undefinedHandle = function (value) {
    if (value == undefined) {
      return 0;
    } else {
      return value;
    }

  }

  _disclaimerHandle = function (array) {
    let hideCountDisclaimer = (array.length <= 1) ? 'hide-type' : '';
    let html = `<ol class="${hideCountDisclaimer}">`;

    $.each(array, function () {
      html += `<li>${this}</li>`;
    });
    html += `</li>`;

    return html;
  }

  _abbreviateNumber = function (num, fixed) {
    num = parseInt(num.replace(/,/g, ''));
    if (num === null) { return null; } // terminate early
    if (num === 0) { return '0'; } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    var b = (num).toPrecision(2).split("e"), // get power
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
      c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
      d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
      e = d + ['', 'k', 'm', 'b', 't'][k]; // append power
    return e;
  }

  this.init();
};
