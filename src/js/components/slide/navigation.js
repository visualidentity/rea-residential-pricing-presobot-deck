// TODO - Add templating

class SubslideNavigation {
  /**
   * This adds up and down arrows to any slides with subslides,
   * it is automatically run by Slide unless specified otherwise
   *
   * @param {*} options
   * @param {Subslide[]} options.subslides - the subslides
   * @param {Slide} - the current slide
   */
  constructor(options) {
    this.subslides = options.subslides;
    this.slide = options.slide;
    this.template = options.template || false;
    this.initialize();
    this.keys = Bridge.Sub.keys();
    this.update(1);
  }

  update(index) {
    var nextAvailable = _.contains(
      this.keys,
      'subslide-' + (Number(index) + 1)
    );
    var prevAvailable = _.contains(
      this.keys,
      'subslide-' + (Number(index) - 1)
    );
    if (nextAvailable) {
      this.$next.html(
        $(_.findWhere(this.subslides, { index: index + 1 }).el).data('navLabel')
      );
      this.$next.removeClass('o-navigation--disabled');
    } else {
      this.$next.addClass('o-navigation--disabled');
    }
    if (prevAvailable) {
      this.$prev.removeClass('o-navigation--disabled');
    } else {
      this.$prev.addClass('o-navigation--disabled');
    }
  }

  initialize() {
    this.$container = $('<div class="o-navigation o-slide-constant" />');
    this.$next = $(
      '<div class="o-navigation--next" data-companywide-interactive/>'
    );
    this.$prev = $(
      '<div class="o-navigation--prev" data-companywide-interactive/>'
    );
    this.$next.on('click', () => {
      Bridge.Sub.show('subslide-' + (Number(this.slide.currentSubslide) + 1));
    });
    this.$prev.on('click', () => {
      Bridge.Sub.show('subslide-' + (Number(this.slide.currentSubslide) - 1));
    });
    this.$container.append(this.$prev);
    this.$container.append(this.$next);
    this.slide.$pageContainer.append(this.$container);
  }
}
