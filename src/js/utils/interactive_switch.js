var initSwitch = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom;
	dom = options.slide;

	var $buySwitch = dom.find('.input__tab--Buy');
	var $rentSwitch = dom.find('.input__tab--Rent');

	var $buyListing = dom.find('[data-listing-switch-buy]');
	var $rentListing = dom.find('[data-listing-switch-rent]');

	var $background = dom.find('.slide-header-quarterpage');

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function _bindMasterEvents() {
		$buySwitch.click(function(e) {
			$buySwitch.addClass('active');
			$rentSwitch.removeClass('active');

			$buyListing.css('display', 'block');
			$rentListing.css('display', 'none');

			$background.removeClass('slide-header-quarterpage-rent');

			Bridge.Event.trigger('master:buy-listing', {attr: false});
		});

		$rentSwitch.click(function(e) {
			$buySwitch.removeClass('active');
			$rentSwitch.addClass('active');

			$buyListing.css('display', 'none');
			$rentListing.css('display', 'block');

			$background.addClass('slide-header-quarterpage-rent');

			Bridge.Event.trigger('master:buy-listing', {attr: true});
		});

		Bridge.Event.on("client:fetch-listing-state", function() {
			Bridge.Event.trigger("master:expand-listing", {attr: attr});
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-listing-state");
        Bridge.Event.on("master:buy-listing", function (data) {
			if (data.attr === true) {
				$buySwitch.removeClass('active');
				$rentSwitch.addClass('active');

				$buyListing.css('display', 'none');
				$rentListing.css('display', 'block');

				$background.removeClass('slide-header-quarterpage-rent');
			} else {
				$buySwitch.addClass('active');
				$rentSwitch.removeClass('active');

				$buyListing.css('display', 'block');
				$rentListing.css('display', 'none');
				$background.addClass('slide-header-quarterpage-rent');
			}

        });
    }
};
