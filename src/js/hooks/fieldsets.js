import _ from "lodash";
import moment from "moment";
import Requests from "./utils/requests.js";

// fields
import { agentCode } from "./fieldsets/agent-code.js";

export default function(options) {
	const { Hidden, Fieldset, Token, Select, superagent } = options;

	return new Fieldset({
		fields: function({ data, context }) {
			const feedOptions = [
				{ label: "Production", value: "rea.storix.nextstudio.com.au" },
				{
					label: "Staging",
					value: "rea.staging.storix.nextstudio.com.au"
				}
			];

			const depthAPIOptions = [
				{
					label: "Production",
					value: "d2xpnl9r21uz0w.cloudfront.net/dev/customer"
				},
				{
					label: "Staging",
					value: "d2xpnl9r21uz0w.cloudfront.net/rea18303/customer"
				}
			];

			const viApiOptions = [
				{
					label: "Production",
					value: "d2xpnl9r21uz0w.cloudfront.net/dev"
				},
				{
					label: "Staging",
					value: "d2xpnl9r21uz0w.cloudfront.net/rea18303"
				}
			];

			const feedRCAOptions = [
				{
					label: 'Production',
					value: 'v1-0-1'
				},
				{
					label: 'Staging',
					value: 'dev'
				}
			];

			const suburbURL =
				"http://rea.storix.nextstudio.com.au/suburbs/search.json";

			Requests.init(options, data);

			// Suburbs selector for factsheet suburbs slides
			return [
				new Select(agentCode(options)),
				new Token({
					name: "suburbs",
					label: "Suburb(s)",
					maxChips: 10,
					description: "Maximum of 10 suburbs",

					onChange({ state }) {
						const shouldUpdate = state.suburbs.shouldComplete;

						if (shouldUpdate) {
							return superagent
								.get(suburbURL)
								.query({ q: state.suburbs.value })
								.then(function({ body: results }) {
									return {
										state: {
											suburbs: {
												data: (results || []).map(
													function(result) {
														return {
															label: result.name,
															value: result.id
														};
													}
												)
											}
										}
									};
								});
						}

						return {
							state: {
								suburbs: {
									data: []
								}
							}
						};
					},

					onSave: function({ value }) {
						return {
							context: {
								suburbs: _.map(value, function(result) {
									return result.label;
								})
							}
						};
					}
				}),

				// Feed host selector for Staging/Prod data testing
				new Select({
					name: "feed_host",
					label: "Feed source",
					value: feedOptions[0].value,
					options: feedOptions,
					onSave: function({ value }) {
						return {
							context: {
								feed_host: value
							}
						};
					}
				}),

				new Select({
					name: "depth_host",
					label: "Depth API source",
					value: depthAPIOptions[0].value,
					options: depthAPIOptions,
					onSave: function({ value }) {
						return {
							context: {
								depth_host: value
							}
						};
					}
				}),

				new Select({
					name: "vi_host",
					label: "VI API source",
					value: viApiOptions[0].value,
					options: viApiOptions,
					onSave: function({ value }) {
						return {
							context: {
								vi_host: value
							}
						};
					}
				}),
				
				new Select({
					name: "feed_rca_host",
					label: "Feed RCA source",
					value: feedRCAOptions[0].value,
					options: feedRCAOptions,
					onSave: function({ value }) {
						return {
							context: {
								feed_rca_host: value
							}
						};
					}
				})

			];
		},
		onLoad: function({ context }) {
			// Set up up ROI selection defaults
			var roiOptionsDefaults = {
				roi_options_your_years_performance: {
					channel: ""
				},
				roi_options_you_vs_market: {
					channel: "",
					group: "",
					suburb: ""
				},
				roi_options_your_historical_performance: {
					channel: "",
					group: "",
					suburb: ""
				},
				roi_options_product_performance_in_market: {
					channel: "",
					group: "",
					suburb: ""
				}
			};

			// Set up removable assets defaults
			var visibleStatsDefaults = {
				visible_stats_your_years_performance: [
					{
						name: "new_listings",
						visible: true,
						parent: "roi-product-stats"
					},
					{
						name: "email_enquiries",
						visible: true,
						parent: "roi-product-stats"
					},
					{
						name: "page_views",
						visible: true,
						parent: "roi-product-stats"
					},
					{
						name: "exceptions",
						visible: true,
						parent: "roi-pp-all-stats"
					},
					{
						name: "rental_uplift",
						visible: true,
						parent: "roi-pp-all-stats"
					},
					{
						name: "sponsorship_fund",
						visible: true,
						parent: "roi-sponsorship-stats"
					},
					{
						name: "free_upgrades",
						visible: true,
						parent: "roi-sponsorship-stats"
					}
				],
				visible_stats_you_vs_market: [
					{
						name: "median_price",
						visible: true
					},
					{
						name: "share_of_listings",
						visible: true
					},
					{
						name: "share_of_page_views",
						visible: true
					},
					{
						name: "days_on_site",
						visible: true
					},
					{
						name: "page_views",
						visible: true
					},
					{
						name: "email_enquiries",
						visible: true
					}
				],
				visible_stats_your_historical_performance: [
					{
						name: "median_price",
						visible: true
					},
					{
						name: "share_of_listings",
						visible: true
					},
					{
						name: "share_of_page_views",
						visible: true
					},
					{
						name: "days_on_site",
						visible: true
					},
					{
						name: "page_views",
						visible: true
					},
					{
						name: "email_enquiries",
						visible: true
					}
				],
				visible_stats_product_performance_in_market: [
					{
						name: "standard_listing",
						visible: true
					},
					{
						name: "feature_listing",
						visible: true
					},
					{
						name: "highlight_listing",
						visible: true
					},
					{
						name: "premiere_listing",
						visible: true
					}
				],
				visible_rows_product_performance_in_market: [
					{
						name: "roi_row_1",
						visible: true
					},
					{
						name: "roi_row_2",
						visible: true
					},
					{
						name: "roi_row_3",
						visible: true
					}
				]
			};

			// Set up marketing calculator defaults
			var marketingCalculatorDefaults = {
				marketing_calculator: {
					propertyCount: 0,
					landlord_pays: 0,
					inputs: [
						{
							title: "Professional Photography",
							value: ""
						},
						{
							title: "Other online portal",
							value: ""
						},
						{
							title: "Print",
							value: ""
						},
						{
							title: "Signboard",
							value: ""
						},
						{
							title: "Item 3",
							value: ""
						},
						{
							title: "Item 4",
							value: ""
						}
					],
					package: "Feature"
				},
				marketing_calculator_vendor: {
					propertyCount: 0,
					vendor_pays: 0,
					inputs: [
						{
							title: "Front Page",
							value: ""
						},
						{
							title: "Audience Maximiser",
							value: ""
						},
						{
							title: "Signboard",
							value: ""
						},
						{
							title: "Professional Photography",
							value: ""
						},
						{
							title: "other online portal",
							value: ""
						},
						{
							title: "Print",
							value: ""
						}
					],
					package: "Feature"
				},
				rent_advertising_and_connection_services_calculator: {
					properties_leased: 0,
					properties_marketed: 0,
					property_marketing_expense: 0,
					property_landlord_marketing_contribution: 0,
					tenants_connection_looking: 0,
					connections_per_tenant: 0,
					rent_contract_new: "Standard",
					rent_contract_current: "Standard"
				}
			};

			return {
				context: _.defaults(
					context,
					_.extend(
						roiOptionsDefaults,
						visibleStatsDefaults,
						marketingCalculatorDefaults
					)
				)
			};
		},
		onSave: function({ data, fields, context }) {
			var presoDate = "";
			var customer = { state: "vic" };
			var user = {};

			// Agent code taken from fieldset selector
			const agent_code = fields.agent_code;

			// Preso date
			if (_.isEmpty(context.preso_date)) {
				// If existing Preso preso_date is empty, add it.
				// Set as begin, if begin not available, set as user's current time (SharePreso PDFs)
				presoDate = data.appointment.begin || moment().format();
			} else if (data.appointment.begin !== context.preso_date) {
				// If previous date is different to new date, update preso_date with new begin.
				presoDate = data.appointment.begin;
			} else {
				// Else maintain same preso_start
				presoDate = context.preso_date;
			}

			if (!_.isEmpty(data.customers[0])) {
				var default_location = data.customers[0].default_location;
				var state =
					default_location && default_location.state
						? default_location.state.toLowerCase()
						: "vic";

				customer = {
					title: data.customers[0].title,
					id: data.customers[0].id,
					state
				};
			}

			if (!_.isEmpty(data.user)) {
				user = {
					first_name: data.user.first_name,
					last_name: data.user.last_name,
					email: data.user.email,
					phone: data.user.profile ? data.user.profile.phone : null
				};
			}

			var agency_contacts;

			superagent
				.get(`${data.urls.api}customers/${customer.id}/contacts/`)
				.set(data.headers)
				.then(({ body }) => {
					agency_contacts = body.results
				});

			const apiProxyURL = data.urls.api.replace("api", "api-proxy");
			var depthHost = context.fields.depth_host;
			var headers = data.headers;

			//Prod URLS
			const suburbURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/locations";
			const productPerformanceURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/depth/buy/all/all/product-performance";
			const marketComparisonURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/depth/buy/all/all/you-vs-market";
			const marketRentComparisonURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/depth/rent/all/all/you-vs-market";
			const performanceOverTimeURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/depth/buy/all/all/your-performance-over-time";
			const youVsMarketRankURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/depth/sold/all/all/you-vs-market-rank";
			const rankAgainstCompetitorsURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/depth/sold/all/all/rank-against-competitors";
			const amaxURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/amax-report";
			const ebrochureURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/ebrochure/Buy";
			const dateRangeURL =
				"https://" +
				depthHost +
				"/" +
				agent_code +
				"/date-ranges";
			var defaultDateRange;
			var dateKey;
			var dates;

			let agencyProfileRequests = new Promise((resolve, reject) => {
				let agencyProfileData = {};
				superagent
					.get(apiProxyURL)
					.set(headers)
					.query({ url: dateRangeURL })
					.then(({ body: results }) => {
						dateKey = results.twelve_months.yearMonthFrom;
						dates = results;
						defaultDateRange =
							"?yearMonthFrom=" +
							results.twelve_months.yearMonthFrom +
							"&yearMonthTo=" +
							results.twelve_months.yearMonthTo;
					})
					.then(() => {
						return superagent
							.get(apiProxyURL)
							.set(headers)
							.query({ url: suburbURL })
							.then(({ body: results }) => {
								var locationsBuy = _.orderBy(
									results,
									["listingsBuy"],
									["desc"]
								);
								locationsBuy = locationsBuy.slice(0, 10);
								var locationsRent = _.orderBy(
									results,
									["listingsRent"],
									["desc"]
								);
								locationsRent = locationsRent.slice(0, 10);

								agencyProfileData.topFiveSuburbs = {
									Rent: locationsRent,
									Buy: locationsBuy
								};
							})				
							.then(() => {
								return resolve(agencyProfileData);
							})
							.catch(err => {
								//@todo: implement error handling
								return reject("failed");
							});
					});
			});

			return agencyProfileRequests
				.then(res => {
					if (res.failed) {
						return {
							errors: {
								depth_host: [
									`Failed to fetch all data for ${customer.title}.`
								]
							}
						};
					} else {
						return {
							context: {
								preso_date: presoDate,
								depth_host: depthHost,
								contract_url: depthHost.substr(0, depthHost.lastIndexOf("/")),
								customer,
								user,
								state,
								agency_contacts,
								...res
							}
						};
					}
				})
				.catch(function(err) {
					return {
						// VI: Instead of returning Context sans data, potentially trigger error in state
						errors: {
							depth_host: [
								`Failed to fetch data for ${customer.title}, please try again.`
							]
						}
					};
				});
		}
	});
}
