function DateBar(dates, $pageContainer) {
	this.dates = dates;
	var $elem, $controls;
	// Index for the date pagination
	this.controlIndex = 0;

	// Amount of dates to show for each chunk
	this.datesPerPage = 5;

	var bar = this;
	var client = $("body").hasClass("client") ? true : false;

	function _init() {
		$elem = $pageContainer.find('[data-date-bar-dates]');
		$controls = $pageContainer.find('.date-bar-new__controls');
		renderDateBar(bar.dates, bar.controlIndex);
		if (client) {
			_bindMasterEvents();
		}
	}

	// Renders a chunk of the dates to the date bar
	function renderDateBar(dates, index) {
		var dateTree = [];
		console.log('dates:', dates);

		if (!client) {
			Bridge.Event.trigger('renderDates', {
				dates: dates,
				index: index
			});
		}
		var datesCluster = chunkArray(dates, bar.datesPerPage);

		_.forEach(datesCluster[index], function (item) {
			var date = $('<span class="date-bar-new__item" data-date="' + item.dateData + '">');
			date.html(item.date);
			dateTree.push(date);
		});

		// $controls.find('.date-bar__counter').html((index + 1) + '/' + datesCluster.length);

		if (dateTree.length === 0) {
			$controls.addClass('hidden');
			dateTree.push($('<span class="date-bar__default">(Default date)</span>'));
		} else {
			$controls.removeClass('hidden');
		}
		$elem.html(dateTree);

		// Bind events for newly added dates elements
		_bindEvents();
	}

	// Binds events for added date item
	function _bindEvents() {
		$('.date-bar-new__item').on('click', function (e) {
			var date = $(this).attr('data-date');
			bar.removeDate(date);
		});
	}

	// Binds events for telepreso
	function _bindMasterEvents() {
		Bridge.Event.on("renderDates", function (data) {
			renderDateBar(data.dates, data.index);
		});

	}

	// Adds a date
	this.addDate = function (date, dateData) {
		if (bar.dates.indexOf(date) === -1) {
			bar.dates.push({date, dateData});
			renderDateBar(bar.dates, bar.controlIndex);
		}
	}

	// Replaces the entire dates array with new dates
	this.replaceDates = function (dates) {
		bar.dates = dates;
		renderDateBar(bar.dates, bar.controlIndex);
	}

	// Removes an individual date from the list
	this.removeDate = function (date) {
		var dateIndex = bar.dates.findIndex(x => x.dateData === date);
		if (dateIndex > -1) {
			bar.dates.splice(dateIndex, 1);
			var length = chunkArray(bar.dates, bar.datesPerPage).length;
			if (bar.controlIndex > length - 1 && length > 0) {
				bar.controlIndex = length - 1;
			}
			renderDateBar(bar.dates, bar.controlIndex);
			$elem.trigger('remove-date');
		}
	}

	// Returns an object with list of dates plus the strings to use in API query.
	this.getDateObject = function () {
		var dates = '';
		_.forEach(bar.dates, function (item) {
			var splitString = item.date.split(',');
			dates = dates.length === 0 ? splitString[0] : dates + '--' + splitString[0];
		});
		return {
			datesString: dates,
			dates: bar.dates
		};
	}

	_init();
}
