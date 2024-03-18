// ---------------------------------------------------//
// Comparison bubble functions -----------------------//
// ---------------------------------------------------//

// Setting up the variables ------------------------- //

window.bubbleSlides = {};

window.bubbleVars = {
	// max size for the REA mega-planet
	maxDiameter: 658,
	// Space available to the real estate galaxy
	maxGalaxy: 1440,
	// Minimum spacing between planets
	minSpacing: 28,
	// Label padding for largest 2 planets (suns)
	labelPadding: 80
}

var getBubblePerc = function(slideID) {
	if (window.bubbleSlides[slideID].totalCompetitorDiameter > window.bubbleSlides[slideID].totalPlanetArea) {
		// Calculate percentage to shrink the planets by
		return (window.bubbleSlides[slideID].totalPlanetArea / window.bubbleSlides[slideID].totalCompetitorDiameter);
	} else {
		return 1;
	}
}

var getPlanetArray = function(state) {
	var planetArray = JSON.parse(JSON.stringify(Bridge.Feed.get("competitors").raw()));

	var defaultPlanets = [
		{
			"nielsen_sa":null,
			"nielsen_nsw":null,
			"nielsen_tas":null,
			"nielsen":null,
			"nielsen_act":null,
			"nielsen_wa":null,
			"nielsen_vic":null,
			"nielsen_nt":null,
			"nielsen_qld":null,
			"date":"2016-06-01",
			"name":"reiq.com.au"
		},
		{
			"nielsen_sa":null,
			"nielsen_nsw":null,
			"nielsen_tas":null,
			"nielsen":null,
			"nielsen_act":null,
			"nielsen_wa":null,
			"nielsen_vic":null,
			"nielsen_nt":null,
			"nielsen_qld":null,
			"date":"2016-06-01",
			"name":"squiiz.com.au"
		},
		{
			"nielsen_sa":null,
			"nielsen_nsw":null,
			"nielsen_tas":null,
			"nielsen":null,
			"nielsen_act":null,
			"nielsen_wa":null,
			"nielsen_vic":null,
			"nielsen_nt":null,
			"nielsen_qld":null,
			"date":"2016-06-01",
			"name":"reviewproperty.com.au"
		},
		{
			"nielsen_sa":null,
			"nielsen_nsw":null,
			"nielsen_tas":null,
			"nielsen":null,
			"nielsen_act":null,
			"nielsen_wa":null,
			"nielsen_vic":null,
			"nielsen_nt":null,
			"nielsen_qld":null,
			"date":"2016-06-01",
			"name":"homely.com.au"
		},
		{
			"nielsen_sa":39632,
			"nielsen_nsw":226570,
			"nielsen_tas":4777,
			"nielsen":718748,
			"nielsen_act":6571,
			"nielsen_wa":36098,
			"nielsen_vic":203270,
			"nielsen_nt":1747,
			"nielsen_qld":148917,
			"date":"2016-06-01",
			"name":"homesales.com.au"
		},
		{
			"nielsen_sa":31808,
			"nielsen_nsw":174067,
			"nielsen_tas":10988,
			"nielsen":1003990,
			"nielsen_act":5061,
			"nielsen_wa":52273,
			"nielsen_vic":531473,
			"nielsen_nt":1604,
			"nielsen_qld":120471,
			"date":"2016-06-01",
			"name":"realestateview.com.au"
		},
		{
			"nielsen_sa":11772,
			"nielsen_nsw":28985,
			"nielsen_tas":758,
			"nielsen":989038,
			"nielsen_act":1517,
			"nielsen_wa":811263,
			"nielsen_vic":80619,
			"nielsen_nt":420,
			"nielsen_qld":9529,
			"date":"2016-06-01",
			"name":"reiwa.com.au"
		},
		{
			"nielsen_sa":44888,
			"nielsen_nsw":257765,
			"nielsen_tas":9491,
			"nielsen":822834,
			"nielsen_act":8345,
			"nielsen_wa":57381,
			"nielsen_vic":241578,
			"nielsen_nt":1892,
			"nielsen_qld":165081,
			"date":"2016-06-01",
			"name":"property.com.au"
		},
		{
			"nielsen_sa":82478,
			"nielsen_nsw":666027,
			"nielsen_tas":12261,
			"nielsen":null,
			"nielsen_act":18728,
			"nielsen_wa":99794,
			"nielsen_vic":616392,
			"nielsen_nt":3144,
			"nielsen_qld":490515,
			"date":"2016-06-01",
			"name":"onthehouse.com.au"
		},
		{
			"nielsen_sa":55715,
			"nielsen_nsw":972338,
			"nielsen_tas":34857,
			"nielsen":2514896,
			"nielsen_act":836707,
			"nielsen_wa":63772,
			"nielsen_vic":269678,
			"nielsen_nt":3109,
			"nielsen_qld":192602,
			"date":"2016-06-01",
			"name":"allhomes.com.au"
		},
		{
			"nielsen_sa":651411,
			"nielsen_nsw":7446352,
			"nielsen_tas":148032,
			"nielsen":19506831,
			"nielsen_act":238121,
			"nielsen_wa":934941,
			"nielsen_vic":5014960,
			"nielsen_nt":27044,
			"nielsen_qld":2191415,
			"pi_act": 1996358,
			"duration_act": "0:01:35",
			"pi_nsw": 65905123,
			"duration_nsw": "0:02:03",
			"pi_nt": 243852,
			"duration_nt": "0:01:50",
			"pi_qld": 16978284,
			"duration_qld": "0:01:30",
			"pi_sa": 5593131,
			"duration_sa": "0:01:31",
			"pi_tas": 1625443,
			"duration_tas": "0:01:54",
			"pi_vic": 32992130,
			"duration_vic": "0:01:25",
			"pi_wa": 6937268,
			"duration_wa": "0:01:23",
			"date":"2016-06-01",
			"name":"domain.com.au"
		},
		{
			"nielsen_sa":3040392,
			"nielsen_nsw":13148770,
			"nielsen_tas":579710,
			"nielsen":44939643,
			"nielsen_act":342197,
			"nielsen_wa":3604272,
			"nielsen_vic":12841728,
			"nielsen_nt":109286,
			"nielsen_qld":9148720,
			"pi_act": 6241746,
			"duration_act": "0:04:34",
			"pi_nsw": 202424496,
			"duration_nsw": "0:04:48",
			"pi_nt": 2506614,
			"duration_nt": "0:06:12",
			"pi_qld": 181321297,
			"duration_qld": "0:05:33",
			"pi_sa": 181321297,
			"duration_sa": "0:05:24",
			"pi_tas": 14160626,
			"duration_tas": "0:05:01",
			"pi_vic": 204371156,
			"duration_vic": "0:04:44",
			"pi_wa": 69808837,
			"duration_wa": "0:05:21",
			"date":"2016-06-01",
			"name":"realestate.com.au"
		}
	];

	var thumbnail = $("body").hasClass("screenshot-thumbnail");

	if (thumbnail) {
		planetArray = defaultPlanets;
	} else {
		planetArray = (_.isArray(planetArray) && planetArray.length > 0) ? planetArray : [];
	}

	// Return only one result for nielsen, page impressions and duration.
	// If state, only return relevant _state of the supplied data
	var nielsen_key = state ? ("nielsen_" + state) : "nielsen";
	var pi_key = state ? ("pi_" + state) : "pi";
	var duration_key = state ? ("duration_" + state) : "duration";

	var reducedArray = _.reduce(planetArray, function(prev, site) {
		var newSite = {};
		newSite.name = site.name.toLowerCase();
		newSite.date = site.date;
		newSite.nielsen = site[nielsen_key] || null;

		// TODO: use real values when available
		// newSite.pi = site[pi_key] || null;
		// newSite.duration = site[duration_key] || null;

		// Collect default values for pi and duration
		var default_values = _.find(defaultPlanets, function(defaultSite) {
			return defaultSite.name === site.name;
		});
		newSite.pi = default_values ? default_values[pi_key] : null;
		newSite.duration = default_values ? default_values[duration_key] : null;
		// EO. temp default values

		// Only include site data if Nielsen data available
		if (newSite.nielsen) {
			prev.push(newSite);
		}

		return prev;
	}, []);

	return reducedArray;

}

