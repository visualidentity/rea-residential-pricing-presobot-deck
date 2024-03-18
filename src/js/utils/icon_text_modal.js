var iconTextModal = function ($pageContainer, pageId) {

  var id = pageId + '_itm';
  var $toggle = $pageContainer.find('[data-modal-toggle]');
  var $modals = $pageContainer.find('[data-modal-item]');

  var master = $("body").hasClass("master") || $("body").hasClass("share_online") ? true : false;

	var contextStore = {
    activeId: null
  }

  var state = Bridge.Context.get(id, contextStore);

  var updateModal = function(context) {

    var {
      activeId
    } = context

    var modal = $pageContainer.find(`[data-modal-item="${activeId}"]`);
    modal.toggleClass('is-active');

    $modals.each(function() {
      var thisId = $(this).attr("data-modal-item")
      if (thisId !== activeId) {
        $(this).removeClass('is-active');
      }
    })
  }

  if (master) {
    // master
    console.log('master..')
    var state = Bridge.Context.match("." + id, {})
    Bridge.Event.trigger("slide:updateData", state);
    updateModal(state);

    $toggle.on('click', function(e) {
      var $target = $(e.target);
      var modalID = $target.attr('data-modal-toggle');
      var modal = $pageContainer.find(`[data-modal-item="${modalID}"]`);
      var activeId = modal.hasClass('is-active') ? null : modalID;

      _.assign(contextStore, {
        activeId
      });
      
      Bridge.Context.set(id, contextStore);
      Bridge.Event.trigger("slide:updateData", contextStore);
    })
  } else {
    console.log('client...')
    // client
  }

  Bridge.Event.on("slide:updateData", function(context) {
    updateModal(context);
  });
}
