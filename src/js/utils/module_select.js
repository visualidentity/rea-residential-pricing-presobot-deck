var moduleSelect = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom;
	dom = options.slide;

	var $resultSelect = dom.find('[result-select]');
	$('div[result="1"]').addClass('active');

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function _bindMasterEvents() {
		$resultSelect.click(function(e) {
			$('div[result-select], .ebro_results').removeClass('active');

			var $activeResult = $(this).attr("result");
			$('div[result="' + $activeResult + '"]').addClass('active');

			Bridge.Event.trigger('master:module-select', {attr: $activeResult});
		});

		Bridge.Event.on("client:fetch-module-state", function() {
			Bridge.Event.trigger("master:module-select", {attr: attr});
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-module-state");
        Bridge.Event.on("master:module-select", function (data) {
			if (data.attr) {
				$('div[result-select], .ebro_results').removeClass('active');
				$('div[result="' + data.attr + '"]').addClass('active');
			}
        });
    }
};