var setBubbles = function(slideID, planetArray) {
	// set up var container for slide, if does not exist already
	if (typeof window.bubbleSlides[slideID] === "undefined") {
		window.bubbleSlides[slideID] = {};
	}
	
	window.bubbleSlides[slideID].totalCompetitorDiameter = 0;
	window.bubbleSlides[slideID].totalPlanetArea = 0;

	var $bubbleContainer = $("#" + slideID);
	// can sustain a maximum of 10 planets. Allow less to be passed?
	// Just build to assumed always 10 for the moment. Otherwise
	// there is more work in setting up the labels.

	// Measure length of the label, if larger than the width of the
	// container, and not the first or last planet, minus half of the
	// measure width to the left position to make appear centered.

	// surface area = pi * r * r
	// radius = sqroot(sa / pi)

	var maxSurfaceArea = getSurfaceArea(bubbleVars.maxDiameter);

	// add surface area as a part of the object?

	// Sort by Nielsen value
	// Step 1. Sort competitors by their visits
	planetArray.sort(function(a, b){
		var aVisits = a.nielsen;
		var bVisits = b.nielsen;
		// if val a lesser than val b, return less than (move up)
		if (aVisits < bVisits) return -1;
		// if val a greater than val b, return larger than (move down)
		else if (aVisits > bVisits) return 1;
		// if val a equal to val b, return equal (stays equal)
		return 0;
	});

	// Step 2. Get the size of the determiner (realestate.com.au)
	// and the size of the largest competitor
	var largestPlanet = _.find(planetArray, function(planet){ return planet.name === "realestate.com.au"});
	// If REA is not in the data, get the size of the largest competitor
	if (!largestPlanet) {
		largestPlanet = planetArray[planetArray.length - 1];
	}
	
	// Set maxValue to Nielsen
	var maxValue = largestPlanet.nielsen;

	// Step 3. Give all competitors their total surface area & diameter
	// Make sure to save the diameters as the nearest odd number, so that
	// the pointer aligns nicely in the middle of the planet.

	_.map(planetArray, function(planet, plani){
		// Set visits to Nielsen
		planet.visits = planet.nielsen;
		planet.perc_rea = planet.visits / maxValue;
		planet.surface_area = maxSurfaceArea * planet.perc_rea;
		planet.diameter = Math.floor(getDiameter(planet.surface_area));

		// check if planet is odd/even number, add 1px if even, must always be odd.
		if (planet.diameter % 2 === 0) {
			planet.diameter += 1;
		}

		if (planet.name !== "realestate.com.au" && planet.name !== "domain.com.au") {
			window.bubbleSlides[slideID].totalCompetitorDiameter += planet.diameter;
		}

	});

	// var competitorSpacing = Math.floor((bubbleVars.maxGalaxy - window.bubbleSlides[slideID].totalCompetitorDiameter) / 9);
	var planetSpaces = planetArray.length - 2;
	var availSpaces = _.reduce(planetArray, function(prev, planet, plani){
		if (plani < planetArray.length - 2) {
			prev += plani;
		}
		return prev;
	}, 0);
	// calculate space left to log-ify
	var remainingSpace = bubbleVars.maxGalaxy - window.bubbleSlides[slideID].totalCompetitorDiameter - (bubbleVars.minSpacing * planetSpaces);
	// Total space available to the planets, without minimum spacing
	window.bubbleSlides[slideID].totalPlanetArea = bubbleVars.maxGalaxy - (bubbleVars.minSpacing * planetSpaces) - availSpaces;

	// Percentage of total competitor display area
	var percDisplay = getBubblePerc(slideID);

	remainingSpace = bubbleVars.maxGalaxy - (window.bubbleSlides[slideID].totalCompetitorDiameter * percDisplay) - (bubbleVars.minSpacing * planetSpaces);

	var planetOffset = 0;

	_.each(planetArray, function(planet, plani) {
		// Add logarithmic spacing "offset" to the first 9 planets
		if (plani < (planetArray.length - 2)) {
			planet.offset = planetOffset;
			planetOffset += (bubbleVars.minSpacing + ((remainingSpace / availSpaces) * ((planetSpaces - 1) - plani)) + (planetArray[plani].diameter * percDisplay));
		}
	});
};

