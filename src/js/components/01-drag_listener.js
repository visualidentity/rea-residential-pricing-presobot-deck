/**
 * Drag Listener Class
 *
 * @constructor
 * @param {*} parent - The parent instance
 */
class DragListener extends Component {
  /**
   *
   * @param {*} $pageContainer
   * @param {Object} [options]
   * @param {String} [options.constraint] - 'vertical' or 'horizontal'
   * @param {Boolean} [options.hideOriginal=false] - Hide original list item when dragging
   * @param {Function} [options.onElementStartDrag]
   * @param {Function} [options.onElementDragging]
   * @param {Function} [options.onElementDropped]
   * @param {Function} [options.onClearDraggingElement]
   */
  constructor($pageContainer, options = {}) {
    super();
    this.$pageContainer = $pageContainer;

    this.options = _.defaults(options, {
      constraint: 'vertical',
      hideOriginal: false,
      onElementStartDrag: (e, dragObj) => {},
      onElementDragging: (e, dragObj, dragPosition) => {},
      onElementDropped: (dragObj, mousePosition, objectPosition) => {},
      onClearDraggingElement: dragObj => {}
    });

    this.disabled = Boolean(options.disabled);

    this.dragging = false;
    this.dragObj;

    this.dragX;
    this.dragY;

    this.startX;
    this.startY;

    this.minDragDistance = 20;

    this.measurementFunction = Deck.generateMeasurementFunction();

    this.el.classList.add('c-draggable-container', 'interactive');
    this.$pageContainer.append(this.el);

    this.dragFunc;
    this.stopDragFunc;
  }

  startDrag(e, draggable) {
    if (this.disabled) return;

    this.dragging = true;
    this.dragObj = draggable;
    var $dragEl = $(draggable.el);

    var dragElemOffset = $dragEl.offset() || { top: 0, left: 0 };
    var pageContainerOffset = this.$pageContainer.offset() || {
      top: 0,
      left: 0
    };

    var dragPosition = {
      top: dragElemOffset.top - pageContainerOffset.top,
      left: dragElemOffset.left - pageContainerOffset.left
    };

    // Set initial drag position for reference
    this.dragStartX = dragPosition.left;
    this.dragStartY = dragPosition.top;

    // Set starting drag values for session
    this.dragX = dragPosition.left;
    this.dragY = dragPosition.top;

    // Set initial mouse position for drag reference
    var mousePosition = this.getMousePosition(e);
    this.mouseStartX = mousePosition.left;
    this.mouseStartY = mousePosition.top;

    if (!this.dragObj.disabled) {
      // Copy drag elem into the drag container, scale and position
      var $draggingElement = $dragEl
        .clone()
        .addClass('c-draggable-container__item');
      this.el.append($draggingElement[0]);
      this.updateDragDOM(
        this.measurementFunction({ top: this.dragY, left: this.dragX })
      );
      if (this.options.hideOriginal) {
        this.dragObj.el.style.visibility = 'hidden';
      }
    }

    // Add listeners
    this.dragFunc = this.drag.bind(this);
    this.stopDragFunc = this.stopDrag.bind(this);

    this.$pageContainer.on('mousemove touchmove', this.dragFunc);
    this.$pageContainer.on('mouseup touchend', this.stopDragFunc);
  }

