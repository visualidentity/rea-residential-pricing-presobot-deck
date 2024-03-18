{% macro ready(slideID, videoID) %}

	if (!screenshot) {

		// Clear the player and set youTube vars to new slide
		window.player = null;
		window.youtubeSlideID = "{{ slideID }}";
		// window.youtubeAntiSubs = 1;
		window.youtubeContainer = "{{ slideID }}_player_container";
		window.youtubeVideo = "{{ videoID }}";
		window.youtubeWidth = {% if width %}{{width}}{% else %}1680{% endif %};
		window.youtubeHeight = {% if height %}{{height}}{% else %}760{% endif %};

		var loadVideo = function() {
			if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
				// Once the script is loaded, the YT API will
				// automatically call onYouTubeIframeAPIReady
				$.getScript("https://www.youtube.com/iframe_api");
			} else {
				window.onYouTubeIframeAPIReady();
			}
		}

		loadVideo();
	}

{% endmacro %}
