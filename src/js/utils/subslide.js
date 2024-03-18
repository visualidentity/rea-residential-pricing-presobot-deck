//----------------------------------------------------//
// SALESPRESO BRIDGE page navigation -----------------//
//----------------------------------------------------//

// Test for -base if want this
var subslideScrollHeight = 1080;
var subslideArray = [];

function toggleArrow(arrow, toggle) {
	if (toggle) {
		$(currentSlide() + " .slide-footer .navbtn." + arrow).removeClass(
			"inactive"
		);
		$(
			currentSlide() + " .slide-footer .navbtn-target." + arrow
		).removeClass("inactive");
	} else {
		$(currentSlide() + " .slide-footer .navbtn." + arrow).addClass(
			"inactive"
		);
		$(currentSlide() + " .slide-footer .navbtn-target." + arrow).addClass(
			"inactive"
		);
	}
}

// slide functions //

// transition applied to the slide becoming current
function subslideIn(other) {
	var self = this;
	var curSlide = currentSlide();

	$(curSlide + ' .currentpage').removeClass('currentpage');
	$(self.el).addClass("trans trans-in active currentpage");

	var pageIDString = self.el.parentElement.offsetParent.id.toString();

	self.ready = false;
	self.animating(true);

	var thisSlideID = parseInt(this.el.id.split("-")[1]);
	var otherSlideID = parseInt(other.el.id.split("-")[1]);

	var downClicked = thisSlideID > otherSlideID;

	var length = Bridge.Sub.keys().length;
	var key = Bridge.Sub.current_subslide
		? Bridge.Sub.current_subslide.key
		: "";

	$(currentSlide())
		.removeClass("subslide-" + otherSlideID)
		.addClass("subslide-" + thisSlideID);

	// Subslide has been triggered
	$(self.el).trigger("subslidetriggered");

	// Subslide has finished transitioning in (is ready)
	var subslideIntroComplete = function() {
		$(self.el).trigger("subslideready");
	};

	setTimeout(function() {
		subslideIntroComplete();
	}, self.default_transition_ms);

	// TODO: This is a hotfix, correct later
	// Always remove hidden class from current slide's footer
	$(self.el)
		.find("footer")
		.removeClass("hidden");

	// Down has been clicked
	if (downClicked) {
		// down clicked:
		// slide onto stage
		// Normally from the bottom, or from top if reversed
		$(self.el).animate({
			top: 0
		});

		var curSlide = currentSlide();

		// if jumping to a certain subslide (rather than next/previous)
		var slideDifference = thisSlideID - otherSlideID;
		if (slideDifference > 1) {
			var prefix = " #subslide-";
			// loop through the number of subslides skipped and apply the following
			for (var i = slideDifference; i > 1; i--) {
				// count upwards from the starting slide to cover each slide in between the jumping slides
				var currentSubSlide = $(
					curSlide + prefix + (otherSlideID + i - 1)
				);
				var nextSubSlide = $(curSlide + prefix + (otherSlideID + i));

				// Add subslide cross-fade
				// This allows for a smooth reverse animation when navigating back
				// Do not cross fade if next subslide has a transparent-base
				if (!nextSubSlide.hasClass("transparent-base")) {
					currentSubSlide
						.removeClass("fadeinslide")
						.addClass("fadeoutslide");
				}

				// if the skipped slide was a transparent-base, animate it up and off the screen and turn off footer
				if ($(currentSubSlide).hasClass("transparent-base")) {
					$(currentSubSlide)
						.find("footer")
						.addClass("hidden");
					// If animation is reversed take to bottom
					if ($(curSlide).hasClass("reverse-slide-anim")) {
						$(currentSubSlide).animate({
							top: subslideScrollHeight
						});
					} else {
						$(currentSubSlide).animate({
							top: -1 * subslideScrollHeight
						});
					}
				} else {
					// Animate skipped subslide so that it is stacked underneath the jump-to-ed slide
					currentSubSlide.animate({
						top: 0
					});
				}
			}
		}

		$(curSlide + " header h1").addClass("title-delay");

		if (thisSlideID === length) {
			toggleArrow("down", false);
			toggleArrow("up", true);
		} else {
			toggleArrow("down", true);
			toggleArrow("up", true);
		}
	} else {
		// up clicked - stay still
		// previous slide to transition off, revealing new current

		// cross-fade with shadow
		// Do not cross fade if other slide has transparent-base
		if (!$(other.el).hasClass("transparent-base")) {
			$(self.el)
				.removeClass("fadeoutslide")
				.addClass("fadeinslide");
		}

		// if a transparent-base slide, slide back down from the top and turn footer back on
		if ($(self.el).hasClass("transparent-base")) {
			setTimeout(function() {
				$(self.el)
					.find("footer")
					.removeClass("hidden");
			}, self.default_transition_ms - 200);

			$(self.el).animate({
				top: 0
			});
		}

		// if previous slide was a transparent-base, turn new slide's footer back on
		if ($(other.el).hasClass("transparent-base")) {
			$(self.el)
				.find("footer")
				.removeClass("hidden");
		}

		if (thisSlideID === 1) {
			toggleArrow("up", false);
			toggleArrow("down", true);
		} else {
			toggleArrow("up", true);
			toggleArrow("down", true);
		}
	}

	setTimeout(function() {
		$(self.el)
			.removeClass("trans trans-in")
			.css("border-bottom", "0px solid transparent");
		self.ready = true;
		self.animating(false);
		// force refresh for "Safari incorrect re-draw" bug //
		setTimeout(function() {
			$(self.el).css("border-bottom", "none");
			$(curSlide + " header h1").removeClass("title-delay");
		}, 100);
	}, self.default_transition_ms);

	if (
		$(self.el).hasClasses(
			"purple-base, magenta-base, blue-base, charcoal-base, green-base, cyan-base"
		)
	) {
		$(currentSlide() + " header").addClass("white");
	} else {
		$(currentSlide() + " header").removeClass("white");
	}

	Bridge.Event.trigger("slide:closeAllPopups");

	return self;
}

