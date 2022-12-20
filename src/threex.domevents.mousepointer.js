import * as THREE from 'three';

/**
 * Utility class to init the variables per ray - contains state variable to
 * handle click, mouseenter, mouseleave.
 */
class PointerContext {
  lastMouseDownObject = null;
  lastMouseMoveObject = null;
};

class MousePointer {
  camera;
  domEvents;
  element;
  mouse = new THREE.Vector2();
  pointerContext = new PointerContext();
  raycaster = new THREE.Raycaster();

  constructor(camera, element, domEvents) {
    this.camera = camera;
    this.element = element;
    this.domEvents = domEvents;
    this.element.addEventListener(
        'mousemove', (event) => this.onMouseMove(event), false);
    this.element.addEventListener(
        'mousemove', (event) => this.processDomEvent(event), false);
    this.element.addEventListener(
        'mousedown', (event) => this.processDomEvent(event), false);
    this.element.addEventListener(
        'mouseup', (event) => this.processDomEvent(event), false);
  };

  dispose() {
    this.element.removeEventListener(
        'mousemove', (event) => this.onMouseMove(event), false);
    this.element.removeEventListener(
        'mousemove', (event) => this.processDomEvent(event), false);
    this.element.removeEventListener(
        'mousedown', (event) => this.processDomEvent(event), false);
    this.element.removeEventListener(
        'mouseup', (event) => this.processDomEvent(event), false);
  };

  processDomEvent(domEvent) {
    const stereoEnabled = false;
    if (stereoEnabled) {
      const _stereo = new THREE.StereoCamera();
      _stereo.aspect = 0.5;
      _stereo.update(camera);
      this.raycaster.setFromCamera(this.mouse, _stereo.cameraL);
    } else {
      this.raycaster.setFromCamera(this.mouse, this.camera);
    }


    const intersects = this.raycaster.intersectObjects(this.domEvents._objects);

    this.domEvents.processIntersects(
        this.pointerContext, intersects, domEvent.type);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / this.element.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.element.clientHeight) * 2 + 1;
  }
}

export {MousePointer as default};
