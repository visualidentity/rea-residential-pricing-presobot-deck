function grabTemplate(uid, $pageContainer, $target) {
	$template = $($(".template#" + uid, $pageContainer).val()).appendTo(
		$target
	);
}

function renderStateData($targetDiv, $pageContainer, stateId) {
	var requiredKeys = [
		"rea",
		"number_two",
		"number_two_only",
		"rea_only",
		"both"
	];
	var stateNameMap = {
		vic: "Victoria",
		wa: "Western Australia",
		nsw: "New South Wales",
		qld: "Queensland",
		sa: "South Australia",
		act: "ACT",
        tas: "Tasmania"
	};
	var stateAdjectiveMap = {
		vic: "Victorian",
		wa: "Western Australian",
		nsw: "New South Wales",
		qld: "Queensland",
		sa: "South Australian",
		act: "ACT",
        tas: "Tasmanian"
	};
	//		var $targetDiv = $(targetSelector, $pageContainer);
	var allStateData = rea_data_source_local.rea_vs_domain_by_state;
	var stateData = allStateData[stateId] || {};
	stateData.rea_only = stateData.rea - stateData.both;
	stateData.number_two_only = stateData.number_two - stateData.both;

	$(".icon.state", $targetDiv).addClass(stateId);

	//	injectLocalValues($targetDiv, stateData, null, addCommas);

	$target = $(".column.graph", $pageContainer);

	var comparisonType;
	if (!stateData.both) {
		comparisonType = "bar";
	} else {
		comparisonType = "circle";
	}
	if (comparisonType == "circle") {
		grabTemplate("circles", $pageContainer, $target);
		// rea size is fixed;
		var reaDiameter = 345;
		var circleTop = 50;
		var centreLine = 553;

		var reaRawRadius = Math.sqrt(stateData.rea / Math.PI);
		var numberTwoRawRadius = Math.sqrt(stateData.number_two / Math.PI);
		var numberTwoDiameter = Math.round(
			(numberTwoRawRadius / reaRawRadius) * reaDiameter
		);

		var overlapArea = stateData.both;

		$reaCircle = $(".circle.lhs", $pageContainer);
		$numberTwoCircle = $(".circle.rhs", $pageContainer);
		setStateDiameter($reaCircle, reaDiameter);
		setStateDiameter($numberTwoCircle, numberTwoDiameter);

		$(".center-line", $pageContainer).css("left", centreLine);
		var guessedArea = 0;
		var bestGuessedOverlapD = reaRawRadius + numberTwoRawRadius - 10;
		var previousGuessedOverlapD = reaRawRadius + numberTwoRawRadius + 10;
		var numGuesses = 0;
		// console.log("reaRawRadius", reaRawRadius);
		// console.log("numberTwoRawRadius", numberTwoRawRadius);
		while (
			Math.abs(guessedArea - overlapArea) > 10000 &&
			numGuesses < 1000
		) {
			//var guessedArea = generateOverlapArea(reaRawRadius, numberTwoRawRadius, bestGuessedOverlapD);
			var guessedArea = areaOfIntersection(
				reaRawRadius,
				numberTwoRawRadius,
				bestGuessedOverlapD
			);
			var thisGuessedOverlay = bestGuessedOverlapD;
			if (guessedArea < overlapArea) {
				// console.log("too small, shrinking", bestGuessedOverlapD, Math.round(guessedArea))
				if (previousGuessedOverlapD > thisGuessedOverlay)
					bestGuessedOverlapD -= Math.abs(
						bestGuessedOverlapD - previousGuessedOverlapD
					);
				else {
					bestGuessedOverlapD -=
						Math.abs(
							bestGuessedOverlapD - previousGuessedOverlapD
						) / 2;
				}
			}
			if (guessedArea > overlapArea) {
				// console.log("too big, expanding", bestGuessedOverlapD, Math.round(guessedArea))
				if (previousGuessedOverlapD < thisGuessedOverlay) {
					bestGuessedOverlapD += Math.abs(
						bestGuessedOverlapD - previousGuessedOverlapD
					);
				} else {
					bestGuessedOverlapD +=
						Math.abs(
							bestGuessedOverlapD - previousGuessedOverlapD
						) / 2;
				}
			}
			previousGuessedOverlapD = thisGuessedOverlay;
			numGuesses++;
			//	// console.log(numGuesses, bestGuessedOverlapD, "guessed", guessedArea, "overlaptarget", overlapArea );
		}
		// console.log("done", numGuesses, bestGuessedOverlapD, guessedArea, overlapArea);
		var adjustedDistance = Math.round(
			((bestGuessedOverlapD / reaRawRadius) * reaDiameter) / 2
		);

		// console.log("reaRawRadius", reaRawRadius);
		// console.log("numberTwoRawRadius", numberTwoRawRadius);
		var totalWidth =
			reaDiameter / 2 + adjustedDistance + numberTwoDiameter / 2;
		// console.log("reaDiameter", reaDiameter, "numberTwoDiameter", numberTwoDiameter);
		// console.log("adjustedDistance", adjustedDistance, "totalWidth", totalWidth);
		var lhsLeftEdge = centreLine - totalWidth / 2;
		var rhsRightEdge = centreLine + totalWidth / 2;
		$reaCircle.css("left", lhsLeftEdge);
		$numberTwoCircle.css("left", rhsRightEdge - numberTwoDiameter);

		$(".connector-line.straight", $reaCircle).css(
			"left",
			reaDiameter / 2 +
				adjustedDistance -
				numberTwoDiameter +
				(reaDiameter + numberTwoDiameter - adjustedDistance * 1.2) / 2
		);
	} else if (comparisonType == "bar") {
		grabTemplate("bars", $pageContainer, $target);
		$target.addClass(stateData.bar_style);
		var reaRed = "#e4002b";
		var bars = $(".bar .inner", $target);
		var firstBar = $(bars[0]);
		var secondBar = $(bars[1]);
		var thirdBar = $(bars[2]);
		if (stateData.bar_style == "rea_first") {
			var totalHeight = 438;
			var barMultiplier = totalHeight / stateData.rea;
		} else {
			var totalHeight = 490;
            var dataMax = stateData.number_two > stateData.number_three ? stateData.number_two : stateData.number_three;
			var barMultiplier = totalHeight / dataMax;
		}
		var reaTarget = firstBar;
		var numberTwoTarget = secondBar;
		var rea_height = Math.round(stateData.rea * barMultiplier);
		var number_two_height = Math.round(
			stateData.number_two * barMultiplier
		);
		var number_three_height = Math.round(
			stateData.number_three * barMultiplier
		);
		reaTarget.height(rea_height);
		numberTwoTarget.height(number_two_height);
		thirdBar.height(number_three_height);
		reaTarget.css("background-color", reaRed);
		numberTwoTarget.css("background-color", "#1B232C");
		thirdBar.css("background-color", "#697684");
		var dataset = {
			bar_one_value: stateData.rea,
			bar_two_value: stateData.number_two,
			bar_three_value: stateData.number_three,
			number_two_multiple:
				Math.round((stateData.rea / stateData.number_two) * 10) / 10
		};
		injectLocalValues($targetDiv, dataset, null, addCommas);
	}

	// state name
	injectLocalValues($targetDiv, {
		state_name: stateNameMap[stateId],
		state_name_short: stateId,
		state_adjective: stateAdjectiveMap[stateId]
	});
	injectLocalValues(
		$targetDiv,
		{ rea_vs_domain_date: rea_data_source_local.rea_vs_domain_date },
		null,
		friendlyDate
	);
	injectLocalValues($targetDiv, stateData, null, addCommas);
}

function areaOfIntersection(r0, r1, x1) {
	var x0 = 0,
		y0 = 0,
		y1 = 0;
	var rr0 = r0 * r0;
	var rr1 = r1 * r1;
	var c = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
	var phi = Math.acos((rr0 + c * c - rr1) / (2 * r0 * c)) * 2;
	var theta = Math.acos((rr1 + c * c - rr0) / (2 * r1 * c)) * 2;
	var area1 = 0.5 * theta * rr1 - 0.5 * rr1 * Math.sin(theta);
	var area2 = 0.5 * phi * rr0 - 0.5 * rr0 * Math.sin(phi);
	return area1 + area2;
}

function setStateDiameter($circle, diameter) {
	var baseOffset = 75;
	$circle.width(diameter).height(diameter);
	$circle.css("margin-top", baseOffset - diameter / 2);
}
