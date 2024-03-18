var pageSlider = function($pageContainer) {
	var $elem = $pageContainer.find("[data-slider]");
	$elem.each(function(i, val) {
		console.log($(this));
		_init($(this));
	});
};

function _init(elm) {
	_populateSlider(elm);
	_bindEvents(elm);
}

function _populateSlider(elm) {
	console.log(elm);
	var slideCount = elm.find("ul").children("li").length;
	var slideWidth = elm.find("li").width();
	var slideHeight = elm.find("li").height();
	var sliderUlWidth = slideCount * slideWidth;

	elm.css({ width: slideWidth, height: slideHeight });

	elm.find("ul").css({ width: sliderUlWidth, marginLeft: -slideWidth });

	elm.find("li:last-child").prependTo(elm.find("ul"));
}

function _bindEvents(elm) {
	console.log(elm.find("div.slider_control--prev"));
	elm.find("div.slider_control--prev").on("click", function() {
		_moveLeft(elm.parent());
	});

	elm.find("div.slider_control--next").on("click", function() {
		_moveRight(elm.parent());
	});
}

function _moveLeft(elm) {
	console.log("enter move left");
	elm.find("ul").animate(
		{
			left: +elm.find("ul").width()
		},
		10,
		function() {
			console.log(elm.find("li:last-child"));
			elm.find("li:last-child").prependTo(elm.find("ul"));
			elm.find("ul").css("left", "");
		}
	);
}

function _moveRight(elm) {
	console.log("enter move right");
	elm.find("ul").animate(
		{
			left: -elm.find("ul").width()
		},
		10,
		function() {
			console.log(elm.find("li:first-child"));
			elm.find("li:first-child").appendTo(elm.find("ul"));
			elm.find("ul").css("left", "");
		}
	);
}
