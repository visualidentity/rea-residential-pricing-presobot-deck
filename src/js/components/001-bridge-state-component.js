/**
 * Component class with a Bridge State.
 */
class BridgeStateComponent extends Component {
  constructor() {
    super();
  }

  /**
   * Create a basic component.
   * Keeps track if it has been initialized
   * and generates a basic div element.
   */
  initialize() {
    if (this.initialized) return;
    const initial = _.extend(
      {
        context: this
      },
      this.getInitialState()
    );

    this.state = new BridgeState(initial);
    this.state.initialize();

    super.initialize();
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
    throw new Error('BridgeStateComponent - initial state must be filled out.');
  }

  /**
   * Destroys the Component's state.
   */
  destroy() {
    this.state.destroy();
    super.destroy();
  }
}
