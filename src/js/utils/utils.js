window.deckBaseURL = window.deckBaseURL ? window.deckBaseURL : "deck/";

// timeouts and intervals
window.slideIntervals = window.slideIntervals || {};
window.slideTimeouts = window.slideTimeouts || {};

// Clear setIntervals
var clearIntervals = function(slideId) {
	while (window.slideIntervals[slideId].length > 0) {
		clearInterval(window.slideIntervals[slideId].pop());
	}
};

// Clear setIntervals
var clearAllIntervals = function() {
	_.each(window.slideIntervals, function(interval) {
		while (interval.length > 0) {
			clearInterval(interval.pop());
		}
	});
};

// Clear setTimeouts
var clearTimeouts = function(slideId) {
	while (window.slideTimeouts[slideId].length > 0) {
		clearTimeout(window.slideTimeouts[slideId].pop());
	}
};

// Clear setTimeouts
var clearAllTimeouts = function() {
	_.each(window.slideTimeouts, function(interval) {
		while (interval.length > 0) {
			clearTimeout(interval.pop());
		}
	});
};

// Used for interactive tables, and removable assets
var incrementClasses = function(iteree, prefix) {
	var classString = "";

	for (var i = 0; i <= iteree; i++) {
		if (i === 0) {
			classString += prefix + i;
		} else {
			classString += " " + prefix + i;
		}
	}

	return classString;
};

// Check if an element is the descendant of another
var isDescendant = function(parent, child) {
	var node = child.parentNode;

	while (node != null) {
		if (node == parent) return true;
		node = node.parentNode;
	}

	return false;
};

// Check for multiple classes extension
$.fn.extend({
	hasClasses: function(selector) {
		var classNamesRegex = new RegExp(
				"( " + selector.replace(/ +/g, "").replace(/,/g, " | ") + " )"
			),
			rclass = /[\n\t\r]/g,
			i = 0,
			l = this.length;
		for (; i < l; i++) {
			if (
				this[i].nodeType === 1 &&
				classNamesRegex.test(
					(" " + this[i].className + " ").replace(rclass, " ")
				)
			) {
				return true;
			}
		}
		return false;
	}
});

// Check for same class
var compareClasses = function(comparer, comparison, selector) {
	for (var i = 0; i < selector.length; i++) {
		var klass = selector[i];
		if (comparer.hasClass(klass) && comparison.hasClass(klass)) {
			return true;
		}
	}
	return false;
};
