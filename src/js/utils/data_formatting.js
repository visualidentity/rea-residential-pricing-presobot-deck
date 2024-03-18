// ----------------------------------------------------//
// Pretty Data Formatting -----------------------------//
// ----------------------------------------------------//

// Make Nice numbers/text --------------------------- //
function pretty_number(n, longName, strArr, extraDec, billionCheck) {
	var p = /^[0-9]+$/; // NUMBER PATTERN
	var t = [];
	var numberNames = { K: "K", M: "M", B: "B", T: "T" }; // Default Number Representation

	var useLongName = longName || false;
	if (useLongName === true) {
		numberNames = {
			K: "thousand",
			M: "million",
			B: "billion",
			T: "trillion"
		};
	}

	var stringArr = strArr || "string";
	var decimal = extraDec || false;

	if (_.isNumber(n) || n.match(p)) {
		var z = 0;
		if (n >= 1000) {
			var m = 0;

			if (n >= 1000000000000) {
				m = Math.floor(n / 100000000000); // GETS THE FIRST DECIMAL POINT
				t = numberNames.T;
			} else if (n >= 1000000000) {
				m = Math.floor(n / 100000000); // GETS THE FIRST DECIMAL POINT
				t = numberNames.B;
			} else if (n >= 1000000) {
				m = Math.floor(n / 100000); // GETS THE FIRST DECIMAL POINT
				t = numberNames.M;
			} else if (n >= 1000) {
				Logger.log(n);
				m = Math.floor(n / 100); // GETS THE FIRST DECIMAL POINT
				t = numberNames.K;
			}

			if (!decimal && m.toString().length >= 4) {
				z = Math.floor(m / 10); // REMOVES THE DECIMAL PLACE
			} else {
				z = m / 10; // ADDS THE DECIMAL PLACE
			}
		} else {
			z = n;
			var t = "";
		}
	} else {
		z = "Invalid Number";
	}

	// How to format the result
	if (stringArr === "array") {
		var theArray = new Array(z, t);
		return theArray;
	} else {
		return z + t;
	}
}

// Add commas to integers --------------------------- //
function addCommas(nStr) {
	nStr += "";
	var x = nStr.split(".");
	var x1 = x[0];
	var x2 = x.length > 1 ? "." + x[1] : "";
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1" + "," + "$2");
	}
	return x1 + x2;
}

// Format number according to size ------------------ //
function checkNumSize(n, extraDec) {
	var decimal = extraDec || false;
	var newNum = 0;
	if (n >= 1000000) {
		newNum = pretty_number(n, false, "string", decimal);
	} else {
		newNum = addCommas(n);
	}
	return newNum;
}

// Pad decimal -------------------------------------- //
function padDecimal(input, dp) {
	if (!dp) {
		return Math.round(input) + "";
	}
	input += "";
	var x = input.split(".");
	var whole = addCommas(x[0]) + ".";
	var dec = x.length > 1 ? x[1] : "";
	if (dec.length > dp) {
		dec = dec.substring(0, dp);
	} else {
		for (var i = dec.length; i < dp; i++) {
			dec += "0";
		}
	}
	return whole + dec;
}

// Cap decimal -------------------------------------- //
function capDecimal(input, dp, commas) {
	if (!dp) {
		return Math.round(input) + "";
	}
	var percentage = Math.pow(10, dp);
	var val = Math.round(input * percentage) / percentage;
	return val;
}

// Pad number -------------------------------------- //
function padNum(input, width, padding) {
	var totalWidth = width || 1;
	var padUnit = padding || "0";
	var num = input + "";
	return num.length >= totalWidth
		? num
		: new Array(width - num.length + 1).join(padUnit) + num;
}

// Check for decimal input
function checkInputDecimal(input) {
	return (
		(input.charCode >= 48 && input.charCode <= 57) ||
		input.charCode === 46 ||
		input.charCode === 0
	);
}

// Check for numeric input
function checkInputNumeric(input) {
	return (
		(input.charCode >= 48 && input.charCode <= 57) || input.charCode === 0
	);
}

function capitalise(name) {
	if (typeof name === "undefined") {
		console.error("Capitalise name is undefined");
		return;
	}
	var i,
		words,
		w,
		result = "";
	words = name.split(" ");

	for (i = 0; i < words.length; i += 1) {
		w = words[i];
		result += w.substr(0, 1).toUpperCase() + w.substr(1);
		if (i < words.length - 1) {
			result += "";
		}
	}

	return result;
}

