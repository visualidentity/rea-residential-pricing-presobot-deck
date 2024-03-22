window.Bridge.Event.on(
	"deckready",
	(e) => {
		const yourAgencyPerformance = window.Bridge.Feed.get(
			"yourAgencyPerformance"
		).raw();
		const subscriptionChanges = window.Bridge.Feed.get(
			"subscriptionChanges"
		).raw();
		const YourPricingOptions =
			window.Bridge.Feed.get("YourPricingOptions").raw() || {};

		const newSections = window.Bridge.Slides.getSections().map(
			(section) => ({
				...section,
				slides: section.slides.map((slide) => {
					let visible = slide.visible;

					const isYourAgencyPerformanceHidden =
						slide.key === "fy25_agency_performance" &&
						!yourAgencyPerformance?.totalProperties;
					const isSubscriptionChangesHidden =
						slide.key == "standard_subscription_changes" &&
						subscriptionChanges?.subscriptionName !== "Standard";
					const isYourPricingOptionsHidden =
						slide.key == "your_fy25_pricing_options" &&
						(!Object.keys(YourPricingOptions).length ||
							Object.values(YourPricingOptions).some(
								(it) => {
									return it === '' || typeof it === 'undefined' || it === null;
								}
							));

					if (
						isYourAgencyPerformanceHidden ||
						isSubscriptionChangesHidden ||
						isYourPricingOptionsHidden
					) {
						visible = false;
					}

					return {
						...slide,
						visible,
					};
				}),
			})
		);

		window.Bridge.Slides.updateSections(newSections);
	},
	"deck"
);
