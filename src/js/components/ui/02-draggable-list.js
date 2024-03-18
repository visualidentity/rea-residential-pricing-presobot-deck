/**
 * Vertically draggable list
 * (Horizontal drag to be added in the future)
 *
 * Assumes that items are already absolute-positioned.
 *
 * Items can be given UIDs by assigning data-uid values
 * in markup, otherwise default 'item-1', 'item-2' etc.
 * will be assigned.
 */
class DraggableList extends Component {
  set disabled(disabled) {
    this.dragListener.disabled = disabled;
    _.each(this.draggables, draggable => {
      draggable.disabled = disabled;
    });
    super.disabled = disabled;
  }

  /**
   *
   * @param {String} key
   * @param {String} selector
   * @param {DOMElement} parentElem
   * @param {*} options
   */
  constructor(key, slide, parentElem, options = {}) {
    super();
    this.key = key;
    this.slide = slide;
    this.parentElem = parentElem;
    this.options = _.defaults(options, {
      selector: '.js-draggable-item',
      contextPath: '.scrollable_lists',
      initialValue: null,
      disabled: false,
      onChange: () => {},
      orientation: 'vertical'
    });

    this.draggables = [];
    this.draggableElements = [];

    this.dragListener = new DragListener(this.slide.$pageContainer, {
      constraint: 'vertical',
      hideOriginal: true,
      disabled: this.options.disabled,
      onElementDragging: this.onItemDrag,
      onElementDropped: this.onItemDrop,
      onClearDraggingElement: this.onClearDrag
    });

    this.disabled = Boolean(options.disabled);
  }

  initialize() {
    if (this.initialized) return;

    this.draggables = this.generateDraggables();
    this.positionsInSlide = this.getDraggablePositionsRelSlide(this.draggables);
    this.positionsInList = this.getDraggablePositionsRelList(
      this.draggables,
      this.options.orientation
    );

    // Initialize draggables
    _.each(this.draggables, draggable => {
      draggable.initialize();
    });

    // Online status listener
    if (Deck.modes.isEditor) {
      $('#slideshow').on('connectionChanged', this.onConnectionStatusUpdate);
    }

    super.initialize();
  }

  refresh(parentElem) {
    this.parentElem = parentElem;
    this.draggables = this.generateDraggables();
    this.positionsInSlide = this.getDraggablePositionsRelSlide(this.draggables);
    this.positionsInList = this.getDraggablePositionsRelList(
      this.draggables,
      this.options.orientation
    );

    // Initialize draggables
    _.each(this.draggables, draggable => {
      draggable.initialize();
    });
  }

  onItemDrag = (e, draggable, dragPosition) => {
    var closest = this.calcIndex(dragPosition);
    this.moveDraggableToIndex(draggable, closest);
  };

  onClearDrag = () => {
    $('.c-draggable-container')
      .css({ top: 0, left: 0 })
      .html('');
  };

  onItemDrop = (draggable, mousePosition, objectPosition) => {
    // Cannot save when offline
    if (!Bridge.Status.isOnline) {
      this.resetToCurrentOrder();
      this.triggerOfflineNotification();
      return;
    }

    var closest = this.calcIndex(objectPosition);
    // in new other
    if (closest == -1) closest = this.positionsInSlide.length;
    // this.moveDraggableToIndex(draggable, closest);

    var newOrder = _.map(this.draggables, draggable => {
      return draggable.el.dataset.uid;
    });
    this.updateOrder(newOrder);
  };

  onConnectionStatusUpdate = (e, isOnline) => {
    this.disabled = !isOnline;
  };

  updateOrder(order) {
    var newElements = Array(this.draggables.length);
    _.each(this.draggables, draggable => {
      var uid = draggable.el.dataset.uid;
      var newPos = order.indexOf(uid);
      newElements[newPos] = draggable;
    });

    this.draggables = newElements;
    // this.renderDraggablesInPosition();

    this.options.onChange(this.key, order);
  }

  getValue() {
    return this.state.getValue('currentOrder');
  }

