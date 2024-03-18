/**
 *  Contains a list of classes appended to the <body>
 */
class SlideModes {
  get isEditor() {
    // TODO: Confirm definition of "edit mode"
    return (
      this.is('master') &&
      (this.is('preview') || this.is('present')) &&
      !this.is('preso-readonly')
    );
  }

  get canEdit() {
    return (
      this.is('edit-mode', 'review', 'master', 'livepreso') ||
      this.is('review', 'master', 'livepreso', 'empty-preview')
    );
  }

  /**
   * @constructor
   */
  constructor() {
    let body = document.querySelector('body');
    this.classList = _.map(body.classList, val => val);
  }

  /**
   * Check supplied class name against class list
   * @param  {String}  className Name of class to check
   * @return {Boolean}           Return value
   */
  is(...classNames) {
    return _.every(classNames, className =>
      _.contains(this.classList, className)
    );
  }
}
