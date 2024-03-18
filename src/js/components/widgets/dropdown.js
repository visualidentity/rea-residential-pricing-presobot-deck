var _dropdown = function($pageContainer) {
  var client = $('body').hasClass('client') ? true : false;
  var dropdownContext = Bridge.Context.match(
    '.' + $pageContainer[0].id + '--dropdown',
    {}
  );

  if (client) {
    _bindClientEvents();
  } else {
    _bindMasterEvents();
  }

  // Conversion for Dropdown selection
  function _dropdownConversion($indDropdown, $dropdownTitle) {
    $inputLabel = $pageContainer.find('#' + $indDropdown + ' .input-label');
    $inputLabel.text($dropdownTitle);

    $selectedDropdown = $pageContainer.find('#' + $indDropdown);
    $selectedDropdown.find('.results__child').removeClass('strong');

    $selectedChild = $selectedDropdown.find(
      '.results__child[value="' + $dropdownTitle + '"]'
    );
    $selectedChild.addClass('strong');
  }

  function _bindMasterEvents() {
    var $ref = $pageContainer.find('[data-header-refresh]');
    var $dropdown = $pageContainer.find('.header__input-dropdown');
    var dropdownValue;
    var indDropdown;
    var dropdownTitle;

    // Dropdown open
    $dropdown.click(function() {
      var $dropdown = $(this)
        .closest('.header__input-dropdown')
        .attr('id');
      $(this).toggleClass('is-open');
      $pageContainer
        .find('.header__input-dropdown')
        .not(this)
        .removeClass('is-open');

      Bridge.Event.trigger('master:dropdown-open', {
        dropdownValue: $dropdown
      });
    });

    // Child styling on selection
    $pageContainer.find('.results__child').click(function() {
      var $indDropdown = $(this)
        .closest('.header__input-dropdown')
        .attr('id');
      var $dropdownTitle = $(this).text();
      _dropdownConversion($indDropdown, $dropdownTitle);

      dropdownContext[$indDropdown] = $dropdownTitle;
      Bridge.Context.set($pageContainer[0].id + '--dropdown', dropdownContext);
      Bridge.Event.trigger('master:dropdown-property', {
        indDropdown: $indDropdown,
        dropdownTitle: $dropdownTitle
      });
    });

    // Dropdown refresh
    // $ref.click(function() {
    //   $('.header__input-dropdown').each(function() {
    //     var $refreshedTitle = $(this)
    //       .find('.results__child:first-child')
    //       .text();
    //     var $refreshedDropdown = $(this).attr('id');
    //     _dropdownConversion($refreshedDropdown, $refreshedTitle);

    //     Bridge.Event.trigger('master:dropdown-property', {
    //       indDropdown: $refreshedDropdown,
    //       dropdownTitle: $refreshedTitle
    //     });
    //   });
    // });

    // Bridging events for client
    Bridge.Event.on('client:fetch-dropdown-state', function() {
      Bridge.Event.trigger('master:dropdown-open', {
        dropdownValue: dropdownValue
      });
      Bridge.Event.trigger('master:dropdown-property', {
        indDropdown: indDropdown,
        dropdownTitle: dropdownTitle
      });
    });
  }

  // Executing clients
  function _bindClientEvents() {
    Bridge.Event.trigger('client:fetch-dropdown-state');
    Bridge.Event.on('master:dropdown-open', function(data) {
      $pageContainer.find('#' + data.dropdownValue).toggleClass('is-open');
      $pageContainer
        .find('.header__input-dropdown')
        .not('#' + data.dropdownValue)
        .removeClass('is-open');
    });
    Bridge.Event.on('master:dropdown-property', function(data) {
      dropdownContext[data.indDropdown] = data.dropdownTitle;
      Bridge.Context.set($pageContainer[0].id + '--dropdown', dropdownContext);
      _dropdownConversion(data.indDropdown, data.dropdownTitle);
    });
  }

  if (dropdownContext) {
    $.each(dropdownContext, function(index, value) {
      _dropdownConversion(index, value);
    });
  }
};
