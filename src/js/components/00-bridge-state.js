class BridgeState {
  constructor({
    context,
    path,
    key,
    initial,
    onUpdate,
    global,
    persistent,
    presets,
    listener
  }) {
    if (path && path[0] !== '.') {
      console.warn(
        `BridgeState - Invalid path supplied: "${path}".\nSupplied path must use CSS-link selector syntax`
      );
    }

    this.context = context;
    this.path = path || '';
    this.key = key;
    this.fullPath = [this.path, this.key].join(' .').trim();
    this.bridgeEventName = this.fullPath.replace(/[.]/g, '').replace(/ /g, '-');
    this.isMaster = !Deck.modes.is('client');
    this.isGlobal = global;
    this.isPersistent = persistent;
    this.saveToPreset = presets;
    this.isListener = listener;
    this.state = this.getInitialState(initial);
    this.onUpdate = onUpdate || _.noop;

    this.setupEvents();
  }

  updateFromBridgeState(bridgeState) {
    // if (Deck.modes.is('client') debugger;
    _.each(bridgeState, (val, key) => {
      if (this.state[key]) {
        var value =
          bridgeState[key] &&
          Object.prototype.toString.call(bridgeState[key]) === '[object Object]'
            ? _.deepExtend({}, bridgeState[key])
            : bridgeState[key];
        this.state[key].value = value;
        // Only save values individually if the parent key is not persistent
        if (!this.isPersistent && this.state[key].persistent && this.isMaster) {
          Bridge.Context.setPath(`${this.fullPath} .${key}`, value);
        }
        if (typeof this.state[key].onUpdate === 'function')
          this.state[key].onUpdate.call(this.context, value);
      }
    });
    if (this.isPersistent && this.isMaster) {
      const currentState = Bridge.Context.match(this.fullPath, {});
      const stateUpdates = _.mapObject(this.state, (val, key) => val.value);
      // Save entire parent object to the Context
      Bridge.Context.setPath(
        this.fullPath,
        _.deepExtend(currentState, stateUpdates)
      );
    }
    this.onUpdate.call(this.context, this.bridgeState);
  }

  getInitialState(initial) {
    // Entire object is persistent
    if (this.isPersistent && this.isMaster) {
      const currentContext = Bridge.Context.match(
        this.fullPath,
        _.mapObject(
          initial,
          function(val) {
            return val.value;
          },
          this
        )
      );
      return _.mapObject(
        initial,
        function(val, key) {
          val.value = _.isUndefined(currentContext[key])
            ? val.value
            : currentContext[key];
          return val;
        },
        this
      );
    } else {
      // Persistence is determined per item in the main object
      return _.mapObject(
        initial,
        function(val, key) {
          if (val.persistent && this.isMaster) {
            val.value = Bridge.Context.match(
              `${this.fullPath} .${key}`,
              val.value
            );
          }
          return val;
        },
        this
      );
    }
  }

  getValue(key) {
    return this.state[key] && this.state[key].value;
  }

  update(updatedState) {
    Bridge.Event.trigger(
      `master:${this.bridgeEventName}-updateState`,
      updatedState,
      false // isClient
    );
    if (this.isGlobal) {
      Bridge.Event.triggerDeckEvent(
        `master:${this.bridgeEventName}-updateState-listener`,
        updatedState,
        false // isClient
      );
    }
  }

  deleteKey(key) {
    if (!this.isPersistent) {
      console.warn(
        `BridgeState - Could not delete key: ${key}\nKeys can only be deleted if the parent is persistent`
      );
      return;
    }

    if (this.state[key]) {
      if (typeof this.state[key].onDelete === 'function')
        this.state[key].onDelete.call(this.context, this.state[key].value);

      delete this.state[key];

      if (this.isMaster) {
        // Save entire parent object to the Context
        Bridge.Context.setPath(
          this.fullPath,
          _.mapObject(this.state, (val, key) => val.value)
        );
      }
    }
  }

  deleteState() {
    if (_.isEmpty(this.path)) {
      console.warn(
        `BridgeState - Could not delete state for: ${this.key}\nState must have a path supplied in order to be deleted`
      );
      return;
    }

    if (!this.isPersistent) {
      console.warn(
        `BridgeState - Could not delete state for: ${this.path} ${this.key}\nState can only be deleted if persistent`
      );
      return;
    }

    const currentState = Bridge.Context.match(this.path, {});

    if (currentState[this.key]) {
      delete currentState[this.key];

      if (this.isMaster) {
        // Save entire parent object to the Context
        Bridge.Context.set(this.path, currentState);
      }
    }
  }

  initMasterEvents() {
    console.log("I'm a master!", this.key);
    Bridge.Event.on(
      `client:${this.bridgeEventName}-fetchState`,
      this.clientFetchState
    );

    _.each(this.bridgeState, (val, key) => {
      if (typeof this.state[key].onUpdate === 'function')
        this.state[key].onUpdate.call(this.context, val);
    });
    this.onUpdate.call(this.context, this.bridgeState, true);

    Bridge.Event.trigger(`master:${this.bridgeEventName}-masterDone`);
  }

  initClientEvents() {
    console.log("I'm a client!", this.key, this.bridgeEventName);
    Bridge.Event.on(
      `master:${this.bridgeEventName}-masterDone`,
      this.masterDone
    );
    Bridge.Event.trigger(`client:${this.bridgeEventName}-fetchState`);
  }

  setupEvents() {
    Bridge.Event.on(
      `master:${this.bridgeEventName}-updateState`,
      this.updateState
    );
    if (this.isListener) {
      Bridge.Event.on(
        `master:${this.bridgeEventName}-updateState-listener`,
        this.updateStateGlobal,
        'deck'
      );
    }
  }

  clearEvents() {
    console.log('CLEAR EVENTS ------> ', this.bridgeEventName);
    Bridge.Event.off(
      `master:${this.bridgeEventName}-masterDone`,
      this.masterDone
    );
    Bridge.Event.off(
      `client:${this.bridgeEventName}-fetchState`,
      this.clientFetchState
    );
    Bridge.Event.off(
      `master:${this.bridgeEventName}-updateState`,
      this.updateState
    );
    if (this.isListener) {
      Bridge.Event.off(
        `master:${this.bridgeEventName}-updateState-listener`,
        this.updateStateGlobal,
        'deck'
      );
    }
  }

  masterDone = () => {
    console.log('master:masterDone recieved: ', this.key);
    Bridge.Event.trigger(`client:${this.bridgeEventName}-fetchState`);
  };

  clientFetchState = () => {
    console.log('client:fetchState recieved: ', this.key);
    if (this.context instanceof Slide) {
      // Client has been registered
      this.context.pageContainer.classList.add('has-clients');
    }
    Bridge.Event.trigger(
      `master:${this.bridgeEventName}-updateState`,
      this.bridgeState,
      true
    );
  };

  updateState = (bridgeState, isClient) => {
    if (_.isEmpty(bridgeState) || (isClient && this.isMaster)) {
      return null;
    }
    console.log('master:updateState', this.key, bridgeState);
    this.updateFromBridgeState(bridgeState);
  };

  updateStateGlobal = (bridgeState, isClient) => {
    if (_.isEmpty(bridgeState) || (isClient && this.isMaster)) {
      return null;
    }
    console.log('master:updateState-listener', this.key, bridgeState);
    this.updateFromBridgeState(bridgeState);
  };

  initialize() {
    if (this.isMaster) {
      this.initMasterEvents();
    } else {
      this.initClientEvents();
    }
  }

  destroy() {
    this.clearEvents();
    this.deleteState();
  }

  get bridgeState() {
    return _.mapObject(this.state, function(val, key) {
      return val.value;
    });
  }
}
