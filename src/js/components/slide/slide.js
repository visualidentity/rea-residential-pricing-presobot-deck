class Slide {
  /**
   * create a Slide
   * @param {Slide} options - options
   * @param {Object} options.pageContainer - the Slide HTML node
   * @param {Object} options.$pageContainer - the Slide jquery Object
   * @param {function} options.onRendered - this function is called when the slide is added to the DOM
   * @param {function} options.onReady - this function is called when the slide becomes the current slide
   * @param {function} options.onSubslideChange - a function called each time the subslide changes
   * @param {BridgeState} options.state - the internal BridgeState for the slide
   * @param {Object} options.feeds - Feeds to use on this slide
   * @param {Boolean} options.hideNavigation - set to true to disable the default subslide pagination
   */
  constructor(options = {}) {
    /** @type {SubSlide[]} - All the subslides on this slide */
    this.subslides = [];

    /** @type {string} - the slide's 'id' property */

    this.id = options.id || Bridge.Slides.getArticleID();

    /** @type {Object} - the Slide HTML Object */
    this.pageContainer =
      options.pageContainer || document.querySelector(`#${this.id}`);

    /** @type {Object} - the Slide jquery Object */
    this.$pageContainer = $(this.pageContainer);

    /** @type {function} - this function is called when the slide is added to the DOM */
    this.onRendered = options.onRendered || function() {};

    /**
     * this function is called when the slide becomes the current slide
     * @type {function}
     * @param {function=} done - optionally pass done in to tell the app when the slide has finished loading
     */
    this.onReady = options.onReady || function() {};

    /**
     * this function is called when the slide is closed
     * @type {function}
     */
    this.onClosed = options.onClosed || function() {};

    /** @type {function(number)} - a function called each time the subslide changes */
    this.onSubslideChange = options.onSubslideChange || function() {};

    /**
     * this function is called when the animation-complete is triggered by the app
     * @type {function}
     */
    this.onAnimationComplete = options.onAnimationComplete || function() {};

    this.utils = new SlideUtils(this);
    this.initialState = options.state;

    /**
     * @type {BridgeState} - the internal BridgeState for the slide
     */
    this.state = null;

    /**
     * @type {SlideModes} - accessor for checking the current presentation mode
     */
    this.modes = new SlideModes();
    /** whether the current user is the master */
    this.isMaster = !this.modes.is('client');
    /** whether the current user is the master */
    this.isClient = this.modes.is('client');
    /** whether the current mode is 'Share Online' */
    this.isShareOnline = this.modes.is('share_online');
    /** whether the current mode is 'Screenshot' */
    this.isScreenshot = this.modes.is('screenshot');
    /** whether the current mode is 'Screenshot' */
    this.isPDF = this.modes.is('screenshot-full');

    /**
     * Dict of feeds in the format {key: feed}
     */
    this.feeds = [];

    this.feedOptions = options.feeds || {};

    /** @type {Boolean} - set to true to disable the default subslide pagination */
    this.hideNavigation = options.hideNavigation;

    /**
     * an object containing the components of the slide, their state will be set up automatically
     */
    this.components = {};

    /**
     * @type {AnimationRenderer} - renderer that can animate SVG/CSS properties
     */
    this.animationRenderer = new AnimationRenderer();

    /** the index of the current subslide */
    this.currentSubslide = 1;

    /** animation complete observer */
    const observerConfig = {
      attributes: true
    };

    const mutationObserved = (mutationsList, observer) => {
      _.each(mutationsList, mutation => {
        if (mutation.type === 'attributes') {
          if (
            this.pageContainer &&
            _.contains(this.pageContainer.classList, 'animation-complete')
          ) {
            this.$pageContainer.trigger('animationcomplete');
          }
        }
      });
    };

    this.animCompleteObserver = new MutationObserver(mutationObserved);

    this.animCompleteObserver.observe(this.pageContainer, observerConfig);

    this.sectionNumber = new SectionNumber(this);

    /** initialize Slide */
    this.initialize();
  }

  getSubslides() {
    var subKeys = Bridge.Sub.keys();
    _.each(subKeys, (key, index) => {
      //var el = $(this.pageContainer).find('#' + key);
      var subslide = new SubSlide({
        pageContainer: this.pageContainer,
        subslide: Bridge.Sub.get('subslide-' + (index + 1)),
        index: index + 1,
        el: this.utils.findEl('#' + key),
        slide: this
      });
      this.subslides.push(subslide);
    });
  }

  // force DOM order to match subslide array order
  reorderSubslideElements() {
    // strip all page0x classes from subs (enabled or not)
    // note that app strips 'subslide' class from disabled adjuncts,
    // so .subslide is not a useful selector
    var allSubs = this.$pageContainer.find('.subslide-container > *');
    var subCount = allSubs.length;
    var removeSelector = _.reduce(
      _.range(0, subCount),
      (memo, index) =>
        memo + ' ' + 'page' + (index < 9 ? '0' : '') + (index + 1),
      ''
    );
    allSubs.removeClass(removeSelector);

    // and reorder to match array order
    _.each(this.subslides, (ss, index) => {
      var $ss = $(ss.el);
      var sequenceIndex = index + 1;
      const pageClass =
        sequenceIndex > 9 ? `page${sequenceIndex}` : `page0${sequenceIndex}`;
      $ss.addClass(pageClass);
      $ss.parent().append($ss);
    });
  }

  refreshSubslides() {
    this.subslides = [];
    this.getSubslides();
  }

  getFeeds() {
    this.feeds = _.mapObject(this.feedOptions, (feedID, key) => {
      return JSON.parse(JSON.stringify(Bridge.Feed.get(feedID).raw()));
    });
  }

  subslideChanged(index) {
    this.onSubslideChange(index);
  }

  goToSubslide(index) {
    Bridge.Sub.show('subslide-' + index);
  }

  log(message) {
    console.log('#' + this.id + ' - ', message);
  }

  goToSlide(path, cb) {
    cb = typeof cb === 'function' && cb;
    Bridge.Navigation.gotoSlide(path, cb);
  }

  getOnReady(callback) {
    if (this.onReady.length === 2) {
      return (e, done) => {
        callback(this, done);
      };
    } else {
      return e => {
        callback(this);
      };
    }
  }

  initialize() {
    this.$pageContainer.on('sliderendered', () => {
      this.state = new BridgeState({
        context: this,
        key: `slideState-${this.id}`,
        initial:
          typeof this.initialState === 'function'
            ? this.initialState()
            : this.initialState
      });
      this.getFeeds();
      typeof this.onRendered === 'function' && this.onRendered(this);

      // _.each(this.components, (component, key) => {
      //   if (component.state) {
      //     _.each(component.state.state, (state, key) => {
      //       if (state.onUpdate) {
      //         state.onUpdate.apply(component.state.context, [state.value]);
      //       }
      //     });
      //   }
      //   if (component.extraStates) {
      //     _.each(component.extraStates, extraState => {
      //       _.each(extraState.state, (state, key) => {
      //         if (state.onUpdate) {
      //           state.onUpdate.apply(extraState.context, [state.value]);
      //         }
      //       });
      //     });
      //   }
      // });
      this.animationRenderer.setInitialState();
    });
    this.$pageContainer.on(
      'slideready',
      this.getOnReady((e, done) => {
        this.state.initialize();

        this.getSubslides();
        if (
          this.subslides.length &&
          // this.state.isMaster &&
          !this.hideNavigation
        ) {
          this.navigation = new SubslideNavigation({
            subslides: this.subslides,
            slide: this
          });
        }
        // _.each(this.components, (component, key) => {
        //   if (component.state) {
        //     component.state.initClient();
        //     component.state.masterDone();
        //   }
        //   if (component.extraStates) {
        //     _.each(component.extraStates, extraState => {
        //       extraState.initClient();
        //       extraState.masterDone();
        //     });
        //   }
        // });
        typeof this.onReady === 'function' && this.onReady(e, done);

        setTimeout(() => {
          this.$pageContainer.addClass('slide-rendered');
        }, 0);

        this.animationRenderer.start();

        if (this.modes.is('edit-mode')) {
          this.animationRenderer.end();
        }
        this.utils.setupCdkFileLink(this.id);
      })
    );
    this.$pageContainer.on('animationcomplete', () => {
      this.animCompleteObserver.disconnect();
      this.animationRenderer.end();
      typeof this.onAnimationComplete === 'function' &&
        this.onAnimationComplete(this);
    });
    this.$pageContainer.on('slide:closed', () => {
      this.animCompleteObserver.disconnect();
      typeof this.onClosed === 'function' && this.onClosed(this);
    });
  }
}
