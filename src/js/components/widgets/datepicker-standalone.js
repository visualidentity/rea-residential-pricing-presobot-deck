class DatePickerWidget {
  constructor(options) {
    this.$elem = options.$elem;
    this.onChange = options.onChange || function(key, val) {};
    this.disabled = options.disabled;
    this.key = options.id || this.elem.id;
    this.slide = options.slide;
    this.flatPickrOptions = options.flatPickrOptions || {};

    var initialVal = options.initialValue || '';

    this.state = new BridgeState(this, this.key, {
      rawVal: {
        value: initialVal,
        persistent: true,
        onUpdate: function(val) {
          this.update(val);
          this.onChange(this.key, val);
        }
      }
    });
    this.init();
  }

  onChange() {
    this.onChange(this.key, val);
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    this.$elem.attr('disabled', disabled);
    return this;
  }

  update(val) {
    this.$elem.html(val);
  }

  init() {
    this.setDisabled(this.disabled);

    this.update(this.state.getValue('rawVal'));
    if (this.slide.isMaster) {
      var flatPickrOptions = _.defaults(this.flatPickrOptions, {
        static: true,
        dateFormat: 'd/m/y',
        defaultDate: this.$elem.html(),
        onChange: (dates, dateStr, instance) => {
          this.state.update({ rawVal: dateStr });
        }
      });

      this.$elem.flatpickr(flatPickrOptions);
    }
  }
}
