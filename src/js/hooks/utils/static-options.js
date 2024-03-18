import _ from 'lodash';

export default class StaticOptions {
  static setOptions(options) {
    _.assign(StaticOptions._options, _.cloneDeep(options));
  }

  static getOptions() {
    return StaticOptions._options;
  }
}

StaticOptions._options = {};
