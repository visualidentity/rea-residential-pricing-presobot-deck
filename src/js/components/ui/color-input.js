class ColorInput extends HtmlInput {
  get html() {
    return /* html */ `
      <div class="c-color-input" data-key="${this.key}">
        <div
          class="c-text-input js-input"
          contenteditable="${!this.options.disabled}"
        >
          ${this.state.content}
        </div>
        <div
          class="
            c-color-block
            ${
              ColourMap.hexRegex.test(`#${this.state.content}`)
                ? ''
                : 'c-color-block--empty'
            }
          "
          style="--color: #${this.state.content};"
        ></div>
      </div>
    `;
  }

  constructor(key, options = {}) {
    super(key, options);
  }

  inputChanged = e => {
    this.setState({ content: this.inputEl.innerText });
  };

  shouldComponentRender() {
    return (
      !Deck.modes.isEditor ||
      !this.inputEl ||
      this.inputEl.innerText != this.state.content
    );
  }

  componentDidRender(parent) {
    super.componentDidRender(parent);
    this.inputEl = this.el.querySelector('.js-input');
    this.inputEl.addEventListener('input', this.inputChanged);
  }

  destroy() {
    this.inputEl.removeEventListener('input', this.inputChanged);
    super.destroy();
  }
}
