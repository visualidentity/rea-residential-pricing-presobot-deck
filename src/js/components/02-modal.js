class Modal {
  static get defaultTemplate() {
    return _.template(
      `<div class="c-modal <% if (data.isOpen) { %>is-active<% } %>">
          <div
            class="c-modal__shroud js-modal-shroud <% if (data.canCloseShroud) { print('js-modal-close c-cursor--pointer'); } %>"
            <% if (data.canCloseShroud) { %>data-companywide-interactive<% } %>
          ></div>
          <div class="c-modal__contents js-modal-content" <% if (data.canCloseShroud) { %>data-companywide-interactive<% } %>></div>
        </div>`,
      { variable: 'data' }
    );
  }

  set events(events) {
    this._events = _.mapObject(events, event => {
      return event || _.noop;
    });
  }

  get events() {
    return this._events;
  }

  set activeContent(activeContent) {
    this.state.update({
      activeContent
    });
  }

  get activeContent() {
    return this.state.getValue('activeContent');
  }

  /**
   * Modal component
   * @param {Slide} slide - the slide object for this modal
   * @param {String} [key] - A unique key for the bridge state
   * @param {Function} [template] - An underscore template to render inside the modal
   * @param {Boolean} [canCloseShroud] - flags if the shroud can be clicked to closed the modal
   * @param {Function} [onClose] - The function to run after the modal is closed
   * @param {Function} [onRender] - The function to run after the modal is rendered
   */
  constructor(
    slide,
    { key, template, canCloseShroud, content, onClose, onRender } = {}
  ) {
    this.slide = slide;
    this.key = key || `modal-${this.slide.id}`;
    this.template = template || Modal.defaultTemplate;
    this.canCloseShroud = Boolean(canCloseShroud);

    this.el = DOMUtils.createDOMFromString(
      this.template({
        isOpen: false,
        canCloseShroud: this.canCloseShroud
      })
    );

    this.contentEl = this.el.querySelector('.js-modal-content');

    this.events = {
      onClose,
      onRender
    };

    this.buttons = this.generateButtons();

    this.checkContent(content);
    this.content = content || [];

    this.state = new BridgeState({
      context: this,
      key: this.key,
      initial: {
        open: {
          value: false,
          onUpdate: this.toggle
        },
        activeContent: {
          value: (this.content[0] && this.content[0].key) || null,
          onUpdate: this.toggleContent
        }
      }
    });

    this.init();
    this.render();
  }

  init() {
    if (this.inited) return;

    _.each(this.content, modalContent => {
      modalContent.modal = this;
      modalContent.init();
    });

    _.each(this.buttons, button => {
      button.initialize();
    });

    this.inited = true;
  }

  toggle(isOpen) {
    this.el.classList.toggle('is-active', isOpen);
    if (!isOpen) {
      this.events.onClose();
    }
  }

  toggleContent(contentKey) {
    if (!_.findWhere(this.content, { key: contentKey })) {
      throw new Error(
        `${this.constructor.name} ${this.key} - ${contentKey} is not a content component of this modal.`
      );
    }
    this.clear();
    _.each(this.content, modalContent => {
      modalContent.active = modalContent.key === contentKey;
      if (modalContent.key === contentKey) {
        this.contentEl.append(modalContent.el);
      }
    });
  }

  checkContent(content) {
    _.each(content, modalComponent => {
      if (!(modalComponent instanceof ModalContent)) {
        throw new Error(
          `Modal - Content could not be added, content key: "${modalComponent.key}" must be of type ModalContent.`
        );
      }
    });
  }

  generateButtons() {
    return _.map(this.el.querySelectorAll('.js-modal-close'), node => {
      return new Button({
        el: node,
        onClick: this.onCloseClicked
      });
    });
  }

  onCloseClicked = () => {
    this.close();
  };

  /**
   * open the modal
   */
  open() {
    this.state.update({
      open: true
    });
  }

  /**
   * closes the modal
   */
  close() {
    this.state.update({
      open: false
    });

    _.each(this.content, content => {
      content.active = false;
    });
  }

  /**
   * clears the modal
   */
  clear() {
    this.contentEl.innerHTML = '';
  }

  /**
   * draw the modal
   */
  render() {
    this.slide.pageContainer.appendChild(this.el);
    _.each(this.content, content => {
      content.render();
    });
    this.events.onRender();
  }

  destroy() {
    this.clear();

    _.each(this.buttons, button => {
      button.destroy();
    });

    _.each(this.content, content => {
      content.destroy();
    });
  }
}
