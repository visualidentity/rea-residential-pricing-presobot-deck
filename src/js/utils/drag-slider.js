// ------------------------------ //
// Dragging mechanics ----------- //
// ------------------------------ //

var setSliders = function(sliders) {

	Bridge.Event.on("master:updateSliderVal", function(inputField, sliderPerc) {
		var $pageContainer = $(currentSlide());
		var $slider = $pageContainer.find(".calculator__slider-container." + inputField + "_slider")[0];
		var minValue = parseInt($slider.getAttribute("data-min")) || 0;
		var maxValue = parseFloat($slider.getAttribute("data-max")) || 100;
		var sliderInterval = parseFloat($slider.getAttribute("data-interval")) || 1;

		var newValue = Math.ceil(((maxValue - minValue) * sliderPerc) / sliderInterval) * sliderInterval + minValue;
		// Rounding error prevention
		newValue = Math.round(newValue * 100) / 100;

		// updateVal
		var $input = $pageContainer.find("input#" + inputField);
		// var displayValue = getDisplayValue($input.attr("class"), newValue);

		// // If supplied interval is a decimal, pad decimal for displayValue
		// if (sliderInterval.toString().indexOf(".") >= 0) {
		// 	displayValue = padDecimal(displayValue, sliderInterval.toString().split(".")[1].length);
		// }

		// $pageContainer.find("#" + inputField).val(displayValue);
		// Bridge.Event.trigger("master:updateClientVal", ("input#" + inputField), displayValue);

		$pageContainer.find("." + inputField + "_slider .calculator__slider-token").css("left", Math.round(sliderPerc * 100) + "%");
		
		// Update Context
		var dataGroup = $slider.getAttribute("data-group") || "portfolio";
		var contextData = Bridge.Context.match("." + dataGroup, {});
		contextData[inputField] = newValue;
		Bridge.Context.set(dataGroup, contextData);
		Bridge.Event.trigger("master:updateResult", contextData);
	});

	Bridge.Event.on("master:updateSliderPos", function(inputField, sliderVal) {
		var $pageContainer = $(currentSlide());
		var $slider = $pageContainer.find(".calculator__slider-container." + inputField + "_slider")[0];
		if ($slider) {
			var minValue = parseInt($slider.getAttribute("data-min")) || 0;
			var maxValue = parseInt($slider.getAttribute("data-max")) || 100;
			var sliderInterval = parseInt($slider.getAttribute("data-interval")) || 1;

			var sliderPerc = (sliderVal - minValue) / (maxValue - minValue);

			$pageContainer.find("." + inputField + "_slider .calculator__slider-token").css("left", Math.round(sliderPerc * 100) + "%");
		}
	});

	if ($("body").hasClass("master") || $("body").hasClass("share_online")) {
		var $pageContainer = $(currentSlide());

		var dragging = false;
		var offsetLeft = 0;
		var handleWidth = 0;
		var trackLeft = 0;
		var trackWidth = 0;

		var slideDimensions = {};

		var fieldName = "";

		var setDraggable = function(mouseX) {
			var left = mouseX - offsetLeft - trackLeft;
			var maxLeft = trackWidth;

			if (left < 0) {
				left = 0;
			} else if (left > maxLeft) {
				left = maxLeft;
			}

			var inputField = fieldName + " .calculator__slider-container.sliding";
			// Send field name and left value to the calculator
			// to set Context, update values and slider
			Bridge.Event.trigger("master:updateSliderVal", fieldName, (left / maxLeft));
		};

		var setOffsets = function(e) {
			var slider = $pageContainer.find(".sliding")[0];

			var sliderHandle = $(slider).find(".calculator__slider-token")[0];
			var sliderTrack = $(slider).find(".calculator__slider-track")[0].getBoundingClientRect();

			var box = sliderHandle.getBoundingClientRect();
			var track = sliderTrack;
			var mouse = e;

			// Touch events are wrapped, decipher before sending in
			if (e.type === "touchstart") {
				mouse = e.originalEvent;
			}

			if (!mouse.pageX && mouse.touches.length > 0) {
				mouse = mouse.touches[0];
			}

			slideDimensions = $pageContainer[0].getBoundingClientRect();

			// FIXME, this is not happening early enough
			offsetLeft = mouse.pageX - box.left;
			handleWidth = box.width;
			trackLeft = track.left - slideDimensions.left;
			trackWidth = track.width;
			
			var mouseX = mouse.pageX - slideDimensions.left;
			setDraggable(mouseX);
		};

		var dragMe = function(mouse) {
			var mouseX = 0;
			if (mouse.pageX) {
				mouseX = mouse.pageX - slideDimensions.left;
			} else if (mouse.touches.length > 0) {
				// android with touch events
				mouseX = mouse.touches[0].pageX - slideDimensions.left;
			}

			setDraggable(mouseX);
		};

		var mouseMove = function(e) {
			// drag draggable item
			if (dragging) {
				dragMe(e);
			}
		};

		// Set the sliders
		_.each(sliders, function(slider) {

			var sliderHandle = $(slider).find(".calculator__slider-token")[0];

			$(sliderHandle).on("mousedown touchstart", function(e) {
				dragging = true;
				$(slider).addClass("sliding");

				// data-value
				fieldName = $pageContainer.find(".calculator__slider-container.sliding")[0].getAttribute("data-field");

				setOffsets(e);

				// add mousemove eventListener to whole slide
				$pageContainer[0].addEventListener("mousemove", mouseMove);
				$pageContainer[0].addEventListener("touchmove", mouseMove);
			});
		});

		$pageContainer.on("mouseup touchend", function() {
			if (dragging) {
				var slider = $pageContainer.find(".calculator__slider-container.sliding");
				slider.removeClass("sliding");
				dragging = false;

				// // Trigger graph draw
				// updateTPProcessingTotal();
			}
			// remove mousemove eventListener
			$pageContainer[0].removeEventListener("mousemove", mouseMove);
			$pageContainer[0].removeEventListener("touchmove", mouseMove);
		});
	}
}
