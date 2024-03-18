// ---------------------------------------------------//
// Required functions --------------------------------//
// ---------------------------------------------------//

// JS Prefixer -------------------------------------- //

function prefixer(style, value){
	var webkit = "-webkit-" + style + ": " + value;
	var ms = "-ms-" + style + ": " + value;
	var straight = style + ": " + value;
	var inlineStyle = webkit + "; " + ms + "; " + straight + ";";
	return inlineStyle;
}


// ---------------------------------------------------//
// The builder ---------------------------------------//
// ---------------------------------------------------//

// Create pie chart ----------------------------------//

// values = object of pie slices and relative values
// hidden = array of hidden value names
// offset = true/false as to center the pie

function createPieChart(values, hidden, offset){
	// Offset will tilt the pie to center the total unhidden
	// pie slices if set to true. Auto is set to false.

	// Any required variables
	var pieOffset = offset || false;
	var pieHidden = hidden || [];

	// Get the pie total
	var pieTotal = _.reduce(values, function(prev, curr){ return prev + curr;}, 0);

	// minus any hidden segments before generating segments
	var pieSegments = _.pairs(_.omit(values, pieHidden));

	// Set each segment as an object inside of a master array
	// FIX-ME - Add start degree here too??
	// each object should contain the name, value, degree
	pieSegments = _.reduce(pieSegments, function(prev, curr, i){
		var valDeg = Math.round((curr[1] / pieTotal) * 360);
		// To prevent explodes - if any value is above 360, make it equal 360
		if (valDeg > 360) { valDeg = 360; }

		prev.push({
			"name": curr[0],
			"value": curr[1],
			"degree": valDeg
		});
		return prev;
	}, []);

	var pieDegreeTotal = _.reduce(pieSegments, function(prev, curr){
		return prev + curr.degree;
	}, 0);

	// If all segements appear on the pie, check that the total degree is 360
	if (pieHidden.length === 0) {
		// If the total is larger, or smaller than 360, add or subtract the difference
		// from the first pie segment. Preventing overlapping that may otherwise occur
		if (pieDegreeTotal > 360) {
			pieSegments[0].degree -= pieDegreeTotal - 360;
		} else if (pieDegreeTotal < 360) {
			pieSegments[0].degree += 360 - pieDegreeTotal;
		} else {
			// pie total is equal to 360, do nothing
		}
	}

	// FIX-ME - Add check for if the degree total is above/below 360

	// print each segment an inline string that looks like this:
	// <div class="segment" data-start="0" data-value="30" style="@include rotate(0deg);"><span class="before" style="@include rotate(31deg);"></span></div>
	// <div class="segment" data-start="30" data-value="60" style="@include rotate(30deg);"><span class="before" style="@include rotate(61deg);"></span></div>

	// If segment is larger than 180 degrees, make sure to add class big, and give it an after
	// <div class="segment big" data-start="100" data-value="260"><span class="before"></span><span class="after"></span></div>

	// console.log(prefixer("transform","rotate(260deg)"));
	var printSegments = _.reduce(pieSegments, function(prev, curr, i){
		var startRotate = prefixer("transform", "rotate(" + prev[1] + "deg)");
		if (curr.degree >= 180){
			// before degree is just degree, not degree + 1, for "big" segments
			var degreeRotate = prefixer("transform", "rotate(" + curr.degree + "deg)");
			var fullDegreeRotate = prefixer("transform", "rotate(180deg)");
			// prev[0].push("<div class='segment big' data-start='" + prev[1] + "' data-value='" + curr.degree + "' style='" + startRotate + "'><span class='before' style='" + degreeRotate + "'></span><span class='after'></span></div>");
			// Break big segment into two segments to allow for masking
			prev[0].push("<div class='segment big-segment segment-" + (i + 1) + "' data-start='" + prev[1] + "' data-value='" + curr.degree + "' style='" + startRotate + "'><span class='before' style='" + fullDegreeRotate + "'></span></div>");
			startRotate = prefixer("transform", "rotate(" + (prev[1] + 179) + "deg)");
			degreeRotate = prefixer("transform", "rotate(" + (curr.degree - 179) + "deg)");
			prev[0].push("<div class='segment segment-" + (i + 1) + "' data-start='" + prev[1] + "' data-value='" + curr.degree + "' style='" + startRotate + "'><span class='before' style='" + degreeRotate + "'></span></div>");
		} else {
			// before degree is degree + 1, for normal segments, with the start position just degree + past degree
			var degreeRotate = prefixer("transform", "rotate(" + (curr.degree + 1) + "deg)");
			prev[0].push("<div class='segment segment-" + (i + 1) + "' data-start='" + prev[1] + "' data-value='" + curr.degree + "' style='" + startRotate + "'><span class='before' style='" + degreeRotate + "'></span></div>");
		}
		prev[1] += curr.degree;
		return prev;
		// return prev + "";
	}, [[], 0]);

	printSegments = _.reduce(printSegments[0], function(prev, curr){
		prev += curr;
		return prev;
	}, "");

	// Check for pieOffset, and rotate main pie accordingly
	if (pieOffset) {
		var mainRotate = prefixer("transform", "rotate(-" + (pieDegreeTotal / 2) + "deg)");
		printSegments = "<div class='pie-chart' style='" + mainRotate + "'>" + printSegments + "</div>";
	} else {
		printSegments = "<div class='pie-chart'>" + printSegments + "</div>";
	}

	return printSegments;

	// If pie requires centering, make sure to calculate the required offset

	// _.reduce(_.rest(all_states_traffic,[2]), function(curr, prev){ return curr + parseInt(prev[1]); }, 0);
	// var all_states_traffic = _.pairs(_.omit(all_traffic, ["traffic_origin_overseas","traffic_origin_domestic",current_state]));
}