export { MousePointer as default };
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
//# sourceMappingURL=threex.domevents.mousepointer.d.ts.map
