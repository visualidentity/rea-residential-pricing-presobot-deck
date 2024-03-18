/**
 * Toggle component, can be toggled on/off and disabled.
 */
class Toggle extends Component {
  set active(active) {
    this._active = active;
    this.el.classList.toggle('is-active', this._active);
  }

  get active() {
    return this._active;
  }

  /**
   * @param  {DOM} [el] // If not supplied, basic div will be created
   * @param  {Slide} [active]
   * @param  {Boolean} [disabled]
   * @param  {Function} [onToggle]
   */
  constructor({ el, active, disabled, onToggle } = {}) {
    super();
    this.onToggle = onToggle || _.noop;

    this.el = el || this.el;

    this.active = Boolean(active);
    this.disabled = Boolean(disabled);
  }

  initialize() {
    if (this.initialized) return;
    super.initialize();

    if (!Deck.modes.isEditor) return;
    this.el.addEventListener('click', this.toggleClicked);
  }

  toggleClicked = () => {
    if (!this.disabled) {
      this.active = !this.active;
      this.onToggle(this, this.active);
    }
  };

  destroy() {
    if (Deck.modes.isEditor) {
      this.el.removeEventListener('click', this.toggleClicked);
    }

    super.destroy();
  }
}
