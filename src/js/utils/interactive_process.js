var initProcesses = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var page = 1;
	var pages = 2;
	var attr, dom;
	dom = options.slide;
	var $counter = dom.find(".counter");
	var $process = dom.find(".process");
	var $process1 = dom.find(".process-one");
	var $process2 = dom.find(".process-two");
	var $forwards = dom.find(".forwards");
	var $backwards = dom.find(".backwards");
	var $button = dom.find(".button");

	$counter.html("1 / "+ pages);
	// $(".process" + attr).removeClass("process-fade");

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function processSlides(page) {
		if (page === 2) {
			$counter.html("2 / 2");
			$process.removeClass("process-fade");
			$process1.removeClass("slide-one-back").addClass("slide-one-running");
			$process2.removeClass("slide-two-running").addClass("slide-two-back");
			$forwards.css("opacity", .3);
			$backwards.css("opacity", 1);
		}

		if (page === 1) {
			$counter.html("1 / 2");
			$process.removeClass("process-fade");
			$process1.removeClass("slide-one-running").addClass("slide-one-back");
			$process2.removeClass("slide-two-back").addClass("slide-two-running");
			$forwards.css("opacity", 1);
			$backwards.css("opacity", .3);
		}
	}

    function expandProcess(attr) {
		if (dom.find(".process-" + attr).hasClass("process-fade")) {
			dom.find(".process-" + attr).removeClass("process-fade");
		} else {
			$process.removeClass("process-fade");
			dom.find(".process-" + attr).toggleClass("process-fade");
		}
	}

	function _bindMasterEvents() {
		$backwards.click(function(e) {
			if (page != 1) {
				page--;
				processSlides(page);
				Bridge.Event.trigger('master:backwards-process', {page: page});
			}
		});

		$forwards.click(function(e) {
			if (page === 1) {
				page++;
				processSlides(page);
				Bridge.Event.trigger('master:forwards-process', {page: page});
			}
		});

		Bridge.Event.on("client:fetch-slide-state", function() {
			if (page != 1) {
				Bridge.Event.trigger('master:backwards-process', {page: page});
			}
			if (page === 1) {
				Bridge.Event.trigger('master:forwards-process');
			}
		});

		$button.click(function(e) {
			attr = $(this).attr('tabindex');
			Bridge.Event.trigger('master:expand-process', {attr: attr});
			expandProcess(attr);
		});

		Bridge.Event.on("client:fetch-process-state", function() {
			Bridge.Event.trigger("master:expand-process", {attr: attr});
		});
	}

	function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-slide-state");
		Bridge.Event.on("master:backwards-process", function (data) {
            processSlides(data.page);
        });
		Bridge.Event.on("master:forwards-process", function (data) {
            processSlides(data.page);
        });

		Bridge.Event.trigger("client:fetch-process-state");
        Bridge.Event.on("master:expand-process", function (data) {
            expandProcess(data.attr);
        });
	}
};
