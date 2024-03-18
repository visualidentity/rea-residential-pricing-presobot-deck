function productPerformanceRenderCallback($pageContainer) {
	var renderFunction = this;
	var $elems = $pageContainer.find("[data-listing-stat]");

	this.renderData = function(data, type, channel) {
		if (data.items.length > 0) {
			var propertyType = _.findIndex(
				data.items[0].years[0].initialDepthItems,
				function(o) {
					return o.propertyType.toLowerCase() === type.toLowerCase();
				}
			);
			console.log('propertyType: ', propertyType);
			if (propertyType < 0) {
				renderFunction.renderMissingStats();
				return;
			}

			// depthItem = data.items[0].years[0].initialDepthItems[propertyType].initialDepthValues;
			_.forEach($elems, function(item, index) {
				var type = $(item).attr("data-value");
				var depthItem = _.where(
					data.items[0].years[0].initialDepthItems[propertyType]
						.initialDepthValues,
					{ initialDepth: type }
				);
				
				var dataTitle, dataListing, dataPrice, dataDays, dataShare;
				if (typeof depthItem[0] !== typeof undefined) {

					dataTitle = depthItem[0].initialDepth;

          if (depthItem[0].newListings && depthItem[0].newListings.toString() !== '0') {
					  dataListing = depthItem[0].newListings;
          } else {
            dataListing = "-";
          }

          if (depthItem[0].shareOfListings && depthItem[0].shareOfListings.toString() !== '0') {
					  dataShare = (depthItem[0].shareOfListings > 1 ? Math.floor(depthItem[0].shareOfListings) : depthItem[0].shareOfListings) + '%';
          } else {
            dataShare = '-'
          }

          if (depthItem[0].medianSoldPrice && depthItem[0].medianSoldPrice.toString() !== '0') {
					  dataPrice = "$" + addCommas(depthItem[0].medianSoldPrice);
          } else {
            dataPrice = "-";
          }

          if (depthItem[0].medianDaysOnSite && depthItem[0].medianDaysOnSite.toString() !== '0') {
            dataDays = depthItem[0].medianDaysOnSite;
          } else {
            dataDays = "-";
          }
          
				} else {
					dataListing = "-";
					dataPrice = "-";
					dataDays = "-";
				}

				var values = $(item).find(".listing-stat__value");
				var titles = $(item).find(".listing-stat__title");
				if (channel === "Buy") {
					$(titles[2]).html("Average Sold Price");
				} else {
					$(titles[2]).html("Average Weekly Rent");
				}

				$(values[0]).html(dataListing);
				$(values[1]).html(dataShare);
				$(values[2]).html(dataPrice);
				$(values[3]).html(dataDays);
			});
		} else {
			renderFunction.renderMissingStats();
		}
	};
	this.renderMissingStats = function() {
		_.forEach($elems, function(item, index) {
			var dataTitle, dataListing, dataPrice, dataDays;
			dataListing = "-";
			dataPrice = "-";
			dataDays = "-";
			var values = $(item).find(".listing-stat__value");
			$(values[0]).html(dataListing);
			$(values[1]).html(dataPrice);
			$(values[2]).html(dataDays);
		});
	};
}
