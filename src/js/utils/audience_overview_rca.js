
var attachAudienceOverviewRcaEvents = function(options) {
	
	var $pageContainer;

  var {
    slide,
    data
  } = options

  var stateDd = Bridge.Context.get('state_dropdown-2-rca' + slide);

	this.init = function() {
    $pageContainer = $(options.container);
    this.stateDropdown();
	};

  var resetDropdown = function(stateData) {

    var $value;

    var $dropdownListing = $pageContainer.find('.state-dropdown-rca [data-dropdown]');

    $dropdownListing.click(function() {
      $value = $(this).closest('li').attr('data-value');
    });

  }

  this.stateDropdown = function() {

    // Easy dropdown
    var $value;
    var defaultState = "National"

    var defaultData = data.overviewData.states.find(function(item) {
      return item.state === defaultState
    });

    if (stateDd) {
      $value = stateDd.state;
      $pageContainer.find('[data-ma-audience]').html(stateDd.uniqueAudience ? addCommas(stateDd.uniqueAudience) : '-');
      $pageContainer.find('[data-ma-audience-competitor]').html(stateDd.uniqueAudienceCompetitor ? addCommas(stateDd.uniqueAudienceCompetitor) : '-');
      $pageContainer.find('[data-ma-gap-compare]').html(stateDd.uniqueAudienceGap ? addCommas(stateDd.uniqueAudienceGap) : '-');

      $pageContainer.find('[data-ma-visits]').html(stateDd.visitors ? addCommas(stateDd.visitors) : '-');
      $pageContainer.find('[data-ma-visits-competitor]').html(stateDd.visitorsCompetitor ? addCommas(stateDd.visitorsCompetitor) : '-');
      $pageContainer.find('[data-ma-gap-compare-two]').html(stateDd.visitorsGap ? addCommas(stateDd.visitorsGap) : '-');

      $pageContainer.find('[data-ma-exclusive]').html(stateDd.appLaunches ? addCommas(stateDd.appLaunches) : '-');
      $pageContainer.find('[data-ma-exclusive-competitor]').html(stateDd.appLaunchesCompetitor ? addCommas(stateDd.appLaunchesCompetitor) : '-');

      $pageContainer.find('[data-ma-disclaimer]').html(stateDd.disclaimers);
    } else {
      $value = defaultState;
      $pageContainer.find('[data-ma-audience]').html(defaultData.uniqueAudience ? addCommas(defaultData.uniqueAudience) : '-');
      $pageContainer.find('[data-ma-audience-competitor]').html(defaultData.uniqueAudienceCompetitor ? addCommas(defaultData.uniqueAudienceCompetitor) : '-');
      $pageContainer.find('[data-ma-gap-compare]').html(defaultData.uniqueAudienceGap ? addCommas(defaultData.uniqueAudienceGap) : '-');

      $pageContainer.find('[data-ma-visits]').html(defaultData.visitors ? addCommas(defaultData.visitors) : '-');
      $pageContainer.find('[data-ma-visits-competitor]').html(defaultData.visitorsCompetitor ? addCommas(defaultData.visitorsCompetitor) : '-');
      $pageContainer.find('[data-ma-gap-compare-two]').html(defaultData.visitorsGap ? addCommas(defaultData.visitorsGap) : '-');

      $pageContainer.find('[data-ma-exclusive]').html(defaultData.appLaunches ? addCommas(defaultData.appLaunches) : '-');
      $pageContainer.find('[data-ma-exclusive-competitor]').html(defaultData.appLaunchesCompetitor ? addCommas(defaultData.appLaunchesCompetitor) : '-');

      $pageContainer.find('[data-ma-disclaimer]').html(defaultData.disclaimers);
    }

    var $smallDropdownName = $pageContainer.find('.state-dropdown-rca .input-label');
    $smallDropdownName.text($value);
    var $dropdown = $pageContainer.find('.state-dropdown-rca .input--dropdown');
    var listHtml = ''
    
    data.overviewData.states.forEach(function(item) {
      listHtml += '<li data-value="'+item.state+'" data-dropdown>'+item.state+'</li>'
    })

    $pageContainer.find('.state-dropdown-rca #dropdown_group').html(
      '<div class="dropdown-icon"></div>' +
      '<ul>' +
        listHtml +
      '</ul>'
    );

    if ($("body").hasClass("master") || $("body").hasClass("share_online")) {
      $smallDropdownName.click(function() {
        $dropdown.toggleClass('dropdown--open');
      });
    }
    
    var $dropdownListing = $pageContainer.find('.state-dropdown-rca [data-dropdown]');

    $dropdownListing.click(function() {
      $value = $(this).closest('li').attr('data-value');
      $dropdown.toggleClass('dropdown--open');
      Bridge.Event.trigger('master:' + $pageContainer + 'state-update-rca', {instance: $value});
    });

    // Bridging events for client
    Bridge.Event.on('client:fetch-' + $pageContainer + '-state', function() {
      Bridge.Event.trigger('master:' + $pageContainer + '-update', {instance: $value});
    });

    Bridge.Event.on('master:' + $pageContainer + 'state-update-rca', function (state) {

      var stateData = data.overviewData.states.find(function(item) {
        return item.state === state.instance
      })

      $smallDropdownName.text(stateData.state);

      console.log()

      $pageContainer.find('[data-ma-audience]').html(stateData.uniqueAudience ? addCommas(stateData.uniqueAudience) : '-');
      $pageContainer.find('[data-ma-audience-competitor]').html(stateData.uniqueAudienceCompetitor ? addCommas(stateData.uniqueAudienceCompetitor) : '-');
      $pageContainer.find('[data-ma-gap-compare]').html(stateData.uniqueAudienceGap ? addCommas(stateData.uniqueAudienceGap) : '-');

      $pageContainer.find('[data-ma-visits]').html(stateData.visitors ? addCommas(stateData.visitors) : '-');
      $pageContainer.find('[data-ma-visits-competitor]').html(stateData.visitorsCompetitor ? addCommas(stateData.visitorsCompetitor) : '-');
      $pageContainer.find('[data-ma-gap-compare-two]').html(stateData.visitorsGap ? addCommas(stateData.visitorsGap) : '-');

      $pageContainer.find('[data-ma-exclusive]').html(stateData.appLaunches ? addCommas(stateData.appLaunches) : '-');
      $pageContainer.find('[data-ma-exclusive-competitor]').html(stateData.appLaunchesCompetitor ? addCommas(stateData.appLaunchesCompetitor) : '-');

      $pageContainer.find('[data-ma-disclaimer]').html(stateData.disclaimers);

      resetDropdown(stateData);

      Bridge.Context.set('state_dropdown-2-rca' + slide, stateData);
    });
  }


	this.init();
};
