var slideTimerArray = [];
/* clear all timers from the timer array */
$.clearTimerArray = function() {
	for (var i = 0; i < slideTimerArray.length; i++) {
		var currentTimer = slideTimerArray[i];
		clearTimeout(currentTimer);
	}
};

//----------------------------------------------------//
// SALESPRESO GENERAL FUNCTIONS ----------------------//
//----------------------------------------------------//

function currentSlide() {
	var currentSlideId = $("body")
		.find("#slideshow .presoSlide.current article")
		.prop("id");

	return "#" + currentSlideId;
}

//----------------------------------------------------//
// SET BACK BUTTON -----------------------------------//
//----------------------------------------------------//

function setBackBtn(slidePath) {
	var slideArray = slidePath.split("/");
	var slideID = slideArray.length > 1 ? slideArray[1] : slideArray[0];

	if (window.jumpTo === slidePath) {
		// jumpTo is the same as the slidePath, activate back button
		$("#" + slideID + " .back-btn").removeClass("hidden");
		setTimeout(function() {
			$("#" + slideID + " .back-btn").addClass("fade-in");
		}, 50);
		// only allow jump-tos to work from the Master, or SharePreso instances
		if (
			$("body").hasClass("master") ||
			$("body").hasClass("share_online")
		) {
			$("#" + slideID + " .back-btn").on("click", function() {
				// Link to saved jumpFrom, this way the slidePath does not have to send options
				Bridge.Navigation.gotoSlide("{{deck}}/" + window.jumpFrom);
			});
		}
	}
}

//----------------------------------------------------//
// SET JUMP-TOS --------------------------------------//
//----------------------------------------------------//

window.jumpTo = "";
window.jumpFrom = "";

// Test for corresponding slides, turn jump-to on/off as required
function hideJumptos(slidePath, jumptos) {
	var slideArray = slidePath.split("/");
	var slideID = slideArray.length > 1 ? slideArray[1] : slideArray[0];

	_.each(jumptos, function(slides, jumpto) {
		// Set jumptoSlide as first occurrence in links array (slides)
		var jumptoSlide = _.find(slides, function(jumptpSlidePath) {
			return Bridge.Navigation.slideExists("{{deck}}/" + jumptpSlidePath);
		});

		if (_.isEmpty(jumptoSlide)) {
			// if no jumptoSlide is found, set to no-jumpto
			$("#" + slideID + " ." + jumpto).addClass("no-jumpto");
		} else {
			// if jumptoSlide is found, remove no-jumpto
			$("#" + slideID + " ." + jumpto).removeClass("no-jumpto");
		}
	});
}

// If a link slide is on, set jump-to to corresponding location
function setJumptos(slidePath, jumptos) {
	var slideArray = slidePath.split("/");
	var slideID = slideArray.length > 1 ? slideArray[1] : slideArray[0];

	_.each(jumptos, function(slides, jumpto) {
		// Set jumptoSlide as first occurrence in links array (slides)
		var jumpToSlidePath = _.find(slides, function(jumptpSlidePath) {
			return Bridge.Navigation.slideExists("{{deck}}/" + jumptpSlidePath);
		});

		if (!_.isEmpty(jumpToSlidePath)) {
			// if a jumpToSlidePath is found, link the jump-to to the first occurrence
			// only allow jump-tos to work from the Master, or SharePreso instances
			if (
				$("body").hasClass("master") ||
				$("body").hasClass("share_online")
			) {
				$("#" + slideID + " ." + jumpto).on("click", function() {
					// save jumpTo and jumpFrom in same format as prevSlide and currSlide
					window.jumpFrom = slidePath.toLowerCase();
					window.jumpTo = jumpToSlidePath.toLowerCase();
					Bridge.Navigation.gotoSlide("{{deck}}/" + jumpToSlidePath);
				});
			}
		}
	});
}

//----------------------------------------------------//
// ATTACH SLIDE EVENTS -------------------------------//
//----------------------------------------------------//

window.prevSlide = "";
window.currSlide = "";

function attachSlideEvents(properties) {
	properties = properties || [];

	var curSlide = '#' + Bridge.Slides.getArticleID();

	window.prevSlide = window.currSlide.replace("#", "");
	window.currSlide = curSlide.replace("#", "");

	var jumpToSlideArray = window.jumpTo.split("/");
	var jumpToSlideID =
		jumpToSlideArray.length > 1 ? jumpToSlideArray[1] : jumpToSlideArray[0];

	var jumpFromSlideArray = window.jumpFrom.split("/");
	var jumpFromSlideID =
		jumpFromSlideArray.length > 1
			? jumpFromSlideArray[1]
			: jumpFromSlideArray[0];

	// check if the last action was not a jump, reset jumpTo and jumpFrom
	if (
		!(
			jumpToSlideID === window.currSlide &&
			jumpFromSlideID === window.prevSlide
		)
	) {
		window.jumpTo = "";
		window.jumpFrom = "";
	}

	// Add currentpage class to the first subslide/content occurrence
	// required for animation and subslide functionality
	if ($(curSlide).find(".content").length > 1) {
		$(curSlide)
			.find("#subslide-1")
			.addClass("currentpage");
	} else {
		$($(curSlide).find(".content")[0]).addClass("currentpage");
	}

	if (_.contains(properties, "disclaimer")) {
		attachDisclaimerEvents(curSlide);
	}
	if (_.contains(properties, "popup")) {
		attachPopupEvents(curSlide);
	}
	if (_.contains(properties, "multipopup")) {
		attachMultiPopupEvents(curSlide);
	}

	// Check for subslides, and set if found
	if ($(curSlide + " .content.subslide").length) {
		setSubslides(curSlide);
	}
}

