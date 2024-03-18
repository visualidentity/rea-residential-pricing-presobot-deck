function performanceOverTimeNewRenderCallback($pageContainer) {
	var renderFunction = this;
	var $elems = $pageContainer.find('[data-m-comparison]');
	var $stats = $pageContainer.find('.stat-new');
	this.renderData = function(data, dropdownSelection, channel) {
		if(data.items.length > 0) {
			var propertyType = _.findIndex(data.items[0].yourPerformanceOverTime, function(o) {return o.propertyType === dropdownSelection});
			if (propertyType < 0) {
				renderFunction.renderMissingStats();
				return;
			}
			var depthItem = data.items[0].yourPerformanceOverTime[propertyType];
			$($elems[0]).find('.chart__bar--one').attr('data-value', depthItem.daysOnSite[0].value);
			$($elems[0]).find('.chart__bar--two').attr('data-value', depthItem.daysOnSite[1].value);

			$($elems[1]).find('.chart__bar--one').attr('data-value', depthItem.avgPropertyPageViews[0].value);
			$($elems[1]).find('.chart__bar--two').attr('data-value', depthItem.avgPropertyPageViews[1].value);

			$($elems[2]).find('.chart__bar--one').attr('data-value', depthItem.avgEmailEnquiries[0].value);
			$($elems[2]).find('.chart__bar--two').attr('data-value', depthItem.avgEmailEnquiries[1].value);

			$($elems[3]).find('.chart__bar--one').attr('data-value', depthItem.shareOfViews[0].value);
			$($elems[3]).find('.chart__bar--two').attr('data-value', depthItem.shareOfViews[1].value);
			$($elems[3]).find('.chart__bar--one').attr('data-value-number', depthItem.shareOfViews[0].youNumber);
			$($elems[3]).find('.chart__bar--one').attr('data-value-string', ' had total views of');
			$($elems[3]).find('.chart__bar--one').attr('data-value-string-two', ' property views');
			$($elems[3]).find('.chart__bar--one').attr('data-value-total', depthItem.shareOfViews[0].marketNumber);
			$($elems[3]).find('.chart__bar--two').attr('data-value-number', depthItem.shareOfViews[1].youNumber);
			$($elems[3]).find('.chart__bar--two').attr('data-value-total', depthItem.shareOfViews[1].marketNumber);

			$($elems[4]).find('.chart__bar--one').attr('data-value', depthItem.shareOfListings[0].value);
			$($elems[4]).find('.chart__bar--two').attr('data-value', depthItem.shareOfListings[1].value);
			$($elems[4]).find('.chart__bar--one').attr('data-value-number', depthItem.shareOfListings[0].youNumber);
			$($elems[4]).find('.chart__bar--one').attr('data-value-total', depthItem.shareOfListings[0].marketNumber);
			$($elems[4]).find('.chart__bar--two').attr('data-value-number', depthItem.shareOfListings[1].youNumber);
			$($elems[4]).find('.chart__bar--two').attr('data-value-total', depthItem.shareOfListings[1].marketNumber);
			$($elems[4]).find('.chart__bar--one').attr('data-value-string', ' listed');
			$($elems[4]).find('.chart__bar--one').attr('data-value-string-two', ' properties');

			$($elems[5]).find('.chart__bar--one').attr('data-value', depthItem.medianSoldPrice[0].value);
			$($elems[5]).find('.chart__bar--two').attr('data-value', depthItem.medianSoldPrice[1].value);

			$($stats[0]).find('.stat-new-number').html( addCommas(depthItem.totalPropertyPageViews));
			$($stats[1]).find('.stat-new-number').html( addCommas(depthItem.totalNewListings));
			$($stats[2]).find('.stat-new-number').html( addCommas(depthItem.totalEmailEnquiries));
			$($stats[3]).find('.stat-new-number').html( addCommas(depthItem.totalPhoneReveals));
			$($stats[4]).find('.stat-new-number').html( addCommas(depthItem.totalListingsSold));

			_.forEach($elems, function(item, index) {
				var type = $(item).attr('data-pie-chart');
				typeof type !== typeof undefined && type !== false ? _renderPieChart(item) : _renderBarChart(item);
			});
		}
		else {
			renderFunction.renderMissingStats();
		}


	}

	function _renderBarChart(item) {
		var $elemOne = $(item).find('.chart__bar--one');
		var $elemTwo = $(item).find('.chart__bar--two');
		var valueOne = parseInt($elemOne.attr('data-value'), 10);
		var valueTwo = parseInt($elemTwo.attr('data-value'), 10);
		var stringOne = '<p>' + 'For the period selected ' + $elemOne.attr('data-value-string') + ' ' + addCommas($($elemOne).attr('data-value-number')) + ' out of ' + addCommas($($elemOne).attr('data-value-total')) +  $($elemOne).attr('data-value-string-two') + '</p>';
		var stringTwo = '<p>' + 'In the previous 12 months, your agency ' + $elemOne.attr('data-value-string') + ' ' + addCommas($($elemTwo).attr('data-value-number')) + ' out of ' + addCommas($($elemTwo).attr('data-value-total')) +  $($elemOne).attr('data-value-string-two') + '</p>';
		$(item).find('.info-text').html( stringOne +  stringTwo);
		if (valueOne > valueTwo) {
			$elemTwo.removeClass('full');
			$elemOne.addClass('full');
			var barWidth = 114 * (valueTwo / valueOne * 100) / 100;
			$elemTwo.css('width', barWidth || 0);
		}
		else if (valueOne == 0 && valueTwo == 0) {
			$elemOne.removeClass('full');
			$elemTwo.removeClass('full');
			$elemOne.css('width', barWidth || 0);
			$elemTwo.css('width', barWidth || 0);
		}
		else {
			$elemOne.removeClass('full');
			$elemTwo.addClass('full');
			var barWidth = 114 * (valueOne / valueTwo * 100) / 100;
			$elemOne.css('width', barWidth || 0);
		}
		var currency = $elemOne.attr('data-currency');
		var prefix = typeof currency !== typeof undefined && currency !== false ? '$' : '';
		var percentile = $elemOne.attr('data-percentile');
		var postfix = typeof percentile !== typeof undefined && percentile !== false ? '%' : '';
		$elemOne.attr('data-value', prefix + addCommas(valueOne) + postfix);
		$elemTwo.attr('data-value', prefix + addCommas(valueTwo) + postfix);
	}

	function _renderPieChart(item) {
		var value = parseInt($(item).find('.pie__stat--one').attr('data-value'));
		$(item).find('.pie__stat--one').html($(item).find('.pie__stat--one').attr('data-value') + '%');
		var emptySpace = 100 - value;
		var pieValues =
			{
				other: value,
				profile_completion: emptySpace
			}
			$(item).find('.pie-chart-container').html(createPieChart(pieValues, []))
	}

	this.renderMissingStats = function() {
		$($elems[0]).find('.chart__bar--one').attr('data-value', 0);
		$($elems[0]).find('.chart__bar--two').attr('data-value', 0);

		$($elems[1]).find('.chart__bar--one').attr('data-value', 0);
		$($elems[1]).find('.chart__bar--two').attr('data-value', 0);

		$($elems[2]).find('.chart__bar--one').attr('data-value', 0);
		$($elems[2]).find('.chart__bar--two').attr('data-value', 0);

		$($elems[3]).find('.chart__bar--one').attr('data-value', 0);
		$($elems[3]).find('.chart__bar--two').attr('data-value', 0);

		$($elems[4]).find('.chart__bar--one').attr('data-value', 0);
		$($elems[4]).find('.chart__bar--two').attr('data-value', 0);

		$($elems[5]).find('.chart__bar--one').attr('data-value', 0);
		$($elems[5]).find('.chart__bar--two').attr('data-value', 0);

		$($stats[0]).find('.stat-new-number').html(0);
		$($stats[1]).find('.stat-new-number').html(0);
		$($stats[2]).find('.stat-new-number').html(0);
		$($stats[3]).find('.stat-new-number').html(0);
		$($stats[4]).find('.stat-new-number').html(0);

		_.forEach($elems, function(item, index) {
			var type = $(item).attr('data-pie-chart');
			typeof type !== typeof undefined && type !== false ? _renderPieChart(item) : _renderBarChart(item);
		});
	}
}
