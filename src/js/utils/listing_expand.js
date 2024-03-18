var initListingExpand = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom;
	dom = options.slide;
	var $listing = dom.find(".winning-listings__card");

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function expandCard(e) {
		$(e).find('h6').toggle(function() {
			$(this).css({'height': 'auto', 'opacity': '1'});
		});

		$(e).toggleClass('is-open');
	}

	function _bindMasterEvents() {
		$listing.click(function(e) {
			var $card = this;
			expandCard($card);

			var $attr = $(this).attr('val');
			Bridge.Event.trigger('master:expand-listing', {attr: $attr});
		});

		Bridge.Event.on("client:fetch-listing-state", function() {
			Bridge.Event.trigger("master:expand-listing", {attr});
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-listing-state");
        Bridge.Event.on("master:expand-listing", function (data) {
            expandCard($listing[data.attr]);
		});
    }
};
