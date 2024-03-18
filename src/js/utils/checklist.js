var master = $("body").hasClass("master") ? true : false;
var client = $("body").hasClass("client") ? true : false;
var checklist = function($pageContainer) {
	var contextStore = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
	//Look it works ok?
	var $elem = $pageContainer.find(".checkbox_row");
	var $refresh = $pageContainer.find(
		".agent-branded-new__control-block__refresh"
	);
	contextStore = Bridge.Context.match(".checklist", contextStore);
	_init();

	function _init() {
		if (client) {
			_bindMasterEvents();
			Bridge.Event.trigger("client:getState");
		} else {
			_bindEvents();
		}

		_renderData();
	}

	function _bindEvents() {
		$($elem)
			.find(".subscription__box")
			.on("click", function(e) {
				var index = $(this)
					.parent()
					.parent()
					.attr("data-index");
				contextStore[index] === $(this).attr("data-value")
					? (contextStore[index] = -1)
					: (contextStore[index] = $(this).attr("data-value"));
				Bridge.Context.set("checklist", contextStore);
				Bridge.Event.trigger("renderChecklist", contextStore);
				_renderData();
			});

		Bridge.Event.on("client:getState", function() {
			Bridge.Event.trigger("renderChecklist", contextStore);
		});
		$refresh.on("click", function(e) {
			contextStore = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
			Bridge.Context.set("checklist", contextStore);
			_renderData();
			Bridge.Event.trigger("renderChecklist", contextStore);
		});
	}

	function _bindMasterEvents() {
		Bridge.Event.on("renderChecklist", function(context) {
			contextStore = context;
			_renderData();
		});
	}

	function _calc_pie() {
		NumberChecked = $elem.filter('[data-value="1"]').length;

		complete = Math.round((NumberChecked / 9) * 100);
		other = 100 - complete;

		var pieValues = {
			other: other,
			percentage_complete: complete
		};

		$pageContainer
			.find(".pie-chart-container")
			.html(createPieChart(pieValues, []));

		pieValues = _.mapObject(pieValues, function(val, key) {
			$pageContainer
				.find(".the-pie .keys .key[data-id=" + key + "] h3")
				.html(val + "%");
			return parseInt(val);
		});
	}

	function _renderData() {
		var $rows = $pageContainer.find(".checkbox_row");
		_.forEach($rows, function(item, index) {
			$(item).attr("data-value", contextStore[index]);
		});

		$pageContainer.find(".checkbox_row").each(function(i, val) {
			$(val)
				.find("div.subscription__box")
				.each(function(i, val) {
					$(val).addClass("subscription__box--not-checked");
				});
		});
		_calc_pie();
	}
};
