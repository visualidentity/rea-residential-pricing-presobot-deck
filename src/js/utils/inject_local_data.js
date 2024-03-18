
function injectLocalValues($pageContainer, sourceObj, keys, formattingFunction, subSelector) {
	subSelector = !subSelector ? "" : " " + subSelector
	if (keys) {
		// specific values
		for (var whichKey = 0; whichKey < keys.length; whichKey++) {
			var dataKey = keys[whichKey];
			var $domNode = $(".data-" + dataKey + subSelector, $pageContainer);
			console.log($domNode);
			if ($domNode.length) {
					var prettyVal = formattingFunction ? formattingFunction(sourceObj[dataKey]) : sourceObj[dataKey];
				$domNode.html(prettyVal);
			}
		}
	} else {
		// just iterate everything
		for (var dataKey in sourceObj) {
			var $domNode = $(".data-" + dataKey + subSelector, $pageContainer);
			if ($domNode.length) {
					var prettyVal = formattingFunction ? formattingFunction(sourceObj[dataKey]) : sourceObj[dataKey];
				$domNode.html(prettyVal);
			}
		}
	}
}

function friendlyDate(dateString) {
	var newDate = moment(dateString, ["MMM-YY", "MMMM-YY", "DD/MM/YY","DD/MM/YYYY","YYYY-MM-DD"]);
	var outputString =  newDate.format("MMMM YYYY");
	console.log(dateString,outputString);
	return outputString;
}
function shortDate(dateString) {
	var newDate = moment(dateString, ["MMM-YY", "MMMM-YY", "DD/MM/YY","DD/MM/YYYY","YYYY-MM-DD"]);
	var outputString =  newDate.format("MMM-YY");
	console.log(dateString,outputString);
	return outputString;
}
