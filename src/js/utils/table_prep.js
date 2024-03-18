var tablePrep = function(options) {
  var dom;
  var storePath = options.context;
  dom = options.slide;
  var preview = $('body').hasClass('preview') ? true : false;
  var $removable = dom.find('[data-removable]');
  var $reset = dom.find('[data-reset]');
  var removed = Bridge.Context.get(options.context, []);

  if (preview) {
    _initRemovables();
  }

  _initRemovablesRender();

  function _initRemovables() {
    $removable.click(function() {
      var index = $(this).closest('[data-removable]').data();
      if (!(index.removable in removed)) {
        removed.push(index.removable);
      }

      Bridge.Context.set(storePath, removed);

      _initRemovablesRender();
		});

    $reset.click(function() {
      removed = [];

      Bridge.Context.set(storePath, removed);

      _initRemovablesRender();
		});
  }

  function _initRemovablesRender() {
    dom.find('[data-removable]').show();
    removed.forEach(function(item) {
      dom.find('[data-removable="' + item + '"]').hide();
    });
  }
}