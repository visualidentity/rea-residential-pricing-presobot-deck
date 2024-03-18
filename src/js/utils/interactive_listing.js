var initListings = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom;
	dom = options.slide;
	var hirarchyClasses = 'listing-hirarchy-1 listing-hirarchy-2 listing-hirarchy-3 listing-hirarchy-4';
	var $listing = dom.find(".listing");
	var $listing0 = dom.find(".listing-0");
	var $listing1 = dom.find(".listing-1");
	var $listing2 = dom.find(".listing-2");
	var $listing3 = dom.find(".listing-3");
	var $listing4 = dom.find(".listing-4");
	var $button = dom.find(".button");

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

    function expandListing(attr) {
		$listing.removeClass(hirarchyClasses);

		if (".listing-" + attr == ".listing-0") {
			$listing0.addClass("listing-fade");
			$listing1.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing2.addClass("listing-hirarchy listing-hirarchy-2").removeClass("listing-fade");
			$listing3.addClass("listing-hirarchy listing-hirarchy-3").removeClass("listing-fade");
			$listing4.addClass("listing-hirarchy listing-hirarchy-4").removeClass("listing-fade");
		} else if (".listing-" + attr == ".listing-1") {
			$listing0.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing1.addClass("listing-fade");
			$listing2.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing3.addClass("listing-hirarchy listing-hirarchy-2").removeClass("listing-fade");
			$listing4.addClass("listing-hirarchy listing-hirarchy-3").removeClass("listing-fade");
		} else if (".listing-" + attr == ".listing-2") {
			$listing0.addClass("listing-hirarchy listing-hirarchy-2").removeClass("listing-fade");
			$listing1.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing2.addClass("listing-fade");
			$listing3.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing4.addClass("listing-hirarchy listing-hirarchy-2").removeClass("listing-fade");
		} else if (".listing-" + attr == ".listing-3") {
			$listing0.addClass("listing-hirarchy listing-hirarchy-3").removeClass("listing-fade");
			$listing1.addClass("listing-hirarchy listing-hirarchy-2").removeClass("listing-fade");
			$listing2.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing3.addClass("listing-fade");
			$listing4.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
		} else if (".listing-" + attr == ".listing-4") {
			$listing0.addClass("listing-hirarchy listing-hirarchy-4").removeClass("listing-fade");
			$listing1.addClass("listing-hirarchy listing-hirarchy-3").removeClass("listing-fade");
			$listing2.addClass("listing-hirarchy listing-hirarchy-2").removeClass("listing-fade");
			$listing3.addClass("listing-hirarchy listing-hirarchy-1").removeClass("listing-fade");
			$listing4.addClass("listing-fade");
		}
    }

	function _bindMasterEvents() {
		$button.click(function(e) {
			attr = $(this).attr('tabindex');
			Bridge.Event.trigger('master:expand-listing', {attr: attr});
			expandListing(attr);
		});

		Bridge.Event.on("client:fetch-listing-state", function() {
			Bridge.Event.trigger("master:expand-listing", {attr: attr});
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-listing-state");
        Bridge.Event.on("master:expand-listing", function (data) {
            console.log(attr);
            expandListing(data.attr);
        });
    }
};
