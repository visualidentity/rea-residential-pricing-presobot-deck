var popUpToggle = function(options) {
  var dom = options.slide;
  var $popUpContent = dom.find("[data-pop-up-toggle]");
  var showOneOnly = options.showOneOnly ? true : false;


  Bridge.Event.on('master:popUpClick', function(e) {  

    var $content = dom.find(`[data-pop-up-toggle="${e}"]`);

    if(showOneOnly) {
      $.each(dom.find('[data-pop-up-toggle]'), function() {
        if ($(this).data('pop-up-toggle') !== e) {
          $(this).removeClass('active');
        }
      });
    }

    if ($content && $content.hasClass('active')) {
      dom.find(`[data-pop-up-toggle="${e}"]`).removeClass('active');
    } else {
      dom.find(`[data-pop-up-toggle="${e}"]`).addClass('active');
    }
  })

  if (!client) {
    $popUpContent.on('click', function (e) {
      var data = $(this).data('pop-up-toggle');
      Bridge.Event.trigger('master:popUpClick',  data);
    });
  }
}