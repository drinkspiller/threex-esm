import * as THREE from 'three';

class DynamicTexture {
  /**
   * Create a dynamic texture with a underlying canvas.
   *
   * @param {number} width  Width of the canvas.
   * @param {number} height Height of the canvas.
   */
  constructor(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;

    const context = canvas.getContext('2d');
    this.context = context;

    const texture = new THREE.Texture(canvas);
    this.texture = texture;
  };

  /**
   * Clear the canvas.
   *
   * @param {string} fillStyle The fillStyle to clear with. If not provided,
   *    fallback on .clearRect.
   * @return {DynamicTexture} The object itself, for chained texture.
   */
  clear(fillStyle) {
    if (fillStyle !== undefined) {
      this.context.fillStyle = fillStyle;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.texture.needsUpdate = true;
    // To allow chaining.
    return this;
  };

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
  drawText(text, x, y, fillStyle, contextFont) {
    y = y || 0;
    if (contextFont !== undefined) this.context.font = contextFont;
    if (x === undefined || x === null) {
      const textSize = this.context.measureText(text);
      x = (this.canvas.width - textSize.width) / 2;
    }
    this.context.fillStyle = fillStyle;
    this.context.fillText(text, x, y);
    this.texture.needsUpdate = true;
    // To allow chaining.
    return this;
  };

  drawTextCooked(text, options) {
    options = options || {};
    const params = {
      margin: options.margin !== undefined ? options.margin : 0.1,
      lineHeight: options.lineHeight !== undefined ? options.lineHeight : 0.1,
      align: options.align !== undefined ? options.align : 'left',
      fillStyle: options.fillStyle !== undefined ? options.fillStyle : 'black',
    };
    this.context.save();
    this.context.fillStyle = params.fillStyle;

    let y = (params.lineHeight + params.margin) * this.canvas.height;
    while (text.length > 0) {
      // Compute the text for specifically this line.
      const maxText = this._computeMaxTextLength(text, params);
      // Update the remaining text.
      text = text.substr(maxText.length);

      // Compute x based on params.align.
      const textSize = this.context.measureText(maxText);
      let x;
      if (params.align === 'left') {
        x = params.margin * this.canvas.width;
      } else if (params.align === 'right') {
        x = (1 - params.margin) * this.canvas.width - textSize.width;
      } else if (params.align === 'center') {
        x = (this.canvas.width - textSize.width) / 2;
      } else {
        console.assert(false);
      }

      this.context.fillText(maxText, x, y);

      // Go to the next line.
      y += params.lineHeight * this.canvas.height;
    }
    this.context.restore();

    this.texture.needsUpdate = true;
    // To allow chaining.
    return this;
  };

  _computeMaxTextLength(text, params) {
    let maxText = '';
    const maxWidth = (1 - params.margin * 2) * this.canvas.width;
    while (maxText.length !== text.length) {
      const textSize = this.context.measureText(maxText);
      if (textSize.width > maxWidth) break;
      maxText += text.substr(maxText.length, 1);
    }
    return maxText;
  }

  /**
   * Execute the drawImage on the internal context. Arguments are the same as
   * those in context2d.drawImage API.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
   * @return {DynamicTexture} The object itself, for chained texture.
   */
  drawImage(/* same params as context2d.drawImage */) {
    // eslint-disable-next-line prefer-spread, prefer-rest-params
    this.context.drawImage.apply(this.context, arguments);
    this.texture.needsUpdate = true;
    // To allow chaining.
    return this;
  };
}

export {DynamicTexture as default};
