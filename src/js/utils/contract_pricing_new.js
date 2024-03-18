var contractPricingNew = function ($pageContainer, channel, breakdown) {

	var tempChannel = channel === "BuyBreakdown" ? 'Buy' : channel
	var $tableContainer = $pageContainer.find('.column > .table-container');
	var $optionSelect = $pageContainer.find('.option-selector');
	$tableContainer.hide();
	$optionSelect.hide();

	var suburbs;
	var $postcode;
	var $package;
	var $ebrochure;
	var $switch;
	var $optionPackage;
	var $optionSelector;
	var $options;
	var $table;
	var $dailyTable;
	var $tableControls;
	var storePath;
	var $refresh;
	var $pricingStandard;
	var $brochureVal = 0;
	var $audienceVal = 0;

	switch(channel) {
		case 'Buy':
			// code block
			storePath = 'contract_pricing_buy_new'
			break;
		case 'BuyBreakdown':
			storePath = 'contract_pricing_buy_new_breakdown'
			break;
		default:
			storePath = 'contract_pricing_rent_new'
			// code block
	}

	var client = $("body").hasClass("client") ? true : false;
	var screenshotMode = $("body").hasClass("screenshot-full");
	var contextStore = {
		"packages" : [],
		"Channel" : channel,
		"packageId": "",
		"contractTitle": "",
		"dropdownTitle" : "Contract type",
		"suburbTitle" : "",
		"dropdownData" : [],
		"eBrochureTitle" : "",
		"eBrochureValue" : 0,
		"amaxTitle" : "",
		"amaxValue" : 0,
		"options": [
			{
				"title": "",
				"packageId": "",
				"table": ""
			},
			{
				"title": "",
				"packageId": "",
				"table": ""
			},
			{
				"title": "",
				"packageId": "",
				"table": ""
			}
		],

		"currentSuburbs" : [],
		"suburbIndex": 0,
		"table": {},
		"optionsHidden" : [],
		"optionsHiddenRent" : []
	};
	_init();

	function _init() {
		//Grab page variables
		suburbs = Bridge.Context.match(".topFiveSuburbs", {});

		$table = $pageContainer.find('.table-data');
		$dailyTable = $pageContainer.find('.daily-pricing-table-data');
		$postcode = $pageContainer.find('#postcode');
		$package = $pageContainer.find('#packages');
		$ebrochure = channel === 'BuyBreakdown' ? null : $pageContainer.find('.ebrochure-dropdown');
		$audience = channel === 'BuyBreakdown' ? null : $pageContainer.find('.audience-dropdown');
		$switch = $pageContainer.find('.input__tab');
		$optionSelector = $pageContainer.find('[data--contract-option-selector]');
		$options = $pageContainer.find('.option__selection');
		$optionPackage = $pageContainer.find('#optionPackage');
		$refresh = $pageContainer.find('.agent-branded-new__control-block__refresh');
		$tableControls = $pageContainer.find('.table-controls');
		$pricingStandard = $pageContainer.find(".pricing-content__result");

		$pageContainer.find('.agent-branded-new__content').addClass('buy').removeClass('rent');


		_.assign(contextStore, Bridge.Context.match('.'+storePath, contextStore));

		if (suburbs[tempChannel]) {
			_.assign(contextStore, {currentSuburbs: chunkArray(suburbs[tempChannel], 7)});
		}

		Bridge.Context.set(storePath, contextStore);
		//Hide option selector if configured
		if ($pageContainer.find('.agent-branded-new__content').hasClass('buy')) {
			if (contextStore.optionsHidden.length > 0) {
				if (contextStore.optionsHidden.length == 3) {
					$pageContainer.find('.buy .column-group').addClass('hideOptions');
				} else {
					$.each(contextStore.optionsHidden, function( index, value ) {
						$pageContainer.find('.buy .option-selector .option__selection').eq(value).hide();
					});
				}
			}
		}
		if ($pageContainer.find('.agent-branded-new__content').hasClass('rent')) {
			if (contextStore.optionsHiddenRent.length > 0) {
				if (contextStore.optionsHiddenRent.length == 3) {
					$pageContainer.find('.rent .column-group').addClass('hideOptions');
				} else {
					$.each(contextStore.optionsHiddenRent, function( index, value ) {
						$pageContainer.find('.rent .option-selector .option__selection').eq(value).hide();
					});
				}
			}
		}
		$pageContainer.addClass('is-ready').fadeIn();

		if(!_.isEmpty(contextStore.table)) {
			console.log('Rendering with Context data.');
				var data = {
					context : contextStore,
					suburbs : suburbs
				}
				Bridge.Event.trigger('renderData', data)

			_renderData(contextStore);

		}


		//If telepreso bind client events else bind regular events
		if(client) {
			$('.input--text').find('input').prop('disabled', true);
			_bindMasterEvents();
			Bridge.Event.trigger("client:getState");
		} else {
			_bindEvents();
		}
	}

	function _bindEvents() {

		if (contextStore.optionsHidden) {
			$pageContainer.find('.buy .option-selector').hide();
		} else {
			$pageContainer.find('.buy .option-selector').fadeIn();
		}

		if (contextStore.optionsHiddenRent) {
			$pageContainer.find('.rent .option-selector').hide();
		} else {
			$pageContainer.find('.rent .option-selector').fadeIn();
		}

		$pageContainer.find('.column > .table-container').fadeIn();

		//bind events from control bar
		$postcode.on('keyup', function (e) {
			Bridge.Event.trigger('populateContractPostcodeField', e.target.value);
			var $autocomplete = $(this).parent().find('.input_text-autocomplete');
			if (e.target.value.length >= 3 && e.keyCode != 13) {
				//begin autocomplete function
				var $list = $('<ul/>');
				var results = autocompleteLocations(e.target.value);

				_.forEach(results, function (item, index) {
					$list.append('<li class="autocomplete__suggestion"  data-listingsRent="'+ item.listingsRent +'" data-listingsBuy="'+ item.listingsBuy +'" data-location-id="' + item.id + '">' + item.locationAlias + '</li>');
				})

				$autocomplete.html($list);

				if (results && results.length > 0) {
					$autocomplete.addClass('is-visible'); 
				}

				$('.autocomplete__suggestion').on('click', function (e) {					
					if($pricingStandard.length) { 
						$postcode.val($(this).text());
					} else {
						$postcode.val('');
					}
					Bridge.Event.trigger('populateContractPostcodeField', '');
					var suburb = {
						locationId:  $(this).attr('data-location-id'),
						locationAlias:  $(this).html(),
						listingsRent:  $(this).attr('data-listingsRent'),
						listingsBuy:  $(this).attr('data-listingsBuy')
					}
					var currentSuburbs = contextStore.currentSuburbs;
					currentSuburbs[0].splice(1,1);
					currentSuburbs[0].unshift(suburb);
					var newSuburbs = _.flatten(currentSuburbs);
					suburbs[tempChannel] = newSuburbs;
					Bridge.Context.set('topFiveSuburbs', suburbs);
	
					_.assign(contextStore, {
						currentSuburbs: currentSuburbs,
						suburbTitle: suburb.locationAlias
					});
					Bridge.Context.set(storePath, contextStore);

					_submit()
					$autocomplete.html('').removeClass('is-visible');
				})
			} else {
				$autocomplete.html('').removeClass('is-visible');
			}
		})
		
		if (channel === 'BuyBreakdown') {
      
      var ids = [667];
			// var ids = [549, 555, 560, 561];
			// var testIds = [400, 522, 408];

			var packagesFeed = JSON.parse(JSON.stringify(Bridge.Feed.get("packages").raw()));
			console.log('packages: ', packagesFeed);

			var packages = _.filter(packagesFeed, function(i) {			
				return ids.indexOf(i.id) !== -1;
			});

			var dropdownData = _.map(packages, function(item) {
				return {
					title: item.displayName,
					value: item.id
				};
			});

      if (ids.length > 1) {

        _.assign(contextStore, {
          dropdownData: dropdownData 
        });

        attachDropdown($pageContainer, dropdownData, '.packages');

        $pageContainer.find('.packages').on('dropdown-value-changed', function (e) {
          var packageId = $(e.target).attr('data-selected');
          var	title =  $(e.target).find('[data-value="'+packageId+'"]').text();
          Bridge.Event.trigger('populatePackageField', title);

          var response = contextStore.packages[contextStore.packageId];
          _.assign(contextStore, {
            packageId: packageId,
            contractTitle: title,
            dropdownTitle: title,
            table: response
          });
          Bridge.Context.set(storePath, contextStore);

          if(_.isEmpty(contextStore.table)) {
            _submit()
          }
          else {
            _renderData(contextStore);
          }

        })
      } else {

        if (packages.length !== 0) {
          var title = packages[0].displayName;
          var packageId =  packages[0].id;
          Bridge.Event.trigger('populatePackageField', title);
          var response = contextStore.packages[contextStore.packageId];
          _.assign(contextStore, {
            packageId: packageId,
            contractTitle: title,
            dropdownTitle: title,
            table: response
          });
          Bridge.Context.set(storePath, contextStore);

          if(_.isEmpty(contextStore.table)) {
            _submit()
          }
          else {
            _renderData(contextStore);
          }
        }

        console.log('packages', packages);
        // 


      }
			
		} else {

			$package.on('keyup', function (e) {
				var $autocomplete = $(this).parent().find('.input_text-autocomplete');
				Bridge.Event.trigger('populatePackageField', e.target.value);
				if (e.target.value.length >= 3 && e.keyCode != 13) {
					//begin autocomplete function

					var $list = $('<ul/>');
					var results = autocompletePackages(e.target.value);

					_.forEach(results, function (item, index) {
						if (!(/^(645|646|647|473|469|475|477|561|560|563|562)$/.exec(item.id))) {
							$list.append('<li class="autocomplete__suggestion" data-value="' + item.id + '">' + item.name + '</li>');
						}
					})

					$autocomplete.html($list);
					
					if (results && results.length > 0) {
						$autocomplete.addClass('is-visible');
					}

					$('.autocomplete__suggestion').on('click', function (e) {
						Bridge.Event.trigger('populatePackageField', '');
						// if($pricingStandard.length) { 
						// 	$package.val($(this).text());
						// } else {
						// 	$package.val('');
						// }						
						var response = contextStore.packages[contextStore.packageId];
						_.assign(contextStore, {
							packageId: $(this).attr('data-value'),
							contractTitle: $(this).html(),
							table: response
						});
						Bridge.Context.set(storePath, contextStore);

						console.log('test: ', $(this).html());

						if(_.isEmpty(contextStore.table)) {
							_submit()
						}
						else {
							_renderData(contextStore);
						}
						$autocomplete.html('').removeClass('is-visible');
					})
				} else {
					$autocomplete.html('').removeClass('is-visible');
				}
			})
		}

		$options.find('.option__header').on('click', function(e) {
			$optionSelector.addClass('visible');
			$optionSelector.attr('data-selection', $(this).attr('data-selection'));
			$optionSelector.find('h5').html($(this).attr('data-header'));
		})

		$optionSelector.find('.contract-option-selector__header__close').on('click', function(e) {
			$optionSelector.removeClass('visible');

		})

		$optionPackage.on('keydown', function (e) {
			var $autocomplete = $(this).parent().find('.input_text-autocomplete');
			if (e.target.value.length >= 3 && e.keyCode != 13) {
				//begin autocomplete function

				var $list = $('<ul/>');
				var results = autocompletePackages(e.target.value);

				console.log(results);

				_.forEach(results, function (item, index) {
					$list.append('<li class="autocomplete__suggestion" data-value="' + item.id + '">' + item.name + '</li>');
				})

				$autocomplete.html($list).addClass('is-visible');
				$('.autocomplete__suggestion').on('click', function (e) {
					$optionPackage.val($(this).html());
					var packageId = parseInt($(this).attr('data-value'));
					$autocomplete.html('');
					var option = $optionSelector.attr('data-selection');

					var response = contextStore.packages[contextStore.packageId];

					contextStore.options[option] = {
						title: $(this).html(),
						packageId: packageId,
						table: response
					}
					Bridge.Context.set(storePath, contextStore);


					if(_.isEmpty(contextStore.options[option].table)) {
						_submit(true, packageId, $optionSelector.attr('data-selection'), $optionPackage.val());
					}
					else {
						_renderData(contextStore);
					}

					$optionSelector.removeClass('visible').removeClass('is-visible')
				})
			} else {
				$autocomplete.html('').removeClass('is-visible');
			}
		})

		$tableControls.on('click', function(e) {
			var direction = $(e.target).data('control');
			if(direction === 'next') {
				var length = contextStore.currentSuburbs.length;
				if(contextStore.suburbIndex < length-1) {
					var index = contextStore.suburbIndex + 1;
					_.assign(contextStore, {suburbIndex: index});
					Bridge.Context.set(storePath, contextStore);
					_renderData(contextStore);
				}
			}
			else {
				if(contextStore.suburbIndex > 0) {
					var index = contextStore.suburbIndex - 1;
					_.assign(contextStore, {suburbIndex: index});
					Bridge.Context.set(storePath, contextStore);
					_renderData(contextStore);
				}
			}
			var data = {
				context : contextStore,
				suburbs : suburbs
			}
			Bridge.Event.trigger('renderData', data);
		})

		Bridge.Event.on("client:getState", function() {
			var data = {
				context : contextStore,
				suburbs : suburbs
			}
			Bridge.Event.trigger('renderData', data)
			Bridge.Event.trigger('master:hideOptions', contextStore.optionsHidden, channel);
			Bridge.Event.trigger('master:hideOptions', contextStore.optionsHiddenRent, channel);
		});

		$pageContainer.find('.remove-icon').on('click', function() {
			console.log('option: ', $(this).closest('.option__selection').index());
			if ($pageContainer.find('.agent-branded-new__content').hasClass('buy')) {
				contextStore.optionsHidden.push($(this).closest('.option__selection').index());
			} else {
				contextStore.optionsHiddenRent.push($(this).closest('.option__selection').index());
			}

			contextStore.optionsHidden = [...new Set(contextStore.optionsHidden)];
			contextStore.optionsHiddenRent = [...new Set(contextStore.optionsHiddenRent)];

			console.log('contextStore: ', contextStore);
			
			Bridge.Context.set(storePath, contextStore);

			if ($pageContainer.find('.agent-branded-new__content').hasClass('buy')) {
				if (contextStore.optionsHidden.length > 0) {
					if (contextStore.optionsHidden.length == 3) {
						$pageContainer.find('.buy .column-group').addClass('hideOptions');
					} else {
						$.each(contextStore.optionsHidden, function( index, value ) {
							$pageContainer.find('.buy .option-selector .option__selection').eq(value).hide();
						});
					}
				}
			}
			if ($pageContainer.find('.agent-branded-new__content').hasClass('rent')) {
				if (contextStore.optionsHiddenRent.length > 0) {
					if (contextStore.optionsHiddenRent.length == 3) {
						$pageContainer.find('.rent .column-group').addClass('hideOptions');
					} else {
						$.each(contextStore.optionsHiddenRent, function( index, value ) {
							$pageContainer.find('.rent .option-selector .option__selection').eq(value).hide();
						});
					}
				}
			}
			
			Bridge.Event.trigger('master:hideOptions', contextStore.optionsHidden, channel);
			Bridge.Event.trigger('master:hideOptions', contextStore.optionsHiddenRent, channel);
		})

		$refresh.on('click', function(e) {
			_clearData()
		})

		var ebrochureValues = Bridge.Feed.get("ebrochurePricepoints").raw();
		var audienceValues = [
			{
				id: 0,
				name: 'No Audience Maximiser'
			},
			{
				id: 175,
				name: '$175 - Basic'
			},
			{
				id: 299,
				name: '$299 - Bronze'
			},
			{
				id: 399,
				name: '$399 - Silver'
			},
			{
				id: 649,
				name: '$649 - Gold'
			}
		]

		// eBrochrue Dropdown
		if (!(channel === 'BuyBreakdown')) {
			$ebrochure.find('.dropdown-icon').after().html('<ul></ul>');
			$audience.find('.dropdown-icon').after().html('<ul></ul>');

			_.forEach(ebrochureValues[channel.toLowerCase()], function (item, index) {
				$ebrochure.find('ul').append('<li data-value="' + item.price + '" data-brochure-child>' + item.name + '</li>');
			});

			$ebrochure.on('click', function() {
				$ebrochure.find('ul').toggle();
			});

			_.forEach(audienceValues, function (item, index) {
				$audience.find('ul').append('<li data-value="' + item.id + '" data-audience-child>' + item.name + '</li>');
			});

			$audience.on('click', function() {
				$audience.find('ul').toggle();
			});

			var $brochureChild = $pageContainer.find('[data-brochure-child]');
			$brochureChild.on('click', function() {
				$brochureVal = $(this).attr('data-value').substring(1);
				$ebrochure.find('h6').text($(this).text());

				_.assign(contextStore, {
					eBrochureTitle: $(this).text(),
					eBrochureValue: $brochureVal
				});
				Bridge.Context.set(storePath, contextStore);

				Bridge.Event.trigger('populateBrochureField', {text: $(this).text(), value: $brochureVal});

				_renderData(contextStore);
			});

			var $audienceChild = $pageContainer.find('[data-audience-child]');
			$audienceChild.on('click', function() {
				$audienceVal = $(this).attr('data-value');

				_.assign(contextStore, {
					amaxTitle: $(this).text(),
					amaxValue: $audienceVal
				});
				Bridge.Context.set(storePath, contextStore);

				Bridge.Event.trigger('populateAudienceField', {text: $(this).text(), value: $audienceVal});

				_renderData(contextStore);
			})

			// Switch
			$switch.on('click', function() {
				$switch.removeClass('active');
				$(this).addClass('active');

				$ebrochure.find('ul').html('');
				$audience.find('ul').html('');

				if ($(this).attr('data-value') === 'Buy') {
					channel = 'Buy';
					storePath = 'contract_pricing_buy_new';
					$pageContainer.find('.agent-branded-new__content').addClass('buy').removeClass('rent');
				} else {
					channel = 'Rent';
					storePath = 'contract_pricing_rent_new';
					$pageContainer.find('.agent-branded-new__content').addClass('rent').removeClass('buy');
				}

				console.log('storePath: ', storePath);

				_.forEach(ebrochureValues[channel.toLowerCase()], function (item, index) {
					$ebrochure.find('ul').append('<li data-value="' + item.price + '" data-brochure-child>' + item.name + '</li>');
				}) 
	
				var $brochureChild = $pageContainer.find('[data-brochure-child]');
				$brochureChild.on('click', function() {
					$brochureVal = $(this).attr('data-value').substring(1);

					_.assign(contextStore, {
						eBrochureTitle: $(this).text(),
						eBrochureValue: $brochureVal
					});
					Bridge.Context.set(storePath, contextStore);
	
					Bridge.Event.trigger('populateBrochureField', {text: $(this).text(), value: $brochureVal});
	
					_renderData(contextStore);
				})

				$($brochureChild[0]).trigger('click');
				$ebrochure.find('ul').toggle();

				_.forEach(audienceValues, function (item, index) {
					$audience.find('ul').append('<li data-value="' + item.id + '" data-audience-child>' + item.name + '</li>');
				});

				var $audienceChild = $pageContainer.find('[data-audience-child]');
				$audienceChild.on('click', function() {
					$audienceVal = $(this).attr('data-value');

					_.assign(contextStore, {
						amaxTitle: $(this).text(),
						amaxValue: $audienceVal
					});
					Bridge.Context.set(storePath, contextStore);

					Bridge.Event.trigger('populateAudienceField', {text: $(this).text(), value: $audienceVal});

					_renderData(contextStore);
				})

				$($audienceChild[0]).trigger('click');
				$audience.find('ul').toggle();

				Bridge.Event.trigger('populatePackageField', '');
				$package.val($('.autocomplete__suggestion').text());		

				Bridge.Context.set(storePath, contextStore);
				_.assign(contextStore, {
					packageId: contextStore.packageId,
					contractTitle: $('.table__title').html()
				});
				Bridge.Context.set(storePath, contextStore);

				console.log('context: ', contextStore);

				if ($pageContainer.find('.agent-branded-new__content').hasClass('buy')) {
					if (contextStore.optionsHidden.length > 0) {
						if (contextStore.optionsHidden.length == 3) {
							$pageContainer.find('.buy .column-group').addClass('hideOptions');
						} else {
							$.each(contextStore.optionsHidden, function( index, value ) {
								$pageContainer.find('.buy .option-selector .option__selection').eq(value).hide();
							});
						}
					}
				}
				if ($pageContainer.find('.agent-branded-new__content').hasClass('rent')) {
					if (contextStore.optionsHiddenRent.length > 0) {
						if (contextStore.optionsHiddenRent.length == 3) {
							$pageContainer.find('.rent .column-group').addClass('hideOptions');
						} else {
							$.each(contextStore.optionsHiddenRent, function( index, value ) {
								$pageContainer.find('.rent .option-selector .option__selection').eq(value).hide();
							});
						}
					}
				}

				_submit(false);
				contextStore.options[0].packageId && _submit(true, contextStore.options[0].packageId, 0, $('.autocomplete__suggestion').html());
				contextStore.options[1].packageId && _submit(true, contextStore.options[1].packageId, 1, $('.autocomplete__suggestion').html());
				contextStore.options[2].packageId && _submit(true, contextStore.options[2].packageId, 2, $('.autocomplete__suggestion').html());

				Bridge.Event.trigger('channelField', {channel: $(this).attr('data-value')});
			})
		}
	}

	function _bindMasterEvents() {
		Bridge.Event.on("renderOptionSelector", function(data) {
			_renderOptions(data.response, data.package, data.option, data.optionId);
		  });

		Bridge.Event.on("renderData", function(data) {
			contextStore = data.context;
			suburbs = data.suburbs;
			_renderData()
		  });

		Bridge.Event.on("clearData", function(tab) {
			_clearData()
		  });

		Bridge.Event.on("populatePackageField", function(value) {
			$package.val(value);
		});

		Bridge.Event.on("populateContractPostcodeField", function(value) {
			$postcode.val(value);
		});

		Bridge.Event.on("populateBrochureField", function(data) {
			_.assign(contextStore, {
				eBrochureTitle: data.text,
				eBrochureValue: data.value
			});
			Bridge.Context.set(storePath, contextStore);

			_renderData(contextStore);
		});

		Bridge.Event.on("populateAudienceField", function(data) {
			_.assign(contextStore, {
				amaxTitle: data.text,
				amaxValue: data.value
			});
			Bridge.Context.set(storePath, contextStore);

			_renderData(contextStore);
		});

		Bridge.Event.on("channelField", function(data) {
			$switch.removeClass('active');
			$('.input__tab[data-value="' + data.channel + '"]').addClass('active');

			if (data.channel === 'Buy') {
				channel = 'Buy';
				storePath = 'contract_pricing_buy_new';
				$pageContainer.find('.agent-branded-new__content').addClass('buy').removeClass('rent');
			} else {
				channel = 'Rent';
				storePath = 'contract_pricing_rent_new';
				$pageContainer.find('.agent-branded-new__content').addClass('rent').removeClass('buy');
			}

			$($audienceChild[0]).trigger('click');
				$audience.find('ul').toggle();

				Bridge.Event.trigger('populatePackageField', '');
				$package.val($('.autocomplete__suggestion').text());		

				Bridge.Context.set(storePath, contextStore);
				_.assign(contextStore, {
					packageId: contextStore.packageId,
					contractTitle: $('.table__title').html()
				});
				Bridge.Context.set(storePath, contextStore);

				console.log('context: ', contextStore);

				_submit(false);
				contextStore.options[0].packageId && _submit(true, contextStore.options[0].packageId, 0, $('.autocomplete__suggestion').html());
				contextStore.options[1].packageId && _submit(true, contextStore.options[1].packageId, 1, $('.autocomplete__suggestion').html());
				contextStore.options[2].packageId && _submit(true, contextStore.options[2].packageId, 2, $('.autocomplete__suggestion').html());
		});

		Bridge.Event.on("master:hideOptions", function(value, inst) {
			$.each(value, function( index, value ) {
				$pageContainer.find('.' + inst.toLowerCase() + ' .option-selector .option__selection').eq(value).hide();
			});
			if (inst == 'Buy') {
				if (contextStore.optionsHidden.length > 0) {
					if (contextStore.optionsHidden.length == 3) {
						$pageContainer.find('.buy .column-group').addClass('hideOptions');
					} else {
						$.each(contextStore.optionsHidden, function( index, value ) {
							$pageContainer.find('.buy .option-selector .option__selection').eq(value).hide();
						});
					}
				}
			} else {
				if (contextStore.optionsHiddenRent.length > 0) {
					if (contextStore.optionsHiddenRent.length == 3) {
						$pageContainer.find('.rent .column-group').addClass('hideOptions');
					} else {
						$.each(contextStore.optionsHiddenRent, function( index, value ) {
							$pageContainer.find('.rent .option-selector .option__selection').eq(value).hide();
						});
					}
				}
			}
			$optionSelect.fadeIn();
			$tableContainer.fadeIn();
		});
	}

	function _submit(comparison, option, optionId, pkg) {
		$pageContainer.find('.agent-branded-new__control-block__loading').addClass('loading');
		var loaderOptions = {
			toggle: true,
			message: "Fetching data",
			action: "Try again"
		};

		Bridge.Event.trigger("loader:toggleLockdown", loaderOptions);
		var buy = {
			"products" : [
				"premiere-buy",
				"highlight-buy",
				"feature-buy",
				"ebrochure-buy",
				"audience-maximiser"
			],
			"filters" : [
					{
					"type": "section",
					"section": "Buy"
				}
			]
		}
		var rent = {
			"products" : [
				"premiere-rent",
				"highlight-rent",
				"feature-rent",
				"ebrochure-rent",
				"audience-maximiser"
			],
			"filters" : [
				{
					"type": "section",
					"section": "Rent"
				}
			]
		}
		var rentFilters = [{
				"type": "section",
				"section": "Rent"
			}
		];

		var filter = channel === "Buy" || channel === "BuyBreakdown" ? buy : rent;
		var supplement = {
			"packages": [
				contextStore.packageId
			],
			"products": filter.products,
			"pricingPoints": [],
			"filters": filter.filters
		};
		if(comparison) {
			supplement.packages[0] = option;
		}

		_.forEach(suburbs[tempChannel], function(item, index) {
			if (item.locationId) {
				var suburb = [{
					"type" : "location",
					"id" : item.locationId
				}];
				supplement.pricingPoints.push(suburb);
			}
		})
		console.log('supplement', supplement);
		var uri = $.param(supplement);
		uri = encodeURIComponent(JSON.stringify(supplement));

		// For getting test data for development
		// Bridge.Request.get("/api-proxy/", { query: { url: 'https://api.realestate.com.au/pricing/v1/packages' } })
		// .then(function(response) {
		// 	console.log(response);
		// });
		
		Bridge.Request.get("/api-proxy/", { query: { url: 'https://api.realestate.com.au/pricing/v1/package-product-prices?query=' + uri } })
			.then(function(response) {
				$pageContainer.find('.agent-branded-new__control-block__loading').removeClass('loading');
				Bridge.Event.trigger("loader:toggleLockdown", { toggle: false });
				console.log('Storing in context.');
				contextStore.packages.push(response);
				Bridge.Context.set(storePath, contextStore);
				if(!comparison) {
					Bridge.Context.set('packageID', contextStore.packageId);
				}
				console.log(Bridge.Context.match("." + storePath, {}));
				if(comparison) {
					contextStore.options[optionId] = {
						title: pkg,
						packageId: option,
						table: response
					};
					Bridge.Context.set(storePath, contextStore);
					_renderData();
				}else {
					_.assign(contextStore, {
						table: response
					});
					Bridge.Context.set(storePath, contextStore);
					_renderData(contextStore);
				}
					var data = {
						context : contextStore,
						suburbs : suburbs
					};
					Bridge.Event.trigger('renderData', data);

			})
			.catch(function(e) {
				Bridge.Event.trigger("loader:updateMode", "action-required");
				Bridge.Event.trigger("loader:updateMessage", "Data fetched failed, please try again later");
				console.error("Failure");
				console.log(e);
				$pageContainer.find('.agent-branded-new__control-block__loading').removeClass('loading');
				if(!comparison) {
					$table.html('');
					Bridge.Event.trigger('clearTable');
				}
			});
	}

	function _renderData() {
		// console.log('Table', contextStore.table);
		// console.log('RENDER DATA, Breakdown?', breakdown)

		if (contextStore.contractTitle) {
			$package.val(contextStore.contractTitle);
		}

		if (contextStore.suburbTitle) {
			$postcode.val(contextStore.suburbTitle);
		}

		if (contextStore.eBrochureTitle) {
			$ebrochure.find('h6').text(contextStore.eBrochureTitle);
		}

		if (contextStore.amaxTitle) {
			if (contextStore.amaxTitle.length > 18) {
				$audience.find('h6').text(contextStore.amaxTitle+'...  ');
			} else {
				$audience.find('h6').text(contextStore.amaxTitle);
			}
		}

		if($pricingStandard.length) {
			_renderPricingStandard(contextStore.table, $pricingStandard);
		}

		if (breakdown) {
			_renderBreakdownTable(contextStore.table);
		} else {
			_renderTable(contextStore.table);
		}

		if (!breakdown) {
			_renderOptions(contextStore.options[0].table, contextStore.options[0].title, contextStore.options[0].packageId, "0");
			_renderOptions(contextStore.options[1].table, contextStore.options[1].title, contextStore.options[1].packageId, "1");
			_renderOptions(contextStore.options[2].table, contextStore.options[2].title, contextStore.options[2].packageId, "2");
		} else {
			console.log('render breakdown here...')
		}
	}

	function _renderPricingStandard(data, $container) {
		console.log("Render Pricing Standard");
		$pageContainer.addClass('is-ready').fadeIn();
		attachDropdown($pageContainer, contextStore.dropdownData, '.packages');
		if(!_.isEmpty(data)) {
			var commitmentDeal = data[contextStore.packageId].commitmentDealIds[0];
			var deals = data[contextStore.packageId].deals[commitmentDeal];
			if(deals) {
				deals = _.map(contextStore.currentSuburbs[contextStore.suburbIndex], function(value, index) {
					return _.find(deals, function(item) {
						return item.pricingPoint[0].id === contextStore.currentSuburbs[contextStore.suburbIndex][index].locationId
					})
				});

				var deal = deals[0];
				if (deal.currentPrice) {
					console.log(deal);
					console.log(parseInt(deal.currentPrice.discountedTaxInclusiveAmount, 10));
					$container.find("span").text("$"+parseInt(deal.currentPrice.discountedTaxInclusiveAmount, 10));
				}
			} else {
				$container.find("span").text('Unable to find data for this package');
			}
		}
	}

	function _renderBreakdownTable(data) {

		$pageContainer.addClass('is-ready').fadeIn();
		
		$pageContainer.find('.pricing-daily-breakdown__input input').val(contextStore.suburbTitle);

		// $pageContainer.find('.input-label').html(contextStore.dropdownTitle);

		attachDropdown($pageContainer, contextStore.dropdownData, '.packages');

		if(!_.isEmpty(data)) {
			var commitmentDeal = data[contextStore.packageId].commitmentDealIds[0];
			var deals = data[contextStore.packageId].deals[commitmentDeal];
			if(deals) {
				deals = _.map(contextStore.currentSuburbs[contextStore.suburbIndex], function(value, index) {
					return _.find(deals, function(item) {
						return item.pricingPoint[0].id === contextStore.currentSuburbs[contextStore.suburbIndex][index].locationId
					})
				});

				var deal = deals[0]
				if (deal.currentPrice) {
					var change = deal.nextPrice.discountedTaxInclusiveAmount - deal.currentPrice.discountedTaxInclusiveAmount;
					var fourtyFive = Math.round(deal.nextPrice.discountedTaxInclusiveAmount / 45);
					var sixty = Math.round(deal.nextPrice.discountedTaxInclusiveAmount / 60);

					var $row = $('<tr/>');
					$row.append('<td>$' + parseInt(deal.currentPrice.discountedTaxInclusiveAmount, 10) + '</td>');
					$row.append('<td>$' + parseInt(deal.nextPrice.discountedTaxInclusiveAmount, 10) + '</td>');
					if (change > 0) {
						$row.append('<td>+$' + change + '</td>');
					} else if (change < 0) {
						$row.append('<td>-$' + Math.abs(change) + '</td>');
					} else {
						$row.append('<td>$' + Math.abs(change) + '</td>');
					}
					$table.html($row);

					var $dTRow = $('<tr/>');
					$dTRow.append('<td>$' + fourtyFive + '</td>');
					$dTRow.append('<td>$' + sixty + '</td>');
					$dailyTable.html($dTRow);
				}
			} else {
				$table.html('<tr><td>Unable to find data for this package</td><tr>');
				$dailyTable.html('<tr><td>Unable to find data for this package</td><tr>');
			}
		}
	}

	function _renderTable(data) {
		if(!_.isEmpty(data)) {
			var commitmentDeal;
			var premierePlus = false;

			if (contextStore.packageId === '663') {
				if (channel === 'Buy') {
					commitmentDeal = '2015';
				} else {
					commitmentDeal = '3468';
				}
			} else {
				commitmentDeal = data[contextStore.packageId].commitmentDealIds[0];
			}

			if (contextStore.packageId === '685' || contextStore.packageId === '686') {
				premierePlus = true;
			}

			var deals = data[contextStore.packageId].deals[commitmentDeal];

			$pageContainer.find('.table__title').html(contextStore.contractTitle);

			console.log('deals', deals);

			if(deals) {
				var rawDeals = deals;
				deals = _.map(contextStore.currentSuburbs[contextStore.suburbIndex], function(value, index) {
					return _.find(deals, function(item) {
						return item.pricingPoint[0].id === contextStore.currentSuburbs[contextStore.suburbIndex][index].locationId
					})
				})
				var tableRows = []
				_.forEach(deals, function (item, index) {
					if (contextStore.currentSuburbs[contextStore.suburbIndex][index].locationId) {
						var $row = $('<tr/>');
						var $currentRate = parseFloat(item.currentPrice.discountedTaxInclusiveAmount) + ((!(premierePlus) && parseFloat(contextStore.eBrochureValue))) + parseFloat(contextStore.amaxValue);
						var $newRate = parseFloat(item.nextPrice.discountedTaxInclusiveAmount) + ((!(premierePlus) && parseFloat(contextStore.eBrochureValue))) + parseFloat(contextStore.amaxValue);
						var $manualRate = parseFloat(item.currentPrice.listTaxInclusiveAmount) + ((!(premierePlus) && parseFloat(contextStore.eBrochureValue))) + parseFloat(contextStore.amaxValue);

						console.log('next price: ', item);

						$row.append('<td>' + contextStore.currentSuburbs[contextStore.suburbIndex][index].locationAlias + '</td>')
						if(channel === "Buy" || channel === "BuyBreakdown") {
							$row.append('<td> '+ contextStore.currentSuburbs[contextStore.suburbIndex][index].listingsBuy + '</td>')
						}
						else {
							$row.append('<td> '+ contextStore.currentSuburbs[contextStore.suburbIndex][index].listingsRent + '</td>')
						}
						// $row.append('<td>' + $currentRate.toFixed(2) + '</td>');
						$row.append('<td>' + $currentRate.toFixed(2) + '</td>');
						$row.append('<td>' + $newRate.toFixed(2) + '</td>');
						$row.append('<td>' + $manualRate.toFixed(2) + '</td>');
						
						tableRows.push($row);
					}
				})
				$table.html(tableRows);

				if (contextStore && contextStore.packageId && (contextStore.packageId === '685' || contextStore.packageId === '686')) {
					$pageContainer.find('table tr th:last-child').hide();
					$pageContainer.find('table tr td:last-child').hide();
				} else {
					$pageContainer.find('table tr th:last-child').show();
					$pageContainer.find('table tr td:last-child').show();
				}

				// if (screenshotMode && rawDeals.length > 7) {
				// 	var pages = Math.ceil(rawDeals.length / 7);
				// 	var articleId = Bridge.Slides.getArticleID();
				// 	if (pages > 1) {
        //     Bridge.Navigation.setPages(articleId);
        //     Bridge.Event.on(`showpage:${articleId}`, function (number, done) {
				// 			if (number == 2) {
				// 				$pageContainer.find('[data-control="next"]').trigger('click');
				// 			}
				// 			done();
        //     });
        // 	}
				// }
			}
			else {
				$table.html('<tr><td>Unable to find data for this package</td><tr>');
			}
		}
	}

	function _renderOptions(data, packageName, packageId, optionId) {
		if(!_.isEmpty(data)) {
			var commitmentDeal = data[packageId].commitmentDealIds[0];
			var premierePlus = false;
			var deals = data[packageId].deals[commitmentDeal];
			var $option = $options.find('[data-selection="'+ optionId +'"]').parent();
			var $entryPoint = $option.find('.option__values');
			$option.find('.currently-selected__text').html(packageName);
			$option.find('.info-text').html(packageName);

			if (packageId === 685 || packageId === 686) {
				premierePlus = true;
			}

			if(deals) {
				deals = _.map(contextStore.currentSuburbs[contextStore.suburbIndex], function(value, index) {
					return _.find(deals, function(item) {
						return item.pricingPoint[0].id === contextStore.currentSuburbs[contextStore.suburbIndex][index].locationId
					})
				})

				var tableRows = []
				_.forEach(deals, function (item, index) {
					if(item) {
						var $row = $('<span class="option__value"/>');
						console.log('item', item)
						if (item.nextPrice) {
							$row.html(parseFloat(parseFloat(item.nextPrice.discountedTaxInclusiveAmount) + ((!(premierePlus) && parseFloat(contextStore.eBrochureValue))) + parseFloat(contextStore.amaxValue)).toFixed(2))
						} else if (item.currentPrice) {
							$row.html(parseFloat(parseFloat(item.currentPrice.discountedTaxInclusiveAmount) + ((!(premierePlus) && parseFloat(contextStore.eBrochureValue))) + parseFloat(contextStore.amaxValue)).toFixed(2))
						}
						tableRows.push($row);
					}
				})
				$entryPoint.html(tableRows);
			}
			else {
				$entryPoint.html('<span class="option__value"/>Unable to find data for this package</span>');
			}
		}
	}

	function _clearData() {
		$options.find('.option__values').html('');
		$pageContainer.find('.table__title').html('-');
		$options.find('.option__values').html('');
		$table.html('');
		$dailyTable.html('');
		$options.find('.currently-selected__text').html('-');
		$options.find('.info-text').html('');
		$package.val('');
		$postcode.val('');
		$ebrochure.find('h6').text('eBrochure');
		$audience.find('h6').text('Audience Maximiser');

		contextStore = {
			packages: [],
			Channel: contextStore.Channel,
			packageId: "",
			suburbTitle: "",
			dropdownTitle: "Contract type",
			dropdownData: [],
			contractTitle: "",
			eBrochureTitle : "",
			eBrochureValue : 0,
			amaxTitle : "",
			amaxValue : 0,
			options:[
				{
					"title": "",
					"packageId": "",
					"table": ""
				},
				{
					"title": "",
					"packageId": "",
					"table": ""
				},
				{
					"title": "",
					"packageId": "",
					"table": ""
				}
			],
			suburbIndex: 0,
			currentSuburbs : [],
			table: {},
			optionsHidden: [],
			optionsHiddenRent: []
		};
		Bridge.Context.set(storePath, contextStore);
		Bridge.Event.trigger('clearData');
		$pageContainer.find('.column-group').removeClass('hideOptions');
		$pageContainer.find('.option-selector .option__selection').show();
		_init();
		_bindEvents();
	}
}
