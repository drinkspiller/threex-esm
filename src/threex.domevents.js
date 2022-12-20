import * as THREE from 'three';

class DomEvents {

  constructor() {
    this._objects = [];
  }

  addEventListener(object, eventType, callback, useCapture) {
    object.userData.listeners = object.userData.listeners || {
      'mousedown': [],
      'mouseup': [],
      'mousemove': [],

      'click': [],
      'mouseenter': [],
      'mouseleave': [],
    };

    console.assert(object.userData.listeners[eventType] !== undefined);

    const listener = {
      callback: callback,
      useCapture: useCapture,
    };
    object.userData.listeners[eventType].push(listener);

    // If the supplied object isn't in this._objects, add it.
    if (this._objects.indexOf(object) === -1) this._objects.push(object);
  };

  remoteAllEventListeners(object) {
    delete object.userData.listeners;

    const index = this._objects.indexOf(object);
    if (index !== -1) this._objects.splice(index, 1);
  };

  removeEventListener(object, eventType, callback, useCapture) {
    console.assert(false, 'NOT YET IMPLEMENTED');
  };

  /**
   * Handles mousemove to notify mouseenter/mouseleave according to
   * pointerContext - it doesnt notify leave, then enter in the same js loop.
   */
  _processMouseMove(pointerContext, intersects, eventType) {
    console.assert(eventType === 'mousemove');

    const intersectObject = intersects.length ? intersects[0].object : null;

    const leaveObjects = [];
    const enterObjects = [];

    // Send mouseleave to .lastMouseMoveObject if .lastMouseMoveObject isn't the
    // current intersect object
    if (intersectObject !== pointerContext.lastMouseMoveObject &&
        pointerContext.lastMouseMoveObject !== null) {
      for (let object = pointerContext.lastMouseMoveObject; object !== null;
        object = object.parent) {
        leaveObjects.push(object);
      }
    }

    // Sends mouseenter to intersectObject if intersectObject isn't equal to
    // .lastMouseMoveObjects.
    if (intersectObject !== pointerContext.lastMouseMoveObject &&
        intersectObject !== null) {
      for (let object = intersectObject; object !== null;
        object = object.parent) {
        // If this object is in leaveObjects, 'leave' and 'enter' cancel each
        // other, so remove it from 'leaveObjects' and don't include in
        // 'enterObjects'.
        const index = leaveObjects.indexOf(object);
        if (index !== -1) {
          leaveObjects.splice(index, 1);
          continue;
        }

        enterObjects.push(object);
      }
    }

    // Notify mouseleave to all the object of leaveObjects.
    leaveObjects.forEach((object) => {
      this.notifyAllListeners(object, {
        type: 'mouseleave',
        object: pointerContext.lastMouseMoveObject,
        intersect: intersects[0],
      });
    });

    // Notify mouseenter to all object of enterObjects.
    enterObjects.forEach((object) => {
      this.notifyAllListeners(object, {
        type: 'mouseenter',
        object: intersectObject,
        intersect: intersects[0],
      });
    });

    // Update pointerContext.lastMouseMoveObject.
    pointerContext.lastMouseMoveObject =
        intersects.length === 0 ? null : intersects[0].object;
    // console.log('lastMouseMoveObject', pointerContext.lastMouseMoveObject ===
    // null ? null : pointerContext.lastMouseMoveObject.name )
    return;
  };

  notifyAllListeners(object, event) {
    object.userData.listeners &&
        object.userData.listeners[event.type].slice(0).forEach((
            listener) => {
          listener.callback(event);
          // TODO: Handle stopPropagation.
        });
  }

  notifyToIntersects(intersects, eventType) {
    intersects.forEach((intersect) => {
      this.notifyToObject(intersect.object, {
        type: eventType,
        object: intersect.object,
        intersect: intersect,
      });
    });
  }
  notifyToObject(object, event) {
    // notify all listeners of this event.type
    object.userData.listeners &&
        object.userData.listeners[event.type].slice(0).forEach((
            listener) => {
          listener.callback(event);
          // TODO here handle the stopPropagation
        });

    // bubble the event to the parent
    if (object.parent) {
      this.notifyToObject(object.parent, event);
    }
  }

  processIntersects(pointerContext, intersects, eventType) {
    console.assert(
        ['mousedown', 'mouseup', 'mousemove', 'click'].indexOf(eventType) !==
        -1);

    this.notifyToIntersects(intersects, eventType);

    // Simulate 'click' event.
    if (eventType === 'mouseup' && intersects.length >= 1) {
      // 'Click' happens if mousedown is happening on the same object as the
      // mouseup - this is the definition of a click by web standard.
      if (pointerContext.lastMouseDownObject === intersects[0].object) {
        this.processIntersects(pointerContext, intersects, 'click');
      }
    }

    if (eventType === 'mousedown') {
      pointerContext.lastMouseDownObject =
          intersects.length === 0 ? null : intersects[0].object;
    }

    // Handle mouseleave/mouseenter though mousemove.
    if (eventType === 'mousemove') {
      this._processMouseMove(pointerContext, intersects, eventType);
    }

    return;
  };
}

export {DomEvents as default};
