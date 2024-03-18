// TODO - This needs a rewrite as a proper component with/without state
class EditableDiv {
  constructor(options) {
    this.elem = options.elem;
    this.key = options.key || this.elem.id;
    this.rawVal = options.initialValue;
    this.placeholder = options.placeholder || this.elem.dataset.placeholder;
    this.disabled = options.disabled;
    this.charLimit = options.charLimit;
    this.enterSubmit = options.enterSubmit || false;
    // this.slide = slide;
    this.formatter =
      options.formatter ||
      function(val) {
        return val;
      };
    this.onChange = options.onChange || function(key, val) {};
    this.onFocusIn = options.onFocusIn || function(thisObj) {};
    this.onBlur = options.onBlur || function(thisObj) {};

    this.state = new BridgeState(this, this.key, {
      rawVal: {
        value: options.initialValue || '',
        persistent: true,
        onUpdate: function(val) {
          this.update(val);
          this.onChange(this.key, val);
        }
      }
    });

    this.init();
  }

  init() {
    if (!this.disabled) {
      this.elem.setAttribute('data-placeholder', this.placeholder);
      this.elem.setAttribute('contentEditable', 'true');
      this.elem.classList.add('interactive');
      // replace formatted val with rawVal on focus
      this.elem.addEventListener('focus', e => {
        this.elem.innerHTML = this.rawVal;
        this.onFocusIn(this);
      });
      // update rawVal and replace with formatted value
      this.elem.addEventListener('blur', e => {
        let val = this.elem.innerHTML;
        this.state.update({ rawVal: val });
        // kludge to stop immediate reselection on update
        var selection = window.getSelection();
        selection.removeAllRanges();
        this.onBlur(this);
      });
      // capture keypress events
      // 'enter' and Character limit support
      this.elem.addEventListener('keypress', e => {
        if (this.charLimit && this.elem.innerHTML.length === this.charLimit) {
          e.preventDefault();
        }
        if (this.enterSubmit && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      });
      // // TODO: Sanitise pasted input
      // // TODO: Apply character limit to pasted content
      // this.elem.addEventListener('paste', e => {
      //   // Trim input if 'paste' surpasses character limit
      //   e.preventDefault();
      //   const pastedText = e.clipboardData.getData('text');
      //   const selection = window.getSelection();
      //   const startIdx = selection.anchorOffset;
      //   const endIdx = selection.focusOffset;
      //   debugger;
      //   selection.deleteFromDocument();

      //   this.elem.innerHTML = this.elem.innerHTML.slice(0, startIdx) + pastedText + this.elem.innerHTML.slice(endIdx);

      //   // let text = e.clipboardData.getData('text');
      //   // if (this.charLimit && text.length > this.charLimit) {
      //   //   text = text.slice(0, this.charLimit);
      //   // }
      //   // console.log(this.elem.innerHTML);
      //   // console.log(this.elem.innterText);
      //   // this.elem.innerHTML = text;
      //   // if (this.charLimit && this.elem.innerHTML.length > this.charLimit) {
      //   //   this;
      //   //   debugger;
      //   //   let text = this.elem.innerText;
      //   //   text = text.slice(0, this.charLimit);
      //   //   this.elem.innerHTML = text;
      //   // }
      // });
    }
    this.update(this.state.getValue('rawVal'));
  }

  getValue() {
    return this.state.getValue('rawVal');
  }

  update(val) {
    this.rawVal = val;
    this.elem.innerHTML = this.formatter(this.rawVal);
  }
}
