
var attachAudienceOverviewReturnOnYourInvestmentEvents = function (options) {

  function convertToInternationalCurrencySystem (labelValue) {

    var num = Math.abs(Number(labelValue))
    const billions = num/1.0e+9
    const millions = num/1.0e+6
    const thousands = num/1.0e+3
    return num >= 1.0e+9 && billions >= 100  ? Math.round(billions)  + "B"
         : num >= 1.0e+9 && billions >= 10   ? billions.toFixed(1)   + "B"
         : num >= 1.0e+9                     ? billions.toFixed(1)   + "B"
         : num >= 1.0e+6 && millions >= 100  ? Math.round(millions)  + "M"
         : num >= 1.0e+6 && millions >= 10   ? millions.toFixed(1)   + "M"
         : num >= 1.0e+6                     ? millions.toFixed(1)   + "M"
         : num >= 1.0e+3 && thousands >= 100 ? Math.round(thousands) + "K"
         : num >= 1.0e+3 && thousands >= 10  ? thousands.toFixed(1)  + "K"
         : num >= 1.0e+3                     ? thousands.toFixed(1)  + "K"
         : num.toFixed()

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
  var defaultState = "National"

  var defaultData = data.overviewData.states.find(function (item) {
    return item.state === defaultState
  });

  if (stateDd) {
    $value = stateDd.state;
    $pageContainer.find('[data-state]').attr('data-state', stateDd.state);
    $pageContainer.find('[data-ma-reaUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(stateDd.reaUniqueAudience.replace(/,/g, "")))));
    $pageContainer.find('[data-ma-domainUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(stateDd.domainUniqueAudience.replace(/,/g, "")))));
    // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(stateDd.uniqueAudienceMultiplier));
    $pageContainer.find('[data-ma-audience-claim]').html(stateDd.uniqueAudienceClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
    _heightColumnHandle('[data-ma-reaUniqueAudience]', stateDd.reaUniqueAudience, '[data-ma-domainUniqueAudience]', stateDd.domainUniqueAudience);

    // if (stateDd.reaExclusiveAudience != undefined && stateDd.audienceExclusiveDomain != undefined && stateDd.sharedAudience != undefined) {
    if (stateDd.reaExclusiveAudience != undefined && stateDd.audienceExclusiveDomain != undefined) {

      $pageContainer.find('.va-card').eq(1).show();
      $pageContainer.find('[data-ma-reaExclusiveAudience]').html(addCommas(stateDd.reaExclusiveAudience));
      $pageContainer.find('[data-ma-audienceExclusiveDomain]').html(addCommas(_undefinedHandle(stateDd.audienceExclusiveDomain)));
      // $pageContainer.find('[data-ma-sharedAudience]').html(addCommas(_undefinedHandle(stateDd.sharedAudience)));
      $pageContainer.find('[data-ma-exclusive-claim]').html(stateDd.audienceExclusiveClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
      // _heightCircleHandle('[data-ma-reaExclusiveAudience]', stateDd.reaExclusiveAudience, '[data-ma-audienceExclusiveDomain]', stateDd.audienceExclusiveDomain, '[data-ma-sharedAudience]', stateDd.sharedAudience);
      _heightCircleHandle('[data-ma-reaExclusiveAudience]', stateDd.reaExclusiveAudience, '[data-ma-audienceExclusiveDomain]', stateDd.audienceExclusiveDomain);
    }
    else {
      $pageContainer.find('.va-card').eq(1).hide();
    }

    if (stateDd.reaTimeSpentPerPerson != undefined && stateDd.domainTimeSpentPerPerson != undefined) {
      $pageContainer.find('.va-card').eq(2).show();
      $pageContainer.find('[data-ma-reaTimeSpentPerPerson]').html(stateDd.reaTimeSpentPerPerson.replace(/min/g, ""));
      $pageContainer.find('[data-ma-domainTimeSpentPerPerson]').html(stateDd.domainTimeSpentPerPerson.replace(/min/g, ""));
      $pageContainer.find('[data-ma-domainTimeSpentPerPersonPie]').css('--p', stateDd.domainTimeSpentPerPerson.replace(/min/g, ""));
      document.querySelector("div[data-ma-domainTimeSpentPerPersonPie]").style.setProperty('--p', (stateDd.domainTimeSpentPerPerson.replace(/ min/g, "") / stateDd.reaTimeSpentPerPerson.replace(/ min/g, "")) * 75);

      $pageContainer.find('[data-ma-time-spent-claim]').html(stateDd.timeSpentPerPersonClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
      _heightColumnHandle('[data-ma-reaTimeSpentPerPerson]', stateDd.reaTimeSpentPerPerson, '[data-ma-domainTimeSpentPerPerson]', stateDd.domainTimeSpentPerPerson);
    } else {
      $pageContainer.find('.va-card').eq(2).hide();
    }

    $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(stateDd.disclaimers));

  } else {
    $value = defaultState;
    $pageContainer.find('[data-state]').attr('data-state', defaultData.state);
    $pageContainer.find('[data-ma-reaUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(defaultData.reaUniqueAudience.replace(/,/g, "")))));
    $pageContainer.find('[data-ma-domainUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(defaultData.domainUniqueAudience.replace(/,/g, "")))));
    // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(defaultData.uniqueAudienceMultiplier));
    $pageContainer.find('[data-ma-audience-claim]').html(defaultData.uniqueAudienceClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
    _heightColumnHandle('[data-ma-reaUniqueAudience]', defaultData.reaUniqueAudience, '[data-ma-domainUniqueAudience]', defaultData.domainUniqueAudience);

    // if (defaultData.reaExclusiveAudience != undefined && defaultData.audienceExclusiveDomain != undefined && defaultData.sharedAudience != undefined) {
    if (defaultData.reaExclusiveAudience != undefined && defaultData.audienceExclusiveDomain != undefined) {

      $pageContainer.find('.va-card').eq(1).show();
      $pageContainer.find('[data-ma-reaExclusiveAudience]').html(addCommas(defaultData.reaExclusiveAudience));
      $pageContainer.find('[data-ma-audienceExclusiveDomain]').html(addCommas(_undefinedHandle(defaultData.audienceExclusiveDomain)));
      // $pageContainer.find('[data-ma-sharedAudience]').html(addCommas(_undefinedHandle(defaultData.sharedAudience)));
      $pageContainer.find('[data-ma-exclusive-claim]').html(defaultData.audienceExclusiveClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
    }
    else {
      $pageContainer.find('.va-card').eq(1).hide();
    }

    if (defaultData.reaTimeSpentPerPerson != undefined && defaultData.domainTimeSpentPerPerson != undefined) {
      $pageContainer.find('.va-card').eq(2).show();
      $pageContainer.find('[data-ma-reaTimeSpentPerPerson]').html(defaultData.reaTimeSpentPerPerson.replace(/min/g, ""));
      $pageContainer.find('[data-ma-domainTimeSpentPerPerson]').html(defaultData.domainTimeSpentPerPerson.replace(/min/g, ""));
      $pageContainer.find('[data-ma-domainTimeSpentPerPersonPie]').css('--p', defaultData.domainTimeSpentPerPerson.replace(/min/g, ""));
      document.querySelector("div[data-ma-domainTimeSpentPerPersonPie]").style.setProperty('--p', (defaultData.domainTimeSpentPerPerson.replace(/ min/g, "") / defaultData.reaTimeSpentPerPerson.replace(/ min/g, "")) * 75);

      $pageContainer.find('[data-ma-time-spent-claim]').html(defaultData.timeSpentPerPersonClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
      _heightColumnHandle('[data-ma-reaTimeSpentPerPerson]', defaultData.reaTimeSpentPerPerson, '[data-ma-domainTimeSpentPerPerson]', defaultData.domainTimeSpentPerPerson);
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
    $pageContainer.find('[data-ma-reaUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(stateData.reaUniqueAudience.replace(/,/g, "")))));
    $pageContainer.find('[data-ma-domainUniqueAudience]').html(addCommas(convertToInternationalCurrencySystem(parseFloat(stateData.domainUniqueAudience.replace(/,/g, "")))));
    // $pageContainer.find('[data-ma-audience-compare]').html(addCommas(stateData.uniqueAudienceMultiplier));
    $pageContainer.find('[data-ma-audience-claim]').html(stateData.uniqueAudienceClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
    _heightColumnHandle('[data-ma-reaUniqueAudience]', stateData.reaUniqueAudience, '[data-ma-domainUniqueAudience]', stateData.domainUniqueAudience);

    // if (stateData.reaExclusiveAudience != undefined && stateData.audienceExclusiveDomain != undefined && stateData.sharedAudience != undefined) {
    if (stateData.reaExclusiveAudience != undefined && stateData.audienceExclusiveDomain != undefined) {

      $pageContainer.find('.va-card').eq(1).show();
      $pageContainer.find('[data-ma-reaExclusiveAudience]').html(addCommas(stateData.reaExclusiveAudience));
      $pageContainer.find('[data-ma-audienceExclusiveDomain]').html(addCommas(_undefinedHandle(stateData.audienceExclusiveDomain)));
      // $pageContainer.find('[data-ma-sharedAudience]').html(addCommas(_undefinedHandle(stateData.sharedAudience)));
      $pageContainer.find('[data-ma-exclusive-claim]').html(stateData.audienceExclusiveClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
      // _heightCircleHandle('[data-ma-reaExclusiveAudience]', stateData.reaExclusiveAudience, '[data-ma-audienceExclusiveDomain]', stateData.audienceExclusiveDomain, '[data-ma-sharedAudience]', stateData.sharedAudience);
      _heightCircleHandle('[data-ma-reaExclusiveAudience]', stateData.reaExclusiveAudience, '[data-ma-audienceExclusiveDomain]', stateData.audienceExclusiveDomain);

    }
    else {
      $pageContainer.find('.va-card').eq(1).hide();
    }

    if (stateData.reaTimeSpentPerPerson != undefined && stateData.domainTimeSpentPerPerson != undefined) {
      $pageContainer.find('.va-card').eq(2).show();
      $pageContainer.find('[data-ma-reaTimeSpentPerPerson]').html(stateData.reaTimeSpentPerPerson.replace(/min/g, ""));
      $pageContainer.find('[data-ma-domainTimeSpentPerPerson]').html(stateData.domainTimeSpentPerPerson.replace(/min/g, ""));
      $pageContainer.find('[data-ma-domainTimeSpentPerPersonPie]').css('--p', stateData.domainTimeSpentPerPerson.replace(/min/g, ""));
      document.querySelector("div[data-ma-domainTimeSpentPerPersonPie]").style.setProperty('--p', (stateData.domainTimeSpentPerPerson.replace(/ min/g, "") / stateData.reaTimeSpentPerPerson.replace(/ min/g, "")) * 75);

      $pageContainer.find('[data-ma-time-spent-claim]').html(stateData.timeSpentPerPersonClaim.replace(/\%/g, " %").replace(/% more/g, "%more").replace(/% less/g, "%less").replace(/%/g, "%").split(" ").map((item) => item.replace("k", "").replace("x", "").replace(/\d+\.*\d*(?!<\/sup>)/g, `<span class="text_red"> ${item}</span>`).replace(/%more/g, "<span class='text_red'>% more</span>").replace(/%less/g, "<span class='text_red'>% less</span>").replace(/%of/g, "<span class='text_red'>% of</span>").replace(/longer/g, "<span class='text_red'>longer</span>").replace(/mins/g, "<span class='text_red'>minutes</span>").replace(/million/g, "<span class='text_red'>million</span>").replace(/k/g, "<span class='text_red'>k</span>").replace(/%/g, "<span class='text_narrow'>%</span>")).join('---').replace(/---/g, " "));
      _heightColumnHandle('[data-ma-reaTimeSpentPerPerson]', stateData.reaTimeSpentPerPerson, '[data-ma-domainTimeSpentPerPerson]', stateData.domainTimeSpentPerPerson);
    } else {
      $pageContainer.find('.va-card').eq(2).hide();
    }

    $pageContainer.find('[data-ma-disclaimer]').html(_disclaimerHandle(stateData.disclaimers));


    Bridge.Context.set('state_dropdown-2' + slide, stateData);

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
      height = 275 / data1 * data2;
      $pageContainer.find(element1).css('height', '275px');
      $pageContainer.find(element2).css('height', height + 'px');
    }
    else if (data2 > data1) {
      height = 275 / data2 * data1;
      $pageContainer.find(element1).css('height', height + 'px');
      $pageContainer.find(element2).css('height', '275px');
    }
    else if (data2 > 0 && data1 > 0) {
      $pageContainer.find(element1).css('height', '275px');
      $pageContainer.find(element2).css('height', '275px');
    }

  }
}

_heightCircleHandle = function (element1, dataE1, element2, dataE2, element3, dataE3) {
  if ( dataE1 == false || dataE1 == undefined )  {
      $pageContainer.find(element1).hide();
  } else if ( dataE1 || dataE1 != undefined ) {
      $pageContainer.find(element1).show();
      var size = Math.round(496 * (parseInt(dataE1.replace(/%/g, '')) / 100));
      $pageContainer.find(element1).css({'height': '263px', 'width': '263px', 'font-size': '75px', 'line-height': '75px'});
  }
  if ( dataE2 == false || dataE2 == undefined )  {
      $pageContainer.find(element2).hide();
  } else if ( dataE2 || dataE2 != undefined ) {
      $pageContainer.find(element2).show();
      var size = '';
      var left = '';
      var top = '';
      fontSize = '';
      size = (144 * (parseInt(dataE2.replace(/%/g, '')) / 100) * 4);
      left = '11%';
      bottom =  '70%';
      fontSize = parseInt(dataE2.replace(/%/g, '') > 15) ? '40px' : '32px';
      $pageContainer.find(element2).css({'height': size, 'width': size, 'margin-left': left, 'top': top, 'font-size': fontSize, 'line-height': fontSize});
  }
  if ( dataE3 == false || dataE3 == undefined )  {
      $pageContainer.find(element3).hide();
  } else if ( dataE3 || dataE3 != undefined ) {
      $pageContainer.find(element3).show();
      var size = '';
      var left = '';
      var top = '';
      fontSize = '';
      size = (144 * (parseInt(dataE3.replace(/%/g, '')) / 100) * 4);
      left = 'auto';
      top =  '31%';
      fontSize = '40px';
    $pageContainer.find(element3).css({'height': size, 'width': size, 'left': left, 'top': top, 'font-size': fontSize, 'line-height': fontSize});
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
