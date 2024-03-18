var allColumnGrids = ["full-width", "one-half", "one-quarter", "one-third", "two-thirds", "one-fifth"];

var hideAsset = function (columnGroupIndex, assetIndex) {
	var slideID = currentSlide().replace("#", "");
	var assets = getAssets();

	// If requested table exists, apply update
	if (!_.isEmpty(assets[slideID]) && !_.isEmpty(assets[slideID][columnGroupIndex])) {

		var $pageContainer = $(currentSlide());
		var $columnGroups = $pageContainer.find(".column-group--removable");
		var $assets = $($columnGroups[columnGroupIndex]).find(".column");

		var $asset = $assets[assetIndex];

		assets[slideID][columnGroupIndex][assetIndex] = false;

		// Triggered for retrieval by affected slide if required
		// eg. data update on asset removal
		Bridge.Event.trigger("master:removeAsset", slideID, assets[slideID]);

		Bridge.Event.trigger("master:updateSlideDOM", slideID, assets[slideID]);
		Bridge.Context.set("assets", assets);
	}
};

var getAssets = function () {

	var slideID = currentSlide().replace("#", "");
	var $pageContainer = $(currentSlide());

	var assets = Bridge.Context.match(".assets", {});

	// If no slide record exists, create an empty object
	if (_.isEmpty(assets[slideID])) {
		assets[slideID] = {};
	}

	var $columnGroups = $pageContainer.find(".column-group--removable");

	// Initialise each column group
	_.each($columnGroups, function (columnGroup, columnGroupIndex) {

		var $assets = $(columnGroup).find(".column");

		// If no column group record exists, create an empty array
		if (_.isEmpty(assets[slideID][columnGroupIndex])) {
			assets[slideID][columnGroupIndex] = [];
		}

		// Initialise each asset
		_.each($assets, function (asset, assetIndex) {
			// If asset does not yet exist, set state based on DOM ("inactive" class)
			var assetVisibility = assets[slideID][columnGroupIndex][assetIndex];
			if (assetVisibility !== false && assetVisibility !== true) {
				assets[slideID][columnGroupIndex][assetIndex] = !$(asset).hasClass("inactive");
			}
		});

	});

	return assets;

};

