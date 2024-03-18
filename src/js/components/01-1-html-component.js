/**
 * Simple component to generate HTML based on a state and given props
 */
class HtmlComponent {
  /**
   * Returns a string literal of html
   * Intended to be overridden
   * @return {String} - output HTML string
   */
  get html() {
    return `<div data-key="${this.key}"></div>`;
  }

  /**
   * Return a list of default options for this class
   */
  get defaultOptions() {
    return {
      path: '',
      persistent: false,
      persistentStates: [],
      global: false,
      listener: false,
      children: {},
      onUpdated: _.noop
    };
  }

  get defaultChildren() {
    return {};
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

  /**
   * Set the locally stored state object
   * If no BridgeState has been created yet, instantiates the BridgeState object
   */
  set state(val) {
    this._state = val;
    if (!this._bridgeState) {
      this._bridgeState = new BridgeState(this.getInitialState());
    }
  }

  get state() {
    return this._state;
  }

  /**
   * @param {String} key - unique key, used to for BridgeState events
   * @param {Object} [options={}] - options to assign to object instance
   * @param {Boolean} [options.persistent] - whether BridgeState should be saved to the context
   * @param {Array} [options.persistentStates] - list of state keys for individually persistent states
   * @param {Object} [options.children] - pass children here to override the defaults
   * @param {Function} [options.onUpdated] - callback, by default this is called in componentDidUpdate
   */
  constructor(key, options = {}, state = {}) {
    this.firstRender = true;
    this.el = document.createElement('div');
    this.key = key;
    this.options = _.defaults({ ...options }, this.defaultOptions);
    this.state = state;
    this.children = _.defaults(
      { ...this.options.children },
      this.defaultChildren
    );
    this.initialized = false;
    this.firstStateUpdate = true;
  }

  /**
   * Declare the extending class' initial Bridge State:
   * See BridgeState.js for available options.
   *
   * eg.
   * getInitialState() {
   *  return {
   *    path: '.panels',
   *    key: 'panel_id',
   *    persistent: true,
   *    initial: {
   *      content: {
   *        value: {},
   *        global: true,
   *        onUpdate: this.updatePanel.bind(this)
   *      }
   *    },
   *    global: true
   *  };
   * }
   */
  getInitialState() {
    return {
      context: this,
      key: this.key,
      path: this.options.path,
      persistent: this.options.persistent,
      global: this.options.global,
      listener: this.options.listener,
      initial: _.mapObject(this.state, (val, key) => {
        const state = {
          value: val
        };

        if (!this.options.persistent) {
          state.persistent = _.contains(this.options.persistentStates, key);
        }

        return state;
      }),
      onUpdate: this.stateUpdateReceived
    };
  }

  /**
   * Calls BridgeState.update with the given key-value pairs.
   * @param {Object} state - key-value pairs of the states to be updated
   */
  setState(state) {
    this._bridgeState.update(state);
    this.firstStateUpdate = false;
  }

  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    if (this._bridgeState) this._bridgeState.initialize();
    _.each(this.children, child => child.initialize());
    this.componentDidInitialize();
  }

  componentDidInitialize() {}

  /**
   * Callback passed to BridgeState.onUpdate
   * Receives the full key-value pairs with updated values
   * @param {Object} state - full key-value pairs of updated state
   */
  stateUpdateReceived(state) {
    if (this.shouldComponentUpdate(state)) {
      this.componentWillUpdate(state);
      const oldState = _.deepExtend(this.state);
      this.state = state;
      this.componentDidUpdate();
      if (this.shouldComponentRender(oldState)) {
        this.renderToDOM();
      }
    }
  }

  /**
   * Called prior to a state update.
   * If false is returned, state will not update.
   * @param {Object} newState - updated state object
   * @returns {Boolean} - True if any state value has changed
   */
  shouldComponentUpdate(newState) {
    return _.some(this.state, (value, key) => {
      return !_.isEqual(newState[key], value);
    });
  }

  /**
   * Called immediately before this component's state will update
   * @param {Object} state - updated key-value pairs
   */
  componentWillUpdate(state) {}

  /**
   * Called immediately after component's state has updated
   */
  componentDidUpdate() {
    this.options.onUpdated(this.state);
  }

  /**
   * Called prior to component rendering due to state update.
   * If false is returned, component will not render.
   */
  shouldComponentRender() {
    return true;
  }

  /**
   * Called immediately prior to component rendering
   */
  componentWillRender() {}

  /**
   * Called after the component has been rendered in the DOM
   */
  componentDidRender(parent) {
    this.parent = parent || this.parent;
    this.el = this.parent.querySelector(`[data-key="${this.key}"]`);
    if (this.firstRender) {
      this.componentDidMount();
      this.firstRender = false;
    }
    _.each(this.children, child => {
      child.componentDidRender(this.el);
    });
  }

  /**
   * @return {String} - current html
   */
  render() {
    this.componentWillRender();
    return this.html;
  }

  componentDidMount() {}

  /**
   * Render this component in the DOM
   * Does not work if 'this.el' is not in DOM
   */
  renderToDOM() {
    if (!this.el.parentElement) return;
    this.el.outerHTML = this.render();
    this.componentDidRender();
  }

  /**
   * Destroy the component's children and remove the element from the DOM
   */
  destroy() {
    if (this._bridgeState) this._bridgeState.clearEvents();
    _.each(this.children, child => child.destroy());
    this.el.remove();
    this.el = document.createElement('div');
  }

  /**
   * Completely destroy this components state
   * ** Will remove it's reference in the context. **
   */
  deleteState() {
    if (this._bridgeState) this._bridgeState.destroy();
  }
}
