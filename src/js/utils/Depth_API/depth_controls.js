var attachDepthEvents = function ($pageContainer, slide, renderCallback, api, config, disclaimerTemplate, defaultContextStore  = {}) {
	var $postcode, $propertyType, $dateRange,  $tabs, $autocomplete, $suburbBarElem, $dateBarElem, $refresh, agent_id, suburbBar, dateBar;
	var prepMode = $("body").hasClass("preview") ? true : false;
	var master = $("body").hasClass("master") ? true : false;
	var client = $("body").hasClass("client") ? true : false;
	var settings = config || {};
	var dateRanges = Bridge.Feed.get("dateRanges").raw();
	var dateRangesQuarterly = Bridge.Context.match(".take-the-test-date-range", []);
	var contextStore = {
		"Rent": [],
		"Buy": [],
		"postcode": "all",
		"area": "all",
		"table": {},
		"type": "All",
		"Channel": (slide != 'how_you_rank_leads' || slide != 'how_do_you_rank_agency_performing' || slide != 'how_do_you_rank_luxe') ? "Buy" : "Leads",
		"suburbs": {},
		"dateRange": (slide === 'take-the-test' && dateRangesQuarterly) ? dateRangesQuarterly[0].yearMonthFrom : dateRanges ? dateRanges.twelve_months.yearMonthFrom : "",
		...defaultContextStore,
		"dateRangeSelection": []
	};

	_init()

	function _init() {
		$postcode = $pageContainer.find('[data-input-text]');
		$propertyType = $pageContainer.find('.property-type');
		$dateRange = $pageContainer.find('.date-range');
		$autocomplete = $pageContainer.find('.input_text-autocomplete');
		$tabs = $pageContainer.find('.input__tab');
		$refresh = $pageContainer.find('[data-refresh-block]');
		$suburbBarElem = $pageContainer.find('[data-suburb-bar-suburbs]');
		// $dateBarElem = $pageContainer.find('[data-date-bar-dates]');
		$addDateElem = $pageContainer.find('[data-add]');
		agent_id = Bridge.Context.match(".customer .agent_code", '') ? Bridge.Context.match(".customer .agent_code", '') : 'SHQZZM'; 
		_.assign(contextStore, Bridge.Context.match('.' + slide, {}));
		$tabs.parent().find('[data-value=' + contextStore.Channel + ']').addClass('active');
		$propertyType.find('.input-label').html(contextStore.type);
		console.log('dateRangesQuarterly[0]: ', dateRangesQuarterly[0]);
		console.log('contextStore.dateRange: ', contextStore.dateRange);
		var dateRangeObj = getDateRangeObject(contextStore.dateRange);
		var dateRangeQuarterlyObj = getDateRangeQuarterlyObject(contextStore.dateRange);
		console.log('dateRangeQuarterlyObj: ', dateRangeQuarterlyObj);
		if (slide === 'take-the-test' && dateRangeQuarterlyObj && dateRangeQuarterlyObj.label) {
			$dateRange.find('.input-label').html(dateRangeQuarterlyObj.label);
		} else if (dateRangeObj && dateRangeObj.label) {
			$dateRange.find('.input-label').html(dateRangeObj.label);
		}
		console.log('contextStore: ', contextStore);

		suburbBar = contextStore.suburbs.suburbs ?
			new SuburbBar(contextStore.suburbs.suburbs, $pageContainer) :
			new SuburbBar([], $pageContainer);
		dateBar = contextStore.dateRangeSelection ?
			new DateBar(contextStore.dateRangeSelection, $pageContainer) :
			new DateBar([], $pageContainer);
		if (_.isEmpty(contextStore.table)) {
			console.log('Context returned empty response, submitting to API.');
			if (!client) {
				_submit()
			}

		} else {
			console.log('Rendering with Context data.');
			var data = {
				response: contextStore.table,
				type: contextStore.type,
				channel: contextStore.Channel
			}
			Bridge.Event.trigger('render_data--' + slide, data);

			if (slide === 'amax') {
				_submit();
				var amaxData = {
					response: contextStore.table,
					type: "All",
					channel: contextStore.Channel
				}
				Bridge.Event.trigger('render_data--amax', amaxData)
			} else if (slide === 'ebrochure') {
				_submit();
				var brochureData = {
					response: contextStore.table,
					type: contextStore.type,
					channel: contextStore.Channel
				}
				Bridge.Event.trigger('render_data--brochure', brochureData)
			} else {
				renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
			}
		}
		if (client) {
			$('.input--text').find('input').prop('disabled', true);
			_bindMasterEvents();
			Bridge.Event.trigger("client:getState");
		} else {
			_bindEvents();
		}

		if (disclaimerTemplate) {
			$pageContainer.find('.disclaimer-copy').html(disclaimerTemplate(
				{ date: 'May 2020 - Apr 2021'}
			));
		}
	}

	function _bindEvents() {
		//bind events from control bar
		$postcode.on('keyup', function (e) {
			Bridge.Event.trigger('populate_postcode_field--' + slide, e.target.value);
			if (e.target.value.length >= 3 && e.keyCode != 13) {
				//begin autocomplete function
				var $list = $('<ul/>');
				var results = autocompleteLocations(e.target.value);

				_.forEach(results, function (item, index) {
					$list.append('<li class="autocomplete__suggestion" data-value="' + item.postcode + '">' + item.suburb + ', ' + item.postcode + '</li>');
				})

				$autocomplete.html($list);
				if (results.length > 0) {
					$autocomplete.addClass('is-visible');
				}
				$('.autocomplete__suggestion').on('click keyup', function (e) {
					console.log(e.keyCode);
					$postcode.val('');
					Bridge.Event.trigger('populate_postcode_field--' + slide, '');

					// if(slide === 'rank_against_competitors'){
					// 	suburbBar.replaceSuburbs([]);
					// }

					suburbBar.addSuburb($(this).html());
					var postcode = suburbBar.getSuburbObject().postcodesString;
					var response = Bridge.Context.match('.' + slide + ' ' + ' .' + contextStore.Channel + ' .' + contextStore.dateRange + ' .' + postcode, {});
					_.assign(contextStore, {
						area: $(this).html(),
						postcode: postcode,
						table: response,
						suburbs: suburbBar.getSuburbObject()
					});

					console.log('contextStore', contextStore)
					Bridge.Context.set(slide, contextStore);
					if(slide === "you_vs_market_rank" || slide === "rank_against_competitors" || slide === "how_you_rank_leads" || slide === "how_you_rank_leads" || slide === "rank_against_competitors_fy24" || slide === "product_performance" || slide === "market_comparison" || slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing') {
						_submit()
					} else {
						if (_.isEmpty(contextStore.table)) {
							_submit()
						} else {
							renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
							var masterData = {
								response: contextStore.table,
								type: contextStore.type,
								channel: contextStore.Channel,
								suburbs: contextStore.suburbs
							}
							Bridge.Event.trigger('render_data--' + slide, masterData)
						}
					}
					$autocomplete.html('');
					$autocomplete.removeClass('is-visible');
				})
			} else {
				$autocomplete.html('');
				$autocomplete.removeClass('is-visible');
			}
		})

		$suburbBarElem.on('remove-suburb', function(item) {
			var postcodes = suburbBar.getSuburbObject().suburbs.length > 0 ? suburbBar.getSuburbObject().postcodesString : 'all';
			var response = Bridge.Context.match('.' + slide + ' ' + ' .' + contextStore.Channel + ' .' + contextStore.dateRange + ' .' + postcodes, {});

			_.assign(contextStore, {
				suburbs: suburbBar.getSuburbObject(),
				table: response,
				postcode: postcodes
			});
			Bridge.Context.set(slide, contextStore);
			if(slide === "you_vs_market_rank" || slide === "rank_against_competitors" || slide === "how_you_rank_leads" || slide === "rank_against_competitors_fy24" || slide === "product_performance" || slide === "market_comparison" || slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing') {
				_submit()
			} else if (_.isEmpty(contextStore.table)) {
				_submit()
			} else {
				renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
				var masterData = {
					response: contextStore.table,
					type: contextStore.type,
					channel: contextStore.Channel,
					suburbs: contextStore.suburbs
				}
				Bridge.Event.trigger('render_data--' + slide, masterData)
			}

		});

		$propertyType.on('dropdown-value-changed', function (e) {
			_.assign(contextStore, {
				type: $(this).attr('data-selected')
			});
			Bridge.Context.set(slide, contextStore);
			renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
			var masterData = {
				response: contextStore.table,
				type: contextStore.type,
				channel: contextStore.Channel,
				suburbs: contextStore.suburbs
			}
			Bridge.Event.trigger('render_data--' + slide, masterData)
		});

		$dateRange.on('dropdown-value-changed', function (e) {
			var response = Bridge.Context.match('.' + slide + ' ' + ' .' + contextStore.Channel + ' .' + $(this).attr('data-selected') + ' .' + contextStore.postcode, {});
			_.assign(contextStore, {
					dateRange: $(this).attr('data-selected'),
					table: response
			});
			Bridge.Context.set(slide, contextStore);
			if (_.isEmpty(contextStore.table)) {
				console.log('submit');
				_submit();
			} else {
				if (slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing' || slide === 'how_do_you_rank_luxe') {
					_submit();
				} else if (slide === 'amax') {
					renderCallback.renderDataAmaxData(contextStore.table, contextStore.type, contextStore.Channel)
					var amaxData = {
						response: contextStore.table,
						type: "All",
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--amax', amaxData)
				} else if (slide === 'ebrochure') {
					renderCallback.renderDataeBrochureData(contextStore.table, contextStore.type, contextStore.Channel)
					var brochureData = {
						response: contextStore.table,
						type: contextStore.type,
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--brochure', brochureData)
				} else {
					renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
				}
				var masterData = {
						response: contextStore.table,
						type: contextStore.type,
						channel: contextStore.Channel,
						suburbs: contextStore.suburbs
				}
				Bridge.Event.trigger('render_data--' + slide, masterData)
			}
			var tempDateRange = $('.date-range .input-label', $pageContainer).text();
			$('[data-sourceDate]', $pageContainer).text(tempDateRange);
		})

		$tabs.on('click', function (e) {
			$(this).parent().find('span').removeClass('active');
			$(this).addClass('active');
			Bridge.Event.trigger('tab_change--' + slide, $(this).attr('id'));
			var response = Bridge.Context.match('.' + slide + ' ' + ' .' + $(this).attr('data-value') + ' .' + contextStore.dateRange  + ' .' + contextStore.postcode, {});
			_.assign(contextStore, {
				Channel: $(this).attr('data-value'),
				table: response
			});
			Bridge.Context.set(slide, contextStore);
			if (_.isEmpty(contextStore.table)) {
				_submit()
			} else {
					if (slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing' || slide === 'how_do_you_rank_luxe') {
						_submit();
					} else if (slide === 'amax') {
		           renderCallback.renderDataAmaxData(contextStore.table, contextStore.type, contextStore.Channel)
		           var amaxData = {
						response: contextStore.table,
						type: "All",
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--amax', amaxData)
		        } else if (slide === 'ebrochure') {
		          renderCallback.renderDataeBrochureData(contextStore.table, contextStore.type, contextStore.Channel)
					var brochureData = {
						response: contextStore.table,
						type: contextStore.type,
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--brochure', brochureData)
		        } else {
		          renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
		        }
				var masterData = {
					response: contextStore.table,
					type: contextStore.type,
					channel: contextStore.Channel,
					suburbs: contextStore.suburbs
				}
				Bridge.Event.trigger('render_data--' + slide, masterData)
			}
		})

		// $addDateElem.on('click', function (e) {
		// 	dateBar.addDate($pageContainer.find('.date-range .input-label').text());
		// 	_.assign(contextStore, {
		// 		dateRangeSelection: dateBar.getDateObject()
		// 	});

		// 	console.log('contextStore: ', contextStore);
		// })

		$refresh.on('click', function (e) {
			$postcode.val('');
			var dateRanges = Bridge.Feed.get("dateRanges").raw();
			var response = Bridge.Context.match('.' + slide + ' ' + ' .' + contextStore.Channel + ' .' +  dateRanges.twelve_months.yearMonthFrom + ' .' + 'all', {});
			_.assign(contextStore, {
				table: response,
				postcode: "all",
				area: 'all',
				suburbs: {},
				dateRange: dateRanges.twelve_months.yearMonthFrom
			});
			suburbBar.replaceSuburbs([]);

			// if (slide !== 'product_performance' && slide !== 'market_comparison_rent' && slide !== 'your_performance_over_time_fy24_buy' && slide !== 'your_performance_over_time_fy24_rent' && slide !== 'how_you_rank_leads' && slide !== 'how_do_you_rank_agency_performing' && slide !== 'how_do_you_rank_luxe' && slide !== 'you_vs_the_market_agency_performing') {
			// 	dateBar.replaceSuburbs([]);
			// }
			
			$dateRange.find('.input-label').html(getDateRangeObject(contextStore.dateRange).label);
			Bridge.Context.set(slide, contextStore);
			if (_.isEmpty(contextStore.table)) {
				_submit()
				Bridge.Event.trigger('populate_postcode_field--' + slide, contextStore.area);
			} else {
				if (slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing') {
					_submit()
					Bridge.Event.trigger('populate_postcode_field--' + slide, contextStore.area);
				} else if (slide === 'amax') {
		          renderCallback.renderDataAmaxData(contextStore.table, contextStore.type, contextStore.Channel)
		           var amaxData = {
						response: contextStore.table,
						type: "All",
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--amax', amaxData)
		        } else if (slide === 'ebrochure') {
		          renderCallback.renderDataeBrochureData(contextStore.table, contextStore.type, contextStore.Channel)
					var brochureData = {
						response: contextStore.table,
						type: contextStore.type,
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--brochure', brochureData)
		        } else {
		          renderCallback.renderData(contextStore.table, contextStore.type, contextStore.Channel, contextStore.suburbs);
		        }
				var masterData = {
					response: contextStore.table,
					type: contextStore.type,
					channel: contextStore.Channel,
					suburbs: contextStore.suburbs
				}
				Bridge.Event.trigger('render_data--' + slide, masterData)
				Bridge.Event.trigger('populate_postcode_field--' + slide, contextStore.area);
			}

		})

		Bridge.Event.on("client:getState", function () {
			var data = {
				response: contextStore.table,
				type: contextStore.type,
				channel: contextStore.Channel,
				suburbs: contextStore.suburbs
			}
			Bridge.Event.trigger('renderSuburbs', {suburbs: contextStore.suburbs.suburbs ? contextStore.suburbs.suburbs : [], index: 0});
			Bridge.Event.trigger('render_data--' + slide, data);
			Bridge.Event.trigger('tab_change--' + slide, contextStore.Channel.toLowerCase());
			Bridge.Event.trigger('property_type_change--' + slide, contextStore.type);
			Bridge.Event.trigger('date_range_change--' + slide, getDateRangeObject(contextStore.dateRange).label);
		});
	}

	function _bindMasterEvents() {
		Bridge.Event.on('render_data--' + slide, function (data) {
			renderCallback.renderData(data.response, data.type, data.channel, data.suburbs);
		});

		Bridge.Event.on('render_data--amax', function (data) {
			renderCallback.renderDataAmaxData(data.response, data.type, data.channel);
		});

		Bridge.Event.on('render_data--brochure', function (data) {
			renderCallback.renderDataeBrochureData(data.response, data.type, data.channel);
		});

		Bridge.Event.on('tab_change--' + slide, function (tab) {
			console.log(tab);
			$('.input__tab--' + tab).parent().find('span').removeClass('active');
			$('.input__tab--' + tab).addClass('active');
		});


		Bridge.Event.on('populate_postcode_field--' + slide, function (value) {
			$postcode.val(value);
		});

		Bridge.Event.on('property_type_change--' + slide, function (value) {
			$propertyType.find('.input-label').html(value);
		});

		Bridge.Event.on('date_range_change--' + slide, function (value) {
			$dateRange.find('.input-label').html(value);
		});
	}

	function _submit() {
		var host = Bridge.Context.match('.depth_host', 'd2xpnl9r21uz0w.cloudfront.net/dev/customer');
		var url = _.template('https://<%= host %>/<%= agent_id %>/depth/<%= channel %>/<%= suburbs %>/<%= postcodes %>/<%= api %>?yearMonthFrom=<%= from %>&yearMonthTo=<%= to %>');
		var customerUrl = _.template('https://<%= host %>/<%= agent_id %>/<%= api %>/<%= postcodes %>?yearMonthFrom=<%= from %>&yearMonthTo=<%= to %>');
		var luxeUrl = _.template('https://<%= host %>/<%= agent_id %>/depth/<%= suburbs %>/<%= postcodes %>/<%= api %>?yearMonthFrom=<%= from %>&yearMonthTo=<%= to %>');
		var pathlessURL = _.template('https://<%= host %>/<%= agent_id %>/<%= api %>');
		var amaxURL = _.template('https://<%= host %>/<%= agent_id %>/<%= api %>?yearMonthFrom=<%= from %>&yearMonthTo=<%= to %>');
		var amaxCampaignPerformanceURL = _.template('https://d2xpnl9r21uz0w.cloudfront.net/rea18303/rea/pricing-preset/<%= api %>/<%= agent_id %>?yearMonthFrom=<%= from %>&yearMonthTo=<%= to %>');
		var ebrochureURL = _.template('https://<%= host %>/<%= agent_id %>/<%= api %>/<%= channel %>?yearMonthFrom=<%= from %>&yearMonthTo=<%= to %>');

		var loaderOptions = {
			toggle: true,
			message: "Fetching data",
			action: "Try again"
		};
		var dateObject = settings.takeTheTest ? getDateRangeQuarterlyObject(contextStore.dateRange) : getDateRangeObject(contextStore.dateRange);
		console.log('contextStore.dateRange', contextStore.dateRange);
		Bridge.Event.trigger("loader:toggleLockdown", loaderOptions);
		$pageContainer.find('.-new__control-block__loading').addClass('loading');

		var urlParameter = settings.pathless ? pathlessURL({
			host: host,
			agent_id: agent_id,
			api: api
		}) : settings.amax ? amaxURL({
			host: host,
			agent_id: agent_id,
			api: api,
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : ''
		}) : settings.amaxCampaignPerformance ? amaxCampaignPerformanceURL({
			agent_id: agent_id,
			api: api,
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : ''
		}) : settings.ebrochure ? ebrochureURL({
			host: host,
			agent_id: agent_id,
			api: api,
			channel: contextStore.Channel,
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : ''
		}) : (settings.rank && contextStore.Channel === "Leads") ? customerUrl({
			host: host,
			agent_id: agent_id,
			api: "leads-rank/all",
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : '',
			postcodes: contextStore.postcode !== 'all' ? contextStore.suburbs.postcodesString : 'all'
		}) : settings.rank ? url({
			host: host,
			agent_id: agent_id,
			api: api,
			channel: contextStore.Channel === "Buy" ? "sold" : "new",
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : '',
			suburbs: contextStore.postcode !== 'all' ? contextStore.suburbs.suburbsString : 'all',
			postcodes: contextStore.postcode !== 'all' ? contextStore.suburbs.postcodesString : 'all',
		}) : settings.luxe ? luxeUrl({
			host: 'd2xpnl9r21uz0w.cloudfront.net/rea18303/luxepreset',
			agent_id: agent_id,
			api: api,
			channel: contextStore.Channel === "Buy" ? "sold" : "new",
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : '',
			suburbs: contextStore.postcode !== 'all' ? contextStore.suburbs.suburbsString : 'all',
			postcodes: contextStore.postcode !== 'all' ? contextStore.suburbs.postcodesString : 'all',
		}) : settings.takeTheTest ? url({
			host: host,
			agent_id: agent_id,
			api: api,
			channel: contextStore.Channel === "Buy" ? "sold" : "new",
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : '',
			suburbs: contextStore.postcode !== 'all' ? contextStore.suburbs.suburbsString : 'all',
			postcodes: contextStore.postcode !== 'all' ? contextStore.suburbs.postcodesString : 'all',
		}) : url({
			host: host,
			agent_id: agent_id,
			channel: contextStore.Channel,
			suburbs: contextStore.postcode !== 'all' ? contextStore.suburbs.suburbsString : 'all',
			postcodes: contextStore.postcode !== 'all' ? contextStore.suburbs.postcodesString : 'all',
			api: api,
			from: dateObject ? dateObject.yearMonthFrom : '',
			to: dateObject ? dateObject.yearMonthTo : ''
		});

		console.log('urlParameter: ', urlParameter);

		var [origin, parameters] = urlParameter.split('?');

		var removedEmptyParameters= parameters.replace(/[^=&]+=(&|$)/g,"").replace(/&$/,"");

		urlParameter = `${origin}${removedEmptyParameters ? `?${removedEmptyParameters}` : ""}`;

		console.log('urlParameter:', urlParameter);

		Bridge.Request.get(`/api-proxy/`, {
			query: {
				url: urlParameter
			}
		})
			.then(function (response) {
				Bridge.Event.trigger("loader:toggleLockdown", {
					toggle: false
				});

				if (slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing' || slide === 'how_do_you_rank_luxe') {
					var data = {
						response: response,
						type: "All",
						channel: contextStore.Channel
					}

					Bridge.Event.trigger('render_data--' + slide, data)
				}

				$pageContainer.find('.agent-branded-new__control-block__loading').removeClass('loading');
				var object = {}
				object[contextStore.dateRange] = {};
				object[contextStore.dateRange][contextStore.postcode] = response;
				if (!contextStore[contextStore.Channel]) {
					contextStore[contextStore.Channel] = []
				}
				contextStore[contextStore.Channel].push(object);

				Bridge.Context.set(slide, contextStore);
				_.assign(contextStore, {
					type: "All",
					table: response
				});
				Bridge.Context.set(slide, contextStore);

				if (slide === 'amax') {
					renderCallback.renderDataAmaxData(response, "All", contextStore.Channel)
					var amaxData = {
						response: contextStore.table,
						type: "All",
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--amax', amaxData)
				} else if (slide === 'ebrochure') {
					renderCallback.renderDataeBrochureData(response, "All", contextStore.Channel)
					var brochureData = {
						response: contextStore.table,
						type: "All",
						channel: contextStore.Channel
					}
					Bridge.Event.trigger('render_data--brochure', brochureData)
				} else if (slide === 'how_you_rank_leads' || slide === 'how_do_you_rank_agency_performing' || slide === 'how_do_you_rank_luxe') {
					renderCallback.renderData(contextStore.table,);
				} else {
					renderCallback.renderData(contextStore.table, "All", contextStore.Channel, contextStore.suburbs);
				}


				if (slide != 'how_you_rank_leads' || slide != 'how_do_you_rank_agency_performing' || slide != 'how_do_you_rank_luxe') {
					var data = {
						response: contextStore.table,
						type: "All",
						channel: contextStore.Channel
					}

					Bridge.Event.trigger('render_data--' + slide, data)
				}
			})
			.catch(function (e) {
				Bridge.Event.trigger("loader:updateMode", "action-required");
				Bridge.Event.trigger("loader:updateMessage", "Data fetched failed, please try again later");
				$pageContainer.find('.agent-branded-new__control-block__loading').removeClass('loading');
				console.error("Failure");
				renderCallback.renderMissingStats();
				console.error(e);
			});

			if (disclaimerTemplate) {
				$pageContainer.find('.disclaimer-copy').html(disclaimerTemplate(
					{ date: dateObject.label ? dateObject.label : 'Feb 2020 - Jan 2021'}
				));
			}
	}
	if (master) {
		Bridge.Event.on("loader:actionClicked", function () {
			_submit();
		});
	}

	function getDateRangeObject(date) {
		var dateRanges = Bridge.Feed.get("dateRanges").raw();
		return _.find(dateRanges, function(item) {return item.yearMonthFrom === date});
	}

	function getDateRangeQuarterlyObject(date) {
		var dateRanges = Bridge.Context.match(".take-the-test-date-range", []);
		return _.find(dateRanges, function(item) {return item.yearMonthFrom === date});
	}
}
