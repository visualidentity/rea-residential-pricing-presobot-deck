var client = $("body").hasClass("client") ? true : false;

var attachDropdown = function($pageContainer, data, elem) {
	var $elem = $pageContainer.find(elem);
	var $bar = $elem.find('.input-label');
	var dropdownOpen = false;
	var data = data;

	_init();

	function _init() {
		_populateDropdown();
		if(client) {
			_bindMasterEvents()

		}else {
			_bindEvents();
		}
	}

	function _bindEvents() {
		$bar.parent().on('click', function(e) {
			_toggleDropDown()
			Bridge.Event.trigger('toggleDropDown', elem);
		})

		$elem.find('li').on('click', function(e) {
			_populateBar($(this).html(), $(this).attr('data-value'))

			var data = {
				html: $(this).html(),
				value: $(this).attr('data-value'),
				dropdown: elem
			}
			$elem.trigger('dropdown-value-changed');
			Bridge.Event.trigger('populateBar', data);
		});
	}

	function _bindMasterEvents() {
		Bridge.Event.on("populateBar", function(data) {
			if(data.dropdown === elem) {
				_populateBar(data.html, data.value);
			}
		  });

		Bridge.Event.on("toggleDropDown", function(data) {
			if(data === elem) {
				_toggleDropDown()
			}
		  });
	}

	function _toggleDropDown() {
		dropdownOpen = !dropdownOpen;

		if(dropdownOpen) {
			$elem.addClass('dropdown--open');
		}
		else {
			$elem.removeClass('dropdown--open');
		}
	}

	function _populateDropdown() {
		var $container = $('<ul/>');

		_.forEach(data, function(value, index) {
			// var $item = $('<li data-value='+value.value+'>'+value.title+ '</li>');
			var $item =  (value.audience) ? $(`<li data-value="${value.value}" data-audience="${value.audience}">${value.title}</li>`) : (value.state && !value.lga) ? $(`<li data-value="${value.value}" data-state="${value.state}">${value.title}</li>`) : (value.lga) ? $(`<li class="child" data-value="${value.value}" data-lga="${value.lga}">${value.title}</li>`)  : $(`<li data-value="${value.value}">${value.title}</li>`);
			$container.append($item);
		});

		$elem.find('.dropdown').append($container);
	}

	function _populateBar(html, value) {
		$elem.attr('data-selected', value);
		$bar.html(html);
		console.log(html);
	}
}