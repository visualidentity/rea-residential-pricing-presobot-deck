/* eslint-disable max-lines */
class NextStepsSlide extends HtmlComponent {
  constructor(key, options = {}) {
    super(key, options, {
      sortBy: 'priority',
      sortDirection: 'asc',
      steps: [
        {
          priority: 1,
          text: '',
          date: ''
        }
      ]
    });
    this.svg = new SvgLibrary();
    this.$pageContainer = Bridge.Slides.getArticle();
  }

  indexFromEvent(e) {
    return $(e.target)
      .parents('.draggable-item')
      .index();
  }

  componentWillRender() {
    this.removeListeners();
  }

  componentDidRender(parent) {
    super.componentDidRender(parent);
    setTimeout(() => {
      this.dragList && this.dragList.destroy();
      this.dragList = new DraggableList(
        `${this.key}-drag`,
        this.options.slide,
        $(this.el).find('.draggable-list')[0],
        {
          persistentOrder: true,
          selector: '.draggable-item',
          targetSelector: '.drag-handle',
          onChange: (key, order) => this.onDragStop(key, order)
        }
      );
      this.dragList.initialize();
      const stepsLength = this.state.steps ? this.state.steps.length : 1;
      this.dragList.disabled = !(
        stepsLength > 1 && this.state.sortBy === 'priority'
      );
      this.addListeners();
    });
  }

  onAddClicked() {
    this.setState({
      steps: [
        ...this.state.steps,
        {
          text: '',
          date: '',
          priority: this.state.steps.length + 1
        }
      ]
    });
  }

  onRemoveClicked(e) {
    const index = this.indexFromEvent(e);
    this.setState({
      steps: _.filter(
        this.state.steps,
        (step, i) => index !== i
      ).map((step, index) => ({ ...step, priority: index + 1 }))
    });
  }

