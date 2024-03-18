function youVsMarketRankRenderCallback($pageContainer) {
	var renderFunction = this;
	var $elems = $pageContainer.find("[data-m-comparison]");
	var $stats = $pageContainer.find(".stat");

	this.renderData = function(data, dropdownSelection, channel) {
	var $rankingsContainer = $pageContainer.find(".agency-ranking")
	var type = $rankingsContainer.hasClass('agency-ranking--table') ? 'table' : 'regular'
		if (channel === "New") {
			$pageContainer
				.find(".icon-data-new__heading")
				.html("Number of New listings");
		} else {
			$pageContainer
				.find(".icon-data-new__heading")
				.html("Number of " + channel + " listings");
		}

		var soldLeasedText = channel.toLowerCase() === "new" ? "new" : "sold"

		$pageContainer
				.find(".agency-ranking__channel")
				.html(soldLeasedText);


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
			console.log(depthItem);
			var $ranking = $pageContainer
				.find(".icon-data-new__ranking-number")
				.get(0);
			var $numberOfListings = $pageContainer.find(".icon-data-new__value");
			var $rankings = $pageContainer.find(".agency-ranking__rankings");
			var ranking = _.template(
				'<div class="agency-ranking__ranking"><span class="ranking__number"><%= rank %></span><div class="ranking__agency"><%= name %><br/>Number of <%= channel %> listings: <span class="sold_listings"><%= listings %></span></div></div>'
			);
			var tableLikeTemplate = _.template(
				'<div class="agency-ranking__ranking<%= highlight %>">' +
					'<span class="ranking__number"><%= rank %></span>' +
					'<div class="ranking__agency"><%= name %></div>' +
					'<div class="ranking__listings"><%= listings %></div>' +
				'</div>'
			);
			var rankingsTree = [];
			var $infoBubble = $pageContainer.find(".info-text");
			var infoText = _.template(
				"Based on the number of <%= listed %>, your agency is ranked <%= rank %> out of <%= total %> agencies in your chosen market"
			);
			$infoBubble.html(
				infoText({
					rank: depthItem && depthItem.agencyRank ? depthItem.agencyRank.agencyRank: '',
					total: depthItem && depthItem.agencyRank ? depthItem.agencyRank.agencyNumberMarket : '',
					listed:
						channel === "New" ? "new listings" : "properties sold"
				})
			);
			$ranking.childNodes[0].nodeValue = depthItem && depthItem.agencyRank ? depthItem.agencyRank.agencyRank : '';
			$numberOfListings.html(depthItem && depthItem.agencyRank ? depthItem.agencyRank.agencyNumberListings : '');
				console.log('test: ', depthItem.agencyRank);
			if (depthItem && depthItem.agencyRank && depthItem.agencyRank.top5) {
				_.forEach(depthItem.agencyRank.top5, function(item, index) {
					if (type === 'table') {
						rankingsTree.push(
							tableLikeTemplate({
								rank: item.agencyRank + '.',
								name: item.agencyName,
								listings: item.numberListings,
								channel:
									channel === "New" ? "new" : channel.toLowerCase(),
								highlight:
									depthItem.agencyRank.agencyRank === item.agencyRank ? " highlight" : null
							})
						);
					} else {
						rankingsTree.push(
							ranking({
								rank: item.agencyRank + '.',
								name: item.agencyName,
								listings: item.numberListings,
								channel:
									channel === "New" ? "new" : channel.toLowerCase(),
								highlight:
									depthItem.agencyRank.agencyRank === item.agencyRank ? " highlight" : null
							})
						);
					}
				});
			}
			$rankings.html(rankingsTree);
		} else {
			renderFunction.renderMissingStats();
		}
	};
	this.renderMissingStats = function() {
		var $infoBubble = $pageContainer.find(".info-text");
		var infoText = _.template(
			"Based on the number of properties sold, your agency is ranked 0 out of 0 agencies in your chosen market"
		);
		var $ranking = $pageContainer.find(".icon-data-new__ranking-number").get(0);
		var $numberOfListings = $pageContainer.find(".icon-data-new__value");
		var $rankings = $pageContainer.find(".agency-ranking__rankings");

		$ranking.childNodes[0].nodeValue = 0;
		$numberOfListings.html(0);
		$infoBubble.html(infoText());
		$rankings.html("");
	};
}
