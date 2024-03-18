var connectCalculator = function(options) {
	var client = $('body').hasClass('client') ? true : false;
	var attr, dom;
	dom = options.slide;
  var $calculator = dom.find('[data-calculator]');
  var $reset = dom.find('[data-reset]');
	var $input = dom.find('input');
  var $add = dom.find('[data-add]');
  var $close = dom.find('[data-close]');

  var letterbox = dom.find('[data-value="letterbox"]');
  var signing = dom.find('[data-value="signing"]');
  var cma = dom.find('[data-value="cma"]');
  var market = dom.find('[data-value="market"]');
  var proposal = dom.find('[data-value="proposal"]');
  var totalMonthlyCost = dom.find('[data-monthly-value]');
  
  var seats = dom.find('[data-value="seats"]');
  var initalSeat = dom.find('[data-initial-seat-value]');
  var hiddenFields = [];
  var additionalSeats = dom.find('[data-additional-seat-value]');
  var totalSeatsCost = dom.find('[data-seats-monthly-value]');

  var obj = {
    additionalSeats: null,
    monthlyCost: [null, null, null, null, null],
    other: [
      {
        title: "",
        value: null
      },
      {
        title: "",
        value: null
      },
      {
        title: "",
        value: null
      },
      {
        title: "",
        value: null
      },
      {
        title: "",
        value: null
      },
      {
        title: "",
        value: null
      }
    ],
    hiddenCosts: [],
    activeOthers: ['other-0'],
    hiddenOthers: ['other-1', 'other-2', 'other-3', 'other-4', 'other-5'],
    activeCosts: ["1", "2", "3", "4", "5"]
  };

  var calculatorContext = Bridge.Context.get('connectCalculator', null);

  if (client) {
    _bindClientEvents();
  }
  else {
    _bindMasterEvents();
  }

	// Master
	function _bindMasterEvents() {
		$input.keyup(function() {
      obj.monthlyCost[0] = parseFloat(letterbox.val() || 0);
      obj.monthlyCost[1] = parseFloat(signing.val() || 0);
      obj.monthlyCost[2] = parseFloat(cma.val() || 0);
      obj.monthlyCost[3] = parseFloat(market.val() || 0);
      obj.monthlyCost[4] = parseFloat(proposal.val() || 0);
      obj.additionalSeats = parseFloat(seats.val() || 0);

      for (let i = 0; i < obj.activeOthers.length; ++i) {
        obj.other[i].title = dom.find('input[data-other-title-value="other-' + i + '"]').val() || "";
        obj.other[i].value = parseFloat(dom.find('input[data-value="other-' + i + '"]').val() || 0);
      }

      _handleInputs();

      Bridge.Context.set('connectCalculator', obj);

      Bridge.Event.trigger('master:handle-population', obj);
    });

    $add.click(function() {
      Bridge.Event.trigger('master:handle-add');
      _handleAdditionalField();
    });

    $close.click(function() {
      Bridge.Event.trigger('master:handle-close', $(this).attr('data-close'));
      _handleRemovableField($(this).attr('data-close'));
    });

    $calculator.on("mousewheel", function() {
      Bridge.Event.trigger('master:handle-scroll', $calculator.scrollTop());
    });

    $reset.click(function() {
      Bridge.Event.trigger('master:handle-reset', $calculator.scrollTop());
      _handleReset();
    });

    if (calculatorContext) {
      obj = calculatorContext;
      _calculatorContext();
    }

    Bridge.Event.on("client:catchUp", function() {
      Bridge.Event.trigger("slide:update", Bridge.Context.get('connectCalculator', obj));
    });
	}

  // Client
  function _bindClientEvents() {
    Bridge.Event.trigger("client:catchUp");

    Bridge.Event.on("master:handle-population", function (data) {
      obj = data;

      letterbox.val(obj.monthlyCost[0]);
      signing.val(obj.monthlyCost[1]);
      cma.val(obj.monthlyCost[2]);
      market.val(obj.monthlyCost[3]);
      proposal.val(obj.monthlyCost[4]);
      seats.val(obj.additionalSeats);

      $.each(obj.activeOthers, function( index, value ) {
        var i = value.replace('other-', '');
        dom.find('[data-input="' + value + '"]').show();
        dom.find('input[data-other-title-value="' + value + '"]').val(obj.other[i].title);
        dom.find('input[data-value="' + value + '"]').val(obj.other[i].value);
      });

      _handleInputs();
    });

    Bridge.Event.on("master:handle-reset", function (data) {
      _handleReset();
    });

    Bridge.Event.on("master:handle-add", function () {
      _handleAdditionalField();
    });

    Bridge.Event.on("master:handle-close", function (data) {
      _handleRemovableField(data);
    });

    Bridge.Event.on("master:handle-scroll", function (data) {
      $calculator.scrollTop(data);
    });
  }

  // Context population
  function _calculatorContext() {
    letterbox.val(obj.monthlyCost[0]);
    signing.val(obj.monthlyCost[1]);
    cma.val(obj.monthlyCost[2]);
    market.val(obj.monthlyCost[3]);
    proposal.val(obj.monthlyCost[4]);

    $.each(obj.hiddenCosts, function( index, value ) {
      _handleRemovableField(value);
    });

    $.each(obj.hiddenOthers, function( index, value ) {
      _handleRemovableField(value);
    });

    $.each(obj.activeOthers, function( index, value ) {
      var i = value.replace('other-', '');
      dom.find('[data-input="' + value + '"]').show();
      dom.find('input[data-other-title-value="' + value + '"]').val(obj.other[i].title);
      dom.find('input[data-value="' + value + '"]').val(obj.other[i].value);
    });

    seats.val(obj.additionalSeats);
    
    _handleInputs();
  }

  // Calculation
  function _handleInputs() {
    // Left Side Calculations
    var totalMonthlyCostValue = obj.monthlyCost[0] + 
    obj.monthlyCost[1] +
    obj.monthlyCost[2] + 
    obj.monthlyCost[3] +
    obj.monthlyCost[4];

    var totalMonthlyOtherCost = 0;
    $.each(obj.activeOthers, function( index, value ) {
      var i = value.replace('other-', '');
      totalMonthlyOtherCost = totalMonthlyOtherCost + obj.other[i].value;
    });

    totalMonthlyCost.html((totalMonthlyCostValue + totalMonthlyOtherCost).toLocaleString());

    // Right Side Calculations
		if (obj.additionalSeats > 8) {
      dom.find('.invisible').css({'visibility': 'visible', 'opacity': 1});
      initalSeat.closest('.input-dollar-container--seat').addClass('discount');
    } else {
      dom.find('.invisible').css({'visibility': 'hidden', 'opacity': 0});
      initalSeat.closest('.input-dollar-container--seat').removeClass('discount');
    }

    var additionalSeatsValue = obj.additionalSeats * 99;

    additionalSeats.html(additionalSeatsValue.toLocaleString());
    totalSeatsCost.html((additionalSeatsValue + (obj.additionalSeats > 8 ? 99 : 249)).toLocaleString());
	}

  // Field Add Handler
  function _handleAdditionalField() {
		dom.find('[data-input="' + obj.hiddenOthers[0] + '"]').show();

    Bridge.Context.set('connectCalculator', obj);

    obj.activeOthers.push(obj.hiddenOthers[0]);
    obj.hiddenOthers.splice(0, 1).sort();
    obj.activeOthers = obj.activeOthers.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    }).sort();

    if (obj.activeOthers.length == 6) {
      $add.hide();
    }
	}

  // Field Remove Handler
  function _handleRemovableField(e) {
    if (e.indexOf('other') >= 0) {
      obj.hiddenOthers.push(e);
      obj.activeOthers = jQuery.grep(obj.activeOthers, function(value) {
        return value != e;
      }).sort();
      obj.hiddenOthers = obj.hiddenOthers.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      }).sort();

      if (obj.activeOthers.length > 0) {
        $add.show();
      }
    } else {
      hiddenFields.push(e);
      obj.activeCosts.splice(e, 1);
      obj.monthlyCost[e - 1] = 0;
      obj.hiddenCosts = hiddenFields.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      });
    }
    dom.find('[data-input="' + e + '"]').hide();
    dom.find('[data-input="' + e + '"] input').val(0);
    Bridge.Context.set('connectCalculator', obj);
    _handleInputs();
	}

  // Reset handler
  function _handleReset() {
    obj = {
      additionalSeats: null,
      monthlyCost: [null, null, null, null, null],
      other: [
        {
          title: "",
          value: null
        },
        {
          title: "",
          value: null
        },
        {
          title: "",
          value: null
        },
        {
          title: "",
          value: null
        },
        {
          title: "",
          value: null
        },
        {
          title: "",
          value: null
        }
      ],
      hiddenCosts: [],
      activeOthers: ['other-0'],
      hiddenOthers: ['other-1', 'other-2', 'other-3', 'other-4', 'other-5'],
      activeCosts: ["1", "2", "3", "4", "5"]
    };
    Bridge.Context.set('connectCalculator', {});
    Bridge.Context.set('connectCalculator', obj);

    dom.find('[data-input="other-0"]').show();
    $.each(obj.activeCosts, function( index, value ) {
      dom.find('[data-input="' + value + '"]').show();
    });
    $.each(obj.hiddenOthers, function( index, value ) {
      dom.find('[data-input="' + value + '"]').hide();
    });

    _calculatorContext();
	}

  // Client catch-up
  Bridge.Event.on("slide:update", function(e) {
    obj = e;
    _calculatorContext();
  });
};
