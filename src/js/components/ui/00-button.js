/**
 * Basic button, can be clicked and disabled.
 */
class Button extends Component {
  /**
   * @param  {DOM} [el] // If not supplied, basic div will be created
   * @param  {Function} [disabled=false]
   * @param  {Function} [hidden=false]
   * @param  {Function} [onClick=()=>{}]
   */
  constructor({ el, disabled, hidden, onClick } = {}) {
    super();

    this.el = el || this.el;
    this.onClick = onClick || function() {};
    this.hidden = Boolean(hidden);
    this.disabled = Boolean(disabled);
  }

  initialize() {
    if (this.initialized) return;
    super.initialize();

    if (!Deck.modes.isEditor) return;
    this.el.addEventListener('click', this.buttonClicked);
  }

  buttonClicked = () => {
    if (this.disabled || this.hidden) return;
    this.onClick();
  };

  destroy() {
    if (Deck.modes.isEditor) {
      this.el.removeEventListener('click', this.buttonClicked);
    }

    super.destroy();
  }
}
