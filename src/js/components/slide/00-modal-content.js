class ModalContent {
  set active(active) {
    this.state.update({
      active
    });
  }

  get active() {
    return this.state.getValue('active');
  }

  /**
   * Modal content component.
   *
   * @param {String} key
   * @param {DOMElement} el - content
   */
  constructor(key, el) {
    this.key = key;
    this.modal = null; // Registered when the modal is initialized
    this.el = el;
    this.el.classList.add('c-modal-content');

    this.buttonConfig = [
      {
        selector: '.js-modal-close',
        onClick: this.closeClicked
      }
    ];

    this.state = new BridgeState({
      context: this,
      key: this.key,
      initial: {
        active: {
          value: false,
          onUpdate: this.toggle
        }
      }
    });

    this.components = this.generateComponents();
  }

  init() {
    if (this.inited) return;
    this.initComponents();
    this.inited = true;
  }

  initComponents() {
    _.each(this.components, component => {
      component.initialize();
    });
  }

  generateComponents() {
    return [...this.generateButtons()];
  }

  renderComponents() {
    _.each(this.components, component => {
      component.render();
    });
  }

  generateButtons() {
    return _.reduce(
      this.buttonConfig,
      (buttons, config) => {
        buttons = buttons.concat(
          _.map(this.el.querySelectorAll(config.selector), node => {
            return new Button({
              el: node,
              onClick: config.onClick
            });
          })
        );

        return buttons;
      },
      []
    );
  }

  closeClicked = () => {
    if (!this.modal) return;
    this.modal.close();
  };

  toggle(isActive) {
    this.el.classList.toggle('is-active', isActive);
  }

  render() {
    this.renderComponents();
  }
}