var initAssets = function () {
	var preview = $("body").hasClass("preview");

	var client = $("body").hasClass("client");
	var master = !client;

	var slideID = currentSlide().replace("#", "");
	var $pageContainer = $(currentSlide());

	// Setup Bridge events
	Bridge.Event.on("master:updateSlideDOM", function (slideID, slideObj, target) {
		var updateAsset = true;

		if (target && target === "client" && !$("body").hasClass("client")) {
			updateAsset = false;
		}

		if (updateAsset) {
			var slideTotalAssets = _.reduce(slideObj, function (totalCounter, assetCollection) {
				totalCounter += _.reduce(assetCollection, function (columnGroupCounter, assetVisibility) {
					if (assetVisibility) {
						columnGroupCounter++;
					}
					return columnGroupCounter;
				}, 0);

				return totalCounter;
			}, 0);

			var $columnGroups = $pageContainer.find(".column-group--removable");

			// looping through assets version
			_.each($columnGroups, function(columnGroup, columnGroupIndex) {
				var $assets = $(columnGroup).find(".column");
				var assetCollection = slideObj[columnGroupIndex];

				// get total spans of active columns per column group
				var spanCounter = _.reduce($assets, function (spanTotal, asset, assetIndex) {
					// If asset is visible
					if (assetCollection[assetIndex]) {
						// Get span attached to asset
						var asset = $($assets[assetIndex])[0];
						var classes = asset.className.split(" ");

						// Collect span class
						var spanValue = _.find(classes, function(className) {
							return className.indexOf("column--span-") === 0;
						});

						spanValue = parseInt(spanValue.replace("column--span-", ""));

						spanTotal += spanValue;
					}
					return spanTotal;
				}, 0);

				// Add current span total to the column group
				// Currently 15 is the max number of spans in a grid
				$(columnGroup).removeClass(incrementClasses(15, "column-group--"));
				$(columnGroup).addClass("column-group--" + spanCounter);

				// Loop over assets and turn off as required
				_.each($assets, function(asset, assetIndex) {
					var assetVisibility = assetCollection[assetIndex];

					if (assetVisibility) {
						// Set timeout to allow for smooth reintroduction
						setTimeout(function() {
							$(asset).removeClass("inactive");
						}, 5);
					} else {
						$(asset).addClass("inactive");
					}

					// Remove first-child last-child classes based on position
					// This corrects width positioning errors based on positioning
					$(asset).removeClass("first-child last-child");

					// Hide remove-btns if last asset on the slide
					if (slideTotalAssets <= 1) {
						$(asset).find(".removable-asset-btn").addClass("hidden");
					} else {
						$(asset).find(".removable-asset-btn").removeClass("hidden");
					}
				});

				// Add/remove first-child last-child classes based on position
				// This corrects width positioning errors based on positioning
				var lastIndex = (assetCollection.length - 1);

				if (!assetCollection[0]) {
					// reallocate "first-child" position
					for (var i = 0; i <= lastIndex; i++) {
						if (assetCollection[i]) {
							$($assets[i]).addClass("first-child");
							return;
						}
					}
				}

				if (!assetCollection[lastIndex]) {
					// reallocate "last-child" position
					for (var i = lastIndex; i >= 0; i--) {
						if (assetCollection[i]) {
							$($assets[i]).addClass("last-child");
							return;
						}
					}
				}
			});
		}
	});

	// master only functions
	if (master) {
		// Fetch latest assets from Context
		var assets = getAssets();

		var $columnGroups = $pageContainer.find(".column-group--removable");

		// Initialise each column group
		_.each($columnGroups, function (columnGroup, columnGroupIndex) {

			var $assets = $(columnGroup).find(".column");

			// Initialise each asset
			_.each($assets, function (asset, assetIndex) {

				// Register asset triggers
				var $assetTriggers = $(asset).find(".removable-asset-btn");

				// Remove only active when in prep/preview mode
				if (preview) {
					_.each($assetTriggers, function (assetTrigger) {
						$(assetTrigger).on("click", function () {
							// Hide all relevant assets
							hideAsset(columnGroupIndex, assetIndex);
						});
					});
				}
			});
		});

		// Update slide DOM with latest Bridge data
		Bridge.Event.trigger("master:updateSlideDOM", slideID, assets[slideID]);

		// Register reset buttons
		var $resetButtons = $pageContainer.find(".removable-refresh-btn");

		Bridge.Event.on("master:resetAssets", function() {
			// Fetch latest assets from Context
			var assets = getAssets();

			// Find relevant slide in asset object
			_.each(assets[slideID], function (columnGroupCollection, columnGroupIndex) {
				_.each(columnGroupCollection, function (assetCollection, assetIndex) {
					// set all contained asset visibility to true
					assets[slideID][columnGroupIndex][assetIndex] = true;
				});
			});

			Bridge.Event.trigger("master:updateSlideDOM", slideID, assets[slideID]);
			Bridge.Context.set("assets", assets);
		});

		// Only active when in prep/preview mode
		if (preview) {
			_.each($resetButtons, function (reset) {
				$(reset).on("click", function () {
						Bridge.Event.trigger("master:resetAssets");
				});
			});
		}

		// Receive client's request for latest assets data
		Bridge.Event.on("client:fetchAssetsState", function () {
			var assets = getAssets();

			Bridge.Event.trigger("master:updateSlideDOM", slideID, assets[slideID], "client");
		});

		// Client only functions
	} else {
		// Ensure master has completed setup before client requests state
		setTimeout(function () {
			Bridge.Event.trigger("client:fetchAssetsState");
		}, 0);
	}
}
