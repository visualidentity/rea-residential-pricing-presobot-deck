var autocompleteLocations = function(value) {
	var locations = Bridge.Feed.get("locations").raw();

	if (locations) {
		var subset = _.filter(locations, function(o) {
			return o.locationAlias.indexOf(value.toUpperCase()) !== -1;
		});

		var results = _.map(subset, function(item) {
			var suburb = item.locationAlias.substring(
				item.locationAlias.indexOf("-") + 1,
				item.locationAlias.lastIndexOf("-")
			);
			var postcode = item.locationAlias.substring(
				item.locationAlias.lastIndexOf("-") + 1
			);
			return {
				suburb: suburb,
				postcode: postcode,
				locationAlias: item.locationAlias,
				id: item.locationId,
				listingsRent: item.listingsRent,
				listingsBuy: item.listingsBuy
			};
		});
		results = _.sortBy(results, ["suburb"]);

		return results;
	} else {
		return [];
	}
};

var autocompletePackages = function(value) {
	var packages = Bridge.Feed.get("packages").raw();

	if (packages) {
		var subset = _.filter(packages, function(o) {
			return (
				o.displayName.toLowerCase().indexOf(value.toLowerCase()) !== -1
			);
		});

		var results = _.map(subset, function(item) {
			return { name: item.displayName, id: item.id };
		});

		//results = _.sortBy(results, ['name']);

		return results;
	} else {
		return [];
	}
};
