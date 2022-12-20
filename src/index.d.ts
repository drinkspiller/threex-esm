export { DomEvents};
declare class DomEvents {
    _objects: any[];
    addEventListener(object: any, eventType: any, callback: any, useCapture: any): void;
    remoteAllEventListeners(object: any): void;
    removeEventListener(object: any, eventType: any, callback: any, useCapture: any): void;
    /**
     * Handles mousemove to notify mouseenter/mouseleave according to
     * pointerContext - it doesnt notify leave, then enter in the same js loop.
     */
    _processMouseMove(pointerContext: any, intersects: any, eventType: any): void;
    notifyAllListeners(object: any, event: any): void;
    notifyToIntersects(intersects: any, eventType: any): void;
    notifyToObject(object: any, event: any): void;
    processIntersects(pointerContext: any, intersects: any, eventType: any): void;
}


export { MousePointer};
declare class MousePointer {
    constructor(camera: any, element: any, domEvents: any);
    camera: any;
    domEvents: any;
    element: any;
    mouse: THREE.Vector2;
    pointerContext: PointerContext;
    raycaster: THREE.Raycaster;
    dispose(): void;
    processDomEvent(domEvent: any): void;
    onMouseMove(event: any): void;
}
import * as THREE from 'three';
/**
 * Utility class to init the variables per ray - contains state variable to
 * handle click, mouseenter, mouseleave.
 */
declare class PointerContext {
    lastMouseDownObject: any;
    lastMouseMoveObject: any;
}
