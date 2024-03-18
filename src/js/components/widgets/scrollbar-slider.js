/**
 * Scrollbar Slider Class
 *
 */

class ScrollbarSlider {
  /**
   * @param  {Scrollbar} parent
   * @param  {Object} options
   */
  constructor(parent, options) {
    this.parent = parent;

    this.$el = options.$el;

    this.$targetEl = options.$targetEl;
    /**
     *
     * @type {Number}
     */
    this.maxScroll = -1;
    /**
     * {('rect'|'circle'|'ellipse')}l
     * @type String
     */
    this.orientation = options.orientation;

    this.coordinates = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };

    this.moveListener = _.bind(this.drag, this);
    this.stopListener = _.bind(this.stopDrag, this);
  }

  startDrag(e) {
    this.parent.updateCoordinates();
    var newPos = this.parent.getMousePosition(e);

    this.coordinates = this.getTruePosition();
    this.posOffset =
      this.orientation == 'vertical'
        ? newPos.top - this.coordinates.top
        : newPos.left - this.coordinates.left;
    //debugger;
    this.parent.$pageContainer.on('mousemove touchmove', this.moveListener);
    // console.log(
    //   'drag startDrag',
    //   this,
    //   newPos.top,
    //   this.coordinates.top,
    //   this.posOffset
    // );

    /* TODO bind this to a higher level element, otherwise dragging outsidfe the page will not be captured */
    this.parent.$pageContainer.on('mouseup touchend', this.stopListener);
  }

  /**
   * @param  {Event} e
   */
  drag(e) {
    var newPos = this.parent.getMousePosition(e);

    var newVal =
      this.orientation == 'vertical'
        ? newPos.top - this.parent.coordinates.top
        : newPos.left - this.parent.coordinates.left;
    var newValWithOffset = newVal - this.posOffset;
    var percentVal = newValWithOffset / this.maxCoordinate;
    // console.log("drag newPos",  newPos);
    // console.log("drag newVal newValWithOffset",  newVal , newValWithOffset );
    this.parent.$targetEl[0][
      this.orientation == 'vertical' ? 'scrollTop' : 'scrollLeft'
    ] = Math.round(percentVal * this.maxScroll);
    // console.log("drag newPos", this.parent.$targetEl[0]);
  }

  /**
   * @param  {Event} e
   */
  stopDrag(e) {
    e.preventDefault();

    var newPos = this.parent.getMousePosition(e);
    console.log('stopDrag', this.moveListener);
    this.parent.$pageContainer.off('mousemove touchmove', this.moveListener);
    this.parent.$pageContainer.off('mouseup touchend', this.stopListener);
  }
  /**
   * @param  {Boolean} state
   */
  setHoverState(state) {
    this.$el.toggleClass('hover', state);
  }
  /**
   * @param  {Number} currentValue
   */
  updatePosition(currentValue) {
    console.log(currentValue);
    this.$el.css(
      this.orientation == 'vertical' ? 'top' : 'left',
      (currentValue / this.maxScroll) * this.maxCoordinate
    );
  }
  /**
   * @param  {Number} maxScroll
   * @param  {Number} maxDimension
   * @param  {Number} visibleProportion
   */
  initialize(maxScroll, maxDimension, visibleProportion) {
    this.parentDimension = maxDimension;

    var sliderDimension = maxDimension * visibleProportion;
    this.maxCoordinate = maxDimension - sliderDimension;
    this.maxScroll = maxScroll;
    this.$el.css(
      this.orientation == 'vertical' ? 'height' : 'width',
      sliderDimension
    );

    this.coordinates = this.getTruePosition();

    if (!this.hasInited && !this.parent.parent.slide.isClient) {
      this.$el.on('mousedown touchstart', _.bind(this.startDrag, this));
    }

    this.hasInited = true;
  }

  getTruePosition() {
    var pageContainerOffset = this.parent.$pageContainer.offset() || {
      top: 0,
      left: 0
    };

    // Measure our coordinates and dimensions
    var targetOffset = this.$el.offset();
    var correctPos = this.parent.measurementFunction({
      top: targetOffset.top - pageContainerOffset.top,
      left: targetOffset.left - pageContainerOffset.left
    });

    correctPos.width = this.$el.outerWidth();
    correctPos.height = this.$el.outerHeight();

    return correctPos;
  }
}
