function youVsMarketNewRenderCallback($pageContainer, agency) {
	var renderFunction = this;
	var $elems = $pageContainer.find("[data-m-comparison]");
	var $stats = $pageContainer.find(".stat-new");
	this.renderData = function(data, dropdownSelection, channel) {
		var sourceDate = $('.date-range .input-label', $pageContainer).text();
		$('[data-sourceDate]', $pageContainer).text(sourceDate);

		if (data.items.length > 0) {
			var propertyType = _.findIndex(
				data.items[0].years[0].youVsMarket,
				function(o) {
					return o.propertyType === dropdownSelection;
				}
			);
			if (propertyType < 0) {
				renderFunction.renderMissingStats();
				return;
			}
			var depthItem = data.items[0].years[0].youVsMarket[propertyType];

			if (agency) {

				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value", depthItem.shareOfListings &&  depthItem.shareOfListings.you ? Math.round(depthItem.shareOfListings.you) : '');
				$($elems[0])
					.find(".pie__stat--two")
					.attr("data-value", depthItem.shareOfListings &&  depthItem.shareOfListings.you ? Math.round(100 - depthItem.shareOfListings.you) : '');
				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-number", depthItem.shareOfListings.youNumber);
				$($elems[0])
					.find(".pie__stat--one")
					.attr(
						"data-value-total",
						depthItem.shareOfListings.marketNumber
					);

				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-string", " listed");
				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-string-two", " properties");
				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value",  depthItem.shareOfSoldOrLeasedListings &&  depthItem.shareOfSoldOrLeasedListings.you ? Math.round(depthItem.shareOfSoldOrLeasedListings.you) : '');
				$($elems[1])
					.find(".pie__stat--two")
					.attr("data-value",  depthItem.shareOfSoldOrLeasedListings &&  depthItem.shareOfSoldOrLeasedListings.you ? Math.round(100 - depthItem.shareOfSoldOrLeasedListings.you) : '');
				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value-number", depthItem.shareOfSoldOrLeasedListings ? depthItem.shareOfSoldOrLeasedListings.youNumber : '');
				$($elems[1])
					.find(".pie__stat--one")
					.attr(
						"data-value-total",
						depthItem.shareOfSoldOrLeasedListings ? depthItem.shareOfSoldOrLeasedListings.marketNumber : ''
					);

				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value-string", " listed");
				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value-string-two", " properties");

				$($elems[2])
					.find(".chart__bar--one")
					.attr("data-value", depthItem.avgEmailEnquiries ? depthItem.avgEmailEnquiries.you : '');
				$($elems[2])
					.find(".chart__bar--two")
					.attr("data-value", depthItem.avgEmailEnquiries ? depthItem.avgEmailEnquiries.market : '');

				$($elems[3])
					.find(".chart__bar--one")
					.attr("data-value", depthItem.daysOnSite ? depthItem.daysOnSite.you : '');
				$($elems[3])
					.find(".chart__bar--two")
					.attr("data-value", depthItem.daysOnSite ? depthItem.daysOnSite.market : '');


				if (channel.toLowerCase() === 'rent' && depthItem.IREBookings) {
					$($elems[4])
						.find(".chart__bar--one")
						.attr("data-value", depthItem.IREBookings.you);
					$($elems[4])
						.find(".chart__bar--two")
						.attr("data-value", depthItem.IREBookings.market);
				} else if (channel.toLowerCase() === 'buy' && depthItem.avgProfileEnquiries) {
					$($elems[4])
						.find(".chart__bar--one")
						.attr("data-value", depthItem.avgProfileEnquiries.you);
					$($elems[4])
						.find(".chart__bar--two")
						.attr("data-value", depthItem.avgProfileEnquiries.market);
				}

			_.forEach($elems, function(item, index) {
				var type = $(item).attr("data-pie-chart");
				if (typeof type !== typeof undefined && type !== false) {
					_renderPieChart(item)
				} else {
					_renderBarChart(item);
				}
			});


			} else {
			$($elems[0])
				.find(".chart__bar--one")
				.attr("data-value", depthItem.daysOnSite.you);
			$($elems[0])
				.find(".chart__bar--two")
				.attr("data-value", depthItem.daysOnSite.market);

			$($elems[1])
				.find(".chart__bar--one")
				.attr("data-value", depthItem.avgPropertyPageViews.you);
			$($elems[1])
				.find(".chart__bar--two")
				.attr("data-value", depthItem.avgPropertyPageViews.market);

			$($elems[2])
				.find(".chart__bar--one")
				.attr("data-value", depthItem.avgEmailEnquiries.you);
			$($elems[2])
				.find(".chart__bar--two")
				.attr("data-value", depthItem.avgEmailEnquiries.market);

			$($elems[3])
				.find(".pie__stat--one")
				.attr("data-value", Math.round(depthItem.shareOfViews.you));
			$($elems[3])
				.find(".pie__stat--two")
				.attr("data-value", Math.round(100 - depthItem.shareOfViews.you));
			$($elems[3])
				.find(".pie__stat--one")
				.attr("data-value-number", depthItem.shareOfViews.youNumber);
			$($elems[3])
				.find(".pie__stat--one")
				.attr("data-value-total", depthItem.shareOfViews.marketNumber);
			$($elems[3])
				.find(".pie__stat--one")
				.attr("data-value-string", " had total views of");
			$($elems[3])
				.find(".pie__stat--one")
				.attr("data-value-string-two", " property views");

			$($elems[4])
				.find(".pie__stat--one")
				.attr("data-value", Math.round(depthItem.shareOfListings.you));
			$($elems[4])
				.find(".pie__stat--two")
				.attr("data-value", Math.round(100 - depthItem.shareOfListings.you));
			$($elems[4])
				.find(".pie__stat--one")
				.attr("data-value-number", depthItem.shareOfListings.youNumber);
			$($elems[4])
				.find(".pie__stat--one")
				.attr(
					"data-value-total",
					depthItem.shareOfListings.marketNumber
				);
			$($elems[4])
				.find(".pie__stat--one")
				.attr("data-value-string", " listed");
			$($elems[4])
				.find(".pie__stat--one")
				.attr("data-value-string-two", " properties");

			$($elems[5])
				.find(".chart__bar--one")
				.attr("data-value", depthItem.medianSoldPrice.you);
			$($elems[5])
				.find(".chart__bar--two")
				.attr("data-value", depthItem.medianSoldPrice.market);

			$($stats[0])
				.find(".stat-new-number")
				.html(addCommas(depthItem.totalPropertyPageViews));
			$($stats[1])
				.find(".stat-new-number")
				.html(addCommas(depthItem.totalNewListings));
			$($stats[2])
				.find(".stat-new-number")
				.html(addCommas(depthItem.totalEmailEnquiries));
			$($stats[3])
				.find(".stat-new-number")
				.html(addCommas(depthItem.totalPhoneReveals));
			$($stats[4])
				.find(".stat-new-number")
				.html(addCommas(depthItem.totalListingsSold));

			_.forEach($elems, function(item, index) {
				var type = $(item).attr("data-pie-chart");
				typeof type !== typeof undefined && type !== false
					? _renderPieChart(item)
					: _renderBarChart(item);
			});
			}
		} else {
			renderFunction.renderMissingStats();
		}
	};
	this.renderMissingStats = function() {

		if (agency) {
				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value", 0);
				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-number", 0);
				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-total", 0 );

				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-string", " listed");
				$($elems[0])
					.find(".pie__stat--one")
					.attr("data-value-string-two", " properties");

				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value", 0);
				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value-number", 0);
				$($elems[1])
					.find(".pie__stat--one")
					.attr("data-value-total", 0);

				$($elems[2])
					.find(".chart__bar--one")
					.attr("data-value", 0);
				$($elems[2])
					.find(".chart__bar--two")
					.attr("data-value", 0);

				$($elems[3])
					.find(".chart__bar--one")
					.attr("data-value", 0);
				$($elems[3])
					.find(".chart__bar--two")
					.attr("data-value", 0);

				$($elems[4])
					.find(".chart__bar--one")
					.attr("data-value", 0);
				$($elems[4])
					.find(".chart__bar--two")
					.attr("data-value", 0);

		} else {
			$($elems[0])
				.find(".chart__bar--one")
				.attr("data-value", 0);
			$($elems[0])
				.find(".chart__bar--two")
				.attr("data-value", 0);

			$($elems[1])
				.find(".chart__bar--one")
				.attr("data-value", 0);
			$($elems[1])
				.find(".chart__bar--two")
				.attr("data-value", 0);

			$($elems[2])
				.find(".chart__bar--one")
				.attr("data-value", 0);
			$($elems[2])
				.find(".chart__bar--two")
				.attr("data-value", 0);

			$($elems[3])
				.find(".pie__stat--one")
				.attr("data-value", 0);

			$($elems[4])
				.find(".pie__stat--one")
				.attr("data-value", 0);

			$($elems[5])
				.find(".chart__bar--one")
				.attr("data-value", 0);
			$($elems[5])
				.find(".chart__bar--two")
				.attr("data-value", 0);

			$($stats[0])
				.find(".stat-new-number")
				.html(0);
			$($stats[1])
				.find(".stat-new-number")
				.html(0);
			$($stats[2])
				.find(".stat-new-number")
				.html(0);
			$($stats[3])
				.find(".stat-new-number")
				.html(0);
			$($stats[4])
				.find(".stat-new-number")
				.html(0);
		}

		_.forEach($elems, function(item, index) {
			var type = $(item).attr("data-pie-chart");
			typeof type !== typeof undefined && type !== false
				? _renderPieChart(item)
				: _renderBarChart(item);
		});
	};

	function _renderPieChart(item) {
		var value = parseInt(
			$(item)
				.find(".pie__stat--one")
				.attr("data-value")
		);
		$(item)
			.find(".pie__stat--one")
			.html(
				$(item)
					.find(".pie__stat--one")
					.attr("data-value") + "%"
			);
		$(item)
			.find(".pie__stat--two")
			.html(
				$(item)
					.find(".pie__stat--two")
					.attr("data-value") + "%"
			);
		$(item)
			.find(".info-text")
			.html(
				"Your agency " +
					$(item)
						.find(".pie__stat--one")
						.attr("data-value-string") +
					" " +
					addCommas(
						$(item)
							.find(".pie__stat--one")
							.attr("data-value-number")
					) +
					" out of " +
					addCommas(
						$(item)
							.find(".pie__stat--one")
							.attr("data-value-total")
					) +
					$(item)
						.find(".pie__stat--one")
						.attr("data-value-string-two")
			);
		var emptySpace = 100 - value;
		var pieValues = {
			other: value,
			profile_completion: emptySpace
		};
		$(item)
			.find(".pie-chart-container")
			.html(createPieChart(pieValues, []));
	}

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
}

