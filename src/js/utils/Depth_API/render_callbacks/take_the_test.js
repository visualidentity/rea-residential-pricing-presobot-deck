function takeTheTestRenderCallback($pageContainer, agency) {
	var renderFunction = this;
	var $rows = $pageContainer.find(".table-performance tr");

	this.renderData = function(data, dropdownSelection, channel) {

		var dateRange = $('.date-range .input-label', $pageContainer).text();
		$('[data-sourceDate]', $pageContainer).text(dateRange);
		if (data) {
			// var propertyType = _.findIndex(
			// 	data.items[0].years[0].youVsMarket,
			// 	function(o) {
			// 		return o.propertyType === 'All';
			// 	}
			// );
			// if (propertyType < 0) {
			// 	renderFunction.renderMissingStats();
			// 	return;
			// }
			// var depthItem = data.items[0].years[0].youVsMarket[propertyType];
			// console.table(depthItem);

			// Realestate data
			$rows.find('[data-total-listings-realestate]').text(addCommas(data.totalNewListings));
			$rows.find('[data-total-page-views-realestate]').text(addCommas(data.totalPropertyPageViews));
			$rows.find('[data-average-page-view-realestate]').text(addCommas(data.avgPropertyPageViews));
			$rows.find('[data-total-email-enquiries-realestate]').text(addCommas(data.totalEmailEnquiries));
			$rows.find('[data-average-email-enquiry-realestate]').text(addCommas(data.avgEmailEnquiries));
			$rows.find('[data-total-phone-reveals-realestate]').text(addCommas(data.totalPhoneReveals));
			$rows.find('[data-average-phone-reveals-realestate]').text(addCommas((data.averagePhoneReveals).toFixed(0)));
			// var totalEmailsAndPhoneReveals = depthItem.totalPhoneReveals + depthItem.totalEmailEnquiries;
			$rows.find('[data-total-emails-and-phone-reveals-realestate]').text(addCommas(data.totalEmailsAndPhoneReveals.toFixed(0)));
			$rows.find('[data-average-email-and-phone-reveal-realestate]').text(addCommas((data.averageEmailEnquiry).toFixed(0)));

			// // Domain data
			// if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , '')))) {
			// 	var averageViewsDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-page-view-domain]').text(addCommas(averageViewsDomain.toFixed(0)));
			// }
			// if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')))) {
			// 	var averageEmailEnquiriesDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-email-enquiry-domain]').text(addCommas(averageEmailEnquiriesDomain.toFixed(0)));
			// }
			// if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')))) {
			// 	var averagePhoneRevealsDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-phone-reveals-domain]').text(addCommas(averagePhoneRevealsDomain.toFixed(0)));

			// 	if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')))) {
			// 		var totalEmailPhoneRevealsDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , ''));
			// 		$rows.find('[data-total-emails-and-phone-reveals-domain]').text(addCommas(totalEmailPhoneRevealsDomain.toFixed(0)));

			// 		var averageEmailPhoneRevealsDomain = (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , ''))) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			// 		$rows.find('[data-average-email-and-phone-reveal-domain]').text(addCommas(averageEmailPhoneRevealsDomain.toFixed(0)));
			// 	}
			// }

			// // Other data
			// if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-other').text().replace(/,/g , '')))) {
			// 	var averageViewsOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-other').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-page-view-other]').text(addCommas(averageViewsOther.toFixed(0)));
			// }
			// if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , '')))) {
			// 	var averageEmailEnquiriesOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-email-enquiry-other]').text(addCommas(averageEmailEnquiriesOther.toFixed(0)));
			// }
			// if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , '')))) {
			// 	var averagePhoneRevealsOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-phone-reveals-other]').text(addCommas(averagePhoneRevealsOther.toFixed(0)));

			// 	if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , '')))) {
			// 		var totalEmailPhoneRevealsOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , ''));
			// 		$rows.find('[data-total-emails-and-phone-reveals-other]').text(addCommas(totalEmailPhoneRevealsOther.toFixed(0)));

			// 		var averageEmailPhoneRevealsOther = (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , ''))) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			// 		$rows.find('[data-average-email-and-phone-reveal-other]').text(addCommas(averageEmailPhoneRevealsOther.toFixed(0)));
			// 	}
			// }

			// // Multiplier over Domain data
			// if ((parseInt($rows.find('[data-total-listings-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-total-listings-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-total-listings-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-total-page-views-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-total-page-views-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-total-page-views-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-average-page-view-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-page-view-domain]').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-average-page-view-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-page-view-domain]').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-page-view-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-total-email-enquiries-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-total-email-enquiries-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-total-email-enquiries-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-average-email-enquiry-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-email-enquiry-domain]').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-average-email-enquiry-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-email-enquiry-domain]').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-email-enquiry-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-total-phone-reveals-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-total-phone-reveals-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , ''));
			// 	$rows.find('[data-total-phone-reveals-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-average-phone-reveals-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-phone-reveals-domain]').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-average-phone-reveals-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-phone-reveals-domain]').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-phone-reveals-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-total-emails-and-phone-reveals-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-total-emails-and-phone-reveals-domain]').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-total-emails-and-phone-reveals-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-total-emails-and-phone-reveals-domain]').text().replace(/,/g , ''));
			// 	$rows.find('[data-total-emails-and-phone-reveals-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
			// if ((parseInt($rows.find('[data-average-email-and-phone-reveal-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-email-and-phone-reveal-domain]').text().replace(/,/g , '')))) {
			// 	var totalListingsMultiplier = parseInt($rows.find('[data-average-email-and-phone-reveal-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-email-and-phone-reveal-domain]').text().replace(/,/g , ''));
			// 	$rows.find('[data-average-email-and-phone-reveal-multiplier-over-domain]').text(addCommas(totalListingsMultiplier.toFixed(2)));
			// }
		} else {
			renderFunction.renderMissingStats();
		}
	};

	this.renderPrep = function() {
		// Domain data
		if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , '')))) {
			var averageViewsDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			$rows.find('[data-average-page-view-domain]').text(addCommas(averageViewsDomain.toFixed(0)));
		}
		if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')))) {
			var averageEmailEnquiriesDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			$rows.find('[data-average-email-enquiry-domain]').text(addCommas(averageEmailEnquiriesDomain.toFixed(0)));
		}
		if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')))) {
			var averagePhoneRevealsDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			$rows.find('[data-average-phone-reveals-domain]').text(addCommas(averagePhoneRevealsDomain.toFixed(0)));

			if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')))) {
				var totalEmailPhoneRevealsDomain = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , ''));
				$rows.find('[data-total-emails-and-phone-reveals-domain]').text(addCommas(totalEmailPhoneRevealsDomain.toFixed(0)));

				var averageEmailPhoneRevealsDomain = (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , ''))) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
				$rows.find('[data-average-email-and-phone-reveal-domain]').text(addCommas(averageEmailPhoneRevealsDomain.toFixed(0)));
			}
		}

		// Other data
		if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-other').text().replace(/,/g , '')))) {
			var averageViewsOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-other').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			$rows.find('[data-average-page-view-other]').text(addCommas(averageViewsOther.toFixed(0)));
		}
		if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , '')))) {
			var averageEmailEnquiriesOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			$rows.find('[data-average-email-enquiry-other]').text(addCommas(averageEmailEnquiriesOther.toFixed(0)));
		}
		if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , '')))) {
			var averagePhoneRevealsOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
			$rows.find('[data-average-phone-reveals-other]').text(addCommas(averagePhoneRevealsOther.toFixed(0)));

			if ((parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , '')))) {
				var totalEmailPhoneRevealsOther = parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , ''));
				$rows.find('[data-total-emails-and-phone-reveals-other]').text(addCommas(totalEmailPhoneRevealsOther.toFixed(0)));

				var averageEmailPhoneRevealsOther = (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-other').text().replace(/,/g , '')) + parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-other').text().replace(/,/g , ''))) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-other').text().replace(/,/g , ''));
				$rows.find('[data-average-email-and-phone-reveal-other]').text(addCommas(averageEmailPhoneRevealsOther.toFixed(0)));
			}
		}

		// Multiplier over Domain data
		if ((parseInt($rows.find('[data-total-listings-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-total-listings-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-listings-domain').text().replace(/,/g , ''));
			$rows.find('[data-total-listings-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-total-page-views-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-total-page-views-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-page-views-domain').text().replace(/,/g , ''));
			$rows.find('[data-total-page-views-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-average-page-view-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-page-view-domain]').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-average-page-view-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-page-view-domain]').text().replace(/,/g , ''));
			$rows.find('[data-average-page-view-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-total-email-enquiries-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-total-email-enquiries-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-email-enquiries-domain').text().replace(/,/g , ''));
			$rows.find('[data-total-email-enquiries-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-average-email-enquiry-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-email-enquiry-domain]').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-average-email-enquiry-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-email-enquiry-domain]').text().replace(/,/g , ''));
			$rows.find('[data-average-email-enquiry-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-total-phone-reveals-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-total-phone-reveals-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('#take_the_test_performance_agency_performing-data-total-phone-reveals-domain').text().replace(/,/g , ''));
			$rows.find('[data-total-phone-reveals-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-average-phone-reveals-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-phone-reveals-domain]').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-average-phone-reveals-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-phone-reveals-domain]').text().replace(/,/g , ''));
			$rows.find('[data-average-phone-reveals-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-total-emails-and-phone-reveals-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-total-emails-and-phone-reveals-domain]').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-total-emails-and-phone-reveals-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-total-emails-and-phone-reveals-domain]').text().replace(/,/g , ''));
			$rows.find('[data-total-emails-and-phone-reveals-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
		if ((parseInt($rows.find('[data-average-email-and-phone-reveal-realestate]').text().replace(/,/g , ''))) && (parseInt($rows.find('[data-average-email-and-phone-reveal-domain]').text().replace(/,/g , '')))) {
			var totalListingsMultiplier = parseInt($rows.find('[data-average-email-and-phone-reveal-realestate]').text().replace(/,/g , '')) / parseInt($rows.find('[data-average-email-and-phone-reveal-domain]').text().replace(/,/g , ''));
			$rows.find('[data-average-email-and-phone-reveal-multiplier-over-domain]').text('X ' + addCommas(totalListingsMultiplier.toFixed(2)));
		}
	};

	this.renderMissingStats = function() {};
}