function toTitleCase(inputString) {
	var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

	return inputString.replace(/([^\W_]+[^\s-]*) */g, function(
		match,
		p1,
		index,
		title
	) {
		if (
			index > 0 &&
			index + p1.length !== title.length &&
			p1.search(smallWords) > -1 &&
			title.charAt(index - 2) !== ":" &&
			title.charAt(index - 1).search(/[^\s-]/) < 0
		) {
			return match.toLowerCase();
		}

		if (p1.substr(1).search(/[A-Z]|\../) > -1) {
			return match;
		}

		return match.charAt(0).toUpperCase() + match.substr(1);
	});
}

// ----------------------------------------------------//
// Get Factsheet --------------------------------------//
// ----------------------------------------------------//

// Gather and manipulate the stats --------------------------------------- //

function getFactsheetVar(factsheet, id, defaultValue, returnType) {
	// Default return type is string
	returnType = returnType || "string";
	var rawVal = Bridge.Feed.get("factsheet")
		.match("." + factsheet + "_factsheet ." + id, defaultValue)
		.toString();
	if (returnType === "number") {
		if (_.isEmpty(rawVal)) {
			rawVal = "0";
		}
		// strips value of commas, returns integer
		return parseInt(rawVal.replace(/[^\d\.]/g, ""));
	}
	if (returnType === "decimal") {
		if (_.isEmpty(rawVal)) {
			rawVal = "0";
		}
		// strips value of commas, returns float
		return parseFloat(rawVal.replace(/[^\d\.]/g, ""));
	}
	if (returnType === "commas") {
		if (_.isEmpty(rawVal)) {
			rawVal = "0";
		}
		// strips value of commas, returns comma separated number
		return addCommas(parseInt(rawVal.replace(/[^\d\.]/g, "")));
	}
	if (returnType === "clean") {
		if (_.isEmpty(rawVal)) {
			rawVal = "0";
		}
		// strips value of commas, returns comma separated number
		return parseFloat(rawVal.replace(/[^\d\.]/g, ""));
	}
	if (returnType === "pretty") {
		if (_.isEmpty(rawVal)) {
			rawVal = "0";
		}
		// strips value of commas, returns pretty_number array
		return pretty_number(
			parseInt(rawVal.replace(/[^\d\.]/g, "")),
			true,
			"array"
		);
	}
	if (returnType === "minsround") {
		if (_.isEmpty(rawVal)) {
			rawVal = "00:00:00";
		}
		var timeArr = rawVal.split(":");
		if (parseInt(timeArr[0]) > 0) {
			// returns "hours + mins" = "00"
			return parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
		} else {
			// returns "mins" = "00"
			return parseInt(timeArr[1]);
		}
	}
	if (returnType === "mins") {
		if (_.isEmpty(rawVal)) {
			rawVal = "00:00:00";
		}
		var timeArr = rawVal.split(":");
		// returns "hours + mins : seconds" = "00:00"
		return (
			parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]) + ":" + timeArr[2]
		);
	}
	return rawVal;
}

// Dates

function getMoment(theDate, theFormat) {
	var newDate = moment().format();
	if (!_.isEmpty(theDate)) {
		newDate = moment(theDate, [
			"MMM-YY",
			"MMMM-YY",
			"DD/MM/YY",
			"D/MM/YYYY",
			"YYYY-MM-DD"
		]).format(theFormat);
	}
	return newDate;
}

// ----------------------------------------------------//
// Count Up  ------------------------------------------//
// ----------------------------------------------------//

(function($) {
	$.fn.countTo = function(options) {
		// merge the default plugin settings with the custom options
		options = $.extend({}, $.fn.countTo.defaults, options || {});

		// how many times to update the value, and how much to increment the value on each update
		var loops = Math.ceil(options.speed / options.refreshInterval),
			increment = (options.to - options.from) / loops;

		return $(this).each(function() {
			var _this = this,
				loopCount = 0,
				value = options.from,
				interval = setInterval(updateTimer, options.refreshInterval);

			function updateTimer() {
				value += increment;
				loopCount++;
				$(_this).html(addCommas(value.toFixed(options.decimals)));

				if (typeof options.onUpdate == "function") {
					options.onUpdate.call(_this, value);
				}

				if (loopCount >= loops) {
					clearInterval(interval);
					value = options.to;

					if (typeof options.onComplete == "function") {
						options.onComplete.call(_this, value);
					}
				}
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0, // the number the element should start at
		to: 100, // the number the element should end at
		speed: 1000, // how long it should take to count between the target numbers
		refreshInterval: 100, // how often the element should be updated
		decimals: 0, // the number of decimal places to show
		onUpdate: null, // callback method for every time the element is updated,
		onComplete: null // callback method for when the element finishes updating
	};
})(jQuery);
