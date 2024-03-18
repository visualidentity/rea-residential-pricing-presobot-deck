/**
 * Removable element managed by the Removables class.
 * Individual items can be removed when interactive.
 * Interactivity can be toggled and disabled.
 */
class Removable {
  set disabled(disabled) {
    this._disabled = Boolean(disabled);
    this.el.classList.toggle('is-disabled', this._disabled);
  }

  get disabled() {
    return this._disabled;
  }

  set hidden(hidden) {
    this._hidden = Boolean(hidden);
    this.el.classList.toggle('is-hidden', this._hidden);
  }

  get hidden() {
    return this._hidden;
  }

  set interactive(interactive) {
    this._interactive = interactive;
    this.removeButton.classList.toggle('is-hidden', !this._interactive);
  }

  get interactive() {
    return this._interactive;
  }

  /**
   * @param {Object} el
   * @param {Boolean} [disabled] - Remove button is visible but disabled
   * @param {Boolean} [hidden] - Item is removed (hidden) from the list
   * @param {Boolean} [interactive] - Show/hide remove button
   * @param {Function} [onRemove]
   */
  constructor(el, { disabled, hidden, interactive, onRemove } = {}) {
    if (!el.dataset.key) {
      throw new Error(
        `${this.constructor.name} - removable el must have a data-key attribute.`
      );
    }

    this.el = el;
    this.el.classList.add('c-removable');
    this.key = this.el.dataset.key;
    this.onRemove = onRemove || _.noop;

    this.removeButton = document.createElement('div');
    this.removeButton.classList = 'c-removable__button';
    this.el.append(this.removeButton);

    this.disabled = disabled;
    this.hidden = hidden;
    this.interactive = interactive;

    this.init();
  }

  init() {
    this.removeButton.addEventListener('click', e => {
      if (!this.interactive || this.disabled) return;
      e.stopPropagation();
      this.onRemove(this.key);
    });
  }
}

/**
 * A component which handles all removable elements supplied.
 * A reset button can be supplied to allow for removable items
 * to be reinstated.
 */
class Removables {
  set disabled(disabled) {
    this._disabled = disabled;

    _.each(this.removables, removable => {
      removable.disabled = disabled;
    });

    this.restoreButton.classList.toggle('is-disabled', disabled);
  }

  get disabled() {
    return this._disabled;
  }

  set interactive(interactive) {
    this._interactive = interactive;

    _.each(this.removables, removable => {
      removable.interactive = interactive;
    });

    this.restoreButton.classList.toggle('is-hidden', !interactive);
  }

  get interactive() {
    return this._interactive;
  }

  /**
   * @param {Object} key
   * @param {Boolean} disabled
   * @param {DOMElement[]} [removableEls] - Collection of removable assets
   * @param {DOMElement} [restoreEl] - Restore button
   * @param {Function} [onUpdate]
   */
  constructor(key, { disabled, removableEls, restoreEl, onUpdate } = {}) {
    this.key = key;
    this.onUpdate = onUpdate || _.noop;

    this.removables = _.map(removableEls || [], removableEl => {
      return new Removable(removableEl, {
        disabled,
        interactive: this.interactive,
        onRemove: this.removeItem
      });
    });

    this.restoreButton = restoreEl || document.createElement('div');
    this.restoreButton.classList.add('c-removable__restore');

    this.interactive = Deck.modes.is('preview');
    this.disabled = disabled;

    this.state = new BridgeState({
      context: this,
      key: this.key,
      initial: {
        removables: {
          value: false,
          persistent: true,
          onUpdate: this.updateRemovables
        }
      }
    });

    this.init();
  }

  init() {
    const state = this.state.getValue('removables');

    if (!state) {
      const initialState = _.reduce(
        this.removables,
        (removableState, removable) => {
          removableState[removable.key] = true;
          return removableState;
        },
        {}
      );

      this.state.update({
        removables: initialState
      });
    } else {
      // restore saved state
      this.updateRemovables(state);
    }

    this.restoreButton.addEventListener('click', () => {
      if (!this.interactive || this.disabled) return;
      this.reset();
    });

    // Disable when offline
    $('#slideshow').on('connectionChanged', (e, isOnline) => {
      this.disabled = !isOnline;
    });
  }

  updateRemovables = removableState => {
    _.each(this.removables, removable => {
      removable.hidden = !removableState[removable.key] || false;
    });
    this.onUpdate();
  };

  removeItem = itemKey => {
    const state = this.state.getValue('removables');
    state[itemKey] = false;
    this.state.update({
      removables: state
    });
  };

  /** Resets all removables to their initial state (visible) */
  reset() {
    this.state.update({
      removables: _.reduce(
        this.removables,
        (state, removable) => {
          state[removable.key] = true;
          return state;
        },
        {}
      )
    });
  }
}
