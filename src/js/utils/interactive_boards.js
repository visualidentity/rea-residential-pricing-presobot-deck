var initBoards = function($pageContainer) {
    var board = $pageContainer.find('.board'),
        exit = $pageContainer.find('.board-exit'),
        slate = '<span class="board-slate"></span>',
        attr, activeIndex,
        client = $('body').hasClass('client') ? true : false,
        screenshot = $("body").hasClass('screenshot') ? true: false;

    if (client) {
        _bindClientEvents();
    }
    else {
        _bindMasterEvents();
    }

    function boardModal(modal) {
        activeIndex = '.board-' + modal, $pageContainer;
        if ($(activeIndex).hasClass('board-modal')) {
            $(activeIndex).addClass('board').removeClass('board-modal');
        } else {
            $(activeIndex).removeClass('board').addClass('board-modal');
        }
        if ($('.board-slate', $pageContainer).is(':visible')) {
            $('.board-slate', $pageContainer).remove();
        } else {
            $(slate).insertAfter(activeIndex);
        }
        $(board).not(activeIndex).toggleClass('board-ignore');
    }

    function _bindMasterEvents() {
        $(board, exit).click(function() {
            attr = $(this).attr('tabindex');
            Bridge.Event.trigger('master:expand-board', {attr: attr});
            boardModal(attr);
        });

        Bridge.Event.on('client:fetch-board-state', function() {
            Bridge.Event.trigger('master:expand-board', {attr: attr});
            console.log(attr);
		});
    }

    function _bindClientEvents() {
		Bridge.Event.trigger('client:fetch-board-state');
        Bridge.Event.on('master:expand-board', function (data) {
            boardModal(data.attr);
        });
	}
};
