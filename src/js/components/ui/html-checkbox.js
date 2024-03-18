class HtmlCheckbox extends HtmlComponent {
  get html() {
    return /* html */ `
      <div
        class="c-checkbox"
        data-key="${this.key}"
        data-selected="${this.options.selected}"
      >
        ${this.options.content}
      </div>
    `;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      onClicked: _.noop,
      selected: false,
      disabled: false,
      content: ''
    };
  }

  constructor(key, options = {}) {
    super(key, options);
  }

  onClicked = e => {
    if (!this.options.disabled) {
      this.options.onClicked(this.key);
    }
  };

  componentDidRender(parent) {
    super.componentDidRender(parent);
    this.el.addEventListener('click', this.onClicked);
  }

  remove() {
    this.el.removeEventListener('click', this.onClicked);
    super.remove();
  }
}
