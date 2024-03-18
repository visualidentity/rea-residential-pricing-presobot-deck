
var attachAudienceOverviewEventsFy24 = function (options) {

  var $pageContainer;

  var {
    slide,
    data
  } = options

  var stateDd = Bridge.Context.get('state_dropdown-2' + slide);
  var regionDd = Bridge.Context.get('region_dropdown' + slide);

  this.init = function () {
    $pageContainer = $(options.container);
    this.stateDropdown();
    this.regionDropdown();
  };

  var resetDropdown = function (stateData) {

    var defaultData = data.overviewData.states.find(function (item) {
      return item.state === stateData.state
    });

    var listHtml = '';
    var $value;
    var $dropdown = $pageContainer.find('.region-dropdown .input--dropdown');

    var $largeDropdownName = $pageContainer.find('.region-dropdown .input-label');
    $largeDropdownName.text('Region');

    if (regionDd) {
      regionDd.regions.forEach(function (item) {
        listHtml += '<li data-value="' + item.region + '" data-dropdown>' + item.region + '</li>'
      })
    } else {
      defaultData.regions.forEach(function (item) {
        listHtml += '<li data-value="' + item.region + '" data-dropdown>' + item.region + '</li>'
      })
    }

    if (listHtml == '') {
      $pageContainer.find('.region-dropdown').addClass('inactive');
    } else {
      $pageContainer.find('.region-dropdown').removeClass('inactive');
    }

    $pageContainer.find('.region-dropdown #dropdown_group').html(
      '<div class="dropdown-icon"></div>' +
      '<ul>' +
      listHtml +
      '</ul>'
    );

    var $dropdownListing = $pageContainer.find('.region-dropdown [data-dropdown]');

    $dropdownListing.click(function () {
      $value = $(this).closest('li').attr('data-value');
      $dropdown.toggleClass('dropdown--open');
      $largeDropdownName.text($value);
      Bridge.Event.trigger('master:' + $pageContainer + 'region-update', { instance: $value });
    });

  }

  this.regionDropdown = function () {

    // Easy dropdown
    var $value;

    var defaultState = "National";

    var defaultData = data.overviewData.states.find(function (item) {
      return item.state === defaultState
    });

    var regionDd = Bridge.Context.get('region_dropdown' + slide);

    if (regionDd) {
      $value = regionDd.region;
      $pageContainer.find('[data-state]').attr('data-state', regionDd.state);
      $pageContainer.find('[data-ma-audience]').html(addCommas(regionDd.uniqueAudience));
      $pageContainer.find('[data-ma-audience-competitor]').html(addCommas(regionDd.uniqueAudienceCompetitor));
      // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(regionDd.uniqueAudienceMultiplier));
      $pageContainer.find('[data-ma-audience-claim]').html(regionDd.uniqueAudienceClaim);
      _heightColumnHandle('[data-ma-audience]', regionDd.uniqueAudience, '[data-ma-audience-competitor]', regionDd.uniqueAudienceCompetitor);

      if (regionDd.audienceExclusive != undefined && regionDd.audienceExclusiveCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(1).show();
        $pageContainer.find('[data-ma-exclusive]').html(addCommas(regionDd.audienceExclusive));
        $pageContainer.find('[data-ma-exclusive-competitor]').html(addCommas(_undefinedHandle(regionDd.audienceExclusiveCompetitor)));
        $pageContainer.find('[data-ma-exclusive-claim]').html(regionDd.audienceExclusiveClaim);
        _heightColumnHandle('[data-ma-exclusive]', regionDd.audienceExclusive, '[data-ma-exclusive-competitor]', regionDd.audienceExclusiveCompetitor);
      }
      else {
        $pageContainer.find('.va-card').eq(1).hide();
      }

      if (regionDd.timeSpentPerPerson != undefined && regionDd.timeSpentPerPersonCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(2).show();
        $pageContainer.find('[data-ma-time-spent]').html(regionDd.timeSpentPerPerson);
        $pageContainer.find('[data-ma-time-spent-competitor]').html(regionDd.timeSpentPerPersonCompetitor);
        $pageContainer.find('[data-ma-time-spent-claim]').html(regionDd.timeSpentPerPersonClaim);
        _heightColumnHandle('[data-ma-time-spent]', regionDd.timeSpentPerPerson, '[data-ma-time-spent-competitor]', regionDd.timeSpentPerPersonCompetitor);
      }
      else {
        $pageContainer.find('.va-card').eq(2).hide();
      }

      $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(regionDd.disclaimers));
    }

    var $largeDropdownName = $pageContainer.find('.region-dropdown .input-label');
    var $dropdown = $pageContainer.find('.region-dropdown .input--dropdown');
    $largeDropdownName.text($value);

    var listHtml = ''

    if (regionDd) {
      regionDd.regions.forEach(function (item) {
        listHtml += '<li data-value="' + item.region + '" data-dropdown>' + item.region + '</li>'
      })
    } else {
      defaultData.regions.forEach(function (item) {
        listHtml += '<li data-value="' + item.region + '" data-dropdown>' + item.region + '</li>'
      })
    }

    $pageContainer.find('.region-dropdown #dropdown_group').html(
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
      $largeDropdownName.click(function () {
        $dropdown.toggleClass('dropdown--open');
      });
    }

    var $dropdownListing = $pageContainer.find('.region-dropdown [data-dropdown]');

    $dropdownListing.click(function () {
      $value = $(this).closest('li').attr('data-value');
      $dropdown.toggleClass('dropdown--open');
      $largeDropdownName.text($value);
      Bridge.Event.trigger('master:' + $pageContainer + 'region-update', { instance: $value });
    });

    // Bridging events for client
    Bridge.Event.on('client:fetch-' + $pageContainer + '-state', function () {
      Bridge.Event.trigger('master:' + $pageContainer + '-region', { instance: $value });
    });

    Bridge.Event.on('master:' + $pageContainer + 'region-update', function (state) {

      var $regionDropdownLabel = $pageContainer.find('.region-dropdown .input-label');
      $regionDropdownLabel.text(state.instance);

      //var sData;
      var regions;
      var stateDd = Bridge.Context.get('state_dropdown-2' + slide);

      if (stateDd) {
        //sData = state
        regions = stateDd.regions
      } else {
        //sData = defaultState
        regions = defaultData.regions;
      }

      console.log('regions: ', regions);

      var regionData = regions.find(function (item) {
        return item.region === state.instance
      });

      if (regionData) {
        $pageContainer.find('[data-state]').attr('data-state', regionData.state);
        $pageContainer.find('[data-ma-audience]').html(addCommas(regionData.uniqueAudience));
        $pageContainer.find('[data-ma-audience-competitor]').html(addCommas(regionData.uniqueAudienceCompetitor));
        // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(regionData.uniqueAudienceMultiplier));
        $pageContainer.find('[data-ma-audience-claim]').html(regionData.uniqueAudienceClaim);
        _heightColumnHandle('[data-ma-audience]', regionData.uniqueAudience, '[data-ma-audience-competitor]', regionData.uniqueAudienceCompetitor);

        if (regionData.audienceExclusive != undefined && regionData.audienceExclusiveCompetitor != undefined) {
          $pageContainer.find('.va-card').eq(1).show();
          $pageContainer.find('[data-ma-exclusive]').html(addCommas(regionData.audienceExclusive));
          $pageContainer.find('[data-ma-exclusive-competitor]').html(addCommas(_undefinedHandle(regionData.audienceExclusiveCompetitor)));
          $pageContainer.find('[data-ma-exclusive-claim]').html(regionData.audienceExclusiveClaim);
          _heightColumnHandle('[data-ma-exclusive]', regionData.audienceExclusive, '[data-ma-exclusive-competitor]', regionData.audienceExclusiveCompetitor);
        }
        else {
          $pageContainer.find('.va-card').eq(1).hide();
        }

        if (regionData.timeSpentPerPerson != undefined && regionData.timeSpentPerPersonCompetitor != undefined) {
          $pageContainer.find('.va-card').eq(2).show();
          $pageContainer.find('[data-ma-time-spent]').html(regionData.timeSpentPerPerson);
          $pageContainer.find('[data-ma-time-spent-competitor]').html(regionData.timeSpentPerPersonCompetitor);
          $pageContainer.find('[data-ma-time-spent-claim]').html(regionData.timeSpentPerPersonClaim);
          _heightColumnHandle('[data-ma-time-spent]', regionData.timeSpentPerPerson, '[data-ma-time-spent-competitor]', regionData.timeSpentPerPersonCompetitor);
        }
        else {
          $pageContainer.find('.va-card').eq(2).hide();
        }

        $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(regionData.disclaimers));

        Bridge.Context.set('region_dropdown-2' + slide, {
          regions: regions,
          region: regionData.region
        });
      } else {
        console.log('something else here');
      }

    });
  }

  this.stateDropdown = function () {

    // Easy dropdown
    var $value;
    var defaultState = "National"

    var defaultData = data.overviewData.states.find(function (item) {
      return item.state === defaultState
    });

    if (stateDd) {
      $value = stateDd.state;
      $pageContainer.find('[data-state]').attr('data-state', stateDd.state);
      $pageContainer.find('[data-ma-audience]').html(addCommas(stateDd.uniqueAudience));
      $pageContainer.find('[data-ma-audience-competitor]').html(addCommas(stateDd.uniqueAudienceCompetitor));
      // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(stateDd.uniqueAudienceMultiplier));
      $pageContainer.find('[data-ma-audience-claim]').html(stateDd.uniqueAudienceClaim);
      _heightColumnHandle('[data-ma-audience]', stateDd.uniqueAudience, '[data-ma-audience-competitor]', stateDd.uniqueAudienceCompetitor);

      if (stateDd.audienceExclusive != undefined && stateDd.audienceExclusiveCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(1).show();
        $pageContainer.find('[data-ma-exclusive]').html(addCommas(stateDd.audienceExclusive));
        $pageContainer.find('[data-ma-exclusive-competitor]').html(addCommas(_undefinedHandle(stateDd.audienceExclusiveCompetitor)));
        $pageContainer.find('[data-ma-exclusive-claim]').html(stateDd.audienceExclusiveClaim);
        _heightColumnHandle('[data-ma-exclusive]', stateDd.audienceExclusive, '[data-ma-exclusive-competitor]', stateDd.audienceExclusiveCompetitor);
      }
      else {
        $pageContainer.find('.va-card').eq(1).hide();
      }

      if (stateDd.timeSpentPerPerson != undefined && stateDd.timeSpentPerPersonCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(2).show();
        $pageContainer.find('[data-ma-time-spent]').html(stateDd.timeSpentPerPerson);
        $pageContainer.find('[data-ma-time-spent-competitor]').html(stateDd.timeSpentPerPersonCompetitor);
        $pageContainer.find('[data-ma-time-spent-claim]').html(stateDd.timeSpentPerPersonClaim);
        _heightColumnHandle('[data-ma-time-spent]', stateDd.timeSpentPerPerson, '[data-ma-time-spent-competitor]', stateDd.timeSpentPerPersonCompetitor);
      } else {
        $pageContainer.find('.va-card').eq(2).hide();
      }

      $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(stateDd.disclaimers));

    } else {
      $value = defaultState;
      $pageContainer.find('[data-state]').attr('data-state', defaultData.state);
      $pageContainer.find('[data-ma-audience]').html(addCommas(defaultData.uniqueAudience));
      $pageContainer.find('[data-ma-audience-competitor]').html(addCommas(defaultData.uniqueAudienceCompetitor));
      // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(defaultData.uniqueAudienceMultiplier));
      $pageContainer.find('[data-ma-audience-claim]').html(defaultData.uniqueAudienceClaim);
      _heightColumnHandle('[data-ma-audience]', defaultData.uniqueAudience, '[data-ma-audience-competitor]', defaultData.uniqueAudienceCompetitor);

      if (defaultData.audienceExclusive != undefined && defaultData.audienceExclusiveCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(1).show();
        $pageContainer.find('[data-ma-exclusive]').html(addCommas(defaultData.audienceExclusive));
        $pageContainer.find('[data-ma-exclusive-competitor]').html(addCommas(_undefinedHandle(defaultData.audienceExclusiveCompetitor)));
        $pageContainer.find('[data-ma-exclusive-claim]').html(defaultData.audienceExclusiveClaim);
        _heightColumnHandle('[data-ma-exclusive]', defaultData.audienceExclusive, '[data-ma-exclusive-competitor]', defaultData.audienceExclusiveCompetitor);
      }
      else {
        $pageContainer.find('.va-card').eq(1).hide();
      }

      if (defaultData.timeSpentPerPerson != undefined && defaultData.timeSpentPerPersonCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(2).show();
        $pageContainer.find('[data-ma-time-spent]').html(defaultData.timeSpentPerPerson);
        $pageContainer.find('[data-ma-time-spent-competitor]').html(defaultData.timeSpentPerPersonCompetitor);
        $pageContainer.find('[data-ma-time-spent-claim]').html(defaultData.timeSpentPerPersonClaim);
        _heightColumnHandle('[data-ma-time-spent]', defaultData.timeSpentPerPerson, '[data-ma-time-spent-competitor]', defaultData.timeSpentPerPersonCompetitor);
      } else {
        $pageContainer.find('.va-card').eq(2).hide();
      }

      $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(defaultData.disclaimers));
    }

    var $smallDropdownName = $pageContainer.find('.state-dropdown .input-label');
    $smallDropdownName.text($value);
    var $dropdown = $pageContainer.find('.state-dropdown .input--dropdown');

    var listHtml = ''

    data.overviewData.states.forEach(function (item) {
      listHtml += '<li data-value="' + item.state + '" data-dropdown>' + item.state + '</li>'
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

      var stateData = data.overviewData.states.find(function (item) {
        return item.state === state.instance
      })

      $smallDropdownName.text(stateData.state);

      $pageContainer.find('[data-state]').attr('data-state', stateData.state);
      $pageContainer.find('[data-ma-audience]').html(addCommas(stateData.uniqueAudience));
      $pageContainer.find('[data-ma-audience-competitor]').html(addCommas(stateData.uniqueAudienceCompetitor));
      // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(stateData.uniqueAudienceMultiplier));
      $pageContainer.find('[data-ma-audience-claim]').html(stateData.uniqueAudienceClaim);
      _heightColumnHandle('[data-ma-audience]', stateData.uniqueAudience, '[data-ma-audience-competitor]', stateData.uniqueAudienceCompetitor);

      if (stateData.audienceExclusive != undefined && stateData.audienceExclusiveCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(1).show();
        $pageContainer.find('[data-ma-exclusive]').html(addCommas(stateData.audienceExclusive));
        $pageContainer.find('[data-ma-exclusive-competitor]').html(addCommas(_undefinedHandle(stateData.audienceExclusiveCompetitor)));
        $pageContainer.find('[data-ma-exclusive-claim]').html(stateData.audienceExclusiveClaim);
        _heightColumnHandle('[data-ma-exclusive]', stateData.audienceExclusive, '[data-ma-exclusive-competitor]', stateData.audienceExclusiveCompetitor);
      }
      else {
        $pageContainer.find('.va-card').eq(1).hide();
      }

      if (stateData.timeSpentPerPerson != undefined && stateData.timeSpentPerPersonCompetitor != undefined) {
        $pageContainer.find('.va-card').eq(2).show();
        $pageContainer.find('[data-ma-time-spent]').html(stateData.timeSpentPerPerson);
        $pageContainer.find('[data-ma-time-spent-competitor]').html(stateData.timeSpentPerPersonCompetitor);
        $pageContainer.find('[data-ma-time-spent-claim]').html(stateData.timeSpentPerPersonClaim);
        _heightColumnHandle('[data-ma-time-spent]', stateData.timeSpentPerPerson, '[data-ma-time-spent-competitor]', stateData.timeSpentPerPersonCompetitor);
      } else {
        $pageContainer.find('.va-card').eq(2).hide();
      }

      $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(stateData.disclaimers));

      resetDropdown(stateData);

      Bridge.Context.set('state_dropdown-2' + slide, stateData);

      Bridge.Context.set('region_dropdown-2' + slide, {
        regions: stateData.regions,
        region: 'Region',
      });

    });
  }

  _heightColumnHandle = function (element1, dataE1, element2, dataE2) {
    let height = 0;

    if (dataE1 == false || dataE2 == false || dataE1 == undefined || dataE2 == undefined) {
      if (dataE1 == false || dataE1 == undefined) {
        $pageContainer.find(element1).hide();
      }

      if (dataE2 == false || dataE2 == undefined) {
        $pageContainer.find(element2).hide();
      }
      return;
    }
    else {
      let data1 = parseInt(dataE1.replace(/,|%/g, ''));
      let data2 = parseInt(dataE2.replace(/,|%/g, ''));
      if (isNaN(data1) || isNaN(data2)) {
        if (isNaN(data1)) {
          $pageContainer.find(element1).hide();
        }

        if (isNaN(data2)) {
          $pageContainer.find(element2).hide();
        }
        return;
      }

      $pageContainer.find(element1).show();
      $pageContainer.find(element2).show();

      if (data1 > data2) {
        height = 359 / data1 * data2;
        $pageContainer.find(element1).css('height', '359px');
        $pageContainer.find(element2).css('height', height + 'px');
      }
      else if (data2 > data1) {
        height = 359 / data2 * data1;
        $pageContainer.find(element1).css('height', height + 'px');
        $pageContainer.find(element2).css('height', '359px');
      }
      else if (data2 > 0 && data1 > 0) {
        $pageContainer.find(element1).css('height', '359px');
        $pageContainer.find(element2).css('height', '359px');
      }

    }
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
