/**
 * Scrollbar Class
 *
 *
 */

class Scrollbar {
  /**
   * @param  {ScrollableRegion} parent
   * @param  {Object} options
   */
  constructor(parent, options) {
    this.parent = parent;
    this.$pageContainer = this.parent.slide.$pageContainer;
    this.slideId = this.$pageContainer.attr('id');
    /**
     * a unique id for the purposes of sharing state etc
     * @type String
     */

    this.uid = options.uid;
    this.$el = options.$el;
    this.$sliderEl = this.$el.find('.scrollbar-slider');
    this.orientation = options.orientation;
    this.$targetEl = options.$targetEl;
    this.inset = options.inset;
    this.slider = new ScrollbarSlider(this, {
      $el: this.$sliderEl,
      orientation: this.orientation
    });

    this.active = false;

    this.measurementFunction = generateMeasurementFunction(
      this.$pageContainer,
      1920,
      1080
    );

    this.coordinates = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.state = new BridgeState(this, this.key, {
      currentScroll: {
        value: options.initialValue || 0,
        onUpdate: function(val) {
          //this.updateScrollPosition(val);
          this.updateScroll(val);
        }.bind(this)
      }
    });

    // This component uses timeouts, timeouts are cleared by
    // globalDeckReady on each slide's 'slide:closed'.
    // As a result, this component needs to setup a container for any timeouts generated
    // for this slide/component combination so they can be cleared when required.
    window.slideTimeouts[this.slideId] =
      window.slideTimeouts[this.slideId] || [];
  }

  initialize() {
    this.$el.addClass('initialising');

    this.updateCoordinates();

    if (this.orientation == 'vertical') {
      this.visibleHeight = this.$targetEl[0].clientHeight;
      this.totalContentHeight = this.$targetEl[0].scrollHeight;
      this.maxScroll = this.totalContentHeight - this.visibleHeight;
      this.maxDimension = this.coordinates.height;
      this.visibleProportion = this.visibleHeight / this.totalContentHeight;
    } else {
      this.maxScroll =
        this.$targetEl[0].scrollWidth - this.$targetEl[0].clientWidth;
      this.maxDimension = this.coordinates.width;
      this.visibleProportion =
        this.$targetEl[0].clientWidth / this.$targetEl[0].scrollWidth;
    }

    if (this.visibleProportion >= 1) {
      this.setActive(false);
      return;
    }

    this.setActive(true);

    this.slider.initialize(
      this.maxScroll,
      this.maxDimension,
      this.visibleProportion
    );
    this.broadcastScroll();

    if (!this.parent.slide.isClient)
      this.$el.on('mousedown touchstart', _.bind(this.startDrag, this));

    window.slideTimeouts[this.slideId].push(
      setTimeout(
        function() {
          this.$el.removeClass('initialising');
        }.bind(this),
        500
      )
    );

    // start listening for events from the target element
    // ie scrolled by touch on device
    if (!this.hasInited) {
      if (!this.parent.slide.isClient) {
        this.$targetEl.scroll(_.bind(this.broadcastScroll, this));
      }
      //else {
      //      Bridge.Event.on(this.uid, _.bind(this.updateScroll, this));
      // }
    }

    //console.log(this.orientation + ' slider.hasinited()');
    this.hasInited = true;
  }

  setHoverState(state) {
    this.$el.toggleClass('hover', state);
  }

  setActive(state) {
    this.$el.toggleClass('disabled', !state);
    this.$el.toggleClass('enabled', state);
    this.$el.parent().toggleClass('scrollbar-disabled', !state);
    this.active = state;
  }

  /*  listener for scroll events on $targetEl */
  broadcastScroll(e) {
    var currentScroll =
      this.orientation == 'horizontal'
        ? this.$targetEl[0].scrollLeft
        : this.$targetEl[0].scrollTop;
    this.state.update({ currentScroll: currentScroll });
    //    this.slider.updatePosition(currentScroll);
    //    Bridge.Event.trigger(this.uid, currentScroll);
  }

  // client side updates
  updateScroll(newScrollValue) {
    if (this.orientation == 'horizontal') {
      this.$targetEl[0].scrollLeft = newScrollValue;
    } else {
      this.$targetEl[0].scrollTop = newScrollValue;
    }
    this.slider.updatePosition(newScrollValue);
  }

  startDrag(e) {
    //console.log('Scrollbar.startDrag()');

    this.updateCoordinates();

    if (e.target != this.$sliderEl[0]) {
      // calc an offset and then pass the click down
      var targetParam = this.orientation == 'vertical' ? 'top' : 'left';
      var targetDim = this.orientation == 'vertical' ? 'height' : 'width';

      var sliderLoc =
        this.getMousePosition(e)[targetParam] -
        this.coordinates[targetParam] -
        this.slider.coordinates[targetDim] / 2;
      //   console.log('Scrollbar.startDrag()', this.getMousePosition(e)[targetParam] );
      if (sliderLoc < 0) sliderLoc = 0;
      if (sliderLoc > this.maxDimension) sliderLoc = this.maxDimension;

      this.$sliderEl.css(targetParam, sliderLoc);
      console.log(
        'Scrollbar.startDrag()',
        sliderLoc,
        this.maxDimension,
        this.coordinates
      );
      // console.log('Scrollbar.startDrag()',this.getMousePosition(e)[targetParam] , sliderLoc );
      this.slider.startDrag(e);
      this.slider.moveListener(e);
    }
  }

  getScrollingParentNode() {
    return this.$targetEl.children();
  }

  updateCoordinates() {
    var pageContainerOffset = this.$pageContainer.offset() || {
      top: 0,
      left: 0
    };

    // Measure our coordinates and dimensions
    var targetOffset = this.$el.offset();
    this.coordinates = this.measurementFunction({
      top: targetOffset.top - pageContainerOffset.top,
      left: targetOffset.left - pageContainerOffset.left
    });

    this.coordinates.width = this.$el.outerWidth() - this.inset * 2;
    this.coordinates.height = this.$el.outerHeight() - this.inset * 2;
  }

  /**
   * Get current mouse position (click or touch)
   * Relative to the $pageContainer
   *
   * @param {Event} e - click/touch event
   * @returns {Object} top and left position
   */
  getMousePosition(e) {
    var clickEvent = e.originalEvent || e;

    // Unwrap touch event if required
    if (
      !clickEvent.pageX &&
      !clickEvent.pageY &&
      clickEvent.touches &&
      clickEvent.touches.length
    ) {
      clickEvent = clickEvent.touches[0];
    }

    var mouseX = clickEvent.pageX;
    var mouseY = clickEvent.pageY;

    // Offset mouse position by $pageContainer
    var pageContainerOffset = this.$pageContainer.offset() || {
      top: 0,
      left: 0
    };

    return this.measurementFunction({
      top: mouseY - pageContainerOffset.top,
      left: mouseX - pageContainerOffset.left
    });
  }

  /* TODO port over the Wealth code for measuring and chunking content for printing */
}
