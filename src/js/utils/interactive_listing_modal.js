var initModalListings = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom;
	dom = options.slide;
	var hirarchyClasses = 'listing-hirarchy-1 listing-hirarchy-2 listing-hirarchy-3 listing-hirarchy-4';
	var $listing = dom.find(".listing-icon");

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function expandModalListing(e) {
		$('.modal[' + e + ']').show();
	}

	function _bindMasterEvents() {
		$listing.click(function(e) {
			attr = $(this).attr('data');
			Bridge.Event.trigger('master:expand-modal-listing', {attr: attr});
			expandModalListing(attr);
		});

		$('.modal-close').click(function(e) {
			$('.modal').hide();
			Bridge.Event.trigger('master:close-modal-listing');
		});

		Bridge.Event.on("client:fetch-listing-state", function() {
			Bridge.Event.trigger("master:expand-listing", {attr: attr});
			Bridge.Event.trigger('master:close-modal-listing');
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:ffetch-listing-state");
        Bridge.Event.on("master:expand-modal-listing", function (data) {
            expandModalListing(data.attr);
		});
		
		Bridge.Event.on("master:close-modal-listing", function (data) {
            $('.modal').hide();
        });
    }
};