// ---------------------------------------------------//
// SALESPRESO BRIDGE disclaimer ----------------------//
// ---------------------------------------------------//

function attachDisclaimerEvents(disclaimerSelector) {
	console.log('disclaimer', disclaimerSelector);
	if($("body").hasClass("screenshot") || $("body").hasClass("screenshot-full")){
		$(disclaimerSelector + " .slide-footer").addClass(
			"disclaimer-active"
		)
	} else if ($("body").hasClass("master") || $("body").hasClass("share_online") || !$("body").hasClass("share_online")) {
		// Only fire the event if it is being triggered from the master
		// Code that takes the click
		$(disclaimerSelector + " .disclaimer-target").on("click", function() {
			// Only turn on/off the disclaimer, if the master/share_preso class'
			// footer is relevant. If you check on all, you can end up with alternating
			// disclaimers turning on and off (this happens if the client refreshes
			// with the wrong state activated)
			if (
				$(disclaimerSelector + " .slide-footer").hasClass(
					"disclaimer-active"
				)
			) {
				Bridge.Event.trigger(
					"slide:closeDisclaimer",
					disclaimerSelector
				);
			} else {
				Bridge.Event.trigger(
					"slide:openDisclaimer",
					disclaimerSelector
				);
			}
		});

		Bridge.Event.on("client:checkDisclaimer", function() {
			if (
				$(disclaimerSelector + " .slide-footer").hasClass(
					"disclaimer-active"
				)
			) {
				Bridge.Event.trigger(
					"slide:openDisclaimer",
					"body.client " + disclaimerSelector
				);
			} else {
				Bridge.Event.trigger(
					"slide:closeDisclaimer",
					"body.client " + disclaimerSelector
				);
			}
		});
	} else if ($("body").hasClass("client")) {
		// If the client is late in arriving, or refreshes mid-presentation
		// reflect the master's current disclaimer state in the client
		Bridge.Event.trigger("client:checkDisclaimer");
	}

	// Code that performs the "click" regardless of telepreso or actual click
	Bridge.Event.on("slide:closeDisclaimer", function(selector) {
		// Prevents class from being removed multiple times
		// This might happen when the client has requested disclaimer status
		// or if there are multiple clients arriving at different times
		$(selector + " footer.disclaimer-active").removeClass(
			"disclaimer-active"
		);
	});

	Bridge.Event.on("slide:openDisclaimer", function(selector) {
		// Prevents class from being added multiple times
		// This might happen when the client has requested disclaimer status
		// or if there are multiple clients arriving at different times
		if (!$(selector + " footer").hasClass("disclaimer-active")) {
			$(selector + " footer").addClass("disclaimer-active");
		}
	});
}

//----------------------------------------------------//
// SALESPRESO BRIDGE popup ---------------------------//
//----------------------------------------------------//

// BRIDGE popup events //

