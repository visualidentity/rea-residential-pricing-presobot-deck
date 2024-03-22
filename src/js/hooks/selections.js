import _ from "lodash";

export default {
	onSave({ sections, data, context, feeds }) {
		// Create suburb subslide for "REA vs Domain Rent section searches" slide as required
		var multiSuburbData = (feeds && feeds.factsheet && feeds.factsheet.multi_suburb_data) ? feeds.factsheet.multi_suburb_data : [];
		var propertySearches = _.map(multiSuburbData, function(suburbData) {
			return (suburbData.rent && suburbData.rent.property_searches) ? suburbData.rent.property_searches : null;
		});

		// Clear out empty results
		propertySearches = _.reject(propertySearches, function(suburbEntry) {
			return _.isEmpty(suburbEntry)
		});

		// Fetch "REA vs Domain rent section searches" slide
		var flattenedSlides = _.flatten(_.map(sections, function(section) {
				return section.slides;
			}));


		if (propertySearches.length > 0) {
			// console.log('propertySearches (match_many)', propertySearches);
			var flattenedSearches =_.flatten(propertySearches);
			var suburbNames = _.uniqBy(_.map(flattenedSearches, 'suburb'));
			var totals = _.map(suburbNames, function(suburbName) {return {name: suburbName, rea:0, domain:0 };});

			// console.log('totals', totals);
			var sumFunc = function(memo, num){ return 0 + memo + parseInt(num); };

			for (var i = 0; i < totals.length; i++) {
				var total = totals[i];
				var suburb = total.name;
				var competitors = {rea: 'REA', domain:'Domain'};
				for (var targetParam in competitors) {
					var sourceParam = competitors[targetParam];
					// console.log(targetParam, sourceParam)
					var summedValues = _.reduce(
										_.map(
											_.filter(
												flattenedSearches,
												{search_type: 'Rent', competitor: sourceParam, suburb: suburb}
											),
											'searches'
										),
										sumFunc,
										0
									);
					total[targetParam] = summedValues;
				}
			}
			var suburbFsData = _.sortBy(totals, 'rea');
		}

		// Subslide generation for agency_ignite_usage

		// var agencyIgniteUsageSlide = _.find(flattenedSlides, function(slide) {
		// 	return slide.key === "agency_ignite_usage";
		// });

		// const agencyIgniteUsageItems = (feeds && feeds.agencyIgniteUsage && feeds.agencyIgniteUsage.agents) ? feeds.agencyIgniteUsage.agents : [];

		// const igniteUsageAgents = agencyIgniteUsageItems.length > 0 ? agencyIgniteUsageItems : [];

		// agencyIgniteUsageSlide.subslides = [];

		// for(let i = 0; i < Math.ceil(igniteUsageAgents.length / 4); i++) {
		// 	agencyIgniteUsageSlide.subslides.push({
		// 		title: `agency ignite usage page ${i + 1}`,
		// 		html_content: `<section class="subslide content page0${i+1}"></section>`,
		// 		slide: agencyIgniteUsageSlide.url,
		// 		enabled: true,
		// 		sequence: i
		// 	});
		// }

		// if(igniteUsageAgents.length === 0) {
		// 	agencyIgniteUsageSlide.subslides.push({
		// 		title: `agency ignite usage default`,
		// 		html_content: `<section class="suburb-searches-container subslide content page01"></section>`,
		// 		slide: agencyIgniteUsageSlide.url,
		// 		enabled: true,
		// 		sequence: 0
		// 	});
		// }

		// Subslide generation for agent_marketplace_performance

		// var agentAgencyMarketplacePerformanceSlide = _.find(flattenedSlides, function(slide) {
		// 	return slide.key === "agent_agency_marketplace_performance";
		// });

		var agentAgencyMarketplacePerformanceSubscriptionsSlide = _.find(flattenedSlides, function(slide) {
			return slide.key === "agent_agency_marketplace_performance_subscriptions";
		});

		const agentMarketplacePerformanceAgents = (feeds && feeds.agentMarketplacePerformance ) || [];

		if (agentAgencyMarketplacePerformanceSubscriptionsSlide) {
			agentAgencyMarketplacePerformanceSlide.subslides = [];
			agentAgencyMarketplacePerformanceSubscriptionsSlide.subslides = [];

			for(let i = 0; i < Math.ceil(agentMarketplacePerformanceAgents.length / 4); i++) {
				agentAgencyMarketplacePerformanceSlide.subslides.push({
					title: `agent marketplace performance page ${i + 1}`,
					html_content: `<section class="subslide content page0${i+1}"></section>`,
					slide: agentAgencyMarketplacePerformanceSlide.url,
					enabled: true,
					sequence: i
				});

				agentAgencyMarketplacePerformanceSubscriptionsSlide.subslides.push({
					title: `agent marketplace performance page ${i + 1}`,
					html_content: `<section class="subslide content page0${i+1}"></section>`,
					slide: agentAgencyMarketplacePerformanceSubscriptionsSlide.url,
					enabled: true,
					sequence: i
				});
			}

			if(agentMarketplacePerformanceAgents.length === 0) {
				agentAgencyMarketplacePerformanceSlide.subslides.push({
					title: `agent marketplace performance default`,
					html_content: `<section class="suburb-searches-container subslide content page01"></section>`,
					slide: agentAgencyMarketplacePerformanceSlide.url,
					enabled: true,
					sequence: 0
				});

				agentAgencyMarketplacePerformanceSubscriptionsSlide.subslides.push({
					title: `agent marketplace performance default`,
					html_content: `<section class="suburb-searches-container subslide content page01"></section>`,
					slide: agentAgencyMarketplacePerformanceSubscriptionsSlide.url,
					enabled: true,
					sequence: 0
				});
			}
		}

		const advantagePlusFY2425Items = (feeds && feeds.advantagePlusFY2425) && feeds.advantagePlusFY2425;
		var advantagePlusSlide25 = _.find(flattenedSlides, function(slide) {
			return slide.key === "advantage_plus_return_on_your_investment";
		});
		if (advantagePlusSlide25 && Object.keys(advantagePlusFY2425Items).length === 0) {
			advantagePlusSlide25.visible = false;
		}

		console.log({sections, feeds})
		// Hide these slides if data empty
		sections.forEach((section) => {
			//Select these slides on Presobot FY25 pillar
			if(section.key == 'fy25_presobot') {
				section.slides.forEach((slide) => {
					// Show/hide particular slide with its endpoint
					const isYourAgencyPerformanceHidden = slide.key === 'fy25_agency_performance' && !feeds.yourAgencyPerformance?.totalProperties;
					const isSubscriptionChangesHidden = slide.key == 'standard_subscription_changes' && feeds.subscriptionChanges?.subscriptionName !== "Standard";
					const isYourPricingOptionsHidden = slide.key == 'your_fy25_pricing_options' && (!Object.keys(feeds.YourPricingOptions).length || Object.values(feeds.YourPricingOptions).some(it => {
						return it === '' || typeof it === 'undefined' || it === null;
					}));

					if (
						isYourAgencyPerformanceHidden ||
						isSubscriptionChangesHidden ||
						isYourPricingOptionsHidden
					) slide.visible = false;
				});
			}
		});

		return sections;
	}
};