var setPlanetDisplayWidth = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var percDisplay = getBubblePerc(slideID);

	_.each(planetArray, function(planet, plani){
		if (plani === planetArray.length - 2) {
			// Domain - second largest
			$bubbleContainer.find(".minor-sun .planet").css("width", (planet.diameter + "px")).css("height", (planet.diameter + "px"));
		} else if (plani === planetArray.length - 1) {
			// REA - largest
			$bubbleContainer.find(".major-sun .planet").css("width", (planet.diameter + "px")).css("height", (planet.diameter + "px"));
		} else {
			// If the initial competitors
			var $planet = $bubbleContainer.find(".planet-" + (plani + 1));
			$planet.find(".planet").css("width", ((planet.diameter * percDisplay) + "px")).css("height", ((planet.diameter * percDisplay) + "px"));

			// Add logarithmic spacing offset
			$planet.find(".realestate-planet").css("left", (planet.offset + "px"));
		}
	});
}

var setPlanetFinalWidth = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);

	_.each(planetArray, function(planet, plani){
		// If the initial competitors
		if (plani < (planetArray.length - 2)) {
			var $planet = $bubbleContainer.find(".planet-" + (plani + 1));
			$planet.find(".realestate-planet").css("left", "0px");
			$planet.find(".planet").css("width", (planet.diameter + "px")).css("height", (planet.diameter + "px"));
		}
	});
}

