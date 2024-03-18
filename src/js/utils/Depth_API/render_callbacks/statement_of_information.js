function statementOfInformationRenderCallback($pageContainer) {
	var renderFunction = this;
	var $elems = $pageContainer.find("[data-m-comparison]");
	this.renderData = function(data, type, channel) {
		var propertyType = _.findIndex(data.propertyTypes, function(o) {
			return o.propertyType === type;
		});
		if (propertyType < 0) {
			renderFunction.renderMissingStats();
			return;
		}
		var depthItem = data.propertyTypes[propertyType];
		$($elems[0])
			.find(".chart__bar--one")
			.attr("data-value", depthItem.avgSOIDownloadsPerMonth.yourAvg);
		$($elems[0])
			.find(".chart__bar--two")
			.attr("data-value", depthItem.avgSOIDownloadsPerMonth.vicAvg);
		$($elems[1])
			.find(".chart__bar--one")
			.attr("data-value", depthItem.avgActiveListingsPerMonth.yourAvg);
		$($elems[2])
			.find(".chart__bar--one")
			.attr("data-value", depthItem.avgSOIDownloadsPerListing.yourAvg);
		$($elems[2])
			.find(".chart__bar--two")
			.attr("data-value", depthItem.avgSOIDownloadsPerListing.vicAvg);

		_.forEach($elems, function(item, index) {
			var type = $(item).attr("data-pie-chart");
			typeof type !== typeof undefined && type !== false
				? _renderPieChart(item)
				: _renderBarChart(item);
		});

		_renderBarGraph(depthItem.months);
	};

	this.renderMissingStats = function() {
		$($elems[0])
			.find(".chart__bar--one")
			.attr("data-value", 0);
		$($elems[0])
			.find(".chart__bar--two")
			.attr("data-value", 0);
		$($elems[1])
			.find(".chart__bar--one")
			.attr("data-value", 0);
		$($elems[2])
			.find(".chart__bar--one")
			.attr("data-value", 0);
		$($elems[2])
			.find(".chart__bar--two")
			.attr("data-value", 0);

		_.forEach($elems, function(item, index) {
			var type = $(item).attr("data-pie-chart");
			typeof type !== typeof undefined && type !== false
				? _renderPieChart(item)
				: _renderBarChart(item);
		});
		_renderBarGraph([]);
	};

	function _renderBarChart(item) {
		var $elemOne = $(item).find(".chart__bar--one");
		var $elemTwo = $(item).find(".chart__bar--two");
		var valueOne = parseInt($elemOne.attr("data-value"), 10);
		var valueTwo = parseInt($elemTwo.attr("data-value"), 10);
		if (valueOne > valueTwo) {
			$elemTwo.removeClass("full");
			$elemOne.addClass("full");
			var barWidth = (114 * ((valueTwo / valueOne) * 100)) / 100;
			$elemTwo.css("width", barWidth || 0);
		} else if (valueOne == 0 && valueTwo == 0) {
			$elemOne.removeClass("full");
			$elemTwo.removeClass("full");
			$elemOne.css("width", barWidth || 0);
			$elemTwo.css("width", barWidth || 0);
		} else if ($elemTwo.length == 0 && valueOne > 0) {
			$elemOne.addClass("full");
		} else {
			$elemOne.removeClass("full");
			$elemTwo.addClass("full");
			var barWidth = (114 * ((valueOne / valueTwo) * 100)) / 100;
			$elemOne.css("width", barWidth || 0);
		}
		var currency = $elemOne.attr("data-currency");
		var prefix =
			typeof currency !== typeof undefined && currency !== false
				? "$"
				: "";
		$elemOne.attr("data-value", prefix + addCommas(valueOne));
		$elemTwo.attr("data-value", prefix + addCommas(valueTwo));
	}

	function _renderBarGraph(data) {
		var $container = $pageContainer.find("[data-m-graph-container]");
		var points = [];
		var maxHeight = 0;
		var maxHeightPixel = 326;
		var graphItem = _.template(
			'<div class="multi-chart__item" data-m-graph-stat><span class="item__key"><%= key %></span><div class="item__stat item__stat--one" data-value="<%= valueOne %>"></div><div class="item__stat item__stat--two" data-value="<%= valueTwo %>"></div><div class="item__stat__values"><span class="item__stat__value item__stat__value--one"><%= valueOne %></span><span class="item__stat__value item__stat__value--two"><%= valueTwo %></span></div></div>'
		);
		_.forEach(data, function(item) {
			if (item.yourAvg > maxHeight) {
				maxHeight = item.yourAvg;
			}
			if (item.vicAvg > maxHeight) {
				maxHeight = item.vicAvg;
			}
			points.push(
				graphItem({
					key: item.month,
					valueOne: item.yourAvg,
					valueTwo: item.vicAvg
				})
			);
		});
		$container.html(points);
		_.forEach($container.children(), function(item) {
			var statOne = $(item)
				.find(".item__stat--one")
				.data("value");
			var statTwo = $(item)
				.find(".item__stat--two")
				.data("value");
			var valueOne = statOne / maxHeight;
			var valueTwo = statTwo / maxHeight;
			$(item)
				.find(".item__stat--one")
				.css("height");
			$(item)
				.find(".item__stat--two")
				.css("height");
			$(item)
				.find(".item__stat--one")
				.css("height", maxHeightPixel * valueOne);
			$(item)
				.find(".item__stat--two")
				.css("height", maxHeightPixel * valueTwo);
			$(item)
				.find(".item__stat__values")
				.css(
					"bottom",
					valueOne > valueTwo
						? maxHeightPixel * valueOne + 40
						: maxHeightPixel * valueTwo + 40
				);
		});
	}
}
