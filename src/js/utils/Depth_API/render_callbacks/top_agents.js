var topAgentsRenderCallBack = function($containerElem, agents, modifier) {
	var $elems;
	_init();

	function _init() {
		//Grab page variables
		$elems = $($containerElem).find(".agent-stat");
		agents;
		_renderData(agents);
	}

	function _renderData(data) {
		_renderMissingStats();
		if (data.length > 0) {
			_.forEach($elems, function(item, index) {
				var depthItem = data[index];
				if (depthItem) {
					$(item)
						.find(".agent-stat__name")
						.html(depthItem.agentName.toLowerCase());
					if (depthItem.photoURL) {
						$(item)
							.find(".agent-stat__image")
							.css(
								"background-image",
								"url(" + depthItem.photoURL + ")"
							);
					}
					var values = $(item).find(".agent-stat__value");
					$(values[0]).html(depthItem.newListings);
					$(values[1]).html(depthItem.emailEnquiries);
					$(values[2]).html(depthItem.daysOnSite);
					var count = index + 1 + modifier * 4;
					$(item)
						.find(".agent-stat__image-container")
						.attr("data-rank", depthItem.number);
					$(item)
						.find(".agent-stat__image-container")
						.addClass("agent-stat__image-container--has-rank");
				}
			});
		} else {
			_renderMissingStats();
		}
	}

	function _renderMissingStats() {
		_.forEach($elems, function(item, index) {
			$(item)
				.find(".agent-stat__name")
				.html("");
			$(item)
				.find(".agent-stat__image")
				.attr("style", "");
			var values = $(item).find(".agent-stat__value");
			$(values[0]).html("");
			$(values[1]).html("");
			$(values[2]).html("");
		});
	}
};
