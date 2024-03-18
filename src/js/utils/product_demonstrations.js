// ---------------------------------------------------//
// Product demo functionality ------------------------//
// ---------------------------------------------------//

var goToPrevScreen = function(button_obj) {
	var master = $("body").hasClass("master") || $("body").hasClass("share_online");

	if (master) {
		var product_demo = Bridge.Context.match(".product_demo", {});

		Bridge.Event.trigger("demo:gotoScreen", product_demo.curr_screen, product_demo.prev_screen, button_obj.animation);
		Bridge.Event.trigger("demo:scrollScreen", product_demo.prev_screen, 0);
	}
};

var buildDemo = function(slide_id, demo_obj) {
	var selected_country = Bridge.Context.match(".selected_country", "au");

	var $pageContainer = $("#" + slide_id);
	// Reset product demo each time
	Bridge.Context.set("product_demo", {});

	var master = $("body").hasClass("master") || $("body").hasClass("share_online");
	var presentingTele = $("body").hasClass("present") && $("body").hasClass("master") && !($("body").hasClass("livepreso") || $("body").hasClass("share_online"));
	var client = $("body").hasClass("client");

	var initialLoad = true;
	var scrollOffset = 0;
	var screenHeight = 0;

	var slideWidth = 1920;
	var slideHeight = 1080;

	var slideDimensions = $pageContainer[0].getBoundingClientRect();
	var screenDimensions = $(".demo__screens", $pageContainer)[0].getBoundingClientRect();

	var percentageMultiplier = slideDimensions.height / slideHeight;

	var getClick = function(e) {
		var click = e;
		// Touch events are wrapped, decipher before sending in
		if (e.type === "touchstart") {
			click = e.originalEvent;
		}
		// Android registers multiple touches, set as first
		if (e.touches && e.touches.length > 0) {
			click = e.touches[0];
		}

		return click;
	};

	var setOffset = function(click) {
		var product_demo = Bridge.Context.match(".product_demo", {});

		// Update slide and screen dimensions in the case of a resize
		slideDimensions = $pageContainer[0].getBoundingClientRect();
		screenDimensions = $(".demo__screens", $pageContainer)[0].getBoundingClientRect();
		screenHeight = $(".demo__screen.scrollable." + product_demo.curr_screen, $pageContainer)[0].getBoundingClientRect().height;

		// pixels from the top
		scrollOffset = click.pageY - (product_demo.top * screenDimensions.height);
	};

	var mouseMove = function(e) {
		var product_demo = Bridge.Context.match(".product_demo", {});

		var click = getClick(e);

		var scrollPos = (click.pageY - scrollOffset);
		var maxScroll = (-1 * screenHeight) + screenDimensions.height;

		if (scrollPos >= 0) {
			scrollPos = 0;
		} else if (scrollPos < maxScroll) {
			scrollPos = maxScroll;
		}

		scrollPos = scrollPos / screenDimensions.height;

		Bridge.Event.trigger("demo:scrollScreen", product_demo.curr_screen, scrollPos);
	}

	// Register Bridge Events
	Bridge.Event.on("demo:gotoScreen", function(curr_screen, destination, animation) {
		var product_demo = Bridge.Context.match(".product_demo", {});

		// Turn off button hints
		clearTimeouts(slide_id);
		removeHints();

		// Animate screens using JS based on button selection
		if (animation) {
			switch (animation) {
				case "slide-left":
					$(".demo__screen." + curr_screen, $pageContainer).css("left", "0%").animate({left: "100%"}, 500);
					$(".demo__screen." + destination, $pageContainer).css("left", "-100%").animate({left: "0%"}, 500);
				break;
				case "slide-right":
					$(".demo__screen." + curr_screen, $pageContainer).css("left", "0%").animate({left: "-100%"}, 500);
					$(".demo__screen." + destination, $pageContainer).css("left", "100%").animate({left: "0%"}, 500);
				break;
				default:
				break;
			}

			// Delay removal of "active" status until animation is complete
			window.slideTimeouts[slide_id].push(
				setTimeout(function() {
					$(".demo__screen." + curr_screen, $pageContainer).removeClass("active");
				}, 500)
			);
		} else {
			// If no animation, remove "active" and set all screens to center
			$(".demo__screen", $pageContainer).removeClass("active").css("left", "0%");
		}

		// Activate new screen
		$(".demo__screen." + destination, $pageContainer).addClass("active");

		product_demo.prev_screen = curr_screen;
		product_demo.curr_screen = destination;

		Bridge.Context.set("product_demo", product_demo);
	});

	Bridge.Event.on("demo:startScrolling", function() {
		var product_demo = Bridge.Context.match(".product_demo", {});
		
		product_demo.scrolling = true;

		Bridge.Context.set("product_demo", product_demo);
	});

	Bridge.Event.on("demo:stopScrolling", function() {
		var product_demo = Bridge.Context.match(".product_demo", {});
		
		product_demo.scrolling = false;

		Bridge.Context.set("product_demo", product_demo);
	});

	Bridge.Event.on("demo:scrollScreen", function(screen, posY) {
		var product_demo = Bridge.Context.match(".product_demo", {});

		// Scroll screen to new position - percentage
		$(".demo__screen.scrollable." + screen, $pageContainer).css("top", (posY * 100) + "%");

		product_demo.top = posY;

		Bridge.Context.set("product_demo", product_demo);
	});

	// Register generic functions
	var addHints = function() {
		if (!$(".demo__container").hasClass("recent-click")) {
			$(".demo__screens", $pageContainer).addClass("btn-hints");
		}
	};

	var removeHints = function() {
		$(".demo__screens", $pageContainer).removeClass("btn-hints");
	};

	// Loop through each screen, build and register
	_.each(demo_obj, function(screen_obj) {
		var screen = $("<div/>").addClass("demo__screen");
		screen.addClass(screen_obj.id);
		screen.attr("data-title", screen_obj.title);

		if (screen_obj.classes) {
			screen.addClass(screen_obj.classes);
		}

		if (initialLoad && screen_obj.default) {
			screen.addClass("active");

			Bridge.Context.set("product_demo", {
				prev_screen: null,
				curr_screen: screen_obj.id,
				scrolling: false,
				top: 0
			});

			initialLoad = false;
		}

		// if non-standard screen height has been supplied, override
		if (screen_obj.height) {
			screen.css("height", screen_obj.height);
		}

		if (screen_obj.scrollable) {
			screen.addClass("scrollable");

			if (master) {
				screen.on("mousedown touchstart", function(e) {
					// Get click (accounts for touch devices)
					var click = getClick(e);

					// set starting position of click
					setOffset(click);

					Bridge.Event.trigger("demo:startScrolling");

					// add mousemove eventListener to whole slide
					$pageContainer[0].addEventListener("mousemove", mouseMove);
					$pageContainer[0].addEventListener("touchmove", mouseMove);
				});
			}
		}

		// Loop through each button, build and register
		_.each(screen_obj.buttons, function(button_obj) {
			var button = $("<div/>").addClass("demo__btn");
			button.addClass(button_obj.id);
			button.attr("data-title", button_obj.title);

			if (button_obj.classes) {
				button.addClass(button_obj.classes);
			}

			var activateButton = function() {
				if (button_obj.action) {
					button_obj.action(button_obj);
				}
				if (!_.isEmpty(button_obj.destination)) {
					Bridge.Event.trigger("demo:gotoScreen", screen_obj.id, button_obj.destination, button_obj.animation);
					Bridge.Event.trigger("demo:scrollScreen", button_obj.destination, 0);
				}
			}

			// register clicks if from master
			if (master) {
				button.on("mousedown touchstart", function(e) {
					if (!screen_obj.scrollable) {
						activateButton();
					} else {
						$(".demo__screens", $pageContainer).addClass("mousedown");

						window.slideTimeouts[slide_id].push(
							setTimeout(function() {
								if (!$(".demo__screens", $pageContainer).hasClass("mousedown")) {
									activateButton();
								}
							}, 250)
						);
					}
				});
			}

			screen.append(button);
		});

		$(".demo__screens", $pageContainer).append(screen);
	});

	if (master) {
		var activateHints = function() {
			clearTimeouts(slide_id);
			addHints();

			window.slideTimeouts[slide_id].push(
				setTimeout(function() {
					removeHints();
				}, 1000)
			);
		};

		// Show button hints on background click of the demo
		$(".demo__container", $pageContainer).on("mousedown touchstart", function(e) {

			// Test background was clicked and not a button
			if (!_.some($(".demo__btn", $pageContainer), function(demo_btn) {
				return isDescendant(demo_btn, e.target);
			})) {
				// Test if screen clicked is scrollable
				if (_.some($(".demo__screen.scrollable", $pageContainer), function(demo_btn) {
					return isDescendant(demo_btn, e.target);
				})) {
					// Wait to test for click before activating hints
					$(".demo__screens", $pageContainer).addClass("mousedown");

					window.slideTimeouts[slide_id].push(
						setTimeout(function() {
							if (!$(".demo__screens", $pageContainer).hasClass("mousedown")) {
								activateHints();
							}
						}, 250)
					);
				} else {
					// Activate hints without delay
					activateHints();
				}
			}
		});

		$($pageContainer).on("mouseup touchend", function(e) {
			$(".demo__screens", $pageContainer).removeClass("mousedown");

			Bridge.Event.trigger("demo:stopScrolling");

			// remove mousemove eventListener
			$pageContainer[0].removeEventListener("mousemove", mouseMove);
			$pageContainer[0].removeEventListener("touchmove", mouseMove);
		});
	}

	if (presentingTele) {
		// Receive client's request for status, and navigate to current
		Bridge.Event.on("client:requestDemoStatus", function() {
			var product_demo = Bridge.Context.match(".product_demo", {});

			Bridge.Event.trigger("demo:gotoScreen", product_demo.prev_screen, product_demo.curr_screen);
			Bridge.Event.trigger("demo:scrollScreen", product_demo.curr_screen, product_demo.top);

			if (product_demo.scrolling) {
				Bridge.Event.trigger("demo:startScrolling");
			} else {
				Bridge.Event.trigger("demo:stopScrolling");
			}
		});

		// If the master is reloaded without the client for any reason
		// it should send out its current location to bring client into sync
		Bridge.Event.trigger("client:requestDemoStatus");

		var notificationID;

		var adjustNotifications = function(offset) {
			var notifications = $("#" + slide_id + " .notification-list").children();
			_.each(notifications, function(notification, notificationIndex) {
				var multiplier = notificationIndex - (offset || 0);
				if (multiplier < 0) { multiplier = 0; }
				var topVal = (multiplier * 54) + "px";
				$(notification).css("bottom", topVal);
			});
		};

		var generateNotification = function(name, value) {

			var notification = $("<p>");
			notification.addClass("notification-item");

			switch (value) {
				case "disconnect":
					notification.addClass("disconnected");
					// Norwegian translation if required
					if (selected_country === "no") {
						notification.html(name + " er <strong>frakoblet</strong>");
					} else {
						notification.html(name + " has <strong>disconnected</strong>");
					}
				break;
				case "connect":
					notification.addClass("connected");
					// Norwegian translation if required
					if (selected_country === "no") {
						notification.html(name + " er <strong>tilkoblet</strong>");
					} else {
						notification.html(name + " has <strong>connected</strong>");
					}
				default:
				break;
			}

			$("#" + slide_id + " .notification-list").append(notification);
			adjustNotifications();

			window.slideTimeouts[slide_id + "_notifications"].push(setTimeout(function() {
				notification.css("opacity", "0");
				window.slideTimeouts[slide_id + "_notifications"].push(setTimeout(function() {
					notification.remove();
					adjustNotifications();
				}, 500));
			}, 1000));
		};

		var masterSlideDimensions = $pageContainer[0].getBoundingClientRect();

		// Client cursor functions - The Ghost cursor (not over the iFrame)
		$("#" + slide_id + " .demo__container").on("mousemove", _.throttle(function(e) {
			// calculate mouse position based on percentages
			var cursorX = (e.pageX - masterSlideDimensions.left) / masterSlideDimensions.width * 100;
			var cursorY = (e.pageY - masterSlideDimensions.top) / masterSlideDimensions.height * 100;
			Bridge.Event.trigger("master:updateCursor", cursorX, cursorY);
		}, 50));

		$("#" + slide_id).on("mousedown", function(e) {
			Bridge.Event.trigger("master:clickCursor");
		});

		$("#" + slide_id).on("mouseup", function(e) {
			Bridge.Event.trigger("master:releaseCursor");
		});

		// Client collection
		var clientCollection = {};

		var testSync = function(slide_id){
			var masterStatus = Bridge.Context.match(".product_demo", {});

			if (!_.isEmpty(masterStatus)) {
				// Make sure client data is up to date.
				Bridge.Event.trigger("master:requestLatest");

				// Sync totals
				var outOfSync = 0;
				var inSync = 0;

				_.each(clientCollection, function(client, clientIndex) {
					if (client) {
						var clientStatus = "SYNCED";
						// if Bridge.Status is available
						if (Bridge.Status) {
							var tempStatus = Bridge.Status.getClientStatus(client.userID).status;
							// Only save the Status if it is Synced or Disconnected, otherwise, keep current value.
							// This ensures that are guaranteed to only be checking for one of two results.
							if (tempStatus === "DISCONNECTED" || tempStatus === "SYNCED") {
								clientStatus = tempStatus;
							}
						}

						clientCollection[clientIndex].prev_status = clientCollection[clientIndex].status;
						clientCollection[clientIndex].status = clientStatus;

						// If the status and prev_status differ, recognise as changed, and test
						// whether disconnected or connected.
						if (clientCollection[clientIndex].prev_status !== clientCollection[clientIndex].status) {
							if (clientCollection[clientIndex].status === "DISCONNECTED") {
								generateNotification(Bridge.Status.getClientStatus(client.userID).name, "disconnect");
							} else if (clientCollection[clientIndex].status === "SYNCED") {
								generateNotification(Bridge.Status.getClientStatus(client.userID).name, "connect");
							}
						}

						else if (clientStatus === "SYNCED") {
							// If the client's slide index matches the master's they are in sync
							if (client.curr_screen === masterStatus.curr_screen) {
								inSync += 1;
							// Else they are out of synE
							} else {
								outOfSync += 1;
							}
						} else {
							// This client is disconnected, do not add it to any counters.
						}
					}
				});

				// Display the final results
				// If there are no clients, assume that you are still waiting for them. This is
				// ok because setBridgeEvents is only run for TelePreso, which MUST have clients.
				// Also true if there are clients, but they are all "DISCONNECTED".

				// FIX-ME!!!
				if (_.isEmpty(clientCollection) || _.every(clientCollection, function(client) { return client.status === "DISCONNECTED" })) {
					var noun = "Client";
					if (Bridge.Status) {
						var clients = Bridge.Status.getClientStatus();
						if (clients.length > 1) {
							noun = "Clients";
						}
					}
					// Translate to Norwegian if selected
					if (selected_country === "no") {
						if (noun === "Client") {
							$("#" + slide_id).find(".client-sync").html("Venter pÃƒÂ¥ klient");
						} else {
							$("#" + slide_id).find(".client-sync").html("Venter pÃƒÂ¥ klienter");
						}
					} else {
						$("#" + slide_id).find(".client-sync").html("Waiting for " + noun);
					}

					$("#" + slide_id).find(".sync-indicator").removeClass("client-playing client-ready hidden");
					$("#" + slide_id).find(".sync-indicator").addClass("instruction-required");
				// If any client is out of sync
				} else if (outOfSync > 0) {
					var noun = "Client demo is";
					if (outOfSync > 1) {
						noun = "Client demos are";
					}
					// Translate to Norwegian if selected
					if (selected_country === "no") {
						if (noun === "Client demo is") {
							$("#" + slide_id).find(".client-sync").html("Klientdemo spilles av");
						} else {
							$("#" + slide_id).find(".client-sync").html("Klientdemoer spilles av");
						}
					} else {
						$("#" + slide_id).find(".client-sync").html(noun + " playing");
					}

					$("#" + slide_id).find(".sync-indicator").removeClass("instruction-required client-ready hidden");
					$("#" + slide_id).find(".sync-indicator").addClass("client-playing");
				// Everyone is in sync
				} else {
					var noun = "Client is";
					if (inSync > 1) {
						noun = "Clients are";
					}
					// Translate to Norwegian if selected
					if (selected_country === "no") {
						if (noun === "Client demo is") {
							$("#" + slide_id).find(".client-sync").html("Klienten er klar");
						} else {
							$("#" + slide_id).find(".client-sync").html("Klientene er klare");
						}
					} else {
						$("#" + slide_id).find(".client-sync").html(noun + " ready");
					}

					$("#" + slide_id).find(".sync-indicator").removeClass("client-playing instruction-required hidden");
					$("#" + slide_id).find(".sync-indicator").addClass("client-ready");
				}
			}
		};

		var resetTestSync = function() {
			// Reset testSync interval so that tests are not run while the client
			// is updating and sending new information
			clearIntervals(slide_id);
			window.slideIntervals[slide_id].push(
				setInterval(function() {
					testSync(slide_id);
				}, 500)
			);
		}

		// Show test sync results in master
		$("#" + slide_id).find(".sync-container").removeClass("hidden");

		// Client sends through its rego, and its most recently updated values
		Bridge.Event.on("client:sendSync", function(values, clients) {
			// New Captivate information will be sent each time as an object
			// This should be the ID number of the client that sent the request.

			var clientValues = clientCollection[clients.userID] || values;
			clientValues.curr_screen = values.curr_screen;
			clientValues.prev_screen = values.prev_screen;
			clientValues.scrolling = values.scrolling;
			clientValues.top = values.top;
			// FIX-ME: Implement this instead when lodash is available
			// clientValues = _.merge(clientValues, values);

			clientValues.userID = clients.userID;

			// update the clientCollection
			clientCollection[clients.userID] = clientValues;
		});

		// setInterval for Master's automated client sync testing
		clearIntervals(slide_id);
		window.slideIntervals[slide_id].push(
			setInterval(function() {
				testSync(slide_id);
			}, 500)
		);
	}

	if (client) {
		// Request master's current location and replicate
		Bridge.Event.trigger("client:requestDemoStatus");

		Bridge.Event.on("master:requestLatest", function() {
			var clientDemoStatus = Bridge.Context.match(".product_demo", {});

			Bridge.Event.trigger("client:sendSync", clientDemoStatus);
		});

		// Client cursor functions - The Ghost cursor
		Bridge.Event.on("master:updateCursor", function(cursorX, cursorY) {
			// get master's cursor position and overwrite div element's position
			$("#" + slide_id).find(".demo-cursor").css({top: cursorY + "%", left: cursorX + "%"});
		});

		Bridge.Event.on("master:clickCursor", function() {
			$("#" + slide_id).find(".demo-cursor").addClass("cursor-click");
		});

		Bridge.Event.on("master:releaseCursor", function() {
			$("#" + slide_id).find(".demo-cursor").removeClass("cursor-click");
		});
	}
}

var clearDemo = function(slide_id) {
	Bridge.Context.set("product_demo", {});

	clearIntervals(slide_id);
	clearTimeouts(slide_id);
};