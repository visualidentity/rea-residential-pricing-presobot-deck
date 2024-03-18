/**
 * Base class for all components.
 */
class Component {
  set disabled(disabled) {
    this._disabled = disabled;
    this.el.classList.toggle('is-disabled', this._disabled);
  }

  get disabled() {
    return this._disabled;
  }

  set hidden(hidden) {
    this._hidden = hidden;
    this.el.classList.toggle('is-hidden', this._hidden);
  }

  get hidden() {
    return this._hidden;
  }

  /**
   * @param {Object} events - Collection of key/function pairs
   */
  set events(events) {
    this._events = _.mapObject(events, event => {
      return event || _.noop;
    });
  }

  get events() {
    return this._events;
  }

  /**
   * Set Component.el to new HTMLElement
   * @param  {HTMLElement} node
   */
  set el(node) {
    if (!(node instanceof HTMLElement)) {
      throw new Error(
        `${this.constructor.name}.el must be a HTMLElement node.`
      );
    }
    this._el = node;
  }

  /**
   * Return HTMLElement currently stored in Component._el
   */
  get el() {
    return this._el;
  }

  set events(val) {
    this._events = _.mapObject(val, func => {
      return func || _.noop;
    });
  }

  get events() {
    return this._events;
  }

  /**
   * Create a basic component.
   * Keeps track if it has been initialized
   * and generates a basic div element.
   */
  constructor() {
    this.initialized = false;
    this.el = document.createElement('div');
  }

  /**
   * Initialize the Component.
   * Use in class extensions to setup listeners etc.
   *
   * Always check if a Component has already been initialized
   * before performing any initialization actions.
   * eg. if (this.initialized) return;
   */
  initialize() {
    this.initialized = true;
  }

  /**
   * Render the Component.
   * A Component must be initialized before it can be rendered.
   *
   * Update the Component's DOM as required.
   */
  render() {
    if (!this.initialized) {
      throw new Error('Must initialize first.');
    }
  }

  /**
   * Can be called after the component has been rendered in the DOM
   */
  componentDidRender() {}

  /**
   * Destroy the Component and remove its div element from the DOM.
   *
   * Used to remove listeners, destroy any nested Components etc.
   */
  destroy() {
    this.el.remove();
  }
}
