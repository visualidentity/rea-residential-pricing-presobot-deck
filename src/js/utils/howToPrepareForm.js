var howToPrepareForm = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var dom;
	dom = options.slide;

	const $addContact = dom.find('[data-add-contact]');
	const $fields = dom.find('[data-fields]');
	const $submit = dom.find('[data-form-submit]');
	const $form = dom.find('#howToPrepare');

    if (client) {
        // _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function _bindMasterEvents() {
		const filteredAgent = Bridge.Context.match(".agency_contacts", []);

		var contactIndex = 0;
		$addContact.click(function(e) {
			contactIndex += 1;
			$fields.append(`<div class="row row${contactIndex}">` +
				'<input type="hidden" name="agencyid[]" required />' +
				'<div class="column columnjs first-name">' +
					'<input type="text" name="firstname[]" placeholder="First Name" />' +
				'</div>' +
				'<div class="column columnjs last-name">' +
					'<input type="text" name="lastname[]" placeholder="Last Name" />' +
				'</div>' +
				'<div class="column columnjs job-title">' +
					'<input type="text" name="jobtitle[]" placeholder="Job Title" />' +
				'</div>' +
				'<div class="column columnjs email">' +
					'<input type="email" name="email[]" placeholder="Email" />' +
				'</div>' +
				'<div class="column columnjs mobile-number">' +
					'<input type="tel" name="tel[]" placeholder="XXXX-XXX-XXX">' +
				'</div>' +
				'<div class="column columnjs migration-contact">' +
					'<input type="checkbox" name="migrationcontact[]" />' +
					'<span class="checkmark"></span>' +
				'</div>' +
				'<div class="column columnjs set-up-user">' +
					'<input type="checkbox" name="setupuser[]" />' +
					'<span class="checkmark"></span>' +
				'</div>' +
			'</div>'
			);

			$fields.stop(true, false).animate({
				scrollTop: $fields.get(0).scrollHeight
			}, 1000);

			_clickBindings();
		});

		_clickBindings();

		$.each(filteredAgent, function(i, item){
			dom.find('.row' + i + ' .first-name input').val(item.name_first.replace(/\&/g, ' '));
			dom.find('.row' + i + ' .last-name input').val(item.name_last.replace(/\&/g, ' '));
			dom.find('.row' + i + ' .job-title input').val(item.position.replace(/\&/g, ' '));
			dom.find('.row' + i + ' .email input').val(item.email);

			if (item.phone.indexOf('04') == 0) {
				dom.find('.row' + i + ' .mobile-number input').val(item.phone);
			}

			if (i != (filteredAgent.length - 1)) {
				$addContact.trigger('click');
			}
		});
	}

	function _clickBindings() {
		$('.migration-contact, .set-up-user').click(function(e) {
			var fieldRow = $(this).parent();
			if (fieldRow.find('input[name="migrationcontact[]"]:checked').length > 0) {
				fieldRow.find('input[type="text"], input[type="email"], input[type="tel"]').prop('required', true);
				dom.find('input[name="migrationcontact[]"]').not(fieldRow.find('input[name="migrationcontact[]"]')).attr('checked', false);
			}else if (fieldRow.find('input[name="setupuser[]"]:checked').length > 0) {
				fieldRow.find('input[type="text"], input[type="email"], input[type="tel"]').prop('required', true);
			} else {
				fieldRow.find('input[type="text"], input[type="email"], input[type="tel"]').prop('required', false);
			}
		});
	}

	$form.submit(function(e) {

		e.preventDefault();
	
		var $agencyid = Bridge.Context.match(".customer .agent_code", '');

		var agencyid = $('input[name="agencyid[]"]').map(function() { 
			return $agencyid; 
		}).get();

		var firstname = $('input[name="firstname[]"]').map(function() { 
			return this.value; 
		}).get();

		var lastname = $('input[name="lastname[]"]').map(function() { 
			return this.value; 
		}).get();

		var jobtitle = $('input[name="jobtitle[]"]').map(function() { 
			return this.value; 
		}).get();

		var email = $('input[name="email[]"]').map(function() { 
			return this.value; 
		}).get();

		var tel = $('input[name="tel[]"]').map(function() { 
			return this.value; 
		}).get();

		var migrationcontact = $('input[name="migrationcontact[]"]').map(function() { 
			return $(this).is(":checked") ? 1 : 0;
		}).get();

		var setupuser = $('input[name="setupuser[]"]').map(function() { 
			return $(this).is(":checked") ? 1 : 0;
		}).get();

		var formData = {
			'agencyid[]': agencyid,
			'firstname[]': firstname,
			'lastname[]': lastname,
			'jobtitle[]': jobtitle,
			'email[]': email,
			'tel[]': tel,
			'migrationcontact[]': migrationcontact,
			'setupuser[]': setupuser
		};

		Bridge.Request.create("/api-proxy/", JSON.stringify(formData), {
			encoding: "application/x-www-form-urlencoded",
			query: {
			  url: "https://d2xpnl9r21uz0w.cloudfront.net/dev/set-you-up-success-form"
			}
		})
		  	.then(function(response) {
				console.log("Success");
				$form.css({opacity: '.3', pointerEvents: 'none'});
				$addContact.css({opacity: '.3', pointerEvents: 'none'});
				$submit.css({background: '#00BEB3'}).html('Submitted &#10004;');
			})
			.catch(function(e) {
				console.error("Failure");
			});
	});
};