var drawLabels = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var percDisplay = getBubblePerc(slideID);

	_.each(planetArray, function(planet, plani){
		var $planet = null;
		var planetShortName = planet.name ? planet.name.split(".")[0] : "";

		if (plani === planetArray.length - 2) {
			// Domain - second largest
			$planet = $bubbleContainer.find(".minor-sun");

			// Check the width of the 3rd largest planet, and adjust
			// Domain's pointer accordingly.
			var prevPlanetDiameter = 0;
			if (planetArray[plani - 1]) {
				prevPlanetDiameter = planetArray[plani - 1].diameter;
			}

			var newLeft = prevPlanetDiameter + bubbleVars.labelPadding;
			var newWidth = 980 - newLeft;

			if (planet.diameter - prevPlanetDiameter < bubbleVars.labelPadding) {
				newLeft = planet.diameter - 36;
				newWidth = 980 - newLeft;
			}

			$bubbleContainer.find(".minor-sun .connector-line-container").css("left", (newLeft + "px")).css("width", (newWidth + "px"));
		
		} else if (plani === planetArray.length - 1) {
			// REA - largest
			$planet = $bubbleContainer.find(".major-sun");

			// Check the width of the 2nd largest planet, and adjust
			// REA's pointer width if required.
			var prevPlanetDiameter = 0;
			if (planetArray[plani - 1]) {
				prevPlanetDiameter = planetArray[plani - 1].diameter;
			}

			var newLeft = prevPlanetDiameter + bubbleVars.labelPadding;
			var newWidth = 980 - newLeft;
			if (planetArray[plani].diameter - prevPlanetDiameter < bubbleVars.labelPadding) {
				// If 2nd planet's diameter is too large,
				// set REA to point at the edge of its' own bubble
				newLeft = 656;
				newWidth = 324;
			}

			$bubbleContainer.find(".major-sun .connector-line-container").css("left", (newLeft + "px")).css("width", (newWidth + "px"));
		} else {
			$planet = $bubbleContainer.find(".planet-" + (plani + 1));
		}
		
		$planet.addClass(planetShortName);
		$planet.find(".realestate_name").html(planet.name);

		// Set planet label pointers for the first 10 competitors
		if (plani < (planetArray.length - 2)) {
			$planet.find(".connector-line-container").css("left", ((((planet.diameter * percDisplay) - 2) / 2) + "px"));
			$planet.find(".connector-line-container.down").css("top", ((((planet.diameter * percDisplay) - 1) / 2) + "px"));
			$planet.find(".connector-line-container.up").css("bottom", ((((planet.diameter * percDisplay) - 1) / 2) + "px"));
		}

		var totalDataPointsFound = 0;

		// Test for Nielsen
		if (_.isNumber(planet.nielsen)){
			$planet.find(".nielsen_value .highlight").html(addCommas(planet.nielsen));
			totalDataPointsFound++;
		} else {
			$planet.find(".nielsen_value").css("display", "none");
		}

		// Test for visitors
		if (_.isNumber(planet.pi)){
			$planet.find(".pi_value .highlight").html(addCommas(planet.pi));
			totalDataPointsFound++;
		} else {
			$planet.find(".pi_value").css("display", "none");
		}
		// Test for visit duration
		if (planet.duration){
			$planet.find(".duration_value .highlight").html(planet.duration);
			totalDataPointsFound++;
		} else {
			$planet.find(".duration_value").css("display", "none");
		}

		switch (totalDataPointsFound) {
			case 4:
				$planet.find(".connector-line-container").addClass("quadruple");
			break;
			case 3:
				$planet.find(".connector-line-container").addClass("triple");
			break;
			case 2:
				$planet.find(".connector-line-container").addClass("double");
			break;
			case 1:
			default:
				$planet.find(".connector-line-container").addClass("single");
			break;
		}

	});
}

