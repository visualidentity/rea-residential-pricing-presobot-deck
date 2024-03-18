var attractSaleLeasing = function(options) {
	var client = $("body").hasClass("client") ? true : false;
	var attr, dom;
	dom = options.slide;

	var $salesSwitch = dom.find('.input__tab--Sales');
	var $leasingSwitch = dom.find('.input__tab--Leasing');

	var $salesListing = dom.find('[data-listing-switch-sales]');
	var $leasingListing = dom.find('[data-listing-switch-leasing]');


	var $tabItem = dom.find("[data-tab-item]"),
		$close = dom.find("[data-close-icon]");

	
		

	dom.find("[data-slider]").slick({
	  infinite: true,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows:false, 
	  dots:false,
	  fade: true
	});

	dom.find("[data-sub-slider]").each(function(){
		$(this).slick({
		  infinite: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  arrows:false, 
		  dots:false,
		  fade: true
		});
	});
	

	dom.find(".subslide").not(".page01").each(function(){
		var $html = $(".subslide.page01").html();
		$(this).html($html); 
	});

    if (client) {
        _bindClientEvents();
    }
	else {
		_bindMasterEvents();
	}

	function _bindMasterEvents() {

		$salesSwitch.click(function(e) {
			$salesSwitch.addClass('active');
			$leasingSwitch.removeClass('active');

			$salesListing.css('display', 'block');
			$leasingListing.css('display', 'none');

			dom.find("[data-tab-details]").hide().removeClass("show");
			dom.find("[data-tab-item]").removeClass("active");

			Bridge.Event.trigger('master:sales-listing', {attr: false});
		});

		$leasingSwitch.click(function(e) {
			$salesSwitch.removeClass('active');
			$leasingSwitch.addClass('active');

			$salesListing.css('display', 'none');
			$leasingListing.css('display', 'block');

			dom.find("[data-tab-details]").hide().removeClass("show");
			dom.find("[data-tab-item]").removeClass("active");

			Bridge.Event.trigger('master:sales-listing', {attr: true});
		});

		dom.find("[data-slider]").on('afterChange', function(event, slick, currentSlide, nextSlide){
		 	var $tabDetails = $(this).parents("[data-tab-details]"),
		  		$currentTab = $tabDetails.prev("[data-tab]"),
		  		$currentItem = $tabDetails.find("[data-main-slider-item].slick-current").attr("data-slider-item");		  	
		  	
		  	if($tabDetails.hasClass("show")) {
		  		$currentTab.find("[data-tab-item]").removeClass("active");
		  		$currentTab.find("[data-tab-item][data-number='"+$currentItem+"']").addClass("active");
		  	}
		  	
		});	

		$tabItem.on("click", function(){
			var $this = $(this),
				number = $this.data("number"),
				$currentSubSlide = $this.parents("[data-tab]"),
				$currentDetails = $currentSubSlide.next("[ data-tab-details]");

			if(!$currentDetails.hasClass("show")) {
				dom.find("[data-tab-details]").hide();
				$currentDetails.fadeIn().addClass("show");
			}
			$currentSubSlide.find("[data-tab-item]").removeClass("active");
			$this.addClass("active");
			$currentDetails.find("[data-slider]").slick('reinit');
			$currentDetails.find("[data-slider]").slick('slickGoTo', number - 1);
			$currentDetails.find("[data-sub-slider]").slick('reinit');
			$currentDetails.find("[data-sub-slider]").slick('slickGoTo', 0); 
			Bridge.Event.trigger('master:sales-listing-carousel', {item: $this, number: $this.data("number"), subslide: $this.parents("[data-tab]"), details :  $currentSubSlide.next("[ data-tab-details]") });
		});

		$close.on("click", function(){ 
			$(this).parent("[data-tab-details]").fadeOut().removeClass("show");
			$tabItem.removeClass("active");
			Bridge.Event.trigger('master:sales-listing-carousel-close', {close : true });
		});	

		Bridge.Event.on("client:fetch-listing-state", function() {
			Bridge.Event.trigger("master:expand-listing", {attr: attr});
		});
	}

    function _bindClientEvents() {
		Bridge.Event.trigger("client:fetch-listing-state");
        Bridge.Event.on("master:sales-listing", function (data) {
			if (data.attr === true) {
				$salesSwitch.removeClass('active');
				$leasingSwitch.addClass('active');

				$salesListing.css('display', 'none');
				$leasingListing.css('display', 'block');
			} else {
				$salesSwitch.addClass('active');
				$leasingSwitch.removeClass('active');

				$salesListing.css('display', 'block');
				$leasingListing.css('display', 'none');
			}

			dom.find("[data-tab-details]").hide().removeClass("show");
			dom.find("[data-tab-item]").removeClass("active");
        });

        Bridge.Event.on("master:sales-listing-carousel", function (data) {
        	dom.find("[data-tab-item]").removeClass("active");
        	dom.find("[data-tab-details]").hide(); 
        	console.log(data.number);
        	if($salesSwitch.hasClass("active")) {
        		dom.find("[data-listing-switch-sales] [data-tab-item][data-number='"+data.number+"']").addClass("active");
        		dom.find("[data-listing-switch-sales]").next("[data-tab-details]").show();        		
        		dom.find("[data-listing-switch-sales]").next("[data-tab-details]").find("[data-slider] [data-main-slider-item]").css({"opacity": 0});	
        		dom.find("[data-listing-switch-sales]").next("[data-tab-details]").find("[data-slider] [data-main-slider-item][data-slider-item='"+data.number+"']").css({"opacity": 1});	

        	}
        	if($leasingSwitch.hasClass("active")) {
        		dom.find("[data-listing-switch-leasing] [data-tab-item][data-number='"+data.number+"']").addClass("active");
        		dom.find("[data-listing-switch-leasing]").next("[data-tab-details]").show();
        		dom.find("[data-listing-switch-leasing]").next("[data-tab-details]").find("[data-slider] [data-main-slider-item]").css({"opacity": 0});	
        		dom.find("[data-listing-switch-leasing]").next("[data-tab-details]").find("[data-slider] [data-main-slider-item][data-slider-item='"+data.number+"']").css({"opacity": 1});	
        	}   
        });	
        Bridge.Event.on("master:sales-listing-carousel-close", function (data) {
        	if (data.close === true) {
        		dom.find("[data-tab-details]").fadeOut().removeClass("show");
        		dom.find("[data-tab-item]").removeClass("active");
        	}
        });	
    }
};