  getDraggableElIndex(draggableEl) {
    return _.findIndex(this.draggables, draggable => {
      return draggable.el.dataset.uid == draggableEl.dataset.uid;
    });
  }

  /**
   * Get draggable item positions relevant to the containing slide
   * @param {Draggable[]} draggables
   */
  getDraggablePositionsRelSlide(draggables) {
    return _.map(draggables, draggable => {
      return {
        top:
          $(draggable.el).offset().top - this.slide.$pageContainer.offset().top,
        left:
          $(draggable.el).offset().left -
          this.slide.$pageContainer.offset().left
      };
    });
  }

  /**
   * Get draggable item positions relevant to the containing list
   * @param {Draggable[]} draggables
   * @param {String} orientation - 'vertical' or 'horizontal'
   */
  getDraggablePositionsRelList(draggables, orientation) {
    return _.map(draggables, draggable => {
      const computedStyle = window.getComputedStyle(draggable.el);
      return orientation == 'vertical' ? computedStyle.top : computedStyle.left;
    });
  }

  resetToCurrentOrder() {
    const currentOrder = this.state.getValue('currentOrder');
    this.updateOrder(currentOrder);
  }

  triggerOfflineNotification() {
    // TODO: Trigger toast notification
    alert('Ordering changes cannot be changed while offline.');
  }

  /**
   * Generates list of Draggables using supplied list
   * of DOM elements
   *
   * @param {DOMElement[]} draggableEls - Array of DOM elements
   */
  generateDraggables(draggableEls) {
    return _.map(
      this.parentElem.querySelectorAll(this.options.selector),
      (node, index) => {
        // Add default UID if not supplied in markup
        if (!node.dataset.uid) {
          node.dataset.uid = `item-${index + 1}`;
        }
        return new Draggable(node, this.dragListener, {
          dragTarget: node.querySelector(this.options.targetSelector),
          disabled: this.disabled
        });
      }
    );
  }

  /**
   * Move specified draggable into a new location in the list
   * based on the supplied index. Surrounding draggles are
   * reordered accordingly.
   *
   * @param {DraggableListItem} currDraggable - Draggable to move
   * @param {Number} newIndex - Index of new location in list
   */
  moveDraggableToIndex(currDraggable, newIndex) {
    var draggedNode = currDraggable.el;
    var oldIndex = this.getDraggableElIndex(draggedNode);
    if (newIndex != oldIndex) {
      this.draggables.splice(oldIndex, 1);
      this.draggables.splice(newIndex, 0, currDraggable);
    }
    this.renderDraggablesInPosition();
  }

  renderDraggablesInPosition() {
    _.each(
      this.draggables,
      (draggable, index) => {
        draggable.el.style.top = this.positionsInList[index];
      },
      this
    );
  }

  calcIndex(dragPosition) {
    var closest = _.findIndex(
      this.positionsInSlide,
      (position, index) => {
        var adjustedTop = this.dragListener.measurementFunction(position);
        var prevAdjustedTop =
          index > 0
            ? this.dragListener.measurementFunction(
                this.positionsInSlide[index - 1]
              )
            : this.dragListener.measurementFunction(
                this.positionsInSlide[index + 1]
              );

        var halfwayPoint =
          index > 0
            ? adjustedTop.top + (adjustedTop.top - prevAdjustedTop.top) / 2
            : adjustedTop.top + (prevAdjustedTop.top - adjustedTop.top) / 2;
        return dragPosition.top < halfwayPoint;
      },
      this
    );
    // in new other
    if (closest == -1) closest = this.positionsInSlide.length;
    return closest;
  }

  destroy() {
    this.dragListener.destroy();
    _.each(this.draggables, draggable => {
      draggable.destroy();
    });
    $(`article#${this.key}`)
      .find('.c-draggable-container')
      .remove();
    if (Deck.modes.isEditor) {
      $('#slideshow').off('connectionChanged', this.onConnectionStatusUpdate);
    }

    super.destroy();
  }
}