function attachPopupEvents(popupPage) {
	// Only stop popup information, and fire click events if it is being triggered from the master
	if ($("body").hasClass("master") || $("body").hasClass("share_online")) {

		var popupArray = [];

		// code that takes the click
		$(popupPage + " .overlay-btn").each(function(i) {
			// set up popup overlays available
			var popupOverlay = {};
			popupOverlay.btn =
				popupPage + " .overlay-btn.overlay-btn-" + (i + 1);
			popupOverlay.overlay = popupPage + " .overlay.overlay-" + (i + 1);
			popupOverlay.disclaimer = popupPage + " .overlay-disclaimer.overlay-disclaimer-" + (i + 1);
			popupOverlay.closeBtn =
				popupPage +
				" .overlay.overlay-" +
				(i + 1) +
				" .close-overlay-btn";
			popupOverlay.asset =
				popupPage + " .overlay-asset.overlay-" + (i + 1);

			popupArray[i] = popupOverlay;

			$(popupOverlay.btn).on("click", function() {

				// If popup is currently off, turn it on
				if (!$(popupOverlay.btn).hasClass("active")) {
					// turn off all popups
					Bridge.Event.trigger("slide:closeAllPopups");
					// Activate selected popup
					Bridge.Event.trigger("slide:activatePopup", popupOverlay);
				} else {
					// If already on, turn it off (with all other popups)
					Bridge.Event.trigger("slide:closeAllPopups");
				}
			});

			$(popupOverlay.closeBtn).on("click", function() {
				// just fire the event, nothing else to do!
				Bridge.Event.trigger("slide:closePopup", popupOverlay);
			});
		});

		Bridge.Event.on("client:fetchPopups", function() {
			_.each(popupArray, function(popup) {
				if ($(popup.btn).hasClass("active")) {
					// Reflect active popup in client
					Bridge.Event.trigger("slide:activatePopup", popup);
				} else {
					// Reflect deactive popup in client
					Bridge.Event.trigger("slide:closePopup", popup);
				}
			});
		});
	} else if ($("body").hasClass("client")) {
		// Request active popup(s) from master
		Bridge.Event.trigger("client:fetchPopups");
	}

	// Code that performs the 'click' regardless of telepreso or actual click
	Bridge.Event.on("slide:activatePopup", function(popupOverlay) {
		// Prevents class from being added multiple times
		// This might happen when the client has requested current popups
		// or if there are multiple clients arriving at different times
		if (!$(popupOverlay.btn).hasClass("active")) {
			// turn on selected popup
			$(popupOverlay.btn).addClass("active");
			$(popupOverlay.overlay).addClass("active");
			$(popupOverlay.asset).addClass("active");
			$(popupOverlay.disclaimer).addClass("active");
			$(popupPage).addClass("popup-active");
      $(popupPage + " .disclaimer-copy-default").removeClass("active");
		}
	});

	Bridge.Event.on("slide:closePopup", function(popupOverlay) {
		if ($(popupOverlay.btn).hasClass("active")) {
			// turn off selected popup

			// Prevents class from being removed multiple times
			// This might happen when the client has requested current popups
			// or if there are multiple clients arriving at different times
			if ($(popupOverlay.btn).hasClass("active")) {
				$(popupOverlay.btn).removeClass("active");
				$(popupOverlay.overlay).removeClass("active");
				$(popupOverlay.asset).removeClass("active");
        $(popupOverlay.disclaimer).removeClass("active");
        $(popupPage).removeClass("popup-active");
			}
		} else {
			// do nothing
		}
	});

	Bridge.Event.on("slide:closeAllPopups", function() {
		// Collect all active popups
		var overlayBtns = $(".overlay-btn.active");
		var overlayBodies = $(".overlay.active");
		var overlayAssets = $(".overlay-asset.active");
		var disclaimers = $(".overlay-disclaimer.active");

		// Loop through and deactivate all active popups
		_.each(overlayBtns, function(btn) {
			$(btn).removeClass("active");
		});
		_.each(overlayBodies, function(overlay) {
			$(overlay).removeClass("active");
		});
		_.each(overlayAssets, function(asset) {
			$(asset).removeClass("active");
		});
		_.each(disclaimers, function(disclaimer) {
			$(disclaimer).removeClass("active");
		});

    $(popupPage + " .disclaimer-copy-default").addClass("active");
    $(popupPage).removeClass("popup-active");

	});
}

//----------------------------------------------------//
// SALESPRESO BRIDGE multi-popup ---------------------//
//----------------------------------------------------//

// BRIDGE popup events //
// Have multiple popups open at once //

function attachMultiPopupEvents(popupPage) {
	var multiPopupArray = [];

	// code that takes the click
	$(popupPage + " .overlay-btn").each(function(i) {
		// set up popup overlays available
		var popupOverlay = [];
		popupOverlay[0] = popupPage + " .overlay-btn.overlay-btn-" + (i + 1);
		popupOverlay[1] = popupPage + " .overlay.overlay-" + (i + 1);
		popupOverlay[2] =
			popupPage + " .overlay.overlay-" + (i + 1) + " .close-overlay-btn";
		// console.log(popupOverlay);

		multiPopupArray[i] = popupOverlay;

		$(popupOverlay[0]).on("click", function() {
			// just fire the event, nothing else to do!
			// console.log(multiPopupArray[0][0]);
			Bridge.Event.trigger(
				"slide:activatePopup",
				popupOverlay,
				multiPopupArray
			);
		});

		$(popupOverlay[2]).on("click", function() {
			// just fire the event, nothing else to do!

			Bridge.Event.trigger("slide:closePopup", popupOverlay);
		});
	});

	// Code that performs the 'click' regardless of telepreso or actual click
	Bridge.Event.on("slide:activatePopup", function(popupOverlay, popupList) {
		// turn on selected popup
		$(popupOverlay[0]).addClass("active");
		$(popupOverlay[1]).addClass("active");
		$(popupOverlay[1]).removeClass("closed");
	});

	Bridge.Event.on("slide:closePopup", function(popupOverlay) {
		if ($(popupOverlay[0]).hasClass("active")) {
			$(popupOverlay[0]).removeClass("active");
			$(popupOverlay[1]).removeClass("active");
			$(popupOverlay[1]).addClass("closed");
		} else {
			// do nothing
		}
	});
}
