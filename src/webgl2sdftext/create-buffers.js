import SignedDistanceFont from './SignedDistanceFont';

export const createBuffers = (gl) => {
  const cubeVertexPositionBuffer = gl.createBuffer();
  cubeVertexPositionBuffer.itemSize = 3;

  const cubeVertexTextureCoordBuffer = gl.createBuffer();
  cubeVertexTextureCoordBuffer.itemSize = 2;

  const cubeVertexIndexBuffer = gl.createBuffer();
  cubeVertexIndexBuffer.itemSize = 1;

  const cubeVertexBarycentricBuffer = gl.createBuffer();
  cubeVertexBarycentricBuffer.itemSize = 3;

  return {
    cubeVertexPositionBuffer,
    cubeVertexTextureCoordBuffer,
    cubeVertexIndexBuffer,
    cubeVertexBarycentricBuffer
  };
};

const timePad = time => (`0${time}`).slice(-2);

export const updateBuffers = (gl, fontInfo, buffers) => {
  const {
    cubeVertexPositionBuffer,
    cubeVertexTextureCoordBuffer,
    cubeVertexIndexBuffer,
    cubeVertexBarycentricBuffer
  } = buffers;

  const d = new Date();

  const font = new SignedDistanceFont([
    'WebGL',
    'SDF Font Rendering',
    `Time: ${timePad(d.getHours())}:${timePad(d.getMinutes())}:${timePad(d.getSeconds())}`,
  ], {
    fontInfo,
    alignment: 'center',
    scale: 1,
  });

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBarycentricBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(font.mesh.barycentrics), gl.STATIC_DRAW);
  cubeVertexBarycentricBuffer.nimItems = font.mesh.barycentrics.length;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(font.mesh.indices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.numItems = font.mesh.indices.length;

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(font.mesh.textureCoords), gl.STATIC_DRAW);
  cubeVertexTextureCoordBuffer.numItems = font.mesh.textureCoords.length;

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(font.mesh.vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.numItems = font.mesh.vertices.length;

  return {
    cubeVertexPositionBuffer,
    cubeVertexTextureCoordBuffer,
    cubeVertexIndexBuffer,
    cubeVertexBarycentricBuffer
  };
};
