var subslideAccordion = function (options, tab) {
  var dom = options.slide;
  var $accordion = dom.find(".accordion-title"),
    $accordionContent = dom.find(".accordion-content"),
    $accordionImage = dom.find(".subslide-image");

  // if (!client) {
  //   _bindMasterEvents();
  // }
  
  if ($("body").hasClass("master") || $("body").hasClass("share_online") || $("body").hasClass("client")) {
    $accordion.on('click', function () {
      $accordion.removeClass('active');
      $(this).addClass('active');
      if ($accordionImage.length > 0) {
        $accordionImage.removeClass('active');
        $accordionImage.eq($(this).attr('data-accordion-subslide') - 1).addClass('active');
      }
      Bridge.Event.trigger("master:click-accordion", $(this).index('.accordion-title'));
    });
    Bridge.Event.on("master:click-accordion", function (data) {
      _accordionHandle(dom.find('.accordion-title').eq(data));
    });
  }

  // function _bindMasterEvents() {
  //   $accordion.on('click', function () {
  //     $accordionContent.removeClass("active");
  //     $(this).parents(".subslide").find(".accordion-content").addClass("active");
  //     Bridge.Event.on("goToSubslide", function (id) {
  //       Bridge.Sub.show('subslide-' + $(this).attr('data-accordion-subslide'));
  //     });
  //   });
  // }

  function _accordionHandle(data) {
    $accordionContent.removeClass("active");
    if (!$(data).parents(".subslide").find('.accordion-content').hasClass('active')) {
      $(data).parents(".subslide").find('.accordion-content').addClass('active');
      Bridge.Event.on("goToSubslide", function (id) {
        Bridge.Sub.show('subslide-' + $(data).attr('data-accordion-subslide'));
      });
    }
    else {
      $(data).parents(".subslide").find('.accordion-content').removeClass('active');
    }
  }
}