// Transition applied to the slide leaving current position
function subslideOut(other) {
	var self = this;

	$(self.el).addClass("trans trans-out");

	self.ready = false;
	self.animating(true);

	var thisSlideID = parseInt(this.el.id.split("-")[1]);
	var otherSlideID = parseInt(other.el.id.split("-")[1]);
	console.log(
		"thisSlideID " + thisSlideID + " - otherSlideID " + otherSlideID
	);

	var downClicked = thisSlideID > otherSlideID;
	// animation attempt
	if (downClicked) {
		// down stuff
		// If animation is reversed, take up instead
		if ($(curSlide).hasClass("reverse-slide-anim")) {
			$(self.el).animate({
				top: -1 * subslideScrollHeight
			});
		} else {
			$(self.el).animate({
				top: subslideScrollHeight
			});
		}

		var curSlide = currentSlide();

		// if jumping to a certain subslide (rather than next/previous)
		var slideDifference = thisSlideID - otherSlideID;
		console.log("down slideDifference " + slideDifference);
		if (slideDifference > 1) {
			var prefix = " #subslide-";
			// loop through the number of subslides skipped and apply the following
			for (var i = slideDifference; i > 1; i--) {
				// count upwards from the lower slide to cover each slide in between the jumping slides
				var currentSubSlide = $(
					curSlide + prefix + (otherSlideID + i - 1)
				);
				var previousSubSlide = $(
					curSlide + prefix + (otherSlideID + i)
				);

				// Add subslide cross-fade
				// This allows for a smooth reverse animation when navigating back
				// Do not cross fade if next subslide has a transparent-base
				if (!previousSubSlide.hasClass("transparent-base")) {
					currentSubSlide
						.removeClass("fadeoutslide")
						.addClass("fadeinslide");
				}

				// Animate skipped subslide so that it is stacked underneath the jump-to-ed slide
				// If animation is reversed, take down instead
				if ($(curSlide).hasClass("reverse-slide-anim")) {
					currentSubSlide.animate({
						top: -1 * subslideScrollHeight
					});
				} else {
					currentSubSlide.animate({
						top: subslideScrollHeight
					});
				}
			}
		}

		$(curSlide + " header h1").removeClass("title-delay");
	} else {
		// up clicked - stay still
		// New slides to layer on top
		// Add cross-fade animation
		// Do not cross fade if other slide has transparent-base
		if (!$(other.el).hasClass("transparent-base")) {
			$(self.el)
				.removeClass("fadeinslide")
				.addClass("fadeoutslide");
		}

		// if the previous slide was a transparent-base, animate it up and off the screen and turn off footer
		if ($(self.el).hasClass("transparent-base")) {
			$(self.el)
				.find("footer")
				.addClass("hidden");
			// If animation is reversed, take to top instead
			if ($(curSlide).hasClass("reverse-slide-anim")) {
				$(self.el).animate({
					top: subslideScrollHeight
				});
			} else {
				$(self.el).animate({
					top: -1 * subslideScrollHeight
				});
			}
		}

		// if the new slide is a transparent-base, turn off the current slide's footer
		if ($(other.el).hasClass("transparent-base")) {
			$(self.el)
				.find("footer")
				.addClass("hidden");
		}
	}

	setTimeout(function() {
		$(self.el)
			.removeClass("active trans trans-out")
			.css("border-bottom", "0px solid transparent");
		self.ready = true;
		self.animating(false);

		$(self.el).removeClass("fadeinslide");
		$(other.el).removeClass("fadeinslide");
		// force refresh for "Safari incorrect re-draw" bug //
		setTimeout(function() {
			$(self.el).css("border-bottom", "none");
			$(curSlide + " header h1").removeClass("title-delay");
		}, 100);
	}, self.default_transition_ms);

	Bridge.Event.trigger("slide:closeAllPopups");

	return self;
}

function setSubslides(pageID) {
	var subslideArray = [];
	$(pageID).addClass("subslide-1");
	$(pageID + " .slide-footer .navbtn.up").addClass("inactive");
	$(pageID + " .page01 footer .navbtn.up").addClass("inactive");

	$(pageID + " .subslide").each(function(e) {
		var tempSub = Bridge.Sub.get("subslide-" + (e + 1));

		// Attach transitions
		var trans_funcs = {
			in: subslideIn,
			out: subslideOut
		};
		tempSub.transitions(trans_funcs);

		subslideArray.push(tempSub);
	});

	$(
		pageID +
			" .page0" +
			$(pageID + " .subslide").length +
			" footer .navbtn.down"
	).addClass("inactive");
}
