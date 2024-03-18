class SourceDOM {
  set disabled(disabled) {
    this._disabled = Boolean(disabled);
    this.toggleEl.classList.toggle('is-disabled', this._disabled);
  }

  get disabled() {
    return this._disabled;
  }

  set active(active) {
    this.textEl.classList.toggle('is-active', active);
  }

  get active() {
    return this.state.getValue('open');
  }

  /**
   *
   * @param {DOMElement} toggleEl
   * @param {DOMElement} textEl
   * @param {String} key - optional key for storing to the Context
   * @param {Boolean} disabled - source cannot be toggled
   * @param {Boolean} active - hide/show source text
   */
  constructor(key, toggleEL, textEl, { disabled, active } = {}) {
    this.key = key;
    this.toggleEl = toggleEL;
    this.textEl = textEl;

    // Source shown by default for PM edit-mode and PDF screenshots
    const openByDefault =
      Deck.modes.is('edit-mode') || Deck.modes.is('screenshot-full');

    this.state = new BridgeState({
      context: this,
      key: this.key,
      initial: {
        open: {
          value: Boolean(openByDefault || active),
          onUpdate: this.toggleSource
        }
      }
    });

    // Interactivity disabled for client and PM edit-mode
    this.interactive = !Deck.modes.is('client') && !Deck.modes.is('edit-mode');
    this.disabled = disabled;

    this.addEventListeners();
  }

  /** toggles the source in the DOM */
  toggleSource(toggle) {
    this.active = toggle;
  }

  sourceClicked = event => {
    if (this.interactive && !this.disabled) {
      this.state.update({
        open: !this.active
      });
    }
  };

  /** Adds event listeners which will update the state of the source */
  addEventListeners() {
    _.each([this.toggleEl, this.textEl], el => {
      el.addEventListener('click', this.sourceClicked);
    });
  }
}
