/**
 * Draggable Class
 */
class Draggable extends Component {
  set disabled(disabled) {
    this.el.classList.toggle('is-draggable', !disabled);
    this.dragTarget.classList.toggle('is-disabled', disabled);
    this.dragTarget.classList.toggle('interactive', disabled);
    super.disabled = disabled;
  }

  set hover(status) {
    this._hover = status;
    this.el.classList.toggle('is-hovered', status);
  }

  get hover() {
    return this._hover;
  }

  /**
   *
   * @constructor
   * @param {DOMElement} el
   * @param {DragListener} dragListener
   * @param {Boolean} [hover=false]
   * @param {Boolean} [disabled=false]
   * @param {DOMElement} [dragTarget] - Defaults to this.el if not supplied
   * @param {Function} [onMouseHover]
   * @param {Function} [onMouseLeave]
   */
  constructor(
    el,
    dragListener,
    { hover, disabled, dragTarget, onMouseHover, onMouseLeave } = {}
  ) {
    if (!(dragListener instanceof DragListener)) {
      throw new Error('Invalid DragListener instance passed to Draggable');
    }

    super();
    this.el = el;
    this.el.classList.add('c-draggable-item');
    this.dragTarget = dragTarget || this.el;
    this.dragTarget.classList.add('c-draggable-item__target');
    this.dragListener = dragListener;

    this.events = {
      onMouseHover: onMouseHover || function() {},
      onMouseLeave: onMouseLeave || function() {}
    };

    this.disabled = Boolean(disabled);
    this.hover = Boolean(hover);
  }

  initialize() {
    if (this.initialized) return;
    super.initialize();

    this.dragTarget.addEventListener('mousedown', this.startDragFunc);
    this.dragTarget.addEventListener('touchstart', this.startDragFunc);
    this.dragTarget.addEventListener('mouseenter', this.onMouseHover);
    this.dragTarget.addEventListener('mouseleave', this.onMouseLeave);
  }

  onMouseHover = () => {
    this.events.onMouseHover(this);
  };

  onMouseLeave = () => {
    this.events.onMouseLeave(this);
  };

  startDragFunc = e => {
    if (this.disabled) return;
    this.dragListener.startDrag(e, this);
  };

  destroy() {
    this.dragTarget.removeEventListener('mousedown', this.startDragFunc);
    this.dragTarget.removeEventListener('touchstart', this.startDragFunc);
    this.dragTarget.removeEventListener('mouseenter', this.mouseHovered);
    this.dragTarget.removeEventListener('mouseleave', this.onMouseLeave);
    super.destroy();
  }
}
