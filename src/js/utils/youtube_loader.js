// At the moment, only one video can be loaded per slide. I plan to expand on
// this in the future with multiple players, but for the moment, only 1.

// Player to fill with video information
window.player = null;
window.playerPreOverlay = 0;

// slide ID
window.youtubeSlideID = "";
// Subslides that do NOT include the video slide.
// Single number, or an array of slides.
window.youtubeAntiSubs = null;

// Container ID to replace
window.youtubeContainer = "";

// YouTube video ID
window.youtubeVideo = "";

window.youtubeWidth = 0;
window.youtubeHeight = 0;

// Once iFrame has been set up, call onPlayerReady.
window.onPlayerReady = function() {
	// Stuff to do after the video is loaded.

	// Set playerPreOverlay mode to -1 (unstarted)
	window.playerPreOverlay = -1;

	// When overlay opens and closes, pause and unpause the video
	Bridge.Event.on("overlayopened", function() {
		if (window.player !== null) {
			window.playerPreOverlay = window.player.getPlayerState();
			if (
				$("body").hasClass("livepreso") &&
				window.playerPreOverlay === 1
			) {
				window.player.pauseVideo();
			}
			// Hide video (iOS7 Overlay fix)
			// setTimeout(function(){
			// $("#" + window.youtubeSlideID + " #" + window.youtubeContainer).addClass("hide-video");
			// }, 1000);
		}
	});

	Bridge.Event.on("overlayclosed", function() {
		if (window.player !== null) {
			// Reveal video (iOS7 Overlay fix)
			// $("#" + window.youtubeSlideID + " #" + window.youtubeContainer).removeClass("hide-video");
			// If previous player state was playing, return to playing, else leave paused.
			if (
				$("body").hasClass("livepreso") &&
				window.playerPreOverlay === 1
			) {
				window.player.playVideo();
			}
		}
	});

	// When popup overlay opens and closes, stop and restart the video
	Bridge.Event.on("video:stop", function() {
		if (window.player !== null) {
			window.player.stopVideo();
		}
	});

	if (window.youtubeAntiSubs) {
		// "#case_study .page01" or "#case_study .page01, #case_study .page03" etc.
		var elements = "";
		if (_.isArray(window.youtubeAntiSubs)) {
			_.each(window.youtubeAntiSubs, function(antiSub, subIndex) {
				if (subIndex === 0) {
					elements =
						"#" +
						window.youtubeSlideID +
						" .page" +
						padNum(antiSub, 2);
				} else {
					elements +=
						", #" +
						window.youtubeSlideID +
						" .page" +
						padNum(antiSub, 2);
				}
			});
		} else {
			elements =
				"#" +
				window.youtubeSlideID +
				" .page" +
				padNum(window.youtubeAntiSubs, 2);
		}
		// if YouTube video is located on a subslide, pause video when navigated away.
		// When navigating to subslides that do not include the video, pause the video.
		$(elements).on("startracksubslideready", function() {
			if (window.player !== null) {
				// pause video when relevant subslide is navigated away
				if (
					($("body").hasClass("livepreso") ||
						$("body").hasClass("client") ||
						$("body").hasClass("share_online")) &&
					window.player.getPlayerState() === 1
				) {
					window.player.pauseVideo();
				}
			}
		});
	}

	// FIX-ME: Request by Aaron when there is time.
	// Attempt to hijack the left and right keyboard buttons to navigate slides rather than scrub
	// $("#" + window.youtubeSlideID + " #" + window.youtubeContainer).on("keypress", function(e){
	//   debugger;
	// });
};

// Called automatically by the API once loaded, called by slide if API is already loaded.
window.onYouTubeIframeAPIReady = function() {
	window.player = new YT.Player(window.youtubeContainer, {
		videoId: window.youtubeVideo,
		width: window.youtubeWidth,
		height: window.youtubeHeight,
		events: {
			onReady: window.onPlayerReady
		},
		playerVars: {
			autohide: 1,
			modestbranding: 1,
			rel: 0, // turns off related videos display at the end
			fs: 0,
			wmode: "opaque"
		}
	});
};