  drag(e) {
    if (this.dragging && this.dragObj) {
      // Get mouse position
      var mousePosition = this.getMousePosition(e);

      var mouseX = mousePosition.left;
      var mouseY = mousePosition.top;

      var mouseDiffX = mouseX - this.mouseStartX;
      var mouseDiffY = mouseY - this.mouseStartY;

      // Move the drag container
      this.dragX =
        this.options.constraint == 'vertical'
          ? this.dragStartX
          : this.dragStartX + mouseDiffX;
      this.dragY =
        this.options.constraint == 'horizontal'
          ? this.dragStartY
          : this.dragStartY + mouseDiffY;

      var newPosition = this.measurementFunction({
        top: this.dragY,
        left: this.dragX
      });

      // Test if click or drag
      if (!this.isDrag) {
        this.isDrag = this.wasDrag();
      } else if (this.dragObj && this.dragObj.disabled) {
        // Notify user that the selected element cannot be dragged
        this.dragObj.el.classList.add('cannot-drag');
      }

      if (!this.dragObj.disabled) {
        // Redraw drag element
        window.requestAnimationFrame(
          function(timestamp) {
            this.updateDragDOM(newPosition);
          }.bind(this)
        );
      }

      // Callback with current mouse position
      this.dragCallback(e, newPosition);
    }
  }

  stopDrag(e) {
    if (e) e.preventDefault();

    // Remove event listeners
    this.$pageContainer.off('mousemove touchmove', this.dragFunc);
    this.$pageContainer.off('mouseup touchend', this.stopDragFunc);

    // Clear drag container
    this.el.innerHTML = '';

    if (this.isDrag) {
      // Callback with current mouse position
      var mousePosition = this.measurementFunction(this.getMousePosition(e));
      var newPosition = this.measurementFunction({
        top: this.dragY,
        left: this.dragX
      });

      this.options.onElementDropped(this.dragObj, mousePosition, newPosition);
    } else {
      // Tell drag element that it was clicked
      if (this.dragObj && this.dragObj.clicked) {
        this.dragObj.clicked();
      }

      this.options.onClearDraggingElement(this.dragObj);
    }
    if (this.options.hideOriginal) {
      if (this.dragObj) this.dragObj.el.style.visibility = 'visible';
    }

    // Clear drag status
    this.clearDrag();
  }

  clearDrag() {
    if (this.dragObj) this.dragObj.el.classList.remove('cannot-drag');

    // Reset variables
    this.dragging = false;
    this.dragObj = null;
    this.dragX = null;
    this.dragY = null;

    this.dragFunc = null;
    this.stopDragFunc = null;

    this.isDrag = false;
  }

  wasDrag() {
    return (
      Math.abs(this.dragStartX - this.dragX) > this.minDragDistance ||
      Math.abs(this.dragStartY - this.dragY) > this.minDragDistance
    );
  }

  /**
   * Notifies parent of dragging event
   *
   * @param {Object} position
   * @param {number} position.top
   * @param {number} position.left
   */
  dragCallback = _.throttle(function(e, dragPosition) {
    if (this.dragging && !this.dragObj.disabled) {
      // Send drag information back to the parent
      this.options.onElementDragging(e, this.dragObj, dragPosition);
    }
  }, 100);

  /**
   * Update dragging instance
   *
   * @param {Object} position
   * @param {number} position.top
   * @param {number} position.left
   */
  updateDragDOM(position) {
    this.el.style.top = `${position.top || 0}px`;
    this.el.style.left = `${position.left || 0}px`;
  }

  /**
   * Get current mouse position (click or touch)
   * Relative to the $pageContainer
   *
   * @param {Event} e - click/touch event
   * @returns {Object} top and left position
   */
  getMousePosition(e) {
    var clickEvent = e.originalEvent || e;

    // Unwrap touch event if required
    if (
      !clickEvent.pageX &&
      !clickEvent.pageY &&
      clickEvent.touches &&
      clickEvent.touches.length
    ) {
      clickEvent = clickEvent.touches[0];
    }

    var mouseX = clickEvent.pageX;
    var mouseY = clickEvent.pageY;

    // Offset mouse position by $pageContainer
    var pageContainerOffset = this.$pageContainer.offset() || {
      top: 0,
      left: 0
    };

    return {
      top: mouseY - pageContainerOffset.top,
      left: mouseX - pageContainerOffset.left
    };
  }

  destroy() {
    this.stopDrag();
    super.destroy();
  }
}
