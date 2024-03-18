class HtmlEditableInput extends HtmlComponent {
  get html() {
    return /* html */ `
      <div
        class="c-text-input"
        contenteditable="${!this.options.disabled}"
        data-key="${this.key}"
        data-companywide-editable="${this.key}"
        data-toolbar="style color"
      >
        ${this.state.content ||
          this.options.editable.value ||
          this.options.defaultValue}
      </div>
    `;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      disabled: Deck.modes.isEditor,
      persistent: true
    };
  }

  constructor(key, options) {
    super(key, options, {
      content: ''
    });
  }

  inputChanged = e => {
    if (!this.options.disabled) {
      this.setState({ content: this.el.innerText });
    }
  };

  shouldComponentRender() {
    return !Deck.modes.isEditor || this.el.innerText != this.state.content;
  }

  componentDidRender(parent) {
    super.componentDidRender(parent);
    this.el.addEventListener('input', this.inputChanged);
  }

  destroy() {
    this.el.removeEventListener('input', this.inputChanged);
    super.destroy();
  }
}
