class DropdownItem extends HtmlComponent {
  constructor(key, options) {
    super(key, options);
    this.$pageContainer = Bridge.Slides.getArticle();
  }

  clearEventListeners() {
    this.$pageContainer.off(
      'click',
      `.c-dropdown__item[data-key="${this.key}"]`
    );
  }

  componentDidMount() {
    const { key, onClick } = this.options;
    this.clearEventListeners();
    this.$pageContainer.on(
      'click',
      `.c-dropdown__item[data-key="${this.key}"]`,
      () => {
        onClick(key);
      }
    );
    super.initialize();
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      isHidden: () => false
    };
  }

  get html() {
    return /* html */ `
      <div
        class="c-dropdown__item"
        data-key="${this.key}"
        data-hidden="${this.options.isHidden(this.options.key)}"
      >
        ${_.map(Object.keys(this.children), childKey =>
          this.children[childKey].render()
        ).join('')}
      </div>
    `;
  }
}

class Dropdown extends HtmlComponent {
  constructor(key, options) {
    super(key, options, {
      isOpen: options.isOpen || false,
      persistent: false
    });
  }

  toggle(isOpen) {
    this.setState({ isOpen });
  }

  componentDidUpdate() {
    this.options.onUpdate && this.options.onUpdate(this.state.isOpen);
  }

  get position() {
    const container = this.$pageContainer[0].getBoundingClientRect();
    const bounding = $(this.el)[0].getBoundingClientRect();
    return [container, bounding];
  }

  get defaultOptions() {
    return {
      ...super.defaultOptions,
      direction: 'bottom'
    };
  }

  get html() {
    const { isOpen } = this.state;

    return /* html */ `
      <div
        class="c-dropdown"
        isOpen="${isOpen}"
        data-key="${this.key}"
        direction="${this.options.direction}"
      >
        ${_.map(Object.keys(this.children), childKey =>
          this.children[childKey].render()
        ).join('')}
      </div>
    `;
  }

  get defaultChildren() {
    const { items, itemRenderer, onItemClick, isItemHidden } = this.options;
    return {
      ..._.mapObject(
        _.indexBy(items, item => `${this.key}-${item.key}`),
        (val, key) =>
          new DropdownItem(key, {
            onClick: key => {
              this.setState({ isOpen: false });
              onItemClick(key);
            },
            key: val.key,
            isHidden: isItemHidden,
            children: {
              child: itemRenderer(`${key}-child`, val)
            }
          })
      )
    };
  }
}
