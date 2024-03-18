/**
 * Suggested layout for a scrollable setup
 * <div class="scrollbar scrollbar-vertical">
	  <div class="inner">
		  <div class="scrollbar-slider"></div>
			</div>
		</div>
		<div class="scrollable main-pad ">
      <div class="content-holder">
				<!-- content here -->
			</div>
		</div>
 */

class ScrollableRegion {
  constructor(slide, options) {
    // we bind to an existing element
    this.$el = options.$el;
    /** a unique identifier
     * @type String
     */
    this.uid = options.uid;
    /** vertical or horizontal
     * @type Slide
     */
    this.slide = slide;
    /** vertical or horizontal
     * @type String
     */
    this.orientation = options.orientation;
    /** slide's jqeury object
     * @type jQueryObject
     */
    this.$pageContainer = options.$pageContainer;

    /*  initial DOM setup */

    this.$scrollbarEl = $(`
    <div class='o-scrollable-region__scrollbar scrollbar-${this.orientation}'>
        <div class="inner">
        <div class="scrollbar-slider"></div>
        </div>
    </div>
    `);
    this.$contentEl = $(`
      <div class='o-scrollable-region__scrollable'>
          <div class="content-holder">
          </div>
      </div>
    `);

    this.$el.prepend(this.$contentEl);
    // allows for a content mask in between
    this.$el.append(this.$scrollbarEl);

    /* init scrollbars */
    this.scrollbar = new Scrollbar(this, {
      $el: this.$scrollbarEl,
      $targetEl: this.$contentEl,
      orientation: this.orientation,
      inset: 6,
      uid: this.uid + '-scrollbar'
    });

    this.extraStates = {
      currentScroll: this.scrollbar.state
    };
  }

  /**
   * injects content into the scrollable region,
   * replacing the existing
   * @param {jQueryObject} $newEl
   */
  injectContent($newEl) {
    this.$el.find('.content-holder').html($newEl);
  }
  update() {
    // remeasure height
    if (this.scrollbar) {
      this.scrollbar.initialize();
    }
  }

  setScroll(value) {
    if (this.scrollbar) {
      this.scrollbar.updateScroll(value);
    }
  }

  initScrollbar() {
    this.scrollbar.initialize();
  }
}