var centerTheLabels = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var percDisplay = getBubblePerc(slideID);

	_.map(planetArray, function(planet, plani){
		// Center the labels where required
		if (plani > 1 && plani < (planetArray.length - 2)) {
			var $planet = $bubbleContainer.find(".planet-" + (plani + 1));
			var labelWidth = $planet.find(".planet-label").width();
			$planet.find(".planet-label").css("left", (((planet.diameter * percDisplay) - labelWidth) / 2 + bubbleVars.minSpacing) + "px");
		}
	});
};

var removeExcessPlanets = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var $planets = $bubbleContainer.find(".comparison-system.comparison-galaxy");
	var totalComparison = planetArray.length - 2;
	if ($planets.length > totalComparison) {
		var excessPlanets = $planets.length - totalComparison;
		for (var excess = 1; excess <= excessPlanets; excess++) {
			$bubbleContainer.find(".comparison-system.comparison-galaxy.planet-" + (totalComparison + excess)).remove();
		}
	}
	// $bubbleContainer.find(".comparison-system.comparison-galaxy.planet-" + totalComparison).addClass("right-align-text");
};

// ---------------------------------------------------//
// Comparison bubble - single slide ------------------//
// ---------------------------------------------------//

// When only a single subslide is required

var setBubblesSingle = function(slideID, planetArray) {
	// set up var container for slide, if does not exist already
	if (typeof window.bubbleSlides[slideID] === "undefined") {
		window.bubbleSlides[slideID] = {};
	}
	
	window.bubbleSlides[slideID].totalCompetitorDiameter = 0;
	window.bubbleSlides[slideID].totalPlanetArea = 0;

	var $bubbleContainer = $("#" + slideID);

	var maxSurfaceArea = getSurfaceArea(bubbleVars.maxDiameter);

	// add surface area as a part of the object?

	// Step 1. Sort competitors by their visits
	planetArray.sort(function(a, b){
		var aVisits = a.nielsen;
		var bVisits = b.nielsen;
		// if val a lesser than val b, return less than (move up)
		if (aVisits < bVisits) return -1;
		// if val a greater than val b, return larger than (move down)
		else if (aVisits > bVisits) return 1;
		// if val a equal to val b, return equal (stays equal)
		return 0;
	});

	// Step 2. Get the size of the determiner (realestate.com.au)
	// and the size of the largest competitor
	var largestPlanet = _.find(planetArray, function(planet){ return planet.name === "realestate.com.au"});
	// If REA is not in the data, get the size of the largest competitor
	if (!largestPlanet) {
		largestPlanet = planetArray[planetArray.length - 1];
	}

	// Set maxValue to Nielsen
	var maxValue = largestPlanet.nielsen;

	// Step 3. Give all competitors their total surface area & diameter
	// Make sure to save the diameters as the nearest odd number, so that
	// the pointer aligns nicely in the middle of the planet.

	_.map(planetArray, function(planet, plani){
		// Set visits to Nielsen
		planet.visits = planet.nielsen;
		planet.perc_rea = planet.visits / maxValue;
		planet.surface_area = maxSurfaceArea * planet.perc_rea;
		planet.diameter = Math.floor(getDiameter(planet.surface_area));

		// check if planet is odd/even number, add 1px if even, must always be odd.
		if (planet.diameter % 2 === 0) {
			planet.diameter += 1;
		}

		window.bubbleSlides[slideID].totalCompetitorDiameter += planet.diameter;

	});

	// var competitorSpacing = Math.floor((bubbleVars.maxGalaxy - window.bubbleSlides[slideID].totalCompetitorDiameter) / 9);
	var planetSpaces = planetArray.length;
	var availSpaces = _.reduce(planetArray, function(prev, planet, plani){
		if (plani < planetArray.length) {
			prev += plani;
		}
		return prev;
	}, 0);
	// calculate space left to log-ify
	var remainingSpace = bubbleVars.maxGalaxy - window.bubbleSlides[slideID].totalCompetitorDiameter - (bubbleVars.minSpacing * planetSpaces);
	// Total space available to the planets, without minimum spacing
	window.bubbleSlides[slideID].totalPlanetArea = bubbleVars.maxGalaxy - (bubbleVars.minSpacing * planetSpaces) - availSpaces;

	// Percentage of total competitor display area
	var percDisplay = getBubblePerc(slideID);

	remainingSpace = bubbleVars.maxGalaxy - (window.bubbleSlides[slideID].totalCompetitorDiameter * percDisplay) - (bubbleVars.minSpacing * planetSpaces);

	var planetOffset = 0;

	_.each(planetArray, function(planet, plani) {
		// Add logarithmic spacing "offset" to all planets
		planet.offset = planetOffset;
		planetOffset += (bubbleVars.minSpacing + ((remainingSpace / availSpaces) * ((planetSpaces - 1) - plani)) + (planetArray[plani].diameter * percDisplay));
	});
};

