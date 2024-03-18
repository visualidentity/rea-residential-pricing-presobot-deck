class HtmlInput extends HtmlComponent {
  get html() {
    return `<div
        class="c-text-input"
        contenteditable="${!this.options.disabled}"
        data-key="${this.key}"
      >
        ${this.state.content}
      </div>`;
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      disabled: false
    };
  }

  constructor(key, options) {
    super(key, options, { content: '' });
  }

  inputChanged = e => {
    this.setState({ content: this.el.innerText });
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
