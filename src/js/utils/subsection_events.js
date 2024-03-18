

var attachSubsectionEvents = function(options) {
	
	var $selectors, $image, $header, $sidePanel, $return, $slides, $forward, $back, $disclaimerContainer;
	var state, context, dom;
	var client = $("body").hasClass("client") ? true : false;
	var screenshot = $("body").hasClass('screenshot') ? true: false;

	context = options.context;
	dom = options.slide;
	$selectors = dom.find('[data-subsection-nav]');
	$image = dom.find('[data-subsection-image]');
	$sidePanel = dom.find('[data-subsection-side-panel]');
	$return = $sidePanel.find('.subslide-side-panel__return');
	$forward = $sidePanel.find('.subslide-side-panel__forward');
	$back = $sidePanel.find('.subslide-side-panel__back');
	$disclaimerContainer = dom.find('.subsection__disclaimer__container');
	$header = dom.find('header .slide-header-center__content');
	$slides = dom.find('.subslide-side__slide');

	state = {
		launched: false,
		animationSettings: {
			globalTimer: 500
		}
	};

	_.assign(state, Bridge.Context.match('.' + context, {}));

	this.init = function() {
		this.bindBridgeEvents();
		if(screenshot) {
			dom.find('.subslide-side-panel__navigation').css({display: 'none'})
			dom.find('.subsection-line').css({display: 'none'})
			dom.find('.subsection').css({display: 'none'})
			dom.find('*').css({transition: 'none'});
		}
		if(!client) {
			_bindEvents();
			_initScreen();
			if(state.section && state.launched) {
				_render({prevState: null, state: state, event: 'restore'});
			}
		}
		else {
			Bridge.Event.trigger("client:getState--"+context);
			Bridge.Event.on("master:init--"+context, _handleMasterInitEvent);
			Bridge.Event.on("master:ready--"+context, function() {
				Bridge.Event.trigger("client:getState--"+context);
			})
		}
	};

	function _bindEvents() {

		$selectors.on('click', function(e) {
			var oldState ={};
			console.log('click', context);
			var settings = $(this).attr('data-subsection-settings');
			if(settings) {
				settings = JSON.parse(settings);
				console.log(settings);
				_.assign(oldState,state);
				var isLaunched = state.launched;
				if(!isLaunched) {
					state.launched = true;
					state.section = settings;
					Bridge.Event.trigger('master:selector-click--'+context, {
						oldState: oldState,
						state: state,
						event: 'open'
					});
				}
			}
		});

		$return.on('click', function() {
			var oldState ={};
			_.assign(oldState,state);
			state.launched = false;
			state.section = null;
			Bridge.Event.trigger('master:return--'+context, {
				oldState: oldState,
				state: state,
				event: 'close'
			});
		})

		$forward.on('click',function() {
			var totalSlides = $slides.length
			var nextId = state.section.id + 1 > totalSlides ? 1 : state.section.id + 1;
			var settings = JSON.parse(dom.find('.subsection__navigation[data-subsection-id="'+ nextId +'"]').attr('data-subsection-settings'));
			var oldState ={};
			_.assign(oldState,state);
			state.section = settings;
			Bridge.Event.trigger('master:transition--'+context, {
				oldState: oldState,
				state: state,
				event: 'transition'
			});

		})

		$back.on('click',function() {
			var totalSlides = $slides.length
			var nextId = state.section.id - 1 < 1 ? totalSlides : state.section.id - 1;
			var settings = JSON.parse(dom.find('.subsection__navigation[data-subsection-id="'+ nextId +'"]').attr('data-subsection-settings'));
			var oldState ={};
			_.assign(oldState,state);
			state.section = settings;
			Bridge.Event.trigger('master:transition--'+context, {
				oldState: oldState,
				state: state,
				event: 'transition'
			});
		})
	}

	this.bindBridgeEvents = function() {
		console.log('events bound for ' + context);
		Bridge.Event.on("client:getState--"+context, _handleBridgeInitEvent);
		Bridge.Event.on("master:selector-click--"+context, _handleBridgeEvent);
		Bridge.Event.on("master:return--"+context, _handleBridgeEvent);
		Bridge.Event.on("master:transition--"+context, _handleBridgeEvent);
		Bridge.Event.trigger('master:ready--'+context);
	}

	function _handleBridgeEvent(data) {
		Bridge.Context.set(context, data.state);
		_render({prevState: data.oldState, state: data.state, event: data.event});
	}

	function _handleBridgeInitEvent(data) {
		var state = {};
		_.assign(state, Bridge.Context.match('.' + context, {}));
		Bridge.Event.trigger('master:init--'+context, {
			oldState: null,
			state: state
		});
	}

	function _handleMasterInitEvent(data) {
		_initScreen();
		_.assign(state, data.state);
		if(state.section && state.launched) {
			_render({prevState: null, state: state, event: 'restore'});
		}
	}


	function _render(config) {
		switch(config.event) {
			case 'open':
				_launchScreen(config);
				break;
			case 'close':
				_closeScreen(config);
				break;
			case 'transition':
				_transition(config);
				break;
			case 'restore':
				_restore(config);
				break;
			default:
				break;
		}
	}

	function _launchScreen(config) {
		var section = config.state.section;
		$slides.removeClass('active');
		$disclaimerContainer.removeClass('active');
		var $slide = dom.find('[data-slide-id="'+ section.id +'"]');
		$slide.toggleClass('active');
		dom.addClass('launched');
		dom.find('.subsection__slide__disclaimers').css('display', 'none');
		$($header).animate({
			opacity: 0
		}, state.animationSettings.globalTimer)
		;
		$($selectors).animate({
			opacity: 0
		}, state.animationSettings.globalTimer, function() {
			$($selectors).css({'z-index': 'unset'});
			$($selectors).css({'display': 'none'});
			_animateElement($image, section.x, section.y, section.scale);
			setTimeout(function(){_animateElement($sidePanel, 0, 0, 1)}, state.animationSettings.globalTimer);
			setTimeout(function(){$slide.find('polyline').addClass('launched')}, state.animationSettings.globalTimer*2);
			setTimeout(function(){$slide.find('path').addClass('launched')}, state.animationSettings.globalTimer*2);
			dom.find('.subsection__disclaimer__container[data-subsection-disclaimers-id="'+ section.id +'"]').addClass('active');
		})
	}

	function _closeScreen(config) {
		var section = config.prevState.section;
		var $slide = dom.find('[data-slide-id="'+ section.id +'"]');
		$disclaimerContainer.removeClass('active');
		$slide.find('polyline').removeClass('launched');
		$slide.find('path').removeClass('launched');
		_animateElement($sidePanel, -834, 0, 1);
		dom.removeClass('launched');
		dom.find('.subsection__slide__disclaimers').css('display', 'block');
		$($selectors).css({'z-index': '1'});
		$($selectors).css({'display': 'block'});
		setTimeout(function(){_animateElement($image, 0, 0, 1)}, state.animationSettings.globalTimer);
		setTimeout(function() {
			$($header).animate({
				opacity: 1
			}, state.animationSettings.globalTimer)
			$($selectors).animate({
				opacity: 1
			}, state.animationSettings.globalTimer)
		}, state.animationSettings.globalTimer)
	}

	function _transition(config) {
		var section = config.state.section
		var nextSlide = dom.find('.subslide-side__slide[data-slide-id="'+ section.id +'"]');
		var currentSlide = dom.find('.subslide-side__slide.active');
		$disclaimerContainer.removeClass('active');

		currentSlide.find('polyline').removeClass('launched');
		currentSlide.find('path').removeClass('launched');
		nextSlide.addClass('preload');
		_animateElement($image, section.x, section.y, section.scale);
		_animateElement(currentSlide, 0, -currentSlide.outerHeight(), 1);
		setTimeout(function() {
			currentSlide.removeClass('active');
			nextSlide.addClass('active');
			nextSlide.removeClass('preload');
			nextSlide.find('polyline').addClass('launched')
			nextSlide.find('path').addClass('launched')
			dom.find('.subsection__disclaimer__container[data-subsection-disclaimers-id="'+ section.id +'"]').addClass('active');
			_animateElement(currentSlide, 0, 0, 1);
		}, state.animationSettings.globalTimer)


	}

	function _restore(config) {
		dom.addClass('launched');
		var section = config.state.section
		var $slide = dom.find('[data-slide-id="'+ section.id +'"]');
		$disclaimerContainer.removeClass('active');
		dom.find('.subsection__slide__disclaimers').css('display', 'none');
		dom.find('.subsection__disclaimer__container[data-subsection-disclaimers-id="'+ section.id +'"]').addClass('active');
		$slide.toggleClass('active');
		$slide.find('polyline').addClass('launched')
		$slide.find('path').addClass('launched')
		$($header).css({opacity: 0});
		$($selectors).css({opacity: 0});
		_animateElement($sidePanel, 0, 0, 1)
		_animateElement($image, section.x, section.y, section.scale);
	}

	function _animateElement(elem, x, y, scale) {
		$(elem).css({
			transform: 'translate3d('+ x+'px, '+y+'px, 0) scale('+scale+')',
			'-webkit-transform': 'translate3d('+ x+'px, '+y+'px, 0) scale('+scale+')',
			'-moz-transform': 'translate3d('+ x+'px, '+y+'px, 0) scale('+scale+')',
			'-ms-transform': 'translate3d('+ x+'px, '+y+'px, 0) scale('+scale+')',
			'-o-transform': 'translate3d('+ x+'px, '+y+'px, 0) scale('+scale+')'
		})
	}

	function _initScreen() {
		$selectors.addClass('launched');
		dom.find('.arrow').addClass('launched');
		dom.find('.subsection__category').find('polyline').addClass('launched');
		dom.find('.subsection__category').find('path').addClass('launched');
		dom.find('.slide-header-center__subtitle ').addClass('launched');

		_animateElement($image, 0, 0, 1);
		$image.css({opacity: 1})
	}

	this.destroy = function() {
		console.log('destroying ' + context);
		Bridge.Event.off("master:selector-click--"+context, _handleBridgeEvent);
		Bridge.Event.off("master:return--"+context, _handleBridgeEvent);
		Bridge.Event.off("master:transition--"+context, _handleBridgeEvent);
		Bridge.Event.off("client:getState--"+context, _handleBridgeInitEvent);
		Bridge.Event.off("master:init--"+context, _handleMasterInitEvent);
	}
	this.init();
};