var setPlanetDisplayWidthSingle = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var percDisplay = getBubblePerc(slideID);

	_.each(planetArray, function(planet, plani){
		// All competitors are set to a single galaxy
		var $planet = $bubbleContainer.find(".planet-" + (plani + 1));
		$planet.find(".planet").css("width", ((planet.diameter * percDisplay) + "px")).css("height", ((planet.diameter * percDisplay) + "px"));

		// Add logarithmic spacing offset
		$planet.find(".realestate-planet").css("left", (planet.offset + "px"));

		// if domain or REA, add class to update colour
		if (planet.name === "domain.com.au") {
			$planet.addClass("domain-sun");
		}

		if (planet.name === "realestate.com.au") {
			$planet.addClass("rea-sun");
		}
	});
}

var drawLabelsSingle = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var percDisplay = getBubblePerc(slideID);

	_.each(planetArray, function(planet, plani){
		var $planet = $bubbleContainer.find(".planet-" + (plani + 1));
		var planetShortName = planet.name ? planet.name.split(".")[0] : "";
		var totalDataPointsFound = 0;
		
		$planet.addClass(planetShortName);
		$planet.find(".realestate_name").html(planet.name);

		// Set planet label pointers for all competitors
		$planet.find(".connector-line-container").css("left", ((((planet.diameter * percDisplay) - 2) / 2) + "px"));
		$planet.find(".connector-line-container.down").css("top", ((((planet.diameter * percDisplay) - 1) / 2) + "px"));
		$planet.find(".connector-line-container.up").css("bottom", ((((planet.diameter * percDisplay) - 1) / 2) + "px"));

		// Test for Nielsen
		if (_.isNumber(planet.nielsen)){
			$planet.find(".nielsen_value .highlight").html(addCommas(planet.nielsen));
			totalDataPointsFound++;
		} else {
			$planet.find(".nielsen_value").css("display", "none");
		}

		// Test for visitors
		if (_.isNumber(planet.pi)){
			$planet.find(".pi_value .highlight").html(addCommas(planet.pi));
			totalDataPointsFound++;
		} else {
			$planet.find(".pi_value").css("display", "none");
		}
		// Test for visit duration
		if (planet.duration){
			$planet.find(".duration_value .highlight").html(planet.duration);
			totalDataPointsFound++;
		} else {
			$planet.find(".duration_value").css("display", "none");
		}

		switch (totalDataPointsFound) {
			case 4:
				$planet.find(".connector-line-container").addClass("quadruple");
			break;
			case 3:
				$planet.find(".connector-line-container").addClass("triple");
			break;
			case 2:
				$planet.find(".connector-line-container").addClass("double");
			break;
			case 1:
			default:
				$planet.find(".connector-line-container").addClass("single");
			break;
		}

	});
}

var centerTheLabelsSingle = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var percDisplay = getBubblePerc(slideID);

	_.map(planetArray, function(planet, plani){
		// Center the labels where required
		if (plani > 1) {
			var $planet = $bubbleContainer.find(".planet-" + (plani + 1));
			var labelWidth = $planet.find(".planet-label").width();
			$planet.find(".planet-label").css("left", (((planet.diameter * percDisplay) - labelWidth) / 2 + bubbleVars.minSpacing) + "px");
		}
	});
};

var removeExcessPlanetsSingle = function(slideID, planetArray) {
	var $bubbleContainer = $("#" + slideID);
	var $planets = $bubbleContainer.find(".comparison-system.comparison-galaxy");
	var totalComparison = planetArray.length;
	if ($planets.length > totalComparison) {
		var excessPlanets = $planets.length - totalComparison;
		for (var excess = 1; excess <= excessPlanets; excess++) {
			$bubbleContainer.find(".comparison-system.comparison-galaxy.planet-" + (totalComparison + excess)).remove();
		}
	}
	$bubbleContainer.find(".comparison-system.comparison-galaxy.planet-" + totalComparison).addClass("right-align-text");
};