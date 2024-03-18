var subslideModalReturnOnYourInvestment = function(options, tab) {
    var dom = options.slide;
    var sectionTwo = options.sectionTwo ? options.sectionTwo : null;
    var $modal = dom.find('[data-subslide]');
    var $modalClose = dom.find('.content__subslide-modal .close-subslide');
    var $modalArrow = dom.find('.arrow-subslide');
    var $prev = dom.find('[data-prev]');
    var $next = dom.find('[data-next]');
    var $return = dom.find('[data-return]');  
    var $tab = dom.find("[data-tab]"),
        startBuy = $tab.find("[tab-item-buy]").attr("data-item-buy-start"),
        endBuy = $tab.find("[tab-item-buy]").attr("data-item-buy-end"),
        startRent = $tab.find("[tab-item-rent]").attr("data-item-rent-start"),
        endRent = $tab.find("[tab-item-rent]").attr("data-item-rent-end");     
  
    if (!client) {
      _bindMasterEvents();
    }
    
    function _bindMasterEvents() {
      if($("body").hasClass("edit-mode")) {
        $modalArrow.click(function() {
          console.log($(this).attr('data-subslide'));
          Bridge.Sub.show('subslide-' + $(this).attr('data-subslide'));
        });
      }
      else {
        $modal.click(function() {
          Bridge.Sub.show('subslide-' + $(this).attr('data-subslide'));
        });
      }
  
      $modalClose.click(function() {
        if (sectionTwo) {
          if ($(this).index() >= sectionTwo) {
            Bridge.Sub.show('subslide-' + sectionTwo);
          } else {
            Bridge.Sub.show('subslide-1');
          }
        } else {
          Bridge.Sub.show('subslide-1');
        }
      });
  
      $prev.click(function() {
        Bridge.Sub.show("prev");
        _navigationHandle();
          });
  
      $next.click(function() {
        Bridge.Sub.show("next");
        _navigationHandle();
          });
  
      $return.click(function() {
        Bridge.Sub.show('subslide-1');
          });
    }
    
    function _navigationHandle() {
      if(!$tab.length) {
        if (options.slide.context.className == 'subslide-2') {
          $prev.addClass('inactive');
          $next.removeClass('inactive'); 
        } else if (options.slide.context.className == 'subslide-' + ($modal.length + 1)) {      
          $next.addClass('inactive');
          $prev.removeClass('inactive');
        } else {
          $prev.removeClass('inactive');
          $next.removeClass('inactive');
        }
      } else {
        if (options.slide.context.className == 'subslide-'+startBuy || options.slide.context.className == 'subslide-'+startRent) {
          $prev.addClass('inactive');
          $next.removeClass('inactive');
        } else if (options.slide.context.className == 'subslide-'+endBuy || options.slide.context.className == 'subslide-'+endRent) {      
          $next.addClass('inactive');
          $prev.removeClass('inactive');
        } else {
          $prev.removeClass('inactive');
          $next.removeClass('inactive');
        }
      }
          
      }
  }