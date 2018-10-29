function SignedDistanceFont(myText, options) {
  // eslint-disable-next-line no-param-reassign
  options.scale = options.scale || 1;

  this.boundingBox = this.calculateBoundingBox(myText, options);

  // TODO: Lines (1/2 done)
  // TODO: Cursor
  const geometry = {
    vertices: [],
    indices: [],
    textureCoords: [],
  };
  this.fillGeometry(geometry, myText, options);

  // Expose variables
  this.options = options;
  this.geometry = geometry;
  this.mesh = geometry;
}

SignedDistanceFont.prototype.addLetter = function addLetter(
  geometry,
  xUv,
  yUv,
  width,
  height,
  cursorX,
  cursorY,
  faceOffset,
  xOffset,
  yOffset,
  kerningOffset,
  options,
) {
  const kerningOffsetValue = kerningOffset || 0;

  const w = width * options.scale;
  const h = height * options.scale;
  const xpos = cursorX + kerningOffsetValue + (xOffset * options.scale);
  const ypos = (cursorY - (h + (yOffset * options.scale)));
  geometry.vertices.push(
    xpos + w, ypos + h, 0.0,
    xpos, ypos + h, 0.0,
    xpos, ypos, 0.0,
    xpos + w, ypos, 0.0,
  );
  geometry.indices.push(
    faceOffset + 0, faceOffset + 1, faceOffset + 2,
    faceOffset + 0, faceOffset + 2, faceOffset + 3,
  );
  const uvX = this.mapLinear(xUv, 0, 512, 0, 1);
  const uvY = this.mapLinear(yUv, 0, 512, 0, 1);
  const maxUvX = this.mapLinear(xUv + width, 0, 512, 0, 1);
  const maxUvY = this.mapLinear(yUv + height, 0, 512, 0, 1);
  geometry.textureCoords.push(
    maxUvX, uvY,
    uvX, uvY,
    uvX, maxUvY,
    maxUvX, maxUvY,
  );
  return geometry;
};

SignedDistanceFont.prototype.mapLinear = function mapLinear(x, a1, a2, b1, b2) {
  return b1 + (((x - a1) * (b2 - b1)) / (a2 - a1));
};

SignedDistanceFont.prototype.measureText = function measureText(text, options) {
  let textWidth = 0;
  for (let i = 0, len = text.length; i < len; i += 1) {
    const char = options.fontInfo.chars[text.charCodeAt(i)];
    textWidth += Number(char.xadvance) * options.scale;
  }

  return textWidth;
};

SignedDistanceFont.prototype.fillGeometry = function fillGeometry(geometry, myText, options) {
  const lines = (typeof myText === 'string' || myText instanceof String) ? [myText] : myText;

  let charsDrawn = 0;
  let previouslyDrawnLetter = -2;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const lineBoundingBox = this.measureText(lines[lineIndex], options);
    let cursorX = (options.alignment !== undefined && options.alignment === 'center') ? -lineBoundingBox / 2 : 0;
    let cursorY = (options.alignment !== undefined && options.alignment === 'center') ? (lines.length * options.fontInfo.info.lineHeight * options.scale) / 4 : 0;
    cursorY -= (lineIndex - 1) * options.fontInfo.info.lineHeight * options.scale;
    for (let charIndex = 0; charIndex < lines[lineIndex].length; charIndex += 1) {
      const currentCharCode = lines[lineIndex].charCodeAt(charIndex);
      const char = options.fontInfo.chars[currentCharCode];

      let kerningOffset = 0;
      if (
        previouslyDrawnLetter !== -2
        && options.fontInfo.chars[previouslyDrawnLetter].kernings !== undefined
        && options.fontInfo.chars[previouslyDrawnLetter].kernings[currentCharCode]
      ) {
        kerningOffset = Number(options
          .fontInfo
          .chars[previouslyDrawnLetter]
          .kernings[currentCharCode]) * options.scale;
      }

      // eslint-disable-next-line no-param-reassign
      geometry = this.addLetter(
        geometry,
        Number(char.x),
        Number(char.y),
        Number(char.width),
        Number(char.height),
        cursorX,
        cursorY,
        charsDrawn * 4,
        Number(char.xoffset),
        Number(char.yoffset),
        kerningOffset,
        options,
      );
      cursorX += (Number(char.xadvance) * options.scale) + kerningOffset;
      charsDrawn += 1;
      previouslyDrawnLetter = lines[lineIndex].charCodeAt(charIndex);
    }
  }
};

SignedDistanceFont.prototype.calculateBoundingBox = function calculateBoundingBox(myText, options) {
  let longestLength = 0;
  const lines = (typeof myText === 'string' || myText instanceof String) ? [myText] : myText;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const measuredLength = this.measureText(lines[lineIndex], options);
    if (measuredLength > longestLength) {
      longestLength = measuredLength;
    }
  }
  return {
    x: longestLength,
    y: options.fontInfo.info.lineHeight * lines.length * options.scale,
  };
};

export default SignedDistanceFont;
