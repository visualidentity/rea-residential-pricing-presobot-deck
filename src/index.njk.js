{% macro rendered(id) %}
	// find agent name, or set default...
	var customer_fallback = Bridge.Context.match(".customer .title", "-")
	var customer_name = Bridge.Context.match(".agent .agency_name", customer_fallback);

	// find preso date, or set default...
	var fake_date = moment().format();
	var the_date = Bridge.Context.match(".preso_date", fake_date);

	// -- Standard date -- //
	// Moment will automatically convert this date to the timezone
	// where it is being viewed in.
	var preso_date = moment(the_date);

	// -- PDF date -- //
	// In the case of sending PDFs, we want the Server's timezone to be ignored.
	// .zone() forces the moment to be rendered to the zone it was produced in,
	// instead of converting it to the current location's timezone.
	// http://momentjs.com/docs/#/manipulating/timezone-offset/
	var pdf_preso_date = moment(the_date).zone(the_date);

	// Check for screenshot mode, and select appropriate date
	var screenshot = $("body").hasClass("screenshot");
	var thumbnail = $("body").hasClass("screenshot-thumbnail");

	// Insert appropriate date
	if (screenshot) {
		$(".js-preso-date", $pageContainer).html(pdf_preso_date.format("D MMMM YYYY"));
	} else {
		$(".js-preso-date", $pageContainer).html(preso_date.format("D MMMM YYYY"));
	}

	// Insert customer title name
	$(".js-customer-title", $pageContainer).html(customer_name);

{% endmacro %}

{% macro ready(id) %}
	attachSlideEvents();
{% endmacro %}