  onTableHeaderClicked(e) {
    const sortBy = $(e.target).attr('data-key');
    let sortDirection = 'asc';
    if (sortBy === this.state.sortBy) {
      sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.setState({
      sortDirection,
      sortBy
    });
  }

  onDragStop(key, order) {
    $('.c-draggable-container')
      .css({ top: 0, left: 0 })
      .html('');
    setTimeout(() => {
      this.setState({
        steps: _.map(order, (item, index) => ({
          ...this.state.steps[
            this.state.sortDirection === 'asc'
              ? +item.substr(5) - 1
              : this.steps.length - (+item.substr(5) - 1)
          ],
          priority:
            this.state.sortDirection === 'asc'
              ? index + 1
              : this.steps.length - (index + 1)
        })).filter(item => item)
      });
    }, 0);
  }

  onInputChanged(e) {
    const input = $(e.target);
    const steps = [...this.state.steps];
    steps[this.indexFromEvent(e)].text = input.text();
    this.setState({ steps });
  }

  onDatePickerClosed(selectedDates, dateStr, instance) {
    this.setState({
      steps: _.map(this.state.steps, (step, index) =>
        index === this.calIndex ? { ...step, date: dateStr } : step
      )
    });
    $('article#next_steps')
      .find('.calendar-modal')
      .removeClass('open');
  }

  onSetDateClicked(e) {
    const index = this.indexFromEvent(e);
    this.calIndex = index;
    $('article#next_steps')
      .find('.date-picker')
      .val(this.state.steps[index].date);
    $('article#next_steps')
      .find('.calendar-modal')
      .addClass('open');
    this.picker.open();
  }

  addListeners() {
    // SET UP GLOBAL EVENT LISTENERS
    if (Deck.modes.isEditor) {
      this.$pageContainer.on('click', '.add-step', e => this.onAddClicked());

      this.$pageContainer.on('click', '.remove-step', e =>
        this.onRemoveClicked(e)
      );

      this.$pageContainer.on('click', '.sort-header', e =>
        this.onTableHeaderClicked(e)
      );

      this.$pageContainer
        .find(`[data-key='${this.key}']`)
        .keypress(function(e) {
          return e.which != 13;
        });

      this.$pageContainer.on('input', '[contenteditable=true]', e =>
        this.onInputChanged(e)
      );

      this.picker = $('article#next_steps .date-picker').flatpickr({
        static: true,
        dateFormat: 'd/m/y',
        onClose: (selectedDates, dateStr, instance) =>
          this.onDatePickerClosed(selectedDates, dateStr, instance)
      });

      this.$pageContainer.on('click', '.cal-icon', e =>
        this.onSetDateClicked(e)
      );
    }
  }

  removeListeners() {
    this.$pageContainer.off('click', '.add-step');

    this.$pageContainer.off('click', '.remove-step');

    this.$pageContainer.off('click', '.sort-header');

    this.$pageContainer.find(`[data-key='${this.key}']`).unbind('keypress');

    this.$pageContainer.off('input', '[contenteditable=true]');

    this.picker = null;

    this.$pageContainer.off('click', '.cal-icon');
  }

  get defaultChildren() {
    return {};
  }

  destroy() {
    this.dragList.destroy();
    super.destroy();
  }

  get html() {
    const stepsLength = this.state.steps ? this.state.steps.length : 1;
    const cols = [3, 12, 5];
    const colTotal = _.reduce(cols, (tot, col) => tot + col, 0);
    const rowHeight = 122;
    return /* html */ `
      <div
        class="
          u-flex
          u-flex--col
          u-w--1
          u-h--1
          u-pad--bottom-60
        "
        data-key="${this.key}"
      >
        <div class="u-flex--1 u-flex u-flex--col u-flex--align-center u-pad--left-60 u-pad--right-20">
          
          <div class="u-flex--1 u-w--1 u-flex u-flex--row">
            <div class="u-flex--1 u-flex u-flex--col">
              <div class="o-table flex--none u-flex">
                <div
                  class="o-table--row u-font--demi u-color--white u-pad--bottom-10" 
                >
                  <div
                    class="o-table--cell s-table-header-cell u-w--${
                      cols[0]
                    }/${colTotal} u-text-align--center sort-header u-pad--left-20"
                    data-key="priority"
                    data-sorting="${this.state.sortBy === 'priority'}"
                    data-direction="${this.state.sortDirection}"
                  >
                    Priority
                  </div>
                  <div class="o-table--cell s-table-header-cell u-w--${
                    cols[1]
                  }/${colTotal} u-pad--left-40">
                    Action
                  </div>
                  <div
                    class="o-table--cell s-table-header-cell u-w--${
                      cols[2]
                    }/${colTotal} sort-header"
                    data-key="date"
                    data-sorting="${this.state.sortBy === 'date'}"
                    data-direction="${this.state.sortDirection}"
                  >
                    Date
                  </div>
                </div>
                <div
                  class="draggable-list"
                  style="height: ${rowHeight * stepsLength}px"
                >
                  ${_.map(
                    _.sortBy(this.state.steps, (step, index) => {
                      if (this.state.sortBy === 'priority') {
                        return this.state.sortDirection === 'asc'
                          ? index
                          : -index;
                      }
                      const date = moment(step.date, 'DD/MM/YY').unix();
                      return this.state.sortDirection == 'asc' ? date : -date;
                    }),
                    (step, index) => /* html */ `
                      <div
                        class="draggable-item u-pad--top-6 u-pad--bottom-6"
                        data-uid="item-${index + 1}"
                        style="top: ${index * 122}px">
                        <div class="draggable-item-inner o-table--row">
                        <div class="
                          o-table--cell
                          u-w--${cols[0]}/${colTotal}
                          u-font--demi
                          u-bg--background
                          u-text-align--center
                          u-font--fz-38
                          u-flex--row
                          u-flex--align-center
                          u-rel
                          u-pad--right-20 
                          u-border--right-10
                          u-border--color-blue 
                        ">
                          ${
                            Deck.modes.isEditor &&
                            stepsLength > 1 &&
                            this.state.sortBy === 'priority'
                              ? /* html */ `
                                <div class="drag-handle">
                                  ${this.svg.dragIcon}
                                </div>
                              `
                              : ''
                          }
                          ${step.priority}
                          ${
                            Deck.modes.isEditor && stepsLength > 1
                              ? `<span class="remove-step">${this.svg.removeIcon}</span>`
                              : ''
                          }
                        </div>
                        <div class="o-table--cell u-w--${
                          cols[1]
                        }/${colTotal} u-pad--left-40 u-pad--right-40 u-pad--top-10 u-pad--bottom-10 u-font--fz-22 
                        u-border--right-10
                        u-border--color-blue ">
                          ${
                            Deck.modes.isEditor
                              ? /* html */ `<div contenteditable="true" class="editable-item u-h--1 interactive">${step.text}</div>`
                              : step.text
                          }
                        </div>
                        <div class="u-pad--left-30 o-table--cell u-w--${
                          cols[2]
                        }/${colTotal} u-font--fz-22 u-flex--row u-flex--align-center u-flex--justify-between">
                          ${step.date}
                          <div class="cal-icon">
                            ${this.svg.calIcon}
                          </div>
                        </div>
                      </div>
                      </div>
                    `
                  ).join('')}
                </div>
              </div>
              ${
                Deck.modes.isEditor && stepsLength < 7
                  ? /* html */ `
                    <div class="add-step">
                    ${this.svg.plusIcon}
                      Add Step
                    </div>
                  `
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
