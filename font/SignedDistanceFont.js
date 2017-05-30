function SignedDistanceFont(myText, options) {

  options.scale = options.scale || 1;

  this.boundingBox = this.calculateBoundingBox(myText, options);

  //TODO: Lines (1/2 done)
  //TODO: Cursor
  var geometry = {
    vertices: [],
    indices: [],
    textureCoords: []
  };
  this.fillGeometry(geometry, myText, options);

	// Expose variables
  this.options = options;
  this.geometry = geometry;
  this.mesh = geometry;
};

Object.assign(SignedDistanceFont.prototype, {
  addLetter: function(geometry, xUv, yUv, width, height, cursorX, cursorY, faceOffset, xOffset, yOffset, kerningOffset, options) {

    kerningOffset = kerningOffset || 0;

    var w = width * options.scale;
    var h = height * options.scale;
    var xpos = cursorX + kerningOffset + xOffset * options.scale;
    var ypos = (cursorY - (h + yOffset * options.scale));
    geometry.vertices.push(
      xpos + w, ypos + h, 0.0,
      xpos, ypos + h, 0.0,
      xpos, ypos, 0.0,
      xpos + w, ypos, 0.0,
    );
    geometry.indices.push(
      faceOffset + 0, faceOffset + 1, faceOffset + 2,
      faceOffset + 0, faceOffset + 2, faceOffset + 3
    );
    var uvX = this.mapLinear(xUv, 0, 512, 0, 1);
    var uvY = this.mapLinear(yUv, 0, 512, 0, 1);
    var maxUvX = this.mapLinear(xUv + width, 0, 512, 0, 1);
    var maxUvY = this.mapLinear(yUv + height, 0, 512, 0, 1);
    geometry.textureCoords.push(
      maxUvX, uvY,
      uvX, uvY,
      uvX, maxUvY,
      maxUvX, maxUvY,
    );
    return geometry;
  },

  mapLinear: function (x, a1, a2, b1, b2)  {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  },

  measureText: function(text, options) {
    var textWidth = 0;
    for (var i = 0, len = text.length; i < len; i++) {
      var char = options.fontInfo.chars[text.charCodeAt(i)];
      textWidth += Number(char['xadvance']) * options.scale;
    }

    return textWidth;
  },

  fillGeometry: function(geometry, myText, options) {
    var lines = (typeof myText === 'string' || myText instanceof String) ? [myText] : myText;

    var charsDrawn = 0;
    var previouslyDrawnLetter = -2;
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
	  var lineBoundingBox = this.measureText(lines[lineIndex], options);
      var cursorX = (options.alignment != undefined && options.alignment === "center") ? -lineBoundingBox / 2 : 0;
      var cursorY = (options.alignment != undefined && options.alignment === "center") ? (lines.length * options.fontInfo.info.lineHeight * options.scale) / 4 : 0;
      cursorY = cursorY - (lineIndex - 1) * options.fontInfo.info.lineHeight * options.scale;
      for (var charIndex = 0; charIndex < lines[lineIndex].length; charIndex++) {
        var currentCharCode = lines[lineIndex].charCodeAt(charIndex);
        var char = options.fontInfo.chars[currentCharCode];

        var kerningOffset = 0;
        if(previouslyDrawnLetter != -2 && options.fontInfo.chars[previouslyDrawnLetter].kernings != undefined && options.fontInfo.chars[previouslyDrawnLetter].kernings[currentCharCode]) {
          var kerningOffset = Number(options.fontInfo.chars[previouslyDrawnLetter].kernings[currentCharCode]) * options.scale;
          console.log("Found kerningOffset for", String.fromCharCode(previouslyDrawnLetter), String.fromCharCode(currentCharCode), kerningOffset);
        }

        geometry = this.addLetter(geometry, Number(char['x']), Number(char['y']), Number(char['width']), Number(char['height']), cursorX, cursorY, charsDrawn * 4, Number(char['xoffset']), Number(char['yoffset']), kerningOffset, options);
        cursorX += Number(char['xadvance']) * options.scale + kerningOffset;
        charsDrawn++;
        previouslyDrawnLetter = lines[lineIndex].charCodeAt(charIndex);
      }
    }
  },

  calculateBoundingBox: function(myText, options) {
    var longestLength = 0;
    var lines = (typeof myText === 'string' || myText instanceof String) ? [myText] : myText;
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      var measuredLength = this.measureText(lines[lineIndex], options);
      if(measuredLength > longestLength) {
        longestLength = measuredLength;
      }
    }
    return {
      x: longestLength,
      y: options.fontInfo.info.lineHeight * lines.length * options.scale
    }
  }
});
