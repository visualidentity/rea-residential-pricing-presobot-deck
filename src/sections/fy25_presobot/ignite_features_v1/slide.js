new Slide({
  onReady () {
    var $pageContainer = $('article#ignite_features_v1');
    var $openVideoButton = $pageContainer.find('.column--2');
    var $subslide2 = $pageContainer.find('#subslide-2');
    var $closeBtn = $pageContainer.find('#subslide-2 .close-btn');

    var isClient = $('body').hasClass('client');

    var iframe = `
      <iframe width="100%" height="100%"
        src="https://www.youtube.com/embed/aOp-hwfeguw">
      </iframe>
    `;

    if (isClient) {
      Bridge.Event.on('master:play-video', () => {
        $pageContainer.find('header').css({"opacity": 0});
        $subslide2.append(iframe);
      });
      Bridge.Event.on('master:remove-iframe', () => {
        $pageContainer.find('header').css({"opacity": 1});
        $subslide2.find('iframe').remove();
      });
    } else {
      $openVideoButton.on('click', function() {
        Bridge.Sub.show('subslide-2');
        $subslide2.append(iframe);
        $pageContainer.find('header').css({"opacity": 0});
        Bridge.Event.trigger('master:play-video');
      });
  
      $closeBtn.on('click', function() {
        Bridge.Sub.show('subslide-1');
        $pageContainer.find('header').css({"opacity": 1});
        setTimeout(() => {
          $subslide2.find('iframe').remove();
          Bridge.Event.trigger('master:remove-iframe');
        }, 500);
      });
    }
  }
})