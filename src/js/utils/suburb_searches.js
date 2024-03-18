suburbSearches = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom, api, buyData, rentData;
	dom = options.slide;
	api = options.api;
	buyData = api.sections.Buy.data;
	rentData = api.sections.Rent.data;

	var dropdown = dom.find(".input--dropdown__state");
	var $buyContainer = dom.find("[data-listing-switch-buy]"),
		$rentContainer = dom.find("[data-listing-switch-rent]");

	$.each(api.sections.Buy.states, function(index, state){
		if (state === 'NSW') {
			var $nswBuy = buyData.NSW,
				$nswRent = rentData.NSW;
			populateData($buyContainer, $nswBuy, 'nsw');
			populateData($rentContainer, $nswRent, 'nsw');
		} else if (state === 'ACT') {
			var	$actBuy = buyData.ACT,
				$actRent = rentData.ACT;
			populateData($buyContainer, $actBuy, 'act');
			populateData($rentContainer, $actRent, 'act');
		} else if (state === 'QLD') {
			var	$qldBuy = buyData.QLD,
				$qldRent = rentData.QLD;
			populateData($buyContainer, $qldBuy, 'qld');
			populateData($rentContainer, $qldRent, 'qld');
		} else if (state === 'SA') {
			var	$saBuy = buyData.SA,
				$saRent = rentData.SA;
			populateData($buyContainer, $saBuy, 'sa');
			populateData($rentContainer, $saRent, 'sa');
		} else if (state === 'TAS') {
			var	$tasBuy = buyData.TAS,
				$tasRent = rentData.TAS;
			populateData($buyContainer, $tasBuy, 'tas');
			populateData($rentContainer, $tasRent, 'tas');
		} else if (state === 'VIC') {
			var	$vicBuy = buyData.VIC,
				$vicRent = rentData.VIC;
			populateData($buyContainer, $vicBuy, 'vic');
			populateData($rentContainer, $vicRent, 'vic');
		} else if (state === 'WA') {
			var	$waBuy = buyData.WA,
				$waRent = rentData.WA;
			populateData($buyContainer, $waBuy, 'wa');
			populateData($rentContainer, $waRent, 'wa');
		} else {
			var	$ntBuy = buyData.NT,
				$ntRent = rentData.NT;
			populateData($buyContainer, $ntBuy, 'nt');
			populateData($rentContainer, $ntRent, 'nt');
		}
	});
	

	function populateData($container, $currentapi, $state) {
		
		var $tableHouse = $container.find("[data-house]"),
			$tableApartment = $container.find("[data-apartments]"),
			$tableLand = $container.find("[data-land]"),
			$itemHouse = '',
			$itemApartment = '';
			$itemLand = ''; 

		$.each($currentapi.house, function(index, value){
			$itemHouse += "<li>"+value+"</li>";
		});
		$tableHouse.find("ul[data-state='"+$state+"']").html($itemHouse);
		$.each($currentapi.apartments, function(index, value){
			$itemApartment += "<li>"+value+"</li>";
		}); 
		$tableApartment.find("ul[data-state='"+$state+"']").html($itemApartment);
		$.each($currentapi.land, function(index, value){
			$itemLand += "<li>"+value+"</li>";
		}); 
		$tableLand.find("ul[data-state='"+$state+"']").html($itemLand);
	}

	function toggleState(attr) {
		dom.find("ul[data-state]").addClass("hide");
		dom.find("ul[data-state='"+attr+"']").removeClass("hide");
	}

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function _bindMasterEvents() {		
		dropdown.on('dropdown-value-changed', function (e) {
			var attr = $(this).attr('data-selected');
			Bridge.Event.trigger('master:toggle-state', {attr: attr});
			toggleState(attr.toLowerCase());
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-toggle-state");
        Bridge.Event.on("master:toggle-state", function (data) {
            toggleState(data.attr);
        });
    }
};
