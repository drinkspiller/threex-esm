export { DomEvents as default };
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
//# sourceMappingURL=threex.domevents.d.ts.map
