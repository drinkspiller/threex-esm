export {DynamicTexture as default};
declare class DynamicTexture {
  /**
   * Create a dynamic texture with a underlying canvas.
   *
   * @param {number} width  Width of the canvas.
   * @param {number} height Height of the canvas.
   */
  constructor(width: number, height: number);
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  texture: THREE.Texture;
  /**
   * Clear the canvas.
   *
   * @param {string} fillStyle The fillStyle to clear with. If not provided,
   *    fallback on .clearRect.
   * @return {DynamicTexture} The object itself, for chained texture.
   */
  clear(fillStyle: string): DynamicTexture;
  /**
   * Draw text.
   *
   * @param {string} text The text to display.
   * @param {number=} x Optional x position where to draw. If not provided, the
   *     text is centered.
   * @param {number=} y Optional y position to draw the text. Value is 0 if not
   *     provided.
   * @param {string=} fillStyle The fillStyle to clear with, if not
   *     provided, fallback on .clearRect.
   * @param {string=} [contextFont] The font to use.
   * @return {DynamicTexture} The object itself, for chained texture.
   */
  drawText(
      text: string, x?: number|undefined, y?: number|undefined,
      fillStyle?: string|undefined,
      contextFont?: string|undefined): DynamicTexture;
  drawTextCooked(text: any, options: any): DynamicTexture;
  _computeMaxTextLength(text: any): string;
  /**
   * Execute the drawImage on the internal context. Arguments are the same as
   * those in context2d.drawImage API.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
   * @return {DynamicTexture} The object itself, for chained texture.
   */
  drawImage(...args: any[]): DynamicTexture;
}
import * as THREE from 'three';
// # sourceMappingURL=threex.dynamictexture.d.ts.map
