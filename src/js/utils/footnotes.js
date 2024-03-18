function addFootnoteDate($pageContainer, data, section) {
	// if (data.omniture_data && data.omniture_data[section]) {
	// 	var date = data.omniture_data[section].month;
	// 	date = date.split("-");
	// }
	var $disclaimers = $pageContainer.find(".disclaimer-copy");
	$disclaimers.each(function() {
		var text = $(this).html();
		// text = text.replace("[M]", date[1]);
		// text = text.replace("[Y]", date[0]);
		text = text.replace("[M]", "January");
		text = text.replace("[Y]", "2019");
		$(this).html(text);
	});
}

function addFootnoteDateOmniture($pageContainer, data, section) {
	// if (data.omniture_data && data.omniture_data[section]) {
	// 	var date = data.omniture_data[section].month;
	// 	date = date.split("-");
	// }
	var $disclaimers = $pageContainer.find(".disclaimer-copy");
	$disclaimers.each(function() {
		var text = $(this).html();
		// text = text.replace("[M]", date[1]);
		// text = text.replace("[Y]", date[0]);
		text = text.replace("[M]", "June");
		text = text.replace("[Y]", "2019");
		$(this).html(text);
	});
}
