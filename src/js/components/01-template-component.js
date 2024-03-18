/**
 * Simple component to generate HTML based on a given template and data.
 *
 * @extends Component
 */
class TemplateComponent extends Component {
  constructor(template, data = {}) {
    super();
    if (typeof template !== 'function') {
      throw new Error(
        `${this.constructor.name}.template must be a template function.`
      );
    }
    this.template = template;
    this.data = data;
  }

  /**
   * Generates and returns a string of HTML based on current template and data
   * @return {String} - output HTML string
   */
  get html() {
    return this.template(this.data);
  }

  /**
   * assigns new data and renders html
   * @param  {Object} data - new data to pass to template
   */
  updateData(data) {
    this.data = data;
    this.render();
  }

  /**
   * Render HTML in current el
   */
  render() {
    super.render();
    this.el.innerHTML = this.html;
  }

  /**
   * Remove HTML in el
   */
  clear() {
    this.el.innerHTML = '';
  }
}
