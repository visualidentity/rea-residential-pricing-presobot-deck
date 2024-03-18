// Use this to get the length of your SVG path & test animation
// e.g.  svgAnimatePath('#mysvg path', 1000);

function svgAnimatePath(slideID, selector, time, options) {
	window.slideTimeouts[slideID] = window.slideTimeouts[slideID] || [];

	return {
		animatePath: function(precall, precallValue) {
			var path = document.querySelector("#" + slideID + " " + selector);
			var length = Math.ceil(path.getTotalLength()) + "px";

			this.options = {};
			this.options.delay = (options && options.delay) || false;
			this.options.endValue = (options && options.endValue) || "0px";
			this.options.reverse = (options && options.reverse) || false;
			if (typeof precall !== "function") {
				precall = function() {};
			}

			// Set up the starting positions
			path.style.strokeDasharray = length + " " + length;
			path.style.strokeDashoffset =
				(this.options.reverse ? "-" : "") + length;

			// Trigger a layout so styles are calculated & the browser
			// picks up the starting position before animating
			path.getBoundingClientRect();

			var theEndVal = this.options.endValue;
			var theDelay = this.options.delay;
			var theTimeout;

			//console.log("[SVG Path Animator] End value: "+theEndVal+" and the delay is "+theDelay);

			if (this.options.delay === "false") {
				theTimeout = setTimeout(function() {
					precall(precallValue || selector);
					$("#" + slideID + " " + selector)
						.animate({ strokeDashoffset: theEndVal }, time)
						.css("opacity", "1");
				}, 0);
			} else {
				theTimeout = setTimeout(function() {
					precall(precallValue || selector);
					$("#" + slideID + " " + selector)
						.animate({ strokeDashoffset: theEndVal }, time)
						.css("opacity", "1");
				}, theDelay);
			}

			window.slideTimeouts[slideID].push(theTimeout);
		},
		clearPath: function() {
			$("#" + slideID + " " + selector).css("opacity", "0");
		}
	};
}

function clearAnimationTimeouts(slideID) {
	clearTimeouts(slideID);
}

function svgGetPathLength(selector) {
	var path = document.querySelector(selector);
	var length = path.getTotalLength();

	console.log(
		"[SVG Path] for " +
			selector +
			" stroke-dasharray: " +
			length +
			" " +
			length +
			"; and stroke-dashoffset: " +
			length +
			";"
	);
}
