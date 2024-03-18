function SuburbBar(suburbs, $pageContainer) {
	this.suburbs = suburbs;
	var $elem, $controls;
	// Index for the suburb pagination
	this.controlIndex = 0;

	// Amount of suburbs to show for each chunk
	this.suburbsPerPage = 5;

	var bar = this;
	var client = $("body").hasClass("client") ? true : false;

	function _init() {
		$elem = $pageContainer.find('[data-suburb-bar-suburbs]');
		$controls = $pageContainer.find('.suburb-bar-new__controls');
		renderSuburbBar(bar.suburbs, bar.controlIndex);
		if (client) {
			_bindMasterEvents();
		} else {
			_bindControlBarEvents();
		}
	}

	// Renders a chunk of the suburbs to the suburb bar
	function renderSuburbBar(suburbs, index) {
		var suburbTree = [];

		if (!client) {
			Bridge.Event.trigger('renderSuburbs', {
				suburbs: suburbs,
				index: index
			});
		}
		var suburbsCluster = chunkArray(suburbs, bar.suburbsPerPage);

		_.forEach(suburbsCluster[index], function (item) {
			var suburb = $('<span class="suburb-bar__item" data-suburb="' + item + '">');
			suburb.html(item.toLowerCase());
			suburbTree.push(suburb);
		});

		$controls.find('.suburb-bar__counter').html((index + 1) + '/' + suburbsCluster.length);

		if (suburbTree.length === 0) {
			$controls.addClass('hidden');
			suburbTree.push($('<span class="suburb-bar__default">(All suburbs)</span>'));
		} else {
			$controls.removeClass('hidden');
		}
		$elem.html(suburbTree);

		// Bind events for newly added suburbs elements
		_bindEvents();
	}

	// Binds events for added suburb item
	function _bindEvents() {
		$('.suburb-bar__item').on('click', function (e) {
			var suburb = $(this).attr('data-suburb');
			bar.removeSuburb(suburb);
		});
	}

	// Binds events for the whole bar
	function _bindControlBarEvents() {
		$controls.on('click', function (e) {
			var direction = $(e.target).data('dir');
			var length = chunkArray(bar.suburbs, bar.suburbsPerPage).length;
			if (direction === 'next') {
				if (bar.controlIndex < length - 1) {
					bar.controlIndex++;
				} else {
					bar.controlIndex = 0;
				}
				renderSuburbBar(bar.suburbs, bar.controlIndex);
			} else if (direction === 'prev') {
				if (bar.controlIndex > 0) {
					bar.controlIndex--;
				} else {
					bar.controlIndex = length - 1;
				}
				renderSuburbBar(bar.suburbs, bar.controlIndex);
			}
		});
	}

	// Binds events for telepreso
	function _bindMasterEvents() {
		Bridge.Event.on("renderSuburbs", function (data) {
			renderSuburbBar(data.suburbs, data.index);
		});

	}

	// Adds a suburb
	this.addSuburb = function (suburb) {
		if (bar.suburbs.indexOf(suburb) === -1) {
			bar.suburbs.push(suburb);
			renderSuburbBar(bar.suburbs, bar.controlIndex);
		}
	}

	// Replaces the entire suburbs array with new suburbs
	this.replaceSuburbs = function (suburbs) {
		bar.suburbs = suburbs;
		renderSuburbBar(bar.suburbs, bar.controlIndex);
	}

	// Removes an individual suburb from the list
	this.removeSuburb = function (suburb) {
		var suburbIndex = bar.suburbs.indexOf(suburb);
		if (suburbIndex > -1) {
			bar.suburbs.splice(suburbIndex, 1);
			var length = chunkArray(bar.suburbs, bar.suburbsPerPage).length;
			if (bar.controlIndex > length - 1 && length > 0) {
				bar.controlIndex = length - 1;
			}
			renderSuburbBar(bar.suburbs, bar.controlIndex);
			$elem.trigger('remove-suburb');
		}
	}

	// Returns an object with list of suburbs plus the strings to use in API query.
	this.getSuburbObject = function () {
		var suburbs = '';
		var postcodes = '';
		_.forEach(bar.suburbs, function (item) {
			var splitString = item.split(',');
			suburbs = suburbs.length === 0 ? splitString[0] : suburbs + '--' + splitString[0];
			postcodes = postcodes.length === 0 ? splitString[1].trim() : postcodes + '--' + splitString[1].trim();
		});
		return {
			suburbsString: suburbs,
			postcodesString: postcodes,
			suburbs: bar.suburbs
		};
	}

	_init();
}
