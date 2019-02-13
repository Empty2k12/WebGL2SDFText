const mat4 = require('gl-mat4');

/**
 * Converts Degrees to Radians
 * @param {int} degrees - Degrees.
 */
function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function animate(now, lastTime, xRot, yRot) {
  const xSpeed = 3;
  const ySpeed = -3;

  const rotation = !document.getElementById('rotation').checked;

  let newXRot = xRot;
  let newYRot = yRot;
  if (lastTime !== 0) {
    const elapsedTime = now - lastTime;
    newXRot += rotation ? 0 : (xSpeed * elapsedTime) / 1000.0;
    newYRot += rotation ? 0 : (ySpeed * elapsedTime) / 1000.0;
  }
  return { newXRot, newYRot };
}

const draw = (gl, now, lastTime, lastXRot, lastYRot, state, update) => {
  const {
    buffers,
    attributes,
    uniforms,
    textures,
  } = state;

  const {
    cubeVertexPositionBuffer,
    cubeVertexTextureCoordBuffer,
    cubeVertexIndexBuffer,
    cubeVertexBarycentricBuffer,
  } = buffers;

  const mvMatrix = mat4.create();
  const pMatrix = mat4.create();

  const {
    newXRot: xRot,
    newYRot: yRot
  } = animate(now, lastTime, lastXRot, lastYRot);

  // Calculating perspective
  mat4.perspective(pMatrix, 45, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100000.0);

  // Applying necessary tansformations to the text geometry matrix
  mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -700.0]);
  mat4.rotate(mvMatrix, mvMatrix, degToRad(xRot), [1, 0, 0]);
  mat4.rotate(mvMatrix, mvMatrix, degToRad(yRot), [0, 1, 0]);

  // Clearing the canvas to black
  // eslint-disable-next-line
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Uploading our indices to the GPU
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  // eslint-disable-next-line
  gl.vertexAttribPointer(attributes.position, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Uploading our texture coordinates to the GPU
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  // eslint-disable-next-line
  gl.vertexAttribPointer(attributes.textureCoords, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Uploading our barycentric coordinates to the GPU
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBarycentricBuffer);
  // eslint-disable-next-line
  gl.vertexAttribPointer(attributes.barycentrics, cubeVertexBarycentricBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Sending texture to the shader
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures.arial);

  // Sending Uniforms to the shader
  gl.uniform1f(uniforms.show_wireframe, document.getElementById('wireframe').checked ? 1.0 : 0.0);
  gl.uniformMatrix4fv(uniforms.proj_matrix, false, pMatrix);
  gl.uniformMatrix4fv(uniforms.mv_matrix, false, mvMatrix);

  // Enabling blend mode for correct glyph rendering
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);

  // Setting the render pipeline up to use indexed rendering
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  update();

  // Next frame queueing
  requestAnimationFrame(nextNow => draw(gl, nextNow, now, xRot, yRot, state, update));
};

export default draw;
