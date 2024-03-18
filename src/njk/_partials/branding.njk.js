{% macro rendered() %}

	// find agent branding colour, or set default...
	// default = 'Biggin & Scott' colour
	var branding_colour = Bridge.Context.match(".customer .primary_colour", "#00A4C7");

	// find agent branding logo, or set default...
	// default = 'Biggin & Scott' logo
	var branding_logo = Bridge.Context.match(".customer .rea_image_large", null);

	// update agent branding bg colour...
	$pageContainer.find(".brand-bg").css("background-color", branding_colour).addClass(assetColourTest(branding_colour));

	$pageContainer.find(".branded-text").addClass(assetColourTest(branding_colour));

	// update agent branding notch colour
	$pageContainer.find(".branded-ph").css("border-top-color", branding_colour);

	$pageContainer.find(".contract-option-selector__header").css("background-color", branding_colour).addClass(assetColourTest(branding_colour));

	$pageContainer.find(".contract-option-selector__header").css("border-top-color", branding_colour);

	if (branding_logo) {
		// update agent branding logo...
		$pageContainer.find(".brand-logo").css("background-image", "url(" + branding_logo + ")");
	} else {
		// Add default-logo class
		$pageContainer.find(".brand-logo").addClass("default-logo");
	}

{% endmacro %}
